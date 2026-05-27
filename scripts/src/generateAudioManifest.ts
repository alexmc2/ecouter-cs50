// AI assisted with the creation of the audio manifest generation script.
import fs from 'node:fs';
import path from 'node:path';

interface Sentence {
  id: number;
}

function expectedFiles(id: number) {
  return {
    fr_female: `fr_f/${id}_fr_f.wav`,
    fr_male: `fr_m/${id}_fr_m.wav`,
    en_female: `en_f/${id}_en_f.wav`,
    en_male: `en_m/${id}_en_m.wav`,
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
