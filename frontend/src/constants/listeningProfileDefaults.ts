import type {
  AudioSource,
  ListeningProfile,
  ListeningProfileItemTemplate,
  ListeningProfilePreset,
} from "../types/listeningProfile";

const AUDIO_LABELS: Record<AudioSource, string> = {
  fr_female: "French female",
  fr_male: "French male",
  en_female: "English female",
  en_male: "English male",
};

function audioStep(source: AudioSource): ListeningProfileItemTemplate {
  return {
    type: "audio",
    source,
    label: AUDIO_LABELS[source],
  };
}

function pauseStep(durationMs: number): ListeningProfileItemTemplate {
  return {
    type: "pause",
    durationMs,
    label: `Pause ${durationMs / 1000}s`,
  };
}

function repeatedFrenchWithTranslation(
  frenchSource: "fr_female" | "fr_male",
  englishSource: "en_female" | "en_male",
  repetitions: number,
  pauseMs: number,
): ListeningProfileItemTemplate[] {
  const steps: ListeningProfileItemTemplate[] = [];

  for (let index = 0; index < repetitions; index += 1) {
    steps.push(audioStep(frenchSource));
    steps.push(pauseStep(pauseMs));
  }

  steps.push(audioStep(englishSource));

  return steps;
}

export const DEFAULT_LISTENING_PROFILE: ListeningProfile = {
  id: "default-male-five-translate",
  name: "Male 5x + translation",
  steps: repeatedFrenchWithTranslation("fr_male", "en_male", 5, 3000).map(
    (step, index) => ({
      ...step,
      id: `default-step-${index + 1}`,
    }),
  ),
};

export const LISTENING_PROFILE_PRESETS: ListeningProfilePreset[] = [
  {
    id: "male-five-translate",
    name: "Male 5x + translation",
    description: "French male five times, 3s gaps, English male",
    steps: repeatedFrenchWithTranslation("fr_male", "en_male", 5, 3000),
  },
  {
    id: "female-five-translate",
    name: "Female 5x + translation",
    description: "French female five times, 3s gaps, English female",
    steps: repeatedFrenchWithTranslation("fr_female", "en_female", 5, 3000),
  },
  {
    id: "male-three-translate",
    name: "Male 3x + translation",
    description: "French male three times, 2s gaps, English male",
    steps: repeatedFrenchWithTranslation("fr_male", "en_male", 3, 2000),
  },
  {
    id: "female-three-translate",
    name: "Female 3x + translation",
    description: "French female three times, 2s gaps, English female",
    steps: repeatedFrenchWithTranslation("fr_female", "en_female", 3, 2000),
  },
];
