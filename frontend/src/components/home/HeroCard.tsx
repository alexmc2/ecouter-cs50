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
      <div className="home-hero__identity" aria-label="écouter">
        <div className="app-logo app-logo--compact">écouter</div>
        <div className="app-tagline">French Listening Trainer</div>
      </div>
      <h1>Improve your French listening skills through repetition.</h1>
      <p>
        Écouter is based on{' '}
        <a
          href="https://escholarship.org/uc/item/91c921b9"
          target="_blank"
          rel="noopener noreferrer"
          className="home-hero__research-link"
        >
          research
        </a>{' '}
        into second-language listening which shows that learners often struggle
        not because they do not know the words, but because they cannot reliably
        recognise them in fluent speech.
      </p>
      <p>
        Using short repeated sentences, pauses, and optional text reveals,
        Écouter is designed to help learners practise aural decoding:
        identifying sounds, word boundaries, and known words in connected
        speech.
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
