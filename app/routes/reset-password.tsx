import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router";
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import { Navbar } from "~/components/organisms/Navbar";
import { authService } from "~/services/auth.service";

export function meta() {
  return [
    { title: "Reset Password - Alprodas LMS" },
    {
      name: "description",
      content: "Set a new password for your Alprodas LMS account",
    },
  ];
}

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!token) {
      setErrorMsg("Token reset password tidak ditemukan. Silakan minta tautan baru.");
      return;
    }

    if (password.length < 8) {
      setErrorMsg("Password minimal harus terdiri dari 8 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Password konfirmasi tidak cocok.");
      return;
    }

    setIsPending(true);

    try {
      const response = await authService.resetPassword({ token, password });
      setSuccessMsg(response.message || "Password berhasil diubah!");
      
      // Auto-redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message || "Terjadi kesalahan. Silakan coba kembali."
      );
    } finally {
      setIsPending(false);
    }
  };

  const renderFormContent = () => {
    if (successMsg) {
      return (
        <div className="space-y-6 text-center py-4">
          <div className="flex justify-center">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 animate-bounce" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900">Success!</h2>
            <p className="text-sm text-gray-500">{successMsg}</p>
            <p className="text-xs text-gray-400">Redirecting to login in 3 seconds...</p>
          </div>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors font-semibold text-sm"
          >
            Go to Login Page
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      );
    }

    if (token) {
      return (
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-[12px]">
              <p className="text-sm text-red-600 font-medium">{errorMsg}</p>
            </div>
          )}

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block mb-2 text-gray-600 text-sm font-semibold">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isPending}
                className="w-full pl-10 pr-10 py-3 bg-white border border-[#DCDEDD] rounded-[16px] transition-all duration-300 hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2 focus:bg-white outline-none"
                placeholder="Min. 8 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block mb-2 text-gray-600 text-sm font-semibold">
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isPending}
                className="w-full pl-10 pr-10 py-3 bg-white border border-[#DCDEDD] rounded-[16px] transition-all duration-300 hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2 focus:bg-white outline-none"
                placeholder="Re-enter password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending || !password || !confirmPassword}
            className="btn-primary rounded-[8px] border border-[#2151A0] hover:brightness-110 focus:ring-2 focus:ring-[#0C51D9] transition-all duration-300 blue-gradient blue-btn-shadow px-4 py-3 flex items-center gap-2 w-full justify-center text-brand-white text-sm font-semibold"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Resetting password...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      );
    }

    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-[12px] text-center">
        <p className="text-sm text-red-600 font-medium mb-4">
          Tautan reset password tidak valid atau tidak lengkap.
        </p>
        <Link
          to="/forgot-password"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors font-semibold text-sm"
        >
          Request New Link
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <Navbar />

      <div className="flex" style={{ minHeight: "calc(100vh - 80px)" }}>
        {/* Left side - Image */}
        <div className="hidden lg:flex lg:w-1/2 relative">
          <img
            src="https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&w=1000&q=80&fm=webp"
            alt="Reset password background"
            className="object-cover w-full h-full"
            loading="lazy"
          />
        </div>

        {/* Right side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <div className="w-full max-w-md space-y-8">
            <div className="bg-white rounded-[20px] border border-[#DCDEDD] p-8 shadow-sm">
              <h1 className="text-2xl font-bold text-[#0B1A30] mb-2">
                Reset Password
              </h1>
              <p className="text-gray-500 text-sm mb-6">
                Please enter your new password below.
              </p>

              {renderFormContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
