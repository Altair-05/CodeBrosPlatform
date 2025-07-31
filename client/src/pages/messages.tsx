import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Message, User, Conversation } from "@shared/schema";
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
import { useAuth } from "@/contexts/auth-context";

export default function Messages() {
  const { toast } = useToast();
  const { currentUserId, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [location] = useLocation();
  const [selectedConversation, setSelectedConversation] = useState<User | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch conversations
  const { data: conversations = [], isLoading: conversationsLoading } = useQuery<Conversation[]>({
    queryKey: ['conversations', currentUserId],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/messages/conversations/${currentUserId}`);
      return response.json();
    },
    enabled: !!currentUserId && isAuthenticated,
  });

  // Fetch messages for selected conversation
  const { data: messages = [], isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: ['messages', currentUserId, selectedConversation?.id],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/messages/conversation/${currentUserId}/${selectedConversation?.id}`);
      return response.json();
    },
    enabled: !!currentUserId && !!selectedConversation && isAuthenticated,
  });

  // Handle pre-selecting conversation from URL parameter
  useEffect(() => {
    if (!conversations.length) return;

    const urlParams = new URLSearchParams(location.split('?')[1] || '');
    const userId = urlParams.get('user');
    
    if (userId) {
      const targetConversation = conversations.find(conv => conv.user.id === parseInt(userId));
      if (targetConversation) {
        setSelectedConversation(targetConversation.user);
      }
    }
  }, [conversations, location]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ receiverId, content }: { receiverId: number; content: string }) => {
      const response = await apiRequest("POST", "/api/messages", {
        senderId: currentUserId,
        receiverId,
        content,
      });
      return response.json();
    },
    onSuccess: () => {
      setMessageText("");
      queryClient.invalidateQueries({ queryKey: ['messages', currentUserId, selectedConversation?.id] });
      queryClient.invalidateQueries({ queryKey: ['conversations', currentUserId] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConversation || !messageText.trim() || !currentUserId) return;

    sendMessageMutation.mutate({
      receiverId: selectedConversation.id,
      content: messageText.trim(),
    });
  };

  const filteredConversations = conversations.filter(conv =>
    `${conv.user.firstName} ${conv.user.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Show loading while auth is loading
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-200px)]">
            <div className="lg:col-span-1">
              <div className="h-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            </div>
            <div className="lg:col-span-2">
              <div className="h-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show login message if not authenticated (only after auth loading is complete)
  if (!isAuthenticated || !currentUserId) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">Please log in to access messages.</p>
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
                      <div key={conversation.user.id}>
                        <div
                          className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                            selectedConversation?.id === conversation.user.id
                              ? "bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500"
                              : ""
                          }`}
                          onClick={() => setSelectedConversation(conversation.user)}
                        >
                          <div className="flex items-start space-x-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage 
                                src={conversation.user.profileImage || undefined} 
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
                                    <Badge className="bg-blue-500 text-white text-xs px-1.5 py-0.5">
                                      {conversation.unreadCount}
                                    </Badge>
                                  )}
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatTimeAgo(conversation.lastMessage.createdAt)}
                                  </p>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                                {conversation.lastMessage.senderId === currentUserId ? "You: " : ""}
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
                        src={selectedConversation.profileImage || undefined} 
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
                          <div
                            key={message.id}
                            className={`flex ${
                              message.senderId === currentUserId ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                message.senderId === currentUserId
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  message.senderId === currentUserId
                                    ? "text-blue-100"
                                    : "text-gray-500 dark:text-gray-400"
                                }`}
                              >
                                {formatTimeAgo(message.createdAt)}
                              </p>
                            </div>
                          </div>
                        ))}
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
                      className="bg-blue-500 text-white hover:bg-blue-600"
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