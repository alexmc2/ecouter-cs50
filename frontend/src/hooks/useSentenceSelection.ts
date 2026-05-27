
import { useState } from "react";

export function useSentenceSelection() {
  const [selectedSentenceIds, setSelectedSentenceIds] = useState<Set<number>>(
    () => new Set()
  );

  function toggleSentence(sentenceId: number): void {
    setSelectedSentenceIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if (nextIds.has(sentenceId)) {
        nextIds.delete(sentenceId);
      } else {
        nextIds.add(sentenceId);
      }

      return nextIds;
    });
  }

  function selectMany(sentenceIds: number[]): void {
    setSelectedSentenceIds((currentIds) => {
      const nextIds = new Set(currentIds);

      sentenceIds.forEach((sentenceId) => nextIds.add(sentenceId));

      return nextIds;
    });
  }

  function clearSelection(): void {
    setSelectedSentenceIds(new Set());
  }

  return {
    selectedSentenceIds,
    selectedCount: selectedSentenceIds.size,
    toggleSentence,
    selectMany,
    clearSelection
  };
}
