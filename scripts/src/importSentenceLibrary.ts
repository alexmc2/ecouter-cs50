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

function audioUrl(id: number, folder: string, suffix: string): string {
  return `/api/audio/${folder}/${id}_${suffix}.wav`;
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
