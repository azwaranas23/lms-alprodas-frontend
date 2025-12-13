import { useNavigate, useParams } from "react-router";
import { Layout } from "~/components/templates/Layout";
import { TopicForm } from "~/features/topics/components/TopicForm";

export function meta() {
  return [
    { title: "Edit Topic - Alprodas LMS" },
    { name: "description", content: "Update topic information and settings" },
  ];
}

export default function EditTopic() {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleBackClick = () => {
    navigate("/topics");
  };

  const handleSubmit = async (data: FormData): Promise<void> => {
    // Topic update will be handled by the mutation
    navigate("/topics");
  };

  return (
    <Layout
      title="Edit Topic"
      subtitle="Update topic information and settings"
      backButton={{
        onClick: handleBackClick,
        label: "Back",
      }}
    >
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="main-content flex-1 overflow-auto py-5">
          <div className="flex gap-5 pl-5 items-start">
            <div className="flex-1">
              <TopicForm mode="edit" onSubmit={handleSubmit} />
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}
