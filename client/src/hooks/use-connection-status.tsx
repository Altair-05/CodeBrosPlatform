import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { User, Connection } from "@shared/types";
import { useAuth } from "./use-auth";

export type ConnectionStatus = "self" | "connected" | "pending" | "none";

interface UseConnectionStatusReturn {
  connectionStatus: ConnectionStatus;
  isLoading: boolean;
  currentUserConnections: Connection[];
}

/**
 * Custom hook to determine the connection status between the current user and a target user.
 * Returns one of four statuses: "self", "connected", "pending", or "none".
 */
export function useConnectionStatus(targetUser: User | null | undefined): UseConnectionStatusReturn {
  const { currentUserId, isLoadingAuth } = useAuth();

  // Fetch connections for the currently logged-in user to determine connection status
  const { data: currentUserConnections = [], isLoading: isLoadingConnections } = useQuery<Connection[]>({
    queryKey: ["currentUserConnections", currentUserId],
    queryFn: async () => {
      if (!currentUserId) return [];
      const response = await fetch(`/api/connections/user/${currentUserId}`);
      if (!response.ok) {
        return [];
      }
      return response.json();
    },
    enabled: !!currentUserId && !isLoadingAuth,
  });

  // Calculate connection status between current user and the target user
  const connectionStatus = useMemo((): ConnectionStatus => {
    if (!currentUserId || !targetUser) return "none";
    if (currentUserId === targetUser.id) return "self";

    const hasPendingRequestToUser = currentUserConnections.some(
      (conn) =>
        conn.requesterId === currentUserId &&
        conn.receiverId === targetUser.id &&
        conn.status === "pending"
    );

    const hasPendingRequestFromUser = currentUserConnections.some(
      (conn) =>
        conn.requesterId === targetUser.id &&
        conn.receiverId === currentUserId &&
        conn.status === "pending"
    );

    const areConnected = currentUserConnections.some(
      (conn) =>
        ((conn.requesterId === currentUserId &&
          conn.receiverId === targetUser.id) ||
          (conn.requesterId === targetUser.id &&
            conn.receiverId === currentUserId)) &&
        conn.status === "accepted"
    );

    if (areConnected) return "connected";
    if (hasPendingRequestToUser || hasPendingRequestFromUser) return "pending";
    return "none";
  }, [currentUserId, targetUser, currentUserConnections]);

  return {
    connectionStatus,
    isLoading: isLoadingAuth || isLoadingConnections,
    currentUserConnections,
  };
}