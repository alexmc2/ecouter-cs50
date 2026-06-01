import { HeroCard } from '../components/home/HeroCard';

interface HomeScreenProps {
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
    <main className="screen home-screen">
      <HeroCard
        onStartListening={onStartListening}
        onBrowseSentences={onBrowseSentences}
        startListeningDisabled={startListeningDisabled}
      />
    </main>
  );
}
