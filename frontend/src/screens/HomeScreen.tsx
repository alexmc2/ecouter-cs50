import { ContinueCard } from '../components/home/ContinueCard';
import { HeroCard } from '../components/home/HeroCard';
import { LibrarySummaryCard } from '../components/home/LibrarySummaryCard';

interface HomeScreenProps {
  lastPosition: number;
  totalSentences: number;
  startListeningDisabled?: boolean;
  onStartListening: () => void;
  onBrowseSentences: () => void;
}

export function HomeScreen({
  lastPosition,
  totalSentences,
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
          totalSentences={totalSentences}
          disabled={startListeningDisabled}
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
