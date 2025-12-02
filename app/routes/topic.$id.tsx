import type { Route } from "./+types/topic.$id";
import { Navbar } from "~/components/organisms/Navbar";
import { TopicHeroSection } from "~/features/topics/components/TopicHeroSection";
import { TopicContentSection } from "~/features/topics/components/TopicContentSection";
import { Footer } from "~/components/pages/home/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Web Development - LMS Alprodas" },
    {
      name: "description",
      content:
        "Master modern web technologies and frameworks. Build responsive websites and dynamic web applications from frontend to backend.",
    },
  ];
}

export default function Topic({ params }: Route.ComponentProps) {
  const topicId = parseInt(params.id);

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <Navbar />
      <TopicHeroSection />
      <TopicContentSection topicId={topicId} />
      <Footer />
    </div>
  );
}
