# Development Guide

This document provides detailed information for developers working on the CodeBros Platform.

## Project Structure

```
CodeBrosPlatform/
├── client/                 # React frontend application
│   ├── src/               # Source code
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Utility functions
│   │   └── main.tsx       # Application entry point
│   └── index.html         # HTML template
├── server/                # Express.js backend
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   ├── db/               # Database configuration
│   └── index.ts          # Server entry point
├── shared/               # Shared types and utilities
├── .github/              # GitHub configuration
│   ├── workflows/        # GitHub Actions
│   └── ISSUE_TEMPLATE/   # Issue templates
├── dist/                 # Build output (generated)
└── docs/                 # Documentation
```

## Technology Stack

### Frontend

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible components
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Backend

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Drizzle ORM** - Database ORM
- **Passport.js** - Authentication
- **WebSocket** - Real-time communication

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework
- **GitHub Actions** - CI/CD

## Environment Setup

### Required Software

- Node.js 18+
- npm or yarn
- Git
- Database (PostgreSQL/Neon)

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=your_database_connection_string

# Authentication
SESSION_SECRET=your_session_secret
JWT_SECRET=your_jwt_secret

# Server
PORT=3000
NODE_ENV=development

# Client
VITE_API_URL=http://localhost:3000
```

## Development Commands

### Installation

```bash
npm install
```

### Development Server

```bash
# Start both client and server
npm run dev

# Start only client
npm run dev:client

# Start only server
npm run dev:server
```

### Building

```bash
# Build for production
npm run build

# Build client only
npm run build:client

# Build server only
npm run build:server
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- path/to/test.ts
```

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check

# Type check
npm run check
```

### Database

```bash
# Push schema changes
npm run db:push

# Seed database
npm run db:seed
```

## Development Workflow

### 1. Feature Development

1. Create a feature branch from `main`
2. Implement your feature
3. Write tests for new functionality
4. Ensure all tests pass
5. Run linting and formatting
6. Create a pull request

### 2. Bug Fixes

1. Create a bug fix branch
2. Reproduce the issue
3. Implement the fix
4. Add regression tests
5. Verify the fix works
6. Create a pull request

### 3. Code Review Process

1. Self-review your changes
2. Request review from maintainers
3. Address feedback
4. Get approval
5. Merge to main

## Testing Strategy

### Unit Tests

- Test individual functions and components
- Mock external dependencies
- Focus on business logic

### Integration Tests

- Test API endpoints
- Test database interactions
- Test component integration

### E2E Tests

- Test complete user workflows
- Test critical paths
- Test cross-browser compatibility

## Code Style Guidelines

### TypeScript

- Use strict mode
- Prefer interfaces over types
- Use proper type annotations
- Avoid `any` type

### React

- Use functional components
- Use hooks for state management
- Follow naming conventions
- Keep components small and focused

### CSS/Styling

- Use Tailwind CSS classes
- Follow BEM methodology for custom CSS
- Use CSS variables for theming
- Ensure responsive design

## Performance Considerations

### Frontend

- Lazy load components
- Optimize bundle size
- Use React.memo for expensive components
- Implement proper caching

### Backend

- Use database indexes
- Implement caching strategies
- Optimize database queries
- Use connection pooling

## Security Best Practices

- Validate all inputs
- Sanitize user data
- Use HTTPS in production
- Implement proper authentication
- Follow OWASP guidelines
- Keep dependencies updated

## Deployment

### Staging

- Automatic deployment on PR merge to develop
- Environment-specific configuration
- Database migrations

### Production

- Manual deployment from main branch
- Blue-green deployment strategy
- Monitoring and logging
- Backup strategies

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check TypeScript errors
   - Verify all dependencies are installed
   - Clear node_modules and reinstall

2. **Database Issues**
   - Verify connection string
   - Check database permissions
   - Run migrations

3. **Test Failures**
   - Check test environment setup
   - Verify mock configurations
   - Check for flaky tests

### Getting Help

- Check existing documentation
- Search existing issues
- Create a new issue with detailed information
- Ask in community channels

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed contribution guidelines.
