# Contributing to MapColonies App Boilerplate

Thank you for your interest in contributing to the MapColonies App Boilerplate! This document provides guidelines for contributing to this project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/app-boilerplate.git`
3. Add upstream remote: `git remote add upstream https://github.com/MapColonies/app-boilerplate.git`
4. Install dependencies: `npm install --legacy-peer-deps`

## Development Workflow

### Creating a Branch

Create a feature branch from `main`:

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `chore/` - Maintenance tasks

### Making Changes

1. Make your changes in your feature branch
2. Follow the code style and conventions used in the project
3. Write clear, concise commit messages following [Conventional Commits](https://www.conventionalcommits.org/)
4. Test your changes locally

### Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat:` - A new feature
- `fix:` - A bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, semicolons, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add dark mode theme support
fix: resolve routing issue on refresh
docs: update installation instructions
```

### Running Tests and Linting

Before submitting your changes:

```bash
# Lint your code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run prettier:fix

# Build the project
npm run build
```

### Submitting a Pull Request

1. Push your changes to your fork
2. Create a pull request to the `main` branch
3. Fill in the pull request template
4. Wait for review and address any feedback

## Code Style

- Use TypeScript for all new code
- Follow the existing code structure and patterns
- Use functional components with hooks
- Keep components small and focused
- Write meaningful variable and function names
- Add comments for complex logic

## Project Structure Guidelines

- Place reusable components in `src/components/`
- Place page components in `src/pages/`
- Keep business logic separate from UI components
- Use the existing i18n system for all user-facing text
- Follow the Material-UI theming system

## Questions or Problems?

- Open an issue for bugs or feature requests
- Use discussions for questions and general feedback

## License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing! 🎉
