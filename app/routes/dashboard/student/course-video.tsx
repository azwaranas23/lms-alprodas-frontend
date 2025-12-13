import type { Route } from "./+types/course-video";
import CoursePlayingVideo from "~/features/students/components/CoursePlayingVideo";
import { StudentRoute } from "~/features/auth/components/RoleBasedRoute";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Course Video - Alprodas LMS" },
    {
      name: "description",
      content: "Watch course video lessons and track your learning progress",
    },
  ];
}

export default function StudentCourseVideoPage() {
  return (
    <StudentRoute>
      <CoursePlayingVideo />
    </StudentRoute>
  );
}
