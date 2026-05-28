import { useEffect, type MouseEvent } from 'react';
import type { CurrentRun } from '../../types/currentRun';
import { AppButton } from '../shared/AppButton';
import { CurrentRunListItem } from './CurrentRunListItem';

interface CurrentRunPanelProps {
  currentRun: CurrentRun | null;
  onClose: () => void;
  onRemoveSentence: (sentenceId: number) => void;
}

export function CurrentRunPanel({
  currentRun,
  onClose,
  onRemoveSentence,
}: CurrentRunPanelProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  function handleBackdropMouseDown(
    event: MouseEvent<HTMLDivElement>,
  ): void {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={handleBackdropMouseDown}
    >
      <aside
        className="queue-panel"
        aria-labelledby="current-run-panel-title"
        role="dialog"
        aria-modal="true"
      >
        <header className="queue-panel__header">
          <div>
            <p className="eyebrow">Current Run</p>
            <h2 id="current-run-panel-title">
              {currentRun?.label ?? 'No active run'}
            </h2>
          </div>
          <AppButton variant="ghost" onClick={onClose}>
            Close
          </AppButton>
        </header>

        {!currentRun || currentRun.sentences.length === 0 ? (
          <div className="state-box">
            <strong>No sentences queued</strong>
            <span>Start a run from Home or the Sentence Library.</span>
          </div>
        ) : (
          <div className="queue-panel__list">
            {currentRun.sentences.map((sentence, index) => (
              <CurrentRunListItem
                key={sentence.id}
                sentence={sentence}
                index={index}
                onRemove={onRemoveSentence}
              />
            ))}
          </div>
        )}
      </aside>
    </div>
  );
}
