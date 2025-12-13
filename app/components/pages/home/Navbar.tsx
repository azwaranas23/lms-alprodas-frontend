import { useState, useEffect } from "react";
import { GraduationCap, Menu } from "lucide-react";
import { useLocation } from "react-router";
import { authService } from "~/services/auth.service";
import { Button } from "~/components/atoms/Button";
import { Avatar } from "~/components/atoms/Avatar";
import type { User } from "~/types/auth";

interface NavbarProps {
  onSmoothScroll?: (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => void;
  mode?: "home" | "standard";
}

export function Navbar({ onSmoothScroll, mode = "home" }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const location = useLocation();

  useEffect(() => {
    const currentUser = authService.getUser();
    const authStatus = authService.isAuthenticated();
    setUser(currentUser);
    setIsAuthenticated(authStatus);
  }, []);

  useEffect(() => {
    // Set active section based on current route
    if (location.pathname === "/") {
      // On home page, use scroll detection
      const handleScroll = () => {
        const sections = ["home", "courses", "topics", "about", "contact"];
        const scrollPosition = window.scrollY + 100;

        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const offsetTop = element.offsetTop;
            const height = element.offsetHeight;

            if (
              scrollPosition >= offsetTop &&
              scrollPosition < offsetTop + height
            ) {
              setActiveSection(section);
              break;
            }
          }
        }
      };

      window.addEventListener("scroll", handleScroll);
      handleScroll(); // Initial check

      return () => window.removeEventListener("scroll", handleScroll);
    } else if (location.pathname.startsWith("/topic/")) {
      // On topic pages, set topics as active
      setActiveSection("topics");
    } else if (location.pathname.startsWith("/course/")) {
      // On course pages, set courses as active
      setActiveSection("courses");
    } else {
      // On other pages, no active section
      setActiveSection("");
    }
  }, [location.pathname]);

  const getDashboardUrl = (user: User) => {
    const roleKey = user.role?.key || user.role_name;
    switch (roleKey) {
      case "manager":
        return "/dashboard/overview";
      case "mentor":
        return "/dashboard/mentor/overview";
      case "student":
        return "/dashboard/student/my-courses";
      default:
        return "/dashboard";
    }
  };

  const getNavLinkClass = (section: string) => {
    const baseClass = "font-medium transition-colors";
    const isActive = activeSection === section;
    return isActive
      ? `${baseClass} text-blue-600 border-b-2 border-blue-600 pb-1`
      : `${baseClass} text-brand-dark hover:text-blue-600`;
  };

  return (
    <nav className="bg-white border-b border-[#DCDEDD] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 relative flex items-center justify-center">
              {/* Background circle */}
              <div className="w-10 h-10 absolute bg-gradient-to-br from-primary-100 to-primary-200 rounded-full"></div>
              {/* Overlapping smaller circle */}
              <div className="w-7 h-7 absolute bg-gradient-to-br from-primary-500 to-primary-600 rounded-full opacity-90"></div>
              {/* Lucide icon */}
              <GraduationCap className="w-4 h-4 text-white relative z-10" />
            </div>
            <div>
              <h1 className="text-brand-dark text-lg font-bold">
                Alprodas LMS
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {mode === "home" ? (
              <>
                <a
                  href="#home"
                  onClick={(e) => onSmoothScroll?.(e, "#home")}
                  className={getNavLinkClass("home")}
                >
                  Home
                </a>
                <a
                  href="#courses"
                  onClick={(e) => onSmoothScroll?.(e, "#courses")}
                  className={getNavLinkClass("courses")}
                >
                  Courses
                </a>
                <a
                  href="#topics"
                  onClick={(e) => onSmoothScroll?.(e, "#topics")}
                  className={getNavLinkClass("topics")}
                >
                  Topics
                </a>
                <a
                  href="#about"
                  onClick={(e) => onSmoothScroll?.(e, "#about")}
                  className={getNavLinkClass("about")}
                >
                  About
                </a>
                <a
                  href="#contact"
                  onClick={(e) => onSmoothScroll?.(e, "#contact")}
                  className={getNavLinkClass("contact")}
                >
                  Contact
                </a>
              </>
            ) : (
              <>
                <a
                  href="/"
                  className="text-brand-dark font-medium hover:text-blue-600 transition-colors"
                >
                  Home
                </a>
                <a
                  href="/#courses"
                  className="text-brand-dark font-medium hover:text-blue-600 transition-colors"
                >
                  Courses
                </a>
                <a
                  href="/#topics"
                  className="text-brand-dark font-medium hover:text-blue-600 transition-colors"
                >
                  Topics
                </a>
                <a
                  href="/#about"
                  className="text-brand-dark font-medium hover:text-blue-600 transition-colors"
                >
                  About
                </a>
                <a
                  href="/#contact"
                  className="text-brand-dark font-medium hover:text-blue-600 transition-colors"
                >
                  Contact
                </a>
              </>
            )}
          </div>

          {/* Conditional Auth/User Section */}
          {isAuthenticated && user ? (
            /* User Profile Section */
            <div className="hidden md:flex items-center">
              <a
                href={getDashboardUrl(user)}
                className="flex items-center gap-3 hover:bg-gray-50 rounded-[12px] p-2 transition-all duration-300"
              >
                <Avatar
                  src={user.avatar || undefined}
                  name={user.name}
                  size="md"
                />
                <div className="text-left">
                  <div className="text-brand-dark text-sm font-semibold">
                    {user.name}
                  </div>
                  <div className="text-brand-light text-xs">{user.email}</div>
                </div>
              </a>
            </div>
          ) : (
            /* Auth Buttons */
            <div className="hidden md:flex items-center space-x-4">
              <a
                href="/login"
                className="text-brand-dark font-medium hover:text-blue-600 transition-colors"
              >
                Login
              </a>
              <a href="/signup">
                <Button variant="primary" className="px-6 py-2" size="sm">
                  Sign Up
                </Button>
              </a>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-blue-600 focus:outline-none"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden ${mobileMenuOpen ? "" : "hidden"} border-t border-[#DCDEDD] pt-4 pb-4`}
        >
          <div className="flex flex-col space-y-4">
            {mode === "home" ? (
              <>
                <a
                  href="#home"
                  onClick={(e) => onSmoothScroll?.(e, "#home")}
                  className={getNavLinkClass("home")}
                >
                  Home
                </a>
                <a
                  href="#courses"
                  onClick={(e) => onSmoothScroll?.(e, "#courses")}
                  className={getNavLinkClass("courses")}
                >
                  Courses
                </a>
                <a
                  href="#topics"
                  onClick={(e) => onSmoothScroll?.(e, "#topics")}
                  className={getNavLinkClass("topics")}
                >
                  Topics
                </a>
                <a
                  href="#about"
                  onClick={(e) => onSmoothScroll?.(e, "#about")}
                  className={getNavLinkClass("about")}
                >
                  About
                </a>
                <a
                  href="#contact"
                  onClick={(e) => onSmoothScroll?.(e, "#contact")}
                  className={getNavLinkClass("contact")}
                >
                  Contact
                </a>
              </>
            ) : (
              <>
                <a
                  href="/"
                  className="text-brand-dark font-medium hover:text-blue-600 transition-colors"
                >
                  Home
                </a>
                <a
                  href="/#courses"
                  className="text-brand-dark font-medium hover:text-blue-600 transition-colors"
                >
                  Courses
                </a>
                <a
                  href="/#topics"
                  className="text-brand-dark font-medium hover:text-blue-600 transition-colors"
                >
                  Topics
                </a>
                <a
                  href="/#about"
                  className="text-brand-dark font-medium hover:text-blue-600 transition-colors"
                >
                  About
                </a>
                <a
                  href="/#contact"
                  className="text-brand-dark font-medium hover:text-blue-600 transition-colors"
                >
                  Contact
                </a>
              </>
            )}

            {isAuthenticated && user ? (
              /* Mobile User Profile */
              <div className="pt-4 border-t border-[#DCDEDD]">
                <a
                  href={getDashboardUrl(user)}
                  className="flex items-center gap-3 hover:bg-gray-50 rounded-[12px] p-2 transition-all duration-300"
                >
                  <Avatar
                    src={user.avatar || undefined}
                    name={user.name}
                    size="md"
                  />
                  <div className="text-left">
                    <div className="text-brand-dark text-sm font-semibold">
                      {user.name}
                    </div>
                    <div className="text-brand-light text-xs">{user.email}</div>
                  </div>
                </a>
              </div>
            ) : (
              /* Mobile Auth Buttons */
              <div className="flex flex-col space-y-2 pt-4 border-t border-[#DCDEDD]">
                <a
                  href="/login"
                  className="text-brand-dark font-medium hover:text-blue-600 transition-colors"
                >
                  Login
                </a>
                <a href="/signup">
                  <Button
                    variant="primary"
                    className="px-6 py-2 w-full"
                    size="sm"
                  >
                    Sign Up
                  </Button>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
