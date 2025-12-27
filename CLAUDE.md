# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React UI Skeleton is a production-ready React 19 + TypeScript frontend template built with Hexagonal Architecture, TanStack Query, and modern best practices.

## Architecture Status: PRODUCTION READY

- Architecture: Hexagonal + Vertical Slices ✅
- Stack: React 19, Vite 6, TanStack Query v5, Zod, TypeScript ✅
- Approach: Hybrid Pragmatic (OOP + FP) ✅
- Status: PRODUCTION READY ✅

## Tech Stack

- **Framework**: React 19.2.0
- **Language**: TypeScript 5.9.3
- **Build Tool**: Vite (via rolldown-vite@7.2.5)
- **Compiler**: SWC (via @vitejs/plugin-react-swc)
- **Server State**: TanStack Query v5
- **Client State**: Zustand v5
- **Validation**: Zod v3
- **Forms**: React Hook Form v7
- **Styling**: Tailwind CSS v4
- **Testing**: Vitest v2 + Testing Library + MSW v2
- **Node Version**: v24 (see .nvmrc)

## Development Commands

### Development
```bash
npm run dev              # Start dev server with HMR
npm run build            # Production build
npm run preview          # Preview production build
```

### Linting & Formatting
```bash
npm run lint             # Check for issues
npm run lint:fix         # Auto-fix issues
npm run format           # Format code
npm run format:check     # Check formatting
```

### Testing
```bash
npm run test             # Run unit tests (Vitest)
npm run test:watch       # Watch mode
npm run test:ui          # Vitest UI
npm run test:coverage    # Coverage report
```

## Architecture

### Hexagonal Architecture (Layers)

```
Infrastructure (UI/API) → Application (Hooks/Queries) → Domain (Entities/VOs)
```

### Vertical Slices by Contexts

```
@contexts/greetings/
├── domain/            # Pure business logic (classes)
│   ├── entities/      # Business entities (immutable classes)
│   ├── value-objects/ # Value objects with validation (classes)
│   └── exceptions/    # Domain exceptions (classes)
├── application/       # Use cases and orchestration (functional)
│   ├── hooks/         # Custom hooks for use cases
│   ├── queries/       # TanStack Query definitions
│   ├── dtos/          # Data transfer objects
│   ├── mappers/       # Domain ↔ DTO transformations
│   ├── validators/    # Zod schemas
│   └── ports/         # Interfaces (inbound/outbound)
└── infrastructure/    # External adapters (functional components)
    ├── ui/            # React functional components & pages
    └── api/           # API clients (repository implementations)
```

### Shared Layer

```
@shared/
├── domain/            # Shared domain logic
│   ├── exceptions/    # Base exceptions
│   └── events/        # Base events
├── application/       # Shared use cases
│   └── hooks/         # Utility hooks
├── infrastructure/    # Shared infrastructure
│   ├── config/        # Environment configuration
│   ├── http/          # HTTP client & interceptors
│   ├── observability/ # Logger, monitoring
│   └── ui/            # Shared UI components & providers
├── types/             # Shared types (Result, ApiResponse)
├── utils/             # Utility functions
└── constants/         # Application constants
```

## Code Architecture

### Project Structure
```
src/
├── @contexts/         # Bounded Contexts (features)
│   └── greetings/     # Example context
├── @shared/           # Cross-cutting concerns
├── @app/              # Application bootstrap
└── main.tsx           # Entry point
```

### TypeScript Configuration

The project uses a **split TypeScript configuration**:

- `tsconfig.json` - References both app and node configs
- `tsconfig.app.json` - Application code (src/) with strict settings
  - Target: ES2022
  - Module: ESNext with bundler resolution
  - Strict mode enabled with additional checks
  - `noEmit: true` (Vite handles compilation)
  - `verbatimModuleSyntax: true` for explicit imports
- `tsconfig.node.json` - Build tools and config files

Key TypeScript settings:
- Strict type checking enabled
- Unused locals/parameters are errors
- No fallthrough cases in switch statements
- Erasable syntax only (performance optimization)

### ESLint Configuration

The project uses **flat ESLint config** (`eslint.config.mjs`) with TypeScript support. Key plugins and rules:

**Installed Plugins** (in eslint.config.mjs):
- `eslint-plugin-import` - Import/export validation
- `eslint-plugin-simple-import-sort` - Automatic import sorting
- `eslint-plugin-vitest` - Vitest test linting
- `eslint-plugin-prettier` - Prettier integration
- `eslint-config-prettier` - Disables conflicting ESLint rules

**Active React Plugins** (in package.json):
- `eslint-plugin-react-hooks` - React Hooks rules
- `eslint-plugin-react-refresh` - Fast Refresh validation

**Important Rules**:
- TypeScript: Explicit function return types (warn), no unused vars, no explicit any (warn)
- Imports: Auto-sorted, first in file, newline after imports, no duplicates
- Console: `console.log` is warned (allow `console.warn` and `console.error`)
- Unused variables/params prefixed with `_` are ignored

**Note**: The ESLint config includes vitest plugin and test file rules, but vitest is not yet installed in package.json. When adding tests, install vitest and related dependencies.

### Prettier Configuration

Prettier auto-formats code with these settings (.prettierrc):
- Print width: 80 characters
- Tab width: 2 spaces (no tabs)
- Semicolons: required
- Quotes: double quotes
- Trailing commas: ES5 style
- Arrow function parens: always
- Line endings: LF (Unix-style)

Files ignored: node_modules, dist, build, coverage, lock files

### Vite Configuration

Uses SWC plugin for React with Fast Refresh. The project uses `rolldown-vite` (Rolldown bundler) instead of standard Vite for improved performance.

## Commit Convention

The project uses **Conventional Commits** with emojis (via commitlint):

Format: `[emoji] type(scope): subject`

Example commit patterns recognized:
```
✨ feat: add user authentication
🐛 fix(api): correct token validation
♻️ refactor: improve component structure
```

The commitlint parser supports optional emoji prefixes and follows @commitlint/config-conventional rules.

## Development Workflow

1. Use Node.js v24 (specified in .nvmrc)
2. Run `npm install` to install dependencies
3. Copy `.env.example` to `.env` if needed
4. Start dev server with `npm run dev`
5. Lint-staged runs automatically on commit (Prettier + ESLint)

## Code Style Guidelines

### Component Types

**Use Classes for:**
- Domain entities
- Value objects
- Domain exceptions
- Result type
- Any business logic object

**Use Functional Components for:**
- React components (UI layer)
- Custom hooks
- Services
- Providers
- All infrastructure layer

### Example:
```typescript
// ✅ Domain Entity - Class
export class Greeting {
  readonly id: string;
  readonly message: Message;
  // ...
}

// ✅ React Component - Function
export const GreetingCard = ({ greeting }: Props) => {
  return <article>...</article>;
};

// ✅ Custom Hook - Function
export const useGetGreeting = () => {
  return useQuery(greetingQueries.detail());
};
```

## Best Practices

DO ✅:
- Keep domain layer pure (no React, no Axios)
- Use classes for domain entities, value objects, exceptions
- Use functional components for all UI
- Use custom hooks for use cases
- Use TanStack Query for server state
- Validate with Zod
- Write unit tests for business logic
- Use Tailwind CSS for styling
- Make entities immutable
- Follow accessibility guidelines

DON'T ❌:
- Put business logic in components
- Import React in domain layer
- Use class components for UI
- Skip validation
- Mutate entities
- Hardcode dependencies
- Skip error handling
- Use console.log (use logger)
- Ignore TypeScript errors
- Use inline styles or CSS modules (use Tailwind)

## Adding New Features

1. Create context folder in `src/@contexts/`
2. Define domain entities and value objects
3. Create use cases (custom hooks)
4. Implement API client (repository)
5. Build UI components
6. Add routes
7. Write tests

## Important Notes

- **Build Tool**: This project uses `rolldown-vite` (specified in package overrides), not standard Vite
- **Styling**: Tailwind CSS v4 with @tailwindcss/vite plugin
- **No Domain Events**: Frontend doesn't emit domain events (EDA is backend-only)
- **Testing**: Vitest + Testing Library + MSW for mocking API calls
- **React Version**: Using React 19 with latest features
- **Component Style**: Functional components only (no class components for UI)
- **Module System**: ESNext modules with bundler resolution
- **Type Safety**: Strict TypeScript with no implicit any, unused variables/parameters caught
- **Path Aliases**: Use `@contexts/`, `@shared/`, `@app/` for imports
- **Environment**: Uses Zod validation with sensible defaults
