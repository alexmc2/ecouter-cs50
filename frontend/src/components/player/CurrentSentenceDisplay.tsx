
import type { Sentence } from '../../types/sentence';
import type { ListeningProfileItem } from '../../types/listeningProfile';

interface CurrentSentenceDisplayProps {
  runLabel: string;
  sentence: Sentence | null;
  currentSentenceIndex: number;
  totalSentences: number;
  currentStep: ListeningProfileItem | null;
  showFrench: boolean;
  showEnglish: boolean;
}

export function CurrentSentenceDisplay({
  runLabel,
  sentence,
  currentSentenceIndex,
  totalSentences,
  showFrench,
  showEnglish,
}: CurrentSentenceDisplayProps) {
  return (
    <section className="current-sentence">
      <div className="eyebrow">{runLabel}</div>
      <div className="current-sentence__number">{currentSentenceIndex + 1}</div>
      <div className="current-sentence__meta">
        of {totalSentences} · sentence {sentence?.id ?? 'none'}
      </div>

      <div className="reveal-panel" aria-live="polite">
        {showFrench && sentence ? <strong>{sentence.frText}</strong> : null}
        {showEnglish && sentence ? <span>{sentence.enText}</span> : null}
      </div>
    </section>
  );
}
