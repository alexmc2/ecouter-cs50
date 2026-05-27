
import { AppButton } from "../shared/AppButton";

interface SelectionToolbarProps {
  selectedCount: number;
  onClear: () => void;
  onPlaySelected: () => void;
}

export function SelectionToolbar({
  selectedCount,
  onClear,
  onPlaySelected
}: SelectionToolbarProps) {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <section className="selection-toolbar" aria-live="polite">
      <strong>{selectedCount} selected</strong>
      <div>
        <AppButton onClick={onClear}>Clear</AppButton>
        <AppButton variant="primary" onClick={onPlaySelected}>
          Play selected
        </AppButton>
      </div>
    </section>
  );
}
