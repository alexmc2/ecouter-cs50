import type { Sentence } from '../../types/sentence';
import type { ListeningProfileItem } from '../../types/listeningProfile';

interface CurrentSentenceDisplayProps {
  sentence: Sentence | null;
  currentSentenceIndex: number;
  totalSentences: number;
  currentStep: ListeningProfileItem | null;
}

interface PlaybackStage {
  detail: string;
  label: string;
}

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

function getSetNumber(sentence: Sentence | null): number | null {
  if (!sentence) {
    return null;
  }

  return Math.floor((sentence.position - 1) / 100) + 1;
}

export function CurrentSentenceDisplay({
  sentence,
  currentSentenceIndex,
  totalSentences,
  currentStep,
}: CurrentSentenceDisplayProps) {
  const stage = getPlaybackStage(currentStep);
  const displayIndex = totalSentences > 0 ? currentSentenceIndex + 1 : 0;
  const setNumber = getSetNumber(sentence);

  return (
    <section className="current-sentence" aria-live="polite">
      <div className="current-sentence__status">
        <span className="current-sentence__kicker">Now playing</span>
        <strong className="current-sentence__stage">
          {stage.label} · {stage.detail}
        </strong>
      </div>
      <div className="current-sentence__meta">
        <span className="current-sentence__position">
          Sentence {displayIndex} / {totalSentences}
        </span>
        <span className="current-sentence__library">
          {setNumber ? `Set ${setNumber}` : 'No set loaded'}
        </span>
      </div>
    </section>
  );
}
