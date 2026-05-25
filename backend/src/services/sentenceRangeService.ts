
import type { Sentence, SentenceRange } from "../types/sentence";

export function buildSentenceRanges(
  sentences: Sentence[],
  sentencesPerRange = 100
): SentenceRange[] {
  const ranges: SentenceRange[] = [];

  for (let startIndex = 0; startIndex < sentences.length; startIndex += sentencesPerRange) {
    const rangeSentences = sentences.slice(startIndex, startIndex + sentencesPerRange);
    const enLengths = rangeSentences.map((sentence) => sentence.enCharLength);

    ranges.push({
      rangeNumber: ranges.length + 1,
      startPosition: rangeSentences[0]?.position ?? 0,
      endPosition: rangeSentences.at(-1)?.position ?? 0,
      sentenceCount: rangeSentences.length,
      minEnCharLength: Math.min(...enLengths),
      maxEnCharLength: Math.max(...enLengths)
    });
  }

  return ranges;
}
