import { useNavigate } from "react-router";
import { Layout } from "~/components/templates/Layout";
import { TopicForm } from "~/features/topics/components/TopicForm";

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
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/topics");
  };

  const handleSubmit = async (data: FormData): Promise<void> => {
    // Topic creation will be handled by the mutation
    navigate("/topics");
  };

  return (
    <Layout
      title="Add New Topic"
      subtitle="Create a new learning topic for the platform"
      backButton={{
        onClick: handleBackClick,
        label: "Back",
      }}
    >
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="main-content flex-1 overflow-auto py-5">
          <div className="flex gap-5 pl-5 items-start">
            <div className="flex-1">
              <TopicForm mode="add" onSubmit={handleSubmit} />
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}
