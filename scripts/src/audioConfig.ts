const DEFAULT_AUDIO_PUBLIC_BASE_URL =
  'https://pub-dca31549dda047e2b97316f5ee5259d1.r2.dev';
const DEFAULT_AUDIO_ID_WIDTH = 6;

export function envValue(name: string): string | undefined {
  const value = process.env[name];
  return value && value.length > 0 ? value : undefined;
}

export function audioIdWidth(): number {
  const rawWidth = envValue('AUDIO_ID_WIDTH') ?? envValue('R2_AUDIO_ID_WIDTH');
  const width = rawWidth ? Number.parseInt(rawWidth, 10) : DEFAULT_AUDIO_ID_WIDTH;

  if (!Number.isFinite(width) || width < 1) {
    return DEFAULT_AUDIO_ID_WIDTH;
  }

  return width;
}

export function audioPublicBaseUrl(): string {
  return (
    envValue('AUDIO_PUBLIC_BASE_URL') ??
    envValue('R2_PUBLIC_BASE_URL') ??
    DEFAULT_AUDIO_PUBLIC_BASE_URL
  ).replace(/\/+$/, '');
}

export function audioPublicPrefix(): string {
  return (envValue('AUDIO_R2_PREFIX') ?? envValue('R2_PREFIX') ?? '').replace(
    /^\/+|\/+$/g,
    '',
  );
}

export function audioFilename(id: number, suffix: string): string {
  return `${String(id).padStart(audioIdWidth(), '0')}_${suffix}.wav`;
}

export function audioPublicUrl(filePath: string): string {
  const normalizedPath = filePath.replace(/^\/+/, '');
  const prefix = audioPublicPrefix();
  const publicPath = prefix ? `${prefix}/${normalizedPath}` : normalizedPath;

  return `${audioPublicBaseUrl()}/${publicPath}`;
}
