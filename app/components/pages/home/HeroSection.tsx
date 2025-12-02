import { TrendingUp, Award } from "lucide-react";
import { Button } from "~/components/atoms/Button";
import { Card } from "~/components/molecules/Card";

interface HeroSectionProps {
  onSmoothScroll: (e: React.MouseEvent<HTMLElement>, href: string) => void;
}

export function HeroSection({ onSmoothScroll }: HeroSectionProps) {
  return (
    <section id="home" className="bg-gradient-to-br from-blue-50 to-purple-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold text-brand-dark mb-6">
              Grow Your Skills<br />
              <span className="text-blue-600">Build Your Career</span>
            </h1>
            <p className="text-xl text-brand-light mb-8">
              Join thousands of students learning from industry experts dolor pesan dummy buatan angga founder buildwithangga.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button
                variant="primary"
                onClick={(e) => onSmoothScroll(e, '#courses')}
                className="rounded-[12px] px-8 py-4 text-lg font-semibold"
              >
                Start Learning Today
              </Button>
              <Button
                variant="outline"
                onClick={(e) => onSmoothScroll(e, '#topics')}
                className="rounded-[12px] px-8 py-4 text-lg font-semibold"
              >
                Browse Topics
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-left">
                <div className="text-3xl font-bold text-blue-600 mb-2">10k+</div>
                <div className="text-brand-light">Active Students</div>
              </div>
              <div className="text-left">
                <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-brand-light">Expert Instructors</div>
              </div>
              <div className="text-left">
                <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
                <div className="text-brand-light">Premium Courses</div>
              </div>
            </div>
          </div>

          {/* Right Column - Image with Overlapped Success Card */}
          <div className="relative">
            {/* Main Hero Image */}
            <div className="w-full h-80 lg:h-[450px] relative overflow-hidden rounded-[20px]">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
                   alt="Students collaborating and learning together"
                   className="w-full h-full object-cover" />
            </div>

            {/* Overlapped Success Card */}
            <div className="absolute -bottom-6 -left-6 shadow-lg">
              <Card hover className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-50 rounded-[16px] flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-brand-dark text-lg font-bold">98% Success Rate</div>
                  <div className="text-brand-light text-sm font-medium">Course Completion</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-brand-dark font-medium">Career Growth</span>
                  <span className="text-brand-dark font-extrabold">95%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '95%'}}></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-brand-dark font-medium">Skill Improvement</span>
                  <span className="text-brand-dark font-extrabold">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '92%'}}></div>
                </div>
              </div>
              </Card>
            </div>

            {/* Achievement Badge */}
            <div className="absolute -top-4 -right-4 shadow-lg">
              <Card className="p-4 rounded-[12px]">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center mb-3">
                  <Award className="w-8 h-8 text-yellow-500" />
                </div>
                <div>
                  <div className="text-brand-dark text-sm font-bold">Top Rated</div>
                  <div className="text-brand-light text-xs">Platform</div>
                </div>
              </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}