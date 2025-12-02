import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Link, useLocation } from "react-router";
import { Logo } from "../atoms/Logo";
import { authService } from "~/services/auth.service";
import { getAvatarSrc } from "~/utils/formatters";
import type { User } from "~/types/auth";

interface NavbarProps {
	onSmoothScroll?: (
		e: React.MouseEvent<HTMLAnchorElement>,
		href: string
	) => void;
	mode?: "home" | "standard";
}

export function Navbar({ onSmoothScroll, mode = "standard" }: NavbarProps) {
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
				const sections = [
					"home",
					"courses",
					"topics",
					"about",
					"contact",
				];
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

			if (mode === "home") {
				window.addEventListener("scroll", handleScroll);
				handleScroll(); // Initial check
				return () => window.removeEventListener("scroll", handleScroll);
			} else {
				setActiveSection("home");
			}
		} else if (location.pathname.startsWith("/topic/")) {
			setActiveSection("topics");
		} else if (location.pathname.startsWith("/course/")) {
			setActiveSection("courses");
		} else {
			setActiveSection("");
		}
	}, [location.pathname, mode]);

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
		const baseClass = "text-sm font-medium transition-all duration-300";
		const isActive = activeSection === section;
		return isActive
			? `${baseClass} text-blue-600 border-b-2 border-blue-600 pb-1`
			: `${baseClass} text-brand-light hover:brightness-110`;
	};

	return (
		<nav
			className="bg-white border-b sticky top-0 z-50"
			style={{ borderColor: "#DCDEDD", padding: "20px" }}
		>
			<div className="max-w-7xl mx-auto flex items-center justify-between">
				<Link to="/">
					<Logo variant="navbar" />
				</Link>

				<div className="hidden md:flex items-center gap-8">
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
							<Link to="/" className={getNavLinkClass("home")}>
								Home
							</Link>
							<Link
								to="/#courses"
								className={getNavLinkClass("courses")}
							>
								Courses
							</Link>
							<Link
								to="/#topics"
								className={getNavLinkClass("topics")}
							>
								Topics
							</Link>
							<Link
								to="/#about"
								className={getNavLinkClass("about")}
							>
								About
							</Link>
							<Link
								to="/#contact"
								className={getNavLinkClass("contact")}
							>
								Contact
							</Link>
						</>
					)}
				</div>

				<div className="flex items-center gap-[10px]">
					{isAuthenticated && user ? (
						<Link
							to={getDashboardUrl(user)}
							className="flex items-center gap-3 hover:bg-gray-50 rounded-[8px] px-3 py-2 transition-all duration-300"
						>
							<img
								src={getAvatarSrc(
									user?.user_profile?.avatar,
									user.name
								)}
								alt={user.name}
								className="w-10 h-10 rounded-full object-cover"
								onError={(e) => {
									const target = e.target as HTMLImageElement;
									target.src = getAvatarSrc(
										undefined,
										user.name
									);
								}}
							/>
							<div className="text-left">
								<div className="text-brand-dark text-sm font-semibold">
									{user.name}
								</div>
								<div className="text-brand-light text-xs">
									{user.email}
								</div>
							</div>
						</Link>
					) : (
						<>
							<Link
								to="/login"
								className="border border-[#DCDEDD] rounded-[8px] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 px-4 py-3 flex items-center gap-2 bg-white"
							>
								<span className="text-brand-dark text-sm font-semibold">
									Login
								</span>
							</Link>
							<Link
								to="/signup"
								className="btn-primary rounded-[8px] border border-[#2151A0] hover:brightness-110 focus:ring-2 focus:ring-[#0C51D9] transition-all duration-300 blue-gradient blue-btn-shadow px-4 py-3 flex items-center gap-2"
							>
								<span className="text-brand-white text-sm font-semibold">
									Sign Up
								</span>
							</Link>
						</>
					)}

					<button className="md:hidden border border-[#DCDEDD] rounded-[8px] hover:border-[#0C51D9] hover:border-2 transition-all duration-300 p-2 bg-white">
						<Menu className="w-5 h-5 text-gray-600" />
					</button>
				</div>
			</div>
		</nav>
	);
}
