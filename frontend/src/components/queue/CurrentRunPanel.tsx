import type { CurrentRun } from '../../types/currentRun';
import { AppButton } from '../shared/AppButton';

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
  return (
    <div className="modal-backdrop" role="presentation">
      <aside
        className="current-run-panel"
        aria-labelledby="current-run-panel-title"
        role="dialog"
        aria-modal="true"
      >
        <header className="panel-header">
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
          <div className="current-run-list">
            {currentRun.sentences.map((sentence, index) => (
              <article className="current-run-item" key={sentence.id}>
                <span className="current-run-item__index">{index + 1}</span>
                <div className="current-run-item__text">
                  <strong>{sentence.frText}</strong>
                  <span>{sentence.enText}</span>
                </div>
                <AppButton
                  variant="ghost"
                  onClick={() => onRemoveSentence(sentence.id)}
                >
                  Remove
                </AppButton>
              </article>
            ))}
          </div>
        )}
      </aside>
    </div>
  );
}
