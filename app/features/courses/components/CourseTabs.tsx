import { useState } from "react";
import { useSearchParams } from "react-router"; // <-- TAMBAHAN
import { Info, BookOpen, Folder, Award, MessageCircle } from "lucide-react";

import type { Course } from "~/types/courses";
import { Tab } from "~/components/atoms/Tab";

import { CourseAboutTab } from "./CourseAboutTab";
import { CourseLessonsTab } from "./CourseLessonsTab";
import { CourseResourcesStudentTab } from "./CourseResourcesStudentTab";
import { CourseBenefitsTab } from "./CourseBenefitsTab";
import { CourseTestimonialsTab } from "./CourseTestimonialsTab";

type TabKey = "about" | "lessons" | "resources" | "benefits" | "testimonials";

interface CourseTabsProps {
  course: Course;
  courseId: number;
}

export function CourseTabs({ course, courseId }: CourseTabsProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Baca tab dari query ?tab=...
  const urlTab = searchParams.get("tab");
  const allowedTabs: TabKey[] = [
    "about",
    "lessons",
    "resources",
    "benefits",
    "testimonials",
  ];

  const initialTab: TabKey = allowedTabs.includes(urlTab as TabKey)
    ? (urlTab as TabKey)
    : "about";

  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);

  const handleTabClick = (tab: TabKey) => {
    setActiveTab(tab);

    // Copy dari searchParams sekarang
    const sp = new URLSearchParams(searchParams);

    if (tab === "about") {
      // about = default, boleh dihapus
      sp.delete("tab");
    } else {
      sp.set("tab", tab);
    }

    // UPDATE: jangan reset scroll ketika query berubah
    setSearchParams(sp, { preventScrollReset: true });
  };
  return (
    <>
      {/* Tabs Navigation */}
      <div className="bg-white border border-[#DCDEDD] rounded-[20px] mb-6 p-6">
        <div className="flex flex-wrap gap-2">
          <Tab
            isActive={activeTab === "about"}
            onClick={() => handleTabClick("about")}
          >
            <Info className="w-4 h-4" />
            <span>About</span>
          </Tab>

          <Tab
            isActive={activeTab === "lessons"}
            onClick={() => handleTabClick("lessons")}
          >
            <BookOpen className="w-4 h-4" />
            <span>Lessons</span>
          </Tab>

          <Tab
            isActive={activeTab === "resources"}
            onClick={() => handleTabClick("resources")}
          >
            <Folder className="w-4 h-4" />
            <span>Course Resources</span>
          </Tab>

          <Tab
            isActive={activeTab === "benefits"}
            onClick={() => handleTabClick("benefits")}
          >
            <Award className="w-4 h-4" />
            <span>Benefits</span>
          </Tab>

          <Tab
            isActive={activeTab === "testimonials"}
            onClick={() => handleTabClick("testimonials")}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Testimonials</span>
          </Tab>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "about" && <CourseAboutTab course={course} />}

        {activeTab === "lessons" && <CourseLessonsTab course={course} />}

        {activeTab === "resources" && (
          <CourseResourcesStudentTab courseId={courseId} />
        )}

        {activeTab === "benefits" && <CourseBenefitsTab />}

        {activeTab === "testimonials" && (
          <CourseTestimonialsTab course={course} />
        )}
      </div>
    </>
  );
}
