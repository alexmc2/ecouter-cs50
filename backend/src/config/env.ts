import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const defaultCorsOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
const defaultPort = 3001;
const defaultHost = '0.0.0.0';

function parsePort(value: string | undefined): number {
  if (!value) {
    return defaultPort;
  }

  const port = Number(value);

  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error(`PORT must be a valid TCP port. Received: ${value}`);
  }

  return port;
}

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
  port: parsePort(process.env.PORT),
  host: process.env.HOST ?? defaultHost,
  corsOrigins: parseCorsOrigins(process.env.CORS_ORIGIN),
};
