import { Link, useNavigate } from "react-router";
import {
  CheckCircle,
  Download,
  ArrowLeft,
  Calendar,
  CreditCard,
  Building2,
  Clock,
} from "lucide-react";
import { useState, useEffect } from "react";
import type { Route } from "./+types/withdrawals.success";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Withdrawal Successful - LMS Alprodas" },
    {
      name: "description",
      content: "Your withdrawal request has been submitted successfully",
    },
  ];
}

interface WithdrawalSuccessData {
  id: number;
  withdrawal_code: string;
  amount: number;
  bank_name: string;
  account_number: string;
  account_holder_name: string;
  requested_at: string;
  status: string;
  user: {
    name: string;
    email: string;
  };
}

export default function WithdrawalSuccessPage() {
  const [withdrawalData, setWithdrawalData] =
    useState<WithdrawalSuccessData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get withdrawal data from sessionStorage
    if (typeof window !== "undefined") {
      const storedData = sessionStorage.getItem("withdrawalSuccessData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setWithdrawalData(parsedData);
        // Clear the data after using it
        sessionStorage.removeItem("withdrawalSuccessData");
        setIsLoading(false);
      } else {
        // No session data, redirect to withdrawals page
        navigate("/dashboard/mentor/withdrawals", { replace: true });
      }
    }
  }, [navigate]);

  // Check if withdrawalData exists
  const displayData = withdrawalData;

  if (!displayData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">No withdrawal data found</p>
          <Link
            to="/dashboard/mentor/withdrawals"
            className="text-blue-600 hover:underline"
          >
            Back to Withdrawals
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString("id-ID")}`;
  };

  const getEstimatedCompletion = () => {
    const completionDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    return completionDate.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const maskAccountNumber = (accountNumber: string) => {
    if (accountNumber.length <= 4) return accountNumber;
    return "****" + accountNumber.slice(-4);
  };

  // Show loading or redirect if no data
  if (isLoading || !withdrawalData) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-5">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-brand-light">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-5">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-brand-dark text-3xl font-extrabold mb-3">
            Request Submitted Successfully!
          </h1>
          <p className="text-brand-light text-lg mb-8">
            Your withdrawal request has been submitted and is currently being
            processed.
          </p>

          {/* Withdrawal Details */}
          <div className="bg-gray-50 rounded-[16px] p-6 mb-8 text-left">
            <h2 className="text-brand-dark text-xl font-bold mb-6">
              Withdrawal Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-[8px] flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-brand-light text-sm">Withdrawal ID</p>
                    <p className="text-brand-dark text-base font-bold">
                      {displayData.withdrawal_code}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-[8px] flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-brand-light text-sm">Amount</p>
                    <p className="text-brand-dark text-base font-bold text-green-600">
                      {formatCurrency(displayData.amount)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-[8px] flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-brand-light text-sm">Request Date</p>
                    <p className="text-brand-dark text-base font-medium">
                      {formatDate(displayData.requested_at)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-50 rounded-[8px] flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-brand-light text-sm">Bank Account</p>
                    <p className="text-brand-dark text-base font-medium">
                      {displayData.bank_name}
                    </p>
                    <p className="text-brand-light text-sm">
                      {maskAccountNumber(displayData.account_number)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-50 rounded-[8px] flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-brand-light text-sm">
                      Estimated Completion
                    </p>
                    <p className="text-brand-dark text-base font-medium">
                      {getEstimatedCompletion()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Amount Breakdown */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-brand-dark text-base font-semibold mb-3">
                Amount Breakdown
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-brand-light">Original Amount</span>
                  <span className="text-brand-dark">
                    {formatCurrency(displayData.amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-light">Platform Fee (5%)</span>
                  <span className="text-red-600">
                    -{formatCurrency(Math.round(displayData.amount * 0.05))}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-base pt-2 border-t border-gray-200">
                  <span className="text-brand-dark">Net Amount</span>
                  <span className="text-green-600">
                    {formatCurrency(displayData.amount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-[16px] p-6 mb-8 text-left">
            <h3 className="text-blue-800 text-lg font-bold mb-4">
              What happens next?
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                  ✓
                </div>
                <div>
                  <p className="text-blue-800 text-sm font-medium">
                    Request Submitted
                  </p>
                  <p className="text-blue-700 text-sm">
                    Your withdrawal request has been successfully submitted
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                  2
                </div>
                <div>
                  <p className="text-blue-800 text-sm font-medium">
                    Review & Approval
                  </p>
                  <p className="text-blue-700 text-sm">
                    Our team will review your request (usually within 24 hours)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gray-300 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                  3
                </div>
                <div>
                  <p className="text-blue-800 text-sm font-medium">
                    Bank Transfer
                  </p>
                  <p className="text-blue-700 text-sm">
                    Once approved, funds will be transferred to your bank
                    account
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gray-300 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                  4
                </div>
                <div>
                  <p className="text-blue-800 text-sm font-medium">
                    Confirmation
                  </p>
                  <p className="text-blue-700 text-sm">
                    You'll receive an email when the transfer is complete
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard/mentor/withdrawals"
              className="bg-white border border-[#DCDEDD] text-brand-dark py-3 px-6 rounded-[8px] font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Withdrawals
            </Link>

            <button className="btn-primary rounded-[8px] border border-[#2151A0] hover:brightness-110 focus:ring-2 focus:ring-[#0C51D9] transition-all duration-300 blue-gradient blue-btn-shadow px-6 py-3 flex items-center justify-center gap-2">
              <Download className="w-4 h-4 text-white" />
              <span className="text-brand-white text-base font-semibold">
                Download Receipt
              </span>
            </button>
          </div>

          {/* Support Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-brand-light text-sm">
              Need help? Contact our support team at{" "}
              <a
                href="mailto:support@alprodas.com"
                className="text-blue-600 hover:underline"
              >
                support@alprodas.com
              </a>{" "}
              or call{" "}
              <a
                href="tel:+62-21-1234-5678"
                className="text-blue-600 hover:underline"
              >
                +62-21-1234-5678
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
