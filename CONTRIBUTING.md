# Contributing to Northstar Backend

**Author:** Arman Hazrati  
**Project:** Portfolio Showcase

---

## Welcome!

Thank you for your interest in this project! While this is primarily a portfolio project, contributions, suggestions, and feedback are welcome.

---

## How to Contribute

### 1. Reporting Issues

If you find a bug or have a suggestion:

1. Check if the issue already exists
2. Create a new issue with:
   - Clear title
   - Detailed description
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Environment details

### 2. Suggesting Enhancements

For feature requests:

1. Describe the feature clearly
2. Explain the use case
3. Provide examples if possible
4. Consider implementation complexity

### 3. Code Contributions

#### Getting Started

1. **Fork the repository**
2. **Clone your fork:**
   ```bash
   git clone https://github.com/your-username/northstar-backend.git
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Set up environment:**
   ```bash
   cp ENV_TEMPLATE.txt .env
   # Update .env with your values
   ```
5. **Start Docker services:**
   ```bash
   docker-compose up -d
   ```
6. **Run migrations:**
   ```bash
   npm run prisma:migrate
   npm run prisma:seed
   ```

#### Development Workflow

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow existing code style
   - Add tests for new features
   - Update documentation as needed

3. **Test your changes:**
   ```bash
   npm run test
   npm run test:e2e
   npm run lint
   ```

4. **Commit your changes:**
   ```bash
   git commit -m "feat: add new feature"
   ```
   Follow [Conventional Commits](https://www.conventionalcommits.org/)

5. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**

---

## Code Style Guidelines

### TypeScript

- Use TypeScript strict mode
- Avoid `any` types when possible
- Use interfaces for object shapes
- Use enums for fixed sets of values

### Naming Conventions

- **Files:** kebab-case (e.g., `user-service.ts`)
- **Classes:** PascalCase (e.g., `UserService`)
- **Functions/Methods:** camelCase (e.g., `findUserById`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `MAX_RETRY_COUNT`)

### Code Organization

```typescript
/**
 * Service/Class description
 * @author Your Name
 */

// Imports
import { Injectable } from '@nestjs/common';

// Constants
const MAX_RETRIES = 3;

// Class
@Injectable()
export class MyService {
  // Constructor
  constructor(private readonly dependency: Dependency) {}

  // Public methods
  async publicMethod() {
    // Implementation
  }

  // Private methods
  private privateHelper() {
    // Implementation
  }
}
```

### Comments

- Use JSDoc for classes and public methods
- Explain "why" not "what"
- Keep comments up-to-date
- Remove commented-out code

---

## Testing Guidelines

### Unit Tests

- Test each service method
- Mock dependencies
- Use descriptive test names
- Aim for high coverage

Example:
```typescript
describe('UserService', () => {
  describe('findById', () => {
    it('should return user when found', async () => {
      // Arrange
      const userId = '123';
      // Act
      const result = await service.findById(userId);
      // Assert
      expect(result).toBeDefined();
    });
  });
});
```

### E2E Tests

- Test complete user flows
- Use test database
- Clean up after tests
- Test error scenarios

---

## Commit Message Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(auth): add password reset functionality

Implement password reset flow with email verification.
Includes rate limiting and token expiration.

Closes #123
```

```
fix(users): correct email validation regex

The previous regex didn't handle plus signs in email addresses.

Fixes #456
```

---

## Pull Request Guidelines

### Before Submitting

- [ ] Code follows project style
- [ ] Tests pass locally
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] No linting errors
- [ ] Commits follow convention

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How was this tested?

## Checklist
- [ ] Tests pass
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] No new warnings
```

---

## Development Setup

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 16
- Redis 7

### Environment Variables

Copy `ENV_TEMPLATE.txt` to `.env` and update:

```bash
DATABASE_URL=postgresql://...
REDIS_HOST=localhost
JWT_SECRET=your-secret
```

### Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

### Code Quality

```bash
# Linting
npm run lint

# Formatting
npm run format

# Type checking
npm run build
```

---

## Architecture Guidelines

### Module Structure

```
feature-name/
├── feature-name.controller.ts
├── feature-name.service.ts
├── feature-name.service.spec.ts
├── feature-name.module.ts
└── dto/
    ├── create-feature.dto.ts
    └── update-feature.dto.ts
```

### Service Layer

- Keep business logic in services
- Services should be testable
- Use dependency injection
- Handle errors appropriately

### Controller Layer

- Keep controllers thin
- Validate input with DTOs
- Return consistent responses
- Use proper HTTP status codes

---

## Documentation

### Code Documentation

- Add JSDoc comments to public APIs
- Document complex algorithms
- Explain non-obvious decisions
- Keep README up-to-date

### API Documentation

- Use Swagger decorators
- Document all endpoints
- Include request/response examples
- Document error responses

---

## Questions?

For questions or discussions:

1. Check existing documentation
2. Search closed issues
3. Open a new issue for discussion

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## Acknowledgments

Thank you for contributing to this portfolio project!

**Author:** Arman Hazrati  
**License:** MIT

---

*Built with ❤️ by the community*
