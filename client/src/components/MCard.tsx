import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { User } from '@shared/types'; // Make sure `User` type has at least `id`
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';

type MessageCardProps = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  receiver: User;
  isOpen: boolean;
};

export default function MCard({
  setIsOpen,
  receiver,
  isOpen,
}: MessageCardProps) {
  const [message, setMessage] = useState<string>('');
  const popupRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  const handleSend = async () => {
    if (!user || !user._id) {
      toast({
        title: 'Login required',
        description: 'You need to log in before sending a message.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await axios.post('/api/messages', {
        senderId: user._id,
        receiverId: receiver._id,
        content: message,
      });

      toast({
        title: 'Message Sent',
        description: 'Your message was successfully sent.',
      });

      setIsOpen(false);
      setMessage('');
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
      console.error('Failed to send message:', err);
    }
  };

  return (
    <>
      <Button
        className="bg-brand-blue text-white hover:bg-brand-blue-dark"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle size={16} className="mr-2" />
        Message
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div
            ref={popupRef}
            className="bg-black border border-white p-6 rounded-xl shadow-xl w-96"
          >
            <h2 className="text-lg font-semibold mb-3 text-white">
              Send Message
            </h2>
            <textarea
              className="w-full border border-white rounded-md p-2 mb-4 h-24 text-black"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSend}>Send</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
