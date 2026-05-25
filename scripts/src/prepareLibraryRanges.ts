import fs from 'node:fs';
import path from 'node:path';

interface Sentence {
  position: number;
  enCharLength: number;
}

const projectRoot = path.resolve(process.cwd(), '..');
const inputPath = path.join(projectRoot, 'data/processed/sentences.app.json');
const outputPath = path.join(projectRoot, 'data/processed/library_ranges.json');
const sentences = JSON.parse(fs.readFileSync(inputPath, 'utf8')) as Sentence[];

const ranges = [];

for (let startIndex = 0; startIndex < sentences.length; startIndex += 100) {
  const rangeSentences = sentences.slice(startIndex, startIndex + 100);
  const lengths = rangeSentences.map((sentence) => sentence.enCharLength);

  ranges.push({
    rangeNumber: ranges.length + 1,
    startPosition: rangeSentences[0]?.position ?? 0,
    endPosition: rangeSentences.at(-1)?.position ?? 0,
    sentenceCount: rangeSentences.length,
    minEnCharLength: Math.min(...lengths),
    maxEnCharLength: Math.max(...lengths),
  });
}

fs.writeFileSync(outputPath, `${JSON.stringify(ranges, null, 2)}\n`);
console.log(`Wrote ${ranges.length} library ranges to ${outputPath}`);
