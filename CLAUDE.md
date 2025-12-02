# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands
- `npm run dev` - Start development server with HMR at http://localhost:5173
- `npm run build` - Create production build (check for TypeScript errors and build warnings)
- `npm run typecheck` - Run TypeScript type checking with `react-router typegen && tsc`
- `npm start` - Start production server from built files

### Environment Setup
- Copy `.env.example` to `.env` and configure:
  - `VITE_API_URL` - Backend API base URL (default: http://localhost:3000)
  - `VITE_BASE_URL` - Frontend base URL for file uploads and assets

## Architecture Overview

### Framework Stack
- **React Router v7** with SSR enabled (file-based routing via `app/routes.ts`)
- **TypeScript** with strict mode and path aliases (`~/*` maps to `./app/*`)
- **TailwindCSS v4** for styling
- **Axios** for API communication with request/response interceptors
- **TanStack Query** for server state management
- **Zod** for form validation schemas

### Directory Structure
```
app/
├── components/          # Organized by domain/feature
│   ├── auth/           # Authentication components (PermissionRoute, etc.)
│   ├── layouts/        # Dynamic layouts (DynamicSidebar, DynamicHeader, Layout)
│   ├── features/       # Business logic components (Overview, etc.)
│   ├── ui/             # Reusable UI components
│   └── [domain]/       # Domain-specific components (topics, courses, etc.)
├── config/             # Environment configuration
├── constants/          # API endpoints and query keys
├── hooks/              # Custom React hooks
├── lib/                # Third-party library configurations (axios setup)
├── providers/          # React context providers
├── routes/             # File-based routing (configured in routes.ts)
├── services/           # API service layers
├── types/              # TypeScript definitions and Zod schemas
└── routes.ts           # Route configuration file
```

### Authentication & Authorization
- **JWT-based authentication** stored in localStorage
- **Permission-based access control** using `PermissionRoute` wrapper
- **Role-based routing** with automatic redirects:
  - Manager → `/dashboard/overview`
  - Mentor → `/dashboard/mentor/overview`
  - Student → `/dashboard/student/my-courses`
- **Automatic token injection** via Axios interceptors
- **401 handling** with automatic logout and redirect to login

### API Integration Pattern
- **Centralized API client** in `lib/axios.ts` with interceptors
- **Service layer pattern** in `services/` directory
- **Constants file** for endpoints and query keys in `constants/api.ts`
- **Environment-based configuration** via `config/env.ts`
- **TanStack Query** for caching and state management

### Routing System
- **File-based routing** configured in `app/routes.ts`
- **Nested route support** with parameter syntax (`:id` → `$id.tsx`)
- **Layout composition** using `Layout` component with dynamic sidebar/header
- **Protected routes** via `PermissionRoute` wrapper

### Form Validation
- **Zod schemas** stored in `types/` directory (e.g., `types/auth.ts`, `types/topics.ts`)
- **Consistent error styling** with red borders and `text-danger` class
- **Progressive error clearing** on user input
- **Loading states** with disabled buttons and loading text

### Component Organization
- **Domain-driven structure** (topics, courses, mentors, etc.)
- **Shared UI components** in `ui/` directory
- **Layout components** handle role-based navigation
- **Feature components** contain business logic
- **Form components** follow consistent validation patterns

### Key Patterns
- **Permission checking** before component render and in effects
- **Consistent error handling** with try/catch and user feedback
- **Loading states** for all async operations
- **Responsive design** using TailwindCSS utilities
- **File uploads** using FormData with proper Content-Type headers

### State Management
- **Authentication state** in localStorage with authService
- **Server state** via TanStack Query with proper query keys
- **Local component state** for forms and UI interactions
- **No global state management** library (using React context where needed)

## Important Notes

### API Communication
- All API calls go through the configured `apiClient` in `lib/axios.ts`
- Image uploads require `multipart/form-data` content type
- Image URLs from API use `BASE_URL + image_path` pattern
- Error responses follow consistent structure with `message` field

### Type Safety
- Zod schemas define both validation and TypeScript types
- API response types defined in `types/` directory
- Strict TypeScript configuration with path aliases

### Testing & Linting
- Run `npm run build` to check for TypeScript errors
- No dedicated test or lint commands configured
- Use TypeScript compiler for error checking

### Common Gotchas
- Environment variables must be prefixed with `VITE_` for client access
- Server-side rendering requires `typeof window !== 'undefined'` checks
- Permission routes need proper dependency arrays to avoid infinite loops
- File uploads require FormData and proper header configuration