
import type { ListeningProfileItem } from '../../types/listeningProfile';

interface ListeningProfileItemCardProps {
  item: ListeningProfileItem;
  compact?: boolean;
  onRemove?: () => void;
  onDuplicate?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

function getItemMeta(item: ListeningProfileItem): string {
  if (item.type === 'pause') {
    return `${item.durationMs / 1000}s`;
  }

  return item.source.includes('female') ? 'female' : 'male';
}

export function ListeningProfileItemCard({
  item,
  compact = false,
  onRemove,
  onDuplicate,
  onMoveUp,
  onMoveDown,
}: ListeningProfileItemCardProps) {
  const icon =
    item.type === 'pause'
      ? '⏸'
      : item.source.startsWith('fr')
        ? 'FR'
        : 'EN';

  return (
    <div
      className={`profile-item-card ${compact ? 'profile-item-card--compact' : ''}`}
    >
      <span className="profile-item-card__icon">{icon}</span>
      <span className="profile-item-card__body">
        <strong>{item.label}</strong>
        {!compact ? <small>{getItemMeta(item)}</small> : null}
      </span>
      {!compact && (onRemove || onDuplicate || onMoveUp || onMoveDown) ? (
        <span className="profile-item-card__actions">
          {onMoveUp ? (
            <button onClick={onMoveUp} aria-label="Move item up">
              ↑
            </button>
          ) : null}
          {onMoveDown ? (
            <button onClick={onMoveDown} aria-label="Move item down">
              ↓
            </button>
          ) : null}
          {onDuplicate ? (
            <button onClick={onDuplicate} aria-label="Duplicate item">
              ⧉
            </button>
          ) : null}
          {onRemove ? (
            <button onClick={onRemove} aria-label="Remove item">
              ×
            </button>
          ) : null}
        </span>
      ) : null}
    </div>
  );
}
