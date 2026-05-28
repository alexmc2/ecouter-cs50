import { useEffect, useMemo, useState } from 'react';
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
import {
  defaultProgress,
  normalizeProgress,
  type LocalProgress,
} from './storage/progressStorage';
import { defaultSettings } from './storage/settingsStorage';
import type { CurrentRun } from './types/currentRun';
import type { AppSettings, ThemeName } from './types/settings';
import { createStarterCurrentRun } from './utils/createCurrentRun';

function isScreenId(value: unknown): value is ScreenId {
  return Object.values(SCREENS).includes(value as ScreenId);
}

function progressMatches(left: LocalProgress, right: LocalProgress): boolean {
  return (
    left.lastPosition === right.lastPosition &&
    left.currentRunId === right.currentRunId &&
    left.currentSentenceIndex === right.currentSentenceIndex &&
    left.currentStepIndex === right.currentStepIndex
  );
}

export function App() {
  const { currentRun, startRun, removeSentenceFromRun } = useCurrentRun();
  const [storedScreen, setStoredScreen] = useLocalStorage<ScreenId>(
    STORAGE_KEYS.screen,
    SCREENS.HOME,
  );
  const [storedProgress, setProgress] = useLocalStorage(
    STORAGE_KEYS.progress,
    defaultProgress,
  );
  const [settings, setSettings] = useLocalStorage<AppSettings>(
    STORAGE_KEYS.settings,
    defaultSettings,
  );
  const activeSettings = {
    ...defaultSettings,
    ...settings,
  };
  const progress = useMemo(
    () => normalizeProgress(storedProgress),
    [storedProgress],
  );
  const screen =
    isScreenId(storedScreen) && (storedScreen !== SCREENS.PLAYER || currentRun)
      ? storedScreen
      : SCREENS.HOME;
  const [showProfileBuilder, setShowProfileBuilder] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const listeningProfile = useListeningProfile();
  const lastPosition = Math.max(1, progress.lastPosition);
  const starterSentences = useSentences(
    1,
    activeSettings.defaultRunSize,
    true,
    lastPosition,
  );
  const totalSentences = starterSentences.data?.total ?? 0;

  useEffect(() => {
    if (storedScreen !== screen) {
      setStoredScreen(screen);
    }
  }, [screen, setStoredScreen, storedScreen]);

  useEffect(() => {
    if (!progressMatches(storedProgress, progress)) {
      setProgress(progress);
    }
  }, [progress, setProgress, storedProgress]);

  function setTheme(theme: ThemeName): void {
    setSettings((currentSettings) => ({
      ...defaultSettings,
      ...currentSettings,
      theme,
    }));
  }

  function setDefaultRunSize(defaultRunSize: number): void {
    setSettings((currentSettings) => ({
      ...defaultSettings,
      ...currentSettings,
      defaultRunSize,
    }));
  }

  function setAutoHideText(autoHideText: boolean): void {
    setSettings((currentSettings) => ({
      ...defaultSettings,
      ...currentSettings,
      autoHideText,
    }));
  }

  function openRun(run: CurrentRun): void {
    const firstSentence = run.sentences[0] ?? null;

    startRun(run);
    setProgress({
      lastPosition: firstSentence?.position ?? lastPosition,
      currentRunId: run.id,
      currentSentenceIndex: 0,
      currentStepIndex: 0,
    });
    setStoredScreen(SCREENS.PLAYER);
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
        defaultRunSize={activeSettings.defaultRunSize}
        totalSentences={totalSentences}
        completedCount={Math.max(0, lastPosition - 1)}
        startListeningDisabled={
          starterSentences.loading ||
          Boolean(starterSentences.error) ||
          !starterSentences.data?.items.length
        }
        onStartListening={startListening}
        onBrowseSentences={() => setStoredScreen(SCREENS.LIBRARY)}
      />
    ) : screen === SCREENS.LIBRARY ? (
      <SentenceLibraryScreen onStartRun={openRun} />
    ) : screen === SCREENS.PLAYER ? (
      <PlayerScreen
        currentRun={currentRun}
        listeningProfile={listeningProfile.profile}
        savedProgress={progress}
        autoHideText={activeSettings.autoHideText}
        onProgressChange={setProgress}
        onBack={() => setStoredScreen(SCREENS.HOME)}
        onChooseSet={() => setStoredScreen(SCREENS.LIBRARY)}
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
        <AppShell screen={screen} onNavigate={setStoredScreen}>
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
