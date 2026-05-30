// // AI assisted with the audio path tests.
// import { describe, expect, it } from 'vitest';
// import { buildAudioFilename, buildAudioUrl } from '../src/utils/buildAudioPath';

// describe('audio path helpers', () => {
//   it('returns the French female filename for a sentence ID', () => {
//     expect(buildAudioFilename(8000, 'fr_female')).toBe('8000_fr_f.wav');
//   });

//   it('returns the French male filename for a sentence ID', () => {
//     expect(buildAudioFilename(8000, 'fr_male')).toBe('8000_fr_m.wav');
//   });

//   it('returns the English female filename for a sentence ID', () => {
//     expect(buildAudioFilename(8000, 'en_female')).toBe('8000_en_f.wav');
//   });

//   it('returns the English male filename for a sentence ID', () => {
//     expect(buildAudioFilename(8000, 'en_male')).toBe('8000_en_m.wav');
//   });

//   it('returns the local API audio URL for a sentence ID', () => {
//     expect(buildAudioUrl(8000, 'fr_female')).toBe(
//       '/api/audio/fr_f/8000_fr_f.wav',
//     );
//   });
// });
