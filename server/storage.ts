import { 
  users, 
  connections, 
  messages,
  type InsertUser, 
  type Connection, 
  type InsertConnection,
  type Message,
  type InsertMessage,
  type UpdateUser,
  type SearchUsers
} from "@shared/schema";
import { User } from "@shared/types";

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
        createdAt: new Date(),
        updatedAt: new Date(),
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
        createdAt: new Date(),
        updatedAt: new Date(),
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
        createdAt: new Date(),
        updatedAt: new Date(),
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
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "Harshita",
        email: "23bcs220@iiitdmj.ac.in",
        password: "password123",
        firstName: "Your",
        lastName: "Name",
        title: "Software Developer",
        bio: "Enthusiastic developer working on web applications and learning new technologies. Looking forward to collaborating with other developers!",
        experienceLevel: "intermediate",
        skills: ["JavaScript", "React", "Node.js", "TypeScript"],
        profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        isOnline: true,
        openToCollaborate: true,
        lastSeen: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Create sample users
    sampleUsers.forEach(user => {
      const id = this.currentUserId++;
      this.users.set(id, { ...user, id });
    });

    // Create sample connections
    const sampleConnections: Omit<Connection, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        requesterId: 1, // Dakshata
        receiverId: 2,  // Meghana
        status: "accepted",
        message: "Hi! I'd love to collaborate on a project together. Your Django skills would complement my React expertise perfectly!"
      },
      {
        requesterId: 1, // Dakshata
        receiverId: 3,  // Visishta
        status: "accepted",
        message: "Welcome to the community! I'd be happy to mentor you in React development."
      },
      {
        requesterId: 2, // Meghana
        receiverId: 4,  // Komal
        status: "accepted",
        message: "Your DevOps expertise would be valuable for our backend infrastructure. Let's connect!"
      },
      {
        requesterId: 3, // Visishta
        receiverId: 4,  // Komal
        status: "pending",
        message: "Hi! I'm new to development and would love to learn about DevOps practices."
      },
      {
        requesterId: 5, // Your User
        receiverId: 1,  // Dakshata
        status: "accepted",
        message: "Hi Dakshata! I really admire your work and would love to collaborate on some projects together!"
      }
    ];

    sampleConnections.forEach(connection => {
      const id = this.currentConnectionId++;
      const now = new Date();
      this.connections.set(id, { 
        ...connection, 
        id,
        createdAt: now,
        updatedAt: now
      });
    });

    // Create sample messages
    const now = new Date();
    const sampleMessages: Omit<Message, 'id' | 'isRead' | 'createdAt'>[] = [
      // Conversation between Dakshata (1) and Meghana (2)
      {
        senderId: 1,
        receiverId: 2,
        content: "Hey Meghana! Thanks for accepting my connection request. I saw your work with Django APIs - really impressive!"
      },
      {
        senderId: 2,
        receiverId: 1,
        content: "Hi Dakshata! Thank you! I've been following your React projects too. Your component architecture is really clean."
      },
      {
        senderId: 1,
        receiverId: 2,
        content: "I have an idea for a full-stack project that could use both our skills. Would you be interested in discussing it?"
      },
      {
        senderId: 2,
        receiverId: 1,
        content: "Absolutely! I'm always excited about new projects. What did you have in mind?"
      },
      {
        senderId: 1,
        receiverId: 2,
        content: "It's a developer collaboration platform - kind of like what we're using now but with more project management features. Perfect for our skill sets!"
      },

      // Conversation between Dakshata (1) and Visishta (3)
      {
        senderId: 1,
        receiverId: 3,
        content: "Hi Visishta! Welcome to the developer community. How's your React learning journey going?"
      },
      {
        senderId: 3,
        receiverId: 1,
        content: "Hi Dakshata! Thank you so much for reaching out. I'm still learning but I'm really passionate about it. Your mentorship offer means a lot!"
      },
      {
        senderId: 1,
        receiverId: 3,
        content: "That's wonderful to hear! Passion is the most important ingredient. Have you worked on any projects yet?"
      },
      {
        senderId: 3,
        receiverId: 1,
        content: "I've built a few small apps following tutorials, but I'd love to work on something real with guidance. Do you have any beginner-friendly project ideas?"
      },

      // Conversation between Meghana (2) and Komal (4)
      {
        senderId: 2,
        receiverId: 4,
        content: "Hi Komal! I'm working on scaling a Django application and could use some DevOps expertise. Would you be open to collaborating?"
      },
      {
        senderId: 4,
        receiverId: 2,
        content: "Hi Meghana! I'd be happy to help with the DevOps side. What's the current deployment setup?"
      },
      {
        senderId: 2,
        receiverId: 4,
        content: "Right now it's pretty basic - just deployed on a single server. I know we need better CI/CD and containerization."
      },

      // NEW: Conversation between Your User (5) and Dakshata (1)
      {
        senderId: 5,
        receiverId: 1,
        content: "Hi Dakshata! Thanks for accepting my connection request. I'm really excited to collaborate with such an experienced developer!"
      },
      {
        senderId: 1,
        receiverId: 5,
        content: "Hi there! Welcome to the platform! I'm always happy to connect with fellow developers. What kind of projects are you working on?"
      },
      {
        senderId: 5,
        receiverId: 1,
        content: "I've been working on some React applications and learning TypeScript. I saw your portfolio and I'm really impressed with your work!"
      },
      {
        senderId: 1,
        receiverId: 5,
        content: "That's great! TypeScript really makes React development much more enjoyable. Are you interested in contributing to any open source projects?"
      },
      {
        senderId: 5,
        receiverId: 1,
        content: "Absolutely! I'd love to get more involved in open source. Do you have any recommendations for beginner-friendly projects?"
      },
    ];

    // Add messages with timestamps spread over the last few days
    sampleMessages.forEach((message, index) => {
      const id = this.currentMessageId++;
      const createdAt = new Date(now.getTime() - (sampleMessages.length - index) * 60 * 60 * 1000); // Space messages 1 hour apart
      this.messages.set(id, {
        ...message,
        id,
        isRead: index < sampleMessages.length - 2, // Last 2 messages are unread
        createdAt
      });
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
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      bio: insertUser.bio ?? null,
      skills: insertUser.skills ?? [],
      profileImage: insertUser.profileImage ?? null,
      isOnline: false,
      openToCollaborate: insertUser.openToCollaborate ?? true,
      lastSeen: now,
      createdAt: now,
      updatedAt: now
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: UpdateUser): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    // Handle nullable fields properly
    const updatedUser: User = { 
      ...user,
      ...updates,
      // Ensure proper handling of null/undefined values for optional fields
      bio: updates.bio !== undefined ? updates.bio : user.bio,
      profileImage: updates.profileImage !== undefined ? updates.profileImage : user.profileImage,
      skills: updates.skills !== undefined ? updates.skills : user.skills,
      updatedAt: new Date()
    };
    
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
        (user.bio !== null && user.bio !== undefined && user.bio.toLowerCase().includes(query)) ||
        (user.skills && user.skills.length > 0 && user.skills.some(skill => skill.toLowerCase().includes(query)))
      );
    }

    if (criteria.experienceLevel && criteria.experienceLevel.length > 0) {
      users = users.filter(user => criteria.experienceLevel!.includes(user.experienceLevel));
    }

    if (criteria.skills && criteria.skills.length > 0) {
      users = users.filter(user => 
        user.skills && user.skills.length > 0 && criteria.skills!.some(skill => 
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
      const updatedUser: User = {
        ...user,
        isOnline,
        lastSeen: new Date(),
        updatedAt: new Date()
      };
      this.users.set(id, updatedUser);
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
    const now = new Date();
    const connection: Connection = {
      ...insertConnection,
      id,
      message: insertConnection.message ?? null,
      createdAt: now,
      updatedAt: now,
    };
    this.connections.set(id, connection);
    return connection;
  }

  async updateConnectionStatus(id: number, status: string): Promise<Connection | undefined> {
    const connection = this.connections.get(id);
    if (!connection) return undefined;

    const updatedConnection: Connection = {
      ...connection,
      status,
      updatedAt: new Date()
    };
    this.connections.set(id, updatedConnection);
    return updatedConnection;
  }

  async getAcceptedConnections(userId: number): Promise<User[]> {
    const acceptedConnections = Array.from(this.connections.values()).filter(conn => 
      (conn.requesterId === userId || conn.receiverId === userId) && conn.status === "accepted"
    );

    const connectedUserIds = acceptedConnections.map(conn => 
      conn.requesterId === userId ? conn.receiverId : conn.requesterId
    );

    return connectedUserIds.map(id => this.users.get(id)).filter((user): user is User => user !== undefined);
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
      } else if (isUnread && existing) {
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
        const updatedMessage: Message = { ...msg, isRead: true };
        this.messages.set(msg.id, updatedMessage);
      });
  }
}

export const storage = new MemStorage();