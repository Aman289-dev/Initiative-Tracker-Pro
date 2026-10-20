import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/utils/cn';

export type CardProps = ComponentPropsWithoutRef<'div'>;

/**
 * Bordered surface: content card, dashboard tile, form panel, list row.
 * Pass padding and layout through className — <Card className="p-4 flex gap-3">.
 */
export default function Card({ className, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card text-card-foreground shadow-sm',
        className,
      )}
      {...rest}
    />
  );
}
