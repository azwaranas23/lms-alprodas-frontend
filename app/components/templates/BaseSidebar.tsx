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
  Star,
  Trophy,
  LogOut,
} from "lucide-react";
import { useUser } from "~/hooks/useUser";

interface NavItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  permission?: string;
  isActive?: (currentPath: string) => boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface BaseSidebarProps {
  variant?: "normal" | "wizard" | "learning";
  role?: "manager" | "mentor" | "student";
  className?: string;
}

function NavLink({
  href,
  icon: Icon,
  label,
  isActive = false,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isActive?: boolean;
}) {
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

export function BaseSidebar({
  variant = "normal",
  role,
  className = "",
}: BaseSidebarProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  const { user, getRole, hasPermission } = useUser();

  // Determine the role - use prop first, then hook
  const userRole = role || getRole();

  const getLogoSubtitle = () => {
    const roleSubtitles = {
      manager: "Manager Dashboard",
      mentor: "Mentor Dashboard",
      student: variant === "learning" ? "Learning Mode" : "Student Portal",
    };

    return roleSubtitles[userRole as keyof typeof roleSubtitles] || "Dashboard";
  };

  // Manager navigation sections
  const getManagerSections = (): NavSection[] => [
    {
      title: "GENERAL",
      items: [
        {
          href: "/dashboard/overview",
          icon: Home,
          label: "Dashboard",
          permission: "dashboard.read",
          isActive: (path) => path === "/dashboard/overview",
        },
        {
          href: "/dashboard/topics",
          icon: Tag,
          label: "Topics",
          permission: "topics.read",
          isActive: (path) =>
            path === "/dashboard/topics" ||
            path === "/dashboard/topics/add" ||
            path.startsWith("/dashboard/topics/edit"),
        },
        {
          href: "/dashboard/subjects",
          icon: Layers,
          label: "Subjects",
          permission: "subjects.read",
          isActive: (path) =>
            path === "/dashboard/subjects" ||
            path === "/dashboard/subjects/add" ||
            path.startsWith("/dashboard/subjects/edit"),
        },
        {
          href: "/dashboard/mentors",
          icon: UserCheck,
          label: "Mentors",
          permission: "mentors.read",
          isActive: (path) =>
            path === "/dashboard/mentors" ||
            path.startsWith("/dashboard/mentors/"),
        },
        {
          href: "/dashboard/students",
          icon: Users,
          label: "Students",
          permission: "students.read",
          isActive: (path) =>
            path === "/dashboard/students" ||
            path.startsWith("/dashboard/students/"),
        },
      ],
    },
    {
      title: "OTHERS",
      items: [
        {
          href: "/dashboard/transactions",
          icon: CreditCard,
          label: "Transactions",
          permission: "transactions.read",
          isActive: (path) =>
            path === "/dashboard/transactions" ||
            path.startsWith("/dashboard/transactions/"),
        },
        {
          href: "/dashboard/withdrawals",
          icon: Banknote,
          label: "Withdrawals",
          permission: "withdrawals.read",
          isActive: (path) =>
            path === "/dashboard/withdrawals" ||
            path.startsWith("/dashboard/withdrawals/"),
        },
        {
          href: "#",
          icon: Wallet,
          label: "Wallets",
          isActive: (path) => path === "/wallets",
        },
      ],
    },
  ];

  // Mentor navigation sections
  const getMentorSections = (): NavSection[] => [
    {
      title: "MAIN",
      items: [
        {
          href: "/dashboard/mentor/overview",
          icon: Home,
          label: "Dashboard",
          isActive: (path) => path === "/dashboard/mentor/overview",
        },
        {
          href: "/dashboard/mentor/courses",
          icon: BookOpen,
          label: "My Courses",
          isActive: (path) => path.startsWith("/dashboard/mentor/courses"),
        },
        {
          href: "/dashboard/mentor/students",
          icon: Users,
          label: "Students",
          isActive: (path) => path === "/dashboard/mentor/students",
        },
        {
          href: "/dashboard/mentor/transactions",
          icon: CreditCard,
          label: "Transactions",
          isActive: (path) =>
            path === "/dashboard/mentor/transactions" ||
            path.startsWith("/dashboard/mentor/transactions/"),
        },
        {
          href: "/dashboard/mentor/withdrawals",
          icon: Banknote,
          label: "Withdrawals",
          isActive: (path) =>
            path === "/dashboard/mentor/withdrawals" ||
            path.startsWith("/dashboard/mentor/withdrawals/"),
        },
      ],
    },
    {
      title: "RESOURCES",
      items: [
        {
          href: "/dashboard/mentor/materials",
          icon: Folder,
          label: "Course Materials",
          isActive: (path) => path === "/dashboard/mentor/materials",
        },
        {
          href: "/dashboard/mentor/sessions",
          icon: Video,
          label: "Live Sessions",
          isActive: (path) => path === "/dashboard/mentor/sessions",
        },
        {
          href: "/dashboard/mentor/assignments",
          icon: ClipboardCheck,
          label: "Assignments",
          isActive: (path) => path === "/dashboard/mentor/assignments",
        },
        {
          href: "/dashboard/mentor/analytics",
          icon: BarChart3,
          label: "Analytics",
          isActive: (path) => path === "/dashboard/mentor/analytics",
        },
      ],
    },
    {
      title: "SUPPORT",
      items: [
        {
          href: "/dashboard/mentor/help",
          icon: HelpCircle,
          label: "Help Center",
          isActive: (path) => path === "/dashboard/mentor/help",
        },
        {
          href: "/dashboard/mentor/community",
          icon: MessageSquare,
          label: "Community",
          isActive: (path) => path === "/dashboard/mentor/community",
        },
      ],
    },
  ];

  // Student navigation sections
  const getStudentSections = (): NavSection[] => {
    if (variant === "learning") {
      // Simplified navigation for learning mode
      return [
        {
          title: "LEARNING",
          items: [
            {
              href: "/dashboard/student/my-courses",
              icon: BookOpen,
              label: "My Courses",
              isActive: (path) => path === "/dashboard/student/my-courses",
            },
            {
              href: "/student/progress",
              icon: BarChart3,
              label: "Progress",
              isActive: (path) => path === "/student/progress",
            },
          ],
        },
      ];
    }

    return [
      {
        title: "MAIN",
        items: [
          {
            href: "/dashboard/student/overview",
            icon: Home,
            label: "Overview",
            isActive: (path) => path === "/dashboard/student/overview",
          },
          {
            href: "/dashboard/student/my-courses",
            icon: BookOpen,
            label: "My Courses",
            isActive: (path) => path === "/dashboard/student/my-courses",
          },
          {
            href: "/dashboard/student/points",
            icon: Star,
            label: "Points",
            isActive: (path) => path === "/dashboard/student/points",
          },
          {
            href: "/dashboard/student/transactions",
            icon: CreditCard,
            label: "Transactions",
            isActive: (path) =>
              path.startsWith("/dashboard/student/transactions"),
          },
          {
            href: "/dashboard/student/challenges",
            icon: Trophy,
            label: "Challenges",
            isActive: (path) => path === "/dashboard/student/challenges",
          },
        ],
      },
      {
        title: "SUPPORT",
        items: [
          {
            href: "#",
            icon: HelpCircle,
            label: "Help Center",
            isActive: () => false,
          },
          {
            href: "#",
            icon: MessageSquare,
            label: "Community",
            isActive: () => false,
          },
        ],
      },
    ];
  };

  const getSections = (): NavSection[] => {
    switch (userRole) {
      case "manager":
        return getManagerSections();
      case "mentor":
        return getMentorSections();
      case "student":
        return getStudentSections();
      default:
        return getManagerSections(); // fallback
    }
  };

  // Variant-specific styling
  const getSidebarClasses = () => {
    const baseClasses = "w-64 bg-white border-r border-[#DCDEDD] flex flex-col";

    switch (variant) {
      case "wizard":
        return `${baseClasses} shadow-lg`;
      case "learning":
        return `${baseClasses} bg-gray-50 border-gray-200`;
      default:
        return baseClasses;
    }
  };

  const sections = getSections();

  return (
    <aside className={`${getSidebarClasses()} ${className}`}>
      {/* Logo Section */}
      <div className="px-6 py-4 border-b border-[#DCDEDD]">
        <Link
          to="/"
          className="flex items-center gap-4 hover:opacity-80 transition-opacity duration-300"
        >
          <div className="w-14 h-14 relative flex items-center justify-center">
            <div className="w-14 h-14 absolute bg-gradient-to-br from-primary-100 to-primary-200 rounded-full"></div>
            <div className="w-10 h-10 absolute bg-gradient-to-br from-primary-500 to-primary-600 rounded-full opacity-90"></div>
            <GraduationCap className="w-5 h-5 text-white relative z-10" />
          </div>
          <div>
            <h1 className="text-brand-dark text-lg font-bold">LMS Alprodas</h1>
            <p className="text-brand-dark text-xs font-normal">
              {getLogoSubtitle()}
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="px-6 py-4 space-y-6">
        {sections.map((section) => (
          <div key={section.title}>
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">
              {section.title}
            </h3>
            <div className="space-y-3">
              {section.items.map((item) => {
                // Check permissions if specified
                if (item.permission && !hasPermission(item.permission)) {
                  return null;
                }

                const isActive = item.isActive
                  ? item.isActive(currentPath)
                  : false;

                return (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    label={item.label}
                    isActive={isActive}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
