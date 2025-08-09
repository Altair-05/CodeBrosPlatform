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
      // Navigate to network page with search query
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

      setnotificationCount(0); // Reset the counter
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
                        <button className="hover:underline transition text-blue-500 cursor-pointer text-xs" onClick={marking_read}>
                          Mark all as read
                        </button>
                      </div>

                      <div className="mt-1 space-y-1">
                        {unreadMessages.map((msg) => (
                          <DropdownMenuItem
                            key={msg.lastUnreadMessage._id}
                            className="flex flex-col items-start px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <div className="flex items-center justify-between w-full">
                              <h1 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {msg.user.firstName || "Unknown Sender"}
                              </h1>
                              <span className="ml-2 h-2 w-2 rounded-full bg-blue-500" />
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {msg.lastUnreadMessage.content}
                            </p>
                          </DropdownMenuItem>
                        ))}
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
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="w-8 h-8 cursor-pointer ring-2 ring-gray-300 dark:ring-gray-600 hover:ring-brand-blue transition-all">
                    <AvatarImage
                      src={user.profileImage}
                      alt={`${user.firstName} ${user.lastName}`}
                    />
                    <AvatarFallback>
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/profile/${user._id}`}>
                      <User size={16} className="mr-2" />
                      View Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>

      {/* Mobile header bar */}
<div className="flex md:hidden items-center justify-between h-16 px-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
  {/* Logo / Brand */}
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

  {/* Hamburger button */}
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
      {/* Home */}
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


      {/* Network */}
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

      {/* Messages */}
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

      {/* Notifications */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-gray-600 dark:text-gray-300 hover:text-brand-blue relative"
          >
            <Bell size={16} className="mr-2" />
            Notifications
            {notificationCount > 0 && (
              <Badge className="ml-auto bg-red-500 text-white text-xs px-1 py-0.5 rounded-full">
                {notificationCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-full max-h-[80vh] overflow-y-auto p-2 rounded-md shadow-xl border dark:bg-gray-800 bg-white"
        >
          {notificationCount === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500 dark:text-gray-400 text-sm">
              <BellOff className="mb-2" />
              No new notifications
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                <span className="font-medium">Notifications</span>
                <button
                  className="hover:underline transition text-blue-500 cursor-pointer text-xs"
                  onClick={marking_read}
                >
                  Mark all as read
                </button>
              </div>
              <div className="mt-1 space-y-1">
                {unreadMessages.map((msg) => (
                  <DropdownMenuItem
                    key={msg.lastUnreadMessage._id}
                    className="flex flex-col items-start px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="flex items-center justify-between w-full">
                      <h1 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {msg.user.firstName || "Unknown Sender"}
                      </h1>
                      <span className="ml-2 h-2 w-2 rounded-full bg-blue-500" />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {msg.lastUnreadMessage.content}
                    </p>
                  </DropdownMenuItem>
                ))}
              </div>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Theme Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="w-full justify-start text-gray-600 dark:text-gray-300"
      >
        {theme === "light" ? <Moon size={16} className="mr-2" /> : <Sun size={16} className="mr-2" />}
        Toggle Theme
      </Button>

      {/* Profile / Auth buttons */}
      {isAuthenticated && user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full flex justify-start">
              <Avatar className="w-6 h-6 mr-2">
                <AvatarImage
                  src={user.profileImage}
                  alt={`${user.firstName} ${user.lastName}`}
                />
                <AvatarFallback>
                  {user.firstName[0]}
                  {user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              Profile
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-full">
            <DropdownMenuItem asChild>
              <Link href={`/profile/${user._id}`}>
                <User size={16} className="mr-2" />
                View Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut size={16} className="mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex flex-col space-y-2 ">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="w-full">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm" className="w-full">
              Sign Up
            </Button>
          </Link>
        </div>
      )}
    </div>
  </div>
)}


    </header>
  );
}



