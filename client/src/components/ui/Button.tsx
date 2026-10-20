import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from '@/utils/cn';
import Spinner from './Spinner';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ' +
  'focus-visible:ring-offset-2 focus-visible:ring-offset-background ' +
  'disabled:pointer-events-none disabled:opacity-60';

const variantClass: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  outline: 'border border-input bg-transparent text-foreground hover:bg-muted',
  ghost: 'text-muted-foreground hover:bg-muted hover:text-foreground',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
};

const sizeClass: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-6 text-base',
  icon: 'h-9 w-9 p-0',
};

/**
 * The Button look as a class string — for an element that must stay an <a> or a
 * react-router <Link>:
 *   <Link to="/signup" className={buttonClass({ size: 'sm' })}>Sign up</Link>
 */
export function buttonClass(
  opts: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {},
): string {
  const { variant = 'primary', size = 'md', className } = opts;
  return cn(base, variantClass[variant], sizeClass[size], className);
}

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner and disables the button. */
  loading?: boolean;
}

/** Every clickable action in the app. An icon-only button is size="icon". */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading = false, disabled, className, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={buttonClass({ variant, size, className })}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <Spinner size="sm" className="border-current border-t-transparent" />}
      {children}
    </button>
  );
});

export default Button;
