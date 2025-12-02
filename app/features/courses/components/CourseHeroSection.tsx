import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, Play, X } from "lucide-react";
import { Link } from "react-router";
import { coursesService } from "~/services/courses.service";
import type { Course } from "~/types/courses";
import { Image } from "~/components/atoms/Image";

interface CourseHeroSectionProps {
  courseId: number;
}

export function CourseHeroSection({ courseId }: CourseHeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch course detail for breadcrumb and images
  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        setLoading(true);
        const response = await coursesService.getCourseDetail(courseId);
        setCourse(response.data);
      } catch (error) {
        console.error("Failed to fetch course detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetail();
  }, [courseId]);

  const courseImages = course?.images?.map(img => img.image_path) || [];

  const totalSlides = courseImages.length;

  // Auto-play carousel exactly like HTML version
  useEffect(() => {
    if (totalSlides <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  const nextSlide = () => {
    if (totalSlides <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    if (totalSlides <= 1) return;
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const openVideoModal = () => {
    setShowVideoModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeVideoModal = () => {
    setShowVideoModal(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <>
      <section className="bg-white">
        {/* Breadcrumb Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="flex items-center gap-2 mb-6">
            <Link to="/" className="text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium">Home</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            {course && (
              <>
                {course.subject && (
                  <>
                    <Link to={`/subject/${course.subject.id}`} className="text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium">
                      {course.subject.name}
                    </Link>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </>
                )}
                {!course.subject && (
                  <>
                    <span className="text-blue-600 text-sm font-medium">General Course</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </>
                )}
                <span className="text-gray-600 text-sm font-medium">{course.title}</span>
              </>
            )}
            {loading && (
              <>
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
              </>
            )}
          </div>
        </div>

        {/* Full Width Hero Image Carousel */}
        <div className="w-full">
          <div className="relative mb-8">
            {/* Navigation Button Left */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm border border-[#DCDEDD] rounded-[20px] flex items-center justify-center hover:bg-white hover:border-[#0C51D9] hover:border-2 transition-all duration-300 shadow-lg"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>

            {/* Carousel Container */}
            <div className="overflow-hidden">
              <div
                className="flex gap-4 transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * (768 + 16)}px)` }}
              >
                {courseImages.map((image, index) => (
                  <div key={index} className="flex-shrink-0 w-[768px] h-[512px] relative">
                    <Image
                      src={image}
                      alt={`Course Screenshot ${index + 1}`}
                      className="w-full h-full object-cover rounded-[20px]"
                      imageType="course"
                      identifier={courseId.toString()}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Button Right */}
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm border border-[#DCDEDD] rounded-[20px] flex items-center justify-center hover:bg-white hover:border-[#0C51D9] hover:border-2 transition-all duration-300 shadow-lg"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>

            {/* Carousel Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {courseImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-white"
                      : "bg-white/50 hover:bg-white/75"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {showVideoModal && (
        <div
          className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={closeVideoModal}
        >
          <div
            className="bg-white rounded-[20px] border border-[#DCDEDD] w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-[#DCDEDD]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-[12px] flex items-center justify-center">
                    <Play className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-brand-dark text-xl font-bold">Course Preview</h3>
                    <p className="text-brand-light text-sm font-normal">{course?.title || "Course"} Introduction</p>
                  </div>
                </div>
                <button
                  onClick={closeVideoModal}
                  className="w-10 h-10 rounded-full border border-[#DCDEDD] flex items-center justify-center hover:border-[#0C51D9] hover:border-2 transition-all duration-200"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
            {/* Modal Content */}
            <div className="p-6">
              <div className="aspect-video w-full">
                <iframe
                  src="https://www.youtube.com/embed/OArJje5zmOw?autoplay=1"
                  className="w-full h-full rounded-[12px]"
                  frameBorder="0"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}