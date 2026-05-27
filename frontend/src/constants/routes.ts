export const SCREENS = {
  HOME: 'home',
  LIBRARY: 'library',
  PLAYER: 'player',
  SETTINGS: 'settings',
} as const;

export type ScreenId = (typeof SCREENS)[keyof typeof SCREENS];
