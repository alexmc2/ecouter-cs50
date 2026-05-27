
import type { Sentence, SentenceRange } from "../types/sentence";

export function buildSentenceRanges(
  sentences: Sentence[],
  sentencesPerRange = 100
): SentenceRange[] {
  const ranges: SentenceRange[] = [];

  for (let startIndex = 0; startIndex < sentences.length; startIndex += sentencesPerRange) {
    const rangeSentences = sentences.slice(startIndex, startIndex + sentencesPerRange);
    const enLengths = rangeSentences.map((sentence) => sentence.enCharLength);
    const firstSentence = rangeSentences[0];
    const lastSentence = rangeSentences.at(-1);

    ranges.push({
      rangeNumber: ranges.length + 1,
      startPosition: firstSentence?.position ?? 0,
      endPosition: lastSentence?.position ?? 0,
      sentenceCount: rangeSentences.length,
      firstFrText: firstSentence?.frText ?? "",
      lastFrText: lastSentence?.frText ?? "",
      minEnCharLength: Math.min(...enLengths),
      maxEnCharLength: Math.max(...enLengths)
    });
  }

  return ranges;
}
