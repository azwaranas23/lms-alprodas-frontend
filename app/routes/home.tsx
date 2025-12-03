import type { Route } from "./+types/home";
import { Navbar } from "~/components/organisms/Navbar";
import { HeroSection } from "~/components/pages/home/HeroSection";
import { TopicsSection } from "~/components/pages/home/TopicsSection";
import { CoursesSection } from "~/components/pages/home/CoursesSection";
import { TestimonialsSection } from "~/components/pages/home/TestimonialsSection";
import { Footer } from "~/components/pages/home/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "HackGrowth - Learn From the Best, Grow Your Skills" },
    {
      name: "description",
      content:
        "Join thousands of students learning from industry experts. Grow your skills and build your career with HackGrowth.",
    },
  ];
}

export default function Home() {
  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLElement>,
    href: string
  ) => {
    e.preventDefault();
    if (href.startsWith("#")) {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <Navbar />
      <HeroSection onSmoothScroll={handleSmoothScroll} />
      <TopicsSection />
      <CoursesSection />
      <TestimonialsSection onSmoothScroll={handleSmoothScroll} />
      <Footer />
    </div>
  );
}
