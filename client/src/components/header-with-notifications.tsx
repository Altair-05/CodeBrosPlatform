import React, { useState, useEffect } from "react";
import { Header } from "./header";
import { useNotifications } from "../hooks/useNotifications";

interface HeaderWithNotificationsProps {
  onSearch?: (query: string) => void;
}

export const HeaderWithNotifications: React.FC<HeaderWithNotificationsProps> = ({ onSearch }) => {
  const { data: hookNotificationCount = 0 } = useNotifications();
  const [notificationCount, setNotificationCount] = useState<number>(hookNotificationCount);

  // Keep state in sync with hook
  useEffect(() => {
    setNotificationCount(hookNotificationCount);
  }, [hookNotificationCount]);

  return (
    <Header
      notificationCount={notificationCount}
      setnotificationCount={setNotificationCount} // optional in Header
      onSearch={onSearch ?? ((query) => console.log("Search:", query))}
    />
  );
};
