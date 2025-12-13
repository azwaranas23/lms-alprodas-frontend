import { Link, useLocation, useNavigate } from "react-router";
import {
  Home,
  BookOpen,
  Star,
  CreditCard,
  Trophy,
  HelpCircle,
  MessageSquare,
  LogOut,
  GraduationCap,
} from "lucide-react";
import { authService } from "~/services/auth.service";

interface StudentNavLinkProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isActive?: boolean;
}

function StudentNavLink({
  href,
  icon: Icon,
  label,
  isActive = false,
}: StudentNavLinkProps) {
  const baseClasses =
    "nav-link border rounded-[20px] transition-all duration-300 flex items-center gap-3 px-4 py-3";
  const activeClasses =
    "nav-link-active border-[#0B1042] relative overflow-hidden hover:brightness-110 focus:ring-2 focus:ring-[#0C51D9] bg-gradient-to-r from-[#0C51D9] to-[#2151A0]";
  const inactiveClasses =
    "border-[#DCDEDD] hover:border-[#0C51D9] hover:border-2 hover:rounded-[12px] focus:border-[#0C51D9] focus:border-2 focus:rounded-[12px] focus:bg-white";

  return (
    <Link
      to={href}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      <Icon
        className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-600"}`}
      />
      <span
        className={`text-base ${isActive ? "font-semibold text-white" : "font-medium text-brand-dark"}`}
      >
        {label}
      </span>
    </Link>
  );
}

function LogoutButton() {
  const navigate = useNavigate();
  const baseClasses =
    "nav-link border rounded-[20px] transition-all duration-300 flex items-center gap-3 px-4 py-3";
  const inactiveClasses =
    "border-[#DCDEDD] hover:border-[#0C51D9] hover:border-2 hover:rounded-[12px] focus:border-[#0C51D9] focus:border-2 focus:rounded-[12px] focus:bg-white";

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className={`${baseClasses} ${inactiveClasses} w-full`}
    >
      <LogOut className="w-5 h-5 text-gray-600" />
      <span className="text-base font-medium text-brand-dark">Logout</span>
    </button>
  );
}

export function StudentSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside className="w-64 bg-white border-r border-[#DCDEDD] flex flex-col">
      {/* Logo Section */}
      <div className="px-6 py-4 border-b border-[#DCDEDD]">
        <Link
          to="/"
          className="flex items-center gap-4 hover:opacity-80 transition-opacity duration-300"
        >
          <div className="w-14 h-14 relative flex items-center justify-center">
            {/* Background circle */}
            <div className="w-14 h-14 absolute bg-gradient-to-br from-primary-100 to-primary-200 rounded-full"></div>
            {/* Overlapping smaller circle */}
            <div className="w-10 h-10 absolute bg-gradient-to-br from-primary-500 to-primary-600 rounded-full opacity-90"></div>
            {/* Lucide icon */}
            <GraduationCap className="w-5 h-5 text-white relative z-10" />
          </div>
          <div>
            <h1 className="text-brand-dark text-lg font-bold">Alprodas LMS</h1>
            <p className="text-brand-dark text-xs font-normal">
              Student Dashboard
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="px-6 py-4 space-y-6">
        {/* MAIN Section */}
        <div>
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">
            MAIN
          </h3>
          <div className="space-y-3">
            {/* <StudentNavLink
              href="#"
              icon={Home}
              label="Overview"
              isActive={currentPath === "/dashboard/student/overview"}
            /> */}
            <StudentNavLink
              href="/dashboard/student/my-courses"
              icon={BookOpen}
              label="My Courses"
              isActive={currentPath === "/dashboard/student/my-courses"}
            />
            {/* <StudentNavLink
              href="/dashboard/student/transactions"
              icon={CreditCard}
              label="Transactions"
              isActive={currentPath.startsWith(
                "/dashboard/student/transactions"
              )}
            />
            <StudentNavLink
              href="#"
              icon={Trophy}
              label="Challenges"
              isActive={currentPath === "/dashboard/student/challenges"}
            /> */}
          </div>
        </div>

        {/* SUPPORT Section */}
        {/* <div>
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">
            SUPPORT
          </h3>
          <div className="space-y-3">
            <StudentNavLink
              href="#"
              icon={HelpCircle}
              label="Help Center"
              isActive={false}
            />
            <StudentNavLink
              href="#"
              icon={MessageSquare}
              label="Community"
              isActive={false}
            />
          </div>
        </div> */}

        {/* ACCOUNT Section */}
        <div>
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">
            ACCOUNT
          </h3>
          <div className="space-y-3">
            <LogoutButton />
          </div>
        </div>
      </nav>
    </aside>
  );
}
