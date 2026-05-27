import type { PropsWithChildren } from 'react';
import { type ScreenId } from '../../constants/routes';
import { useResponsive } from '../../hooks/useResponsive';
import { BottomNav } from './BottomNav';
import { DesktopNav } from './DesktopNav';

interface AppShellProps {
  screen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
}

export function AppShell({
  children,
  screen,
  onNavigate,
}: PropsWithChildren<AppShellProps>) {
  const { isDesktop } = useResponsive();

  return (
    <div className="app-shell">
      {isDesktop ? (
        <DesktopNav screen={screen} onNavigate={onNavigate} />
      ) : null}
      <div className="app-shell__content">{children}</div>
      {!isDesktop ? (
        <BottomNav screen={screen} onNavigate={onNavigate} />
      ) : null}
    </div>
  );
}
