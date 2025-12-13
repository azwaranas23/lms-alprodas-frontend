import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { TopicForm } from "~/features/topics/components/TopicForm";
import { Layout } from "~/components/templates/Layout";
import { PermissionRoute } from "~/features/auth/components/PermissionRoute";
import { topicsService } from "~/services/topics.service";
import type { Topic } from "~/types/topics";

export function meta() {
  return [
    { title: "Edit Topic - Alprodas LMS" },
    {
      name: "description",
      content: "Edit an existing learning topic",
    },
  ];
}

export default function EditTopic() {
  const { id } = useParams();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const backButton = {
    to: "/dashboard/topics",
    label: "Back",
  };

  useEffect(() => {
    const fetchTopic = async () => {
      if (!id) {
        setError("Topic ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const topicData = await topicsService.getTopicById(parseInt(id));
        setTopic(topicData);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching topic:", err);
        setError(err.response?.data?.message || "Failed to fetch topic");
      } finally {
        setLoading(false);
      }
    };

    fetchTopic();
  }, [id]);

  if (loading) {
    return (
      <PermissionRoute requiredPermission="topics.update">
        <Layout
          title="Edit Topic"
          subtitle="Update an existing learning topic"
          backButton={backButton}
        >
          <div className="flex-1 flex flex-col overflow-hidden">
            <main className="main-content flex-1 overflow-auto p-5">
              <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Loading topic...</div>
              </div>
            </main>
          </div>
        </Layout>
      </PermissionRoute>
    );
  }

  if (error || !topic) {
    return (
      <PermissionRoute requiredPermission="topics.update">
        <Layout
          title="Edit Topic"
          subtitle="Update an existing learning topic"
          backButton={backButton}
        >
          <div className="flex-1 flex flex-col overflow-hidden">
            <main className="main-content flex-1 overflow-auto p-5">
              <div className="flex items-center justify-center h-64">
                <div className="text-red-500">
                  Error: {error || "Topic not found"}
                </div>
              </div>
            </main>
          </div>
        </Layout>
      </PermissionRoute>
    );
  }

  return (
    <PermissionRoute requiredPermission="topics.update">
      <Layout
        title="Edit Topic"
        subtitle="Update an existing learning topic"
        backButton={backButton}
      >
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="main-content flex-1 overflow-auto p-5">
            <TopicForm mode="edit" initialData={topic} />
          </main>
        </div>
      </Layout>
    </PermissionRoute>
  );
}
