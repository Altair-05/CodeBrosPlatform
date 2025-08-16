import { useQuery } from '@tanstack/react-query';

const fetchNotificationCount = async () => {
  const response = await fetch('/api/notifications/count');
  if (!response.ok) {
    throw new Error('Failed to fetch notification count');
  }
  const data = await response.json();
  return data.count;
};

export const useNotifications = () => {
  return useQuery<number>({
    queryKey: ['notification-count'],
    queryFn: fetchNotificationCount,
  });
};
