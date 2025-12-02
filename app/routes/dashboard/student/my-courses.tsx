import type { Route } from "./+types/my-courses";
import StudentMyCourses from "~/features/students/components/StudentMyCourses";
import { StudentRoute } from "~/features/auth/components/RoleBasedRoute";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "My Courses - LMS Alprodas" },
    {
      name: "description",
      content:
        "View and continue your enrolled courses and track your progress",
    },
  ];
}

export default function StudentMyCoursesPage() {
  return (
    <StudentRoute>
      <StudentMyCourses />
    </StudentRoute>
  );
}
