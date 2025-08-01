import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DeveloperCard } from "@/components/developer-card";
import { Users, Briefcase, Handshake } from "lucide-react";
import { Link, useLocation } from "wouter"; // Import useLocation

export default function Home() {
  const [, setLocation] = useLocation(); // Get the setLocation function
  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
    // A simple fetch function to get all users
    queryFn: async () => {
      const response = await fetch('/api/users');
      if (!response.ok) {
        return [];
      }
      return response.json();
    }
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/stats", users.length], // Add users.length to dependency array
    queryFn: () => ({
      totalUsers: users.length,
      activeProjects: 156, // Placeholder
      connections: 1293, // Placeholder
    }),
    enabled: !isLoading, // Only run this query when users have been fetched
  });

  const featuredUsers = users.slice(0, 4);
  
  // Handler to navigate to a user's profile
  const handleViewProfile = (userId: string) => {
    setLocation(`/profile/${userId}`);
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
                <Button variant="outline"   className="border-[hsl(var(--brand-blue))] text-[hsl(var(--brand-blue))] 
             hover:bg-gray-100 hover:text-[hsl(var(--brand-blue))] 
             dark:border-[hsl(var(--brand-blue))] dark:text-[hsl(var(--brand-blue))] 
             dark:hover:bg-[hsl(209,45%,14%)] dark:hover:text-[hsl(var(--primary-foreground))] 
             focus:ring-2 focus:ring-[hsl(var(--brand-blue))] transition">
              View All</Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredUsers.map((user) => (
                <DeveloperCard
                  key={user._id}
                  user={user}
                  currentUserId="current" // TODO: Get from auth context
                  onConnect={(userId) => console.log("Connect to", userId)}
                  onMessage={(userId) => console.log("Message", userId)}
                  // FIX: Replaced console.log with the navigation handler
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
