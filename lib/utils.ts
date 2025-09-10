import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function expiredDate(date: string) {
  const today = new Date();
  const eventDate = new Date(date ?? '');
  if (eventDate < today) {
    return true;
  }
  return false;
}

export const formatedEvent = (event: any) => {
  const date = new Date(event ?? '');
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  const time = date.toLocaleString('default', {
    hour: 'numeric',
    minute: 'numeric',
  });

  return {
    day,
    month,
    year,
    time,
  };
};
