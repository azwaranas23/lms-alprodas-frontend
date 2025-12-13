import { TopicForm } from "~/features/topics/components/TopicForm";
import { Layout } from "~/components/templates/Layout";
import { PermissionRoute } from "~/features/auth/components/PermissionRoute";

export function meta() {
  return [
    { title: "Add Topic - Alprodas LMS" },
    {
      name: "description",
      content: "Create a new learning topic for the platform",
    },
  ];
}

export default function AddTopic() {
  const backButton = {
    to: "/dashboard/topics",
    label: "Back",
  };

  return (
    <PermissionRoute requiredPermission="topics.create">
      <Layout
        title="Add New Topic"
        subtitle="Create a new learning topic for the platform"
        backButton={backButton}
      >
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="main-content flex-1 overflow-auto p-5">
            <TopicForm mode="add" />
          </main>
        </div>
      </Layout>
    </PermissionRoute>
  );
}
