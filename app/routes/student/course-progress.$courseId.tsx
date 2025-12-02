import type { Route } from "./+types/course-progress.$courseId";
import CoursePlayingVideo from "~/features/students/components/CoursePlayingVideo";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Course Progress - LMS Alprodas" },
    {
      name: "description",
      content: "Continue your course journey and track your learning progress",
    },
  ];
}

export default function CourseProgress() {
  return <CoursePlayingVideo />;
}
