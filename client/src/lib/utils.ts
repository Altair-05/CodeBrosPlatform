import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeAgo(date: Date | string): string {
  const now = new Date();
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }

  return dateObj.toLocaleDateString();
}

export function getExperienceLevelColor(level: string): string {
  switch (level) {
    case 'beginner':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    case 'intermediate':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'professional':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  }
}

export function getExperienceLevelLabel(level: string): string {
  switch (level) {
    case 'beginner':
      return 'Beginner';
    case 'intermediate':
      return 'Intermediate';
    case 'professional':
      return 'Pro';
    default:
      return level;
  }
}

export function getOnlineStatus(
  isOnline: boolean,
  lastSeen?: Date | string
): {
  color: string;
  text: string;
} {
  if (isOnline) {
    return {
      color: 'bg-green-500',
      text: 'Online',
    };
  }

  if (!lastSeen) {
    return {
      color: 'bg-gray-400',
      text: 'Offline',
    };
  }

  // Convert to Date object if it's a string
  const lastSeenDate =
    typeof lastSeen === 'string' ? new Date(lastSeen) : lastSeen;
  const diffInHours = Math.floor(
    (Date.now() - lastSeenDate.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 1) {
    return {
      color: 'bg-yellow-500',
      text: 'Last seen recently',
    };
  }

  return {
    color: 'bg-gray-400',
    text: `Last seen ${formatTimeAgo(lastSeenDate)}`,
  };
}
