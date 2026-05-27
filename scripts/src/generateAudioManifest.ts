// AI assisted with the creation of the audio manifest generation script.
import fs from 'node:fs';
import path from 'node:path';

interface Sentence {
  id: number;
}

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

function audioFilename(id: number, suffix: string): string {
  return `${String(id).padStart(audioIdWidth(), '0')}_${suffix}.wav`;
}

function expectedFiles(id: number) {
  return {
    fr_female: `fr_f/${audioFilename(id, 'fr_f')}`,
    fr_male: `fr_m/${audioFilename(id, 'fr_m')}`,
    en_female: `en_f/${audioFilename(id, 'en_f')}`,
    en_male: `en_m/${audioFilename(id, 'en_m')}`,
  };
}

const projectRoot = path.resolve(process.cwd(), '..');
const inputPath = path.join(projectRoot, 'data/processed/sentences.app.json');
const outputPath = path.join(
  projectRoot,
  'data/audio-manifests/expected_audio.json',
);
const sentences = JSON.parse(fs.readFileSync(inputPath, 'utf8')) as Sentence[];
const manifest = sentences.map((sentence) => ({
  sentenceId: sentence.id,
  files: expectedFiles(sentence.id),
}));

fs.writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Wrote expected audio manifest for ${manifest.length} sentences`);
