# CodeBros Platform API Endpoints
This document outlines the API endpoints used in the CodeBros Developer Networking Platform, based on the server/routes.ts file.

## User Routes
These endpoints manage user profiles and related information.

### 1. GET /api/users

- Description: Retrieves a list of all registered users.

- Response (Success): 200 OK with an array of user objects.

- Response (Error): 500 Internal Server Error if fetching fails.

### 2. GET /api/users/search

- Description: Searches for users based on various criteria such as query (general search), experienceLevel (array), skills (array), openToCollaborate (boolean), and isOnline (boolean).

- Query Parameters:

  * query (optional): General search string.

  * experienceLevel (optional): Can be a single string or an array of experience levels.

  * skills (optional): Can be a single string or an array of skills.

  * openToCollaborate (optional): true to filter users open to collaboration.

  * isOnline (optional): true to filter online users.

- Response (Success): 200 OK with an array of matching user objects.

- Response (Error): 400 Bad Request for invalid search parameters, 500 Internal Server Error for other failures.

### 3. GET /api/users/:id

- Description: Retrieves a specific user's profile by their ID.

- Path Parameters: :id (User ID - integer).

- Response (Success): 200 OK with the user object.

- Response (Not Found): 404 Not Found if the user does not exist.

- Response (Error): 500 Internal Server Error if fetching fails.

### 4. POST /api/users

- Description: Creates a new user account. Includes checks for existing usernames and emails.

- Request Body: User data adhering to insertUserSchema (e.g., {"username": "...", "email": "...", "password": "..."}).

- Response (Success): 201 Created with the newly created user object.

- Response (Conflict): 400 Bad Request if username or email already exists.

- Response (Error): 400 Bad Request for invalid user data.

### 5. PATCH /api/users/:id

- Description: Updates an existing user's profile information.

- Path Parameters: :id (User ID - integer).

- Request Body: Partial user data adhering to updateUserSchema.

- Response (Success): 200 OK with the updated user object.

- Response (Not Found): 404 Not Found if the user does not exist.

- Response (Error): 400 Bad Request for invalid update data.

### 6. POST /api/users/:id/online-status

- Description: Updates a user's online status.

- Path Parameters: :id (User ID - integer).

- Request Body: {"isOnline": true/false}.

- Response (Success): 200 OK with a success message.

- Response (Error): 500 Internal Server Error if the update fails.

## Connection Routes
These endpoints manage connection requests and established connections between users.

### 7. GET /api/connections/user/:userId

- Description: Retrieves all connections associated with a specific user, regardless of status (pending, accepted, etc.).

- Path Parameters: :userId (User ID - integer).

- Response (Success): 200 OK with an array of connection objects.

- Response (Error): 500 Internal Server Error if fetching fails.

### 8. GET /api/connections/pending/:userId

- Description: Retrieves all pending connection requests for a specific user (where the user is either the requester or receiver, and the status is pending).

- Path Parameters: :userId (User ID - integer).

- Response (Success): 200 OK with an array of pending connection request objects.

- Response (Error): 500 Internal Server Error if fetching fails.

### 9. GET /api/connections/accepted/:userId

- Description: Retrieves all accepted connections for a specific user.

- Path Parameters: :userId (User ID - integer).

- Response (Success): 200 OK with an array of accepted connection objects.

- Response (Error): 500 Internal Server Error if fetching fails.

### 10. POST /api/connections

- Description: Creates a new connection request between two users. Includes a check to prevent duplicate connection requests.

- Request Body: Connection data adhering to insertConnectionSchema (e.g., {"requesterId": "...", "receiverId": "...", "status": "pending"}).

- Response (Success): 201 Created with the newly created connection object.

- Response (Conflict): 400 Bad Request if a connection already exists between the users.

- Response (Error): 400 Bad Request for invalid connection data.

### 11. PATCH /api/connections/:id/status

- Description: Updates the status of an existing connection request (e.g., from 'pending' to 'accepted' or 'rejected').

- Path Parameters: :id (Connection ID - integer).

- Request Body: {"status": "accepted" | "rejected"} adhering to updateConnectionStatusSchema.

- Response (Success): 200 OK with the updated connection object.

- Response (Not Found): 404 Not Found if the connection does not exist.

- Response (Error): 400 Bad Request for invalid status update data.

## Message Routes
These endpoints handle messaging functionality between connected users.

### 12. GET /api/messages/conversation/:user1Id/:user2Id

- Description: Retrieves all messages exchanged between two specific users.

- Path Parameters: :user1Id (User ID - integer), :user2Id (User ID - integer).

- Response (Success): 200 OK with an array of message objects.

- Response (Error):): 500 Internal Server Error if fetching fails.

### 13. GET /api/messages/conversations/:userId

- Description: Retrieves a list of all conversations (unique message threads) a specific user is part of.

- Path Parameters: :userId (User ID - integer).

- Response (Success): 200 OK with an array of conversation summaries.

- Response (Error): 500 Internal Server Error if fetching fails.

### 14. POST /api/messages

- Description: Sends a new message between two users.

- Request Body: Message data adhering to insertMessageSchema (e.g., {"senderId": "...", "receiverId": "...", "content": "..."}).

- Response (Success): 201 Created with the newly created message object.

- Response (Error): 400 Bad Request for invalid message data.

### 15. POST /api/messages/mark-read

- Description: Marks messages between a sender and receiver as read.

- Request Body: {"senderId": "...", "receiverId": "..."}.

- Response (Success): 200 OK with a success message.

- Response (Error): 500 Internal Server Error if marking fails.
