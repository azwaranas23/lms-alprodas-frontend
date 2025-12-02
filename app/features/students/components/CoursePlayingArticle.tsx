import { useState, useEffect } from "react";
import {
  GraduationCap,
  ChevronDown,
  Check,
  BookOpen,
  Lock,
  ArrowLeft,
  Bookmark,
  Share2,
  Printer,
  ChevronLeft,
  ChevronRight,
  Copy,
  FileText,
  Download,
  Code,
} from "lucide-react";

export default function CoursePlayingArticle() {
  const [openSections, setOpenSections] = useState<number[]>([1]); // First section open by default

  const toggleAccordion = (sectionId: number) => {
    setOpenSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const copyCode = (button: HTMLButtonElement) => {
    const codeBlock = button.closest(".bg-gray-900")?.querySelector("code");
    if (codeBlock) {
      const text = codeBlock.textContent || "";

      navigator.clipboard.writeText(text).then(() => {
        const originalIcon = button.innerHTML;
        button.innerHTML =
          '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>';
        button.classList.add("text-green-400");

        setTimeout(() => {
          button.innerHTML = originalIcon;
          button.classList.remove("text-green-400");
        }, 2000);
      });
    }
  };

  useEffect(() => {
    // Auto-expand first section on load
    setOpenSections([1]);
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <div className="flex h-screen">
        {/* Course Navigation Sidebar */}
        <aside className="w-80 bg-white border-r border-[#DCDEDD] flex flex-col">
          {/* Logo Section */}
          <div className="px-6 py-4 border-b border-[#DCDEDD]">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 relative flex items-center justify-center">
                {/* Background circle */}
                <div className="w-14 h-14 absolute bg-gradient-to-br from-primary-100 to-primary-200 rounded-full"></div>
                {/* Overlapping smaller circle */}
                <div className="w-10 h-10 absolute bg-gradient-to-br from-primary-500 to-primary-600 rounded-full opacity-90"></div>
                {/* Lucide icon */}
                <GraduationCap className="w-5 h-5 text-white relative z-10" />
              </div>
              <div>
                <h1 className="text-brand-dark text-lg font-bold">
                  LMS Alprodas
                </h1>
                <p className="text-brand-dark text-xs font-normal">
                  Student Dashboard
                </p>
              </div>
            </div>
          </div>

          {/* Course Sections Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-4">
            <div className="space-y-3">
              {/* Section 1: Getting Started */}
              <div className="accordion-section">
                <button
                  className="accordion-header w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => toggleAccordion(1)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
                        1
                      </div>
                      <span className="font-medium text-gray-900">
                        Getting Started
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform ${
                        openSections.includes(1) ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>
                <div
                  className={`accordion-content mt-2 ml-9 space-y-2 ${openSections.includes(1) ? "" : "hidden"}`}
                >
                  <div className="lesson-item completed flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 min-w-[12px] min-h-[12px] text-white" />
                    </div>
                    <span className="text-sm text-gray-700 truncate">
                      Introduction to React
                    </span>
                    <span className="text-xs text-gray-400 ml-auto">8:32</span>
                  </div>
                  <div className="lesson-item completed flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 min-w-[12px] min-h-[12px] text-white" />
                    </div>
                    <span className="text-sm text-gray-700 truncate">
                      Setting up Deve
                    </span>
                    <span className="text-xs text-gray-400 ml-auto">12:45</span>
                  </div>
                  <div className="lesson-item active flex items-center gap-3 p-2 rounded-md bg-blue-50 border border-blue-200">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <BookOpen className="w-3 h-3 min-w-[12px] min-h-[12px] text-white" />
                    </div>
                    <span className="text-sm font-medium text-blue-900 truncate">
                      Understandin...
                    </span>
                    <span className="text-xs text-blue-600 ml-auto">15:20</span>
                  </div>
                </div>
              </div>

              {/* Section 2: Core Concepts */}
              <div className="accordion-section">
                <button
                  className="accordion-header w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => toggleAccordion(2)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
                        2
                      </div>
                      <span className="font-medium text-gray-900">
                        Core Concepts
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform ${
                        openSections.includes(2) ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>
                <div
                  className={`accordion-content mt-2 ml-9 space-y-2 ${openSections.includes(2) ? "" : "hidden"}`}
                >
                  <div className="lesson-item flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                    <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center">
                      <Lock className="w-3 h-3 min-w-[12px] min-h-[12px] text-gray-500" />
                    </div>
                    <span className="text-sm text-gray-500 truncate">
                      JSX and Virtual DOM
                    </span>
                    <span className="text-xs text-gray-400 ml-auto">18:45</span>
                  </div>
                  <div className="lesson-item flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                    <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center">
                      <Lock className="w-3 h-3 min-w-[12px] min-h-[12px] text-gray-500" />
                    </div>
                    <span className="text-sm text-gray-500 truncate">
                      Props and State
                    </span>
                    <span className="text-xs text-gray-400 ml-auto">22:15</span>
                  </div>
                  <div className="lesson-item flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                    <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center">
                      <Lock className="w-3 h-3 min-w-[12px] min-h-[12px] text-gray-500" />
                    </div>
                    <span className="text-sm text-gray-500 truncate">
                      Event Handling
                    </span>
                    <span className="text-xs text-gray-400 ml-auto">16:30</span>
                  </div>
                </div>
              </div>

              {/* Section 3: State Management */}
              <div className="accordion-section">
                <button
                  className="accordion-header w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => toggleAccordion(3)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
                        3
                      </div>
                      <span className="font-medium text-gray-900">
                        State Management
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform ${
                        openSections.includes(3) ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>
                <div
                  className={`accordion-content mt-2 ml-9 space-y-2 ${openSections.includes(3) ? "" : "hidden"}`}
                >
                  <div className="lesson-item flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                    <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center">
                      <Lock className="w-3 h-3 min-w-[12px] min-h-[12px] text-gray-500" />
                    </div>
                    <span className="text-sm text-gray-500 truncate">
                      useState Hook
                    </span>
                    <span className="text-xs text-gray-400 ml-auto">20:10</span>
                  </div>
                  <div className="lesson-item flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                    <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center">
                      <Lock className="w-3 h-3 min-w-[12px] min-h-[12px] text-gray-500" />
                    </div>
                    <span className="text-sm text-gray-500 truncate">
                      useEffect Hook
                    </span>
                    <span className="text-xs text-gray-400 ml-auto">25:30</span>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Navbar */}
          <header className="page-header bg-white border-b border-[#DCDEDD] px-5 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => window.history.back()}
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h2 className="text-brand-dark text-2xl font-extrabold">
                    Understanding React Components
                  </h2>
                  <p className="text-brand-light text-sm font-normal mt-1">
                    Section 1: Getting Started • Article 3 of 3
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <button className="w-10 h-10 rounded-full border border-[#DCDEDD] flex items-center justify-center hover:border-[#0C51D9] hover:border-2 transition-all duration-200">
                    <Bookmark className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="w-10 h-10 rounded-full border border-[#DCDEDD] flex items-center justify-center hover:border-[#0C51D9] hover:border-2 transition-all duration-200">
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="w-10 h-10 rounded-full border border-[#DCDEDD] flex items-center justify-center hover:border-[#0C51D9] hover:border-2 transition-all duration-200">
                    <Printer className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Divider */}
                <div className="w-px h-8 bg-[#DCDEDD] mx-5"></div>

                {/* User Profile */}
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
                    alt="User Avatar"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="text-left">
                    <p className="text-brand-dark text-base font-semibold">
                      Sarah Johnson
                    </p>
                    <p className="text-brand-dark text-base font-normal leading-7">
                      Student
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </header>

          {/* Article Content */}
          <main className="main-content flex-1 overflow-auto p-5">
            {/* Article Section */}
            <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-8 mb-6">
              {/* Article Content */}
              <div className="prose max-w-none">
                <h1 className="text-3xl font-bold text-brand-dark mb-6">
                  Understanding React Components
                </h1>

                <p className="text-gray-700 leading-relaxed mb-8">
                  In this comprehensive guide, you'll learn everything you need
                  to know about React components, from the basic concepts to
                  advanced patterns. By the end of this article, you'll have a
                  solid understanding of how to create, organize, and use
                  components effectively in your React projects.
                </p>

                {/* Section 1: What are Components? */}
                <h2 className="text-2xl font-bold text-brand-dark mb-4 mt-8">
                  What are React Components?
                </h2>

                <p className="text-gray-700 leading-relaxed mb-6">
                  A React component is a JavaScript function or class that
                  returns JSX (JavaScript XML) to describe what should appear on
                  the screen. Components let you split the UI into independent,
                  reusable pieces, and think about each piece in isolation. A
                  React component is a JavaScript function or class that returns
                  JSX (JavaScript XML) to describe what should appear on the
                  screen. Components let you split the UI into independent,
                  reusable pieces, and think about each piece in isolation. A
                  React component is a JavaScript function or class that returns
                  JSX (JavaScript XML) to describe what should appear on the
                  screen. Components let you split the UI into independent,
                  reusable pieces, and think about each piece in isolation.
                </p>

                {/* Component Hierarchy Image */}
                <div className="my-8">
                  <img
                    src="https://images.unsplash.com/photo-1555066931-4365d14bab8c"
                    alt="Component Hierarchy Diagram"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Component hierarchy in a typical React application
                  </p>
                </div>

                {/* Code Example */}
                <div className="bg-gray-900 rounded-lg p-6 mb-6 overflow-x-auto">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-400 text-sm">JavaScript</span>
                    <button
                      className="text-gray-400 hover:text-white transition-colors"
                      onClick={(e) => copyCode(e.currentTarget)}
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <pre className="text-green-400">
                    <code>{`function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}

// Usage
<Welcome name="Sarah" />`}</code>
                  </pre>
                </div>

                <p className="text-gray-700 leading-relaxed mb-6">
                  This simple example shows a functional component called{" "}
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                    Welcome
                  </code>{" "}
                  that accepts a{" "}
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                    props
                  </code>{" "}
                  parameter and returns a JSX element.
                </p>

                {/* Section 2: Types of Components */}
                <h2 className="text-2xl font-bold text-brand-dark mb-4 mt-8">
                  Types of React Components
                </h2>

                <p className="text-gray-700 leading-relaxed mb-6">
                  React supports two primary ways to define components: function
                  components and class components. While class components were
                  the traditional approach, function components with hooks are
                  now the preferred method for new development.
                </p>

                {/* Comparison Image */}
                <div className="my-8">
                  <img
                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
                    alt="Function vs Class Components"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Modern function components vs traditional class components
                  </p>
                </div>

                {/* Function Component Example */}
                <h3 className="text-xl font-semibold text-brand-dark mb-3">
                  Function Components
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Function components are the simplest way to define a
                  component. They're just JavaScript functions that take props
                  as arguments and return JSX.
                </p>

                <div className="bg-gray-900 rounded-lg p-6 mb-6 overflow-x-auto">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-400 text-sm">JavaScript</span>
                    <button
                      className="text-gray-400 hover:text-white transition-colors"
                      onClick={(e) => copyCode(e.currentTarget)}
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <pre className="text-green-400">
                    <code>{`function UserCard({ name, email, avatar }) {
  return (
    <div className="user-card">
      <img src={avatar} alt={name} />
      <h3>{name}</h3>
      <p>{email}</p>
    </div>
  );
}`}</code>
                  </pre>
                </div>

                {/* Section 3: Component Props */}
                <h2 className="text-2xl font-bold text-brand-dark mb-4 mt-8">
                  Understanding Props
                </h2>

                <p className="text-gray-700 leading-relaxed mb-6">
                  Props (short for properties) are how you pass data from parent
                  components to child components. They're read-only and help
                  make components reusable by allowing them to receive different
                  data.
                </p>

                {/* Props Flow Image */}
                <div className="my-8">
                  <img
                    src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31"
                    alt="Data Flow in React"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Unidirectional data flow through props in React
                  </p>
                </div>

                {/* Complex Props Example */}
                <div className="bg-gray-900 rounded-lg p-6 mb-6 overflow-x-auto">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-400 text-sm">JavaScript</span>
                    <button
                      className="text-gray-400 hover:text-white transition-colors"
                      onClick={(e) => copyCode(e.currentTarget)}
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <pre className="text-green-400">
                    <code>{`function ProductCard({ product, onAddToCart, isInCart }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="price">\${product.price}</p>
      <button
        onClick={() => onAddToCart(product)}
        disabled={isInCart}
      >
        {isInCart ? 'In Cart' : 'Add to Cart'}
      </button>
    </div>
  );
}`}</code>
                  </pre>
                </div>

                {/* Section 4: Best Practices */}
                <h2 className="text-2xl font-bold text-brand-dark mb-4 mt-8">
                  Component Best Practices
                </h2>

                <p className="text-gray-700 leading-relaxed mb-6">
                  Following best practices when creating components will make
                  your code more maintainable, reusable, and easier to debug.
                  Here are some key principles to keep in mind.
                </p>

                {/* Best Practices Image */}
                <div className="my-8">
                  <img
                    src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40"
                    alt="Code Quality and Best Practices"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Clean, maintainable code follows established patterns and
                    principles
                  </p>
                </div>

                {/* Best Practices List */}
                <ul className="list-disc list-inside text-gray-700 space-y-3 mb-6 ml-4">
                  <li>
                    <strong>Keep components small and focused:</strong> Each
                    component should have a single responsibility.
                  </li>
                  <li>
                    <strong>Use descriptive names:</strong> Component names
                    should clearly indicate what they do.
                  </li>
                  <li>
                    <strong>Extract reusable logic:</strong> Use custom hooks
                    for shared stateful logic.
                  </li>
                  <li>
                    <strong>Validate props:</strong> Use PropTypes or TypeScript
                    for better development experience.
                  </li>
                  <li>
                    <strong>Avoid deep nesting:</strong> Keep component
                    hierarchies shallow when possible.
                  </li>
                </ul>

                {/* Next Steps */}
                <h2 className="text-2xl font-bold text-brand-dark mb-4">
                  Next Steps
                </h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Now that you understand the basics of React components, you're
                  ready to dive deeper into more advanced concepts like state
                  management, lifecycle methods, and component composition
                  patterns. In the next lesson, we'll explore JSX and the
                  Virtual DOM in detail.
                </p>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-8 border-t border-gray-200">
                  <button className="bg-white border border-[#DCDEDD] text-brand-dark py-3 px-6 rounded-[8px] font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <ChevronLeft className="w-4 h-4" />
                    <span className="text-sm font-semibold">Previous</span>
                  </button>
                  <button className="btn-primary rounded-[8px] border border-[#2151A0] hover:brightness-110 focus:ring-2 focus:ring-[#0C51D9] transition-all duration-300 blue-gradient blue-btn-shadow px-6 py-3 flex items-center gap-2">
                    <span className="text-brand-white text-sm font-semibold">
                      Next Lesson
                    </span>
                    <ChevronRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Resources & Downloads */}
            <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
              <h4 className="text-lg font-bold text-brand-dark mb-4">
                Resources & Downloads
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-[#DCDEDD] rounded-lg p-4 hover:border-[#0C51D9] hover:border-2 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900">
                        Article PDF
                      </h5>
                      <p className="text-sm text-gray-600">
                        Download this article for offline reading
                      </p>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Download className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
                <div className="border border-[#DCDEDD] rounded-lg p-4 hover:border-[#0C51D9] hover:border-2 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                      <Code className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900">
                        Code Examples
                      </h5>
                      <p className="text-sm text-gray-600">
                        Complete code examples from this article
                      </p>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Download className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
