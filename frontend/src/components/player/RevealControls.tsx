
import { AppButton } from "../shared/AppButton";

interface RevealControlsProps {
  showFrench: boolean;
  showEnglish: boolean;
  onToggleFrench: () => void;
  onToggleEnglish: () => void;
}

// reveals the French and English text for the sentence being played. 

export function RevealControls({
  showFrench,
  showEnglish,
  onToggleFrench,
  onToggleEnglish
}: RevealControlsProps) {
  return (
    <div className="reveal-controls">
      <AppButton onClick={onToggleFrench}>
        {showFrench ? "Hide French" : "Reveal French"}
      </AppButton>
      <AppButton onClick={onToggleEnglish}>
        {showEnglish ? "Hide English" : "Reveal English"}
      </AppButton>
    </div>
  );
}
