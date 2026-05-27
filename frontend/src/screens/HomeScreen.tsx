
import { ContinueCard } from '../components/home/ContinueCard';
import { HeroCard } from '../components/home/HeroCard';
import { LibrarySummaryCard } from '../components/home/LibrarySummaryCard';

interface HomeScreenProps {
  lastPosition: number;
  totalSentences: number;
  onStartListening: () => void;
  onBrowseSentences: () => void;
}

export function HomeScreen({
  lastPosition,
  totalSentences,
  onStartListening,
  onBrowseSentences,
}: HomeScreenProps) {
  return (
    <main>
      <HeroCard
        onStartListening={onStartListening}
        onBrowseSentences={onBrowseSentences}
      />
      <section>
        <ContinueCard
          lastPosition={lastPosition}
          totalSentences={totalSentences}
          onContinue={onStartListening}
        />
        <LibrarySummaryCard
          totalSentences={totalSentences}
          completedCount={0}
          onOpenLibrary={onBrowseSentences}
        />
      </section>
    </main>
  );
}
