// app/routes/enrollment-success.$id.tsx
import type { Route } from "./+types/enrollment-success.$id";
import { useEffect } from "react";
import { useParams, useLocation } from "react-router";
import { CheckCircle, BookOpen, LayoutDashboard } from "lucide-react";
import confetti from "canvas-confetti";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Enrollment Successful - Alprodas LMS" },
    {
      name: "description",
      content: "You have successfully enrolled in your course on Alprodas LMS.",
    },
  ];
}

interface LocationState {
  courseTitle?: string;
}

export default function EnrollmentSuccessPage() {
  const { id } = useParams();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const courseTitle = state?.courseTitle ?? "your course";

  useEffect(() => {
    const timer = setTimeout(() => {
      // Confetti burst
      confetti({
        particleCount: 120,
        spread: 80,
        startVelocity: 35,
        origin: { y: 0.6 },
      });

      // Slight secondary burst
      setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 70,
          startVelocity: 25,
          origin: { x: 0.1, y: 0.6 },
        });
        confetti({
          particleCount: 80,
          spread: 70,
          startVelocity: 25,
          origin: { x: 0.9, y: 0.6 },
        });
      }, 400);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-6 py-12 text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto relative flex items-center justify-center">
            <div className="w-32 h-32 absolute bg-gradient-to-br from-primary-100 to-primary-200 rounded-full" />
            <div className="w-24 h-24 absolute bg-gradient-to-br from-primary-500 to-primary-600 rounded-full opacity-90" />
            <CheckCircle className="w-16 h-16 text-white relative z-10" />
          </div>
        </div>

        {/* Title & Description */}
        <div className="mb-12">
          <h1 className="text-brand-dark text-4xl font-extrabold mb-4">
            Enrollment Successful
          </h1>
          <p className="text-brand-light text-base font-normal max-w-xl mx-auto">
            You have successfully enrolled in{" "}
            <span className="font-semibold text-brand-dark">{courseTitle}</span>
            . You can now start your learning journey or go back to browse more
            courses.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* Go to Course Progress */}
          <a
            href={id ? `/student/${id}/progress` : "/dashboard"}
            className="btn-primary rounded-[12px] border border-[#2151A0] hover:brightness-110 focus:ring-2 focus:ring-[#0C51D9] transition-all duration-300 blue-gradient blue-btn-shadow px-8 py-4 flex items-center justify-center gap-3"
          >
            <BookOpen className="w-5 h-5 text-white" />
            <span className="text-brand-white text-base font-semibold">
              Start Learning
            </span>
          </a>

          {/* Back to Courses list */}
          <a
            href="/courses"
            className="border border-[#DCDEDD] rounded-[12px] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 px-8 py-4 flex items-center justify-center gap-3"
          >
            <LayoutDashboard className="w-5 h-5 text-gray-600" />
            <span className="text-brand-dark text-base font-semibold">
              Browse More Courses
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
