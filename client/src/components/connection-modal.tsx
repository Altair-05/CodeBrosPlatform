import { useState } from "react";
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

interface UserMinimal {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  title?: string;
}

interface ConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: UserMinimal | null;
  onSendRequest: (userId: string, message?: string) => void;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUser) return;

    onSendRequest(targetUser._id, message.trim() || undefined);
    setMessage("");
    onClose();
  };

  const handleClose = () => {
    setMessage("");
    onClose();
  };

  if (!targetUser) return null;

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
                src={targetUser.profileImage || ""}
                alt={`${targetUser.firstName} ${targetUser.lastName}`}
              />
              <AvatarFallback>
                {targetUser.firstName[0]}
                {targetUser.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                {targetUser.firstName} {targetUser.lastName}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {targetUser.title || ""}
              </p>
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
                className="mt-1"
              />
            </div>

            <div className="flex space-x-3">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-brand-blue text-white hover:bg-brand-blue-dark"
              >
                {isLoading ? "Sending..." : "Send Request"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
