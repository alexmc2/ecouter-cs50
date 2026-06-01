/*AI was used to assist in writing the playback engine logic */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { API_BASE_URL } from '../api/client';
import type { LocalProgress } from '../storage/progressStorage';
import type { CurrentRun } from '../types/currentRun';
import type { ListeningProfile } from '../types/listeningProfile';
import { getAudioUrlForStep } from '../utils/getAudioUrlForStep';

interface PlaybackProgress {
  runId: string | null;
  currentSentenceIndex: number;
  currentStepIndex: number;
  sentenceVisitId: number;
  isPlaying: boolean;
}

function createInitialProgress(
  runId: string | null,
  savedProgress?: LocalProgress,
): PlaybackProgress {
  const savedMatchesRun =
    runId !== null && savedProgress?.currentRunId === runId;

  return {
    runId,
    currentSentenceIndex: savedMatchesRun
      ? savedProgress.currentSentenceIndex
      : 0,
    currentStepIndex: savedMatchesRun ? savedProgress.currentStepIndex : 0,
    sentenceVisitId: 0,
    isPlaying: false,
  };
}

function clampIndex(index: number, itemCount: number): number {
  return itemCount > 0 ? Math.min(index, itemCount - 1) : 0;
}

function clampProgress(
  progress: PlaybackProgress,
  sentenceCount: number,
  stepCount: number,
): PlaybackProgress {
  return {
    ...progress,
    currentSentenceIndex: clampIndex(
      progress.currentSentenceIndex,
      sentenceCount,
    ),
    currentStepIndex: clampIndex(progress.currentStepIndex, stepCount),
  };
}

function isAbsoluteUrl(url: string): boolean {
  return /^[a-z][a-z\d+.-]*:/i.test(url);
}

function resolvePlaybackUrl(audioUrl: string): string {
  if (isAbsoluteUrl(audioUrl)) {
    return audioUrl;
  }

  if (isAbsoluteUrl(API_BASE_URL)) {
    return new URL(audioUrl, API_BASE_URL).toString();
  }

  return audioUrl;
}

export function usePlaybackEngine(
  currentRun: CurrentRun | null,
  listeningProfile: ListeningProfile,
  savedProgress?: LocalProgress,
) {
  const currentRunId = currentRun?.id ?? null;
  const savedProgressRef = useRef(savedProgress);
  const [storedProgress, setStoredProgress] = useState(() =>
    createInitialProgress(currentRunId, savedProgress),
  );
  const [loopRun, setLoopRun] = useState(true);
  const progress =
    storedProgress.runId === currentRunId
      ? storedProgress
      : createInitialProgress(currentRunId, savedProgress);

  const sentences = currentRun?.sentences ?? [];
  const sentenceCount = sentences.length;
  const stepCount = listeningProfile.steps.length;
  const clampedProgress = clampProgress(progress, sentenceCount, stepCount);
  const { currentSentenceIndex, currentStepIndex } = clampedProgress;
  const currentSentence = sentences[currentSentenceIndex] ?? null;
  const currentStep = listeningProfile.steps[currentStepIndex] ?? null;
  const canPlay = currentRunId !== null && sentenceCount > 0 && stepCount > 0;
  const isPlaying = canPlay && clampedProgress.isPlaying;

  const currentAudioUrl = useMemo(() => {
    if (!currentSentence || !currentStep) {
      return null;
    }

    const audioUrl = getAudioUrlForStep(currentSentence, currentStep);

    return audioUrl ? resolvePlaybackUrl(audioUrl) : null;
  }, [currentSentence, currentStep]);

  const updateProgress = useCallback(
    (update: (progress: PlaybackProgress) => PlaybackProgress): void => {
      setStoredProgress((stored) => {
        const activeProgress =
          stored.runId === currentRunId
            ? stored
            : createInitialProgress(currentRunId, savedProgressRef.current);

        return update(clampProgress(activeProgress, sentenceCount, stepCount));
      });
    },
    [currentRunId, sentenceCount, stepCount],
  );

  useEffect(() => {
    savedProgressRef.current = savedProgress;
  }, [savedProgress]);

  function togglePlaying(): void {
    updateProgress((progress) => ({
      ...progress,
      isPlaying: progress.isPlaying ? false : canPlay,
    }));
  }

  function moveToSentence(index: number): void {
    const nextIndex = Math.max(0, Math.min(sentenceCount - 1, index));

    updateProgress((progress) => ({
      ...progress,
      currentSentenceIndex: nextIndex,
      currentStepIndex: 0,
      sentenceVisitId:
        nextIndex === progress.currentSentenceIndex
          ? progress.sentenceVisitId
          : progress.sentenceVisitId + 1,
      isPlaying: false,
    }));
  }

  function moveToStep(index: number): void {
    const nextIndex = Math.max(0, Math.min(stepCount - 1, index));

    updateProgress((progress) => ({
      ...progress,
      currentStepIndex: nextIndex,
      isPlaying: progress.isPlaying && canPlay,
    }));
  }

  const stopPlayback = useCallback(() => {
    updateProgress((progress) => ({
      ...progress,
      isPlaying: false,
    }));
  }, [updateProgress]);

  const advancePlayback = useCallback(() => {
    updateProgress((progress) => {
      if (!canPlay) {
        return {
          ...progress,
          currentSentenceIndex: 0,
          currentStepIndex: 0,
          sentenceVisitId:
            progress.currentSentenceIndex === 0
              ? progress.sentenceVisitId
              : progress.sentenceVisitId + 1,
          isPlaying: false,
        };
      }

      if (progress.currentStepIndex + 1 < stepCount) {
        return {
          ...progress,
          currentStepIndex: progress.currentStepIndex + 1,
        };
      }

      if (progress.currentSentenceIndex + 1 < sentenceCount) {
        return {
          ...progress,
          currentSentenceIndex: progress.currentSentenceIndex + 1,
          currentStepIndex: 0,
          sentenceVisitId: progress.sentenceVisitId + 1,
        };
      }

      if (loopRun) {
        return {
          ...progress,
          currentSentenceIndex: 0,
          currentStepIndex: 0,
          sentenceVisitId:
            progress.currentSentenceIndex === 0
              ? progress.sentenceVisitId
              : progress.sentenceVisitId + 1,
        };
      }

      return {
        ...progress,
        isPlaying: false,
      };
    });
  }, [canPlay, loopRun, sentenceCount, stepCount, updateProgress]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    if (!currentStep) {
      const timer = window.setTimeout(advancePlayback, 0);

      return () => window.clearTimeout(timer);
    }

    if (currentStep.type === 'pause') {
      const timer = window.setTimeout(advancePlayback, currentStep.durationMs);

      return () => window.clearTimeout(timer);
    }

    if (!currentAudioUrl) {
      const timer = window.setTimeout(advancePlayback, 0);

      return () => window.clearTimeout(timer);
    }

    let cancelled = false;
    const audio = new Audio(currentAudioUrl);

    audio.preload = 'auto';

    function handleEnded(): void {
      advancePlayback();
    }

    function handleError(): void {
      stopPlayback();
    }

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // audio.play() finishes asynchronously, so an old audio step may fail
    // after a newer step has started. Ignore that late failure if cancelled.
    void audio.play().catch(() => {
      if (!cancelled) {
        stopPlayback();
      }
    });

    return () => {
      cancelled = true;
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
    };
  }, [advancePlayback, currentAudioUrl, currentStep, isPlaying, stopPlayback]);

  return {
    currentSentenceIndex,
    currentStepIndex,
    sentenceVisitId: clampedProgress.sentenceVisitId,
    currentSentence,
    currentStep,
    currentAudioUrl,
    isPlaying,
    loopRun,
    togglePlaying,
    setLoopRun,
    moveToSentence,
    moveToStep,
    advancePlayback,
  };
}
