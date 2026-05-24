import dotenv from 'dotenv';

dotenv.config({ quiet: true });

export const env = {
  port: Number(process.env.PORT ?? 3001),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://127.0.0.1:5173',
};
