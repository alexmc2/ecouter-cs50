import { useState } from 'react';
import { CurrentSentenceDisplay } from '../components/player/CurrentSentenceDisplay';
import { PlaybackStepDots } from '../components/player/PlaybackStepDots';
import { PlayerControls } from '../components/player/PlayerControls';
import { PlayerHeader } from '../components/player/PlayerHeader';
import { RevealControls } from '../components/player/RevealControls';
import { AppButton } from '../components/shared/AppButton';
import { ProgressBar } from '../components/shared/ProgressBar';
import { usePlaybackEngine } from '../hooks/usePlaybackEngine';
import type { CurrentRun } from '../types/currentRun';
import type { ListeningProfile } from '../types/listeningProfile';

interface PlayerScreenProps {
  currentRun: CurrentRun | null;
  listeningProfile: ListeningProfile;
  autoHideText: boolean;
  onBack: () => void;
  onChooseSet: () => void;
  onOpenProfile: () => void;
  onOpenQueue: () => void;
}

interface RevealedTextState {
  french: boolean;
  english: boolean;
  sentenceIndex: number;
}

export function PlayerScreen({
  currentRun,
  listeningProfile,
  autoHideText,
  onBack,
  onChooseSet,
  onOpenProfile,
  onOpenQueue,
}: PlayerScreenProps) {
  const [revealedText, setRevealedText] = useState<RevealedTextState>({
    french: false,
    english: false,
    sentenceIndex: 0,
  });
  const playback = usePlaybackEngine(currentRun, listeningProfile);
  const totalSentences = currentRun?.sentences.length ?? 0;
  const revealIsStale =
    autoHideText && revealedText.sentenceIndex !== playback.currentSentenceIndex;
  const showFrench = revealIsStale ? false : revealedText.french;
  const showEnglish = revealIsStale ? false : revealedText.english;

  function toggleRevealedText(language: 'french' | 'english'): void {
    setRevealedText((currentState) => {
      const stale =
        autoHideText &&
        currentState.sentenceIndex !== playback.currentSentenceIndex;

      return {
        sentenceIndex: playback.currentSentenceIndex,
        french:
          language === 'french'
            ? !(stale ? false : currentState.french)
            : stale
              ? false
              : currentState.french,
        english:
          language === 'english'
            ? !(stale ? false : currentState.english)
            : stale
              ? false
              : currentState.english,
      };
    });
  }

  return (
    <main className="player-screen">
      <PlayerHeader
        queueCount={totalSentences}
        onBack={onBack}
        onOpenQueue={onOpenQueue}
        onOpenProfile={onOpenProfile}
      />
      <div className="player-screen__main">
        <div className="player-screen__deck">
          <CurrentSentenceDisplay
            sentence={playback.currentSentence}
            currentSentenceIndex={playback.currentSentenceIndex}
            totalSentences={totalSentences}
            currentStep={playback.currentStep}
          />
          <PlaybackStepDots
            steps={listeningProfile.steps}
            activeIndex={playback.currentStepIndex}
            active={playback.isPlaying}
          />
          <RevealControls
            frenchText={playback.currentSentence?.frText ?? null}
            englishText={playback.currentSentence?.enText ?? null}
            showFrench={showFrench}
            showEnglish={showEnglish}
            onToggleFrench={() => toggleRevealedText('french')}
            onToggleEnglish={() => toggleRevealedText('english')}
          />
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
        </div>
      </div>
      <AppButton
        className="player-screen__change-set"
        onClick={onChooseSet}
      >
        Change Set
      </AppButton>
    </main>
  );
}
