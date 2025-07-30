import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './use-auth';
import { useToast } from './use-toast';
import { apiRequest } from '@/lib/queryClient';
import { User, Connection } from '@shared/types'; // User and Connection now correctly have 'id: number'

interface ConnectionActionOptions {
  onSuccessCallback?: (connection: Connection) => void;
  onErrorCallback?: (error: Error) => void;
}

interface UseConnectionActionsResult {
  openConnectionModal: (targetUser: User) => void;
  submitConnectionRequest: (targetUser: User, message?: string) => void;
  showConnectionModal: boolean;
  selectedUserForModal: User | null;
  closeConnectionModal: () => void;
  isSendingRequest: boolean;
}

export const useConnectionActions = (options?: ConnectionActionOptions): UseConnectionActionsResult => {
  const { currentUserId } = useAuth(); // Now returns number | null
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [selectedUserForModal, setSelectedUserForModal] = useState<User | null>(null);

  const sendConnectionMutation = useMutation<Connection, Error, { receiverId: number; message?: string }>({
    mutationFn: async ({ receiverId, message }) => {
      if (!currentUserId) {
        throw new Error("Authentication required to send connection requests.");
      }
      const response = await apiRequest("POST", "/api/connections", {
        requesterId: currentUserId, // No conversion needed - currentUserId is already a number
        receiverId: receiverId,
        message: message || null,
        status: "pending",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to send connection request.' }));
        throw new Error(errorData.message || 'Failed to send connection request.');
      }
      return response.json();
    },
    onSuccess: (data, variables) => {
      toast({
        title: "Connection Request Sent!",
        description: `Your request to connect with ${selectedUserForModal?.firstName || 'user'} has been sent.`,
      });
      setShowConnectionModal(false);
      setSelectedUserForModal(null);

      // Invalidate relevant queries to update UI across the app
      queryClient.invalidateQueries({ queryKey: ["currentUserConnections", currentUserId] });
      queryClient.invalidateQueries({ queryKey: ["profileUserAcceptedConnections", selectedUserForModal?.id] });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users/search"] });

      options?.onSuccessCallback?.(data);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Send Request",
        description: error.message || "An error occurred while sending your connection request.",
        variant: "destructive",
      });
      options?.onErrorCallback?.(error);
    },
  });

  // Function to open the modal (used directly by DeveloperCard)
  const openConnectionModal = useCallback((targetUser: User) => {
    setSelectedUserForModal(targetUser);
    setShowConnectionModal(true);
  }, []);

  // Function that the modal calls on submission
  const submitConnectionRequest = useCallback((targetUser: User, message?: string) => {
    sendConnectionMutation.mutate({ receiverId: targetUser.id, message });
  }, [sendConnectionMutation]);

  const closeConnectionModal = useCallback(() => {
    setShowConnectionModal(false);
    setSelectedUserForModal(null);
  }, []);

  return {
    openConnectionModal,
    submitConnectionRequest,
    showConnectionModal,
    selectedUserForModal,
    closeConnectionModal,
    isSendingRequest: sendConnectionMutation.isPending,
  };
};