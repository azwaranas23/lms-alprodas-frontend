import { useState, useEffect } from "react";
import { ChevronDown, LogOut, Home, BookOpen, LayoutDashboard } from "lucide-react";
import { Link } from "react-router";
import { useUser } from "~/hooks/useUser";
import { authService } from "~/services/auth.service";
import { Avatar } from "~/components/atoms/Avatar";

export function UserProfileDropdown() {
    // Try to get user immediately if available (safe for client-side navigation)
    const [user, setUser] = useState<any>(() => authService.getUser());
    const { getRoleName, getAvatar } = useUser();
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const currentUser = authService.getUser();
        setUser(currentUser);
    }, []);

    const getUserName = () => user?.name || "User";
    const getUserRole = () => user?.role?.name || "Student";
    const getUserAvatar = () => user?.avatar || user?.user_profile?.avatar;

    const handleLogout = () => {
        authService.logout();
        window.location.href = "/login";
    };

    const getDashboardUrl = () => {
        if (!user) return "/dashboard";
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

    // Removed early return to allow rendering (will show "User" if null)
    // if (!user) return null;

    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-1 transition-colors cursor-pointer"
                type="button"
            >
                <Avatar
                    src={getUserAvatar() || undefined}
                    name={getUserName()}
                    size="md"
                />
                <div className="text-left">
                    <p className="text-brand-dark text-base font-semibold">
                        {getUserName()}
                    </p>
                    <p className="text-brand-dark text-xs font-normal leading-4 text-gray-500">
                        {getUserRole()}
                    </p>
                </div>
                <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${showDropdown ? "rotate-180" : ""
                        }`}
                />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="py-2">
                        <Link
                            to="/"
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                        >
                            <Home className="w-4 h-4" />
                            Home
                        </Link>
                        <a
                            href="/#courses"
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                        >
                            <BookOpen className="w-4 h-4" />
                            Courses
                        </a>
                        <Link
                            to={getDashboardUrl()}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                        </Link>
                        <hr className="my-2 border-gray-200" />
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                            type="button"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
