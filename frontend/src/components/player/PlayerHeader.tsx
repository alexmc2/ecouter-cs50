import { AppButton } from '../shared/AppButton';

interface PlayerHeaderProps {
  onBack: () => void;
  onOpenProfile: () => void;
}

export function PlayerHeader({
  onBack,
  onOpenProfile,
}: PlayerHeaderProps) {
  return (
    <header className="player-header">
      <AppButton variant="ghost" onClick={onBack}>
        ← Back
      </AppButton>
      <div className="player-header__actions">
        <AppButton variant="primary" onClick={onOpenProfile}>
          Listening Profile
        </AppButton>
      </div>
    </header>
  );
}
