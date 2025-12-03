import { Link, useLocation } from "react-router";
import { Logo } from "../atoms/Logo";
import { authService } from "~/services/auth.service";
import { Avatar } from "../atoms/Avatar";

export function UserNavbar() {
  const location = useLocation();
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

        <div className="hidden md:flex items-center gap-8">
          <Link
            className={`text-[16px] font-semibold ${getActiveClass("/")}`}
            to="/"
          >
            Home
          </Link>

          <Link
            className={`text-[16px] font-semibold ${getActiveClass(getDashboardUrl())}`}
            to={getDashboardUrl()}
          >
            Dashboard
          </Link>

          <Link
            className={`text-[16px] font-semibold ${getActiveClass("/courses")}`}
            to="/courses"
          >
            Courses
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link
            to={getDashboardUrl()}
            className="flex items-center gap-3 hover:bg-gray-50 rounded-lg px-3 py-2 transition"
          >
            <Avatar src={user?.avatar} name={user?.name} size="sm" />
            <div className="text-left">
              <div className="text-sm font-semibold">{user?.name}</div>
              <div className="text-xs text-[#8A8A8A]">{user?.email}</div>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}
