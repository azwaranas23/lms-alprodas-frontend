import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/topic/:id", "routes/topic.$id.tsx"),
  route("/course/:id", "routes/course.$id.tsx"),
  route("/courses", "routes/courses.tsx"),
  route("/checkout/:id", "routes/checkout.$id.tsx"),
  route("/enrollment-success/:id", "routes/enrollment-success.$id.tsx"),
  route("/payment-success/:id", "routes/payment-success.$id.tsx"),
  route("/overview", "routes/overview.tsx"),
  route("/login", "routes/login.tsx"),
  route("/signup", "routes/signup.tsx"),
  route("/verify-email", "routes/verify-email.tsx"),
  route("/dashboard/topics", "routes/dashboard/topics.tsx"),
  route("/dashboard/topics/add", "routes/dashboard/topics/add.tsx"),
  route("/dashboard/topics/edit/:id", "routes/dashboard/topics/edit.$id.tsx"),
  route("/dashboard/subjects", "routes/dashboard/subjects.tsx"),
  route("/dashboard/subjects/add", "routes/dashboard/subjects/add.tsx"),
  route(
    "/dashboard/subjects/edit/:id",
    "routes/dashboard/subjects/edit.$id.tsx"
  ),
  route("/transactions", "routes/transactions.tsx"),
  route("/transactions/:id", "routes/transactions.$id.tsx"),
  route("/dashboard/mentor/courses", "routes/dashboard/mentor/courses.tsx"),
  route(
    "/dashboard/mentor/courses/add",
    "routes/dashboard/mentor/courses/add.tsx"
  ),
  route(
    "/dashboard/mentor/courses/success",
    "routes/dashboard/mentor/courses/success.tsx"
  ),
  route(
    "/dashboard/mentor/courses/:id",
    "routes/dashboard/mentor/courses/$id.tsx"
  ),
  route(
    "/dashboard/mentor/courses/:id/edit",
    "routes/dashboard/mentor/courses/$id.edit.tsx"
  ),
  route(
    "/dashboard/mentor/courses/:id/lessons",
    "routes/dashboard/mentor/courses/$id/lessons.tsx"
  ),
  route(
    "/dashboard/mentor/courses/:id/sections/:sectionId/lessons",
    "routes/dashboard/mentor/courses/$id/sections/$sectionId/lessons.tsx"
  ),
  route(
    "/dashboard/mentor/courses/:id/sections/:sectionId/lessons/add",
    "routes/dashboard/mentor/courses/$id/sections/$sectionId/lessons/add.tsx"
  ),
  route(
    "/dashboard/mentor/courses/:id/sections/:sectionId/lessons/:lessonId/edit",
    "routes/dashboard/mentor/courses/$id/sections/$sectionId/lessons/$lessonId/edit.tsx"
  ),
  route(
    "/dashboard/mentor/courses/:id/lessons/:lessonId",
    "routes/dashboard/mentor/courses/$id/lessons/$lessonId.tsx"
  ),
  route(
    "/dashboard/mentor/courses/:id/lessons/:lessonId/edit",
    "routes/dashboard/mentor/courses/$id/lessons/$lessonId/edit.tsx"
  ),
  route("/dashboard/mentor/dashboard", "routes/dashboard/mentor/dashboard.tsx"),
  route(
    "/dashboard/mentor/transactions",
    "routes/dashboard/mentor/transactions.tsx"
  ),
  route(
    "/dashboard/mentor/transactions/:id",
    "routes/dashboard/mentor/transactions.$id.tsx"
  ),
  route(
    "/dashboard/mentor/withdrawals",
    "routes/dashboard/mentor/withdrawals/withdrawals.tsx"
  ),
  route(
    "/dashboard/mentor/withdrawals/:id",
    "routes/dashboard/mentor/withdrawals/withdrawals.$id.tsx"
  ),
  route(
    "/dashboard/mentor/withdrawals/request",
    "routes/dashboard/mentor/withdrawals/withdrawals.request.tsx"
  ),
  route(
    "/dashboard/mentor/withdrawals/success",
    "routes/dashboard/mentor/withdrawals/withdrawals.success.tsx"
  ),
  // Dashboard routes
  route("/dashboard/overview", "routes/dashboard/overview.tsx"),
  route("/dashboard/mentors", "routes/dashboard/mentors.tsx"),
  route("/dashboard/students", "routes/dashboard/students.tsx"),
  route("/dashboard/transactions", "routes/dashboard/transactions.tsx"),
  route("/dashboard/transactions/:id", "routes/dashboard/transactions.$id.tsx"),
  route("/dashboard/withdrawals", "routes/dashboard/withdrawals.tsx"),
  route("/dashboard/withdrawals/:id", "routes/dashboard/withdrawals.$id.tsx"),
  route("/dashboard/mentor/overview", "routes/dashboard/mentor/overview.tsx"),
  route(
    "/dashboard/student/my-courses",
    "routes/dashboard/student/my-courses.tsx"
  ),
  route(
    "/dashboard/student/course-video",
    "routes/dashboard/student/course-video.tsx"
  ),
  route(
    "/dashboard/student/course-article",
    "routes/dashboard/student/course-article.tsx"
  ),
  route(
    "/dashboard/student/transactions",
    "routes/dashboard/student/transactions.tsx"
  ),
  route(
    "/dashboard/student/transactions/:id",
    "routes/dashboard/student/transactions.$id.tsx"
  ),
  route(
    "/student/:courseId/progress",
    "routes/student/course-progress.$courseId.tsx"
  ),
  route("/student/course-completed", "routes/student/course-completed.tsx"),
] satisfies RouteConfig;
