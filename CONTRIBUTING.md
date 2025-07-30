# Contributing to CodeBrosPlatform

Thank you for your interest in contributing to CodeBrosPlatform! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Style](#code-style)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Issue Guidelines](#issue-guidelines)
- [Pull Request Guidelines](#pull-request-guidelines)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## Getting Started

1. **Fork the repository**

   ```bash
   git clone https://github.com/your-username/CodeBrosPlatform.git
   cd CodeBrosPlatform
   ```

2. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Environment Setup

1. **Clone and install**

   ```bash
   git clone https://github.com/your-username/CodeBrosPlatform.git
   cd CodeBrosPlatform
   npm install
   ```

2. **Start development server**

   ```bash
   npm run dev
   ```

3. **Open in browser**
   - Visit: [http://localhost:5000](http://localhost:5000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage

## Code Style

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow the ESLint configuration
- Use Prettier for code formatting
- Write meaningful variable and function names
- Add JSDoc comments for complex functions

### React Components

- Use functional components with hooks
- Use TypeScript interfaces for props
- Follow the component naming convention: PascalCase
- Keep components focused and single-purpose

### File Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── hooks/         # Custom React hooks
├── lib/           # Utilities and helpers
├── contexts/      # React contexts
└── types/         # TypeScript type definitions
```

## Testing

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

- Write tests for all new features
- Use descriptive test names
- Test both success and error cases
- Aim for at least 80% code coverage

### Test Structure

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

## Submitting Changes

### Before Submitting

1. **Run all checks**

   ```bash
   npm run lint
   npm run type-check
   npm run test
   npm run build
   ```

2. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

3. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Format

Use conventional commits format:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test changes
- `chore:` - Build/tooling changes

Example:

```
feat: add user authentication system
fix: resolve login form validation issue
docs: update README with new setup instructions
```

## Issue Guidelines

### Before Creating an Issue

1. Check if the issue already exists
2. Search the documentation
3. Try to reproduce the issue

### Issue Template

When creating an issue, please include:

- **Title**: Clear and descriptive
- **Description**: Detailed explanation of the problem
- **Steps to reproduce**: Step-by-step instructions
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Environment**: OS, browser, Node.js version
- **Screenshots**: If applicable

## Pull Request Guidelines

### Before Submitting a PR

1. **Ensure all tests pass**

   ```bash
   npm run test
   ```

2. **Check code style**

   ```bash
   npm run lint
   npm run format
   ```

3. **Update documentation** if needed

4. **Add tests** for new features

### PR Template

When creating a PR, please include:

- **Title**: Clear and descriptive
- **Description**: What changes were made and why
- **Type of change**: Feature, bug fix, documentation, etc.
- **Testing**: How you tested the changes
- **Screenshots**: If UI changes were made

### PR Review Process

1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Address feedback** if any
4. **Merge** when approved

## Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general discussion
- **Documentation**: Check the README and other docs

## Recognition

Contributors will be recognized in the project's README and release notes.

Thank you for contributing to CodeBrosPlatform! 🚀
