import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDate, formatDistanceToNowStrict } from 'date-fns';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function formatRelativeDate(from: string | Date) {
  const date = from instanceof Date ? from : new Date(from);
  const currentDate = new Date();

  if (currentDate.getTime() - date.getTime() < 24 * 60 * 60 * 1000) {
    return formatDistanceToNowStrict(date, { addSuffix: true });
  } else {
    if (currentDate.getFullYear() === date.getFullYear()) {
      return formatDate(date, 'MMM d');
    } else {
      return formatDate(date, 'MMM d, yyy');
    }
  }
}
export function formatNumber(n: number): string {
  return Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(n);
}
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^a-z0-9-]/g, '');
}
