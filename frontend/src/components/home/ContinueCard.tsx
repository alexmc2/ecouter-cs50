interface ContinueCardProps {
  lastPosition: number;
  totalSentences: number;
  onContinue: () => void;
}

export function ContinueCard({
  lastPosition,
  totalSentences,
  onContinue,
}: ContinueCardProps) {
  return (
    <button type="button"  onClick={onContinue}>
      <div >Continue</div>
      <strong>From sentence {lastPosition}</strong>
      <span>Next 20 sentences</span>
      <span>
        {lastPosition} / {totalSentences}
      </span>
    </button>
  );
}
