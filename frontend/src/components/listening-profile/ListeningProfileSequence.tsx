
import type {
  ListeningProfile,
  ListeningProfileItem,
} from '../../types/listeningProfile';
import { EmptyState } from '../shared/EmptyState';
import { ListeningProfileItemCard } from './ListeningProfileItemCard';

interface ListeningProfileSequenceProps {
  profile: ListeningProfile;
  onRemoveStep: (stepId: string) => void;
  onDuplicateStep: (step: ListeningProfileItem) => void;
  onMoveStep: (stepId: string, direction: 'up' | 'down') => void;
}

export function ListeningProfileSequence({
  profile,
  onRemoveStep,
  onDuplicateStep,
  onMoveStep,
}: ListeningProfileSequenceProps) {
  return (
    <section className="profile-panel profile-sequence">
      <div className="profile-sequence__header">
        <div>
          <div className="eyebrow">Your profile</div>
          <span>
            {profile.steps.length} item{profile.steps.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>
      {profile.steps.length === 0 ? (
        <EmptyState
          title="No items yet"
          message="Add an audio or pause item."
        />
      ) : (
        <div className="profile-sequence__list">
          {profile.steps.map((item) => (
            <ListeningProfileItemCard
              key={item.id}
              item={item}
              onRemove={() => onRemoveStep(item.id)}
              onDuplicate={() => onDuplicateStep(item)}
              onMoveUp={() => onMoveStep(item.id, 'up')}
              onMoveDown={() => onMoveStep(item.id, 'down')}
            />
          ))}
        </div>
      )}
    </section>
  );
}
