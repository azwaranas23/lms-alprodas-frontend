import { useState } from "react";
import { Link, useNavigate } from "react-router";
import type { Route } from "./+types/signup";
import {
  User,
  Phone,
  Mail,
  Lock,
  UserPlus,
  GraduationCap,
  UserCheck,
} from "lucide-react";
import { Navbar } from "~/components/organisms/Navbar";
import { ProfilePhotoUpload } from "~/features/auth/components/ProfilePhotoUpload";
import { RadioOption } from "~/features/auth/components/RadioOption";
import { authService } from "~/services/auth.service";
import { storeTempNavData } from "~/utils/secureNavigation";
import { ApiErrorMessage } from "~/components/atoms/ApiErrorMessage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sign Up - LMS Alprodas" },
    {
      name: "description",
      content:
        "Create your LMS Alprodas account and start learning from industry experts today",
    },
  ];
}

interface FormData {
  profilePhoto: File | null;
  role: string;
  fullName: string;
  phone: string;
  gender: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

interface FormErrors {
  [key: string]: string;
}

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    profilePhoto: null,
    role: "",
    fullName: "",
    phone: "",
    gender: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const validateField = (
    name: string,
    value: string | File | null | boolean
  ): string => {
    // Handle File type for profilePhoto
    if (name === "profilePhoto") {
      return ""; // File validation can be done separately if needed
    }

    // Handle boolean type for terms
    if (name === "terms") {
      return !value ? "You must accept the terms and conditions." : "";
    }

    // Cast to string for validation (all form fields except file are strings)
    const stringValue = value as string;

    switch (name) {
      case "role":
        return !stringValue ? "Please select your role." : "";
      case "fullName":
        return !stringValue?.trim() ? "Please enter your full name." : "";
      case "phone":
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return !phoneRegex.test(stringValue?.replace(/\s/g, "") || "")
          ? "Please enter a valid phone number."
          : "";
      case "gender":
        return !stringValue ? "Please select your gender." : "";
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(stringValue || "")
          ? "Please enter a valid email address."
          : "";
      case "password":
        return (stringValue?.length || 0) < 8
          ? "Password must be at least 8 characters long."
          : "";
      case "confirmPassword":
        return stringValue !== formData.password
          ? "Passwords do not match."
          : "";
      case "terms":
        return !value ? "Please accept the terms and conditions." : "";
      default:
        return "";
    }
  };

  const handleInputChange = (name: string, value: string | File | null) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Real-time validation for confirm password
    if (
      name === "confirmPassword" ||
      (name === "password" && formData.confirmPassword)
    ) {
      const confirmError = validateField(
        "confirmPassword",
        name === "confirmPassword" ? value : formData.confirmPassword
      );
      setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  const handleBlur = (name: string, value: string | File | null) => {
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    setApiError(null);

    // Validate all fields
    const newErrors: FormErrors = {};
    Object.keys(formData).forEach((key) => {
      if (key !== "profilePhoto") {
        const value = formData[key as keyof FormData];
        const error = validateField(key, value);
        if (error) newErrors[key] = error;
      }
    });

    setErrors(newErrors);

    // If no errors, submit form
    if (Object.keys(newErrors).length === 0) {
      try {
        // Prepare form data for API
        const apiFormData = new FormData();
        apiFormData.append("email", formData.email);
        apiFormData.append("password", formData.password);
        apiFormData.append("confirmPassword", formData.confirmPassword);
        apiFormData.append("name", formData.fullName);

        // Send role as string (mentor/student)
        apiFormData.append("role", formData.role);

        // Map role to role_id (3 = student, 2 = mentor based on typical setup)
        const roleId = formData.role === "mentor" ? "2" : "3";
        apiFormData.append("role_id", roleId);

        // Add profile photo if exists
        if (formData.profilePhoto) {
          apiFormData.append("avatar", formData.profilePhoto);
        }

        // Call register API
        const response = await authService.register(apiFormData);

        // Store data securely in sessionStorage with expiry
        storeTempNavData({
          email: formData.email,
          name: formData.fullName.split(" ")[0], // Only first name for privacy
          message:
            response.message ||
            "Registration successful! Please check your email.",
        });

        // Redirect without sensitive data in router state
        navigate("/verify-email", { replace: true });
      } catch (error: unknown) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        console.error("Registration failed:", error);
        const errorMessage =
          axiosError.response?.data?.message ||
          "Registration failed. Please try again.";
        setApiError(errorMessage);
      }
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#F9F9F9" }}>
      <Navbar />

      <div className="flex" style={{ minHeight: "calc(100vh - 80px)" }}>
        {/* Left Side - Image */}
        <div className="hidden lg:flex lg:w-1/2 relative">
          <img
            src="https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2274&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Students learning together"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Right Side - Sign Up Form */}
        <div
          className="w-full lg:w-1/2 flex items-center justify-center"
          style={{ padding: "20px" }}
        >
          <div className="w-full max-w-md space-y-6">
            {/* API Error Display */}
            {apiError && (
              <ApiErrorMessage title="Registration Failed" message={apiError} />
            )}

            {/* Sign Up Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Profile Photo Upload */}
              <ProfilePhotoUpload
                onPhotoChange={(file) =>
                  handleInputChange("profilePhoto", file)
                }
              />

              {/* Role Selection */}
              <div>
                <label className="block text-brand-dark text-sm font-semibold mb-3">
                  Choose Your Role *
                </label>
                <div className="flex gap-3">
                  <RadioOption
                    name="role"
                    value="student"
                    checked={formData.role === "student"}
                    onChange={(value) => handleInputChange("role", value)}
                    icon={<GraduationCap className="w-4 h-4 text-blue-600" />}
                    label="Student"
                    description="Learn from experts"
                    required
                  />
                  <RadioOption
                    name="role"
                    value="mentor"
                    checked={formData.role === "mentor"}
                    onChange={(value) => handleInputChange("role", value)}
                    icon={<UserCheck className="w-4 h-4 text-green-600" />}
                    label="Mentor"
                    description="Teach and earn"
                    required
                  />
                </div>
                {errors.role && (
                  <div className="mt-2">
                    <p className="text-danger text-sm font-normal">
                      {errors.role}
                    </p>
                  </div>
                )}
              </div>

              {/* Full Name Field */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block mb-2 text-gray-600 text-sm font-semibold"
                >
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    onBlur={(e) => handleBlur("fullName", e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-white border rounded-[16px] transition-all duration-300 ${
                      errors.fullName
                        ? "border-[#DC2626] border-2"
                        : "border-[#DCDEDD] hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2 focus:bg-white"
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.fullName && (
                  <div className="mt-2">
                    <p className="text-danger text-sm font-normal">
                      {errors.fullName}
                    </p>
                  </div>
                )}
              </div>

              {/* Phone Number Field */}
              <div>
                <label
                  htmlFor="phone"
                  className="block mb-2 text-gray-600 text-sm font-semibold"
                >
                  Phone Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    onBlur={(e) => handleBlur("phone", e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-white border rounded-[16px] transition-all duration-300 ${
                      errors.phone
                        ? "border-[#DC2626] border-2"
                        : "border-[#DCDEDD] hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2 focus:bg-white"
                    }`}
                    placeholder="Enter your phone number"
                  />
                </div>
                {errors.phone && (
                  <div className="mt-2">
                    <p className="text-danger text-sm font-normal">
                      {errors.phone}
                    </p>
                  </div>
                )}
              </div>

              {/* Gender Selection */}
              <div>
                <label className="block text-brand-dark text-sm font-semibold mb-3">
                  Gender *
                </label>
                <div className="flex gap-3">
                  <RadioOption
                    name="gender"
                    value="male"
                    checked={formData.gender === "male"}
                    onChange={(value) => handleInputChange("gender", value)}
                    icon={<User className="w-4 h-4 text-blue-600" />}
                    label="Male"
                    required
                  />
                  <RadioOption
                    name="gender"
                    value="female"
                    checked={formData.gender === "female"}
                    onChange={(value) => handleInputChange("gender", value)}
                    icon={<User className="w-4 h-4 text-pink-600" />}
                    label="Female"
                    required
                  />
                </div>
                {errors.gender && (
                  <div className="mt-2">
                    <p className="text-danger text-sm font-normal">
                      {errors.gender}
                    </p>
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-gray-600 text-sm font-semibold"
                >
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    onBlur={(e) => handleBlur("email", e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-white border rounded-[16px] transition-all duration-300 ${
                      errors.email
                        ? "border-[#DC2626] border-2"
                        : "border-[#DCDEDD] hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2 focus:bg-white"
                    }`}
                    placeholder="Enter your email address"
                  />
                </div>
                {errors.email && (
                  <div className="mt-2">
                    <p className="text-danger text-sm font-normal">
                      {errors.email}
                    </p>
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-gray-600 text-sm font-semibold"
                >
                  Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    minLength={8}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    onBlur={(e) => handleBlur("password", e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-white border rounded-[16px] transition-all duration-300 ${
                      errors.password
                        ? "border-[#DC2626] border-2"
                        : "border-[#DCDEDD] hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2 focus:bg-white"
                    }`}
                    placeholder="Create a password"
                  />
                </div>
                {errors.password && (
                  <div className="mt-2">
                    <p className="text-danger text-sm font-normal">
                      {errors.password}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 text-gray-600 text-sm font-semibold"
                >
                  Confirm Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    onBlur={(e) =>
                      handleBlur("confirmPassword", e.target.value)
                    }
                    className={`w-full pl-10 pr-4 py-3 bg-white border rounded-[16px] transition-all duration-300 ${
                      errors.confirmPassword
                        ? "border-[#DC2626] border-2"
                        : "border-[#DCDEDD] hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2 focus:bg-white"
                    }`}
                    placeholder="Confirm your password"
                  />
                </div>
                {errors.confirmPassword && (
                  <div className="mt-2">
                    <p className="text-danger text-sm font-normal">
                      {errors.confirmPassword}
                    </p>
                  </div>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  name="terms"
                  required
                  checked={formData.terms}
                  onChange={(e) =>
                    handleInputChange(
                      "terms",
                      e.target.checked as unknown as string | File | null
                    )
                  }
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                />
                <label
                  htmlFor="terms"
                  className="text-brand-light text-sm font-normal"
                >
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-blue-500 font-semibold hover:brightness-110 transition-all duration-300"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-blue-500 font-semibold hover:brightness-110 transition-all duration-300"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.terms && (
                <div className="mt-2">
                  <p className="text-danger text-sm font-normal">
                    {errors.terms}
                  </p>
                </div>
              )}

              {/* Sign Up Button */}
              <button
                type="submit"
                className="btn-primary rounded-[8px] border border-[#2151A0] hover:brightness-110 focus:ring-2 focus:ring-[#0C51D9] transition-all duration-300 blue-gradient blue-btn-shadow px-4 py-3 flex items-center gap-2 w-full justify-center text-brand-white text-sm font-semibold"
              >
                <UserPlus className="w-4 h-4" />
                Create Account
              </button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div
                  className="w-full border-t"
                  style={{ borderColor: "#DCDEDD" }}
                ></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#F9F9F9] text-brand-light text-sm font-normal">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Sign Up */}
            <div className="grid grid-cols-2 gap-3">
              <button className="border border-[#DCDEDD] rounded-[8px] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 flex p-3 justify-center items-center gap-3 bg-white">
                <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="ml-2 text-gray-600 text-sm font-semibold">
                  Google
                </span>
              </button>
              <button className="border border-[#DCDEDD] rounded-[8px] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 flex p-3 justify-center items-center gap-3 bg-white">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="ml-2 text-gray-600 text-sm font-semibold">
                  Facebook
                </span>
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-brand-light text-sm font-normal">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-500 text-sm font-semibold hover:brightness-110 transition-all duration-300"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
