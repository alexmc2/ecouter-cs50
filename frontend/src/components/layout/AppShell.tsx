import type { PropsWithChildren } from 'react';
import { SCREENS, type ScreenId } from '../../constants/routes';
import { useResponsive } from '../../hooks/useResponsive';
import { BottomNav } from './BottomNav';
import { DesktopNav } from './DesktopNav';

interface AppShellProps {
  screen: ScreenId;
  canOpenPlayer: boolean;
  onNavigate: (screen: ScreenId) => void;
}

export function AppShell({
  children,
  screen,
  canOpenPlayer,
  onNavigate,
}: PropsWithChildren<AppShellProps>) {
  const { isDesktop } = useResponsive();
  const isPlayerScreen = screen === SCREENS.PLAYER;
  const shellClassName = isPlayerScreen
    ? 'app-shell app-shell--player'
    : 'app-shell';

  return (
    <div className={shellClassName}>
      {isDesktop ? (
        <DesktopNav
          screen={screen}
          canOpenPlayer={canOpenPlayer}
          onNavigate={onNavigate}
        />
      ) : null}
      <div className="app-shell__content">{children}</div>
      {!isDesktop ? (
        <BottomNav
          screen={screen}
          canOpenPlayer={canOpenPlayer}
          onNavigate={onNavigate}
        />
      ) : null}
    </div>
  );
}
