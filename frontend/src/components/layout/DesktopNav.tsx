import { SCREENS, type ScreenId } from '../../constants/routes';

interface DesktopNavProps {
  screen: ScreenId;
  canOpenPlayer: boolean;
  onNavigate: (screen: ScreenId) => void;
}

const navItems: Array<{ id: ScreenId; label: string; icon: string }> = [
  { id: SCREENS.HOME, label: 'Home', icon: '⌂' },
  { id: SCREENS.PLAYER, label: 'Player', icon: '▶' },
  { id: SCREENS.LIBRARY, label: 'Sentence Library', icon: '☷' },
  { id: SCREENS.SETTINGS, label: 'Settings', icon: '⚙' },
];

export function DesktopNav({
  screen,
  canOpenPlayer,
  onNavigate,
}: DesktopNavProps) {
  return (
    <aside className="desktop-nav" aria-label="Primary navigation">
      <div className="desktop-nav__header">
        <div className="app-logo app-logo--compact">écouter</div>
        <div className="app-tagline">French Listening Trainer</div>
      </div>
      <nav className="desktop-nav__links">
        {navItems.map((item) => {
          const isPlayerItem = item.id === SCREENS.PLAYER;
          const disabled = isPlayerItem && !canOpenPlayer;

          return (
            <button
              key={item.id}
              className={`nav-link ${
                screen === item.id ? 'nav-link--active' : ''
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
    </aside>
  );
}
