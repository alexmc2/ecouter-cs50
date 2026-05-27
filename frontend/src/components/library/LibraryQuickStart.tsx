import { AppButton } from '../shared/AppButton';
import { AppCard } from '../shared/AppCard';

interface LibraryQuickStartProps {
  runSize: number;
  disabled?: boolean;
  onRunSizeChange: (runSize: number) => void;
  onPlay: () => void;
}

export function LibraryQuickStart({
  runSize,
  disabled = false,
  onRunSizeChange,
  onPlay,
}: LibraryQuickStartProps) {
  return (
    <AppCard className="library-quick-start">
      <strong>Quick start</strong>
      <span>Play next</span>
      <div className="pill-group" aria-label="Run size">
        {[10, 20, 50, 100].map((size) => (
          <button
            key={size}
            className={`pill ${runSize === size ? 'pill--active' : ''}`}
            onClick={() => onRunSizeChange(size)}
          >
            {size}
          </button>
        ))}
      </div>
      <AppButton variant="primary" disabled={disabled} onClick={onPlay}>
        Play
      </AppButton>
    </AppCard>
  );
}
