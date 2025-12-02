import { useEffect } from "react";
import { CheckCircle, Calendar, Users, Plus, Eye } from "lucide-react";
import { Button } from "~/components/atoms/Button";

export function meta() {
  return [
    { title: "Course Created Successfully - LMS Alprodas" },
    {
      name: "description",
      content: "Your course has been created successfully",
    },
  ];
}

export default function CourseSuccess() {
  useEffect(() => {
    const showConfetti = () => {
      // Course creation success - could trigger analytics or celebratory effects
    };

    const timer = setTimeout(showConfetti, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-6 py-12 text-center">
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto relative flex items-center justify-center">
            <div className="w-32 h-32 absolute bg-gradient-to-br from-primary-100 to-primary-200 rounded-full"></div>
            <div className="w-24 h-24 absolute bg-gradient-to-br from-primary-500 to-primary-600 rounded-full opacity-90"></div>
            <CheckCircle className="w-16 h-16 text-white relative z-10" />
          </div>
        </div>

        <div className="mb-12">
          <h1 className="text-brand-dark text-4xl font-extrabold mb-4">
            Yeay! What a Great Day
          </h1>
          <p className="text-brand-light text-base font-normal">
            Students can now discover and enroll in your course. You'll receive
            notifications when new students join and can track your course
            performance.
          </p>
        </div>

        <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6 mb-12">
          <div className="mb-6">
            <div className="w-full h-64 rounded-[12px] overflow-hidden border border-[#DCDEDD] mb-4">
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=256&fit=crop"
                alt="Course Thumbnail"
                className="w-full h-64 object-cover"
              />
            </div>
            <div className="text-center">
              <h3 className="text-brand-dark text-lg font-bold mb-2">
                Complete React Development Masterclass
              </h3>
              <p className="text-brand-light text-sm font-normal">
                Web Development • Rp 22.490.590
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-[#DCDEDD]">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-brand-light text-sm font-medium">
                Published just now
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-brand-light text-sm font-medium">
                0 students enrolled
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/courses/add"
            className="border border-[#DCDEDD] rounded-[12px] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 px-8 py-4 flex items-center justify-center gap-3"
          >
            <Plus className="w-5 h-5 text-gray-600" />
            <span className="text-brand-dark text-base font-semibold">
              Create Another Course
            </span>
          </a>
          <a href="/courses">
            <Button
              variant="primary"
              className="rounded-[12px] px-8 py-4 flex items-center justify-center gap-3"
            >
              <Eye className="w-5 h-5 text-white" />
              <span className="text-brand-white text-base font-semibold">
                View Course
              </span>
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
