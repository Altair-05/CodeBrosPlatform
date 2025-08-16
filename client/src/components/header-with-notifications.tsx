import React from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { Header } from './header';

export const HeaderWithNotifications = () => {
  const { data: notificationCount = 0 } = useNotifications();
  const [count, setCount] = React.useState<number>(notificationCount ?? 0);

  React.useEffect(() => {
    setCount(notificationCount ?? 0);
  }, [notificationCount]);

  return (
    <Header
      notificationCount={count}
      setnotificationCount={setCount}
      onSearch={query => console.log('Search:', query)}
    />
  );
};
