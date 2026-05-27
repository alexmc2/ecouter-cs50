import { useState } from 'react';
import { HomeScreen } from './screens/HomeScreen';
import { AppShell } from './components/layout/AppShell';
import { SCREENS, type ScreenId } from './constants/routes';

export default function App() {
  const [screen, setScreen] = useState<ScreenId>(SCREENS.HOME);

  function startListening(): void {
    console.log('Start listening clicked');
  }

  function browseSentences(): void {
    console.log('Browse sentences clicked');
  }

  const appContent = (
    <HomeScreen
      lastPosition={1}
      totalSentences={100}
      startListeningDisabled={false}
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
