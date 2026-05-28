import { SCREENS, type ScreenId } from '../../constants/routes';

interface BottomNavProps {
  screen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
}

const navItems: Array<{ id: ScreenId; label: string; icon: string }> = [
  { id: SCREENS.HOME, label: 'Home', icon: '⌂' },
  { id: SCREENS.LIBRARY, label: 'Library', icon: '☷' },
  { id: SCREENS.SETTINGS, label: 'Settings', icon: '⚙' },
];

export function BottomNav({ screen, onNavigate }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`bottom-nav__item ${
            screen === item.id ? 'bottom-nav__item--active' : ''
          }`}
          onClick={() => onNavigate(item.id)}
          aria-current={screen === item.id ? 'page' : undefined}
        >
          <span aria-hidden="true">{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
  );
}
