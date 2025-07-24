import { Link, useLocation } from "wouter";
import { Bell, Code, Home, MessageCircle, Moon, Search, Sun, Users } from "lucide-react";
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

export function Header({ currentUser, notificationCount = 0, onSearch }: HeaderProps) {
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
                <span className="text-xl font-bold text-gray-900 dark:text-white">CodeBros</span>
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
                className="text-gray-600 dark:text-gray-300 hover:text-black "
              >
                <Home size={16} className="mr-1" />
                Home
              </Button>
            </Link>

            <Link href="/network">
              <Button
                variant={isActive("/network") ? "default" : "ghost"}
                size="sm"
                className="text-gray-600 dark:text-gray-300 hover:text-black"
              >
                <Users size={16} className="mr-1" />
                Network
              </Button>
            </Link>

            <Link href="/messages">
              <Button
                variant={isActive("/messages") ? "default" : "ghost"}
                size="sm"
                className="text-gray-600 dark:text-gray-300 hover:text-black"
              >
                <MessageCircle size={16} className="mr-1" />
                Messages
              </Button>
            </Link>

            {/* Notifications */}
            <div className="relative">
              <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300 hover:text-black">
                <Bell size={16} className="mr-1" />
                Notifications
                {notificationCount > 0 && (
                  <Badge className="ml-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded-full">
                    {notificationCount}
                  </Badge>
                )}
              </Button>
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
                    <AvatarImage src={currentUser.profileImage} alt={`${currentUser.firstName} ${currentUser.lastName}`} />
                    <AvatarFallback>
                      {currentUser.firstName[0]}{currentUser.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/profile/${currentUser.id}`}>View Profile</Link>
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
