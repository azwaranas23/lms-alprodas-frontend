import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Logo } from "../atoms/Logo";
import { authService } from "~/services/auth.service";
import { Avatar } from "../atoms/Avatar";
import { UserProfileDropdown } from "../molecules/UserProfileDropdown";
import { Menu, X } from "lucide-react";

export function UserNavbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = authService.getUser();

  const getDashboardUrl = () => {
    const role = user?.role?.key || user?.role_name;
    if (role === "student") return "/dashboard/student/my-courses";
    if (role === "mentor") return "/dashboard/mentor/overview";
    if (role === "manager") return "/dashboard/overview";
    return "/dashboard";
  };

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

        {/* Desktop Menu */}
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

          <Link
            className={`text-[16px] font-semibold ${getActiveClass(getDashboardUrl())}`}
            to={getDashboardUrl()}
          >
            Dashboard
          </Link>
        </div>

        <div className="hidden md:block">
          <UserProfileDropdown />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-[#3D3D3D]"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg p-4 flex flex-col gap-4">


          <Link
            className={`text-[16px] font-semibold py-2 ${getActiveClass("/")}`}
            to="/"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>

          <Link
            className={`text-[16px] font-semibold py-2 ${getActiveClass("/courses")}`}
            to="/courses"
            onClick={() => setIsMenuOpen(false)}
          >
            Courses
          </Link>

          <Link
            className={`text-[16px] font-semibold py-2 ${getActiveClass(getDashboardUrl())}`}
            to={getDashboardUrl()}
            onClick={() => setIsMenuOpen(false)}
          >
            Dashboard
          </Link>
        </div>
      )}
    </nav>
  );
}
