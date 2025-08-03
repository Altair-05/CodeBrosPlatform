import { useState } from "react";
import { User } from "@shared/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: User | null;
  onSendRequest: (targetUser: User, message?: string) => void;
  isLoading?: boolean;
}

export function ConnectionModal({
  isOpen,
  onClose,
  targetUser,
  onSendRequest,
  isLoading = false,
}: ConnectionModalProps) {
  const [message, setMessage] = useState("");
  const maxMessageLength = 500;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetUser && message.length <= maxMessageLength) {
      onSendRequest(targetUser, message.trim() || undefined);
      setMessage("");
      // onClose() is now handled by the hook's onSuccess/onError for consistency
    }
  };

  const handleClose = () => {
    setMessage("");
    onClose();
  };

  // Safe avatar initials generation
  const getInitials = (firstName: string, lastName: string) => {
    const firstInitial = firstName?.trim()?.[0]?.toUpperCase() || '';
    const lastInitial = lastName?.trim()?.[0]?.toUpperCase() || '';
    return `${firstInitial}${lastInitial}`;
  };

  if (!targetUser) return null;

  const isMessageTooLong = message.length > maxMessageLength;
  console.log("Modal State:", { isLoading, isMessageTooLong });
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Send Connection Request</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="w-12 h-12">
              <AvatarImage 
                src={targetUser.profileImage ?? undefined} 
                alt={`${targetUser.firstName} ${targetUser.lastName}`} 
              />
              <AvatarFallback>
                {getInitials(targetUser.firstName, targetUser.lastName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                {targetUser.firstName} {targetUser.lastName}
              </h4>
              {targetUser.title && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {targetUser.title}
                </p>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="message">Add a personal message (optional)</Label>
              <Textarea
                id="message"
                placeholder={`Hi ${targetUser.firstName}, I'd love to connect and learn about your experience...`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className={`mt-1 ${isMessageTooLong ? 'border-red-500 focus:border-red-500' : ''}`}
                aria-describedby={isMessageTooLong ? "message-error" : "message-counter"}
              />
              <div className="flex justify-between items-center mt-1">
                <p 
                  id="message-counter" 
                  className={`text-xs ${isMessageTooLong ? 'text-red-500' : 'text-gray-500'}`}
                >
                  {message.length}/{maxMessageLength} characters
                </p>
                {isMessageTooLong && (
                  <p id="message-error" className="text-xs text-red-500">
                    Message is too long
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={handleClose} 
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="default"
                disabled={isLoading || isMessageTooLong}
              >
                {isLoading ? "Sending..." : "Send Request"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}