import { SCREENS, type ScreenId } from '../../constants/routes';

interface BottomNavProps {
  screen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
}

const navItems: Array<{ id: ScreenId; label: string; icon: string }> = [
  { id: SCREENS.HOME, label: 'Home', icon: '⌂' },
];

export function BottomNav({ onNavigate }: BottomNavProps) {
  return (
    <nav>
      {navItems.map((item) => (
        <button key={item.id} onClick={() => onNavigate(item.id)}>
          <span>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
  );
}
