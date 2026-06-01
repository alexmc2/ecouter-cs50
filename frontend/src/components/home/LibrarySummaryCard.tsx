
import { AppCard } from '../shared/AppCard';

interface LibrarySummaryCardProps {
  totalSentences: number;
  completedCount: number;
}

export function LibrarySummaryCard({
  totalSentences,
  completedCount,
}: LibrarySummaryCardProps) {
  return (
    <AppCard className="home-stat-card">
      <div className="eyebrow">Library</div>
      <strong>{completedCount}</strong>
      <span>
        completed of {totalSentences} sentence
        {totalSentences === 1 ? '' : 's'}
      </span>
    </AppCard>
  );
}
