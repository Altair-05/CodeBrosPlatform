# Contributing to CodeBros Platform

Thank you for your interest in contributing to CodeBros Platform! This document provides guidelines and information for contributors.

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- Git

### Setup

1. Fork the repository
2. Clone your fork:

   ```bash
   git clone https://github.com/your-username/CodeBrosPlatform.git
   cd CodeBrosPlatform
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables:

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Development Workflow

### Code Style

We use ESLint and Prettier to maintain consistent code style:

- **ESLint**: For code linting and catching potential errors
- **Prettier**: For code formatting

Run linting:

```bash
npm run lint
```

Fix linting issues:

```bash
npm run lint:fix
```

Format code:

```bash
npm run format
```

### Testing

We use Jest for testing. Run tests with:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Type Checking

Run TypeScript type checking:

```bash
npm run check
```

### Building

Build the project:

```bash
npm run build
```

## Making Changes

1. Create a new branch for your feature/fix:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes

3. Run tests and linting:

   ```bash
   npm run lint
   npm test
   npm run check
   ```

4. Commit your changes with a descriptive message:

   ```bash
   git commit -m "feat: add new feature description"
   ```

5. Push to your fork:

   ```bash
   git push origin feature/your-feature-name
   ```

6. Create a Pull Request

## Pull Request Guidelines

- Use the provided PR template
- Ensure all tests pass
- Ensure code passes linting
- Add tests for new features
- Update documentation if needed
- Keep PRs focused and reasonably sized

## Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

## Code Review Process

1. All PRs require at least one review
2. Address review comments promptly
3. Maintainers will merge once approved

## Getting Help

- Open an issue for bugs or feature requests
- Join our community discussions
- Check existing documentation

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

Thank you for contributing! 🚀
