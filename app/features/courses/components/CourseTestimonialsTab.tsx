// app/features/courses/components/CourseTestimonialsTab.tsx
import { Star } from "lucide-react";
import type { Course } from "~/types/courses";
import { getAvatarSrc } from "~/utils/formatters";

interface CourseTestimonialsTabProps {
  course: Course;
}

export function CourseTestimonialsTab({ course }: CourseTestimonialsTabProps) {
  const DUMMY_TESTIMONIALS = [
    {
      id: 1,
      rating: 5,
      review_text:
        "This course completely transformed my understanding of React. The instructor's explanations are crystal clear.",
      student: {
        name: "Sarah Johnson",
        profile: {
          avatar:
            "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=200&h=200&fit=crop&crop=face",
        },
      },
      jobTitle: "Frontend Developer at TechCorp",
    },
  ];

  return (
    <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-8">
      <h2 className="text-2xl font-bold text-brand-dark mb-6">
        Student Testimonials
      </h2>

      <div className="space-y-6">
        {DUMMY_TESTIMONIALS.map((review) => (
          <TestimonialCard key={review.id} review={review} />
        ))}

        {course.reviews &&
          course.reviews.length > 0 &&
          course.reviews.map((review) => (
            <TestimonialCard
              key={`api-${review.id}`}
              review={{
                id: review.id,
                rating: review.rating,
                review_text: review.review_text,
                student: review.student,
                jobTitle: "",
              }}
              date={review.created_at}
            />
          ))}
      </div>
    </div>
  );
}

interface Testimonial {
  id: number | string;
  rating: number;
  review_text: string;
  student: {
    name: string;
    profile?: { avatar?: string | null };
  };
  jobTitle?: string;
}

interface TestimonialCardProps {
  review: Testimonial;
  date?: string;
}

function TestimonialCard({ review, date }: TestimonialCardProps) {
  return (
    <div className="border border-[#DCDEDD] rounded-[16px] p-6">
      <div className="flex items-center gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= review.rating
                ? "text-yellow-400 fill-current"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-semibold text-gray-700">
          {review.rating}.0
        </span>
      </div>
      <p className="text-brand-light text-base leading-relaxed mb-6">
        "{review.review_text}"
      </p>
      <div className="flex items-center gap-3">
        <img
          src={getAvatarSrc(
            review.student.profile?.avatar,
            review.student.name
          )}
          alt={review.student.name}
          onError={(e) => {
            e.currentTarget.src = getAvatarSrc(undefined, review.student.name);
          }}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <div className="text-brand-dark text-base font-semibold">
            {review.student.name}
          </div>
          {review.jobTitle && (
            <div className="text-gray-500 text-sm">{review.jobTitle}</div>
          )}
          {date && (
            <div className="text-gray-400 text-xs">
              {new Date(date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
