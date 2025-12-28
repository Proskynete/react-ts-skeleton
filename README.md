# React TypeScript Skeleton

A production-ready React + TypeScript template following **Hexagonal Architecture** principles with modern tooling and best practices.

## 🚀 Features

- ⚛️ **React 19** with TypeScript 5.9
- 🏗️ **Hexagonal Architecture** (Ports & Adapters)
- 🎨 **Tailwind CSS v3** for styling
- 📝 **React Hook Form** + **Zod** for forms and validation
- 🔄 **TanStack Query v5** for server state management
- 🐻 **Zustand v5** for client state management
- 🧪 **Vitest** + **Testing Library** for unit/integration testing
- 🎭 **MSW v2** for API mocking
- ⚡ **Vite** (via rolldown-vite) for blazing-fast builds
- 🔧 **ESLint** + **Prettier** for code quality
- 📦 **Conventional Commits** with Commitlint
- 🎯 **Path Aliases** (@app, @shared, @contexts)

## 📁 Project Structure

```
react-ts-skeleton/
├── src/
│   ├── @app/                    # Application layer
│   │   ├── components/          # Reusable UI components
│   │   ├── App.tsx             # Main app component
│   │   └── AppProviders.tsx    # Global providers
│   │
│   ├── @contexts/               # Bounded contexts (vertical slices)
│   │   └── [context-name]/
│   │       ├── domain/         # Business logic (entities, value objects, exceptions)
│   │       ├── application/    # Use cases (hooks, DTOs, ports, validators)
│   │       └── infrastructure/ # External adapters (API clients, UI components)
│   │
│   ├── @shared/                 # Cross-cutting concerns
│   │   ├── infrastructure/
│   │   │   ├── config/         # Environment & configuration
│   │   │   ├── http/           # HTTP client & interceptors
│   │   │   ├── observability/  # Logger & monitoring
│   │   │   └── ui/             # Shared UI (ErrorBoundary, Providers)
│   │   └── types/              # Shared TypeScript types
│   │
│   ├── mocks/                   # MSW browser mocks (development)
│   │   ├── handlers/           # API mock handlers
│   │   └── browser.ts          # MSW browser worker setup
│   │
│   ├── main.tsx                # App entry point
│   └── index.css               # Global styles (Tailwind)
│
├── tests/
│   └── setup/                  # Test configuration
│       └── mocks/              # MSW test handlers
│
├── docs/
│   ├── guides/                 # Architecture guides
│   └── adr/                    # Architecture Decision Records
│
├── specs/                      # Gherkin/BDD specs
│
└── public/                     # Static assets
```

## 🎯 Architecture Principles

This template follows **Hexagonal Architecture** (also known as Ports and Adapters):

### Layers

1. **Domain Layer** (`domain/`)
   - Pure business logic
   - No external dependencies
   - Entities, Value Objects, Domain Exceptions

2. **Application Layer** (`application/`)
   - Use cases and application services
   - Defines ports (interfaces)
   - DTOs, Validators, Mappers, Hooks

3. **Infrastructure Layer** (`infrastructure/`)
   - External adapters
   - API clients, UI components
   - Implements ports from application layer

### Key Concepts

- **Classes**: Use classes only for domain entities, value objects, and exceptions
- **Functions**: Use functional components for UI, hooks, and services
- **Bounded Contexts**: Organize code by business domains (vertical slices)
- **Dependency Inversion**: Domain and application layers don't depend on infrastructure

For more details, see:
- [Domain Layer Guide](./docs/guides/DOMAIN_LAYER_GUIDE.md)
- [React Skeleton Complete Guide](./docs/guides/REACT_SKELETON_COMPLETE_GUIDE.md)

## 🛠️ Getting Started

### Prerequisites

- Node.js v24 (check `.nvmrc`)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### Development

```bash
# Start dev server
npm run dev

# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🧪 Testing

This template uses **Vitest** + **Testing Library** + **MSW**:

- **Unit tests**: Test individual components/functions
- **Integration tests**: Test component interactions
- **MSW**: Mock API calls in tests and development

### Test Structure

```
tests/
└── setup/
    ├── mocks/
    │   ├── handlers.ts    # MSW test handlers
    │   └── server.ts      # MSW server setup
    ├── testUtils.tsx      # Testing utilities
    └── vitest.setup.ts    # Vitest configuration
```

### Running Tests

```bash
npm run test            # Run tests once
npm run test:watch      # Watch mode
npm run test:ui         # Open Vitest UI
npm run test:coverage   # Generate coverage report
```

## 🎭 API Mocking with MSW

Mock Service Worker (MSW) is configured for both development and testing:

### Development Mocks

Located in `src/mocks/`:

```typescript
// src/mocks/handlers/index.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: 1, name: 'John Doe' },
    ]);
  }),
];
```

To enable MSW in development:

```typescript
// src/main.tsx
if (import.meta.env.VITE_USE_MSW === 'true') {
  const { mockWorker } = await import('./mocks/browser');
  await mockWorker.start();
}
```

### Test Mocks

Located in `tests/setup/mocks/handlers.ts` - automatically used by Vitest.

## 🎨 Styling

This template uses **Tailwind CSS v3**:

```tsx
export const Button = ({ children }: { children: ReactNode }) => {
  return (
    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
      {children}
    </button>
  );
};
```

Configuration:
- `tailwind.config.js` - Tailwind configuration
- `postcss.config.js` - PostCSS plugins
- `src/index.css` - Tailwind directives

## 📝 Forms & Validation

Forms use **React Hook Form** + **Zod**:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormData = z.infer<typeof schema>;

export const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      {/* ... */}
    </form>
  );
};
```

## 🔄 State Management

### Server State (TanStack Query)

For API data caching and synchronization:

```typescript
import { useQuery } from '@tanstack/react-query';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => fetchUsers(),
  });
};
```

### Client State (Zustand)

For local UI state:

```typescript
import { create } from 'zustand';

interface ThemeStore {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: 'light',
  toggleTheme: () => set((state) => ({
    theme: state.theme === 'light' ? 'dark' : 'light'
  })),
}));
```

## 🔧 Configuration

### Path Aliases

Configured in `vite.config.ts` and `tsconfig.app.json`:

```typescript
import { Something } from '@app/components/Something';
import { httpClient } from '@shared/infrastructure/http/httpClient';
import { User } from '@contexts/users/domain/entities/User';
```

### Environment Variables

Add variables to `.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_API_TIMEOUT=10000
VITE_USE_MSW=false
```

Access via `environment.ts`:

```typescript
import { env } from '@shared/infrastructure/config/environment';

console.log(env.VITE_API_BASE_URL);
```

## 📋 Code Quality

### Linting

```bash
npm run lint        # Check for issues
npm run lint:fix    # Auto-fix issues
```

### Formatting

```bash
npm run format          # Format all files
npm run format:check    # Check formatting
```

### Commit Conventions

This project uses **Conventional Commits**:

```bash
feat: add user authentication
fix: resolve login error
docs: update README
chore: update dependencies
```

Enforced by **Commitlint** via Git hooks (Husky + lint-staged).

## 📚 Documentation

- [CLAUDE.md](./CLAUDE.md) - Repository guide for Claude Code
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines
- [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) - Code of conduct
- [CHANGELOG.md](./CHANGELOG.md) - Version history
- [Domain Layer Guide](./docs/guides/DOMAIN_LAYER_GUIDE.md) - Domain layer patterns
- [React Skeleton Guide](./docs/guides/REACT_SKELETON_COMPLETE_GUIDE.md) - Complete architecture guide

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

Built with:
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TanStack Query](https://tanstack.com/query)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Vitest](https://vitest.dev/)
- [MSW](https://mswjs.io/)

---

**Happy coding!** 🚀
