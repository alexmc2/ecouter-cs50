import type { NextFunction, Request, Response } from 'express';
import { audioFileExists, getAudioFilePath } from '../services/audioService';

type AudioParams = {
  voice: string;
  filename: string;
};

// the audio controller handles HTTP requests for serving audio files. 
export function serveAudio(
  req: Request<AudioParams>,
  res: Response,
  next: NextFunction,
): void {
  try {
    const { voice, filename } = req.params;
    const filePath = getAudioFilePath(voice, filename);
    console.log(`Serving audio file: ${filePath}`);

    if (!audioFileExists(filePath)) {
      res.status(404).json({
        error: {
          message: `Audio file ${voice}/${filename} was not found.`,
          statusCode: 404,
        },
      });
      return;
    }

    res.sendFile(filePath);
  } catch (error) {
    next(error);
  }
}
