import { Layout } from "~/components/templates/Layout";
import { PermissionRoute } from "~/features/auth/components/PermissionRoute";
import EditLessonForm from "~/features/courses/components/EditLessonForm";

export function meta() {
  return [
    { title: "Edit Lesson - Alprodas LMS" },
    { name: "description", content: "Edit lesson content and details" },
  ];
}

export default function EditLesson() {
  return (
    <PermissionRoute>
      <Layout>
        <EditLessonForm />
      </Layout>
    </PermissionRoute>
  );
}
