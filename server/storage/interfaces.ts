import type { 
  User, 
  InsertUser, 
  Connection, 
  InsertConnection,
  Message,
  InsertMessage,
  UpdateUser,
  SearchUsers
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: UpdateUser): Promise<User | undefined>;
  searchUsers(criteria: SearchUsers): Promise<User[]>;
  getAllUsers(): Promise<User[]>;
  setUserOnlineStatus(id: number, isOnline: boolean): Promise<void>;

  // Connection operations
  getConnection(requesterId: number, receiverId: number): Promise<Connection | undefined>;
  getConnectionsByUserId(userId: number): Promise<Connection[]>;
  getPendingConnectionRequests(userId: number): Promise<Connection[]>;
  createConnection(connection: InsertConnection): Promise<Connection>;
  updateConnectionStatus(id: number, status: string): Promise<Connection | undefined>;
  getAcceptedConnections(userId: number): Promise<User[]>;

  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesBetweenUsers(user1Id: number, user2Id: number): Promise<Message[]>;
  getConversations(userId: number): Promise<Array<{ user: User; lastMessage: Message; unreadCount: number }>>;
  markMessagesAsRead(senderId: number, receiverId: number): Promise<void>;
} 