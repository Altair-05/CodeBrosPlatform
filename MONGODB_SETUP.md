# MongoDB Database Implementation for CodeBrosPlatform

## Overview

This document describes the MongoDB database implementation for the CodeBrosPlatform project. The implementation replaces the in-memory storage with a persistent MongoDB database, providing better scalability, data persistence, and performance.

## Features

- **MongoDB Integration**: Full MongoDB database support with proper indexing
- **Type Safety**: Complete TypeScript types for all database operations
- **Data Validation**: Zod schema validation for all data operations
- **Performance Optimized**: Proper indexes for fast queries
- **Sample Data**: Database seeder with realistic sample data
- **Environment Configuration**: Flexible environment-based configuration

## Database Schema

### Users Collection
```typescript
{
  _id: ObjectId,
  username: string (unique),
  email: string (unique),
  password: string,
  firstName: string,
  lastName: string,
  title: string,
  bio?: string,
  experienceLevel: "beginner" | "intermediate" | "professional",
  skills: string[],
  profileImage?: string,
  isOnline: boolean,
  openToCollaborate: boolean,
  lastSeen?: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Connections Collection
```typescript
{
  _id: ObjectId,
  requesterId: ObjectId (ref: users),
  receiverId: ObjectId (ref: users),
  status: "pending" | "accepted" | "declined",
  message?: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Messages Collection
```typescript
{
  _id: ObjectId,
  senderId: ObjectId (ref: users),
  receiverId: ObjectId (ref: users),
  content: string,
  isRead: boolean,
  createdAt: Date
}
```

## Indexes

### Users Indexes
- `username` (unique)
- `email` (unique)
- `experienceLevel`
- `skills`
- `isOnline`
- `openToCollaborate`

### Connections Indexes
- `requesterId, receiverId` (unique compound)
- `receiverId, status`
- `requesterId, status`

### Messages Indexes
- `senderId, receiverId`
- `receiverId, isRead`
- `createdAt` (descending)

## Installation & Setup

### 1. Install MongoDB

#### Local Installation
```bash
# Windows (using Chocolatey)
choco install mongodb

# macOS (using Homebrew)
brew tap mongodb/brew
brew install mongodb-community

# Linux (Ubuntu)
sudo apt-get install mongodb
```

#### MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file based on `env.example`:

```bash
# Copy the example file
cp env.example .env

# Edit the .env file with your MongoDB connection
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=codebros
NODE_ENV=development
PORT=5000
```

For MongoDB Atlas:
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/codebros?retryWrites=true&w=majority
MONGODB_DB_NAME=codebros
```

### 4. Seed the Database

```bash
npm run db:seed
```

This will create sample users, connections, and messages for testing.

### 5. Start the Development Server

```bash
npm run dev
```

## API Endpoints

All existing API endpoints remain the same, but now use MongoDB:

### Users
- `GET /api/users` - Get all users
- `GET /api/users/search` - Search users with filters
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PATCH /api/users/:id` - Update user
- `POST /api/users/:id/online-status` - Update online status

### Connections
- `GET /api/connections/user/:userId` - Get user connections
- `GET /api/connections/pending/:userId` - Get pending requests
- `GET /api/connections/accepted/:userId` - Get accepted connections
- `POST /api/connections` - Create connection request
- `PATCH /api/connections/:id/status` - Update connection status

### Messages
- `GET /api/messages/conversation/:user1Id/:user2Id` - Get messages between users
- `GET /api/messages/conversations/:userId` - Get user conversations
- `POST /api/messages` - Send message
- `POST /api/messages/mark-read` - Mark messages as read

## Database Operations

### User Operations
```typescript
// Get user by ID
const user = await mongoStorage.getUser(userId);

// Create new user
const newUser = await mongoStorage.createUser(userData);

// Update user
const updatedUser = await mongoStorage.updateUser(userId, updates);

// Search users
const users = await mongoStorage.searchUsers(criteria);
```

### Connection Operations
```typescript
// Create connection request
const connection = await mongoStorage.createConnection(connectionData);

// Get user connections
const connections = await mongoStorage.getConnectionsByUserId(userId);

// Update connection status
const updatedConnection = await mongoStorage.updateConnectionStatus(id, status);
```

### Message Operations
```typescript
// Send message
const message = await mongoStorage.createMessage(messageData);

// Get messages between users
const messages = await mongoStorage.getMessagesBetweenUsers(user1Id, user2Id);

// Get conversations
const conversations = await mongoStorage.getConversations(userId);
```

## Performance Considerations

### Indexing Strategy
- **Compound Indexes**: Used for connection queries to avoid multiple index lookups
- **Text Search**: MongoDB text indexes for efficient user search
- **Date Indexes**: Descending indexes on timestamps for chronological sorting

### Query Optimization
- **Projection**: Only fetch required fields
- **Aggregation**: Use MongoDB aggregation pipeline for complex queries
- **Pagination**: Implement cursor-based pagination for large datasets

### Connection Pooling
- **Default Settings**: MongoDB driver handles connection pooling automatically
- **Max Pool Size**: Configurable via connection string parameters
- **Connection Timeout**: Proper timeout handling for production environments

## Migration from In-Memory Storage

The migration from in-memory storage to MongoDB is seamless:

1. **Same API**: All endpoints remain unchanged
2. **Type Safety**: Updated types to use string IDs instead of numbers
3. **Data Persistence**: Data now persists between server restarts
4. **Scalability**: Can handle multiple server instances

## Development Workflow

### Adding New Features
1. Update schemas in `shared/mongo-schema.ts`
2. Add methods to `server/db/mongo.ts`
3. Update routes in `server/routes.ts`
4. Update frontend types in `shared/types.ts`

### Database Migrations
For schema changes:
1. Update the schema definition
2. Create a migration script
3. Run the migration
4. Update the seeder if needed

### Testing
```bash
# Start MongoDB locally
mongod

# Seed the database
npm run db:seed

# Start the development server
npm run dev

# Test the API endpoints
curl http://localhost:5000/api/users
```

## Production Deployment

### Environment Variables
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/codebros
MONGODB_DB_NAME=codebros
NODE_ENV=production
PORT=5000
```

### Security Considerations
- Use MongoDB Atlas for production
- Enable authentication and authorization
- Use connection string with username/password
- Enable SSL/TLS encryption
- Set up proper network access rules

### Monitoring
- MongoDB Atlas provides built-in monitoring
- Set up alerts for connection issues
- Monitor query performance
- Track database size and growth

## Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check MongoDB service is running
   - Verify connection string
   - Check network connectivity

2. **Authentication Error**
   - Verify username/password
   - Check user permissions
   - Ensure database exists

3. **Index Creation Failed**
   - Check for duplicate data
   - Verify index syntax
   - Check MongoDB version compatibility

### Debug Commands
```bash
# Check MongoDB status
mongo --eval "db.serverStatus()"

# List databases
mongo --eval "show dbs"

# Check collections
mongo codebros --eval "show collections"

# Check indexes
mongo codebros --eval "db.users.getIndexes()"
```

## Contributing

When contributing to the MongoDB implementation:

1. **Follow TypeScript conventions**
2. **Add proper error handling**
3. **Update schemas and types**
4. **Add database indexes for new queries**
5. **Update the seeder if needed**
6. **Test with sample data**

## License

This MongoDB implementation is part of the CodeBrosPlatform project and follows the same MIT license. 