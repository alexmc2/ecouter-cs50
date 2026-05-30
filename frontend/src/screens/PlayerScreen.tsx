import {
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { CurrentSentenceDisplay } from '../components/player/CurrentSentenceDisplay';
import { PlaybackStepDots } from '../components/player/PlaybackStepDots';
import { PlayerControls } from '../components/player/PlayerControls';
import { PlayerHeader } from '../components/player/PlayerHeader';
import { RevealControls } from '../components/player/RevealControls';
import { AppButton } from '../components/shared/AppButton';
import { ProgressBar } from '../components/shared/ProgressBar';
import { usePlaybackEngine } from '../hooks/usePlaybackEngine';
import type { LocalProgress } from '../storage/progressStorage';
import type { CurrentRun } from '../types/currentRun';
import type {
  ListeningProfile,
  ListeningProfileItem,
} from '../types/listeningProfile';

interface PlayerScreenProps {
  currentRun: CurrentRun | null;
  listeningProfile: ListeningProfile;
  savedProgress: LocalProgress;
  autoShowFrenchText: boolean;
  autoShowEnglishText: boolean;
  onProgressChange: Dispatch<SetStateAction<LocalProgress>>;
  onBack: () => void;
  onChooseSet: () => void;
  onOpenProfile: () => void;
  onOpenQueue: () => void;
}

interface RevealedTextState {
  french?: boolean;
  english?: boolean;
  sentenceVisitId: number | null;
}

type TextLanguage = 'french' | 'english';

function getAutomaticTextVisibility(
  autoShowFrenchText: boolean,
  autoShowEnglishText: boolean,
  step: ListeningProfileItem | null,
): Record<TextLanguage, boolean> {
  if (step?.type !== 'audio') {
    return {
      french: false,
      english: false,
    };
  }

  const isFrenchStep = step.source.startsWith('fr');

  return {
    french: autoShowFrenchText && isFrenchStep,
    english: autoShowEnglishText && !isFrenchStep,
  };
}

export function PlayerScreen({
  currentRun,
  listeningProfile,
  savedProgress,
  autoShowFrenchText,
  autoShowEnglishText,
  onProgressChange,
  onBack,
  onChooseSet,
  onOpenProfile,
  onOpenQueue,
}: PlayerScreenProps) {
  const [revealedText, setRevealedText] = useState<RevealedTextState>({
    sentenceVisitId: null,
  });
  const playback = usePlaybackEngine(currentRun, listeningProfile, savedProgress);
  const totalSentences = currentRun?.sentences.length ?? 0;
  const displaySentenceIndex =
    totalSentences > 0 ? playback.currentSentenceIndex + 1 : 0;
  const totalSteps = listeningProfile.steps.length;
  const displayStepIndex = totalSteps > 0 ? playback.currentStepIndex + 1 : 0;
  const setNumber = playback.currentSentence
    ? Math.floor((playback.currentSentence.position - 1) / 100) + 1
    : null;
  const textOverrideBelongsToCurrentSentence =
    revealedText.sentenceVisitId === playback.sentenceVisitId;
  const automaticTextVisibility = getAutomaticTextVisibility(
    autoShowFrenchText,
    autoShowEnglishText,
    playback.currentStep,
  );
  const showFrench =
    textOverrideBelongsToCurrentSentence && revealedText.french !== undefined
      ? revealedText.french
      : automaticTextVisibility.french;
  const showEnglish =
    textOverrideBelongsToCurrentSentence && revealedText.english !== undefined
      ? revealedText.english
      : automaticTextVisibility.english;

  useEffect(() => {
    if (!currentRun || !playback.currentSentence) {
      return;
    }

    onProgressChange((currentProgress) => {
      const nextProgress: LocalProgress = {
        lastPosition: playback.currentSentence?.position ?? 1,
        currentRunId: currentRun.id,
        currentSentenceIndex: playback.currentSentenceIndex,
        currentStepIndex: playback.currentStepIndex,
      };

      if (
        currentProgress.lastPosition === nextProgress.lastPosition &&
        currentProgress.currentRunId === nextProgress.currentRunId &&
        currentProgress.currentSentenceIndex ===
          nextProgress.currentSentenceIndex &&
        currentProgress.currentStepIndex === nextProgress.currentStepIndex
      ) {
        return currentProgress;
      }

      return nextProgress;
    });
  }, [
    currentRun,
    onProgressChange,
    playback.currentSentence,
    playback.currentSentenceIndex,
    playback.currentStepIndex,
  ]);

  function toggleRevealedText(language: TextLanguage): void {
    const nextVisible = language === 'french' ? !showFrench : !showEnglish;

    setRevealedText((currentState) => {
      const currentSentenceState =
        currentState.sentenceVisitId === playback.sentenceVisitId
          ? currentState
          : { sentenceVisitId: playback.sentenceVisitId };

      return {
        ...currentSentenceState,
        sentenceVisitId: playback.sentenceVisitId,
        [language]: nextVisible,
      };
    });
  }

  return (
    <main className="player-screen">
      <PlayerHeader
        onBack={onBack}
        onOpenProfile={onOpenProfile}
      />
      <section className="player-screen__main" aria-label="Audio player">
        <div className="player-shell">
          <article className="player-card">
            <section className="now-playing" aria-live="polite">
              <CurrentSentenceDisplay
                currentStep={playback.currentStep}
              />
              <div className="profile-strip" aria-label="Listening profile">
                <div className="profile-strip__row">
                  <span>Listening profile</span>
                  <span>
                    Step {displayStepIndex} of {totalSteps}
                  </span>
                </div>
                <PlaybackStepDots
                  steps={listeningProfile.steps}
                  activeIndex={playback.currentStepIndex}
                  active={totalSteps > 0}
                  onSelectStep={playback.moveToStep}
                />
              </div>
            </section>
            <RevealControls
              frenchText={playback.currentSentence?.frText ?? null}
              englishText={playback.currentSentence?.enText ?? null}
              showFrench={showFrench}
              showEnglish={showEnglish}
              onToggleFrench={() => toggleRevealedText('french')}
              onToggleEnglish={() => toggleRevealedText('english')}
            />
            <div className="player-screen__progress">
              <div className="player-progress__meta">
                <span>
                  Sentence {displaySentenceIndex} / {totalSentences}
                </span>
                <span>{setNumber ? `Set ${setNumber}` : 'No set loaded'}</span>
              </div>
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
          </article>
        </div>
      </section>
      <footer className="player-screen__footer">
        <AppButton onClick={onOpenQueue}>Queue ({totalSentences})</AppButton>
        <AppButton onClick={onChooseSet}>Change Set</AppButton>
      </footer>
    </main>
  );
}
