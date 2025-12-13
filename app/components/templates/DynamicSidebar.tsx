import { Link, useLocation } from "react-router";
import {
  Home,
  Tag,
  Layers,
  BookOpen,
  UserCheck,
  Users,
  CreditCard,
  Banknote,
  Wallet,
  GraduationCap,
  Calendar,
  ClipboardCheck,
  Award,
  BarChart3,
  HelpCircle,
  MessageSquare,
  Folder,
  Video,
} from "lucide-react";
import { useUser } from "~/hooks/useUser";

interface NavLinkProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isActive?: boolean;
}

function NavLink({ href, icon: Icon, label, isActive = false }: NavLinkProps) {
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

export function DynamicSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { user, getRole, getRoleName, hasPermission } = useUser();
  const userRole = getRole();

  const getLogoSubtitle = () => {
    const roleSubtitles = {
      manager: "Manager Dashboard",
      mentor: "Mentor Dashboard",
      student: "Student Portal",
    };

    return roleSubtitles[userRole as keyof typeof roleSubtitles] || "Dashboard";
  };

  const getUserRoleDisplay = () => {
    return user?.role?.name || userRole || "User";
  };

  const renderManagerSidebar = () => (
    <>
      <div>
        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">
          GENERAL
        </h3>
        <div className="space-y-3">
          {hasPermission("dashboard.read") && (
            <NavLink
              href="/dashboard/overview"
              icon={Home}
              label="Dashboard"
              isActive={currentPath === "/dashboard/overview"}
            />
          )}
          {hasPermission("topics.read") && (
            <NavLink
              href="/dashboard/topics"
              icon={Tag}
              label="Topics"
              isActive={
                currentPath === "/dashboard/topics" ||
                currentPath === "/dashboard/topics/add" ||
                currentPath.startsWith("/dashboard/topics/edit")
              }
            />
          )}
          {hasPermission("subjects.read") && (
            <NavLink
              href="/dashboard/subjects"
              icon={Layers}
              label="Subjects"
              isActive={
                currentPath === "/dashboard/subjects" ||
                currentPath === "/dashboard/subjects/add" ||
                currentPath.startsWith("/dashboard/subjects/edit")
              }
            />
          )}
          {hasPermission("mentors.read") && (
            <NavLink
              href="/dashboard/mentors"
              icon={UserCheck}
              label="Mentors"
              isActive={
                currentPath === "/dashboard/mentors" ||
                currentPath.startsWith("/dashboard/mentors/")
              }
            />
          )}
          {hasPermission("students.read") && (
            <NavLink
              href="/dashboard/students"
              icon={Users}
              label="Students"
              isActive={
                currentPath === "/dashboard/students" ||
                currentPath.startsWith("/dashboard/students/")
              }
            />
          )}
        </div>
      </div>
      <div>
        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">
          OTHERS
        </h3>
        <div className="space-y-3">
          {hasPermission("transactions.read") && (
            <NavLink
              href="/dashboard/transactions"
              icon={CreditCard}
              label="Transactions"
              isActive={
                currentPath === "/dashboard/transactions" ||
                currentPath.startsWith("/dashboard/transactions/")
              }
            />
          )}
          {hasPermission("withdrawals.read") && (
            <NavLink
              href="/dashboard/withdrawals"
              icon={Banknote}
              label="Withdrawals"
              isActive={
                currentPath === "/dashboard/withdrawals" ||
                currentPath.startsWith("/dashboard/withdrawals/")
              }
            />
          )}
          <NavLink
            href="/wallets"
            icon={Wallet}
            label="Wallets"
            isActive={currentPath === "/wallets"}
          />
        </div>
      </div>
    </>
  );

  const renderMentorSidebar = () => (
    <>
      <div>
        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">
          MAIN
        </h3>
        <div className="space-y-3">
          <NavLink
            href="/dashboard/mentor/overview"
            icon={Home}
            label="Dashboard"
            isActive={currentPath === "/dashboard/mentor/overview"}
          />
          <NavLink
            href="/dashboard/mentor/courses"
            icon={BookOpen}
            label="My Courses"
            isActive={currentPath.startsWith("/dashboard/mentor/courses")}
          />
          <NavLink
            href="/dashboard/mentor/students"
            icon={Users}
            label="Students"
            isActive={currentPath === "/dashboard/mentor/students"}
          />
          <NavLink
            href="/dashboard/mentor/transactions"
            icon={CreditCard}
            label="Transactions"
            isActive={
              currentPath === "/dashboard/mentor/transactions" ||
              currentPath.startsWith("/dashboard/mentor/transactions/")
            }
          />
          <NavLink
            href="/dashboard/mentor/withdrawals"
            icon={Banknote}
            label="Withdrawals"
            isActive={
              currentPath === "/dashboard/mentor/withdrawals" ||
              currentPath.startsWith("/dashboard/mentor/withdrawals/")
            }
          />
        </div>
      </div>
      <div>
        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">
          RESOURCES
        </h3>
        <div className="space-y-3">
          <NavLink
            href="/dashboard/mentor/materials"
            icon={Folder}
            label="Course Materials"
            isActive={currentPath === "/dashboard/mentor/materials"}
          />
          <NavLink
            href="/dashboard/mentor/sessions"
            icon={Video}
            label="Live Sessions"
            isActive={currentPath === "/dashboard/mentor/sessions"}
          />
          <NavLink
            href="/dashboard/mentor/assignments"
            icon={ClipboardCheck}
            label="Assignments"
            isActive={currentPath === "/dashboard/mentor/assignments"}
          />
          <NavLink
            href="/dashboard/mentor/analytics"
            icon={BarChart3}
            label="Analytics"
            isActive={currentPath === "/dashboard/mentor/analytics"}
          />
        </div>
      </div>
      <div>
        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">
          SUPPORT
        </h3>
        <div className="space-y-3">
          <NavLink
            href="/dashboard/mentor/help"
            icon={HelpCircle}
            label="Help Center"
            isActive={currentPath === "/dashboard/mentor/help"}
          />
          <NavLink
            href="/dashboard/mentor/community"
            icon={MessageSquare}
            label="Community"
            isActive={currentPath === "/dashboard/mentor/community"}
          />
        </div>
      </div>
    </>
  );

  const renderStudentSidebar = () => (
    <>
      <div>
        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">
          LEARNING
        </h3>
        <div className="space-y-3">
          <NavLink
            href="/dashboard/student/my-courses"
            icon={Home}
            label="Dashboard"
            isActive={currentPath === "/dashboard/student/my-courses"}
          />
          <NavLink
            href="/student/my-courses"
            icon={BookOpen}
            label="My Courses"
            isActive={currentPath === "/student/my-courses"}
          />
          <NavLink
            href="/student/mentors"
            icon={Users}
            label="My Mentors"
            isActive={currentPath === "/student/mentors"}
          />
          <NavLink
            href="/student/schedule"
            icon={Calendar}
            label="Schedule"
            isActive={currentPath === "/student/schedule"}
          />
          <NavLink
            href="/student/assignments"
            icon={ClipboardCheck}
            label="Assignments"
            isActive={currentPath === "/student/assignments"}
          />
        </div>
      </div>
      <div>
        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">
          PROGRESS
        </h3>
        <div className="space-y-3">
          <NavLink
            href="/student/achievements"
            icon={Award}
            label="Achievements"
            isActive={currentPath === "/student/achievements"}
          />
          <NavLink
            href="/student/progress"
            icon={BarChart3}
            label="Learning Progress"
            isActive={currentPath === "/student/progress"}
          />
        </div>
      </div>
      <div>
        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">
          SUPPORT
        </h3>
        <div className="space-y-3">
          <NavLink
            href="/student/help"
            icon={HelpCircle}
            label="Help Center"
            isActive={currentPath === "/student/help"}
          />
          <NavLink
            href="/student/community"
            icon={MessageSquare}
            label="Community"
            isActive={currentPath === "/student/community"}
          />
        </div>
      </div>
    </>
  );

  const getSidebarContent = () => {
    switch (userRole) {
      case "manager":
        return renderManagerSidebar();
      case "mentor":
        return renderMentorSidebar();
      case "student":
        return renderStudentSidebar();
      default:
        return renderManagerSidebar(); // fallback
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-[#DCDEDD] flex flex-col">
      {/* Logo Section */}
      <div className="px-6 py-4 border-b border-[#DCDEDD]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 relative flex items-center justify-center">
            <div className="w-14 h-14 absolute bg-gradient-to-br from-primary-100 to-primary-200 rounded-full"></div>
            <div className="w-10 h-10 absolute bg-gradient-to-br from-primary-500 to-primary-600 rounded-full opacity-90"></div>
            <GraduationCap className="w-5 h-5 text-white relative z-10" />
          </div>
          <div>
            <h1 className="text-brand-dark text-lg font-bold">Alprodas LMS</h1>
            <p className="text-brand-dark text-xs font-normal">
              {getLogoSubtitle()}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="px-6 py-4 space-y-6">{getSidebarContent()}</nav>
    </aside>
  );
}
