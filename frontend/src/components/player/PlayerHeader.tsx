import { AppButton } from '../shared/AppButton';

interface PlayerHeaderProps {
  queueCount: number;
  onBack: () => void;
  onOpenQueue: () => void;
  onOpenProfile: () => void;
}

export function PlayerHeader({
  queueCount,
  onBack,
  onOpenQueue,
  onOpenProfile,
}: PlayerHeaderProps) {
  return (
    <header className="player-header">
      <AppButton variant="ghost" onClick={onBack}>
        ← Back
      </AppButton>
      <div className="player-header__actions">
        <AppButton onClick={onOpenQueue}>Queue ({queueCount})</AppButton>
        <AppButton variant="primary" onClick={onOpenProfile}>
          Listening Profile
        </AppButton>
      </div>
    </header>
  );
}
