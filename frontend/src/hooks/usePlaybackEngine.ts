
import { useCallback, useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../api/client";
import type { CurrentRun } from "../types/currentRun";
import type { ListeningProfile } from "../types/listeningProfile";
import { getAudioUrlForStep } from "../utils/getAudioUrlForStep";

interface PlaybackProgress {
  runId: string | null;
  currentSentenceIndex: number;
  currentStepIndex: number;
  isPlaying: boolean;
}

function createInitialProgress(runId: string | null): PlaybackProgress {
  return {
    runId,
    currentSentenceIndex: 0,
    currentStepIndex: 0,
    isPlaying: false
  };
}

function clampIndex(index: number, itemCount: number): number {
  return itemCount > 0 ? Math.min(index, itemCount - 1) : 0;
}

function clampProgress(
  progress: PlaybackProgress,
  sentenceCount: number,
  stepCount: number
): PlaybackProgress {
  return {
    ...progress,
    currentSentenceIndex: clampIndex(progress.currentSentenceIndex, sentenceCount),
    currentStepIndex: clampIndex(progress.currentStepIndex, stepCount)
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
  listeningProfile: ListeningProfile
) {
  const currentRunId = currentRun?.id ?? null;
  const [storedProgress, setStoredProgress] = useState(() =>
    createInitialProgress(currentRunId)
  );
  const [loopRun, setLoopRun] = useState(true);
  const progress =
    storedProgress.runId === currentRunId
      ? storedProgress
      : createInitialProgress(currentRunId);

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

  const updateProgress = useCallback((
    update: (progress: PlaybackProgress) => PlaybackProgress
  ): void => {
    setStoredProgress((stored) => {
      const activeProgress =
        stored.runId === currentRunId
          ? stored
          : createInitialProgress(currentRunId);

      return update(clampProgress(activeProgress, sentenceCount, stepCount));
    });
  }, [currentRunId, sentenceCount, stepCount]);

  function togglePlaying(): void {
    updateProgress((progress) => ({
      ...progress,
      isPlaying: progress.isPlaying ? false : canPlay
    }));
  }

  function moveToSentence(index: number): void {
    const nextIndex = Math.max(0, Math.min(sentenceCount - 1, index));

    updateProgress((progress) => ({
      ...progress,
      currentSentenceIndex: nextIndex,
      currentStepIndex: 0,
      isPlaying: false
    }));
  }

  function moveToStep(index: number): void {
    const nextIndex = Math.max(0, Math.min(stepCount - 1, index));

    updateProgress((progress) => ({
      ...progress,
      currentStepIndex: nextIndex,
      isPlaying: progress.isPlaying && canPlay
    }));
  }

  const stopPlayback = useCallback(() => {
    updateProgress((progress) => ({
      ...progress,
      isPlaying: false
    }));
  }, [updateProgress]);

  const advancePlayback = useCallback(() => {
    updateProgress((progress) => {
      if (!canPlay) {
        return {
          ...progress,
          currentSentenceIndex: 0,
          currentStepIndex: 0,
          isPlaying: false
        };
      }

      if (progress.currentStepIndex + 1 < stepCount) {
        return {
          ...progress,
          currentStepIndex: progress.currentStepIndex + 1
        };
      }

      if (progress.currentSentenceIndex + 1 < sentenceCount) {
        return {
          ...progress,
          currentSentenceIndex: progress.currentSentenceIndex + 1,
          currentStepIndex: 0
        };
      }

      if (loopRun) {
        return {
          ...progress,
          currentSentenceIndex: 0,
          currentStepIndex: 0
        };
      }

      return {
        ...progress,
        isPlaying: false
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

    if (currentStep.type === "pause") {
      const timer = window.setTimeout(advancePlayback, currentStep.durationMs);

      return () => window.clearTimeout(timer);
    }

    if (!currentAudioUrl) {
      const timer = window.setTimeout(advancePlayback, 0);

      return () => window.clearTimeout(timer);
    }

    let cancelled = false;
    const audio = new Audio(currentAudioUrl);

    audio.preload = "auto";

    function handleEnded(): void {
      advancePlayback();
    }

    function handleError(): void {
      stopPlayback();
    }

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    void audio.play().catch(() => {
      if (!cancelled) {
        stopPlayback();
      }
    });

    return () => {
      cancelled = true;
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    };
  }, [
    advancePlayback,
    currentAudioUrl,
    currentStep,
    isPlaying,
    stopPlayback
  ]);

  return {
    currentSentenceIndex,
    currentStepIndex,
    currentSentence,
    currentStep,
    currentAudioUrl,
    isPlaying,
    loopRun,
    togglePlaying,
    setLoopRun,
    moveToSentence,
    moveToStep,
    advancePlayback
  };
}
