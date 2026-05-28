import { AppButton } from '../shared/AppButton';
import { AppCard } from '../shared/AppCard';

interface HeroCardProps {
  onStartListening: () => void;
  onBrowseSentences: () => void;
  startListeningDisabled?: boolean;
}

export function HeroCard({
  onStartListening,
  onBrowseSentences,
  startListeningDisabled = false,
}: HeroCardProps) {
  return (
    <AppCard className="home-hero">
      <h1>Learn to understand spoken French through repetition.</h1>
      <p>
        Écouter helps you turn spoken French from a blur into recognisable
        sounds.
      </p>
      <div className="home-hero__actions">
        <AppButton
          variant="primary"
          disabled={startListeningDisabled}
          onClick={onStartListening}
        >
          Start listening
        </AppButton>
        <AppButton onClick={onBrowseSentences}>Browse sentences</AppButton>
      </div>
    </AppCard>
  );
}
