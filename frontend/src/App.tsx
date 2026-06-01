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
import {
  defaultSettings,
  normalizeSettings,
  type StoredAppSettings,
} from './storage/settingsStorage';
import type { CurrentRun } from './types/currentRun';
import type { ThemeName } from './types/settings';
import { createStarterCurrentRun } from './utils/createCurrentRun';

function isScreenId(value: unknown): value is ScreenId {
  return Object.values(SCREENS).includes(value as ScreenId);
}

// Raw progress from localStorage is normalised before the app uses it.
function progressMatches(left: LocalProgress, right: LocalProgress): boolean {
  return (
    left.lastPosition === right.lastPosition &&
    left.currentRunId === right.currentRunId &&
    left.currentSentenceIndex === right.currentSentenceIndex &&
    left.currentStepIndex === right.currentStepIndex
  );
}

export function App() {
  // useCurrentRun hook manages the state of the current run (list of sentences that the user
  // is currently working through) and persists it to localStorage. The current run state
  // is lifted to the top level of the app and passed down
  const { currentRun, startRun, removeSentenceFromRun } = useCurrentRun();

  // The current screen, listening progress, and user settings are stored in
  // localStorage. This allows the app to remember the learner's place and preferences when
  // the page reloads. The 'stored' values is the raw data from localStorage, which may be
  // incomplete or invalid. The 'active' values are normalised versions of that data.
  const [storedScreen, setStoredScreen] = useLocalStorage<ScreenId>(
    STORAGE_KEYS.screen,
    SCREENS.HOME,
  );
  const [storedProgress, setProgress] = useLocalStorage(
    STORAGE_KEYS.progress,
    defaultProgress,
  );
  const [settings, setSettings] = useLocalStorage<StoredAppSettings>(
    STORAGE_KEYS.settings,
    defaultSettings,
  );

  // useMemo hook to avoid unnecessary re-renders of the app when the stored values
  // change but the normalised values do not.
  const activeSettings = useMemo(() => normalizeSettings(settings), [settings]);
  const progress = useMemo(
    () => normalizeProgress(storedProgress),
    [storedProgress],
  );

  // If storage contains an unknown route, the app falls back to Home so the
  // UI never opens an unusable player.
  const screen =
    isScreenId(storedScreen) && (storedScreen !== SCREENS.PLAYER || currentRun)
      ? storedScreen
      : SCREENS.HOME;

  // These overlays sit above whichever main screen is active. They are local UI
  // state and not part of the user's saved route

  const [showProfileBuilder, setShowProfileBuilder] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const listeningProfile = useListeningProfile();

  // Progress positions are based on sentence positions from the sentence dataset. The
  // Math.max guard protects the sentence query from any older or malformed
  // progress value that slipped through storage.
  const lastPosition = Math.max(1, progress.lastPosition);

  // The Home screen's 'start listening' button depends on this preloaded slice
  // of sentences. The query starts at the learner's last saved position.
  const starterSentences = useSentences(
    1,
    activeSettings.defaultRunSize,
    true,
    lastPosition,
  );
  const totalSentences = starterSentences.data?.total ?? 0;

  // If the saved screen is not usable, App switches to Home and saves that
  // change, so refreshes do not attempt to open the wrong screen.
  useEffect(() => {
    if (storedScreen !== screen) {
      setStoredScreen(screen);
    }
  }, [screen, setStoredScreen, storedScreen]);

  // Normalisation turns partial or stale localStorage data into a valid
  // progress object.
  // Save the cleaned progress back to localStorage if it changed.
  useEffect(() => {
    if (!progressMatches(storedProgress, progress)) {
      setProgress(progress);
    }
  }, [progress, setProgress, storedProgress]);

  function setTheme(theme: ThemeName): void {
    // missing values in older localStorage entries are filled before the new preference
    // is saved.
    setSettings((currentSettings) => ({
      ...normalizeSettings(currentSettings),
      theme,
    }));
  }

  function setDefaultRunSize(defaultRunSize: number): void {
    setSettings((currentSettings) => ({
      ...normalizeSettings(currentSettings),
      defaultRunSize,
    }));
  }

  function setAutoShowFrenchText(autoShowFrenchText: boolean): void {
    setSettings((currentSettings) => ({
      ...normalizeSettings(currentSettings),
      autoShowFrenchText,
    }));
  }

  function setAutoShowEnglishText(autoShowEnglishText: boolean): void {
    setSettings((currentSettings) => ({
      ...normalizeSettings(currentSettings),
      autoShowEnglishText,
    }));
  }

  function openRun(run: CurrentRun): void {
    // All run entry points come through openRun function (the starter run from Home and any
    // custom selection from the library). startRun resets playback to the first sentence and
    // first listening-profile step.
    const firstSentence = run.sentences[0] ?? null;

    startRun(run);
    setProgress({
      lastPosition: firstSentence?.position ?? lastPosition,
      currentRunId: run.id,
      currentSentenceIndex: 0,
      currentStepIndex: 0,
    });

    // The player screen depends on the current run, so App switches to that route if not already there.
    setStoredScreen(SCREENS.PLAYER);
  }

  function startListening(): void {
    // The starter run is only valid when the preload has at least one
    // sentence. Loading and error states disable the button in HomeScreen.
    //Final guard against invalid state
    if (!starterSentences.data || starterSentences.data.items.length === 0) {
      return;
    }
    // create a run from the starter sentences and open it in the player.
    openRun(
      createStarterCurrentRun(
        starterSentences.data.items,
        activeSettings.defaultRunSize,
      ),
    );
  }

  // Screen selection is centralised here. App decides which persisted
  // state and shared actions each route receives. The child screens stay
  // focused on their own UI.
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
        autoShowFrenchText={activeSettings.autoShowFrenchText}
        autoShowEnglishText={activeSettings.autoShowEnglishText}
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
        autoShowFrenchText={activeSettings.autoShowFrenchText}
        onAutoShowFrenchTextChange={setAutoShowFrenchText}
        autoShowEnglishText={activeSettings.autoShowEnglishText}
        onAutoShowEnglishTextChange={setAutoShowEnglishText}
      />
    );

  return (
    <div className="app-root" data-theme={activeSettings.theme}>
      <AppShell
        screen={screen}
        canOpenPlayer={Boolean(currentRun)}
        onNavigate={setStoredScreen}
      >
        {appContent}
      </AppShell>
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
