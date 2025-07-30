# Development Guide

This guide provides detailed information for developers working on CodeBrosPlatform.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Environment](#development-environment)
- [Code Quality](#code-quality)
- [Testing](#testing)
- [Building](#building)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Initial Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/CodeBrosPlatform.git
   cd CodeBrosPlatform
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Visit: [http://localhost:5000](http://localhost:5000)

## Development Environment

### Project Structure

```
CodeBrosPlatform/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # App pages
│   │   ├── lib/           # Utilities and helpers
│   │   ├── hooks/         # Custom React hooks
│   │   ├── contexts/      # React contexts
│   │   └── __tests__/     # Test files
│   └── index.html
├── server/                 # Express backend
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── db.ts              # Data storage
│   └── storage.ts         # File storage
├── shared/                 # Shared types & schemas
├── .github/                # GitHub workflows and templates
├── .eslintrc.json         # ESLint configuration
├── .prettierrc            # Prettier configuration
├── jest.config.js         # Jest configuration
└── package.json           # Project dependencies
```

### Available Scripts

| Script                  | Description               |
| ----------------------- | ------------------------- |
| `npm run dev`           | Start development server  |
| `npm run build`         | Build for production      |
| `npm run start`         | Start production server   |
| `npm run lint`          | Run ESLint                |
| `npm run lint:fix`      | Fix ESLint issues         |
| `npm run format`        | Format code with Prettier |
| `npm run test`          | Run tests                 |
| `npm run test:watch`    | Run tests in watch mode   |
| `npm run test:coverage` | Run tests with coverage   |
| `npm run type-check`    | TypeScript type checking  |

## Code Quality

### ESLint

The project uses ESLint for code linting with the following configuration:

- TypeScript support
- React hooks rules
- Prettier integration
- Common best practices

Run linting:

```bash
npm run lint
```

Fix issues automatically:

```bash
npm run lint:fix
```

### Prettier

Prettier is used for code formatting with the following settings:

- Single quotes
- 2 spaces indentation
- 80 character line length
- Trailing commas
- Semicolons

Format code:

```bash
npm run format
```

### TypeScript

The project uses TypeScript for type safety. Run type checking:

```bash
npm run type-check
```

## Testing

### Test Framework

The project uses Jest with the following setup:

- TypeScript support
- React Testing Library
- DOM environment
- Coverage reporting

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

Tests should be placed in `__tests__` directories or have `.test.ts` or `.spec.ts` extensions.

Example test structure:

```typescript
describe('ComponentName', () => {
  it('should render correctly', () => {
    // Test implementation
  });

  it('should handle user interactions', () => {
    // Test implementation
  });
});
```

### Test Coverage

The project aims for at least 70% test coverage across:

- Branches
- Functions
- Lines
- Statements

## Building

### Development Build

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

The build process:

1. Compiles TypeScript
2. Bundles frontend with Vite
3. Bundles backend with esbuild
4. Outputs to `dist/` directory

## Deployment

### Local Production

```bash
npm run build
npm run start
```

### Environment Variables

Create a `.env` file for environment-specific configuration:

```env
NODE_ENV=production
PORT=5000
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   - Change the port in the environment variables
   - Kill existing processes on the port

2. **TypeScript errors**
   - Run `npm run type-check` to see all errors
   - Fix type issues before committing

3. **Linting errors**
   - Run `npm run lint:fix` to auto-fix issues
   - Manually fix remaining issues

4. **Test failures**
   - Check test output for specific failures
   - Ensure all dependencies are installed
   - Verify test environment setup

### Getting Help

- Check existing issues on GitHub
- Review the documentation
- Ask in project discussions
- Create a new issue with detailed information

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed contribution guidelines.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
