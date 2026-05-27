
import type { CSSProperties } from "react";

interface ProgressBarProps {
  value: number;
  max: number;
}

export function ProgressBar({ value, max }: ProgressBarProps) {
  const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  return (
    <div className="progress-bar" aria-hidden="true">
      <div
        className="progress-bar__fill"
        style={{ "--progress-value": `${percent}%` } as CSSProperties}
      />
    </div>
  );
}
