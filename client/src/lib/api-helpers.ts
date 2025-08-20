import { apiRequest } from "./queryClient";

/**
 * Send a connection request to another user
 */
export async function sendConnectionRequest(requesterId: string, receiverId: string, message?: string) {
  try {
    const response = await apiRequest("POST", "/api/connections", {
      requesterId,
      receiverId,
      message: message || ""
    });
    
    return await response.json();
  } catch (error) {
    console.error('Failed to send connection request:', error);
    throw error;
  }
}

/**
 * Update connection status (accept/decline)
 */
export async function updateConnectionStatus(connectionId: string, status: 'accepted' | 'declined') {
  try {
    const response = await apiRequest("PATCH", `/api/connections/${connectionId}/status`, {
      status
    });
    
    return await response.json();
  } catch (error) {
    console.error('Failed to update connection status:', error);
    throw error;
  }
}

/**
 * Get all connections for a user
 */
export async function getUserConnections(userId: string) {
  try {
    const response = await apiRequest("GET", `/api/connections/user/${userId}`);
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch user connections:', error);
    throw error;
  }
}

/**
 * Get pending connection requests for a user
 */
export async function getPendingConnectionRequests(userId: string) {
  try {
    const response = await apiRequest("GET", `/api/connections/pending/${userId}`);
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch pending requests:', error);
    throw error;
  }
}
