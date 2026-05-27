import { SCREENS, type ScreenId } from '../../constants/routes';

interface DesktopNavProps {
  screen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
}

const navItems: Array<{ id: ScreenId; label: string; icon: string }> = [
  { id: SCREENS.HOME, label: 'Home', icon: '⌂' },
  { id: SCREENS.LIBRARY, label: 'Sentence Library', icon: '☷' },
  { id: SCREENS.SETTINGS, label: 'Settings', icon: '⚙' },
];

export function DesktopNav({ screen, onNavigate }: DesktopNavProps) {
  return (
    <aside className="desktop-nav" aria-label="Primary navigation">
      <div className="desktop-nav__header">
        <div className="app-logo app-logo--compact">écouter</div>
        <div className="app-tagline">French Listening Trainer</div>
      </div>
      <nav className="desktop-nav__links">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-link ${screen === item.id ? 'nav-link--active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span aria-hidden="true">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
