// AI assisted in writing this test file for the audio HTTP routes.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { app } from '../src/app';

const previousAudioRootPath = process.env.AUDIO_ROOT_PATH;

let audioRootPath: string;

// mock wav file bytes for testing the audio route.
const wavBytes = Buffer.from([
  0x52, 0x49, 0x46, 0x46, 0x26, 0x00, 0x00, 0x00, 0x57, 0x41, 0x56, 0x45, 0x66,
  0x6d, 0x74, 0x20, 0x10, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x40, 0x1f,
  0x00, 0x00, 0x80, 0x3e, 0x00, 0x00, 0x02, 0x00, 0x10, 0x00, 0x64, 0x61, 0x74,
  0x61, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00,
]);

// custom response parser that handles the binary data response for the audio file route. Supertest doesn't have built in support for this.

function parseBinaryResponse(
  response: request.Response,
  callback: (error: Error | null, body?: Buffer) => void,
): void {
  const chunks: Buffer[] = [];

  response.on('data', (chunk: Buffer | string) => {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  });

  response.on('end', () => {
    callback(null, Buffer.concat(chunks));
  });

  response.on('error', (error) => {
    callback(error);
  });
}

describe('audio routes', () => {
  beforeEach(() => {
    audioRootPath = fs.mkdtempSync(
      path.join(os.tmpdir(), 'ecouter-audio-test-'),
    );
    const voicePath = path.join(audioRootPath, 'fr_f');

    fs.mkdirSync(voicePath);
    fs.writeFileSync(path.join(voicePath, '8000_fr_f.wav'), wavBytes);
    process.env.AUDIO_ROOT_PATH = audioRootPath;
  });

  afterEach(() => {
    fs.rmSync(audioRootPath, { force: true, recursive: true });

    if (previousAudioRootPath === undefined) {
      delete process.env.AUDIO_ROOT_PATH;
      return;
    }

    process.env.AUDIO_ROOT_PATH = previousAudioRootPath;
  });

  it('serves a wav file that exists on disk', async () => {
    const response = await request(app)
      .get('/api/audio/fr_f/8000_fr_f.wav')
      .buffer(true)
      .parse(parseBinaryResponse)
      .expect(200);

    expect(response.headers['content-type']).toMatch(/^audio\//);
    expect(response.body).toEqual(wavBytes);
  });

  it('tells the client when the requested wav file is missing', async () => {
    const response = await request(app)
      .get('/api/audio/fr_f/missing_fr_f.wav')
      .expect(404);

    expect(response.body).toEqual({
      error: {
        message: 'Audio file fr_f/missing_fr_f.wav was not found.',
        statusCode: 404,
      },
    });
  });

  it('rejects filenames that are not local wav files', async () => {
    const response = await request(app)
      .get('/api/audio/fr_f/8000_fr_f.mp3')
      .expect(400);

    expect(response.body).toEqual({
      error: {
        message: 'The audio file name is invalid. ',
        statusCode: 400,
      },
    });
  });
});
