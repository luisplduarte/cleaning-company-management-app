# Cleaning Company Management App

A web application for managing cleaning company operations, including workforce management, client relationships, and job scheduling.

## Project Structure

```
/
├── app/                          # Next.js App Router pages and API routes
│   ├── api/                     # API endpoints
│   ├── auth/                    # Authentication feature
│   │   ├── components/         # Auth-specific components
│   │   ├── hooks/             # Auth-specific hooks
│   │   └── utils/             # Auth-specific utilities
│   └── (authenticated)/         # Protected routes
│       ├── calendar/           # Calendar feature
│       ├── clients/            # Clients feature
│       ├── jobs/              # Jobs feature
│       ├── rates/             # Rates feature
│       ├── workers/           # Workers feature
│       ├── client-payments/   # Client payments feature
│       └── worker-payments/   # Worker payments feature
│
├── components/                   # Shared components
│   └── ui/                     # UI component library
│       ├── elements/          # Atomic components (Button, Input, etc.)
│       ├── molecules/         # Composite components (FormField, etc.)
│       ├── organisms/         # Complex components (Dialog, etc.)
│       └── layout/           # Layout components
│
├── lib/                         # Core utilities and backend logic
│   ├── prisma.ts             # Prisma client setup
│   ├── supabase.ts           # Supabase client setup
│   └── validations/          # Core validation utilities
│
├── styles/                      # Global styles
├── public/                      # Static assets
└── types/                       # Global TypeScript types

## Feature-based Organization

Each feature directory (e.g., app/(authenticated)/clients/) follows this structure:
```
feature/
├── components/     # Feature-specific components
├── hooks/          # Feature-specific hooks
├── utils/          # Feature-specific utilities
├── types.ts        # Feature-specific types
└── page.tsx        # Feature page
```

## Development

### Prerequisites
- Node.js v18+
- pnpm
- PostgreSQL (via Supabase)

### Getting Started
1. Clone the repository
2. Copy .env.example to .env.local and fill in the values
3. Install dependencies: `pnpm install`
4. Start the development server: `pnpm dev`

## Key Technologies
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Prisma
- Supabase
- NextAuth.js
