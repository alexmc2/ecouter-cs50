import { SCREENS, type ScreenId } from '../../constants/routes';

interface BottomNavProps {
  screen: ScreenId;
  canOpenPlayer: boolean;
  onNavigate: (screen: ScreenId) => void;
}

const navItems: Array<{ id: ScreenId; label: string; icon: string }> = [
  { id: SCREENS.HOME, label: 'Home', icon: '⌂' },
  { id: SCREENS.PLAYER, label: 'Player', icon: '▶' },
  { id: SCREENS.LIBRARY, label: 'Library', icon: '☷' },
  { id: SCREENS.SETTINGS, label: 'Settings', icon: '⚙' },
];

export function BottomNav({
  screen,
  canOpenPlayer,
  onNavigate,
}: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      {navItems.map((item) => {
        const isPlayerItem = item.id === SCREENS.PLAYER;
        const disabled = isPlayerItem && !canOpenPlayer;

        return (
          <button
            key={item.id}
            className={`bottom-nav__item ${
              screen === item.id ? 'bottom-nav__item--active' : ''
            }`}
            disabled={disabled}
            onClick={() => onNavigate(item.id)}
            aria-current={screen === item.id ? 'page' : undefined}
          >
            <span aria-hidden="true">{item.icon}</span>
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
