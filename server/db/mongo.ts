import { MongoClient, Db, Collection, ObjectId } from 'mongodb';
import {
  User,
  Connection,
  Message,
  InsertUser,
  InsertConnection,
  InsertMessage,
  UpdateUser,
  SearchUsers,
  COLLECTIONS,
} from '@shared/mongo-schema';

export class MongoStorage {
  private client: MongoClient;
  private db: Db;
  private users: Collection<User>;
  private connections: Collection<Connection>;
  private messages: Collection<Message>;

  constructor() {
    const mongoUri =
      process.env.MONGODB_URI ||
      'mongodb+srv://ghostcoder420:I0ChBo6m9HVl5nIB@codebros.bzpqzuc.mongodb.net/?retryWrites=true&w=majority&appName=codebros';
    const dbName = process.env.MONGODB_DB_NAME || 'codebros';

    this.client = new MongoClient(mongoUri);
    this.db = this.client.db(dbName);
    this.users = this.db.collection<User>(COLLECTIONS.USERS);
    this.connections = this.db.collection<Connection>(COLLECTIONS.CONNECTIONS);
    this.messages = this.db.collection<Message>(COLLECTIONS.MESSAGES);
  }

  getDb(): Db {
    return this.db;
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
      console.log('Connected to MongoDB');

      // Create indexes for better performance
      await this.createIndexes();
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    await this.client.close();
  }

  private async createIndexes(): Promise<void> {
    // Users indexes
    await this.users.createIndex({ username: 1 }, { unique: true });
    await this.users.createIndex({ email: 1 }, { unique: true });
    await this.users.createIndex({ experienceLevel: 1 });
    await this.users.createIndex({ skills: 1 });
    await this.users.createIndex({ isOnline: 1 });
    await this.users.createIndex({ openToCollaborate: 1 });

    // Connections indexes
    await this.connections.createIndex(
      { requesterId: 1, receiverId: 1 },
      { unique: true }
    );
    await this.connections.createIndex({ receiverId: 1, status: 1 });
    await this.connections.createIndex({ requesterId: 1, status: 1 });

    // Messages indexes
    await this.messages.createIndex({ senderId: 1, receiverId: 1 });
    await this.messages.createIndex({ receiverId: 1, isRead: 1 });
    await this.messages.createIndex({ createdAt: -1 });
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    try {
      const objectId = new ObjectId(id);
      const result = await this.users.findOne({ _id: objectId });
      return result ?? undefined;
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.users.findOne({ username });
    return result ?? undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await this.users.findOne({ email });
    return result ?? undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const user: Omit<User, '_id'> = {
      ...userData,
      isOnline: false,
      lastSeen: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await this.users.insertOne(user);
    return { ...user, _id: result.insertedId };
  }

  async updateUser(id: string, updates: UpdateUser): Promise<User | undefined> {
    try {
      const objectId = new ObjectId(id);
      const updateData = {
        ...updates,
        updatedAt: new Date(),
      };

      const result = await this.users.findOneAndUpdate(
        { _id: objectId },
        { $set: updateData },
        { returnDocument: 'after' }
      );

      return result || undefined;
    } catch (error) {
      console.error('Error updating user:', error);
      return undefined;
    }
  }

  async searchUsers(criteria: SearchUsers): Promise<User[]> {
    const filter: any = {};

    if (criteria.query) {
      const query = criteria.query.toLowerCase();
      filter.$or = [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { title: { $regex: query, $options: 'i' } },
        { bio: { $regex: query, $options: 'i' } },
        { skills: { $in: [new RegExp(query, 'i')] } },
      ];
    }

    if (criteria.experienceLevel && criteria.experienceLevel.length > 0) {
      filter.experienceLevel = { $in: criteria.experienceLevel };
    }

    if (criteria.skills && criteria.skills.length > 0) {
      filter.skills = { $in: criteria.skills };
    }

    if (criteria.openToCollaborate !== undefined) {
      filter.openToCollaborate = criteria.openToCollaborate;
    }

    if (criteria.isOnline !== undefined) {
      filter.isOnline = criteria.isOnline;
    }

    return await this.users.find(filter).toArray();
  }

  async getAllUsers(): Promise<User[]> {
    return await this.users.find({}).toArray();
  }

  async setUserOnlineStatus(id: string, isOnline: boolean): Promise<void> {
    try {
      const objectId = new ObjectId(id);
      await this.users.updateOne(
        { _id: objectId },
        {
          $set: {
            isOnline,
            lastSeen: new Date(),
            updatedAt: new Date(),
          },
        }
      );
    } catch (error) {
      console.error('Error setting user online status:', error);
    }
  }

  // Connection operations
  async getConnection(
    requesterId: string,
    receiverId: string
  ): Promise<Connection | undefined> {
    try {
      const requesterObjectId = new ObjectId(requesterId);
      const receiverObjectId = new ObjectId(receiverId);

      const result = await this.connections.findOne({
        $or: [
          { requesterId: requesterObjectId, receiverId: receiverObjectId },
          { requesterId: receiverObjectId, receiverId: requesterObjectId },
        ],
      });
      return result ?? undefined;
    } catch (error) {
      console.error('Error getting connection:', error);
      return undefined;
    }
  }

  async getConnectionsByUserId(userId: string): Promise<Connection[]> {
    try {
      const userObjectId = new ObjectId(userId);
      return await this.connections
        .find({
          $or: [{ requesterId: userObjectId }, { receiverId: userObjectId }],
        })
        .toArray();
    } catch (error) {
      console.error('Error getting connections by user ID:', error);
      return [];
    }
  }

  async getPendingConnectionRequests(userId: string): Promise<Connection[]> {
    try {
      const userObjectId = new ObjectId(userId);
      return await this.connections
        .find({
          receiverId: userObjectId,
          status: 'pending',
        })
        .toArray();
    } catch (error) {
      console.error('Error getting pending connection requests:', error);
      return [];
    }
  }

  async createConnection(
    connectionData: InsertConnection
  ): Promise<Connection> {
    const connection: Omit<Connection, '_id'> = {
      ...connectionData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await this.connections.insertOne(connection);
    return { ...connection, _id: result.insertedId };
  }

  async updateConnectionStatus(
    id: string,
    status: 'pending' | 'accepted' | 'declined'
  ): Promise<Connection | undefined> {
    try {
      const objectId = new ObjectId(id);
      const result = await this.connections.findOneAndUpdate(
        { _id: objectId },
        {
          $set: {
            status: status,
            updatedAt: new Date(),
          },
        },
        { returnDocument: 'after' }
      );

      return result ?? undefined;
    } catch (error) {
      console.error('Error updating connection status:', error);
      return undefined;
    }
  }

  async getAcceptedConnections(userId: string): Promise<User[]> {
    try {
      const userObjectId = new ObjectId(userId);
      const acceptedConnections = await this.connections
        .find({
          $or: [{ requesterId: userObjectId }, { receiverId: userObjectId }],
          status: 'accepted',
        })
        .toArray();

      const connectedUserIds = acceptedConnections.map(conn =>
        conn.requesterId.equals(userObjectId)
          ? conn.receiverId
          : conn.requesterId
      );

      return await this.users
        .find({
          _id: { $in: connectedUserIds },
        })
        .toArray();
    } catch (error) {
      console.error('Error getting accepted connections:', error);
      return [];
    }
  }

  // Message operations
  async createMessage(messageData: InsertMessage): Promise<Message> {
    const message: Omit<Message, '_id'> = {
      ...messageData,
      isRead: false,
      createdAt: new Date(),
    };

    const result = await this.messages.insertOne(message);
    return { ...message, _id: result.insertedId };
  }

  async getMessagesBetweenUsers(
    user1Id: string,
    user2Id: string
  ): Promise<Message[]> {
    try {
      const user1ObjectId = new ObjectId(user1Id);
      const user2ObjectId = new ObjectId(user2Id);

      return await this.messages
        .find({
          $or: [
            { senderId: user1ObjectId, receiverId: user2ObjectId },
            { senderId: user2ObjectId, receiverId: user1ObjectId },
          ],
        })
        .sort({ createdAt: 1 })
        .toArray();
    } catch (error) {
      console.error('Error getting messages between users:', error);
      return [];
    }
  }

  async getConversations(
    userId: string
  ): Promise<Array<{ user: User; lastMessage: Message; unreadCount: number }>> {
    try {
      const userObjectId = new ObjectId(userId);

      const userMessages = await this.messages
        .find({
          $or: [{ senderId: userObjectId }, { receiverId: userObjectId }],
        })
        .sort({ createdAt: -1 })
        .toArray();
      const conversationMap = new Map<
        string,
        {
          user: User;
          lastMessage: Message;
          unreadCount: number;
        }
      >();

      for (const message of userMessages) {
        const otherUserId = message.senderId.equals(userObjectId)
          ? message.receiverId.toString()
          : message.senderId.toString();

        if (!conversationMap.has(otherUserId)) {
          const otherUser = await this.users.findOne({
            _id: new ObjectId(otherUserId),
          });

          if (otherUser) {
            conversationMap.set(otherUserId, {
              user: otherUser,
              lastMessage: message,
              unreadCount:
                message.receiverId.equals(userObjectId) && !message.isRead
                  ? 1
                  : 0,
            });
          }
        } else {
          const existing = conversationMap.get(otherUserId)!;
          // createdAt is a Date in our schema, but ensure it's a Date object
          if (
            (existing.lastMessage.createdAt as any) instanceof Date &&
            (message.createdAt as any) instanceof Date
          ) {
            if (
              (message.createdAt as Date).getTime() >
              (existing.lastMessage.createdAt as Date).getTime()
            ) {
              existing.lastMessage = message;
            }
          }
          if (message.receiverId.equals(userObjectId) && !message.isRead) {
            existing.unreadCount++;
          }
        }
      }
      return Array.from(conversationMap.values()).sort((a, b) => {
        const aTime =
          (a.lastMessage.createdAt as any) instanceof Date
            ? (a.lastMessage.createdAt as Date).getTime()
            : new Date(a.lastMessage.createdAt as any).getTime();
        const bTime =
          (b.lastMessage.createdAt as any) instanceof Date
            ? (b.lastMessage.createdAt as Date).getTime()
            : new Date(b.lastMessage.createdAt as any).getTime();
        return bTime - aTime;
      });
    } catch (error) {
      console.error('Error getting conversations:', error);
      return [];
    }
  }

  async markMessagesAsRead(
    senderId: string,
    receiverId: string
  ): Promise<void> {
    try {
      const senderObjectId = new ObjectId(senderId);
      const receiverObjectId = new ObjectId(receiverId);

      await this.messages.updateMany(
        {
          receiverId: receiverObjectId,
          isRead: false,
        },
        { $set: { isRead: true } }
      );
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }
  //this is for getting unread messages
  async getLastUnreadMessagesGroupedBySender(
    userId: string
  ): Promise<
    Array<{ user: User; lastUnreadMessage: Message; unreadCount: number }>
  > {
    try {
      const userObjectId = new ObjectId(userId);

      const unreadMessages = await this.messages
        .find({
          receiverId: userObjectId,
          isRead: false,
        })
        .sort({ createdAt: -1 })
        .toArray();

      const senderMap = new Map<
        string,
        {
          user: User;
          lastUnreadMessage: Message;
          unreadCount: number;
        }
      >();

      for (const message of unreadMessages) {
        const senderId = message.senderId.toString();

        if (!senderMap.has(senderId)) {
          const senderUser = await this.users.findOne({
            _id: new ObjectId(senderId),
          });

          if (senderUser) {
            senderMap.set(senderId, {
              user: senderUser,
              lastUnreadMessage: message,
              unreadCount: 1,
            });
          }
        } else {
          const existing = senderMap.get(senderId)!;
          existing.unreadCount++;
        }
      }

      return Array.from(senderMap.values());
    } catch (error) {
      console.error('Error getting last unread messages:', error);
      return [];
    }
  }
}

// Export singleton instance
export const mongoStorage = new MongoStorage();
