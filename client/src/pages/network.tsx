import React, { useState } from "react";
import { useLocation } from "wouter"; // Import useLocation for navigation
import { useQuery, useMutation } from "@tanstack/react-query";
import { User } from "@shared/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DeveloperCard } from "@/components/developer-card";
import { ConnectionModal } from "@/components/connection-modal";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Search } from "lucide-react";

interface SearchFilters {
  query: string;
  experienceLevel: string[];
  skills: string[];
  openToCollaborate: boolean;
  isOnline: boolean;
}

export default function Network() {
  const { toast } = useToast();
  const [location, setLocation] = useLocation(); // Get both location and setLocation
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    experienceLevel: [],
    skills: [],
    openToCollaborate: false,
    isOnline: false,
  });

  // Parse search query from URL on component mount
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
      setFilters(prev => ({ ...prev, query: searchParam }));
    }
  }, [location]);
  const [sortBy, setSortBy] = useState<"newest" | "popular" | "online">("newest");
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Fetch users with search/filter
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

  // Send connection request mutation
  const sendConnectionMutation = useMutation({
    mutationFn: async ({ receiverId, message }: { receiverId: number; message?: string }) => {
      const response = await apiRequest("POST", "/api/connections", {
        requesterId: 1, // TODO: Get from auth context
        receiverId,
        message,
        status: "pending",
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Connection request sent successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/connections"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send connection request. Please try again.",
        variant: "destructive",
      });
    },
  });

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

  const handleConnect = (userId: string) => {
    const user = users.find(u => u._id === userId);
    if (user) {
      setSelectedUser(user);
      setShowConnectionModal(true);
    }
  };

  const handleSendRequest = (userId: string, message?: string) => {
    sendConnectionMutation.mutate({ receiverId: userId, message });
  };
  
  // FIX: Added handler to navigate to the user's profile page.
  const handleViewProfile = (userId: string) => {
    setLocation(`/profile/${userId}`);
  };

  const sortedUsers = [...users].sort((a, b) => {
    switch (sortBy) {
      case "online":
        return Number(b.isOnline) - Number(a.isOnline);
      case "popular":
        // Sort by number of connections (simulated)
        return Math.random() - 0.5;
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // newest first
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filters</h3>
                
                {/* Search */}
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

                {/* Experience Level */}
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

                {/* Programming Languages */}
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

                {/* Status */}
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

                {isLoading ? (
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
                        key={user._id}
                        user={user}
                        currentUserId="current" // TODO: Get from auth context
                        onConnect={handleConnect}
                        onMessage={(userId) => console.log("Message", userId)}
                        // FIX: Replaced console.log with the new navigation handler.
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

      <ConnectionModal
        isOpen={showConnectionModal}
        onClose={() => setShowConnectionModal(false)}
        targetUser={selectedUser}
        onSendRequest={handleSendRequest}
        isLoading={sendConnectionMutation.isPending}
      />
    </div>
  );
}
