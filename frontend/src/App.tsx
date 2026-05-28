import { useState } from 'react';
import { AppShell } from './components/layout/AppShell';
import { ListeningProfileBuilder } from './components/listening-profile/ListeningProfileBuilder';
import { CurrentRunPanel } from './components/queue/CurrentRunPanel';
import { SCREENS, type ScreenId } from './constants/routes';
import { STORAGE_KEYS } from './constants/storageKeys';
import { useCurrentRun } from './hooks/useCurrentRun';
import { useListeningProfile } from './hooks/useListeningProfile';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useSentences } from './hooks/useSentences';
import { HomeScreen } from './screens/HomeScreen';
import { PlayerScreen } from './screens/PlayerScreen';
import { SentenceLibraryScreen } from './screens/SentenceLibraryScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import type { CurrentRun } from './types/currentRun';
import type { AppSettings, ThemeName } from './types/settings';
import { createStarterCurrentRun } from './utils/createCurrentRun';

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  defaultRunSize: 20,
  autoHideText: true,
};

export function App() {
  const [screen, setScreen] = useState<ScreenId>(SCREENS.HOME);
  const [settings, setSettings] = useLocalStorage<AppSettings>(
    STORAGE_KEYS.settings,
    DEFAULT_SETTINGS,
  );
  const activeSettings = {
    ...DEFAULT_SETTINGS,
    ...settings,
  };
  const [showProfileBuilder, setShowProfileBuilder] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const { currentRun, startRun, removeSentenceFromRun } = useCurrentRun();
  const listeningProfile = useListeningProfile();
  const starterSentences = useSentences(1, activeSettings.defaultRunSize, true);
  const lastPosition = 1;
  const totalSentences = starterSentences.data?.total ?? 0;

  function setTheme(theme: ThemeName): void {
    setSettings((currentSettings) => ({
      ...DEFAULT_SETTINGS,
      ...currentSettings,
      theme,
    }));
  }

  function setDefaultRunSize(defaultRunSize: number): void {
    setSettings((currentSettings) => ({
      ...DEFAULT_SETTINGS,
      ...currentSettings,
      defaultRunSize,
    }));
  }

  function setAutoHideText(autoHideText: boolean): void {
    setSettings((currentSettings) => ({
      ...DEFAULT_SETTINGS,
      ...currentSettings,
      autoHideText,
    }));
  }

  function openRun(run: CurrentRun): void {
    startRun(run);
    setScreen(SCREENS.PLAYER);
  }

  function startListening(): void {
    if (!starterSentences.data || starterSentences.data.items.length === 0) {
      return;
    }

    openRun(
      createStarterCurrentRun(
        starterSentences.data.items,
        activeSettings.defaultRunSize,
      ),
    );
  }

  const appContent =
    screen === SCREENS.HOME ? (
      <HomeScreen
        lastPosition={lastPosition}
        totalSentences={totalSentences}
        startListeningDisabled={
          starterSentences.loading ||
          Boolean(starterSentences.error) ||
          !starterSentences.data?.items.length
        }
        onStartListening={startListening}
        onBrowseSentences={() => setScreen(SCREENS.LIBRARY)}
      />
    ) : screen === SCREENS.LIBRARY ? (
      <SentenceLibraryScreen onStartRun={openRun} />
    ) : screen === SCREENS.PLAYER ? (
      <PlayerScreen
        currentRun={currentRun}
        listeningProfile={listeningProfile.profile}
        autoHideText={activeSettings.autoHideText}
        onBack={() => setScreen(SCREENS.HOME)}
        onChooseSet={() => setScreen(SCREENS.LIBRARY)}
        onOpenProfile={() => setShowProfileBuilder(true)}
        onOpenQueue={() => setShowQueue(true)}
      />
    ) : (
      <SettingsScreen
        theme={activeSettings.theme}
        onThemeChange={setTheme}
        defaultRunSize={activeSettings.defaultRunSize}
        onDefaultRunSizeChange={setDefaultRunSize}
        autoHideText={activeSettings.autoHideText}
        onAutoHideTextChange={setAutoHideText}
      />
    );

  return (
    <div className="app-root" data-theme={activeSettings.theme}>
      {screen === SCREENS.PLAYER ? (
        appContent
      ) : (
        <AppShell screen={screen} onNavigate={setScreen}>
          {appContent}
        </AppShell>
      )}
      {showProfileBuilder ? (
        <ListeningProfileBuilder
          profile={listeningProfile.profile}
          presets={listeningProfile.presets}
          onAddStep={listeningProfile.addStep}
          onRemoveStep={listeningProfile.removeStep}
          onDuplicateStep={listeningProfile.duplicateStep}
          onMoveStep={listeningProfile.moveStep}
          onApplyPreset={listeningProfile.applyPreset}
          onResetProfile={listeningProfile.resetProfile}
          onClose={() => setShowProfileBuilder(false)}
        />
      ) : null}
      {showQueue ? (
        <CurrentRunPanel
          currentRun={currentRun}
          onClose={() => setShowQueue(false)}
          onRemoveSentence={removeSentenceFromRun}
        />
      ) : null}
    </div>
  );
}
