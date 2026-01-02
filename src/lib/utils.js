import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString) {
  return new Date(dateString).toLocaleString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatPhoneNumber(phone) {
  if (!phone) return '';
  // Format +2348012345678 to +234 801 234 5678
  if (phone.startsWith('+234')) {
    const rest = phone.substring(4);
    return `+234 ${rest.substring(0, 3)} ${rest.substring(3, 6)} ${rest.substring(6)}`;
  }
  return phone;
}
