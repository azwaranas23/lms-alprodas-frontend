import type { Route } from "./+types/course-article";
import CoursePlayingArticle from "~/features/students/components/CoursePlayingArticle";
import { StudentRoute } from "~/features/auth/components/RoleBasedRoute";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Course Article - Alprodas LMS" },
    {
      name: "description",
      content: "Read course articles and enhance your learning experience",
    },
  ];
}

export default function StudentCourseArticlePage() {
  return (
    <StudentRoute>
      <CoursePlayingArticle />
    </StudentRoute>
  );
}
