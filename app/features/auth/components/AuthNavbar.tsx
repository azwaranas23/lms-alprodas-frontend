import { GraduationCap, Menu } from "lucide-react";
import { Link } from "react-router";

export function AuthNavbar() {
  return (
    <nav
      className="bg-white border-b"
      style={{ borderColor: "#DCDEDD", padding: "20px" }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 relative flex items-center justify-center">
            {/* Background circle */}
            <div className="w-14 h-14 absolute bg-gradient-to-br from-primary-100 to-primary-200 rounded-full"></div>
            {/* Overlapping smaller circle */}
            <div className="w-10 h-10 absolute bg-gradient-to-br from-primary-500 to-primary-600 rounded-full opacity-90"></div>
            {/* Lucide icon */}
            <GraduationCap className="w-5 h-5 text-white relative z-10" />
          </div>
          <div>
            <h1 className="text-brand-dark text-lg font-bold">LMS Alprodas</h1>
            <p className="text-brand-dark text-xs font-normal">
              Learning Platform
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="text-brand-light text-sm font-medium hover:brightness-110 transition-all duration-300"
          >
            Home
          </Link>
          <Link
            to="/topics"
            className="text-brand-light text-sm font-medium hover:brightness-110 transition-all duration-300"
          >
            Topics
          </Link>
          <Link
            to="/subjects"
            className="text-brand-light text-sm font-medium hover:brightness-110 transition-all duration-300"
          >
            Subjects
          </Link>
          <Link
            to="/testimonials"
            className="text-brand-light text-sm font-medium hover:brightness-110 transition-all duration-300"
          >
            Testimonials
          </Link>
          <Link
            to="/about"
            className="text-brand-light text-sm font-medium hover:brightness-110 transition-all duration-300"
          >
            About
          </Link>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-[10px]">
          <Link
            to="/login"
            className="border border-[#DCDEDD] rounded-[8px] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 px-4 py-3 flex items-center gap-2 bg-white"
          >
            <span className="text-brand-dark text-sm font-semibold">Login</span>
          </Link>
          <button className="btn-primary rounded-[8px] border border-[#2151A0] hover:brightness-110 focus:ring-2 focus:ring-[#0C51D9] transition-all duration-300 blue-gradient blue-btn-shadow px-4 py-3 flex items-center gap-2">
            <span className="text-brand-white text-sm font-semibold">
              Get Started
            </span>
          </button>

          {/* Mobile Menu Button */}
          <button className="md:hidden border border-[#DCDEDD] rounded-[8px] hover:border-[#0C51D9] hover:border-2 transition-all duration-300 p-2 bg-white">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </nav>
  );
}
