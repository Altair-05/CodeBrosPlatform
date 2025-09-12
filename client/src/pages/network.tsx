import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User } from "@shared/types";
import { ConnectionModal } from "@/components/connection-modal";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/contexts/auth-context";

interface SearchFilters {
  query: string;
  experienceLevel: string[];
  skills: string[];
  openToCollaborate: boolean;
  isOnline: boolean;
}

export default function Network() {
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    experienceLevel: [],
    skills: [],
    openToCollaborate: false,
    isOnline: false,
  });
  const { user } = useAuth();

  // Parse search query from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get("search");
    if (searchParam) {
      setSearchQuery(searchParam);
      setFilters((prev) => ({ ...prev, query: searchParam }));
    }
  }, [location]);

  const [sortBy, setSortBy] = useState<"newest" | "popular" | "online">("newest");
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Fetch users
  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["/api/users/search", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.query) params.append("query", filters.query);
      filters.experienceLevel.forEach((level) => params.append("experienceLevel", level));
      filters.skills.forEach((skill) => params.append("skills", skill));
      if (filters.openToCollaborate) params.append("openToCollaborate", "true");
      if (filters.isOnline) params.append("isOnline", "true");

      const response = await fetch(`/api/users/search?${params.toString()}`, {
        credentials: "include",
      });

      if (!response.ok) return [];
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
  });

  // Connection request mutation
  const sendConnectionMutation = useMutation({
    mutationFn: async ({ receiverId, message }: { receiverId: string; message?: string }) => {
      const response = await apiRequest("POST", "/api/connections", {
        requesterId: user?._id,
        receiverId,
        message,
        status: "pending",
      });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Connection request sent successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/connections"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to send connection request.", variant: "destructive" });
    },
  });

  const handleConnect = (userId: string) => {
    const u = users.find((u) => u._id === userId);
    if (u) {
      setSelectedUser(u);
      setShowConnectionModal(true);
    }
  };

  const handleSendRequest = (userId: string, message?: string) => {
    sendConnectionMutation.mutate({ receiverId: userId, message });
  };

  const sortedUsers = [...users].sort((a, b) => {
    switch (sortBy) {
      case "online":
        return Number(b.isOnline) - Number(a.isOnline);
      case "popular":
        return Math.random() - 0.5; // placeholder
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Your existing JSX for network page here */}

      <ConnectionModal
        isOpen={showConnectionModal}
        onClose={() => setShowConnectionModal(false)}
        targetUser={selectedUser} // ✅ strictly User | null
        onSendRequest={handleSendRequest} // ✅ matches (userId: string, message?: string)
        isLoading={sendConnectionMutation.isPending}
      />
    </div>
  );
}
