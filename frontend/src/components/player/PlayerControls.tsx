import { AppButton } from '../shared/AppButton';

interface PlayerControlsProps {
  isPlaying: boolean;
  loopRun: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onTogglePlaying: () => void;
  onToggleLoop: () => void;
}

export function PlayerControls({
  isPlaying,
  loopRun,
  onPrevious,
  onNext,
  onTogglePlaying,
  onToggleLoop,
}: PlayerControlsProps) {
  return (
    <footer className="player-controls">
      <div className="player-controls__transport">
        <button
          className="transport-button"
          onClick={onPrevious}
          aria-label="Previous sentence"
        >
          <span className="skip-icon skip-icon--previous" aria-hidden="true">
            <span className="skip-icon__bar" />
            <span className="skip-icon__triangle" />
            <span className="skip-icon__triangle" />
          </span>
        </button>
        <button
          className={`play-button ${isPlaying ? 'play-button--playing' : ''}`}
          onClick={onTogglePlaying}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          <span className="play-button__icon" aria-hidden="true">
            <span
              className={`play-symbol ${
                isPlaying ? 'play-symbol--pause' : 'play-symbol--play'
              }`}
            />
          </span>
        </button>
        <button
          className="transport-button"
          onClick={onNext}
          aria-label="Next sentence"
        >
          <span className="skip-icon skip-icon--next" aria-hidden="true">
            <span className="skip-icon__bar" />
            <span className="skip-icon__triangle" />
            <span className="skip-icon__triangle" />
          </span>
        </button>
      </div>
      <div className="player-controls__secondary">
        <AppButton variant="ghost" onClick={onToggleLoop}>
          {loopRun ? 'Loop current run' : 'Loop off'}
        </AppButton>
      </div>
    </footer>
  );
}
