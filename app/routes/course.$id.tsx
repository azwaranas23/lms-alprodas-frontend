import type { Route } from "./+types/course.$id";
import { Navbar } from "~/components/organisms/Navbar";
import { CourseHeroSection } from "~/features/courses/components/CourseHeroSection";
import { CourseContentSection } from "~/features/courses/components/CourseContentSection";
import { Footer } from "~/components/pages/home/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Complete React Mastery - LMS Alprodas" },
    {
      name: "description",
      content:
        "Master React with our comprehensive course covering fundamentals, hooks, advanced patterns and real-world projects.",
    },
  ];
}

export default function CourseDetail({ params }: Route.ComponentProps) {
  const courseId = parseInt(params.id);

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <Navbar />
      <CourseHeroSection courseId={courseId} />
      <CourseContentSection courseId={courseId} />
      <Footer />
    </div>
  );
}
