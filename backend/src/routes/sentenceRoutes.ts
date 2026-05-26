import { Router } from 'express';
import {
  getRanges,
  getSentence,
  getSentences,
} from '../controllers/sentenceController';

export const sentenceRoutes = Router();


//sentence endpoints
sentenceRoutes.get('/api/sentences', getSentences);
sentenceRoutes.get('/api/sentence-ranges', getRanges);
sentenceRoutes.get('/api/sentences/:sentenceId', getSentence);
