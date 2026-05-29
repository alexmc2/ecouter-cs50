
import { AppCard } from "../shared/AppCard";

interface LibrarySummaryCardProps {
  totalSentences: number;
  completedCount: number;
  onOpenLibrary: () => void;
}

export function LibrarySummaryCard({
  totalSentences,
  completedCount,
  onOpenLibrary
}: LibrarySummaryCardProps) {
  return (
    <AppCard
      asButton
      className="home-stat-card"
      onClick={onOpenLibrary}
    >
      <div className="eyebrow">Library</div>
      <div className="home-stat-grid">
        <div>
          <strong>{totalSentences}</strong>
          <span>sentences</span>
        </div>
        <div>
          <strong>{completedCount}</strong>
          <span>completed</span>
        </div>
      </div>
      <span className="app-button app-button--secondary app-button--full">
        Open library
      </span>
    </AppCard>
  );
}
