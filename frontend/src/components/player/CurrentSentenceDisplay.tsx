import type { ListeningProfileItem } from '../../types/listeningProfile';

interface CurrentSentenceDisplayProps {
  currentStep: ListeningProfileItem | null;
}

interface PlaybackStage {
  detail: string;
  label: string;
}

// displays the current item (sentence or pause) being played in the player.
function getPlaybackStage(step: ListeningProfileItem | null): PlaybackStage {
  if (!step) {
    return {
      detail: 'Ready',
      label: 'Ready',
    };
  }

  if (step.type === 'pause') {
    return {
      detail: `${step.durationMs / 1000}s`,
      label: 'Pause',
    };
  }

  const isFrench = step.source.startsWith('fr');
  const voice = step.source.endsWith('female') ? 'Female voice' : 'Male voice';

  return {
    detail: voice,
    label: isFrench ? 'French' : 'English',
  };
}

export function CurrentSentenceDisplay({
  currentStep,
}: CurrentSentenceDisplayProps) {
  const stage = getPlaybackStage(currentStep);

  return (
    <section className="current-sentence" aria-live="polite">
      <div className="current-sentence__status">
        <span className="current-sentence__kicker">Now playing</span>
        <strong className="current-sentence__stage">
          {stage.label}
          {stage.detail !== stage.label ? <span> · {stage.detail}</span> : null}
        </strong>
      </div>
    </section>
  );
}
