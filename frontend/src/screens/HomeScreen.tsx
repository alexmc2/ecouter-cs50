import { HeroCard } from '../components/home/HeroCard';

interface HomeScreenProps {
  lastPosition: number;
  totalSentences: number;
  startListeningDisabled?: boolean;
  onStartListening: () => void;
  onBrowseSentences: () => void;
}

export function HomeScreen({
  startListeningDisabled = false,
  onStartListening,
  onBrowseSentences,
}: HomeScreenProps) {
  return (
    <main>
      <HeroCard
        onStartListening={onStartListening}
        onBrowseSentences={onBrowseSentences}
        startListeningDisabled={startListeningDisabled}
      />
    </main>
  );
}
