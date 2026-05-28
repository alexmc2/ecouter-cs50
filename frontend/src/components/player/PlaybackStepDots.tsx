
import type { ListeningProfileItem } from '../../types/listeningProfile';

interface PlaybackStepDotsProps {
  steps: ListeningProfileItem[];
  activeIndex: number;
  active: boolean;
  onSelectStep: (index: number) => void;
}

export function PlaybackStepDots({
  steps,
  activeIndex,
  active,
  onSelectStep,
}: PlaybackStepDotsProps) {
  return (
    <div className="playback-dots" aria-label="Listening Profile steps">
      {steps.map((step, index) => (
        <button
          type="button"
          key={step.id}
          className={`playback-dot ${active && index === activeIndex ? 'playback-dot--active' : ''}`}
          onClick={() => onSelectStep(index)}
          aria-current={active && index === activeIndex ? 'step' : undefined}
          aria-label={`Go to ${step.label}, step ${index + 1} of ${steps.length}`}
          title={`${step.label} - step ${index + 1}`}
        />
      ))}
    </div>
  );
}
