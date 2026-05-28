export type ThemeName = 'dark' | 'light';

export interface AppSettings {
  theme: ThemeName;
  defaultRunSize: number;
  autoHideText: boolean;
}
