import { Message, User } from "@shared/types"; // Import Message and User types
import { formatTimeAgo } from "@/lib/utils"; // Assuming formatTimeAgo is in utils
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MessageDisplayProps {
  message: Message;
  isCurrentUser: boolean;
  // senderProfile is optional, used to display avatar/name for the other user
  senderProfile?: Pick<User, 'firstName' | 'lastName' | 'profileImage'>;
}

export function MessageDisplay({ message, isCurrentUser, senderProfile }: MessageDisplayProps) {
  const messageClasses = isCurrentUser
    ? "bg-brand-blue text-white rounded-bl-lg" // Current user's message
    : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-br-lg"; // Other user's message

  const timestampClasses = isCurrentUser
    ? "text-blue-100"
    : "text-gray-500 dark:text-gray-400";

  return (
    <div
      className={`flex ${
        isCurrentUser ? "justify-end space-x-reverse" : "justify-start space-x-2"
      } items-end gap-2`} // Added gap for spacing
    >
      {!isCurrentUser && senderProfile && ( // Show avatar for the other sender
        <Avatar className="w-8 h-8">
          <AvatarImage
            src={senderProfile.profileImage ?? undefined}
            alt={`${senderProfile.firstName} ${senderProfile.lastName}`}
          />
          <AvatarFallback>
            {senderProfile.firstName?.[0]}{senderProfile.lastName?.[0]}
          </AvatarFallback>
        </Avatar>
      )}
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${messageClasses}`}>
        <p className="text-sm">{message.content}</p>
        <p className={`text-xs mt-1 ${timestampClasses}`}>
          {formatTimeAgo(message.createdAt)}
        </p>
      </div>
    </div>
  );
}