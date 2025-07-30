import React, { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { User, Connection } from "@shared/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DeveloperCard } from "@/components/developer-card";
import { ConnectionModal } from "@/components/connection-modal";
import { Search } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useConnectionActions } from "@/hooks/use-connection-actions";

interface SearchFilters {
  query: string;
  experienceLevel: string[];
  skills: string[];
  openToCollaborate: boolean;
  isOnline: boolean;
}

type ConnectionStatus = "none" | "pending" | "connected";

export default function Network() {
  const [location, setLocation] = useLocation();
  const { currentUserId, isLoadingAuth } = useAuth();

  const {
    openConnectionModal,
    submitConnectionRequest,
    showConnectionModal,
    selectedUserForModal,
    closeConnectionModal,
    isSendingRequest,
  } = useConnectionActions();

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    experienceLevel: [],
    skills: [],
    openToCollaborate: false,
    isOnline: false,
  });

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
      setFilters(prev => ({ ...prev, query: searchParam }));
    }
  }, [location]);

  const [sortBy, setSortBy] = useState<"newest" | "popular" | "online">("newest");

  // Fetch users based on search filters
  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["/api/users/search", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.query) params.append("query", filters.query);
      if (filters.experienceLevel.length > 0) {
        filters.experienceLevel.forEach(level => params.append("experienceLevel", level));
      }
      if (filters.skills.length > 0) {
        filters.skills.forEach(skill => params.append("skills", skill));
      }
      if (filters.openToCollaborate) params.append("openToCollaborate", "true");
      if (filters.isOnline) params.append("isOnline", "true");

      const response = await fetch(`/api/users/search?${params.toString()}`, {
        credentials: "include"
      });

      if (!response.ok) {
        console.error('Search failed:', response.status);
        return [];
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
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

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, query: searchQuery }));
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleExperienceLevelChange = (level: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      experienceLevel: checked
        ? [...prev.experienceLevel, level]
        : prev.experienceLevel.filter(l => l !== level)
    }));
  };

  const handleSkillChange = (skill: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      skills: checked
        ? [...prev.skills, skill]
        : prev.skills.filter(s => s !== skill)
    }));
  };

  const handleConnect = (userToConnect: User) => {
    openConnectionModal(userToConnect);
  };

  const handleViewProfile = (userId: number) => {
    setLocation(`/profile/${userId}`);
  };

  const sortedUsers = [...users].sort((a, b) => {
    switch (sortBy) {
      case "online":
        return Number(b.isOnline) - Number(a.isOnline);
      case "popular":
        return Math.random() - 0.5;
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const isLoadingData = isLoading || isLoadingConnections;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          <aside className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filters</h3>

                <div className="mb-6">
                  <Label htmlFor="search" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Search
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      id="search"
                      placeholder="Search developers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <Button onClick={handleSearch} size="sm">
                      <Search size={16} />
                    </Button>
                  </div>
                </div>

                <div className="mb-6">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Experience Level
                  </Label>
                  <div className="space-y-2">
                    {["beginner", "intermediate", "professional"].map((level) => (
                      <div key={level} className="flex items-center space-x-2">
                        <Checkbox
                          id={level}
                          checked={filters.experienceLevel.includes(level)}
                          onCheckedChange={(checked) =>
                            handleExperienceLevelChange(level, checked as boolean)
                          }
                        />
                        <Label htmlFor={level} className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {level === "professional" ? "Professional" : level}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Programming Languages
                  </Label>
                  <div className="space-y-2">
                    {["JavaScript", "TypeScript", "Python", "Java", "React"].map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={skill}
                          checked={filters.skills.includes(skill)}
                          onCheckedChange={(checked) =>
                            handleSkillChange(skill, checked as boolean)
                          }
                        />
                        <Label htmlFor={skill} className="text-sm text-gray-600 dark:text-gray-400">
                          {skill}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Status
                  </Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="openToCollab"
                        checked={filters.openToCollaborate}
                        onCheckedChange={(checked) =>
                          handleFilterChange("openToCollaborate", checked as boolean)
                        }
                      />
                      <Label htmlFor="openToCollab" className="text-sm text-gray-600 dark:text-gray-400">
                        Open to Collaborate
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="online"
                        checked={filters.isOnline}
                        onCheckedChange={(checked) =>
                          handleFilterChange("isOnline", checked as boolean)
                        }
                      />
                      <Label htmlFor="online" className="text-sm text-gray-600 dark:text-gray-400">
                        Currently Online
                      </Label>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => setFilters({
                    query: "",
                    experienceLevel: [],
                    skills: [],
                    openToCollaborate: false,
                    isOnline: false,
                  })}
                  variant="outline"
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Discover Developers ({users.length})
                  </h2>
                  <div className="flex space-x-2">
                    <Button
                      variant={sortBy === "newest" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSortBy("newest")}
                    >
                      Newest
                    </Button>
                    <Button
                      variant={sortBy === "popular" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSortBy("popular")}
                    >
                      Most Connected
                    </Button>
                    <Button
                      variant={sortBy === "online" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSortBy("online")}
                    >
                      Online Now
                    </Button>
                  </div>
                </div>

                {isLoadingData ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                ) : sortedUsers.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">No developers found with current filters.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sortedUsers.map((user) => (
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
                )}
              </CardContent>
            </Card>
          </div>
        </div>
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