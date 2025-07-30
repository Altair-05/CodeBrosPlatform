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
  type SearchUsers,
} from "@shared/schema";
import { db } from "./db"; // Import the Drizzle client
import {
  eq,
  and,
  or,
  inArray, // Corrected: inArray is now imported from drizzle-orm
  ilike,
  sql,
  asc,
  desc,
} from "drizzle-orm"; // Import Drizzle ORM functions

// Define an interface for the storage operations
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
  createConnection(connection: InsertUser): Promise<Connection>; // Note: This should be InsertConnection not InsertUser
  updateConnectionStatus(id: number, status: string): Promise<Connection | undefined>;
  getAcceptedConnections(userId: number): Promise<User[]>;

  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesBetweenUsers(user1Id: number, user2Id: number): Promise<Message[]>;
  getConversations(userId: number): Promise<Array<{ user: User; lastMessage: Message; unreadCount: number }>>;
  markMessagesAsRead(senderId: number, receiverId: number): Promise<void>;
}

// Implement IStorage using Drizzle ORM
export class DrizzleStorage implements IStorage {
  constructor() {
    // No in-memory maps needed anymore
  }

  // --- User operations ---
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Drizzle will handle the `id` generation and `default` values for `isOnline`, `lastSeen`
    const result = await db.insert(users).values({
      ...insertUser,
      // Explicitly set if not in InsertUser or relies on schema default
      isOnline: false,
      // Explicitly set if not in InsertUser or relies on schema default
      lastSeen: new Date(),
    }).returning();
    if (!result[0]) {
      throw new Error("Failed to create user.");
    }
    return result[0];
  }

  async updateUser(id: number, updates: UpdateUser): Promise<User | undefined> {
    const result = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return result[0];
  }

  async searchUsers(criteria: SearchUsers): Promise<User[]> {
    const whereClauses: any[] = [];

    if (criteria.query) {
      const query = `%${criteria.query.toLowerCase()}%`;
      whereClauses.push(
        or(
          ilike(users.firstName, query),
          ilike(users.lastName, query),
          ilike(users.title, query),
          // Check if bio exists before using ilike
          sql`${users.bio} ILIKE ${query}`,
          // Corrected: Use JSON.stringify for array literal in SQL.
          // This specific SQL for array matching might need adjustment based on
          // exact PostgreSQL version and array operator support for ILIKE on elements.
          // A more robust way might be using a separate function or direct unnest logic if needed.
          sql`EXISTS (SELECT 1 FROM unnest(${users.skills}) AS s WHERE s ILIKE ${query})`
        )
      );
    }

    if (criteria.experienceLevel && criteria.experienceLevel.length > 0) {
      whereClauses.push(inArray(users.experienceLevel, criteria.experienceLevel));
    }

    if (criteria.skills && criteria.skills.length > 0) {
      // Corrected: Use sql.raw for direct array literal in SQL if needed,
      // or ensure the criteria.skills is correctly handled by Drizzle's inArray for PostgreSQL arrays.
      // The previous error was likely due to `unnest(${criteria.skills})`
      // The `inArray` operator works for simple equality checks on individual elements,
      // but for ILIKE on elements within an array, `sql` is generally safer.
      // Assuming `criteria.skills` is a string array, and `users.skills` is text array in PG.
      whereClauses.push(
        sql`EXISTS (SELECT 1 FROM unnest(${users.skills}) AS user_skill WHERE user_skill ILIKE ANY (${sql.raw('ARRAY')}${JSON.stringify(criteria.skills.map(s => `%${s}%`))}::text[]))`
      );
    }


    if (criteria.openToCollaborate !== undefined) {
      whereClauses.push(eq(users.openToCollaborate, criteria.openToCollaborate));
    }

    if (criteria.isOnline !== undefined) {
      whereClauses.push(eq(users.isOnline, criteria.isOnline));
    }

    if (whereClauses.length === 0) {
      return this.getAllUsers(); // If no criteria, return all users
    }

    const result = await db.select().from(users).where(and(...whereClauses));
    return result;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  async setUserOnlineStatus(id: number, isOnline: boolean): Promise<void> {
    await db.update(users).set({ isOnline, lastSeen: new Date() }).where(eq(users.id, id));
  }

  // --- Connection operations ---
  async getConnection(requesterId: number, receiverId: number): Promise<Connection | undefined> {
    const result = await db.select().from(connections).where(
      or(
        and(eq(connections.requesterId, requesterId), eq(connections.receiverId, receiverId)),
        and(eq(connections.requesterId, receiverId), eq(connections.receiverId, requesterId))
      )
    ).limit(1);
    return result[0];
  }

  async getConnectionsByUserId(userId: number): Promise<Connection[]> {
    const result = await db.select().from(connections).where(
      or(eq(connections.requesterId, userId), eq(connections.receiverId, userId))
    );
    return result;
  }

  async getPendingConnectionRequests(userId: number): Promise<Connection[]> {
    const result = await db.select().from(connections).where(
      and(eq(connections.receiverId, userId), eq(connections.status, "pending"))
    );
    return result;
  }

  async createConnection(insertConnection: InsertConnection): Promise<Connection> {
    const result = await db.insert(connections).values({
      ...insertConnection,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    if (!result[0]) {
      throw new Error("Failed to create connection.");
    }
    return result[0];
  }

  async updateConnectionStatus(id: number, status: string): Promise<Connection | undefined> {
    const result = await db.update(connections).set({ status, updatedAt: new Date() }).where(eq(connections.id, id)).returning();
    return result[0];
  }

  async getAcceptedConnections(userId: number): Promise<User[]> {
    const acceptedConns = await db.select().from(connections).where(
      and(
        or(eq(connections.requesterId, userId), eq(connections.receiverId, userId)),
        eq(connections.status, "accepted")
      )
    );

    const connectedUserIds = acceptedConns.map(conn =>
      conn.requesterId === userId ? conn.receiverId : conn.requesterId
    );

    if (connectedUserIds.length === 0) {
      return [];
    }
    // Fetch user details for the connected IDs
    const connectedUsers = await db.select().from(users).where(inArray(users.id, connectedUserIds));
    return connectedUsers;
  }

  // --- Message operations ---
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const result = await db.insert(messages).values({
      ...insertMessage,
      isRead: false,
      createdAt: new Date(),
    }).returning();
    if (!result[0]) {
      throw new Error("Failed to create message.");
    }
    return result[0];
  }

  async getMessagesBetweenUsers(user1Id: number, user2Id: number): Promise<Message[]> {
    const result = await db.select().from(messages).where(
      or(
        and(eq(messages.senderId, user1Id), eq(messages.receiverId, user2Id)),
        and(eq(messages.senderId, user2Id), eq(messages.receiverId, user1Id))
      )
    ).orderBy(asc(messages.createdAt)); // Order by creation time
    return result;
  }

  async getConversations(userId: number): Promise<Array<{ user: User; lastMessage: Message; unreadCount: number }>> {
    const rawMessages = await db.select().from(messages).where(
      or(eq(messages.senderId, userId), eq(messages.receiverId, userId))
    ).orderBy(desc(messages.createdAt)); // Get all messages, sorted descending by time for easy lastMessage lookup

    const conversationMap = new Map<number, { user: User; lastMessage: Message; unreadCount: number }>();
    const uniqueUserIds = new Set<number>();

    for (const message of rawMessages) {
      const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;
      uniqueUserIds.add(otherUserId);

      // Update last message
      if (!conversationMap.has(otherUserId) || (message.createdAt! > conversationMap.get(otherUserId)!.lastMessage.createdAt!)) {
        // Safe to use non-null assertion for createdAt here given it's notNull() in schema
        conversationMap.set(otherUserId, {
          user: {} as User, // Placeholder, will fetch real user later
          lastMessage: message,
          unreadCount: 0, // Will recount unread later or fetch from different query
        });
      }

      // Count unread messages (if not the sender and message is unread)
      if (message.receiverId === userId && !message.isRead) {
        const conv = conversationMap.get(otherUserId);
        if (conv) {
          conv.unreadCount++;
        } else {
          // This case should ideally not happen if last message is always added first
          // but for robustness, add it.
          conversationMap.set(otherUserId, {
            user: {} as User,
            lastMessage: message,
            unreadCount: 1,
          });
        }
      }
    }

    // Fetch details for all unique conversation partners
    const partnerIds = Array.from(uniqueUserIds);
    if (partnerIds.length === 0) {
      return [];
    }
    const partnerUsers = await db.select().from(users).where(inArray(users.id, partnerIds));
    const partnerUserMap = new Map<number, User>(partnerUsers.map(u => [u.id, u]));

    // Finalize conversation objects
    return Array.from(conversationMap.values())
      .map(conv => ({
        user: partnerUserMap.get(conv.user.id) || conv.user, // Replace placeholder with actual user
        lastMessage: conv.lastMessage,
        unreadCount: conv.unreadCount,
      }))
      .sort((a, b) => (b.lastMessage.createdAt?.getTime() || 0) - (a.lastMessage.createdAt?.getTime() || 0)); // Sort by latest message
  }

  async markMessagesAsRead(senderId: number, receiverId: number): Promise<void> {
    await db.update(messages)
      .set({ isRead: true })
      .where(and(eq(messages.senderId, senderId), eq(messages.receiverId, receiverId)));
  }

  // A method to insert sample data for development purposes (should be called once)
  async initializeSampleData(): Promise<void> {
    const existingUsers = await db.select({ id: users.id }).from(users).limit(1);
    if (existingUsers.length > 0) {
      console.log("Database already has data. Skipping sample data initialization.");
      return;
    }

    console.log("Initializing sample data...");

    const sampleUsersData = [
      {
        username: "Dakshata_Borse",
        email: "Dakshata@example.com",
        password: "password123", // In real app, hash this
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
        lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
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

    for (const userData of sampleUsersData) {
      try {
        await db.insert(users).values(userData as InsertUser);
      } catch (error: any) {
        // Ignore unique constraint errors if running multiple times without cleanup
        if (!error.message.includes('unique constraint')) {
          console.error(`Failed to insert sample user ${userData.username}:`, error);
        }
      }
    }
    console.log("Sample users initialized.");

    // Add some sample connections if users exist
    const allUsers = await db.select().from(users);
    if (allUsers.length >= 2) {
      const user1 = allUsers[0]; // Dakshata_Borse
      const user2 = allUsers[1]; // Meghana_khotare
      const user3 = allUsers[2]; // Visishta

      try {
        const existingConn1 = await this.getConnection(user1.id, user2.id);
        if (!existingConn1) {
          await db.insert(connections).values({
            requesterId: user1.id,
            receiverId: user2.id,
            status: "accepted",
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          console.log(`Connection between ${user1.username} and ${user2.username} created.`);
        } else {
          console.log(`Connection between ${user1.username} and ${user2.username} already exists.`);
        }

        const existingConn2 = await this.getConnection(user1.id, user3.id);
        if (!existingConn2) {
          await db.insert(connections).values({
            requesterId: user1.id,
            receiverId: user3.id,
            status: "pending",
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          console.log(`Pending connection from ${user1.username} to ${user3.username} created.`);
        } else {
          console.log(`Pending connection from ${user1.username} to ${user3.username} already exists.`);
        }
      } catch (error) {
        console.error("Error creating sample connections:", error);
      }
    }

    // Add some sample messages
    if (allUsers.length >= 2) {
      const user1 = allUsers[0];
      const user2 = allUsers[1];
      try {
        const existingMessages = await this.getMessagesBetweenUsers(user1.id, user2.id);
        if (existingMessages.length === 0) {
          await db.insert(messages).values([
            { senderId: user1.id, receiverId: user2.id, content: "Hey Meghana, how's your Django project going?", createdAt: new Date(Date.now() - 60000) },
            { senderId: user2.id, receiverId: user1.id, content: "Hey Dakshata! It's going well, just finished optimizing a few queries.", createdAt: new Date() },
          ]);
          console.log("Sample messages created.");
        } else {
          console.log("Sample messages already exist.");
        }
      } catch (error) {
        console.error("Error creating sample messages:", error);
      }
    }
  }
}

// Export a single instance of the DrizzleStorage
export const storage = new DrizzleStorage();