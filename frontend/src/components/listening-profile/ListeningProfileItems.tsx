
import type { ListeningProfileItemTemplate } from '../../types/listeningProfile';

interface ListeningProfileItemsProps {
  onAddItem: (item: ListeningProfileItemTemplate) => void;
}

const listeningProfileItems: ListeningProfileItemTemplate[] = [
  { type: 'audio', source: 'fr_female', label: 'French female' },
  { type: 'audio', source: 'fr_male', label: 'French male' },
  { type: 'audio', source: 'en_female', label: 'English female' },
  { type: 'audio', source: 'en_male', label: 'English male' },
  { type: 'pause', durationMs: 1500, label: 'Pause 1.5s' },
  { type: 'pause', durationMs: 2000, label: 'Pause 2s' },
  { type: 'pause', durationMs: 3000, label: 'Pause 3s' },
  { type: 'pause', durationMs: 4000, label: 'Pause 4s' },
];

export function ListeningProfileItems({
  onAddItem,
}: ListeningProfileItemsProps) {
  return (
    <section className="profile-panel">
      <div className="eyebrow">Add item</div>
      <div className="profile-items">
        {listeningProfileItems.map((item) => (
          <button
            key={`${item.type}-${item.label}`}
            onClick={() => onAddItem(item)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </section>
  );
}
