import fs from 'node:fs';
import path from 'node:path';
import {
  ALLOWED_VOICE_FOLDERS,
  type VoiceFolderName,
} from '../utils/buildAudioPath';

export function isAllowedVoiceFolder(voice: string): voice is VoiceFolderName {
  return ALLOWED_VOICE_FOLDERS.includes(voice as VoiceFolderName);
}

export function getAudioRootPath(): string {
  return (
    process.env.AUDIO_ROOT_PATH ?? path.resolve(process.cwd(), '../data/audio')
  );
}

export function getAudioFilePath(voice: string, filename: string): string {
  if (!isAllowedVoiceFolder(voice)) {
    throw Object.assign(new Error('This audio voice folder is not allowed.'), {
      statusCode: 400,
    });
  }

  if (
    !filename.endsWith('.wav') ||
    filename.includes('/') ||
    filename.includes('\\')
  ) {
    throw Object.assign(new Error('The audio file name is invalid. '), {
      statusCode: 400,
    });
  }

  return path.resolve(getAudioRootPath(), voice, filename);
}

export function audioFileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}
