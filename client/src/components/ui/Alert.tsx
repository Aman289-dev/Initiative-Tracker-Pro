import type { ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

export type AlertVariant = 'error' | 'success' | 'warning' | 'info';

const variantClass: Record<AlertVariant, string> = {
  error: 'border-destructive/30 bg-destructive/10 text-destructive',
  success: 'border-success/30 bg-success/10 text-success',
  warning: 'border-warning/30 bg-warning/10 text-warning',
  info: 'border-border bg-muted text-muted-foreground',
};

const icons: Record<AlertVariant, typeof Info> = {
  error: XCircle,
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
};

export interface AlertProps {
  variant?: AlertVariant;
  className?: string;
  children: ReactNode;
}

/** Inline status banner: form errors, save confirmations, empty-result notices. */
export default function Alert({ variant = 'error', className, children }: AlertProps) {
  const Icon = icons[variant];
  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-2 rounded-lg border px-3 py-2 text-sm',
        variantClass[variant],
        className,
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
