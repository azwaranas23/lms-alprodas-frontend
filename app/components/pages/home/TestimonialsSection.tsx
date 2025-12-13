import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, PlayCircle, GraduationCap } from "lucide-react";
import { Button } from "~/components/atoms/Button";
import { TestimonialCard, type Testimonial } from "~/components/organisms/TestimonialCard";

const testimonials: Testimonial[] = [
  {
    id: 1,
    content: "The React course completely changed my career trajectory. Within 3 months of completion, I landed my dream job as a frontend developer at a tech startup.",
    author: {
      name: "Sarah Johnson",
      title: "Frontend Developer at TechFlow",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b3bb"
    }
  },
  {
    id: 2,
    content: "The instructors are world-class and the curriculum is extremely practical. I've built 5 real projects that I now showcase in my portfolio.",
    author: {
      name: "Michael Chen",
      title: "Full Stack Developer at InnovateLab",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
    }
  },
  {
    id: 3,
    content: "As a career changer, I was nervous about learning to code. The supportive community and structured approach made the journey enjoyable and successful.",
    author: {
      name: "Emma Rodriguez",
      title: "Software Engineer at DataVision",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
    }
  },
  {
    id: 4,
    content: "The Python data science course opened up incredible opportunities. I now work as a data analyst at a Fortune 500 company and love what I do.",
    author: {
      name: "David Park",
      title: "Data Analyst at GlobalTech",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2"
    }
  },
  {
    id: 5,
    content: "The mobile app design course taught me everything from wireframing to prototyping. I'm now freelancing successfully and building apps for small businesses.",
    author: {
      name: "Lisa Wang",
      title: "Freelance UX Designer",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956"
    }
  },
  {
    id: 6,
    content: "The JavaScript course was incredibly comprehensive. From basics to advanced concepts, every lesson was clearly explained with practical examples.",
    author: {
      name: "Alex Thompson",
      title: "Web Developer at StartupHub",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
    }
  }
];


interface TestimonialsSectionProps {
  onSmoothScroll: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}

export function TestimonialsSection({ onSmoothScroll }: TestimonialsSectionProps) {
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Calculate card width including margin (320px + 24px = 344px)
  const cardWidth = 344;
  const visibleCards = 3;

  // Create extended testimonials array for infinite scroll
  const extendedTestimonials = [
    ...testimonials.slice(-visibleCards), // Clone last items at start
    ...testimonials,
    ...testimonials.slice(0, visibleCards), // Clone first items at end
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Handle infinite scroll reset
    if (currentTestimonialIndex === testimonials.length) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentTestimonialIndex(0);
        setTimeout(() => setIsTransitioning(true), 50);
      }, 500);
    } else if (currentTestimonialIndex === -1) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentTestimonialIndex(testimonials.length - 1);
        setTimeout(() => setIsTransitioning(true), 50);
      }, 500);
    }
  }, [currentTestimonialIndex, testimonials.length]);

  const moveTestimonialsCarousel = (direction: 'next' | 'prev') => {
    setCurrentTestimonialIndex((prev) => {
      if (direction === 'next') {
        return prev + 1;
      } else {
        return prev - 1;
      }
    });
  };

  return (
    <section className="py-20 bg-white">
      {/* Centered Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center">
          <h2 className="text-brand-dark text-4xl font-extrabold mb-4">What Our Students Say</h2>
          <p className="text-brand-light text-lg font-normal max-w-2xl mx-auto">
            Join thousands of successful learners who transformed their careers with our expert-led courses.
          </p>
        </div>
      </div>

      {/* Full Width Carousel */}
      <div className="relative">
        {/* Navigation Button Left */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={() => moveTestimonialsCarousel('prev')}
            className="w-12 h-12 rounded-[20px] p-0"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </div>

        {/* Carousel Container */}
        <div className="overflow-hidden">
          <div
            className={`flex ${isTransitioning ? 'transition-transform duration-500 ease-in-out' : ''}`}
            style={{ transform: `translateX(-${(currentTestimonialIndex + visibleCards) * cardWidth}px)` }}>
            {extendedTestimonials.map((testimonial, index) => (
              <TestimonialCard key={`${testimonial.id}-${index}`} testimonial={testimonial} />
            ))}
          </div>
        </div>

        {/* Navigation Button Right */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={() => moveTestimonialsCarousel('next')}
            className="w-12 h-12 rounded-[20px] p-0"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
      </div>

    </section>
  );
}