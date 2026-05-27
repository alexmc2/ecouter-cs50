
import type { Sentence } from "../../types/sentence";
import { AppButton } from "../shared/AppButton";

interface SentenceListItemProps {
  sentence: Sentence;
  selected: boolean;
  onToggle: (sentenceId: number) => void;
  onPlayFromHere: (sentenceId: number) => void;
}

export function SentenceListItem({
  sentence,
  selected,
  onToggle,
  onPlayFromHere
}: SentenceListItemProps) {
  return (
    <div className={`sentence-list-item ${selected ? "sentence-list-item--selected" : ""}`}>
      <button
        className="sentence-list-item__check"
        aria-label={`Select sentence ${sentence.position}`}
        aria-pressed={selected}
        onClick={() => onToggle(sentence.id)}
      >
        {selected ? "✓" : ""}
      </button>
      <span className="sentence-list-item__position">{sentence.position}</span>
      <span className="sentence-list-item__text">
        <strong>{sentence.frText}</strong>
        <small>{sentence.enText}</small>
      </span>
      <AppButton onClick={() => onPlayFromHere(sentence.id)}>▶</AppButton>
    </div>
  );
}
