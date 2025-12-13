import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import type { Route } from "./+types/withdrawals.$id";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Withdrawal Details - Alprodas LMS" },
    {
      name: "description",
      content: "View detailed withdrawal information and status",
    },
  ];
}
import {
  ArrowLeft,
  Calendar,
  User,
  Banknote,
  Clock,
  CheckCircle,
  Camera,
  Info,
  HelpCircle,
  MessageCircle,
  Eye,
  X,
} from "lucide-react";
import { MentorLayout } from "~/components/templates/MentorLayout";
import { Header } from "~/components/templates/Header";
import {
  withdrawalsService,
  type WithdrawalDetail,
} from "~/services/withdrawals.service";
import { Button } from "~/components/atoms/Button";
import {
  getAvatarSrc,
  formatCurrency,
  formatDate,
  maskAccountNumber,
} from "~/utils/formatters";
import { getWithdrawalStatusBadgeClasses } from "~/utils/status";

export default function WithdrawalDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Fetch withdrawal detail data
  const {
    data: withdrawalResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["withdrawals", "detail", id],
    queryFn: () => withdrawalsService.getWithdrawalDetail(Number(id)),
    enabled: !!id,
  });

  const withdrawal = withdrawalResponse?.data;

  const openProofPreview = () => {
    setIsPreviewModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeProofPreview = () => {
    setIsPreviewModalOpen(false);
    document.body.style.overflow = "auto";
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isPreviewModalOpen) {
        closeProofPreview();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isPreviewModalOpen]);

  if (isLoading) {
    return (
      <MentorLayout>
        <Header
          title="Withdrawal Details"
          subtitle="Loading withdrawal information..."
          backButton={{
            to: "/dashboard/mentor/withdrawals",
            label: "Back",
          }}
        />
        <main className="main-content flex-1 overflow-auto p-5">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-brand-light">Loading withdrawal details...</p>
            </div>
          </div>
        </main>
      </MentorLayout>
    );
  }

  if (error || !withdrawal) {
    return (
      <MentorLayout>
        <Header
          title="Withdrawal Details"
          subtitle="Error loading withdrawal information"
          backButton={{
            to: "/dashboard/mentor/withdrawals",
            label: "Back",
          }}
        />
        <main className="main-content flex-1 overflow-auto p-5">
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <HelpCircle className="w-12 h-12 mx-auto mb-2" />
              <p className="text-lg font-semibold">Withdrawal not found</p>
              <p className="text-sm">
                The withdrawal you're looking for doesn't exist or you don't
                have permission to view it.
              </p>
            </div>
            <Link to="/dashboard/mentor/withdrawals">
              <Button
                variant="primary"
                className="rounded-[8px] px-6 py-3 inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4 text-white" />
                <span className="text-brand-white text-base font-semibold">
                  Back to Withdrawals
                </span>
              </Button>
            </Link>
          </div>
        </main>
      </MentorLayout>
    );
  }

  return (
    <MentorLayout>
      <Header
        title="Withdrawal Details"
        subtitle="Complete withdrawal information and status management"
        backButton={{
          to: "/dashboard/mentor/withdrawals",
          label: "Back",
        }}
      />

      <main className="main-content flex-1 overflow-auto p-5">
        {/* Withdrawal Header */}
        <div className="bg-white border border-[#DCDEDD] rounded-[20px] mb-6 p-6">
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-brand-dark text-3xl font-extrabold">
                  {withdrawal.withdrawal_code}
                </h1>
                <span
                  className={getWithdrawalStatusBadgeClasses(withdrawal.status)}
                >
                  {withdrawal.status}
                </span>
              </div>
              <div className="flex items-center gap-6 text-base text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(withdrawal.requested_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{withdrawal.user.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Banknote className="w-4 h-4" />
                  <span>{formatCurrency(withdrawal.amount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Cards Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Mentor Information */}
          <div className="bg-white border border-[#DCDEDD] rounded-[16px] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-[12px] flex items-center justify-center">
                <User className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-brand-dark text-lg font-bold">
                  Mentor Information
                </h3>
                <p className="text-brand-light text-sm">
                  Mentor profile and contact details
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={getAvatarSrc(
                    withdrawal.user.avatar || undefined,
                    withdrawal.user.name
                  )}
                  alt="Mentor"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = getAvatarSrc(undefined, withdrawal.user.name);
                  }}
                />
              </div>
              <div className="flex-1">
                <h4 className="text-brand-dark text-lg font-bold">
                  {withdrawal.user.name}
                </h4>
                <p className="text-brand-light text-base">
                  {withdrawal.user.expertise || "Mentor"}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-brand-light text-base">Email</span>
                <span className="text-brand-dark text-base font-medium">
                  {withdrawal.user.email}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-light text-base">Phone</span>
                <span className="text-brand-dark text-base font-medium">
                  Not provided
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-light text-base">Join Date</span>
                <span className="text-brand-dark text-base font-medium">
                  {formatDate(withdrawal.created_at)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-light text-base">Bank</span>
                <span className="text-brand-dark text-base font-medium">
                  {withdrawal.bank_name}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-light text-base">Account Name</span>
                <span className="text-brand-dark text-base font-medium">
                  {withdrawal.account_holder_name}
                </span>
              </div>
            </div>
          </div>

          {/* Withdrawal Summary */}
          <div className="bg-white border border-[#DCDEDD] rounded-[16px] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-[12px] flex items-center justify-center">
                <Banknote className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-brand-dark text-lg font-bold">
                  Withdrawal Summary
                </h3>
                <p className="text-brand-light text-sm">
                  Amount breakdown and fees
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-brand-light text-base">
                  Account Number
                </span>
                <span className="text-brand-dark text-base font-medium">
                  {withdrawal.account_number}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-light text-base">
                  Account Holder
                </span>
                <span className="text-brand-dark text-base font-medium">
                  {withdrawal.account_holder_name}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-brand-dark text-lg font-bold">
                    Net Amount
                  </span>
                  <span className="text-brand-dark text-lg font-bold">
                    {formatCurrency(withdrawal.amount)}
                  </span>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-brand-light text-base">
                    Request Date
                  </span>
                  <span className="text-brand-dark text-base font-medium">
                    {formatDate(withdrawal.requested_at)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-brand-light text-base">
                    Payment Method
                  </span>
                  <span className="text-brand-dark text-base font-medium">
                    Bank Transfer
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-brand-light text-base">
                    Processed by
                  </span>
                  <span className="text-brand-dark text-base font-medium">
                    {withdrawal.processed_by_user?.name || "Not processed yet"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Guidelines and Payment Proof Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Withdrawal Guidelines */}
          <div className="bg-white border border-[#DCDEDD] rounded-[16px] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-50 rounded-[12px] flex items-center justify-center">
                <Info className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-brand-dark text-lg font-bold">
                  Withdrawal Guidelines
                </h3>
                <p className="text-brand-light text-sm">
                  Important information about withdrawal process
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Processing Time */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Clock className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="text-brand-dark text-base font-semibold mb-1">
                    Processing Time
                  </h4>
                  <p className="text-brand-light text-sm">
                    Withdrawals are typically processed within 1-3 business days
                    after approval by our finance team.
                  </p>
                </div>
              </div>

              {/* Status Information */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-brand-dark text-base font-semibold mb-1">
                    Status Updates
                  </h4>
                  <p className="text-brand-light text-sm">
                    You'll receive email notifications when your withdrawal
                    status changes. Track progress in your dashboard.
                  </p>
                </div>
              </div>

              {/* Payment Proof */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-50 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Camera className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="text-brand-dark text-base font-semibold mb-1">
                    Payment Confirmation
                  </h4>
                  <p className="text-brand-light text-sm">
                    Payment proof will be uploaded by our finance team once the
                    transfer is completed.
                  </p>
                </div>
              </div>

              {/* Support */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <HelpCircle className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <h4 className="text-brand-dark text-base font-semibold mb-1">
                    Need Help?
                  </h4>
                  <p className="text-brand-light text-sm">
                    Contact our support team if you have questions about your
                    withdrawal or need assistance.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Support Button */}
            <div className="mt-6 pt-4 border-t border-[#DCDEDD]">
              <button
                type="button"
                className="w-full border border-[#DCDEDD] rounded-[8px] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 px-4 py-3 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-gray-600" />
                <span className="text-brand-dark text-base font-semibold">
                  Contact Support Team
                </span>
              </button>
            </div>
          </div>

          {/* Payment Proof Upload */}
          <div className="bg-white border border-[#DCDEDD] rounded-[16px] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-50 rounded-[12px] flex items-center justify-center">
                <Camera className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-brand-dark text-lg font-bold">
                  Payment Proof
                </h3>
                <p className="text-brand-light text-sm">
                  View payment confirmation photo
                </p>
              </div>
            </div>

            {/* Payment Proof Display */}
            <div className="mb-4">
              <label className="block text-brand-dark text-base font-semibold mb-1">
                Payment Screenshot
              </label>
              {/* Payment Proof Image */}
              <div className="w-full h-64 rounded-[16px] overflow-hidden border border-[#DCDEDD] mb-4">
                {withdrawal.proof_payment_withdrawal ? (
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}${withdrawal.proof_payment_withdrawal}`}
                    alt="Payment Proof"
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => setIsPreviewModalOpen(true)}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      if (target.nextElementSibling) {
                        (
                          target.nextElementSibling as HTMLElement
                        ).style.display = "flex";
                      }
                    }}
                  />
                ) : null}
                <div
                  className="w-full h-full bg-gray-50 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500"
                  style={{
                    display: withdrawal.proof_payment_withdrawal
                      ? "none"
                      : "flex",
                  }}
                >
                  <Camera className="w-12 h-12 mb-3 text-gray-400" />
                  <p className="text-base font-medium">
                    No payment proof uploaded
                  </p>
                  <p className="text-sm text-gray-400">
                    Payment screenshot will appear here once uploaded
                  </p>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex gap-3 items-center">
                <button
                  type="button"
                  onClick={openProofPreview}
                  className="border border-[#DCDEDD] rounded-[8px] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 px-4 py-2 flex items-center gap-2"
                >
                  <Eye className="w-4 h-4 text-gray-600" />
                  <span className="text-brand-dark text-base font-semibold">
                    View Full Size
                  </span>
                </button>
                <button
                  type="button"
                  className="border border-[#DCDEDD] rounded-[8px] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 px-4 py-2 flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-gray-600" />
                  <span className="text-brand-dark text-base font-semibold">
                    Contact Support
                  </span>
                </button>
                <p className="text-brand-light text-xs ml-auto">
                  {withdrawal.proof_payment_withdrawal
                    ? "Uploaded by manager"
                    : "Not uploaded yet"}
                </p>
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-brand-light text-base">Payment Date</span>
                <span className="text-brand-dark text-base font-medium">
                  {withdrawal.processed_at
                    ? formatDate(withdrawal.processed_at)
                    : "Not processed yet"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-light text-base">
                  Transaction ID
                </span>
                <span className="text-brand-dark text-base font-medium">
                  {withdrawal.withdrawal_code}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-light text-base">
                  Payment Status
                </span>
                <span
                  className={getWithdrawalStatusBadgeClasses(withdrawal.status)}
                >
                  {withdrawal.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Payment Proof Preview Modal */}
      {isPreviewModalOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={closeProofPreview}
        >
          <div
            className="bg-white rounded-[20px] border border-[#DCDEDD] w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-[#DCDEDD]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-50 rounded-[12px] flex items-center justify-center">
                    <Camera className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-brand-dark text-xl font-bold">
                      Payment Proof Preview
                    </h3>
                    <p className="text-brand-light text-sm font-normal">
                      Preview of payment confirmation screenshot
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeProofPreview}
                  className="w-10 h-10 rounded-full border border-[#DCDEDD] flex items-center justify-center hover:border-[#0C51D9] hover:border-2 transition-all duration-200"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
            {/* Modal Content */}
            <div className="p-6 flex items-center justify-center">
              {withdrawal.proof_payment_withdrawal ? (
                <img
                  src={`${import.meta.env.VITE_BASE_URL}${withdrawal.proof_payment_withdrawal}`}
                  alt="Payment Proof Preview"
                  className="max-w-full max-h-[60vh] object-contain rounded-[16px]"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    if (target.nextElementSibling) {
                      (target.nextElementSibling as HTMLElement).style.display =
                        "flex";
                    }
                  }}
                />
              ) : null}
              <div
                className="max-w-full max-h-[60vh] bg-gray-50 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 p-12 rounded-[16px]"
                style={{
                  display: withdrawal.proof_payment_withdrawal
                    ? "none"
                    : "flex",
                }}
              >
                <Camera className="w-16 h-16 mb-4 text-gray-400" />
                <p className="text-lg font-medium">
                  No payment proof available
                </p>
                <p className="text-sm text-gray-400">
                  Payment screenshot has not been uploaded yet
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </MentorLayout>
  );
}
