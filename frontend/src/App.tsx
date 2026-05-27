import { useState } from 'react';
import { AppShell } from './components/layout/AppShell';
import { ListeningProfileBuilder } from './components/listening-profile/ListeningProfileBuilder';
import { CurrentRunPanel } from './components/queue/CurrentRunPanel';
import { SCREENS, type ScreenId } from './constants/routes';
import { useCurrentRun } from './hooks/useCurrentRun';
import { useListeningProfile } from './hooks/useListeningProfile';
import { useSentences } from './hooks/useSentences';
import { HomeScreen } from './screens/HomeScreen';
import { PlayerScreen } from './screens/PlayerScreen';
import { SentenceLibraryScreen } from './screens/SentenceLibraryScreen';
import type { CurrentRun } from './types/currentRun';
import { createStarterCurrentRun } from './utils/createCurrentRun';

export function App() {
  const [screen, setScreen] = useState<ScreenId>(SCREENS.HOME);
  const [showProfileBuilder, setShowProfileBuilder] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const defaultRunSize = 20;
  const { currentRun, startRun, removeSentenceFromRun } = useCurrentRun();
  const listeningProfile = useListeningProfile();
  const starterSentences = useSentences(1, defaultRunSize, true);
  const lastPosition = 1;
  const totalSentences = starterSentences.data?.total ?? 0;

  function openRun(run: CurrentRun): void {
    startRun(run);
    setScreen(SCREENS.PLAYER);
  }

  function startListening(): void {
    if (!starterSentences.data || starterSentences.data.items.length === 0) {
      return;
    }

    openRun(
      createStarterCurrentRun(starterSentences.data.items, defaultRunSize),
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
        onBack={() => setScreen(SCREENS.HOME)}
        onOpenProfile={() => setShowProfileBuilder(true)}
        onOpenQueue={() => setShowQueue(true)}
      />
    ) : (
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
    );

  return (
    <div className="app-root" data-theme="dark">
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

export default App;
