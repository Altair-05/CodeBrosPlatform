import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { User, Connection } from "@shared/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Calendar,
  Globe,
  Github,
  Linkedin,
  Mail,
  MessageCircle,
  UserPlus,
  Check,
} from "lucide-react";
import {
  getExperienceLevelColor,
  getExperienceLevelLabel,
  getOnlineStatus,
} from "@/lib/utils";
import { useEffect } from "react";
import { useConnectionActions } from "@/hooks/use-connection-actions";
import { useConnectionStatus } from "@/hooks/use-connection-status";
import { ConnectionModal } from "@/components/connection-modal";

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const profileUserId = id;

  const {
    openConnectionModal,
    submitConnectionRequest,
    showConnectionModal,
    selectedUserForModal,
    closeConnectionModal,
    isSendingRequest,
  } = useConnectionActions();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [profileUserId]);

  // Fetch the profile user's data
  const { data: user, isLoading: isLoadingUser, isError } = useQuery<User>({
    queryKey: ["user", profileUserId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${profileUserId}`);
      if (!response.ok) {
        throw new Error("User not found");
      }
      return response.json();
    },
    enabled: !!profileUserId,
  });

  // Use the connection status hook
  const { connectionStatus, isLoading: isLoadingConnectionStatus } = useConnectionStatus(user);

  // Fetch accepted connections for the profiled user to display the count
  const { data: profileUserAcceptedConnections = [] } = useQuery<Connection[]>({
    queryKey: ["profileUserAcceptedConnections", profileUserId],
    queryFn: async () => {
      if (!profileUserId) return [];
      const response = await fetch(`/api/connections/accepted/${profileUserId}`);
      if (!response.ok) {
        return [];
      }
      return response.json();
    },
    enabled: !!profileUserId,
  });

  const handleConnectClick = () => {
    console.log("🔥 Connect button clicked!");
    console.log("📊 Current state:", {
      user: user?.firstName + " " + user?.lastName,
      connectionStatus,
      showConnectionModal,
      selectedUserForModal: selectedUserForModal?.firstName + " " + selectedUserForModal?.lastName
    });
    
    if (user && connectionStatus === "none") {
      console.log("✅ Calling openConnectionModal with user:", user);
      openConnectionModal(user);
    } else {
      console.log("❌ Cannot open modal - conditions not met:", {
        hasUser: !!user,
        connectionStatus
      });
    }
  };

  const renderConnectionButton = () => {
    if (connectionStatus === "self") {
      return (
        <Button 
          variant="secondary"
          className="cursor-not-allowed"
          disabled
        >
          Viewing Your Profile
        </Button>
      );
    } else if (connectionStatus === "connected") {
      return (
        <Button variant="default">
          <MessageCircle size={16} className="mr-2" />
          Message
        </Button>
      );
    } else if (connectionStatus === "pending") {
      return (
        <Button
          variant="secondary"
          disabled
          className="cursor-not-allowed"
        >
          <Check size={16} className="mr-2" />
          Pending
        </Button>
      );
    } else {
      return (
        <Button
          variant="default"
          onClick={handleConnectClick}
          disabled={isSendingRequest}
        >
          {isSendingRequest ? (
            'Connecting...'
          ) : (
            <>
              <UserPlus size={16} className="mr-2" />
              Connect
            </>
          )}
        </Button>
      );
    }
  };

  // Combine loading states
  const isLoading = isLoadingUser || isLoadingConnectionStatus;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
              <div className="space-y-6">
                <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                User Not Found
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                The user you're looking for doesn't exist or an error occurred.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { color: statusColor, text: statusText } = getOnlineStatus(
    user.isOnline ?? false,
    user.lastSeen ?? undefined
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={user.profileImage ?? undefined}
                  alt={`${user.firstName} ${user.lastName}`}
                />
                <AvatarFallback className="text-2xl">
                  {user.firstName[0]}
                  {user.lastName[0]}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {user.firstName} {user.lastName}
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                      {user.title}
                    </p>
                  </div>

                  <div className="flex space-x-3 mt-4 sm:mt-0">
                    {renderConnectionButton()}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div
                      className={`w-2 h-2 ${statusColor} rounded-full mr-2`}
                    ></div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {statusText}
                    </span>
                  </div>
                  <Badge
                    className={getExperienceLevelColor(user.experienceLevel)}
                  >
                    {getExperienceLevelLabel(user.experienceLevel)}
                  </Badge>
                  {user.openToCollaborate && (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Open to Collaborate
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {user.bio || "No bio available."}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skills & Technologies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.skills && user.skills.length > 0 ? (
                    user.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-sm"
                      >
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">
                      No skills listed.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Updated profile information
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        2 days ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Connected with 3 new developers
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        1 week ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Joined CodeBros community
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        2 weeks ago
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {user.email}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Github size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {user.username}
                  </span>
                </div>
                {user.username && (
                  <div className="flex items-center space-x-3">
                    <Linkedin size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      /in/{user.username}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Connections
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {profileUserAcceptedConnections.length}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Projects
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    7
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Profile Views
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    124
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mutual Connections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">JD</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      John Doe
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">JS</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Jane Smith
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full">
                    View all mutual connections
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Connection Modal */}
      {console.log("🎭 Modal render check:", {
        showConnectionModal,
        selectedUserForModal: selectedUserForModal?.firstName + " " + selectedUserForModal?.lastName,
        isSendingRequest
      })}
      <ConnectionModal
        isOpen={showConnectionModal}
        onClose={closeConnectionModal}
        targetUser={selectedUserForModal}
        onSendRequest={submitConnectionRequest}
        isLoading={isSendingRequest}
      />
    </div>
  );
}