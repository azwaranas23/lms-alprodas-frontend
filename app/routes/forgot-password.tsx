import { useState } from "react";
import { Link } from "react-router";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { Navbar } from "~/components/organisms/Navbar";
import { authService } from "~/services/auth.service";

export function meta() {
  return [
    { title: "Forgot Password - Alprodas LMS" },
    {
      name: "description",
      content: "Reset your Alprodas LMS account password",
    },
  ];
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsPending(true);

    try {
      const response = await authService.forgotPassword(email);
      setSuccessMsg(response.message || "Tautan reset password telah dikirim ke email Anda.");
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message || "Terjadi kesalahan. Silakan coba kembali."
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <Navbar />

      <div className="flex" style={{ minHeight: "calc(100vh - 80px)" }}>
        {/* Left side - Image */}
        <div className="hidden lg:flex lg:w-1/2 relative">
          <img
            src="https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&w=1000&q=80&fm=webp"
            alt="Forgot password background"
            className="object-cover w-full h-full"
            loading="lazy"
          />
        </div>

        {/* Right side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <div className="w-full max-w-md space-y-8">
            <div className="bg-white rounded-[20px] border border-[#DCDEDD] p-8 shadow-sm">
              <h1 className="text-2xl font-bold text-[#0B1A30] mb-2">
                Forgot Password
              </h1>
              <p className="text-gray-500 text-sm mb-6">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              {successMsg ? (
                <div className="space-y-6 text-center py-4">
                  <div className="flex justify-center">
                    <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-lg font-semibold text-gray-900">Check Your Email</h2>
                    <p className="text-sm text-gray-500">{successMsg}</p>
                  </div>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors font-semibold text-sm"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errorMsg && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-[12px]">
                      <p className="text-sm text-red-600 font-medium">{errorMsg}</p>
                    </div>
                  )}

                  <div>
                    <label htmlFor="email" className="block mb-2 text-gray-600 text-sm font-semibold">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isPending}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-[#DCDEDD] rounded-[16px] transition-all duration-300 hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2 focus:bg-white outline-none"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isPending || !email}
                    className="btn-primary rounded-[8px] border border-[#2151A0] hover:brightness-110 focus:ring-2 focus:ring-[#0C51D9] transition-all duration-300 blue-gradient blue-btn-shadow px-4 py-3 flex items-center gap-2 w-full justify-center text-brand-white text-sm font-semibold"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending reset link...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors font-semibold text-sm"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Login
                    </Link>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
