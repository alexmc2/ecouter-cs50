import { ContinueCard } from '../components/home/ContinueCard';
import { HeroCard } from '../components/home/HeroCard';
import { LibrarySummaryCard } from '../components/home/LibrarySummaryCard';

interface HomeScreenProps {
  lastPosition: number;
  defaultRunSize: number;
  totalSentences: number;
  completedCount: number;
  startListeningDisabled?: boolean;
  onStartListening: () => void;
  onBrowseSentences: () => void;
}

export function HomeScreen({
  lastPosition,
  defaultRunSize,
  totalSentences,
  completedCount,
  startListeningDisabled = false,
  onStartListening,
  onBrowseSentences,
}: HomeScreenProps) {
  return (
    <main className="screen home-screen">
      <HeroCard
        onStartListening={onStartListening}
        onBrowseSentences={onBrowseSentences}
        startListeningDisabled={startListeningDisabled}
      />
      <section className="home-screen__secondary" aria-label="Home actions">
        <ContinueCard
          lastPosition={lastPosition}
          runSize={defaultRunSize}
          totalSentences={totalSentences}
          disabled={startListeningDisabled}
          onContinue={onStartListening}
        />
        <LibrarySummaryCard
          totalSentences={totalSentences}
          completedCount={completedCount}
          onOpenLibrary={onBrowseSentences}
        />
      </section>
    </main>
  );
}
