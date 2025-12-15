import { Link, useLocation, useNavigate } from "react-router";
import {
  Home,
  BookOpen,
  Users,
  CreditCard,
  Banknote,
  Folder,
  Video,
  ClipboardCheck,
  BarChart3,
  HelpCircle,
  MessageSquare,
  GraduationCap,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { authService } from "~/services/auth.service";

interface MentorNavLinkProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isActive?: boolean;
  isCollapsed?: boolean;
  toggleSidebar?: () => void;
}

function LogoutButton({ isCollapsed }: { isCollapsed: boolean }) {
  const navigate = useNavigate();
  const baseClasses =
    "nav-link border rounded-[20px] transition-all duration-300 flex items-center";
  const expandedClasses = "gap-3 px-4 py-3";
  const collapsedClasses = "justify-center p-2 w-10 h-10 mx-auto";
  const inactiveClasses =
    "border-[#DCDEDD] hover:border-[#0C51D9] hover:border-2 hover:rounded-[12px] focus:border-[#0C51D9] focus:border-2 focus:rounded-[12px] focus:bg-white";

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className={`${baseClasses} ${isCollapsed ? collapsedClasses : expandedClasses} ${inactiveClasses} w-full`}
      title={isCollapsed ? "Logout" : ""}
    >
      <LogOut className={`w-5 h-5 text-gray-600 ${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`} />
      {!isCollapsed && (
        <span className="text-base font-medium text-brand-dark">Logout</span>
      )}
    </button>
  );
}

function MentorNavLink({
  href,
  icon: Icon,
  label,
  isActive = false,
  isCollapsed = false,
}: MentorNavLinkProps) {
  const baseClasses =
    "nav-link border rounded-[20px] transition-all duration-300 flex items-center";
  const expandedClasses = "gap-3 px-4 py-3";
  const collapsedClasses = "justify-center p-2 w-10 h-10 mx-auto";

  const activeClasses =
    "nav-link-active border-[#0B1042] relative overflow-hidden hover:brightness-110 focus:ring-2 focus:ring-[#0C51D9] bg-gradient-to-r from-[#0C51D9] to-[#2151A0]";
  const inactiveClasses =
    "border-[#DCDEDD] hover:border-[#0C51D9] hover:border-2 hover:rounded-[12px] focus:border-[#0C51D9] focus:border-2 focus:rounded-[12px] focus:bg-white";

  return (
    <Link
      to={href}
      className={`${baseClasses} ${isCollapsed ? collapsedClasses : expandedClasses} ${isActive ? activeClasses : inactiveClasses}`}
      title={isCollapsed ? label : ""}
    >
      <Icon
        className={`${isCollapsed ? "w-6 h-6" : "w-5 h-5"} ${isActive ? "text-white" : "text-gray-600"}`}
      />
      {!isCollapsed && (
        <span
          className={`text-base ${isActive ? "font-semibold text-white" : "font-medium text-brand-dark"}`}
        >
          {label}
        </span>
      )}
    </Link>
  );
}

export function MentorSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`bg-white border-r border-[#DCDEDD] flex flex-col transition-all duration-300 relative group ${isCollapsed ? "w-20" : "w-64"}`}
    >
      {/* Logo Section */}
      <div className={`px-4 py-4 border-b border-[#DCDEDD] flex items-center ${isCollapsed ? "justify-center" : ""} h-[88px]`}>
        <Link
          to="/"
          className={`flex items-center gap-4 hover:opacity-80 transition-opacity duration-300 ${isCollapsed ? "justify-center w-full" : ""}`}
        >
          <div className="w-14 h-14 relative flex items-center justify-center flex-shrink-0">
            {/* Background circle */}
            <div className="w-14 h-14 absolute bg-gradient-to-br from-primary-100 to-primary-200 rounded-full"></div>
            {/* Overlapping smaller circle */}
            <div className="w-10 h-10 absolute bg-gradient-to-br from-primary-500 to-primary-600 rounded-full opacity-90"></div>
            {/* Lucide icon */}
            <GraduationCap className="w-5 h-5 text-white relative z-10" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-brand-dark text-lg font-bold truncate">Alprodas LMS</h1>
              <p className="text-brand-dark text-xs font-normal truncate">
                Mentor Dashboard
              </p>
            </div>
          )}
        </Link>
      </div>

      {/* Toggle Button */}
      {/* {toggleSidebar && ( */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-4 top-24 bg-[#0C51D9] border-4 border-[#F9F9F9] rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:shadow-lg hover:bg-[#093cba] transition-all z-50 text-white cursor-pointer"
      >
        {isCollapsed ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        )}
      </button>
      {/* )} */}

      {/* Navigation Menu */}
      <nav className={`px-4 py-4 space-y-6 flex-1 overflow-y-auto ${isCollapsed ? "px-2" : ""}`}>
        {/* MAIN Section */}
        <div>
          {!isCollapsed && (
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3 px-2">
              MAIN
            </h3>
          )}
          <div className="space-y-3">
            <MentorNavLink
              href="/dashboard/mentor/overview"
              icon={Home}
              label="Dashboard"
              isActive={currentPath === "/dashboard/mentor/overview"}
              isCollapsed={isCollapsed}
            />
            <MentorNavLink
              href="/dashboard/mentor/courses"
              icon={BookOpen}
              label="My Courses"
              isActive={currentPath.startsWith("/dashboard/mentor/courses")}
              isCollapsed={isCollapsed}
            />
            <MentorNavLink
              href="/dashboard/mentor/students"
              icon={Users}
              label="Students"
              isActive={currentPath === "/dashboard/mentor/students"}
              isCollapsed={isCollapsed}
            />
          </div>
        </div>

        <div>
          {!isCollapsed && (
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3 px-2">
              ACCOUNT
            </h3>
          )}
          <div className="space-y-3">
            <LogoutButton isCollapsed={isCollapsed} />
          </div>
        </div>
      </nav>
    </aside>
  );
}
