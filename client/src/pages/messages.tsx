import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Message, User, Conversation as ConversationType } from "@shared/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Send, Search } from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

// Corrected import path for MessageDisplay component
import { MessageDisplay } from "@/components/ui/message-display";


export default function Messages() {
  const { toast } = useToast();
  const { currentUserId, isLoadingAuth } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<User | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations for the current user
  const { data: conversations = [], isLoading: conversationsLoading } = useQuery<ConversationType[]>({
    queryKey: ["conversations", currentUserId],
    queryFn: async () => {
      const response = await fetch(`/api/messages/conversations/${currentUserId}`); // currentUserId is string for path
      if (!response.ok) {
        return [];
      }
      return response.json();
    },
    enabled: !!currentUserId && !isLoadingAuth,
  });

  // Fetch messages for the selected conversation
  const { data: messages = [], isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: ["messages", currentUserId, selectedConversation?.id], // selectedConversation.id is number
    queryFn: async () => {
      if (!currentUserId || !selectedConversation) return [];
      // API expects number IDs for path parameters, so convert currentUserId
      const response = await fetch(`/api/messages/conversation/${Number(currentUserId)}/${selectedConversation.id}`); // selectedConversation.id is number
      if (!response.ok) {
        return [];
      }
      return response.json();
    },
    enabled: !!currentUserId && !!selectedConversation,
  });

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ receiverId, content }: { receiverId: number; content: string }) => {
      if (!currentUserId) {
        throw new Error("Sender ID not available.");
      }
      const response = await apiRequest("POST", "/api/messages", {
        senderId: Number(currentUserId), // Convert currentUserId to number
        receiverId: receiverId, // receiverId is number
        content: content,
      });
      return response.json();
    },
    onSuccess: () => {
      setMessageText("");
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConversation || !messageText.trim()) return;

    sendMessageMutation.mutate({
      receiverId: selectedConversation.id, // selectedConversation.id is number
      content: messageText.trim(),
    });
  };

  const filteredConversations = conversations.filter(conv =>
    `${conv.user.firstName} ${conv.user.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-xl text-gray-500 dark:text-gray-400">Loading authentication...</p>
      </div>
    );
  }

  if (!currentUserId) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Please log in to view your messages.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-200px)]">

          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                {conversationsLoading ? (
                  <div className="space-y-3 p-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    ))}
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    No conversations found
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredConversations.map((conversation, index) => (
                      <div key={conversation.user.id}> {/* Uses conversation.user.id */}
                        <div
                          className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                            selectedConversation?.id === conversation.user.id // Uses .id
                              ? "bg-brand-blue/10 border-r-2 border-brand-blue"
                              : ""
                          }`}
                          onClick={() => setSelectedConversation(conversation.user)}
                        >
                          <div className="flex items-start space-x-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage
                                src={conversation.user.profileImage ?? undefined}
                                alt={`${conversation.user.firstName} ${conversation.user.lastName}`}
                              />
                              <AvatarFallback>
                                {conversation.user.firstName[0]}{conversation.user.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {conversation.user.firstName} {conversation.user.lastName}
                                </p>
                                <div className="flex items-center space-x-2">
                                  {conversation.unreadCount > 0 && (
                                    <Badge className="bg-brand-blue text-white text-xs px-1.5 py-0.5">
                                      {conversation.unreadCount}
                                    </Badge>
                                  )}
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatTimeAgo(conversation.lastMessage.createdAt)}
                                  </p>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                                {Number(currentUserId!) === conversation.lastMessage.senderId ? "You: " : ""} {/* Uses senderId directly */}
                                {conversation.lastMessage.content}
                              </p>
                            </div>
                          </div>
                        </div>
                        {index < filteredConversations.length - 1 && <Separator />}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <CardHeader className="border-b">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={selectedConversation.profileImage ?? undefined}
                        alt={`${selectedConversation.firstName} ${selectedConversation.lastName}`}
                      />
                      <AvatarFallback>
                        {selectedConversation.firstName[0]}{selectedConversation.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {selectedConversation.firstName} {selectedConversation.lastName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedConversation.isOnline ? "Online" : "Offline"}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 p-0">
                  <ScrollArea className="h-[400px] p-4">
                    {messagesLoading ? (
                      <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
                            <div className="h-12 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          </div>
                        ))}
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
                        No messages yet. Start a conversation!
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <MessageDisplay
                            key={message.id} // Uses message.id
                            message={message}
                            isCurrentUser={Number(currentUserId!) === message.senderId} // Uses senderId directly
                            senderProfile={Number(currentUserId!) !== message.senderId ? selectedConversation : undefined}
                          />
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>

                {/* Message Input */}
                <div className="border-t p-4">
                  <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <Input
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="submit"
                      disabled={!messageText.trim() || sendMessageMutation.isPending}
                      className="bg-brand-blue text-white hover:bg-brand-blue-dark"
                    >
                      <Send size={16} />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <p className="text-lg font-medium mb-2">Select a conversation</p>
                  <p>Choose a conversation from the list to start messaging</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}