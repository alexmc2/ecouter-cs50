import type { SentenceRange } from '../../types/sentence';
import { formatSentenceRange } from '../../utils/formatSentenceRange';
import { AppCard } from '../shared/AppCard';

interface SentenceRangeCardProps {
  range: SentenceRange;
  active: boolean;
  onSelect: (rangeNumber: number) => void;
}

export function SentenceRangeCard({
  range,
  active,
  onSelect,
}: SentenceRangeCardProps) {
  return (
    <AppCard
      asButton
      className={`sentence-range-card ${active ? 'sentence-range-card--active' : ''}`}
      onClick={() => onSelect(range.rangeNumber)}
    >
      <div>
        <strong>
          {formatSentenceRange(range.startPosition, range.endPosition)}
        </strong>
        <p className="sentence-range-card__preview">
          <span>{range.firstFrText}</span>
          <span>{range.lastFrText}</span>
        </p>
      </div>
      <span className="range-chip">Set {range.rangeNumber}</span>
    </AppCard>
  );
}
