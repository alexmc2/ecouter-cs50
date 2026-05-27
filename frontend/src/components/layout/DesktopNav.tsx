import { SCREENS, type ScreenId } from '../../constants/routes';

interface DesktopNavProps {
  screen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
}

const navItems: Array<{ id: ScreenId; label: string; icon: string }> = [
  { id: SCREENS.HOME, label: 'Home', icon: '⌂' },
];

export function DesktopNav({ onNavigate }: DesktopNavProps) {
  return (
    <aside>
      <div>
        <div>écouter</div>
        <div>French Listening Trainer</div>
      </div>
      <nav>
        {navItems.map((item) => (
          <button key={item.id} onClick={() => onNavigate(item.id)}>
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
