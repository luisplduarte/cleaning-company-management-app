# Technical Context

## Technology Stack

### Frontend
- **Next.js 14+**
  - App Router
  - Server Components
  - Server Actions
  - API Routes
- **React 18+**
  - Hooks
  - Context API
  - Suspense
- **TypeScript 5+**
  - Strict mode
  - Type safety
- **Tailwind CSS**
  - Custom theme
  - Component styling
  - Responsive design

### Backend
- **Node.js**
  - Runtime environment
  - API handling
- **Supabase**
  - PostgreSQL database
  - Authentication
  - Row Level Security
- **Prisma**
  - ORM
  - Type-safe queries
  - Schema management

### Development Tools
- **ESLint**
  - Code quality
  - Style consistency
- **Prettier**
  - Code formatting
- **Jest**
  - Unit testing
  - Integration testing
- **Playwright**
  - E2E testing

## Development Setup

### Required Tools
- Node.js v18+
- pnpm (package manager)
- Git
- VSCode (recommended)

### Environment Configuration
```env
# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret

# Database
DATABASE_URL=your-connection-string
```

## Dependencies

### Core Dependencies
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "@prisma/client": "^5.0.0",
    "@supabase/supabase-js": "^2.0.0",
    "next-auth": "^4.0.0",
    "@tanstack/react-query": "^5.0.0",
    "tailwindcss": "^3.0.0",
    "zod": "^3.0.0",
    "react-hook-form": "^7.0.0",
    "date-fns": "^2.0.0"
  }
}
```

### Development Dependencies
```json
{
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0",
    "prisma": "^5.0.0",
    "jest": "^29.0.0",
    "@testing-library/react": "^14.0.0",
    "@playwright/test": "^1.0.0"
  }
}
```

## Technical Constraints

### Performance
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- First Input Delay < 100ms

### Security
- All routes must be authenticated
- Role-based access control
- Input validation
- SQL injection prevention
- XSS protection

### Accessibility
- WCAG 2.1 Level AA
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support

### Browser Support
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers

## Deployment

### Vercel Configuration
```json
{
  "framework": "nextjs",
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "outputDirectory": ".next"
}
```

### CI/CD Pipeline
1. Push to GitHub
2. Run tests
3. Build application
4. Deploy to Vercel
5. Run E2E tests

## Monitoring
- Vercel Analytics
- Error tracking
- Performance monitoring
- User analytics
