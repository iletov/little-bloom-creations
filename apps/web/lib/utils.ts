import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//Need to clean
export function expiredDate(date: string) {
  const today = new Date();
  const eventDate = new Date(date ?? '');
  if (eventDate < today) {
    return true;
  }
  return false;
}
