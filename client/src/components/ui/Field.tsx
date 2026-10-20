import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface FieldProps {
  label: string;
  /** id of the control inside — set the same value as the control's `id`. */
  htmlFor?: string;
  error?: string | null;
  hint?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

/** Label + control + validation message. Wrap every form control in one. */
export default function Field({
  label,
  htmlFor,
  error,
  hint,
  required,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
