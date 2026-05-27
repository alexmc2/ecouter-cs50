interface LibrarySummaryCardProps {
  totalSentences: number;
  completedCount: number;
  onOpenLibrary: () => void;
}

export function LibrarySummaryCard({
  totalSentences,
  completedCount,
  onOpenLibrary,
}: LibrarySummaryCardProps) {
  return (
    <section className="home-stat-card">
      <div>
        <div>
          <strong>{totalSentences}</strong>
          <span>sentences</span>
        </div>
        <div>
          <strong>{completedCount}</strong>
          <span>completed</span>
        </div>
      </div>
      <button type="button" onClick={onOpenLibrary}>
        Open library
      </button>
    </section>
  );
}
