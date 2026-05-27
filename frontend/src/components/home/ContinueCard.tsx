import { AppCard } from '../shared/AppCard';
import { ProgressBar } from '../shared/ProgressBar';

interface ContinueCardProps {
  lastPosition: number;
  totalSentences: number;
  disabled?: boolean;
  onContinue: () => void;
}

export function ContinueCard({
  lastPosition,
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
      <span>Next 20 sentences</span>
      <ProgressBar value={lastPosition} max={totalSentences} />
    </AppCard>
  );
}
