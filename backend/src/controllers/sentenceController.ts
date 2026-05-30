import type { NextFunction, Request, Response } from 'express';
import {
  getPaginatedSentences,
  getSentenceById,
  getSentenceRanges,
  getSentencesFromPosition,
} from '../services/sentenceService';

function readNumberParam(value: unknown, fallback: number): number {
  const firstValue = Array.isArray(value) ? value[0] : value;
  // Parses numeric strings and return a number or fallback value
  const parsed = Number(firstValue);
  // returns false for invalid (infinite) numbers
  return Number.isFinite(parsed) ? parsed : fallback;
}

//Handles HTTP requests and responses for the sentence endpoints.

//retrives a paginated list of sentences
export function getSentences(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const page = readNumberParam(req.query.page, 1);
    const limit = readNumberParam(req.query.limit, 100);
    const startPosition = readNumberParam(req.query.startPosition, Number.NaN);

    res.json(
      Number.isFinite(startPosition)
        ? getSentencesFromPosition(startPosition, limit)
        : getPaginatedSentences(page, limit),
    );
  } catch (error) {
    next(error);
  }
}
// retrieves a single sentece by its ID and returns it as JSON.
export function getSentence(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const sentenceId = Number(req.params.sentenceId);
    const sentence = getSentenceById(sentenceId);

    if (!sentence) {
      res.status(404).json({
        error: {
          message: `Sentence ${req.params.sentenceId} doesn't exist. Please reload the page to see the updated sentence library.`,
          statusCode: 404,
        },
      });
      return;
    }

    res.json(sentence);
  } catch (error) {
    next(error);
  }
}

// retrieves sentence ranges and returns them as JSON.
export function getRanges(
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    res.json(getSentenceRanges());
  } catch (error) {
    next(error);
  }
}
