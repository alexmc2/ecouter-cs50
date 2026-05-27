import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type AppButtonVariant = 'primary' | 'secondary' | 'ghost';

interface AppButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: AppButtonVariant;
}

export function AppButton({
  children,
  className = '',
  variant = 'secondary',
  ...buttonProps
}: PropsWithChildren<AppButtonProps>) {
  return (
    <button
      className={`app-button app-button--${variant} ${className}`}
      {...buttonProps}
    >
      {children}
    </button>
  );
}
