import { AppCard } from '../shared/AppCard';

interface LibraryQuickStartProps {
  runSize: number;
  onRunSizeChange: (runSize: number) => void;
}

export function LibraryQuickStart({
  runSize,
  onRunSizeChange,
}: LibraryQuickStartProps) {
  return (
    <AppCard className="library-quick-start">
      <div className="library-quick-start__label">
        <strong>Quick start</strong>
        <span>Play next</span>
      </div>
      <div className="pill-group" aria-label="Run size">
        {[10, 20, 50, 100].map((size) => (
          <button
            key={size}
            className={`pill ${runSize === size ? 'pill--active pill--filled' : ''}`}
            onClick={() => onRunSizeChange(size)}
          >
            {size}
          </button>
        ))}
      </div>
    </AppCard>
  );
}
