import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Conflict-safe conditional class names: clsx for conditions,
 * tailwind-merge so later classes win over earlier conflicting ones.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
