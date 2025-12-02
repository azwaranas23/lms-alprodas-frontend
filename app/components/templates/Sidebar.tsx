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
} from "lucide-react";
import { authService } from "~/services/auth.service";

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

export function Sidebar() {
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
            <h1 className="text-brand-dark text-lg font-bold">LMS Alprodas</h1>
            <p className="text-brand-dark text-xs font-normal">
              Manager Dashboard
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="px-6 py-4 space-y-6">
        {/* GENERAL Section */}
        <div>
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">
            GENERAL
          </h3>
          <div className="space-y-3">
            {authService.hasPermission("dashboard.read") && (
              <NavLink
                href="/overview"
                icon={Home}
                label="Dashboard"
                isActive={currentPath === "/overview"}
              />
            )}
            {authService.hasPermission("topics.read") && (
              <NavLink
                href="/topics"
                icon={Tag}
                label="Topics"
                isActive={
                  currentPath === "/topics" ||
                  currentPath === "/topics/add" ||
                  currentPath.startsWith("/topics/edit")
                }
              />
            )}
            {authService.hasPermission("subjects.read") && (
              <NavLink
                href="/subjects"
                icon={Layers}
                label="Subjects"
                isActive={
                  currentPath === "/subjects" ||
                  currentPath === "/subjects/add" ||
                  currentPath.startsWith("/subjects/edit")
                }
              />
            )}
            {authService.hasPermission("courses.read") && (
              <NavLink
                href="/courses"
                icon={BookOpen}
                label="Courses"
                isActive={
                  currentPath === "/courses" ||
                  currentPath === "/courses/add" ||
                  currentPath === "/courses/success"
                }
              />
            )}
            {authService.hasPermission("mentors.read") && (
              <NavLink
                href="/mentors"
                icon={UserCheck}
                label="Mentors"
                isActive={
                  currentPath === "/mentors" ||
                  currentPath.startsWith("/mentors/")
                }
              />
            )}
            {authService.hasPermission("students.read") && (
              <NavLink
                href="/students"
                icon={Users}
                label="Students"
                isActive={currentPath === "/students"}
              />
            )}
          </div>
        </div>

        {/* OTHERS Section */}
        <div>
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">
            OTHERS
          </h3>
          <div className="space-y-3">
            {authService.hasPermission("transactions.read") && (
              <NavLink
                href="/transactions"
                icon={CreditCard}
                label="Transactions"
                isActive={
                  currentPath === "/transactions" ||
                  currentPath.startsWith("/transactions/")
                }
              />
            )}
            {authService.hasPermission("withdrawals.read") && (
              <NavLink
                href="/withdrawals"
                icon={Banknote}
                label="Withdrawals"
                isActive={
                  currentPath === "/withdrawals" ||
                  currentPath.startsWith("/withdrawals/")
                }
              />
            )}
            <NavLink
              href="/mentor/courses"
              icon={BookOpen}
              label="Mentor Courses"
              isActive={currentPath === "/mentor/courses"}
            />
            <NavLink
              href="/wallets"
              icon={Wallet}
              label="Wallets"
              isActive={currentPath === "/wallets"}
            />
          </div>
        </div>
      </nav>
    </aside>
  );
}
