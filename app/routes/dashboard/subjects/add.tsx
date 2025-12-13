import { SubjectForm } from "~/features/subjects/components/SubjectForm";
import { Layout } from "~/components/templates/Layout";
import { PermissionRoute } from "~/features/auth/components/PermissionRoute";

export function meta() {
  return [
    { title: "Add Subject - Alprodas LMS" },
    {
      name: "description",
      content: "Create a new learning subject for the platform",
    },
  ];
}

export default function AddSubject() {
  const backButton = {
    to: "/dashboard/subjects",
    label: "Back",
  };

  return (
    <PermissionRoute requiredPermission="subjects.create">
      <Layout
        title="Add New Subject"
        subtitle="Create a new learning subject for the platform"
        backButton={backButton}
      >
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="main-content flex-1 overflow-auto p-5">
            <SubjectForm mode="add" />
          </main>
        </div>
      </Layout>
    </PermissionRoute>
  );
}
