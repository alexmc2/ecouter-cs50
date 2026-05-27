interface HeroCardProps {
  onStartListening: () => void;
  onBrowseSentences: () => void;
}

export function HeroCard({ onStartListening, onBrowseSentences }: HeroCardProps) {
  return (
    <section >
      <h1>Train your French ear through repetition.</h1>
      <p>Turn spoken French from a blur into recognisable sounds.</p>
      <div >
        <button type="button" onClick={onStartListening}>
          Start listening
        </button>
        <button type="button" onClick={onBrowseSentences}>
          Browse sentences
        </button>
      </div>
    </section>
  );
}
