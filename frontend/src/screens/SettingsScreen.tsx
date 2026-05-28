import type { ThemeName } from '../types/settings';
import { AppCard } from '../components/shared/AppCard';

interface SettingsScreenProps {
  theme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
  defaultRunSize: number;
  onDefaultRunSizeChange: (runSize: number) => void;
  autoHideText: boolean;
  onAutoHideTextChange: (autoHideText: boolean) => void;
}

export function SettingsScreen({
  theme,
  onThemeChange,
  defaultRunSize,
  onDefaultRunSizeChange,
  autoHideText,
  onAutoHideTextChange,
}: SettingsScreenProps) {
  return (
    <main className="screen settings-screen">
      <div className="screen-heading">
        <h1>Settings</h1>
      </div>
      <div className="settings-list">
        <AppCard className="settings-row">
          <div>
            <strong>Appearance</strong>
            <span>{theme === 'dark' ? 'Dark mode' : 'Light mode'}</span>
          </div>
          <div className="pill-group">
            <button
              className={`pill ${theme === 'light' ? 'pill--active pill--filled' : ''}`}
              onClick={() => onThemeChange('light')}
            >
              Light
            </button>
            <button
              className={`pill ${theme === 'dark' ? 'pill--active pill--filled' : ''}`}
              onClick={() => onThemeChange('dark')}
            >
              Dark
            </button>
          </div>
        </AppCard>
        <AppCard className="settings-row">
          <div>
            <strong>Default run size</strong>
            <span>{defaultRunSize} sentences when starting quickly</span>
          </div>
          <div className="pill-group">
            {[10, 20, 50, 100].map((size) => (
              <button
                key={size}
                className={`pill ${defaultRunSize === size ? 'pill--active pill--filled' : ''}`}
                onClick={() => onDefaultRunSizeChange(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </AppCard>
        <AppCard className="settings-row">
          <div>
            <strong>Auto-hide text</strong>
            <span>Hide revealed text when moving to the next sentence</span>
          </div>
          <button
            className={`pill ${autoHideText ? 'pill--active pill--filled' : ''}`}
            onClick={() => onAutoHideTextChange(!autoHideText)}
            aria-pressed={autoHideText}
          >
            {autoHideText ? 'On' : 'Off'}
          </button>
        </AppCard>
      </div>
    </main>
  );
}
