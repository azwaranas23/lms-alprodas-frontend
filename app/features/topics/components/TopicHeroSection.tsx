import { ArrowLeft, Code } from "lucide-react";
import { Link } from "react-router";

export function TopicHeroSection() {
  return (
    <section className="py-12 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Topic Info */}
          <div className="text-left">
            <div className="flex items-center gap-3 mb-4">
              <Link to="/#topics" className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back to Topics</span>
              </Link>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark mb-6">
              Web Development
            </h1>
            <p className="text-xl text-brand-light mb-8">
              Master modern web technologies and frameworks. Build responsive websites and dynamic web applications from frontend to backend.
            </p>

            {/* Topic Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-left">
                <div className="text-3xl font-bold text-blue-600 mb-2">120+</div>
                <div className="text-brand-light">Total Courses</div>
              </div>
              <div className="text-left">
                <div className="text-3xl font-bold text-blue-600 mb-2">15k+</div>
                <div className="text-brand-light">Students Enrolled</div>
              </div>
              <div className="text-left">
                <div className="text-3xl font-bold text-blue-600 mb-2">8</div>
                <div className="text-brand-light">Subject Areas</div>
              </div>
            </div>
          </div>

          {/* Right Column - Topic Image */}
          <div className="relative">
            <div className="w-full h-80 lg:h-[400px] relative overflow-hidden rounded-[40px]">
              <img src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6"
                   alt="Web Development"
                   className="w-full h-full object-cover" />
            </div>

            {/* Floating Badge */}
            <div className="absolute -top-4 -right-4 bg-white border border-[#DCDEDD] rounded-[12px] p-4 shadow-lg">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                  <Code className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <div className="text-brand-dark text-sm font-bold">Most Popular</div>
                  <div className="text-brand-light text-xs">Topic</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}