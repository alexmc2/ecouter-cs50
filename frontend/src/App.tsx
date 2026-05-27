import { useState } from 'react';
import { HomeScreen } from './screens/HomeScreen';
import { AppShell } from './components/layout/AppShell';
import { SCREENS, type ScreenId } from './constants/routes';
import { useSentences } from './hooks/useSentences';
import { SentenceLibraryScreen } from './screens/SentenceLibraryScreen';
import type { CurrentRun } from './types/currentRun';
import { createStarterCurrentRun } from './utils/createCurrentRun';

export default function App() {
  const [screen, setScreen] = useState<ScreenId>(SCREENS.HOME);
  const defaultRunSize = 20;
  const starterSentences = useSentences(1, defaultRunSize, true);
  const lastPosition = 1;
  const totalSentences = starterSentences.data?.total ?? 0;

  function openRun(run: CurrentRun): void {
    console.log('Current run created', run);
  }

  function startListening(): void {
    if (!starterSentences.data || starterSentences.data.items.length === 0) {
      return;
    }

    openRun(
      createStarterCurrentRun(starterSentences.data.items, defaultRunSize),
    );
  }

  function browseSentences(): void {
    setScreen(SCREENS.LIBRARY);
  }

  const appContent =
    screen === SCREENS.LIBRARY ? (
      <SentenceLibraryScreen onStartRun={openRun} />
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
        onBrowseSentences={browseSentences}
      />
    );

  return (
    <div className="app-root" data-theme="dark">
      <AppShell screen={screen} onNavigate={setScreen}>
        {appContent}
      </AppShell>
    </div>
  );
}
