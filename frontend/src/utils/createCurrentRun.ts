import type { CurrentRun } from '../types/currentRun';
import type { Sentence } from '../types/sentence';

function createRunId(): string {
  return `run-${Date.now()}`;
}

export function createCurrentRunFromSelection(
  sentences: Sentence[],
  selectedIds: Iterable<number>,
): CurrentRun {
  const selectedIdSet =
    selectedIds instanceof Set ? selectedIds : new Set(selectedIds);
  const runSentences = sentences.filter((sentence) =>
    selectedIdSet.has(sentence.id),
  );

  return {
    id: createRunId(),
    label: `${runSentences.length} selected sentence${runSentences.length === 1 ? '' : 's'}`,
    sentences: runSentences,
    createdAt: new Date().toISOString(),
  };
}

export function createStarterCurrentRun(
  sentences: Sentence[],
  limit: number,
): CurrentRun {
  const runSentences = sentences.slice(0, limit);

  return {
    id: createRunId(),
    label: `Next ${runSentences.length} sentences`,
    sentences: runSentences,
    createdAt: new Date().toISOString(),
  };
}
