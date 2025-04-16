# System Patterns

## Architecture Overview

```mermaid
flowchart TD
    subgraph Frontend
        Pages --> Components
        Components --> Hooks
        Pages --> Auth
        Components --> Auth
    end
    
    subgraph Backend
        API[API Routes] --> Controllers
        Controllers --> Services
        Services --> Database
    end
    
    Auth --> API
    Pages --> API
    Components --> API
```

## Directory Structure
```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── (auth)/           # Authentication routes
│   ├── dashboard/        # Dashboard pages
│   └── layout.tsx        # Root layout
├── components/            # React components
│   ├── auth/             # Auth components
│   ├── dashboard/        # Dashboard components
│   ├── forms/            # Form components
│   └── ui/               # UI components
├── lib/                   # Utility functions
│   ├── prisma/           # Prisma client & configs
│   └── supabase/         # Supabase client & configs
├── hooks/                # Custom React hooks
├── types/                # TypeScript types
└── styles/               # Global styles
```

## Key Patterns

### Authentication Flow
```mermaid
sequenceDiagram
    actor User
    participant Auth UI
    participant Next Auth
    participant Supabase
    
    User->>Auth UI: Login Attempt
    Auth UI->>Next Auth: Credentials
    Next Auth->>Supabase: Verify
    Supabase-->>Next Auth: Token
    Next Auth-->>Auth UI: Session
    Auth UI-->>User: Redirect to Dashboard
```

### Data Flow
```mermaid
flowchart LR
    subgraph Client
        UI[User Interface]
        SWR[Data Fetching]
    end
    
    subgraph Server
        API[API Routes]
        Services[Business Logic]
        Prisma[Prisma Client]
    end
    
    UI <--> SWR
    SWR <--> API
    API <--> Services
    Services <--> Prisma
    Prisma <--> DB[(Supabase DB)]
```

## Implementation Patterns

### API Routes
- REST-style endpoints
- Route handlers in app/api directory
- Middleware for authentication
- Error handling middleware

### Authentication
- Next-Auth with Supabase adapter
- JWT token strategy
- Role-based access control
- Protected API routes and pages

### Database Access
- Prisma as ORM
- Repository pattern for data access
- Transaction support for complex operations
- Connection pooling

### Frontend State Management
- Server components for static data
- SWR for client-side data fetching
- Form state with react-hook-form
- Zustand for complex UI state

### Error Handling
- Global error boundary
- Typed API responses
- Consistent error format
- User-friendly error messages

### Testing Strategy
- Jest for unit tests
- React Testing Library for components
- Integration tests for API routes
- E2E tests with Playwright
