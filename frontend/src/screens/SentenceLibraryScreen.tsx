
import { useState } from 'react';
import { LibraryQuickStart } from '../components/library/LibraryQuickStart';
import { SelectionToolbar } from '../components/library/SelectionToolbar';
import { SentenceListItem } from '../components/library/SentenceListItem';
import { SentenceRangeCard } from '../components/library/SentenceRangeCard';
import { AppButton } from '../components/shared/AppButton';
import type { CurrentRun } from '../types/currentRun';
import { useSentenceRanges } from '../hooks/useSentenceRanges';
import { useSentenceSelection } from '../hooks/useSentenceSelection';
import { useSentences } from '../hooks/useSentences';
import {
  createCurrentRunFromSelection,
  createStarterCurrentRun,
} from '../utils/createCurrentRun';
import { EmptyState } from '../components/shared/EmptyState';
import { ErrorState } from '../components/shared/ErrorState';
import { LoadingState } from '../components/shared/LoadingState';

const SENTENCES_PER_RANGE = 100;

interface SentenceLibraryScreenProps {
  onStartRun: (run: CurrentRun) => void;
}

export function SentenceLibraryScreen({
  onStartRun,
}: SentenceLibraryScreenProps) {
  const [activeRangeNumber, setActiveRangeNumber] = useState<number | null>(
    null,
  );
  const [runSize, setRunSize] = useState(20);
  const sentenceRanges = useSentenceRanges();
  const starterSentences = useSentences(1, runSize, true);
  const rangeSentences = useSentences(
    activeRangeNumber ?? 1,
    SENTENCES_PER_RANGE,
    activeRangeNumber !== null,
  );
  const {
    selectedSentenceIds,
    selectedCount,
    toggleSentence,
    selectMany,
    clearSelection,
  } = useSentenceSelection();

  const visibleSentences =
    activeRangeNumber === null ? [] : (rangeSentences.data?.items ?? []);

  function showRange(rangeNumber: number): void {
    clearSelection();
    setActiveRangeNumber(rangeNumber);
  }

  function showRanges(): void {
    clearSelection();
    setActiveRangeNumber(null);
  }

  function playSelected(): void {
    const run = createCurrentRunFromSelection(
      visibleSentences,
      selectedSentenceIds,
    );
    onStartRun(run);
  }

  function playStarterRun(): void {
    if (!starterSentences.data || starterSentences.data.items.length === 0) {
      return;
    }

    onStartRun(createStarterCurrentRun(starterSentences.data.items, runSize));
  }

  function playVisibleSentences(): void {
    if (visibleSentences.length === 0) {
      return;
    }

    onStartRun(
      createStarterCurrentRun(visibleSentences, visibleSentences.length),
    );
  }

  function playFromSentence(sentenceId: number): void {
    const startIndex = visibleSentences.findIndex(
      (sentence) => sentence.id === sentenceId,
    );
    const run = createStarterCurrentRun(
      visibleSentences.slice(Math.max(0, startIndex)),
      runSize,
    );
    onStartRun({ ...run, label: `From sentence ${sentenceId}` });
  }

  return (
    <main className="screen library-screen">
      <div className="screen-heading">
        <h1>Sentence Library</h1>
        <p>
          Browse the library, select specific sentences, or start from wherever
          you like.
        </p>
      </div>

      <LibraryQuickStart
        runSize={runSize}
        onRunSizeChange={setRunSize}
        disabled={
          starterSentences.loading ||
          Boolean(starterSentences.error) ||
          !starterSentences.data?.items.length
        }
        onPlay={playStarterRun}
      />

      <SelectionToolbar
        selectedCount={selectedCount}
        onClear={clearSelection}
        onPlaySelected={playSelected}
      />

      {activeRangeNumber === null ? (
        <section className="library-range-grid" aria-label="Sentence ranges">
          {sentenceRanges.loading ? (
            <LoadingState message="Loading sentence ranges..." />
          ) : sentenceRanges.error ? (
            <ErrorState message={sentenceRanges.error} />
          ) : sentenceRanges.data.length === 0 ? (
            <EmptyState
              title="No ranges found"
              message="The sentence library did not return any ranges."
            />
          ) : (
            sentenceRanges.data.map((range) => (
              <SentenceRangeCard
                key={range.rangeNumber}
                range={range}
                active={activeRangeNumber === range.rangeNumber}
                onSelect={showRange}
              />
            ))
          )}
        </section>
      ) : (
        <section className="library-range">
          <div className="library-range__header">
            <AppButton variant="ghost" onClick={showRanges}>
              ← Back 
            </AppButton>
            <div className="library-range__actions">
              <AppButton
                disabled={
                  rangeSentences.loading || visibleSentences.length === 0
                }
                onClick={() =>
                  selectMany(visibleSentences.map((sentence) => sentence.id))
                }
              >
                Select all
              </AppButton>
              <AppButton
                variant="primary"
                disabled={
                  rangeSentences.loading || visibleSentences.length === 0
                }
                onClick={playVisibleSentences}
              >
                Play all
              </AppButton>
            </div>
          </div>
          {rangeSentences.loading ? (
            <LoadingState message="Loading sentences..." />
          ) : rangeSentences.error ? (
            <ErrorState message={rangeSentences.error} />
          ) : visibleSentences.length === 0 ? (
            <EmptyState
              title="No sentences found"
              message="This range did not return any sentences."
            />
          ) : (
            <div className="sentence-list">
              {visibleSentences.map((sentence) => (
                <SentenceListItem
                  key={sentence.id}
                  sentence={sentence}
                  selected={selectedSentenceIds.has(sentence.id)}
                  onToggle={toggleSentence}
                  onPlayFromHere={playFromSentence}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}
