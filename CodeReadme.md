# CodeBros - Developer Networking Platform

## Overview

CodeBros is a full-stack web application designed to connect developers, enabling them to network, collaborate, and communicate. The platform features user profiles, connection management, real-time messaging, and developer discovery capabilities.

## System Architecture

### Frontend Architecture

- **Framework**: React with TypeScript
- **Build Tool**: Vite for development and production builds
- **Routing**: Wouter for client-side routing
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: TanStack Query for server state management
- **Theme**: Light/dark mode support with context-based theme provider

### Backend Architecture

- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: Express sessions with PostgreSQL store
- **API Design**: RESTful API with JSON responses

### Development Environment

- **Deployment Platform**: Replit-optimized with cartographer plugin
- **Hot Reload**: Vite HMR for frontend, tsx for backend development
- **Error Handling**: Runtime error overlay for development

## Key Components

### Database Schema

- **Users Table**: Stores user profiles with skills, experience levels, and collaboration preferences
- **Connections Table**: Manages developer connections with status tracking (pending, accepted, declined)
- **Messages Table**: Handles direct messaging between connected users

### User Management

- User profiles with customizable information (bio, skills, experience level)
- Online status tracking and last seen timestamps
- Profile images and collaboration preferences
- Search and discovery functionality with filtering

### Connection System

- Send and receive connection requests with optional messages
- Connection status management (pending, accepted, declined)
- View network of connected developers

### Messaging System

- Direct messaging between connected users
- Message read status tracking
- Conversation management with unread counts
- Real-time message display

### UI Components

- Comprehensive component library based on shadcn/ui
- Responsive design with mobile-first approach
- Accessible components following ARIA standards
- Consistent theming with CSS custom properties

## Data Flow

1. **User Authentication**: Currently mocked but structured for future auth implementation
2. **Data Fetching**: TanStack Query manages API calls with caching and error handling
3. **State Updates**: Optimistic updates for better user experience
4. **Real-time Updates**: Prepared for WebSocket integration for live messaging

## External Dependencies

### Core Technologies

- **Database**: Neon Database (serverless PostgreSQL)
- **UI Components**: Radix UI primitives for accessible components
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for date manipulation
- **Form Handling**: React Hook Form with Zod validation

### Development Tools

- **TypeScript**: Strong typing across frontend and backend
- **ESBuild**: Fast production builds
- **PostCSS**: CSS processing with Tailwind
- **Drizzle Kit**: Database migrations and schema management

## Deployment Strategy

### Development

- Vite dev server with HMR for frontend
- tsx for backend development with auto-restart
- Shared TypeScript configuration for consistency

### Production

- Vite production build generates optimized static assets
- ESBuild bundles backend into single Node.js module
- Express serves both API and static files
- Database migrations handled via Drizzle Kit

### Environment Configuration

- Environment variables for database connection
- Separate development and production configurations
- Replit-specific optimizations for cloud deployment

## Changelog

- July 03, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.
