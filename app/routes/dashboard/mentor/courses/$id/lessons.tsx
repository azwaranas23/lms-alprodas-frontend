import { CourseLessonsPage } from "~/features/courses/components/CourseLessonsPage";

export function meta() {
  return [
    { title: "Course Lessons - LMS Alprodas" },
    { name: "description", content: "Manage course lessons and content" },
  ];
}

export default function MentorCourseLessons() {
  return <CourseLessonsPage userRole="mentor" />;
}
