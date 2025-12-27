# Frontend React v19 Skeleton - Design Document

## Executive Summary

This document describes the complete architecture and design for a React v19 frontend project that mirrors the Hexagonal Architecture principles of the `node-api-skeleton` backend.

## Architecture Overview

### Hexagonal Architecture Adaptation

The frontend follows **Hexagonal Architecture** with three distinct layers:

```
┌─────────────────────────────────────────────────────────────┐
│  Infrastructure Layer (UI/API)                              │
│  - React Components (presentational & container)            │
│  - API Clients (Axios-based repositories)                   │
│  - Routing (React Router)                                   │
│  - State Management (Zustand stores)                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Application Layer (Hooks/Queries)                          │
│  - Custom Hooks (use cases)                                 │
│  - TanStack Query (server state)                            │
│  - Mappers (domain ↔ DTO)                                   │
│  - Validators (Zod schemas)                                 │
│  - Ports (interfaces)                                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Domain Layer (Business Logic)                              │
│  - Entities (immutable domain models)                       │
│  - Value Objects (validation logic)                         │
│  - Domain Events                                            │
│  - Domain Exceptions                                        │
│  - Pure business rules (framework-agnostic)                 │
└─────────────────────────────────────────────────────────────┘
```

### Vertical Slices by Bounded Contexts

Each feature is organized as a **complete vertical slice**:

```
@contexts/greetings/
├── domain/            # Pure business logic
├── application/       # Use cases (hooks/queries)
└── infrastructure/    # UI components & API clients
```

**Benefits**:

- **High cohesion**: All greeting-related code lives together
- **Easy navigation**: No jumping between folders
- **Scalability**: Add new contexts independently
- **Team ownership**: Teams own complete features
- **Microfrontends-ready**: Easy extraction to separate apps

## Layer Responsibilities

### Domain Layer

**Purpose**: Pure business logic, framework-agnostic

**Contains**:

- **Entities**: Immutable domain models with business methods
- **Value Objects**: Validated, immutable values (email, message, etc.)
- **Domain Events**: Business events (GreetingCreated, UserRegistered)
- **Domain Exceptions**: Business rule violations
- **Business Rules**: Pure validation and transformation logic

**Rules**:

- ✅ NO dependencies on React, Axios, or any framework
- ✅ Immutable by default (`readonly`)
- ✅ Pure functions and classes
- ✅ Factory methods for entity creation
- ✅ Value objects for validation

**Example**:

```typescript
// src/@contexts/greetings/domain/entities/Greeting.ts
export class Greeting {
  private constructor(
    readonly id: string,
    readonly message: Message,
    readonly createdAt: Date
  ) {}

  static create(id: string, message: string): Greeting {
    return new Greeting(id, Message.create(message), new Date());
  }

  isRecent(): boolean {
    const hourAgo = Date.now() - 60 * 60 * 1000;
    return this.createdAt.getTime() > hourAgo;
  }
}
```

### Application Layer

**Purpose**: Orchestrate business logic and external services

**Contains**:

- **Custom Hooks**: Encapsulate use cases (useGetGreeting, useCreateGreeting)
- **TanStack Query**: Server state management (queries, mutations)
- **Mappers**: Transform domain ↔ DTOs
- **Validators**: Zod schemas for runtime validation
- **Ports**: Interfaces for repositories and services
- **DTOs**: Request/Response types

**Rules**:

- ✅ NO React components or JSX
- ✅ CAN import from domain layer
- ✅ CAN define interfaces for infrastructure
- ✅ NO direct API calls (delegate to repositories)
- ✅ Return domain entities, not DTOs

**Example**:

```typescript
// src/@contexts/greetings/application/hooks/useGetGreeting.ts
import { useQuery } from "@tanstack/react-query";
import { greetingQueries } from "../queries/greetingQueries";

export const useGetGreeting = () => {
  return useQuery({
    ...greetingQueries.detail(),
    select: (data) => GreetingMapper.toDomain(data),
  });
};
```

### Infrastructure Layer

**Purpose**: Framework-specific implementations (UI, API, storage)

**Contains**:

- **UI Components**: React components (pages, forms, cards)
- **API Clients**: Axios-based repository implementations
- **Routes**: React Router definitions
- **Zustand Stores**: Client-side state (if needed)
- **Third-party integrations**: Analytics, error tracking

**Rules**:

- ✅ CAN import from application and domain layers
- ✅ CAN use React, Axios, and framework-specific code
- ✅ Implements interfaces defined in application layer
- ✅ Delegates business logic to domain/application

**Example**:

```typescript
// src/@contexts/greetings/infrastructure/ui/components/GreetingCard.tsx
import { Greeting } from "../../../domain/entities/Greeting";

interface GreetingCardProps {
  greeting: Greeting; // Domain entity, not DTO!
}

export const GreetingCard: React.FC<GreetingCardProps> = ({ greeting }) => {
  return (
    <div>
      <p>{greeting.message.value}</p>
      {greeting.isRecent() && <span>🆕 New!</span>}
    </div>
  );
};
```

## Technology Stack

### Core Framework

- **React 19**: Latest React with Compiler
- **TypeScript 5.9**: Type-safe development
- **Vite 6**: Lightning-fast build tool (esbuild + Rollup)

### Data Fetching & State

- **TanStack Query v5**: Server state management
- **Axios 1.7**: HTTP client
- **Zustand 5**: Lightweight client state (when needed)

### Validation & Types

- **Zod 4.2**: Runtime schema validation
- **TypeScript**: Compile-time type safety

### UI & Styling

- **CSS Modules**: Scoped styles
- **PostCSS**: CSS processing
- **Tailwind CSS** (optional): Utility-first CSS

### Testing

- **Vitest 4.0**: Unit and integration tests
- **Testing Library**: Component tests
- **Playwright 2.0**: E2E tests
- **Storybook 8**: Component development & visual testing
- **MSW 2.0**: API mocking

### DevOps & Observability

- **Docker**: Multi-stage production builds
- **Nginx**: Production web server
- **Sentry**: Error tracking
- **Web Vitals**: Performance monitoring

### Development Tools

- **ESLint 9**: Code linting
- **Prettier 3**: Code formatting
- **Husky 9**: Git hooks
- **lint-staged**: Pre-commit checks

## Request Flow

### Read Operation (Query)

```
User Interaction
    ↓
Component calls useGetGreeting()
    ↓
TanStack Query fetches from cache or API
    ↓
GreetingApiClient.getGreeting() (repository)
    ↓
Axios GET /api/v1/greetings
    ↓
Response DTO received
    ↓
GreetingMapper.toDomain(dto) → Greeting entity
    ↓
Component receives Greeting entity
    ↓
Render UI with entity.message.value
```

### Write Operation (Mutation)

```
User submits form
    ↓
Component calls useCreateGreeting()
    ↓
TanStack Query mutation
    ↓
Validator validates input (Zod schema)
    ↓
GreetingMapper.toCreateRequest(input) → CreateGreetingRequestDto
    ↓
GreetingApiClient.createGreeting(dto)
    ↓
Axios POST /api/v1/greetings
    ↓
Response DTO received
    ↓
GreetingMapper.toDomain(dto) → Greeting entity
    ↓
TanStack Query invalidates cache
    ↓
UI updates automatically
```

## Design Patterns

### 1. Repository Pattern (API Clients)

```typescript
// Application layer: Define interface (port)
export interface IGreetingRepository {
  getGreeting(): Promise<GreetingResponseDto>;
  createGreeting(
    request: CreateGreetingRequestDto
  ): Promise<GreetingResponseDto>;
}

// Infrastructure layer: Implement with Axios
export class GreetingApiClient implements IGreetingRepository {
  constructor(private readonly httpClient: AxiosInstance) {}

  async getGreeting(): Promise<GreetingResponseDto> {
    const response = await this.httpClient.get<GreetingResponseDto>(
      "/greetings"
    );
    return response.data;
  }
}
```

### 2. Factory Pattern (Entities)

```typescript
export class Greeting {
  private constructor(
    readonly id: string,
    readonly message: Message,
    readonly createdAt: Date
  ) {}

  static create(id: string, message: string): Greeting {
    // Validation happens in Message.create()
    return new Greeting(id, Message.create(message), new Date());
  }

  static fromDto(dto: GreetingResponseDto): Greeting {
    return new Greeting(
      dto.id,
      Message.create(dto.message),
      new Date(dto.timestamp)
    );
  }
}
```

### 3. Mapper Pattern (Pure Functions)

```typescript
export const GreetingMapper = {
  toDomain(dto: GreetingResponseDto): Greeting {
    return Greeting.fromDto(dto);
  },

  toResponseDto(entity: Greeting): GreetingResponseDto {
    return {
      id: entity.id,
      message: entity.message.value,
      timestamp: entity.createdAt.toISOString(),
    };
  },

  toCreateRequest(input: CreateGreetingInput): CreateGreetingRequestDto {
    return {
      message: input.message,
    };
  },
};
```

### 4. Custom Hooks (Use Cases)

```typescript
// Query hook (read)
export const useGetGreeting = () => {
  const repository = useGreetingRepository();

  return useQuery({
    queryKey: ["greetings", "detail"],
    queryFn: async () => {
      const dto = await repository.getGreeting();
      return GreetingMapper.toDomain(dto);
    },
  });
};

// Mutation hook (write)
export const useCreateGreeting = () => {
  const repository = useGreetingRepository();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateGreetingInput) => {
      const request = GreetingMapper.toCreateRequest(input);
      const dto = await repository.createGreeting(request);
      return GreetingMapper.toDomain(dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["greetings"] });
    },
  });
};
```

### 5. Compound Components

```typescript
const Greeting = ({ greeting }: { greeting: Greeting }) => (
  <GreetingCard>
    <GreetingCard.Header>
      <GreetingCard.Title>{greeting.message.value}</GreetingCard.Title>
    </GreetingCard.Header>
    <GreetingCard.Body>
      <GreetingCard.Timestamp>{greeting.createdAt}</GreetingCard.Timestamp>
    </GreetingCard.Body>
  </GreetingCard>
);
```

### 6. Error Boundary Pattern

```typescript
export class ErrorBoundary extends React.Component<Props, State> {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error("React Error Boundary caught error", {
      error: error.message,
      componentStack: errorInfo.componentStack,
    });

    // Send to Sentry
    errorTracking.captureException(error, {
      contexts: { react: errorInfo },
    });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}
```

## State Management Strategy

### Server State (TanStack Query)

**Use for**:

- Data from APIs (GET, POST, PUT, DELETE)
- Caching, refetching, background updates
- Optimistic updates
- Request deduplication

**Example**:

```typescript
const { data: greeting, isLoading } = useGetGreeting();
const { mutate: createGreeting } = useCreateGreeting();
```

### Client State (Zustand)

**Use for**:

- UI state (modals, sidebars, themes)
- Global app state (auth, user preferences)
- Form state (multi-step forms)
- Temporary state not persisted to server

**Example**:

```typescript
// Only when React Context causes performance issues
const useThemeStore = create<ThemeState>((set) => ({
  theme: "light",
  setTheme: (theme) => set({ theme }),
}));
```

### Local State (useState)

**Use for**:

- Component-specific state
- Form inputs (simple forms)
- Toggle states

**Example**:

```typescript
const [isOpen, setIsOpen] = useState(false);
```

**Decision Tree**:

```
Is it server data? → Use TanStack Query
Is it shared across many components? → Use Zustand
Is it component-specific? → Use useState
```

## Testing Strategy

### Unit Tests (Domain & Application)

**Coverage target**: 90%+

**Test**:

- Domain entities and value objects
- Mappers
- Validators
- Utility functions

**Example**:

```typescript
describe("Greeting Entity", () => {
  it("should create valid greeting", () => {
    const greeting = Greeting.create("1", "Hello World");

    expect(greeting.id).toBe("1");
    expect(greeting.message.value).toBe("Hello World");
  });

  it("should throw on invalid message", () => {
    expect(() => Greeting.create("1", "")).toThrow(InvalidGreetingException);
  });
});
```

### Component Tests (Testing Library)

**Test**:

- User interactions
- Rendering logic
- Accessibility
- Edge cases

**Example**:

```typescript
describe("GreetingCard", () => {
  it("should render greeting message", () => {
    const greeting = Greeting.create("1", "Hello World");

    render(<GreetingCard greeting={greeting} />);

    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });
});
```

### Integration Tests

**Test**:

- Complete user flows
- API integration (with MSW)
- State management interactions

**Example**:

```typescript
describe("Greeting Flow", () => {
  it("should create and display greeting", async () => {
    const user = userEvent.setup();
    render(<GreetingsPage />);

    await user.type(screen.getByLabelText("Message"), "Hello!");
    await user.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => {
      expect(screen.getByText("Hello!")).toBeInTheDocument();
    });
  });
});
```

### E2E Tests (Playwright)

**Test**:

- Critical user journeys
- Cross-browser compatibility
- Mobile responsiveness

**Example**:

```typescript
test("user can create greeting", async ({ page }) => {
  await page.goto("/greetings");
  await page.fill('[aria-label="Message"]', "Hello E2E!");
  await page.click('button:has-text("Send")');

  await expect(page.locator("text=Hello E2E!")).toBeVisible();
});
```

### Visual Regression Tests (Storybook)

**Test**:

- Component visual consistency
- Responsive design
- Theme variations

**Example**:

```typescript
export const Default: Story = {
  args: {
    greeting: Greeting.create("1", "Hello Storybook"),
  },
};

export const LongMessage: Story = {
  args: {
    greeting: Greeting.create("1", "A".repeat(200)),
  },
};
```

## Performance Optimization

### Code Splitting

```typescript
// Route-based splitting
const GreetingsPage = lazy(() => import("./pages/GreetingsPage"));

// Component-based splitting (heavy components)
const HeavyChart = lazy(() => import("./components/HeavyChart"));
```

### Memoization

```typescript
// Expensive computations
const sortedGreetings = useMemo(
  () => greetings.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()),
  [greetings]
);

// Prevent unnecessary re-renders
const GreetingCard = memo(({ greeting }: Props) => {
  // Component code
});
```

### Virtual Scrolling

```typescript
import { useVirtualizer } from "@tanstack/react-virtual";

const rowVirtualizer = useVirtualizer({
  count: greetings.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 60,
});
```

### Prefetching

```typescript
// Prefetch on hover
const prefetchGreeting = (id: string) => {
  queryClient.prefetchQuery({
    queryKey: ["greetings", id],
    queryFn: () => repository.getGreeting(id),
  });
};

<Link to={`/greetings/${id}`} onMouseEnter={() => prefetchGreeting(id)}>
  View Details
</Link>;
```

## Accessibility (a11y)

### Requirements

- WCAG 2.1 Level AA compliance
- Keyboard navigation
- Screen reader support
- ARIA attributes

### Implementation

```typescript
<button
  aria-label="Send greeting"
  aria-describedby="greeting-help"
  onClick={handleSubmit}
>
  Send
</button>

<p id="greeting-help">
  Enter a message between 1 and 200 characters
</p>
```

### Testing

```typescript
import { axe } from "jest-axe";

it("should have no accessibility violations", async () => {
  const { container } = render(<GreetingForm />);
  const results = await axe(container);

  expect(results).toHaveNoViolations();
});
```

## Security

### Input Validation

```typescript
// Runtime validation with Zod
const createGreetingSchema = z.object({
  message: z.string().min(1).max(200).trim(),
});

// Validate before sending to API
const validatedInput = createGreetingSchema.parse(input);
```

### XSS Prevention

```typescript
// React escapes by default
<p>{greeting.message.value}</p> // Safe

// Dangerous (avoid)
<div dangerouslySetInnerHTML={{ __html: userInput }} /> // ❌
```

### CSRF Protection

```typescript
// Include CSRF token in requests
axios.defaults.headers.common["X-CSRF-Token"] = csrfToken;
```

### Content Security Policy

```html
<!-- index.html -->
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';"
/>
```

## Docker Setup

### Multi-stage Production Build

```dockerfile
# Stage 1: Build
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Development with Hot Reload

```dockerfile
FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
```

## Observability

### Logging

```typescript
// Structured logging
logger.info("User created greeting", {
  userId: user.id,
  greetingId: greeting.id,
  timestamp: new Date().toISOString(),
});
```

### Error Tracking (Sentry)

```typescript
// Auto-capture errors
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
});
```

### Performance Monitoring

```typescript
// Core Web Vitals
import { onCLS, onFID, onFCP, onLCP, onTTFB } from "web-vitals";

onCLS(console.log);
onFID(console.log);
onFCP(console.log);
onLCP(console.log);
onTTFB(console.log);
```

### Analytics

```typescript
// Track user interactions
analytics.track("greeting_created", {
  greetingId: greeting.id,
  messageLength: greeting.message.value.length,
});
```

## Best Practices

### DO ✅

- Keep domain layer pure (no React, no Axios)
- Use dependency injection via Context API
- Write unit tests for business logic
- Use value objects for validation
- Make entities immutable
- Use factory methods for entity creation
- Define clear port interfaces
- Use custom hooks for use cases
- Use TanStack Query for server state
- Log with structured context
- Monitor performance with Web Vitals
- Implement error boundaries
- Use code splitting
- Validate with Zod
- Follow accessibility guidelines

### DON'T ❌

- Put business logic in components
- Import React in domain layer
- Skip validation
- Mutate entities after creation
- Use framework-specific code in domain/application
- Hardcode dependencies
- Skip error handling
- Expose domain entities directly in props (convert to DTOs if needed)
- Use console.log (use logger instead)
- Forget accessibility
- Skip performance optimization
- Ignore TypeScript errors

## Migration Path from Traditional React

### Before (Traditional React)

```typescript
// All logic in component
const GreetingsPage = () => {
  const [greeting, setGreeting] = useState<Greeting | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/greetings")
      .then((res) => setGreeting(res.data))
      .finally(() => setLoading(false));
  }, []);

  return <div>{greeting?.message}</div>;
};
```

### After (Hexagonal Architecture)

```typescript
// Domain
class Greeting {
  private constructor(
    readonly id: string,
    readonly message: Message,
    readonly createdAt: Date
  ) {}

  static fromDto(dto: GreetingResponseDto): Greeting {
    return new Greeting(
      dto.id,
      Message.create(dto.message),
      new Date(dto.timestamp)
    );
  }
}

// Application (custom hook)
const useGetGreeting = () => {
  const repository = useGreetingRepository();

  return useQuery({
    queryKey: ["greetings", "detail"],
    queryFn: async () => {
      const dto = await repository.getGreeting();
      return Greeting.fromDto(dto);
    },
  });
};

// Infrastructure (component)
const GreetingsPage = () => {
  const { data: greeting, isLoading } = useGetGreeting();

  if (isLoading) return <Spinner />;

  return <GreetingCard greeting={greeting!} />;
};
```

**Benefits**:

- ✅ Business logic testable without React
- ✅ API client mockable
- ✅ Automatic caching and refetching
- ✅ Type-safe end-to-end
- ✅ Clear separation of concerns

## Conclusion

This architecture provides:

1. **Scalability**: Add features independently
2. **Maintainability**: Clear boundaries and responsibilities
3. **Testability**: Pure business logic, easy mocking
4. **Type Safety**: End-to-end type checking
5. **Performance**: Code splitting, memoization, virtual scrolling
6. **Observability**: Logging, error tracking, analytics
7. **Developer Experience**: Hot reload, linting, formatting
8. **Production Ready**: Docker, CI/CD, monitoring

The architecture is **pragmatic**, not dogmatic. Adapt patterns to your needs, but always maintain clear layer boundaries and dependency rules.
