
import type {
  ListeningProfile,
  ListeningProfilePreset,
  ListeningProfileItem,
  ListeningProfileItemTemplate,
} from '../../types/listeningProfile';
import { AppButton } from '../shared/AppButton';
import { ListeningProfileItems } from './ListeningProfileItems';
import { ListeningProfilePresets } from './ListeningProfilePresets';
import { ListeningProfileSequence } from './ListeningProfileSequence';

interface ListeningProfileBuilderProps {
  profile: ListeningProfile;
  presets: ListeningProfilePreset[];
  onAddStep: (step: ListeningProfileItemTemplate) => void;
  onRemoveStep: (stepId: string) => void;
  onDuplicateStep: (step: ListeningProfileItem) => void;
  onMoveStep: (stepId: string, direction: 'up' | 'down') => void;
  onApplyPreset: (preset: ListeningProfilePreset) => void;
  onResetProfile: () => void;
  onClose: () => void;
}

export function ListeningProfileBuilder({
  profile,
  presets,
  onAddStep,
  onRemoveStep,
  onDuplicateStep,
  onMoveStep,
  onApplyPreset,
  onResetProfile,
  onClose,
}: ListeningProfileBuilderProps) {
  return (
    <div className="modal-backdrop">
      <section className="profile-builder" role="dialog" aria-modal="true">
        <header className="profile-builder__header">
          <div>
            <h2>Listening Profile</h2>
            <p>Control how each sentence is played in the Player.</p>
          </div>
          <div className="profile-builder__actions">
            <AppButton onClick={onResetProfile}>Reset</AppButton>
            <AppButton variant="primary" onClick={onClose}>
              Done
            </AppButton>
          </div>
        </header>
        <div className="profile-builder__body">
          <aside className="profile-builder__sidebar">
            <ListeningProfileItems onAddItem={onAddStep} />
            <ListeningProfilePresets
              presets={presets}
              onApplyPreset={onApplyPreset}
            />
          </aside>
          <ListeningProfileSequence
            profile={profile}
            onRemoveStep={onRemoveStep}
            onDuplicateStep={onDuplicateStep}
            onMoveStep={onMoveStep}
          />
        </div>
      </section>
    </div>
  );
}
