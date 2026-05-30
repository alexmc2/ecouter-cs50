export type ThemeName = 'dark' | 'light';

export interface AppSettings {
  theme: ThemeName;
  defaultRunSize: number;
  autoShowFrenchText: boolean;
  autoShowEnglishText: boolean;
}
