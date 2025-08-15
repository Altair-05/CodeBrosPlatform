import React from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { Header } from './header';

export const HeaderWithNotifications = () => {
  const { data: notificationCount = 0 } = useNotifications();

  return (
    <Header
      notificationCount={notificationCount}
      onSearch={query => console.log('Search:', query)}
    />
  );
};
