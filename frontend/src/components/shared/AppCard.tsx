import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  PropsWithChildren,
} from 'react';

type AppCardProps = PropsWithChildren<
  HTMLAttributes<HTMLDivElement> & {
    asButton?: false;
  }
>;

type AppCardButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    asButton: true;
  }
>;

export function AppCard(props: AppCardProps | AppCardButtonProps) {
  if (props.asButton) {
    const {
      asButton: _asButton,
      children,
      className = '',
      ...buttonProps
    } = props;

    return (
      <button
        className={`app-card app-card--button ${className}`}
        {...buttonProps}
      >
        {children}
      </button>
    );
  }

  const { asButton: _asButton, children, className = '', ...divProps } = props;

  return (
    <div className={`app-card ${className}`} {...divProps}>
      {children}
    </div>
  );
}
