import { useState } from "react";
import { KeyRound } from "lucide-react";
import { Button } from "~/components/atoms/Button";

interface EnrollmentTokenCardProps {
  isProcessing?: boolean;
  onEnroll: (token: string) => void;
}

export function PaymentDetailsCard({
  isProcessing = false,
  onEnroll,
}: EnrollmentTokenCardProps) {
  const [token, setToken] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim() || isProcessing) return;
    onEnroll(token.trim());
  };

  return (
    <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-50 rounded-[12px] flex items-center justify-center">
          <KeyRound className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-brand-dark text-lg font-bold">
            Enroll with Course Token
          </h3>
          <p className="text-brand-light text-sm">
            Enter the class token provided by your lecturer to join this course.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-brand-dark mb-2">
            Course Token
          </label>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="e.g. IDN1-KGER"
            className="w-full rounded-xl border border-[#DCDEDD] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#0C51D9] focus:border-[#0C51D9] transition"
          />
          <p className="text-xs text-brand-light mt-1">
            Make sure you type the token exactly as given (case-sensitive).
          </p>
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={isProcessing || !token.trim()}
          className="w-full px-6 py-4 text-lg font-semibold"
        >
          {isProcessing ? "Enrolling..." : "Enroll Course"}
        </Button>
      </form>
    </div>
  );
}
