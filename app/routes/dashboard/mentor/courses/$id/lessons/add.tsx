import { Layout } from "~/components/templates/Layout";
import { PermissionRoute } from "~/features/auth/components/PermissionRoute";
import AddLessonForm from "~/features/courses/components/AddLessonForm";

export function meta() {
  return [
    { title: "Add New Lesson - Alprodas LMS" },
    { name: "description", content: "Create a new lesson for your course" },
  ];
}

export default function AddLesson() {
  return (
    <PermissionRoute requiredPermission="lessons.create">
      <Layout>
        <AddLessonForm />
      </Layout>
    </PermissionRoute>
  );
}
