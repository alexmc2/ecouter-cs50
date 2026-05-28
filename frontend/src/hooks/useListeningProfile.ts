
import { useEffect, useState } from 'react';
import {
  DEFAULT_LISTENING_PROFILE,
  LISTENING_PROFILE_PRESETS,
} from '../constants/listeningProfileDefaults';
import {
  createDefaultListeningProfile,
  readListeningProfile,
  writeListeningProfile,
} from '../storage/listeningProfileStorage';
import type {
  ListeningProfile,
  ListeningProfilePreset,
  ListeningProfileItem,
  ListeningProfileItemTemplate,
} from '../types/listeningProfile';
import { reorderArray } from '../utils/reorderArray';

const CUSTOM_PROFILE_ID = 'custom-profile';

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

function markAsCustomProfile(profile: ListeningProfile): ListeningProfile {
  if (profile.id === CUSTOM_PROFILE_ID) {
    return profile;
  }

  return {
    ...profile,
    id: CUSTOM_PROFILE_ID,
    name: 'Custom profile',
  };
}

export function useListeningProfile() {
  const [profile, setProfile] = useState<ListeningProfile>(() =>
    readListeningProfile(),
  );
  const activeProfile = normalizeBuiltInProfile(profile);

  useEffect(() => {
    if (activeProfile !== profile) {
      setProfile(activeProfile);
    }

    writeListeningProfile(activeProfile);
  }, [activeProfile, profile]);

  function addStep(stepTemplate: ListeningProfileItemTemplate): void {
    setProfile((currentProfile) =>
      markAsCustomProfile({
        ...currentProfile,
        steps: [...currentProfile.steps, cloneStep(stepTemplate)],
      }),
    );
  }

  function removeStep(stepId: string): void {
    setProfile((currentProfile) =>
      markAsCustomProfile({
        ...currentProfile,
        steps: currentProfile.steps.filter((step) => step.id !== stepId),
      }),
    );
  }

  function duplicateStep(step: ListeningProfileItem): void {
    setProfile((currentProfile) => {
      const index = currentProfile.steps.findIndex(
        (item) => item.id === step.id,
      );
      const steps = [...currentProfile.steps];

      steps.splice(index + 1, 0, cloneStep(step));

      return markAsCustomProfile({ ...currentProfile, steps });
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

      return markAsCustomProfile({
        ...currentProfile,
        steps: reorderArray(currentProfile.steps, fromIndex, toIndex),
      });
    });
  }

  function applyPreset(preset: ListeningProfilePreset): void {
    setProfile(profileFromPreset(preset));
  }

  function resetProfile(): void {
    setProfile(createDefaultListeningProfile());
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
