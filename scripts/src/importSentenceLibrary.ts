// AI assisted with the creation of the sentence library import script.
import fs from 'node:fs';
import path from 'node:path';

interface SourceSentence {
  id: number;
  fra: string;
  eng: string;
  /** Uses English character count*/
  char_count: number;
}

const DEFAULT_AUDIO_PUBLIC_BASE_URL =
  'https://pub-dca31549dda047e2b97316f5ee5259d1.r2.dev';
const DEFAULT_AUDIO_ID_WIDTH = 6;

function envValue(name: string): string | undefined {
  const value = process.env[name];
  return value && value.length > 0 ? value : undefined;
}

function audioIdWidth(): number {
  const rawWidth = envValue('AUDIO_ID_WIDTH') ?? envValue('R2_AUDIO_ID_WIDTH');
  const width = rawWidth ? Number.parseInt(rawWidth, 10) : DEFAULT_AUDIO_ID_WIDTH;

  if (!Number.isFinite(width) || width < 1) {
    return DEFAULT_AUDIO_ID_WIDTH;
  }

  return width;
}

function audioPublicBaseUrl(): string {
  return (
    envValue('AUDIO_PUBLIC_BASE_URL') ??
    envValue('R2_PUBLIC_BASE_URL') ??
    DEFAULT_AUDIO_PUBLIC_BASE_URL
  ).replace(/\/+$/, '');
}

function audioPublicPrefix(): string {
  return (envValue('AUDIO_R2_PREFIX') ?? envValue('R2_PREFIX') ?? '').replace(
    /^\/+|\/+$/g,
    '',
  );
}

function audioFilename(id: number, suffix: string): string {
  return `${String(id).padStart(audioIdWidth(), '0')}_${suffix}.wav`;
}

function audioUrl(id: number, folder: string, suffix: string): string {
  const prefix = audioPublicPrefix();
  const path = prefix
    ? `${prefix}/${folder}/${audioFilename(id, suffix)}`
    : `${folder}/${audioFilename(id, suffix)}`;

  return `${audioPublicBaseUrl()}/${path}`;
}

const projectRoot = path.resolve(process.cwd(), '..');
const rawPath = path.join(projectRoot, 'data/raw/sentences.json');
const outputPath = path.join(projectRoot, 'data/processed/sentences.app.json');
const sourceSentences = JSON.parse(
  fs.readFileSync(rawPath, 'utf8'),
) as SourceSentence[];

const appSentences = sourceSentences.map((sentence, index) => ({
  id: sentence.id,
  frText: sentence.fra,
  enText: sentence.eng,
  enCharLength: sentence.char_count,
  position: index + 1,
  frFemaleAudioUrl: audioUrl(sentence.id, 'fr_f', 'fr_f'),
  frMaleAudioUrl: audioUrl(sentence.id, 'fr_m', 'fr_m'),
  enFemaleAudioUrl: audioUrl(sentence.id, 'en_f', 'en_f'),
  enMaleAudioUrl: audioUrl(sentence.id, 'en_m', 'en_m'),
}));

fs.writeFileSync(outputPath, `${JSON.stringify(appSentences, null, 2)}\n`);
console.log(`Wrote ${appSentences.length} sentences to ${outputPath}`);
