import { useLocation, Link, useSearchParams, useNavigate } from "react-router";
import { useEffect, useState, useRef } from "react";
import type { Route } from "./+types/verify-email";
import { Mail, ArrowLeft } from "lucide-react";
import { Navbar } from "~/components/organisms/Navbar";
import { StatusIcon } from "~/components/atoms/StatusIcon";
import { Button } from "~/components/atoms/Button";
import { authService } from "~/services/auth.service";
import { getTempNavData, clearTempNavData } from "~/utils/secureNavigation";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Verify Email - LMS Alprodas" },
    {
      name: "description",
      content:
        "Verify your email address to activate your LMS Alprodas account",
    },
  ];
}

interface LocationState {
  email?: string;
  name?: string;
  message?: string;
}

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "error" | "initial"
  >("initial");
  const [verificationMessage, setVerificationMessage] = useState<string>("");
  const [userData, setUserData] = useState<{
    email: string;
    name: string;
    message: string;
  } | null>(null);
  const hasProcessedData = useRef(false);

  const token = searchParams.get("token");

  // Get data from secure storage on component mount
  useEffect(() => {
    // Prevent processing data multiple times
    if (hasProcessedData.current) {
      return;
    }

    const tempData = getTempNavData();

    if (tempData) {
      // User came from registration
      setUserData({
        email: tempData.email || "your registered email address",
        name: tempData.name || "there",
        message: tempData.message || "Your registration was successful!",
      });
      // Clear the temp data after successfully using it
      clearTempNavData();
      hasProcessedData.current = true;
    } else if (token) {
      // User came from email verification link
      setUserData({
        email: "your email address",
        name: "there",
        message: "Please complete your email verification.",
      });
      hasProcessedData.current = true;
    } else {
      // No data and no token = direct access, redirect to login
      navigate("/login", { replace: true });
      return;
    }
  }, [token, navigate]);

  // Handle token verification
  useEffect(() => {
    if (token) {
      const verifyToken = async () => {
        try {
          setVerificationStatus("loading");
          const response = await authService.verifyEmail(token);
          setVerificationStatus("success");
          setVerificationMessage(
            response.message || "Email verified successfully!"
          );

          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } catch (error: unknown) {
          const axiosError = error as {
            response?: { data?: { message?: string } };
          };
          setVerificationStatus("error");
          setVerificationMessage(
            axiosError.response?.data?.message ||
              "Email verification failed. Please try again."
          );
        }
      };

      verifyToken();
    }
  }, [token, navigate]);

  // If there's a token, show verification status
  if (token) {
    return (
      <div className="min-h-screen bg-[#F9F9F9]">
        <Navbar />

        <div className="flex" style={{ minHeight: "calc(100vh - 80px)" }}>
          {/* Left side - Image */}
          <div className="hidden lg:flex lg:w-1/2 relative">
            <img
              src="https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Email verification"
              className="object-cover w-full h-full"
            />
          </div>

          {/* Right side - Content */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
              <div className="bg-white rounded-[20px] border border-[#DCDEDD] p-8 text-center">
                {verificationStatus === "loading" && (
                  <>
                    <StatusIcon status="loading" />
                    <h1 className="text-2xl font-bold text-brand-dark mb-4">
                      Verifying Email...
                    </h1>
                    <p className="text-brand-light">
                      Please wait while we verify your email address.
                    </p>
                  </>
                )}

                {verificationStatus === "success" && (
                  <>
                    <StatusIcon status="success" />
                    <h1 className="text-2xl font-bold text-brand-dark mb-4">
                      Email Verified! 🎉
                    </h1>
                    <p className="text-brand-light mb-6">
                      {verificationMessage}
                    </p>
                    <p className="text-sm text-brand-light">
                      Redirecting to login page in 3 seconds...
                    </p>
                  </>
                )}

                {verificationStatus === "error" && (
                  <>
                    <StatusIcon status="error" />
                    <h1 className="text-2xl font-bold text-brand-dark mb-4">
                      Verification Failed
                    </h1>
                    <p className="text-brand-light mb-6 text-center">
                      {verificationMessage}
                    </p>
                    <div className="space-y-6">
                      <p className="text-sm text-brand-light">
                        The verification link may have expired or is invalid.
                        Please contact support if you continue to experience
                        issues.
                      </p>
                      <Link
                        to="/login"
                        className="btn-primary rounded-[8px] border border-[#2151A0] hover:brightness-110 focus:ring-2 focus:ring-[#0C51D9] transition-all duration-300 blue-gradient blue-btn-shadow px-8 py-3 flex items-center justify-center gap-2 w-full"
                      >
                        <span className="text-brand-white text-base font-semibold">
                          Go to Login
                        </span>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <Navbar />

      <div className="flex" style={{ minHeight: "calc(100vh - 80px)" }}>
        {/* Left side - Image */}
        <div className="hidden lg:flex lg:w-1/2 relative">
          <img
            src="https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Email verification"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Right side - Content */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-[20px] border border-[#DCDEDD] p-8 text-center">
              {!userData ? (
                // Loading state
                <>
                  <StatusIcon status="loading" />
                  <h1 className="text-2xl font-bold text-brand-dark mb-4">
                    Loading...
                  </h1>
                </>
              ) : (
                <>
                  {/* Success Icon */}
                  <StatusIcon status="success" />

                  {/* Title */}
                  <h1 className="text-2xl font-bold text-brand-dark mb-4">
                    Check Your Email
                  </h1>

                  {/* Description */}
                  <div className="space-y-4 mb-8">
                    <p className="text-brand-light">
                      Hi {userData?.name}! {userData?.message}
                    </p>

                    <div className="flex items-center justify-center gap-2 text-brand-light">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">
                        We've sent a verification email to:
                      </span>
                    </div>

                    <p className="font-semibold text-brand-dark break-all">
                      {userData?.email}
                    </p>

                    <p className="text-sm text-brand-light">
                      Please check your inbox and click the verification link to
                      activate your account.
                    </p>
                  </div>

                  {/* Email Client Suggestions */}
                  <div className="bg-gray-50 rounded-[12px] p-4 mb-6">
                    <p className="text-sm text-brand-light mb-3">
                      Open your email client:
                    </p>
                    <div className="flex justify-center gap-3">
                      <a
                        href="https://mail.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-white border border-[#DCDEDD] rounded-[8px] text-sm text-brand-dark hover:bg-gray-50 transition-colors"
                      >
                        Gmail
                      </a>
                      <a
                        href="https://outlook.live.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-white border border-[#DCDEDD] rounded-[8px] text-sm text-brand-dark hover:bg-gray-50 transition-colors"
                      >
                        Outlook
                      </a>
                      <a
                        href="https://mail.yahoo.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-white border border-[#DCDEDD] rounded-[8px] text-sm text-brand-dark hover:bg-gray-50 transition-colors"
                      >
                        Yahoo
                      </a>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <p className="text-sm text-brand-light">
                      Didn't receive the email? Check your spam folder or
                      contact support.
                    </p>

                    <Link
                      to="/login"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors font-medium"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Login
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
