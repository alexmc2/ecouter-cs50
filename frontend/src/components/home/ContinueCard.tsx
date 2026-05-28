import { AppCard } from '../shared/AppCard';
import { ProgressBar } from '../shared/ProgressBar';

interface ContinueCardProps {
  lastPosition: number;
  runSize: number;
  totalSentences: number;
  disabled?: boolean;
  onContinue: () => void;
}

export function ContinueCard({
  lastPosition,
  runSize,
  totalSentences,
  disabled = false,
  onContinue,
}: ContinueCardProps) {
  return (
    <AppCard
      asButton
      className="home-stat-card"
      disabled={disabled}
      onClick={onContinue}
    >
      <div className="eyebrow">Continue</div>
      <strong>From sentence {lastPosition}</strong>
      <span>
        Next {runSize} sentence{runSize === 1 ? '' : 's'}
      </span>
      <ProgressBar value={lastPosition} max={totalSentences} />
    </AppCard>
  );
}
