# Architecture Documentation

## 📁 Folder Structure

### Updated Structure (Following Atomic Design + Feature-Based Architecture)

```
app/
├── components/              # UI Components (Atomic Design)
│   ├── atoms/              # Basic building blocks
│   ├── molecules/          # Simple components
│   ├── organisms/          # Complex components
│   ├── templates/          # Page layouts
│   └── pages/              # Page-level components
├── features/               # Feature-based modules
│   ├── auth/
│   ├── courses/
│   ├── lessons/
│   ├── users/
│   ├── transactions/
│   └── withdrawals/
├── hooks/                  # Custom hooks
│   ├── queries/            # TanStack Query hooks
│   ├── mutations/          # TanStack Mutation hooks
│   └── api/                # Legacy API hooks (to be migrated)
├── services/               # API services
├── types/                  # TypeScript definitions
├── utils/                  # Utility functions
├── constants/              # App constants
├── schemas/                # Zod validation schemas
└── routes/                 # Route components (thin wrappers)
```

## 🏗️ Atomic Design Implementation

### Atoms
- Basic UI elements (Button, Input, Logo)
- No business logic
- Highly reusable

### Molecules
- Combination of atoms
- Simple functionality
- Examples: SearchBox, FormField

### Organisms
- Complex components with business logic
- Examples: Header, CourseCard, UserProfile

### Templates
- Page layouts without content
- Defines structure and spacing

### Pages
- Complete page components
- Combines templates with organisms
- Used by route components

## 🔗 TanStack Query Structure

### Queries (`hooks/queries/`)
- Read operations
- Data fetching hooks
- Query key management
- Example: `useCourseQueries.ts`

### Mutations (`hooks/mutations/`)
- Write operations (Create, Update, Delete)
- Optimistic updates
- Cache invalidation
- Example: `useCourseMutations.ts`

### Query Keys
- Centralized in query files
- Hierarchical structure
- Example:
```typescript
export const courseKeys = {
  all: ['courses'] as const,
  lists: () => [...courseKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...courseKeys.lists(), { filters }] as const,
  details: () => [...courseKeys.all, 'detail'] as const,
  detail: (id: number) => [...courseKeys.details(), id] as const,
}
```

## 🎯 Feature-Based Architecture

### Feature Structure
```
features/courses/
├── components/             # Feature-specific components
├── hooks/                  # Feature-specific hooks
├── types/                  # Feature-specific types
├── utils/                  # Feature-specific utilities
├── constants/              # Feature-specific constants
└── index.ts               # Feature exports
```

### Benefits
- **Encapsulation**: Related code stays together
- **Scalability**: Easy to add new features
- **Maintenance**: Easier to find and modify code
- **Testing**: Easier to test individual features
- **Team Collaboration**: Different teams can work on different features

## 📝 Usage Examples

### Using Query Hooks
```typescript
// Old way (scattered)
import { useQuery } from '@tanstack/react-query';
import { coursesService } from '~/services/courses.service';

// New way (organized)
import { useCourses, courseKeys } from '~/hooks/queries/useCourseQueries';
```

### Using Mutation Hooks
```typescript
// Old way
import { useMutation, useQueryClient } from '@tanstack/react-query';

// New way
import { useCreateCourse } from '~/hooks/mutations/useCourseMutations';
```

### Using Feature Modules
```typescript
// Export everything related to courses
import {
  CourseCard,
  CourseForm,
  useCourseQueries,
  COURSE_STATUS
} from '~/features/courses';
```

### Using Page Components
```typescript
// Route component (thin wrapper)
export default function Login() {
  return <LoginPage />;
}

// Page component (full UI logic)
export function LoginPage() {
  return (
    <GuestRoute>
      {/* Full page implementation */}
    </GuestRoute>
  );
}
```

## 🔄 Migration Plan

### Phase 1: ✅ Completed
- [x] Create query/mutation structure
- [x] Create feature directories
- [x] Create pages directory
- [x] Example implementations

### Phase 2: 🔄 In Progress
- [ ] Migrate all API hooks to new structure
- [ ] Move components to appropriate atomic levels
- [ ] Create feature modules for all domains

### Phase 3: 📋 Planned
- [ ] Update all imports across the app
- [ ] Remove old API hooks
- [ ] Add comprehensive documentation
- [ ] Add unit tests for new structure

## 📚 Best Practices

### Query Hooks
1. Always use proper query keys
2. Handle loading and error states
3. Use enabled flag for conditional queries
4. Implement proper stale time and cache time

### Mutation Hooks
1. Always invalidate relevant queries
2. Handle optimistic updates where appropriate
3. Provide proper error handling
4. Use proper success callbacks

### Component Organization
1. Keep components small and focused
2. Use proper prop types
3. Extract reusable logic to custom hooks
4. Follow atomic design principles

### Feature Modules
1. Keep features independent
2. Expose only necessary APIs through index.ts
3. Use feature-specific types and constants
4. Document feature APIs