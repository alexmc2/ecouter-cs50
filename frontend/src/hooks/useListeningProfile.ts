
import { useState } from 'react';
import {
  DEFAULT_LISTENING_PROFILE,
  LISTENING_PROFILE_PRESETS,
} from '../constants/listeningProfileDefaults';
import type {
  ListeningProfile,
  ListeningProfilePreset,
  ListeningProfileItem,
  ListeningProfileItemTemplate,
} from '../types/listeningProfile';
import { reorderArray } from '../utils/reorderArray';

function createStepId(): string {
  return `step-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function cloneStep(
  step: ListeningProfileItem | ListeningProfileItemTemplate,
): ListeningProfileItem {
  return {
    ...step,
    id: createStepId(),
  } as ListeningProfileItem;
}

function profileFromPreset(preset: ListeningProfilePreset): ListeningProfile {
  return {
    id: preset.id,
    name: preset.name,
    steps: preset.steps.map(cloneStep),
  };
}

function stepsMatch(
  step: ListeningProfileItem,
  template: ListeningProfileItem | ListeningProfileItemTemplate,
): boolean {
  if (step.type !== template.type) {
    return false;
  }

  if (step.type === 'pause' && template.type === 'pause') {
    return step.durationMs === template.durationMs;
  }

  if (step.type === 'audio' && template.type === 'audio') {
    return step.source === template.source;
  }

  return false;
}

function getBuiltInSteps(
  profile: ListeningProfile,
): Array<ListeningProfileItem | ListeningProfileItemTemplate> | null {
  if (profile.id === DEFAULT_LISTENING_PROFILE.id) {
    return DEFAULT_LISTENING_PROFILE.steps;
  }

  return (
    LISTENING_PROFILE_PRESETS.find((preset) => preset.id === profile.id)
      ?.steps ?? null
  );
}

function normalizeBuiltInProfile(profile: ListeningProfile): ListeningProfile {
  const builtInSteps = getBuiltInSteps(profile);

  if (!builtInSteps || profile.steps.length >= builtInSteps.length) {
    return profile;
  }

  const matchesCurrentPrefix = profile.steps.every((step, index) =>
    stepsMatch(step, builtInSteps[index]),
  );

  if (!matchesCurrentPrefix) {
    return profile;
  }

  return {
    ...profile,
    steps: [
      ...profile.steps,
      ...builtInSteps.slice(profile.steps.length).map(cloneStep),
    ],
  };
}

export function useListeningProfile() {
  const [profile, setProfile] = useState<ListeningProfile>(() => ({
    ...DEFAULT_LISTENING_PROFILE,
    steps: DEFAULT_LISTENING_PROFILE.steps.map(cloneStep),
  }));
  const activeProfile = normalizeBuiltInProfile(profile);

  function addStep(stepTemplate: ListeningProfileItemTemplate): void {
    setProfile((currentProfile) => ({
      ...currentProfile,
      steps: [...currentProfile.steps, cloneStep(stepTemplate)],
    }));
  }

  function removeStep(stepId: string): void {
    setProfile((currentProfile) => ({
      ...currentProfile,
      steps: currentProfile.steps.filter((step) => step.id !== stepId),
    }));
  }

  function duplicateStep(step: ListeningProfileItem): void {
    setProfile((currentProfile) => {
      const index = currentProfile.steps.findIndex(
        (item) => item.id === step.id,
      );
      const steps = [...currentProfile.steps];

      steps.splice(index + 1, 0, cloneStep(step));

      return { ...currentProfile, steps };
    });
  }

  function moveStep(stepId: string, direction: 'up' | 'down'): void {
    setProfile((currentProfile) => {
      const fromIndex = currentProfile.steps.findIndex(
        (step) => step.id === stepId,
      );

      if (fromIndex === -1) {
        return currentProfile;
      }

      const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;

      if (toIndex < 0 || toIndex >= currentProfile.steps.length) {
        return currentProfile;
      }

      return {
        ...currentProfile,
        steps: reorderArray(currentProfile.steps, fromIndex, toIndex),
      };
    });
  }

  function applyPreset(preset: ListeningProfilePreset): void {
    setProfile(profileFromPreset(preset));
  }

  function resetProfile(): void {
    setProfile({
      ...DEFAULT_LISTENING_PROFILE,
      steps: DEFAULT_LISTENING_PROFILE.steps.map(cloneStep),
    });
  }

  return {
    profile: activeProfile,
    presets: LISTENING_PROFILE_PRESETS,
    addStep,
    removeStep,
    duplicateStep,
    moveStep,
    applyPreset,
    resetProfile,
  };
}
