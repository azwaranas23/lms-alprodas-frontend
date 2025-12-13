# Product Specification: LMS Alprodas Frontend

## 1. Overview

LMS Alprodas Frontend adalah Single Page Application (SPA) yang dibangun dengan React Router untuk menyediakan antarmuka pembelajaran online yang modern dan user-friendly. Aplikasi ini mendukung tiga role pengguna: Admin, Mentor, dan Student.

---

## 2. User Roles & Capabilities

### 2.1 Admin
**Dashboard**: `/dashboard`

**Capabilities**:
- Manage topics dan subjects
- View all mentors dan students
- View all transactions
- Manage withdrawal requests
- System overview & analytics

**Key Pages**:
- `/dashboard/topics` - Topic management
- `/dashboard/subjects` - Subject management
- `/dashboard/mentors` - Mentor list
- `/dashboard/students` - Student list
- `/dashboard/transactions` - Transaction history
- `/dashboard/withdrawals` - Withdrawal requests

---

### 2.2 Mentor
**Dashboard**: `/dashboard/mentor`

**Capabilities**:
- Create & manage courses
- Add sections & lessons
- Upload course resources
- View enrolled students
- Track course performance
- Request withdrawals

**Key Pages**:
- `/dashboard/mentor/dashboard` - Mentor analytics
- `/dashboard/mentor/courses` - Course management
- `/dashboard/mentor/courses/add` - Create new course
- `/dashboard/mentor/courses/:id` - Course detail
- `/dashboard/mentor/courses/:id/edit` - Edit course
- `/dashboard/mentor/courses/:id/lessons` - Lesson management
- `/dashboard/mentor/students` - Student list

---

### 2.3 Student
**Dashboard**: `/dashboard/student`

**Capabilities**:
- Browse & search courses
- Enroll via course token
- Watch video lessons
- Read article lessons
- Track learning progress
- Get certificates
- View transaction history

**Key Pages**:
- `/` - Homepage (course browsing)
- `/courses` - All courses
- `/topic/:id` - Courses by topic
- `/course/:id` - Course detail
- `/checkout/:id` - Enrollment page
- `/dashboard/student/my-courses` - My enrolled courses
- `/student/:courseId/progress` - Course learning interface

---

## 3. Core Features

### 3.1 Authentication & Registration

**Pages**:
- `/login` - Login page
- `/signup` - Registration page
- `/verify-email` - Email verification page

**Features**:
- Email & password authentication
- User registration dengan avatar upload
- Email verification workflow
- Auto-redirect after login based on role
- Persistent session (localStorage)

**User Flow**:
```
Signup → Email Verification → Login → Role-based Dashboard
```

---

### 3.2 Public Pages

#### Homepage (`/`)
**Purpose**: Landing page dengan course showcase

**Features**:
- Hero section
- Featured topics
- Popular courses
- Course search & filter

#### Topics Page (`/topic/:id`)
**Features**:
- Topic header dengan description
- Subject list dalam topic
- Course list per topic
- Filter & sorting

#### Course Detail (`/course/:id`)
**Features**:
- Course overview
- Course images gallery
- Key points display
- Course personas
- Curriculum (sections & lessons)
- Mentor info
- Enrollment button

#### Courses Page (`/courses`)
**Features**:
- Course grid/list view
- Advanced filters:
  - Topic filter
  - Subject filter
  - Search by title
- Pagination
- Sort options

---

### 3.3 Course Enrollment

**Page**: `/checkout/:id`

**Features**:
- Course summary
- Token input field
- Enrollment confirmation
- Redirect to my courses or payment success

**Flow**:
```
Course Detail → Checkout → Input Token → Success → My Courses
```

**Success Pages**:
- `/enrollment-success/:id` - Free enrollment
- `/payment-success/:id` - Paid enrollment (future)

---

### 3.4 Student Learning Experience

#### My Courses (`/dashboard/student/my-courses`)
**Features**:
- Enrolled courses grid
- Progress percentage per course
- Continue learning button
- Course status badges

#### Course Progress (`/student/:courseId/progress`)
**Features**:
- Section & lesson navigation
- Video player untuk video lessons
- Article reader untuk article lessons
- Progress tracking
- Mark complete functionality
- Next/Previous lesson navigation
- Completion certificate trigger

#### Video Lesson (`/dashboard/student/course-video`)
**Features**:
- Embedded video player
- Lesson title & description
- Resource downloads
- Mark complete button

#### Article Lesson (`/dashboard/student/course-article`)
**Features**:
- Rich text article content
- Formatted text display
- Resource downloads
- Mark complete button

#### Course Completion (`/student/course-completed`)
**Features**:
- Congratulations screen
- Certificate display
- Certificate download
- Share certificate (social)
- Confetti animation

---

### 3.5 Mentor Course Management

#### Courses List (`/dashboard/mentor/courses`)
**Features**:
- Course grid/table
- Course status badges (Draft/Published/Archived)
- Quick actions (Edit, View, Delete)
- Create new course button
- Search & filter

#### Create Course (`/dashboard/mentor/courses/add`)
**Wizard Steps**:
1. Basic Info (title, subject, description)
2. Course Images (upload up to 4 images)
3. Key Points (add learning highlights)
4. Personas (target audience)
5. Tools & About
6. Review & Submit

**Features**:
- Multi-step form wizard
- Image upload dengan preview
- Dynamic field addition (key points, personas)
- Draft save functionality

#### Edit Course (`/dashboard/mentor/courses/:id/edit`)
**Features**:
- Update course metadata
- Change images
- Edit key points
- Update personas
- Publish/archive course

#### Lessons Management (`/dashboard/mentor/courses/:id/lessons`)
**Features**:
- Section list dengan lessons
- Add section button
- Add lesson per section
- Drag & drop reordering
- Lesson status toggle
- Delete confirmation

#### Add Lesson (`/dashboard/mentor/courses/:id/sections/:sectionId/lessons/add`)
**Form Fields**:
- Lesson title
- Content type (Video/Article)
- If Video: Content URL
- If Article: Rich text editor
- Duration (minutes)
- Order index

#### Edit Lesson (`/dashboard/mentor/courses/:id/sections/:sectionId/lessons/:lessonId/edit`)
**Features**:
- Update lesson info
- Change content type
- Update content
- Change order

#### Students List (`/dashboard/mentor/students`)
**Features**:
- Student table
- Filter by course
- Student progress overview
- Contact info

---

### 3.6 Admin Dashboard

#### Overview (`/dashboard/overview`)
**Metrics**:
- Total users (Admin/Mentor/Student)
- Total courses
- Total enrollments
- Revenue statistics

**Charts**:
- User growth over time
- Course enrollment trends
- Revenue graph

#### Topics Management (`/dashboard/topics`)
**Features**:
- Topic list table
- Add topic (`/dashboard/topics/add`)
- Edit topic (`/dashboard/topics/edit/:id`)
- Delete topic
- Image upload

#### Subjects Management (`/dashboard/subjects`)
**Features**:
- Subject list table
- Filter by topic
- Add subject (`/dashboard/subjects/add`)
- Edit subject (`/dashboard/subjects/edit/:id`)
- Delete subject
- Image upload

#### Mentors List (`/dashboard/mentors`)
**Features**:
- Mentor table
- Mentor statistics (courses, students)
- Filter & search
- View mentor profile

#### Students List (`/dashboard/students`)
**Features**:
- Student table
- Student statistics (enrollments, progress)
- Filter & search
- View student profile

#### Transactions (`/dashboard/transactions`)
**Features**:
- Transaction history table
- Filter by date, user, status
- Transaction detail view
- Export functionality

#### Withdrawals (`/dashboard/withdrawals`)
**Features**:
- Withdrawal requests table
- Status: Pending, Approved, Rejected
- Approve/Reject actions
- Detail view

---

### 3.7 Transactions & Withdrawals

#### Student Transactions (`/dashboard/student/transactions`)
**Features**:
- Transaction history
- Payment status
- Enrollment details
- Invoice download

#### Mentor Transactions (`/dashboard/mentor/transactions`)
**Features**:
- Revenue history
- Enrollment tracking
- Course-wise revenue
- Withdrawal status

#### Mentor Withdrawals (`/dashboard/mentor/withdrawals`)
**Features**:
- Withdrawal history
- Request withdrawal (`/dashboard/mentor/withdrawals/request`)
- Withdrawal status tracking
- Success page (`/dashboard/mentor/withdrawals/success`)

---

## 4. UI/UX Components

### 4.1 Component Architecture (Atomic Design)

**Atoms** (18 components):
- Button, Input, Textarea, Select
- Badge, Avatar, Icon
- Loading spinner, Skeleton
- Card, Modal, Toast
- etc.

**Molecules** (9 components):
- FormField, SearchBar
- CourseCard, TopicCard
- ProgressBar, StatCard
- etc.

**Organisms** (12 components):
- Navbar, Sidebar, Footer
- CourseGrid, LessonList
- StudentTable, MentorTable
- etc.

**Pages** (8 components):
- LoginPage, SignupPage
- DashboardPage, CoursePage
- etc.

**Templates** (13 components):
- DashboardLayout, AuthLayout
- CourseLayout, LearningLayout
- etc.

---

### 4.2 Design System

**Colors**:
- Primary: Blue (#3B82F6)
- Secondary: Purple (#8B5CF6)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Danger: Red (#EF4444)

**Typography**:
- Font: System fonts (Tailwind default)
- Headings: Bold, larger sizes
- Body: Regular, readable sizes

**Spacing**:
- Tailwind spacing scale (4px increments)

**Breakpoints**:
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

---

## 5. State Management

### 5.1 TanStack Query

**Queries** (Read operations):
- `useCourses` - Fetch courses
- `useCourseDetail` - Fetch course detail
- `useTopics` - Fetch topics
- `useSubjects` - Fetch subjects
- `useMyEnrollments` - Fetch student enrollments
- `useLessonProgress` - Fetch lesson progress
- `useDashboardStats` - Fetch dashboard statistics

**Mutations** (Write operations):
- `useLogin` - Login user
- `useRegister` - Register user
- `useCreateCourse` - Create course
- `useUpdateCourse` - Update course
- `useEnrollCourse` - Enroll to course
- `useMarkLessonComplete` - Mark lesson complete
- `useCompleteCourse` - Complete course

### 5.2 Local State
- Authentication state (localStorage)
- UI state (modals, dropdowns)
- Form state (controlled inputs)

---

## 6. Routing

### 6.1 Route Structure

**Total Routes**: 60+ routes

**Route Groups**:
- Public: 13 routes
- Auth: 3 routes
- Student Dashboard: 6 routes
- Mentor Dashboard: 18 routes
- Admin Dashboard: 12 routes

### 6.2 Protected Routes

**Route Guards**:
- `RequireAuth` - Requires authentication
- `RequireRole` - Requires specific role
- `RequirePermission` - Requires permission

**Example**:
```
/dashboard/* → RequireAuth + RequireRole(Admin)
/dashboard/mentor/* → RequireAuth + RequireRole(Mentor)
/dashboard/student/* → RequireAuth + RequireRole(Student)
```

---

## 7. API Integration

### 7.1 API Client (Axios)

**Base URL**: `http://localhost:3000/api` (configurable)

**Interceptors**:
- Request: Add Authorization header
- Response: Handle errors globally
- Token refresh logic

### 7.2 Service Layer

**Service Files**:
- `auth.service.ts` - Authentication APIs
- `courses.service.ts` - Course APIs
- `topics.service.ts` - Topic APIs
- `subjects.service.ts` - Subject APIs
- `enrollment.service.ts` - Enrollment APIs
- `lessons.service.ts` - Lesson APIs
- `dashboard.service.ts` - Dashboard APIs
- `transactions.service.ts` - Transaction APIs
- `withdrawals.service.ts` - Withdrawal APIs

---

## 8. Features Detail

### 8.1 Search & Filter

**Course Search**:
- Search by title
- Filter by topic
- Filter by subject
- Filter by status
- Sort by: Newest, Popular, A-Z

### 8.2 Pagination

**Implementation**:
- Page-based pagination
- Items per page: 10, 25, 50
- Total count display
- Navigation controls

### 8.3 File Upload

**Upload Types**:
- Avatar upload (registration)
- Course images (mentor)
- Course resources (mentor)
- Profile image update

**Features**:
- Preview before upload
- Drag & drop support
- File size validation
- File type validation
- Progress indicator

### 8.4 Animations

**Library**: Framer Motion

**Usage**:
- Page transitions
- Modal animations
- Card hover effects
- Loading states
- Confetti on completion

### 8.5 Charts & Visualization

**Library**: Chart.js + react-chartjs-2

**Chart Types**:
- Bar chart (enrollments)
- Line chart (progress over time)
- Pie chart (user distribution)
- Doughnut chart (course status)

---

## 9. Form Validation

**Library**: Zod

**Validation Schemas**:
- Login schema
- Registration schema
- Course creation schema
- Lesson creation schema
- Profile update schema

**Features**:
- Real-time validation
- Custom error messages
- Type safety

---

## 10. Responsive Design

**Breakpoints**:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

**Responsive Features**:
- Mobile-first approach
- Hamburger menu (mobile)
- Collapsible sidebar (tablet)
- Grid layout adjustments
- Touch-friendly controls

---

## 11. Performance Optimizations

### 11.1 Code Splitting
- Route-based splitting
- Component lazy loading
- Dynamic imports

### 11.2 Caching
- TanStack Query caching
- Image caching
- API response caching

### 11.3 Build Optimization
- Vite fast HMR
- Tree shaking
- Minification
- Asset optimization

---

## 12. Accessibility

**Features**:
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus indicators
- Alt text for images
- Color contrast compliance

---

## 13. Error Handling

**Error Types**:
- Network errors
- Validation errors
- Authentication errors
- Permission errors

**User Feedback**:
- Toast notifications
- Error messages
- Retry buttons
- Fallback UI

---

## 14. Development Setup

### 14.1 Environment Variables
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 14.2 Scripts
- `pnpm dev` - Development server
- `pnpm build` - Production build
- `pnpm typecheck` - Type checking

### 14.3 Dev Tools
- React Router DevTools
- TanStack Query DevTools
- React DevTools (browser extension)

---

## 15. Future Enhancements

- [ ] Dark mode support
- [ ] Progressive Web App (PWA)
- [ ] Offline support
- [ ] Push notifications
- [ ] Real-time chat dengan mentor
- [ ] Discussion forums
- [ ] Quiz & assessments
- [ ] Gamification (badges, points)
- [ ] Social sharing
- [ ] Mobile app (React Native)

---

**Document Version**: 1.0  
**Last Updated**: 2024-12-13  
**Maintainer**: LMS Alprodas Team
