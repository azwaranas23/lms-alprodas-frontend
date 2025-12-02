import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import type { Route } from "./+types/checkout.$id";
import { Navbar } from "~/components/organisms/Navbar";
import { CourseInfoCard } from "~/features/checkout/components/CourseInfoCard";
import { StudentInfoCard } from "~/features/checkout/components/StudentInfoCard";
import { PaymentDetailsCard } from "~/features/checkout/components/PaymentDetailsCard";
import { LoadingSpinner } from "~/components/atoms/LoadingSpinner";
import { Button } from "~/components/atoms/Button";
import { coursesService } from "~/services/courses.service";
import { authService } from "~/services/auth.service";
import { transactionsService } from "~/services/transactions.service";
import { formatCurrency, getAvatarSrc } from "~/utils/formatters";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Checkout - LMS Alprodas" },
    {
      name: "description",
      content: "Complete your course purchase and start learning today",
    },
  ];
}

interface CheckoutData {
  student: {
    name: string;
    email: string;
    avatar: string;
    phone: string;
    location: string;
  };
  course: {
    title: string;
    category: string;
    thumbnail: string;
    lessons: string;
    instructor: string;
    level: string;
  };
  payment: {
    subTotal: string;
    taxAmount: string;
    grandTotal: string;
  };
}

export default function CheckoutPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get logged-in user data
  const loggedInUser = authService.getUser();

  // Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      // Check authentication first
      if (!loggedInUser) {
        navigate("/login", { replace: true });
        return;
      }

      if (!id) {
        setError("Course ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await coursesService.getCourseDetail(Number(id));
        const courseData = response.data;

        // Check if user is already enrolled
        if (courseData.is_enrolled) {
          // Immediately redirect without showing error
          navigate(`/student/course-progress/${id}`, { replace: true });
          return;
        }

        setCourse(courseData);

        const subTotal = courseData.price;
        const taxAmount = Math.round(subTotal * 0.11);
        const grandTotal = subTotal + taxAmount;

        const checkoutData: CheckoutData = {
          student: {
            name: loggedInUser?.name || "Student",
            email: loggedInUser?.email || "student@email.com",
            avatar: getAvatarSrc(
              loggedInUser?.avatar || loggedInUser?.user_profile?.avatar,
              loggedInUser?.name
            ),
            phone: loggedInUser?.phone || "-",
            location: "Indonesia",
          },
          course: {
            title: courseData.title,
            category: courseData.subject?.topic?.name || "Course",
            thumbnail: courseData.images?.[0]?.image_path || "",
            lessons: `${courseData.total_lessons} lessons`,
            instructor: courseData.mentor?.name || "Instructor",
            level: "Intermediate",
          },
          payment: {
            subTotal: formatCurrency(subTotal),
            taxAmount: formatCurrency(taxAmount),
            grandTotal: formatCurrency(grandTotal),
          },
        };

        setCheckoutData(checkoutData);
      } catch (err) {
        console.error("Failed to fetch course:", err);
        setError("Failed to load course data");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, navigate]);

  const handlePayNow = async () => {
    if (!checkoutData || !id) return;

    setIsProcessing(true);

    try {
      // Call transactions/checkout API
      const checkoutResponse = await transactionsService.checkout({
        course_id: Number(id),
      });

      // Handle payment gateway redirect
      if (checkoutResponse.data.redirect_url) {
        // Redirect to Midtrans payment page
        window.location.href = checkoutResponse.data.redirect_url;
      } else {
        // Fallback: redirect to payment success page
        navigate(`/payment-success/${id}`);
      }
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
      setIsProcessing(false);
    }
  };

  // Show nothing while checking auth and enrollment
  if (loading || !loggedInUser) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <LoadingSpinner text="Loading checkout..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  if (!checkoutData || !course) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <LoadingSpinner text="Loading checkout..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <Navbar />

      {/* Checkout Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="mb-4">
            <h1 className="text-3xl font-extrabold text-brand-dark">
              Checkout
            </h1>
            <p className="text-brand-light text-lg">
              Complete your course purchase
            </p>
          </div>
        </div>

        {/* Checkout Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Course Information */}
          <div className="space-y-6">
            <CourseInfoCard courseData={checkoutData.course} />
          </div>

          {/* Right Column - Student Info & Payment */}
          <div className="space-y-6">
            <StudentInfoCard studentData={checkoutData.student} />
            <PaymentDetailsCard
              paymentData={checkoutData.payment}
              onPayNow={handlePayNow}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
