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

interface StudentSidebarProps {
  isCollapsed?: boolean;
  toggleSidebar?: () => void;
}

interface StudentNavLinkProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isActive?: boolean;
  isCollapsed?: boolean;
}

function StudentNavLink({
  href,
  icon: Icon,
  label,
  isActive = false,
  isCollapsed = false,
}: StudentNavLinkProps) {
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
      title={isCollapsed ? label : undefined}
      className={`${baseClasses} ${isCollapsed ? collapsedClasses : expandedClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      <Icon
        className={`${isCollapsed ? "w-6 h-6" : "w-6 h-6"} ${isActive ? "text-white" : "text-gray-600"}`}
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

function LogoutButton({ isCollapsed }: { isCollapsed?: boolean }) {
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
      title={isCollapsed ? "Logout" : undefined}
      className={`${baseClasses} ${isCollapsed ? collapsedClasses : expandedClasses} ${inactiveClasses} w-full`}
    >
      <LogOut className={`w-6 h-6 text-gray-600 ${isCollapsed ? "w-6 h-6" : "w-6 h-6"}`} />
      {!isCollapsed && <span className="text-base font-medium text-brand-dark">Logout</span>}
    </button>
  );
}

export function StudentSidebar({ isCollapsed = false, toggleSidebar }: StudentSidebarProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  const widthClass = isCollapsed ? "w-20" : "w-64";

  return (
    <aside className={`${widthClass} bg-white border-r border-[#DCDEDD] flex flex-col transition-all duration-300 relative group`}>
      {/* Toggle Button */}
      {toggleSidebar && (
        <button
          onClick={toggleSidebar}
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
      )}

      {/* Logo Section */}
      <div className={`px-4 py-4 border-b border-[#DCDEDD] flex items-center ${isCollapsed ? 'justify-center' : ''} h-[88px]`}>
        <Link
          to="/"
          className="flex items-center gap-4 hover:opacity-80 transition-opacity duration-300 overflow-hidden"
        >
          <div className="w-10 h-10 relative flex-shrink-0 flex items-center justify-center">
            {/* Background circle */}
            <div className="w-10 h-10 absolute bg-gradient-to-br from-primary-100 to-primary-200 rounded-full"></div>
            {/* Overlapping smaller circle */}
            <div className="w-7 h-7 absolute bg-gradient-to-br from-primary-500 to-primary-600 rounded-full opacity-90"></div>
            {/* Lucide icon */}
            <GraduationCap className="w-4 h-4 text-white relative z-10" />
          </div>
          {!isCollapsed && (
            <div className="whitespace-nowrap transition-opacity duration-300 min-w-[200px]">
              <h1 className="text-brand-dark text-lg font-bold">Alprodas LMS</h1>
              <p className="text-brand-dark text-xs font-normal">
                Student Dashboard
              </p>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className={`px-4 py-4 space-y-6 overflow-y-auto ${isCollapsed ? 'scrollbar-none' : ''}`}>
        {/* MAIN Section */}
        <div>
          {!isCollapsed && (
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3 px-2">
              MAIN
            </h3>
          )}
          <div className="space-y-2">
            {/* <StudentNavLink
              href="#"
              icon={Home}
              label="Overview"
              isActive={currentPath === "/dashboard/student/overview"}
              isCollapsed={isCollapsed}
            /> */}
            <StudentNavLink
              href="/dashboard/student/my-courses"
              icon={BookOpen}
              label="My Courses"
              isActive={currentPath === "/dashboard/student/my-courses"}
              isCollapsed={isCollapsed}
            />
            {/* <StudentNavLink
              href="/dashboard/student/transactions"
              icon={CreditCard}
              label="Transactions"
              isActive={currentPath.startsWith(
                "/dashboard/student/transactions"
              )}
              isCollapsed={isCollapsed}
            />
            <StudentNavLink
              href="#"
              icon={Trophy}
              label="Challenges"
              isActive={currentPath === "/dashboard/student/challenges"}
              isCollapsed={isCollapsed}
            /> */}
          </div>
        </div>

        {/* SUPPORT Section */}
        {/* <div>
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3 px-2">
            SUPPORT
          </h3>
          <div className="space-y-2">
            <StudentNavLink
              href="#"
              icon={HelpCircle}
              label="Help Center"
              isActive={false}
              isCollapsed={isCollapsed}
            />
            <StudentNavLink
              href="#"
              icon={MessageSquare}
              label="Community"
              isActive={false}
              isCollapsed={isCollapsed}
            />
          </div>
        </div> */}

        {/* ACCOUNT Section */}
        <div>
          {!isCollapsed && (
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3 px-2">
              ACCOUNT
            </h3>
          )}
          <div className="space-y-2">
            <LogoutButton isCollapsed={isCollapsed} />
          </div>
        </div>
      </nav>
    </aside>
  );
}
