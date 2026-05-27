import { useState } from 'react';
import { CurrentSentenceDisplay } from '../components/player/CurrentSentenceDisplay';
import { PlaybackStepDots } from '../components/player/PlaybackStepDots';
import { PlayerControls } from '../components/player/PlayerControls';
import { PlayerHeader } from '../components/player/PlayerHeader';
import { RevealControls } from '../components/player/RevealControls';
import { ProgressBar } from '../components/shared/ProgressBar';
import { usePlaybackEngine } from '../hooks/usePlaybackEngine';
import type { CurrentRun } from '../types/currentRun';
import type { ListeningProfile } from '../types/listeningProfile';

interface PlayerScreenProps {
  currentRun: CurrentRun | null;
  listeningProfile: ListeningProfile;
  onBack: () => void;
  onOpenProfile: () => void;
  onOpenQueue: () => void;
}

export function PlayerScreen({
  currentRun,
  listeningProfile,
  onBack,
  onOpenProfile,
  onOpenQueue,
}: PlayerScreenProps) {
  const [showFrench, setShowFrench] = useState(false);
  const [showEnglish, setShowEnglish] = useState(false);
  const playback = usePlaybackEngine(currentRun, listeningProfile);
  const totalSentences = currentRun?.sentences.length ?? 0;

  return (
    <main className="player-screen">
      <PlayerHeader
        queueCount={totalSentences}
        onBack={onBack}
        onOpenQueue={onOpenQueue}
        onOpenProfile={onOpenProfile}
      />
      <div className="player-screen__main">
        <CurrentSentenceDisplay
          runLabel={currentRun?.label ?? 'Current Run'}
          sentence={playback.currentSentence}
          currentSentenceIndex={playback.currentSentenceIndex}
          totalSentences={totalSentences}
          currentStep={playback.currentStep}
          showFrench={showFrench}
          showEnglish={showEnglish}
        />
        <PlaybackStepDots
          steps={listeningProfile.steps}
          activeIndex={playback.currentStepIndex}
          active={playback.isPlaying}
        />
        <RevealControls
          showFrench={showFrench}
          showEnglish={showEnglish}
          onToggleFrench={() => setShowFrench((value) => !value)}
          onToggleEnglish={() => setShowEnglish((value) => !value)}
        />
      </div>
      <div className="player-screen__progress">
        <ProgressBar
          value={playback.currentSentenceIndex + 1}
          max={Math.max(1, totalSentences)}
        />
      </div>
      <PlayerControls
        isPlaying={playback.isPlaying}
        loopRun={playback.loopRun}
        onPrevious={() =>
          playback.moveToSentence(playback.currentSentenceIndex - 1)
        }
        onNext={() =>
          playback.moveToSentence(playback.currentSentenceIndex + 1)
        }
        onTogglePlaying={playback.togglePlaying}
        onToggleLoop={() => playback.setLoopRun((value) => !value)}
      />
    </main>
  );
}
