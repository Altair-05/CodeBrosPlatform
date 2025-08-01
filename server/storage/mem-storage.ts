import { 
  users, 
  connections, 
  messages,
  type User, 
  type InsertUser, 
  type Connection, 
  type InsertConnection,
  type Message,
  type InsertMessage,
  type UpdateUser,
  type SearchUsers
} from "@shared/schema";
import { IStorage } from "./interfaces";

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private connections: Map<number, Connection>;
  private messages: Map<number, Message>;
  private currentUserId: number;
  private currentConnectionId: number;
  private currentMessageId: number;

  constructor() {
    this.users = new Map();
    this.connections = new Map();
    this.messages = new Map();
    this.currentUserId = 1;
    this.currentConnectionId = 1;
    this.currentMessageId = 1;

    // Initialize with some sample users
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleUsers: Omit<User, 'id'>[] = [
      {
        username: "Dakshata_Borse",
        email: "Dakshata@example.com",
        password: "password123",
        firstName: "Dakshata",
        lastName: "Borse",
        title: "Full-Stack Developer",
        bio: "Passionate about React, Node.js, and building scalable web applications. Currently working on open-source projects and mentoring junior developers.",
        experienceLevel: "intermediate",
        skills: ["React", "TypeScript", "Node.js", "PostgreSQL"],
        profileImage: "https://images.unsplash.com/photo-1536625979259-edbae645c7c3?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        isOnline: true,
        openToCollaborate: true,
        lastSeen: new Date(),
      },
      {
        username: "Meghana_khotare",
        email: "meghana@example.com",
        password: "password123",
        firstName: "meghana",
        lastName: "khotare",
        title: "Backend Engineer",
        bio: "Specializing in Python, Django, and cloud architecture. Love working on API design and database optimization. Always eager to learn new technologies.",
        experienceLevel: "intermediate",
        skills: ["Python", "Django", "AWS", "Docker"],
        profileImage: "https://images.unsplash.com/photo-1592188657297-c6473609e988?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        isOnline: false,
        openToCollaborate: true,
        lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        username: "Visishta",
        email: "Visishta@example.com",
        password: "password123",
        firstName: "Visishta",
        lastName: "B",
        title: "Frontend Developer",
        bio: "New to the field but very enthusiastic! Learning React and JavaScript. Looking for mentorship and collaboration opportunities on beginner-friendly projects.",
        experienceLevel: "beginner",
        skills: ["JavaScript", "React", "HTML/CSS", "Git"],
        profileImage: "https://images.unsplash.com/photo-1631947430066-48c30d57b943?q=80&w=716&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        isOnline: false,
        openToCollaborate: true,
        lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        username: "Komal",
        email: "Komal@example.com",
        password: "password123",
        firstName: "Komal",
        lastName: "S",
        title: "DevOps Engineer",
        bio: "Infrastructure specialist with expertise in Kubernetes, CI/CD, and cloud platforms. Passionate about automation and helping teams ship faster.",
        experienceLevel: "professional",
        skills: ["Kubernetes", "Docker", "Jenkins", "Terraform"],
        profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        isOnline: true,
        openToCollaborate: false,
        lastSeen: new Date(),
      },
    ];

    sampleUsers.forEach(user => {
      const id = this.currentUserId++;
      this.users.set(id, { ...user, id });
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      bio: insertUser.bio || null,
      skills: insertUser.skills || [],
      profileImage: insertUser.profileImage || null,
      isOnline: false,
      openToCollaborate: insertUser.openToCollaborate || true,
      lastSeen: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: UpdateUser): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async searchUsers(criteria: SearchUsers): Promise<User[]> {
    let users = Array.from(this.users.values());

    if (criteria.query) {
      const query = criteria.query.toLowerCase();
      users = users.filter(user => 
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.title.toLowerCase().includes(query) ||
        user.bio?.toLowerCase().includes(query) ||
        (user.skills && user.skills.some(skill => skill.toLowerCase().includes(query)))
      );
    }

    if (criteria.experienceLevel && criteria.experienceLevel.length > 0) {
      users = users.filter(user => criteria.experienceLevel!.includes(user.experienceLevel));
    }

    if (criteria.skills && criteria.skills.length > 0) {
      users = users.filter(user => 
        user.skills && criteria.skills!.some(skill => 
          user.skills!.some(userSkill => 
            userSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }

    if (criteria.openToCollaborate !== undefined) {
      users = users.filter(user => user.openToCollaborate === criteria.openToCollaborate);
    }

    if (criteria.isOnline !== undefined) {
      users = users.filter(user => user.isOnline === criteria.isOnline);
    }

    return users;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async setUserOnlineStatus(id: number, isOnline: boolean): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      user.isOnline = isOnline;
      user.lastSeen = new Date();
      this.users.set(id, user);
    }
  }

  // Connection operations
  async getConnection(requesterId: number, receiverId: number): Promise<Connection | undefined> {
    return Array.from(this.connections.values()).find(conn => 
      (conn.requesterId === requesterId && conn.receiverId === receiverId) ||
      (conn.requesterId === receiverId && conn.receiverId === requesterId)
    );
  }

  async getConnectionsByUserId(userId: number): Promise<Connection[]> {
    return Array.from(this.connections.values()).filter(conn => 
      conn.requesterId === userId || conn.receiverId === userId
    );
  }

  async getPendingConnectionRequests(userId: number): Promise<Connection[]> {
    return Array.from(this.connections.values()).filter(conn => 
      conn.receiverId === userId && conn.status === "pending"
    );
  }

  async createConnection(insertConnection: InsertConnection): Promise<Connection> {
    const id = this.currentConnectionId++;
    const connection: Connection = {
      ...insertConnection,
      id,
      message: insertConnection.message || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.connections.set(id, connection);
    return connection;
  }

  async updateConnectionStatus(id: number, status: string): Promise<Connection | undefined> {
    const connection = this.connections.get(id);
    if (!connection) return undefined;

    connection.status = status;
    connection.updatedAt = new Date();
    this.connections.set(id, connection);
    return connection;
  }

  async getAcceptedConnections(userId: number): Promise<User[]> {
    const acceptedConnections = Array.from(this.connections.values()).filter(conn => 
      (conn.requesterId === userId || conn.receiverId === userId) && conn.status === "accepted"
    );

    const connectedUserIds = acceptedConnections.map(conn => 
      conn.requesterId === userId ? conn.receiverId : conn.requesterId
    );

    return connectedUserIds.map(id => this.users.get(id)).filter(Boolean) as User[];
  }

  // Message operations
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const message: Message = {
      ...insertMessage,
      id,
      isRead: false,
      createdAt: new Date(),
    };
    this.messages.set(id, message);
    return message;
  }

  async getMessagesBetweenUsers(user1Id: number, user2Id: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(msg => 
        (msg.senderId === user1Id && msg.receiverId === user2Id) ||
        (msg.senderId === user2Id && msg.receiverId === user1Id)
      )
      .sort((a, b) => (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0));
  }

  async getConversations(userId: number): Promise<Array<{ user: User; lastMessage: Message; unreadCount: number }>> {
    const userMessages = Array.from(this.messages.values()).filter(msg => 
      msg.senderId === userId || msg.receiverId === userId
    );

    const conversationMap = new Map<number, { user: User; lastMessage: Message; unreadCount: number }>();

    for (const message of userMessages) {
      const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;
      const otherUser = this.users.get(otherUserId);
      
      if (!otherUser) continue;

      const existing = conversationMap.get(otherUserId);
      const isUnread = message.receiverId === userId && !message.isRead;
      
      if (!existing || (message.createdAt && existing.lastMessage.createdAt && message.createdAt > existing.lastMessage.createdAt)) {
        conversationMap.set(otherUserId, {
          user: otherUser,
          lastMessage: message,
          unreadCount: existing ? existing.unreadCount + (isUnread ? 1 : 0) : (isUnread ? 1 : 0)
        });
      } else if (isUnread) {
        existing.unreadCount++;
      }
    }

    return Array.from(conversationMap.values()).sort((a, b) => 
      (b.lastMessage.createdAt?.getTime() || 0) - (a.lastMessage.createdAt?.getTime() || 0)
    );
  }

  async markMessagesAsRead(senderId: number, receiverId: number): Promise<void> {
    Array.from(this.messages.values())
      .filter(msg => msg.senderId === senderId && msg.receiverId === receiverId)
      .forEach(msg => {
        msg.isRead = true;
        this.messages.set(msg.id, msg);
      });
  }
}

export const storage = new MemStorage(); 