import { describe, expect, it } from 'vitest';
import {
  getAllSentences,
  getSentenceRanges,
} from '../src/services/sentenceService';

// this file tests the sentence service, which loads the sentences from the local JSON library and maps them to the data shape used by the application. It also checks that the audio URLs are correctly generated from the sentence ID.

describe('sentence service', () => {
  it('loads sentences from the local JSON library', () => {
    const sentences = getAllSentences();

    expect(sentences.length).toBeGreaterThan(0);
  });

  it('maps the first raw sentence into the app shape', () => {
    const firstSentence = getAllSentences()[0];

    expect(firstSentence).toMatchObject({
      id: 3000,
      frText: 'Allons-y !',
      enText: 'Go!',
      enCharLength: 3,
      position: 1,
    });
  });

  it('adds local audio URLs from the stable sentence ID', () => {
    const firstSentence = getAllSentences()[0];

    expect(firstSentence.frFemaleAudioUrl).toBe(
      '/api/audio/fr_f/3000_fr_f.wav',
    );
    expect(firstSentence.frMaleAudioUrl).toBe('/api/audio/fr_m/3000_fr_m.wav');
    expect(firstSentence.enFemaleAudioUrl).toBe(
      '/api/audio/en_f/3000_en_f.wav',
    );
    expect(firstSentence.enMaleAudioUrl).toBe('/api/audio/en_m/3000_en_m.wav');
  });

  it('adds French preview text to sentence ranges', () => {
    const sentences = getAllSentences();
    const firstRange = getSentenceRanges()[0];

    expect(firstRange).toMatchObject({
      startPosition: 1,
      endPosition: 100,
      firstFrText: sentences[0]?.frText,
      lastFrText: sentences[99]?.frText,
    });
  });
});
