# React Router Guide - Hexagonal Architecture

Este documento explica cómo implementar routing en el proyecto React UI Skeleton siguiendo Hexagonal Architecture y Vertical Slices.

## Tabla de Contenido

1. [Estructura de Routing](#estructura-de-routing)
2. [Configuración Principal](#configuración-principal)
3. [Routes por Contexto](#routes-por-contexto)
4. [Guardas y Protección](#guardas-y-protección)
5. [Lazy Loading](#lazy-loading)
6. [Layouts](#layouts)
7. [Navegación Programática](#navegación-programática)
8. [Manejo de Errores](#manejo-de-errores)

---

## Estructura de Routing

### Arquitectura de Rutas

```
src/
├── @app/
│   └── router.tsx                    # Router principal (bootstrap)
│
├── @shared/
│   └── infrastructure/
│       ├── routing/
│       │   ├── routes.tsx            # Definición de todas las rutas
│       │   └── guards/
│       │       ├── AuthGuard.tsx     # Protección por autenticación
│       │       ├── RoleGuard.tsx     # Protección por roles
│       │       └── GuestGuard.tsx    # Solo usuarios no autenticados
│       └── ui/
│           └── components/
│               ├── Layout.tsx        # Layout principal
│               ├── NotFound.tsx      # Página 404
│               └── ErrorPage.tsx     # Página de errores
│
└── @contexts/
    ├── greetings/
    │   └── infrastructure/
    │       └── ui/
    │           ├── routes/
    │           │   └── greetingRoutes.tsx   # Rutas del contexto Greetings
    │           └── pages/
    │               ├── GreetingsPage.tsx
    │               ├── GreetingDetailPage.tsx
    │               └── CreateGreetingPage.tsx
    │
    └── users/
        └── infrastructure/
            └── ui/
                ├── routes/
                │   └── userRoutes.tsx       # Rutas del contexto Users
                └── pages/
                    ├── UsersPage.tsx
                    ├── UserProfilePage.tsx
                    └── UserSettingsPage.tsx
```

### Principios

1. **Vertical Slices**: Cada contexto define sus propias rutas
2. **Lazy Loading**: Carga diferida de páginas para optimizar performance
3. **Guardas Reutilizables**: Protección declarativa de rutas
4. **Type-Safe**: Rutas con TypeScript para evitar errores

---

## Configuración Principal

### 1. `src/@app/router.tsx`

```typescript
/**
 * Router Principal
 *
 * @layer App/Bootstrap
 */

import React, { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorBoundary } from "@shared/infrastructure/ui/components/ErrorBoundary";
import { routes } from "@shared/infrastructure/routing/routes";
import { LoadingFallback } from "@shared/infrastructure/ui/components/LoadingFallback";

const router = createBrowserRouter(routes, {
  future: {
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
  },
});

export const AppRouter: React.FC = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <RouterProvider router={router} />
      </Suspense>
    </ErrorBoundary>
  );
};
```

### 2. `src/@shared/infrastructure/routing/routes.tsx`

```typescript
/**
 * Definición Centralizada de Rutas
 *
 * @layer Shared/Infrastructure
 */

import React, { lazy } from "react";
import { RouteObject, Navigate } from "react-router-dom";
import { Layout } from "@shared/infrastructure/ui/components/Layout";
import { NotFound } from "@shared/infrastructure/ui/components/NotFound";
import { ErrorPage } from "@shared/infrastructure/ui/components/ErrorPage";
import { AuthGuard } from "./guards/AuthGuard";
import { GuestGuard } from "./guards/GuestGuard";
import { greetingRoutes } from "@contexts/greetings/infrastructure/ui/routes/greetingRoutes";
import { userRoutes } from "@contexts/users/infrastructure/ui/routes/userRoutes";
import { authRoutes } from "@contexts/auth/infrastructure/ui/routes/authRoutes";

// Lazy load de páginas principales
const HomePage = lazy(() => import("@shared/infrastructure/ui/pages/HomePage"));
const DashboardPage = lazy(
  () => import("@shared/infrastructure/ui/pages/DashboardPage")
);

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      // Root redirect
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },

      // Public routes
      {
        path: "home",
        element: <HomePage />,
      },

      // Protected routes (requieren autenticación)
      {
        path: "dashboard",
        element: (
          <AuthGuard>
            <DashboardPage />
          </AuthGuard>
        ),
      },

      // Context routes (Vertical Slices)
      ...greetingRoutes,
      ...userRoutes,

      // 404 - Debe estar al final
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },

  // Auth routes (sin layout, guest only)
  {
    element: <GuestGuard />,
    children: authRoutes,
  },
];
```

### 3. `src/@shared/constants/routes.ts`

```typescript
/**
 * Constantes de Rutas (Type-Safe)
 *
 * @layer Shared/Constants
 */

export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",

  // Auth
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",

  // Greetings Context
  GREETINGS: "/greetings",
  GREETING_DETAIL: (id: string) => `/greetings/${id}`,
  GREETING_CREATE: "/greetings/create",
  GREETING_EDIT: (id: string) => `/greetings/${id}/edit`,

  // Users Context
  USERS: "/users",
  USER_PROFILE: (id: string) => `/users/${id}`,
  USER_SETTINGS: "/users/settings",

  // Admin
  ADMIN: "/admin",
  ADMIN_USERS: "/admin/users",
} as const;

// Type helper para validar rutas
export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
```

---

## Routes por Contexto

### Ejemplo: `src/@contexts/greetings/infrastructure/ui/routes/greetingRoutes.tsx`

```typescript
/**
 * Greeting Routes (Vertical Slice)
 *
 * @layer Infrastructure
 * @context Greetings
 */

import React, { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { AuthGuard } from "@shared/infrastructure/routing/guards/AuthGuard";
import { ROUTES } from "@shared/constants/routes";

// Lazy load de páginas del contexto
const GreetingsPage = lazy(() =>
  import("../pages/GreetingsPage").then((m) => ({ default: m.GreetingsPage }))
);

const GreetingDetailPage = lazy(() =>
  import("../pages/GreetingDetailPage").then((m) => ({
    default: m.GreetingDetailPage,
  }))
);

const CreateGreetingPage = lazy(() =>
  import("../pages/CreateGreetingPage").then((m) => ({
    default: m.CreateGreetingPage,
  }))
);

const EditGreetingPage = lazy(() =>
  import("../pages/EditGreetingPage").then((m) => ({
    default: m.EditGreetingPage,
  }))
);

export const greetingRoutes: RouteObject[] = [
  {
    path: "greetings",
    children: [
      // GET /greetings - Lista de greetings
      {
        index: true,
        element: <GreetingsPage />,
      },

      // GET /greetings/create - Crear greeting (protegido)
      {
        path: "create",
        element: (
          <AuthGuard>
            <CreateGreetingPage />
          </AuthGuard>
        ),
      },

      // GET /greetings/:id - Detalle de greeting
      {
        path: ":id",
        element: <GreetingDetailPage />,
      },

      // GET /greetings/:id/edit - Editar greeting (protegido)
      {
        path: ":id/edit",
        element: (
          <AuthGuard>
            <EditGreetingPage />
          </AuthGuard>
        ),
      },
    ],
  },
];
```

### Ejemplo: `src/@contexts/users/infrastructure/ui/routes/userRoutes.tsx`

```typescript
/**
 * User Routes (Vertical Slice)
 *
 * @layer Infrastructure
 * @context Users
 */

import React, { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { AuthGuard } from "@shared/infrastructure/routing/guards/AuthGuard";
import { RoleGuard } from "@shared/infrastructure/routing/guards/RoleGuard";

const UsersPage = lazy(() =>
  import("../pages/UsersPage").then((m) => ({ default: m.UsersPage }))
);

const UserProfilePage = lazy(() =>
  import("../pages/UserProfilePage").then((m) => ({
    default: m.UserProfilePage,
  }))
);

const UserSettingsPage = lazy(() =>
  import("../pages/UserSettingsPage").then((m) => ({
    default: m.UserSettingsPage,
  }))
);

export const userRoutes: RouteObject[] = [
  {
    path: "users",
    element: (
      <AuthGuard>
        <></>
      </AuthGuard>
    ),
    children: [
      // GET /users - Lista de usuarios (solo admin)
      {
        index: true,
        element: (
          <RoleGuard roles={["admin"]}>
            <UsersPage />
          </RoleGuard>
        ),
      },

      // GET /users/settings - Configuración del usuario actual
      {
        path: "settings",
        element: <UserSettingsPage />,
      },

      // GET /users/:id - Perfil de usuario
      {
        path: ":id",
        element: <UserProfilePage />,
      },
    ],
  },
];
```

---

## Guardas y Protección

### 1. `src/@shared/infrastructure/routing/guards/AuthGuard.tsx`

```typescript
/**
 * AuthGuard - Protege rutas que requieren autenticación
 *
 * @layer Shared/Infrastructure
 */

import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@contexts/auth/infrastructure/store/authStore";
import { ROUTES } from "@shared/constants/routes";

interface AuthGuardProps {
  children: ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    // Redirect to login, preserving intended destination
    return (
      <Navigate to={ROUTES.LOGIN} state={{ from: location.pathname }} replace />
    );
  }

  return <>{children}</>;
};
```

### 2. `src/@shared/infrastructure/routing/guards/RoleGuard.tsx`

```typescript
/**
 * RoleGuard - Protege rutas por roles de usuario
 *
 * @layer Shared/Infrastructure
 */

import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@contexts/auth/infrastructure/store/authStore";
import { ROUTES } from "@shared/constants/routes";

interface RoleGuardProps {
  children: ReactNode;
  roles: string[];
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ children, roles }) => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  const hasRequiredRole = roles.some((role) => user.roles.includes(role));

  if (!hasRequiredRole) {
    // Redirect to forbidden page or dashboard
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
};
```

### 3. `src/@shared/infrastructure/routing/guards/GuestGuard.tsx`

```typescript
/**
 * GuestGuard - Solo permite acceso a usuarios NO autenticados
 *
 * @layer Shared/Infrastructure
 */

import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@contexts/auth/infrastructure/store/authStore";
import { ROUTES } from "@shared/constants/routes";

export const GuestGuard: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    // Redirect to intended destination or dashboard
    const from =
      (location.state as { from?: string })?.from || ROUTES.DASHBOARD;
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
};
```

---

## Lazy Loading

### Patrón de Lazy Loading

```typescript
// ❌ INCORRECTO - Sin lazy loading
import { GreetingsPage } from "../pages/GreetingsPage";

// ✅ CORRECTO - Con lazy loading
const GreetingsPage = lazy(() =>
  import("../pages/GreetingsPage").then((m) => ({ default: m.GreetingsPage }))
);

// ✅ MEJOR - Con preload opcional
const GreetingsPage = lazy(() => {
  const promise = import("../pages/GreetingsPage");

  // Preload on hover (opcional)
  return promise.then((m) => ({ default: m.GreetingsPage }));
});
```

### Suspense Boundaries

```typescript
// En el router principal
<Suspense fallback={<LoadingFallback />}>
  <RouterProvider router={router} />
</Suspense>

// O por sección
<Suspense fallback={<Spinner />}>
  <Outlet />
</Suspense>
```

---

## Layouts

### `src/@shared/infrastructure/ui/components/Layout.tsx`

```typescript
/**
 * Layout Principal
 *
 * @layer Shared/Infrastructure
 */

import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";
import styles from "./Layout.module.css";

export const Layout: React.FC = () => {
  return (
    <div className={styles.layout}>
      <Header />

      <div className={styles.container}>
        <Sidebar />

        <main className={styles.main}>
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};
```

### Layout Anidado

```typescript
// Layout específico para Admin
export const adminRoutes: RouteObject[] = [
  {
    path: "admin",
    element: (
      <AuthGuard>
        <RoleGuard roles={["admin"]}>
          <AdminLayout />
        </RoleGuard>
      </AuthGuard>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "users", element: <AdminUsers /> },
      { path: "settings", element: <AdminSettings /> },
    ],
  },
];
```

---

## Navegación Programática

### 1. Hook `useNavigate`

```typescript
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@shared/constants/routes";

export const CreateGreetingPage: React.FC = () => {
  const navigate = useNavigate();
  const { mutate: createGreeting } = useCreateGreeting();

  const handleSubmit = (data: CreateGreetingInput) => {
    createGreeting(data, {
      onSuccess: (greeting) => {
        // Navigate to detail page
        navigate(ROUTES.GREETING_DETAIL(greeting.id));

        // Or navigate back
        // navigate(-1);

        // Or replace current entry
        // navigate(ROUTES.GREETINGS, { replace: true });
      },
    });
  };

  return <GreetingForm onSubmit={handleSubmit} />;
};
```

### 2. Navegación con Estado

```typescript
// Pasar estado entre rutas
navigate(ROUTES.GREETING_EDIT(id), {
  state: { greeting, from: "list" },
});

// Leer estado en destino
const location = useLocation();
const state = location.state as { greeting: Greeting; from: string };
```

### 3. Navegación Declarativa

```typescript
import { Link, NavLink } from 'react-router-dom';
import { ROUTES } from '@shared/constants/routes';

// Link simple
<Link to={ROUTES.GREETINGS}>Ver Greetings</Link>

// NavLink con clase activa
<NavLink
  to={ROUTES.GREETINGS}
  className={({ isActive }) => isActive ? 'active' : ''}
>
  Greetings
</NavLink>

// Link con parámetros
<Link to={ROUTES.GREETING_DETAIL(greeting.id)}>
  {greeting.message.value}
</Link>
```

---

## Manejo de Errores

### 1. `src/@shared/infrastructure/ui/components/NotFound.tsx`

```typescript
/**
 * 404 Page
 *
 * @layer Shared/Infrastructure
 */

import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@shared/constants/routes";
import styles from "./NotFound.module.css";

export const NotFound: React.FC = () => {
  return (
    <div className={styles.container} role="alert">
      <h1 className={styles.title}>404</h1>
      <h2 className={styles.subtitle}>Page Not Found</h2>
      <p className={styles.message}>
        The page you are looking for does not exist.
      </p>

      <Link to={ROUTES.DASHBOARD} className={styles.button}>
        Go to Dashboard
      </Link>
    </div>
  );
};
```

### 2. `src/@shared/infrastructure/ui/components/ErrorPage.tsx`

```typescript
/**
 * Error Page (para errores del router)
 *
 * @layer Shared/Infrastructure
 */

import React from "react";
import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import { ROUTES } from "@shared/constants/routes";
import { logger } from "@shared/infrastructure/observability/logger/Logger";
import styles from "./ErrorPage.module.css";

export const ErrorPage: React.FC = () => {
  const error = useRouteError();

  // Log error
  React.useEffect(() => {
    logger.error("Router error", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }, [error]);

  // Determine error message
  let errorMessage = "An unexpected error occurred";
  let statusCode = 500;

  if (isRouteErrorResponse(error)) {
    statusCode = error.status;
    errorMessage = error.statusText || errorMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className={styles.container} role="alert">
      <h1 className={styles.title}>{statusCode}</h1>
      <h2 className={styles.subtitle}>Oops! Something went wrong</h2>
      <p className={styles.message}>{errorMessage}</p>

      <div className={styles.actions}>
        <Link to={ROUTES.DASHBOARD} className={styles.button}>
          Go to Dashboard
        </Link>

        <button
          onClick={() => window.location.reload()}
          className={styles.buttonSecondary}
        >
          Reload Page
        </button>
      </div>
    </div>
  );
};
```

---

## Ejemplo Completo de Página

### `src/@contexts/greetings/infrastructure/ui/pages/GreetingDetailPage.tsx`

```typescript
/**
 * GreetingDetailPage
 *
 * @layer Infrastructure
 * @context Greetings
 */

import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useGetGreeting } from "../../../application/hooks/useGetGreeting";
import { GreetingCard } from "../components/GreetingCard";
import { ROUTES } from "@shared/constants/routes";
import styles from "./GreetingDetailPage.module.css";

export const GreetingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: greeting, isLoading, error } = useGetGreeting(id!);

  if (isLoading) {
    return <div role="status">Loading greeting...</div>;
  }

  if (error) {
    return (
      <div role="alert">
        <h2>Error loading greeting</h2>
        <p>{error.message}</p>
        <Link to={ROUTES.GREETINGS}>Back to list</Link>
      </div>
    );
  }

  if (!greeting) {
    return (
      <div>
        <h2>Greeting not found</h2>
        <Link to={ROUTES.GREETINGS}>Back to list</Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
        <Link to={ROUTES.DASHBOARD}>Home</Link>
        {" / "}
        <Link to={ROUTES.GREETINGS}>Greetings</Link>
        {" / "}
        <span aria-current="page">{greeting.id}</span>
      </nav>

      {/* Header */}
      <header className={styles.header}>
        <h1>Greeting Details</h1>

        <div className={styles.actions}>
          <Link
            to={ROUTES.GREETING_EDIT(greeting.id)}
            className={styles.button}
          >
            Edit
          </Link>

          <button
            onClick={() => navigate(ROUTES.GREETINGS)}
            className={styles.buttonSecondary}
          >
            Back to List
          </button>
        </div>
      </header>

      {/* Content */}
      <main className={styles.content}>
        <GreetingCard greeting={greeting} />
      </main>
    </div>
  );
};
```

---

## Mejores Prácticas

### ✅ DO

1. **Usar constantes para rutas**

   ```typescript
   navigate(ROUTES.GREETING_DETAIL(id)); // ✅
   navigate(`/greetings/${id}`); // ❌
   ```

2. **Lazy load de páginas**

   ```typescript
   const Page = lazy(() => import("./Page")); // ✅
   import { Page } from "./Page"; // ❌
   ```

3. **Proteger rutas con guardas**

   ```typescript
   <AuthGuard>
     <Page />
   </AuthGuard> // ✅
   ```

4. **Usar breadcrumbs para navegación**

   ```typescript
   <Breadcrumb
     path={[
       { label: "Home", to: ROUTES.HOME },
       { label: "Greetings", to: ROUTES.GREETINGS },
       { label: greeting.id },
     ]}
   />
   ```

5. **Manejar estados de loading y error**
   ```typescript
   if (isLoading) return <Spinner />;
   if (error) return <ErrorMessage error={error} />;
   ```

### ❌ DON'T

1. **No hardcodear rutas**
2. **No cargar todas las páginas al inicio**
3. **No duplicar lógica de protección**
4. **No olvidar manejar errores 404**
5. **No ignorar accesibilidad (aria-labels, roles)**

---

## Testing de Rutas

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { GreetingDetailPage } from "./GreetingDetailPage";

describe("GreetingDetailPage", () => {
  it("should render greeting details", async () => {
    render(
      <MemoryRouter initialEntries={["/greetings/123"]}>
        <Routes>
          <Route path="/greetings/:id" element={<GreetingDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText(/Greeting Details/i)).toBeInTheDocument();
  });

  it("should redirect to login if not authenticated", () => {
    // Test AuthGuard behavior
  });
});
```

---

## Resumen

El routing sigue estos principios:

1. **Vertical Slices**: Cada contexto define sus rutas
2. **Type-Safe**: Constantes tipadas para rutas
3. **Protected**: Guardas declarativas (Auth, Role)
4. **Optimized**: Lazy loading + code splitting
5. **Accessible**: ARIA labels, keyboard navigation
6. **Error Handling**: 404, Error boundaries
7. **Testable**: Fácil de testear con MemoryRouter

Este enfoque mantiene consistencia con la arquitectura hexagonal del backend.
