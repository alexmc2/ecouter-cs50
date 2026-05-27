
import { AppButton } from "../shared/AppButton";
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
    <AppCard className="home-stat-card">
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
      <AppButton className="app-button--full" onClick={onOpenLibrary}>
        Open library
      </AppButton>
    </AppCard>
  );
}
