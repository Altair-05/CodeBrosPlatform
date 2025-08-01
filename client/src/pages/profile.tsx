import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
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
  Edit,
} from "lucide-react";
import {
  getExperienceLevelColor,
  getExperienceLevelLabel,
  getOnlineStatus,
} from "@/lib/utils";
import { useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();

  // Get authenticated user data
  const { user: currentUser, isAuthenticated, currentUserId, isLoading: isAuthLoading } = useAuth();

  // Determine the actual user ID to fetch
  // If id is "current" or undefined, use the current user's ID
  // Use the numeric ID for PostgreSQL compatibility
  const targetUserId = id === "current" || !id ? currentUserId : parseInt(id, 10);

  // Scroll to the top of the page when the component mounts or the ID changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["user", targetUserId],
    queryFn: async () => {
      if (!targetUserId) {
        throw new Error("No user ID available");
      }
      
      const response = await fetch(`/api/users/${targetUserId}`);
      if (!response.ok) {
        throw new Error("User not found");
      }
      return response.json();
    },
    enabled: !!targetUserId, // Only run query if we have a target user ID
  });

  // Check if the viewer is looking at their own profile
  const isOwnProfile = isAuthenticated && currentUserId === targetUserId;

  // Handle loading state - wait for both auth and user query to finish
  if (isLoading || isAuthLoading) {
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

  // Handle error or no user found - FIXED: Only check after query is done loading
  if ((!isLoading && !user) || error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {!isAuthenticated ? "Please Login" : "User Not Found"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {!isAuthenticated 
                  ? "You need to be logged in to view profiles."
                  : "The user you're looking for doesn't exist."
                }
              </p>
              {!isAuthenticated && (
                <Button 
                  className="mt-4" 
                  onClick={() => setLocation('/login')}
                >
                  Go to Login
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  if (!user) return null;

  // Safely handle potential null values from the user object
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
                    {isOwnProfile ? (
                      <Button 
                        variant="outline"
                        onClick={() => setLocation('/profile/edit')}
                      >
                        <Edit size={16} className="mr-2" />
                        Edit Profile
                      </Button>
                    ) : isAuthenticated ? (
                      <>
                        <Button 
                          className="bg-brand-blue text-white hover:bg-brand-blue-dark"
                          onClick={() => setLocation(`/messages?user=${user.id}`)}
                        >
                          <MessageCircle size={16} className="mr-2" />
                          Message
                        </Button>
                        <Button variant="outline">
                          <UserPlus size={16} className="mr-2" />
                          Connect
                        </Button>
                      </>
                    ) : (
                      <Button 
                        onClick={() => setLocation('/login')}
                        variant="outline"
                      >
                        Login to Connect
                      </Button>
                    )}
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
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
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

            {/* Skills */}
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

            {/* Activity Feed */}
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

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info - Only show to authenticated users */}
            {isAuthenticated && (
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {isOwnProfile ? user.email : "***@***"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Github size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      @{user.username}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Linkedin size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      /in/{user.username}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Statistics */}
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
                    42
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

            {/* Mutual Connections - Only show to authenticated users */}
            {isAuthenticated && !isOwnProfile && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}