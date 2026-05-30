// AI assisted with the creation of the audio coverage check script.
import fs from 'node:fs';
import path from 'node:path';
import { audioPublicUrl, envValue } from './audioConfig';

interface ManifestItem {
  sentenceId: number;
  files: Record<string, string>;
}

interface AppSentence {
  id: number;
  frFemaleAudioUrl?: string;
  frMaleAudioUrl?: string;
  enFemaleAudioUrl?: string;
  enMaleAudioUrl?: string;
}

type AudioUrlField = Exclude<keyof AppSentence, 'id'>;

interface AudioCheck {
  sentenceId: number;
  source: string;
  file: string;
}

interface CoverageIssue extends AudioCheck {
  actualUrl?: string;
  expectedUrl?: string;
  issue: string;
}

type CoverageMode = 'json' | 'local';

const AUDIO_URL_FIELDS: Record<string, AudioUrlField> = {
  en_female: 'enFemaleAudioUrl',
  en_male: 'enMaleAudioUrl',
  fr_female: 'frFemaleAudioUrl',
  fr_male: 'frMaleAudioUrl',
};

const projectRoot = path.resolve(process.cwd(), '..');
const manifestPath = path.join(
  projectRoot,
  'data/audio-manifests/expected_audio.json',
);
const processedSentencesPath = path.join(
  projectRoot,
  'data/processed/sentences.app.json',
);

function coverageMode(): CoverageMode {
  const rawMode = envValue('AUDIO_COVERAGE_MODE')?.toLowerCase();

  if (rawMode === 'json' || rawMode === 'local') {
    return rawMode;
  }

  if (rawMode) {
    console.warn(
      `Unknown AUDIO_COVERAGE_MODE "${rawMode}", using JSON coverage.`,
    );
  }

  return 'json';
}

function localAudioRoot(): string {
  return envValue('AUDIO_ROOT_PATH') ?? path.join(projectRoot, 'data/audio');
}

function expectedAudioChecks(manifest: ManifestItem[]): AudioCheck[] {
  return manifest.flatMap((item) =>
    Object.entries(item.files).map(([source, file]) => ({
      sentenceId: item.sentenceId,
      source,
      file,
    })),
  );
}

function printIssues(issues: CoverageIssue[]): void {
  console.log(`Found ${issues.length} audio coverage issues.`);
  console.log(JSON.stringify(issues.slice(0, 50), null, 2));
}

function checkLocalCoverage(checks: AudioCheck[]): CoverageIssue[] {
  const audioRoot = localAudioRoot();

  console.log(`Checking ${checks.length} expected audio files in ${audioRoot}`);

  return checks
    .filter(({ file }) => !fs.existsSync(path.join(audioRoot, file)))
    .map((check) => ({
      ...check,
      issue: 'Local audio file is missing.',
    }));
}

function checkJsonCoverage(
  checks: AudioCheck[],
  appSentences: AppSentence[],
): CoverageIssue[] {
  const sentenceById = new Map(
    appSentences.map((sentence) => [sentence.id, sentence]),
  );
  const issues: CoverageIssue[] = [];

  console.log(
    `Checking ${checks.length} expected audio URL references in ${processedSentencesPath}`,
  );

  for (const check of checks) {
    const sentence = sentenceById.get(check.sentenceId);
    const urlField = AUDIO_URL_FIELDS[check.source];
    const expectedUrl = audioPublicUrl(check.file);

    if (!urlField) {
      issues.push({
        ...check,
        expectedUrl,
        issue: `No app sentence URL field is mapped for source "${check.source}".`,
      });
      continue;
    }

    if (!sentence) {
      issues.push({
        ...check,
        expectedUrl,
        issue: 'Sentence is missing from the processed app library.',
      });
      continue;
    }

    const actualUrl = sentence[urlField];

    if (actualUrl !== expectedUrl) {
      issues.push({
        ...check,
        actualUrl,
        expectedUrl,
        issue: `Processed sentence URL field "${String(urlField)}" does not match the expected audio URL.`,
      });
    }
  }

  return issues;
}

function main(): void {
  const manifest = JSON.parse(
    fs.readFileSync(manifestPath, 'utf8'),
  ) as ManifestItem[];
  const checks = expectedAudioChecks(manifest);

  const issues =
    coverageMode() === 'local'
      ? checkLocalCoverage(checks)
      : checkJsonCoverage(
          checks,
          JSON.parse(
            fs.readFileSync(processedSentencesPath, 'utf8'),
          ) as AppSentence[],
        );

  if (issues.length === 0) {
    console.log('All expected audio URL references are present.');
  } else {
    printIssues(issues);
  }
}

main();
