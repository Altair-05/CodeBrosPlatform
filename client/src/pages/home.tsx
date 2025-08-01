import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { User, Connection } from "@shared/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DeveloperCard } from "@/components/developer-card";
import { Users, Briefcase, Handshake } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useConnectionActions } from "@/hooks/use-connection-actions";
import { ConnectionModal } from "@/components/connection-modal";

type ConnectionStatus = "none" | "pending" | "connected";

export default function Home() {
  const [, setLocation] = useLocation();
  const { currentUserId, isLoadingAuth } = useAuth();
  const {
    openConnectionModal,
    submitConnectionRequest,
    showConnectionModal,
    selectedUserForModal,
    closeConnectionModal,
    isSendingRequest,
  } = useConnectionActions();

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
    queryFn: async () => {
      const response = await fetch('/api/users');
      if (!response.ok) {
        return [];
      }
      return response.json();
    }
  });

  // Fetch current user's connections to determine connection status
  const { data: currentUserConnections = [], isLoading: isLoadingConnections } = useQuery<Connection[]>({
    queryKey: ["currentUserConnections", currentUserId],
    queryFn: async () => {
      if (!currentUserId) return [];
      const response = await fetch(`/api/connections/user/${currentUserId}`, {
        credentials: "include"
      });
      if (!response.ok) {
        return [];
      }
      return response.json();
    },
    enabled: !!currentUserId && !isLoadingAuth,
  });

  // Calculate connection status for each user
  const getConnectionStatus = useMemo(() => {
    return (targetUser: User): ConnectionStatus => {
      if (!currentUserId || !targetUser) return "none";
      if (currentUserId === targetUser.id) return "none"; // Self handled in DeveloperCard

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
    };
  }, [currentUserId, currentUserConnections]);

  const { data: stats } = useQuery({
    queryKey: ["/api/stats", users.length],
    queryFn: () => ({
      totalUsers: users.length,
      activeProjects: 156,
      connections: 1293,
    }),
    enabled: !isLoading,
  });

  const featuredUsers = users.slice(0, 4);

  const handleViewProfile = (userId: number) => {
    setLocation(`/profile/${userId}`);
  };

  const isLoadingData = isLoading || isLoadingConnections;

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 mb-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome to CodeBros</h1>
          <p className="text-blue-100 text-lg mb-6">
            Connect with fellow developers, share knowledge, and build amazing projects together.
          </p>
          <div className="flex space-x-4">
            <Link href="/network">
              <Button className="bg-white text-blue-700 hover:bg-gray-100">
                Explore Network
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-700">
                Join CodeBros
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <Users className="text-white" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats?.totalUsers ?? 0}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Developers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center">
                  <Briefcase className="text-white" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats?.activeProjects ?? 0}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Projects</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Handshake className="text-white" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats?.connections ?? 0}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Connections Made</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Developers */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Featured Developers
              </h2>
              <Link href="/network">
                <Button variant="outline">View All</Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredUsers.map((user) => (
                <DeveloperCard
                  key={user.id}
                  user={user}
                  currentUserId={currentUserId ?? undefined}
                  connectionStatus={getConnectionStatus(user)}
                  onConnect={openConnectionModal}
                  onMessage={(userId) => console.log("Message", userId)}
                  onViewProfile={handleViewProfile}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Connection Modal */}
      {selectedUserForModal && (
        <ConnectionModal
          isOpen={showConnectionModal}
          onClose={closeConnectionModal}
          targetUser={selectedUserForModal}
          onSendRequest={submitConnectionRequest}
          isLoading={isSendingRequest}
        />
      )}
    </div>
  );
}