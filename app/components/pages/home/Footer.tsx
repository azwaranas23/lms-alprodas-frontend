import {
  GraduationCap,
  Mail,
  Users,
  Book,
  Award,
  TrendingUp,
  Component,
  Code,
  Palette,
  BarChart3,
  Smartphone,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
} from "lucide-react";
import { Button } from "~/components/atoms/Button";
import { Input } from "~/components/atoms/Input";

interface SocialLink {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  bgColor: string;
  hoverBgColor: string;
}

const socialLinks: SocialLink[] = [
  {
    name: "Twitter",
    href: "#",
    icon: Twitter,
    bgColor: "bg-blue-600/20",
    hoverBgColor: "group-hover:bg-blue-600/40",
  },
  {
    name: "LinkedIn",
    href: "#",
    icon: Linkedin,
    bgColor: "bg-blue-700/20",
    hoverBgColor: "group-hover:bg-blue-700/40",
  },
  {
    name: "Instagram",
    href: "#",
    icon: Instagram,
    bgColor: "bg-pink-600/20",
    hoverBgColor: "group-hover:bg-pink-600/40",
  },
  {
    name: "YouTube",
    href: "#",
    icon: Youtube,
    bgColor: "bg-red-600/20",
    hoverBgColor: "group-hover:bg-red-600/40",
  },
];

interface TrendingCourse {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  iconColor: string;
}

const trendingCourses: TrendingCourse[] = [
  {
    name: "React Development",
    href: "#",
    icon: Component,
    iconColor: "text-blue-400",
  },
  {
    name: "Python Programming",
    href: "#",
    icon: Code,
    iconColor: "text-green-400",
  },
  {
    name: "UI/UX Design",
    href: "#",
    icon: Palette,
    iconColor: "text-purple-400",
  },
  {
    name: "Data Science",
    href: "#",
    icon: BarChart3,
    iconColor: "text-orange-400",
  },
  {
    name: "Mobile Development",
    href: "#",
    icon: Smartphone,
    iconColor: "text-pink-400",
  },
];

const companyLinks = [
  { name: "About Us", href: "#" },
  { name: "Our Team", href: "#" },
  { name: "Careers", href: "#" },
  { name: "Press", href: "#" },
  { name: "Blog", href: "#" },
];

const supportLinks = [
  { name: "Help Center", href: "#" },
  { name: "Contact Us", href: "#" },
  { name: "Privacy Policy", href: "#" },
  { name: "Terms of Service", href: "#" },
  { name: "Cookie Policy", href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="bg-gray-800/50 rounded-2xl p-8 mb-12 backdrop-blur-sm border border-gray-700/50">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-brand-white mb-3">
              Stay Updated with LMS Alprodas
            </h3>
            <p className="text-gray-300 text-base mb-6">
              Get the latest courses, tips, and exclusive content delivered to
              your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400"
              />
              <Button variant="primary" className="px-6 py-3 rounded-xl">
                <Mail className="w-4 h-4" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 relative flex items-center justify-center">
                <div className="w-12 h-12 absolute bg-gradient-to-br from-primary-500 to-primary-600 rounded-full"></div>
                <GraduationCap className="w-6 h-6 text-white relative z-10" />
              </div>
              <h3 className="text-xl font-bold text-brand-white">
                LMS Alprodas
              </h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Empowering the next generation of developers with world-class
              courses and expert mentorship.
            </p>

            {/* Community Stats */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-primary-500" />
                <span className="text-white font-semibold">10,000+</span>
                <span className="text-gray-400">Students</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Book className="w-4 h-4 text-primary-500" />
                <span className="text-white font-semibold">500+</span>
                <span className="text-gray-400">Courses</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Award className="w-4 h-4 text-primary-500" />
                <span className="text-white font-semibold">50+</span>
                <span className="text-gray-400">Expert Mentors</span>
              </div>
            </div>
          </div>

          {/* Featured Courses */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-brand-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-500" />
              Trending Courses
            </h4>
            <ul className="space-y-3">
              {trendingCourses.map((course) => {
                const IconComponent = course.icon;
                return (
                  <li key={course.name} className="flex items-center gap-3">
                    <IconComponent className={`w-4 h-4 ${course.iconColor}`} />
                    <a
                      href={course.href}
                      className="text-gray-300 hover:text-white transition-colors text-sm"
                    >
                      {course.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-brand-white">Company</h4>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-brand-white">Support</h4>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect & Social */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-brand-white">
              Connect With Us
            </h4>
            <div className="space-y-3">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors text-sm group"
                  >
                    <div
                      className={`w-8 h-8 rounded-full ${social.bgColor} flex items-center justify-center ${social.hoverBgColor} transition-colors`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    {social.name}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 LMS Alprodas. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
