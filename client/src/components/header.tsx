import { Link, useLocation } from "wouter";
import {
  Bell,
  Code,
  Home,
  MessageCircle,
  Moon,
  Search,
  Sun,
  Users,
  BellOff
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface HeaderProps {
  currentUser?: {
    id: number;
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
  notificationCount?: number;
  onSearch?: (query: string) => void;
}

export function Header({
  currentUser,
  notificationCount = 0,
  onSearch,
}: HeaderProps) {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const isActive = (path: string) => location === path;

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center">
                  <Code className="text-white" size={16} />
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  CodeBros
                </span>
              </div>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-gray-400" size={16} />
              </div>
              <Input
                type="text"
                placeholder="Search developers, skills, companies..."
                className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {/* Navigation Menu */}
          <nav className="flex items-center space-x-6">
            <Link href="/">
              <Button
                variant={isActive("/") ? "default" : "ghost"}
                size="sm"
                className="text-gray-600 dark:text-gray-300 hover:text-brand-blue"
              >
                <Home size={16} className="mr-1" />
                Home
              </Button>
            </Link>

            <Link href="/network">
              <Button
                variant={isActive("/network") ? "default" : "ghost"}
                size="sm"
                className="text-gray-600 dark:text-gray-300 hover:text-brand-blue"
              >
                <Users size={16} className="mr-1" />
                Network
              </Button>
            </Link>

            <Link href="/messages">
              <Button
                variant={isActive("/messages") ? "default" : "ghost"}
                size="sm"
                className="text-gray-600 dark:text-gray-300 hover:text-brand-blue"
              >
                <MessageCircle size={16} className="mr-1" />
                Messages
              </Button>
            </Link>

            {/* Notifications */}
            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 dark:text-gray-300 hover:text-brand-blue relative"
                  >
                    <Bell size={16} className="mr-1" />
                    <span className="hidden lg:block">Notifications</span>
                    {notificationCount > 0 && (
                      <Badge className="ml-1 absolute top-0 right-0 size-4 bg-red-500 text-white text-xs px-1 py-0.5 rounded-full flex items-center justify-center">
                        {notificationCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-96 max-h-[80vh] overflow-y-auto p-2 rounded-md shadow-xl border dark:bg-gray-800 bg-white">
                  {notificationCount === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500 dark:text-gray-400 text-sm">
                      <span className="mb-2">
                        <BellOff />
                      </span>
                      <span>No new notifications</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-medium">Notifications</span>
                        <button className="hover:underline transition text-blue-500 cursor-pointer text-xs">
                          Mark all as read
                        </button>
                      </div>

                      <div className="mt-1 space-y-1">
                        {Array.from({ length: notificationCount }).map(
                          (_, i) => (
                            <DropdownMenuItem
                              key={i}
                              className="flex flex-col items-start px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer group"
                            >
                              <div className="flex items-center justify-between w-full">
                                <h1 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  Notification title {i + 1}
                                </h1>
                                <span className="ml-2 h-2 w-2 rounded-full bg-blue-500 group-hover:bg-blue-600" />
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                The notification description goes here.
                              </p>
                            </DropdownMenuItem>
                          )
                        )}
                      </div>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="text-gray-600 dark:text-gray-300"
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            </Button>

            {/* Profile Dropdown */}
            {currentUser && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="w-8 h-8 cursor-pointer ring-2 ring-gray-300 dark:ring-gray-600 hover:ring-brand-blue transition-all">
                    <AvatarImage
                      src={currentUser.profileImage}
                      alt={`${currentUser.firstName} ${currentUser.lastName}`}
                    />
                    <AvatarFallback>
                      {currentUser.firstName[0]}
                      {currentUser.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/profile/${currentUser.id}`}>
                      View Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
