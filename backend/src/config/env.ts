import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const defaultCorsOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];

function parseCorsOrigins(value: string | undefined): string[] {
  if (!value) {
    return defaultCorsOrigins;
  }

  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export const env = {
  port: Number(process.env.PORT ?? 3001),
  corsOrigins: parseCorsOrigins(process.env.CORS_ORIGIN),
};
