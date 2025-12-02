import { GraduationCap } from "lucide-react";

interface LogoProps {
  variant?: "navbar" | "form";
}

export function Logo({ variant = "navbar" }: LogoProps) {
  if (variant === "navbar") {
    return (
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 relative flex items-center justify-center">
          <div className="w-14 h-14 absolute bg-gradient-to-br from-primary-100 to-primary-200 rounded-full"></div>
          <div className="w-10 h-10 absolute bg-gradient-to-br from-primary-500 to-primary-600 rounded-full opacity-90"></div>
          <GraduationCap className="w-5 h-5 text-white relative z-10" />
        </div>
        <div>
          <h1 className="text-brand-dark text-lg font-bold">LMS Alprodas</h1>
          <p className="text-brand-dark text-xs font-normal">
            Learning Platform
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 mb-8">
      <div className="w-16 h-16 relative flex items-center justify-center">
        <div className="w-16 h-16 absolute bg-gradient-to-br from-primary-100 to-primary-200 rounded-full"></div>
        <div className="w-12 h-12 absolute bg-gradient-to-br from-primary-500 to-primary-600 rounded-full opacity-90"></div>
        <GraduationCap className="w-6 h-6 text-white relative z-10" />
      </div>
      <div className="text-left">
        <h2 className="text-brand-dark text-3xl font-extrabold mb-1">
          Welcome Back
        </h2>
        <p className="text-brand-light text-base font-normal leading-7">
          Access your LMS Alprodas dashboard
        </p>
      </div>
    </div>
  );
}
