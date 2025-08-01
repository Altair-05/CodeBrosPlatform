import { User } from "@shared/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, MessageCircle, Eye, Check } from "lucide-react";
import { getExperienceLevelColor, getExperienceLevelLabel, getOnlineStatus } from "@/lib/utils";

interface DeveloperCardProps {
  user: User;
  currentUserId?: number; // Updated from string to number
  connectionStatus?: "none" | "pending" | "connected";
  onConnect?: (user: User) => void;
  onMessage?: (userId: number) => void;
  onViewProfile?: (userId: number) => void;
}

export function DeveloperCard({
  user,
  currentUserId,
  connectionStatus = "none",
  onConnect,
  onMessage,
  onViewProfile,
}: DeveloperCardProps) {
  const { color: statusColor, text: statusText } = getOnlineStatus(user.isOnline, user.lastSeen);
  // Direct comparison between two numbers - much cleaner!
  const isOwnProfile = currentUserId === user.id;

  const handleConnect = () => {
    if (onConnect && !isOwnProfile) {
      onConnect(user);
    }
  };

  const handleMessage = () => {
    if (onMessage && !isOwnProfile) {
      onMessage(user.id);
    }
  };

  const handleViewProfile = () => {
    if (onViewProfile) {
      onViewProfile(user.id);
    }
  };

  const renderActionButton = () => {
    if (isOwnProfile) {
      return null; // No primary action for own profile
    }

    switch (connectionStatus) {
      case "connected":
        return (
          <Button
            onClick={handleMessage}
            variant="default"
            className="flex-1"
          >
            <MessageCircle size={16} className="mr-2" />
            Message
          </Button>
        );
      case "pending":
        return (
          <Button
            disabled
            variant="secondary"
            className="flex-1 cursor-not-allowed"
          >
            <Check size={16} className="mr-2" />
            Pending
          </Button>
        );
      default:
        return (
          <Button
            onClick={handleConnect}
            variant="default"
            className="flex-1"
          >
            <UserPlus size={16} className="mr-2" />
            Connect
          </Button>
        );
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={user.profileImage ?? undefined} alt={`${user.firstName} ${user.lastName}`} />
              <AvatarFallback className="text-lg">
                {user.firstName[0]}{user.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{user.title}</p>
              <div className="flex items-center mt-1">
                <div className={`w-2 h-2 ${statusColor} rounded-full mr-2`}></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{statusText}</span>
              </div>
            </div>
          </div>
          <Badge className={getExperienceLevelColor(user.experienceLevel)}>
            {getExperienceLevelLabel(user.experienceLevel)}
          </Badge>
        </div>

        {user.bio && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
            {user.bio}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {(user.skills ?? []).slice(0, 4).map((skill, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-xs"
            >
              {skill}
            </Badge>
          ))}
          {(user.skills?.length ?? 0) > 4 && (
            <Badge variant="secondary" className="text-xs">
              +{(user.skills?.length ?? 0) - 4} more
            </Badge>
          )}
        </div>

        <div className="flex space-x-2">
          {!isOwnProfile && renderActionButton()}
          <Button
            onClick={handleViewProfile}
            variant="outline"
            className={isOwnProfile ? "flex-1" : ""}
          >
            <Eye size={16} className="mr-2" />
            View Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}