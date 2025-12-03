import { Link, useLocation } from "react-router";
import { Logo } from "../atoms/Logo";

export function GuestNavbar() {
  const location = useLocation();

  const getActiveClass = (path: string) =>
    location.pathname === path
      ? "text-[#0C51D9]"
      : "text-[#3D3D3D] hover:text-[#0C51D9]";

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between py-4 px-6">
        <Link to="/">
          <Logo variant="navbar" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            className={`text-[16px] font-semibold ${getActiveClass("/")}`}
            to="/"
          >
            Home
          </Link>

          <Link
            className={`text-[16px] font-semibold ${getActiveClass("/courses")}`}
            to="/courses"
          >
            Courses
          </Link>

          <a
            className="text-[16px] font-semibold text-[#3D3D3D] hover:text-[#0C51D9]"
            href="/#topics"
          >
            Topics
          </a>

          <a
            className="text-[16px] font-semibold text-[#3D3D3D] hover:text-[#0C51D9]"
            href="/#about"
          >
            About
          </a>

          <a
            className="text-[16px] font-semibold text-[#3D3D3D] hover:text-[#0C51D9]"
            href="/#contact"
          >
            Contact
          </a>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/login"
            className="text-[16px] font-semibold text-[#3D3D3D] hover:text-[#0C51D9]"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="px-4 py-2 bg-[#0C51D9] text-white rounded-[8px] font-semibold hover:bg-blue-700 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
