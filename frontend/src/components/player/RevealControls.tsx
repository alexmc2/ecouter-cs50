
interface RevealControlsProps {
  englishText: string | null;
  frenchText: string | null;
  showFrench: boolean;
  showEnglish: boolean;
  onToggleFrench: () => void;
  onToggleEnglish: () => void;
}

export function RevealControls({
  englishText,
  frenchText,
  showFrench,
  showEnglish,
  onToggleFrench,
  onToggleEnglish
}: RevealControlsProps) {
  return (
    <div className="reveal-controls" aria-label="Sentence text">
      <button
        className={`reveal-card ${showFrench ? 'reveal-card--active' : ''}`}
        onClick={onToggleFrench}
        aria-pressed={showFrench}
      >
        <span className="reveal-card__header">
          <span>French</span>
          <small>{showFrench ? 'Hide' : 'Reveal'}</small>
        </span>
        <strong className="reveal-card__text">
          {showFrench && frenchText ? frenchText : 'Hidden'}
        </strong>
      </button>
      <button
        className={`reveal-card ${showEnglish ? 'reveal-card--active' : ''}`}
        onClick={onToggleEnglish}
        aria-pressed={showEnglish}
      >
        <span className="reveal-card__header">
          <span>English</span>
          <small>{showEnglish ? 'Hide' : 'Reveal'}</small>
        </span>
        <strong className="reveal-card__text">
          {showEnglish && englishText ? englishText : 'Hidden'}
        </strong>
      </button>
    </div>
  );
}
