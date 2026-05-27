
import { AppButton } from "../shared/AppButton";

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
  onToggleLoop
}: PlayerControlsProps) {
  return (
    <footer className="player-controls">
      <div className="player-controls__transport">
        <button className="transport-button" onClick={onPrevious} aria-label="Previous sentence">
          ⏮
        </button>
        <button className="play-button" onClick={onTogglePlaying} aria-label="Play or pause">
          {isPlaying ? "⏸" : "▶"}
        </button>
        <button className="transport-button" onClick={onNext} aria-label="Next sentence">
          ⏭
        </button>
      </div>
      <div className="player-controls__secondary">
        <AppButton variant="ghost" onClick={onToggleLoop}>
          {loopRun ? "↻ Loop current run" : "Loop off"}
        </AppButton>
      </div>
    </footer>
  );
}
