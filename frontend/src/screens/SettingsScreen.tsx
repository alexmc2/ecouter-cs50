import type { ThemeName } from '../types/settings';
import { AppCard } from '../components/shared/AppCard';

interface SettingsScreenProps {
  theme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
  defaultRunSize: number;
  onDefaultRunSizeChange: (runSize: number) => void;
  autoShowFrenchText: boolean;
  onAutoShowFrenchTextChange: (autoShowFrenchText: boolean) => void;
  autoShowEnglishText: boolean;
  onAutoShowEnglishTextChange: (autoShowEnglishText: boolean) => void;
}

export function SettingsScreen({
  theme,
  onThemeChange,
  defaultRunSize,
  onDefaultRunSizeChange,
  autoShowFrenchText,
  onAutoShowFrenchTextChange,
  autoShowEnglishText,
  onAutoShowEnglishTextChange,
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
            <strong>Auto-show text</strong>
            <span>Show matching text automatically during playback</span>
          </div>
          <div className="settings-toggle-list">
            <div className="settings-toggle">
              <span>French</span>
              <button
                type="button"
                aria-label="Auto-show French text"
                className={`pill ${
                  autoShowFrenchText ? 'pill--active pill--filled' : ''
                }`}
                onClick={() =>
                  onAutoShowFrenchTextChange(!autoShowFrenchText)
                }
                role="switch"
                aria-checked={autoShowFrenchText}
              >
                {autoShowFrenchText ? 'On' : 'Off'}
              </button>
            </div>
            <div className="settings-toggle">
              <span>English</span>
              <button
                type="button"
                aria-label="Auto-show English text"
                className={`pill ${
                  autoShowEnglishText ? 'pill--active pill--filled' : ''
                }`}
                onClick={() =>
                  onAutoShowEnglishTextChange(!autoShowEnglishText)
                }
                role="switch"
                aria-checked={autoShowEnglishText}
              >
                {autoShowEnglishText ? 'On' : 'Off'}
              </button>
            </div>
          </div>
        </AppCard>
      </div>
    </main>
  );
}
