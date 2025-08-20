import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DeveloperCard } from "@/components/developer-card";
import { Users, Briefcase, Handshake, ChevronDown } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";

export default function Home() {
  const [, setLocation] = useLocation();
  const [showActiveUsers, setShowActiveUsers] = useState(false);
  
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
  
  // Filter active users (if isOnline property exists, otherwise show all)
  const activeUsers = users.filter(user => user.isOnline === true).length > 0 
    ? users.filter(user => user.isOnline === true)
    : users.slice(0, 8); // Show first 8 users if no online status
  
  const handleViewProfile = (userId: string) => {
    setLocation(`/profile/${userId}`);
  };

  const handleActiveUsersClick = () => {
    setShowActiveUsers(prev => !prev);
  };

  if (isLoading) {
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
        <div className="bg-gradient-to-r from-brand-blue to-brand-blue-dark rounded-lg p-8 mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to CodeBros</h1>
          <p className="text-lg mb-6 text-brand-blue">
            Connect with fellow developers, share knowledge, and build amazing projects together.
          </p>
          <div className="flex space-x-4">
            <Link href="/network">
              <Button
                variant="outline"
                className="border-[hsl(var(--brand-blue))] text-[hsl(var(--brand-blue))] 
                         hover:bg-gray-100 hover:text-[hsl(var(--brand-blue))] 
                         dark:border-[hsl(var(--brand-blue))] dark:text-[hsl(var(--brand-blue))] 
                         dark:hover:bg-[hsl(209,45%,14%)] dark:hover:text-[hsl(var(--primary-foreground))] 
                         focus:ring-2 focus:ring-[hsl(var(--brand-blue))] transition"
              >
                Explore Network
              </Button>
            </Link>
            <Link href="/profile/1">
              <Button
                variant="outline"
                className="border-[hsl(var(--brand-blue))] text-[hsl(var(--brand-blue))] 
                         hover:bg-gray-100 hover:text-[hsl(var(--brand-blue))] 
                         dark:border-[hsl(var(--brand-blue))] dark:text-[hsl(var(--brand-blue))] 
                         dark:hover:bg-[hsl(209,45%,14%)] dark:hover:text-[hsl(var(--primary-foreground))] 
                         focus:ring-2 focus:ring-[hsl(var(--brand-blue))] transition"
              >
                Complete Profile
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Clickable Active Developers Card */}
          <Card 
            className="cursor-pointer hover:shadow-md transition-all hover:scale-[1.02]"
            onClick={handleActiveUsersClick}
          >
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <Users className="text-white" size={24} />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {activeUsers.length || (stats?.totalUsers ?? 0)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Developers</p>
                </div>
                <div className="ml-2">
                  <ChevronDown 
                    size={16} 
                    className={`transform transition-transform text-gray-400 ${
                      showActiveUsers ? 'rotate-180' : ''
                    }`}
                  />
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

        {/* Active Users Panel */}
        {showActiveUsers && (
          <Card className="mb-8 border-emerald-200 dark:border-emerald-800">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Active Developers ({activeUsers.length})
                </h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowActiveUsers(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  ✕
                </Button>
              </div>
              
              {activeUsers.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Users size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No active developers at the moment</p>
                  <p className="text-sm">Check back later to see who's online</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeUsers.map((user) => (
                    <div 
                      key={user._id}
                      className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
                    >
                      <div className="relative">
                        <div className="w-12 h-12 bg-brand-blue rounded-full flex items-center justify-center text-white font-medium text-lg">
                          {user.firstName?.[0] || user.username?. || '?'}
                        </div>
                        {/* Online indicator */}
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {user.title || 'Developer'}
                        </p>
                        {user.skills && user.skills.length > 0 && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {user.skills.slice(0, 2).join(', ')}
                            {user.skills.length > 2 && ` +${user.skills.length - 2}`}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col space-y-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewProfile(user._id);
                          }}
                          className="text-xs px-3 py-1"
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("Connect to", user._id);
                          }}
                          className="text-xs px-3 py-1 text-emerald-600 hover:text-emerald-700"
                        >
                          Connect
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {activeUsers.length > 0 && (
                <div className="mt-6 text-center">
                  <Link href="/network">
                    <Button 
                      variant="outline"
                      className="border-[hsl(var(--brand-blue))] text-[hsl(var(--brand-blue))] hover:bg-gray-100"
                    >
                      View All Developers
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Featured Developers */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Featured Developers
              </h2>
              <Link href="/network">
                <Button 
                  variant="outline"   
                  className="border-[hsl(var(--brand-blue))] text-[hsl(var(--brand-blue))] 
                           hover:bg-gray-100 hover:text-[hsl(var(--brand-blue))] 
                           dark:border-[hsl(var(--brand-blue))] dark:text-[hsl(var(--brand-blue))] 
                           dark:hover:bg-[hsl(209,45%,14%)] dark:hover:text-[hsl(var(--primary-foreground))] 
                           focus:ring-2 focus:ring-[hsl(var(--brand-blue))] transition"
                >
                  View All
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredUsers.map((user) => (
                <DeveloperCard
                  key={user._id}
                  user={user}
                  currentUserId="current"
                  onConnect={(userId) => console.log("Connect to", userId)}
                  onMessage={(userId) => console.log("Message", userId)}
                  onViewProfile={handleViewProfile}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
