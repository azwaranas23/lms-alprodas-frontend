import { useEffect } from "react";
import { CheckCircle, Calendar, Users, Plus, Eye } from "lucide-react";

export function meta() {
  return [
    { title: "Course Created Successfully - Alprodas LMS" },
    {
      name: "description",
      content: "Your course has been created successfully in Alprodas LMS",
    },
  ];
}

export default function MentorCourseSuccess() {
  useEffect(() => {
    const triggerConfetti = () => {
      console.log("🎉 Course created successfully!");
      // Confetti library bisa ditambahkan di sini jika dibutuhkan
    };

    const timer = setTimeout(triggerConfetti, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-6 py-12 text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto relative flex items-center justify-center">
            <div className="w-32 h-32 absolute bg-gradient-to-br from-primary-100 to-primary-200 rounded-full"></div>
            <div className="w-24 h-24 absolute bg-gradient-to-br from-primary-500 to-primary-600 rounded-full opacity-90"></div>
            <CheckCircle className="w-16 h-16 text-white relative z-10" />
          </div>
        </div>

        {/* Title & Description */}
        <div className="mb-12">
          <h1 className="text-brand-dark text-4xl font-extrabold mb-4">
            Course Successfully Created
          </h1>
          <p className="text-brand-light text-base font-normal max-w-xl mx-auto">
            Your course has been published and is now visible to students. You
            can continue creating new courses or review your existing course
            list.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/dashboard/mentor/courses/add"
            className="border border-[#DCDEDD] rounded-[12px] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 px-8 py-4 flex items-center justify-center gap-3"
          >
            <Plus className="w-5 h-5 text-gray-600" />
            <span className="text-brand-dark text-base font-semibold">
              Create Another Course
            </span>
          </a>

          <a
            href="/dashboard/mentor/courses"
            className="btn-primary rounded-[12px] border border-[#2151A0] hover:brightness-110 focus:ring-2 focus:ring-[#0C51D9] transition-all duration-300 blue-gradient blue-btn-shadow px-8 py-4 flex items-center justify-center gap-3"
          >
            <Eye className="w-5 h-5 text-white" />
            <span className="text-brand-white text-base font-semibold">
              View My Courses
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
