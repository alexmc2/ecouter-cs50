
import type { ListeningProfileItem } from '../../types/listeningProfile';

interface PlaybackStepDotsProps {
  steps: ListeningProfileItem[];
  activeIndex: number;
  active: boolean;
}

export function PlaybackStepDots({
  steps,
  activeIndex,
  active,
}: PlaybackStepDotsProps) {
  return (
    <div className="playback-dots" aria-label="Listening Profile steps">
      {steps.map((step, index) => (
        <span
          key={step.id}
          className={`playback-dot ${active && index === activeIndex ? 'playback-dot--active' : ''}`}
        />
      ))}
    </div>
  );
}
