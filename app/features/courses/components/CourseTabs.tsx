// app/features/courses/components/CourseTabs.tsx
import { useState } from "react";
import { Info, BookOpen, Folder, Award, MessageCircle } from "lucide-react";

import type { Course } from "~/types/courses";
import { Tab } from "~/components/atoms/Tab";

import { CourseAboutTab } from "./CourseAboutTab";
import { CourseLessonsTab } from "./CourseLessonsTab";
import { CourseResourcesStudentTab } from "./CourseResourcesStudentTab";
import { CourseBenefitsTab } from "./CourseBenefitsTab";
import { CourseTestimonialsTab } from "./CourseTestimonialsTab";

interface CourseTabsProps {
  course: Course;
  courseId: number;
}

export function CourseTabs({ course, courseId }: CourseTabsProps) {
  const [activeTab, setActiveTab] = useState<
    "about" | "lessons" | "resources" | "benefits" | "testimonials"
  >("about");

  const handleTabClick = (
    tab: "about" | "lessons" | "resources" | "benefits" | "testimonials"
  ) => {
    setActiveTab(tab);
    // PERHATIAN: tidak ada window.location.hash di sini
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
