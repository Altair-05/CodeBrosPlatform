
import React, { useState } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { Header } from './header';

export const HeaderWithNotifications: React.FC = () => {
  const { data: notificationCount = 0 } = useNotifications();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log("Search:", query);
  };

  return (
    <Header 
      notificationCount={notificationCount} 
      onSearch={handleSearch}
      setnotificationCount={() => {}}
    />
  );
};
