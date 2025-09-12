import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import {
  Bell,
  Code,
  Home,
  MessageCircle,
  Moon,
  Search,
  Sun,
  Users,
  BellOff,
  LogOut,
  User
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";
import { useState, useEffect } from "react";
import axios from 'axios';
import { useToast } from "@/hooks/use-toast";


interface HeaderProps {
  notificationCount: number;
  setnotificationCount: React.Dispatch<React.SetStateAction<number>>;
  onSearch?: (query: string) => void;
}

type User = {
  _id: string;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  title: string;
  bio: string;
  experienceLevel: string;
  skills: string[];
  openToCollaborate: boolean;
  isOnline: boolean;
  lastSeen: string;
  createdAt: string;
  updatedAt: string;
};

type Message = {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
};

type NotificationItem = {
  user: User;
  lastUnreadMessage: Message;
  unreadCount: number;
};


export function Header({
  notificationCount,
  setnotificationCount,
  onSearch,
}: HeaderProps) {
  const [location, setLocation] = useLocation();
  const { theme, setTheme } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);


  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/network?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  const { toast } = useToast();


  const handleMessagesClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      toast({
        title: "Login required",
        description: "Please log in to access messages.",
        variant: "destructive",
      });
    }
  };

  const [unreadMessages, setUnreadMessages] = useState<NotificationItem[]>([]);
  useEffect(() => {
    const fetchMessages = async () => {
      if (!user || !user._id) return;
      try {
        const res = await axios.get(`/api/messages/unread/${user._id}`);
        setUnreadMessages(res.data);
        setnotificationCount(res.data.length);
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };

    fetchMessages();
  }, [user]);


  const marking_read = async () => {
    try {
      await fetch("/api/messages/mark-read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: null,
          receiverId: user?._id,
        }),
      });

      setnotificationCount(0);
      toast({
        title: "Success",
        description: "All notifications marked as read.",
      });
    } catch (error) {
      console.error("Error marking as read:", error);
      toast({
        title: "Error",
        description: "Something went wrong while marking notifications as read.",
        variant: "destructive",
      });
    }
  }

  const isActive = (path: string) => location === path;

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 hidden md:flex ">
        <div className="flex justify-between items-center h-16 ">
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
                className="text-gray-600 dark:text-gray-300 hover:text-brand-blue "
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

            <Link href="/customers">
              <Button
                variant={isActive("/customers") ? "default" : "ghost"}
                size="sm"
                className="text-gray-600 dark:text-gray-300 hover:text-brand-blue"
              >
                <Users size={16} className="mr-1" />
                Customers
              </Button>
            </Link>

            <Link href="/messages">
              <Button
                onClick={handleMessagesClick}
                variant={isActive("/messages") ? "default" : "ghost"}
                size="sm"
                className="text-gray-600 dark:text-gray-300 hover:text-brand-blue"
              >
                <MessageCircle size={16} className="mr-1" />
                Messages
              </Button>
            </Link>

            {/* Notifications */}
            {/* ... unchanged ... */}

            {/* Theme Toggle */}
            {/* ... unchanged ... */}

            {/* Profile Dropdown */}
            {/* ... unchanged ... */}
          </nav>
        </div>
      </div>

      {/* Mobile header bar */}
      <div className="flex md:hidden items-center justify-between h-16 px-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
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

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="focus:outline-none text-gray-800 dark:text-gray-200"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile nav drawer */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white dark:bg-gray-900 shadow-md md:hidden z-50">
          <div className="flex flex-col space-y-2 p-4">
            <Link href="/">
              <Button
                variant={isActive("/") ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start text-gray-600 dark:text-gray-300 hover:text-brand-blue"
              >
                <Home size={16} className="mr-2" />
                Home
              </Button>
            </Link>

            <Link href="/network">
              <Button
                variant={isActive("/network") ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start text-gray-600 dark:text-gray-300 hover:text-brand-blue"
              >
                <Users size={16} className="mr-2" />
                Network
              </Button>
            </Link>

            <Link href="/customers">
              <Button
                variant={isActive("/customers") ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start text-gray-600 dark:text-gray-300 hover:text-brand-blue"
              >
                <Users size={16} className="mr-2" />
                Customers
              </Button>
            </Link>

            <Link href="/messages">
              <Button
                onClick={handleMessagesClick}
                variant={isActive("/messages") ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start text-gray-600 dark:text-gray-300 hover:text-brand-blue"
              >
                <MessageCircle size={16} className="mr-2" />
                Messages
              </Button>
            </Link>

            {/* Notifications, Theme, Profile/Auth */}
            {/* ... unchanged ... */}
          </div>
        </div>
      )}
    </header>
  );
}
