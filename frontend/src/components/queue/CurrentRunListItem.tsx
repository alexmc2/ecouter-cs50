
import type { Sentence } from "../../types/sentence";

interface CurrentRunListItemProps {
  sentence: Sentence;
  index: number;
  onRemove: (sentenceId: number) => void;
}

export function CurrentRunListItem({
  sentence,
  index,
  onRemove
}: CurrentRunListItemProps) {
  return (
    <div className="queue-list-item">
      <strong>{index + 1}</strong>
      <span>
        <b>{sentence.frText}</b>
        <small>{sentence.enText}</small>
      </span>
      <button
        onClick={() => onRemove(sentence.id)}
        aria-label={`Remove sentence ${index + 1}`}
      >
        ×
      </button>
    </div>
  );
}
