import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelative(date: string | Date): string {
  if (!date) return '—';
  const d = new Date(date);
  const now = new Date();
  const diff = (now.getTime() - d.getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function formatDate(date: string | Date): string {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatNumber(n: number): string {
  if (!n && n !== 0) return '—';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    posted: 'badge-blue',
    recommended: 'badge-purple',
    accepted: 'badge-green',
    volunteer_assigned: 'badge-green',
    pickup_complete: 'badge-green',
    delivered: 'badge-green',
    cancelled: 'badge-red',
    expired: 'badge-red',
    pending: 'badge-gold',
    unverified: 'badge-gray',
    verified: 'badge-green',
    trusted: 'badge-gold',
    rejected: 'badge-red',
    available: 'badge-green',
    unavailable: 'badge-red',
    critical: 'badge-red',
    high: 'badge-gold',
    medium: 'badge-blue',
    low: 'badge-gray',
    active: 'badge-green',
    inactive: 'badge-red',
  };
  return map[status] || 'badge-gray';
}

export function getDonationTypeIcon(type: string): string {
  const m: Record<string, string> = {
    cooked_meal: '🍛', dry_food: '🥜', fresh_produce: '🥬',
    ration_kit: '📦', packaged_food: '📪', mixed_pack: '🎁',
  };
  return m[type] || '🍽️';
}

export function capitalize(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
}
