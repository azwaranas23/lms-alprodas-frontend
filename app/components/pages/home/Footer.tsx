import {
  GraduationCap,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Send,
} from "lucide-react";
import { Link } from "react-router";

export function Footer() {
  const categories = [
    { name: "Basic Programming", href: "#" },
    { name: "Development", href: "#" },
    { name: "Network & Security", href: "#" },
    { name: "Multimedia", href: "#" },
    { name: "Embedded System", href: "#" },
    { name: "Cloud Computing", href: "#" },
  ];

  const tags = [
    "REACT", "PYTHON", "UI/UX", "JAVA",
    "WEB", "MOBILE", "DESIGN", "CSS",
    "ALGORITHM", "DATA", "C++"
  ];

  const socialLinks = [
    { name: "Twitter", href: "#", icon: Twitter },
    { name: "LinkedIn", href: "#", icon: Linkedin },
    { name: "Instagram", href: "#", icon: Instagram },
    { name: "YouTube", href: "#", icon: Youtube },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Column 1: Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 relative flex items-center justify-center bg-[#0C51D9] rounded-full">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold tracking-wide">
                Alprodas LMS
              </h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Empowering the next generation of developers with world-class courses and expert mentorship. Join us to master the skills of tomorrow.
            </p>
          </div>

          {/* Column 2: Categories */}
          <div>
            <h4 className="text-lg font-bold mb-6 tracking-wider uppercase">Categories</h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
              {categories.map((cat) => (
                <li key={cat.name}>
                  <Link
                    to={cat.href}
                    className="text-gray-400 hover:text-[#0C51D9] transition-colors text-sm"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Tag Cloud */}
          <div>
            <h4 className="text-lg font-bold mb-6 tracking-wider uppercase">Tag Cloud</h4>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag}
                  to="#"
                  className="px-4 py-2 bg-[#2a2a2a] text-xs font-bold text-gray-300 border border-gray-700 rounded-full hover:bg-[#0C51D9] hover:text-white hover:border-[#0C51D9] transition-all uppercase"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 4: Subscribe */}
          <div>
            <h4 className="text-lg font-bold mb-6 tracking-wider uppercase">Subscribe</h4>
            <div className="flex mb-8">
              <input
                type="email"
                placeholder="Enter email address"
                className="rounded-full w-full bg-[#2a2a2a] border border-gray-700 text-white px-4 py-3 rounded-l-lg text-sm focus:outline-none focus:border-[#0C51D9] placeholder:text-gray-500"
              />
              <button className="bg-[#f1c40f] text-gray-900 px-4 py-3 rounded-r-lg hover:bg-yellow-500 transition-colors flex items-center justify-center font-bold">
                <Send size={18} />
              </button>
            </div>

            <h4 className="text-sm font-bold mb-4 tracking-wider uppercase">Follow Us</h4>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.name}
                    to={social.href}
                    className="w-10 h-10 flex items-center justify-center bg-[#2a2a2a] text-gray-400 rounded-full hover:bg-[#0C51D9] hover:text-white transition-all"
                  >
                    <Icon size={18} />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            Copyright ©2025 All rights reserved
          </p>
          <div className="flex gap-6">
            <Link to="#" className="text-gray-500 hover:text-white text-xs uppercase tracking-wide">Terms</Link>
            <Link to="#" className="text-gray-500 hover:text-white text-xs uppercase tracking-wide">Privacy</Link>
            <Link to="#" className="text-gray-500 hover:text-white text-xs uppercase tracking-wide">Compliances</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
