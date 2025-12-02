import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import type { Route } from "./+types/withdrawals.$id";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Withdrawal Details - LMS Alprodas" },
    {
      name: "description",
      content: "View detailed withdrawal information and status",
    },
  ];
}
import {
  User,
  Banknote,
  Settings,
  Camera,
  CheckCircle,
  FileText,
  Save,
  Send,
  ImagePlus,
  Eye,
  X,
  Calendar,
  Image,
  HelpCircle,
} from "lucide-react";
import { Layout } from "~/components/templates/Layout";
import { Header } from "~/components/templates/Header";
import { PermissionRoute } from "~/features/auth/components/PermissionRoute";
import { useWithdrawal } from "~/hooks/api/useWithdrawals";
import { withdrawalKeys } from "~/constants/api";
import { withdrawalsService } from "~/services/withdrawals.service";
import {
  getAvatarSrc,
  getImageSrc,
  formatCurrency,
  formatDate,
  maskAccountNumber,
} from "~/utils/formatters";
import { getWithdrawalStatusBadgeClasses } from "~/utils/status";

export default function WithdrawalDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [withdrawalStatus, setWithdrawalStatus] = useState("PENDING");
  const [managerNotes, setManagerNotes] = useState("");
  const [paymentProof, setPaymentProof] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Fetch withdrawal detail data
  const {
    data: withdrawalResponse,
    isLoading,
    error,
  } = useWithdrawal(Number(id));

  const withdrawal = withdrawalResponse?.data;

  // Update withdrawal status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({
      status,
      notes,
      proofFile,
    }: {
      status: string;
      notes?: string;
      proofFile?: File;
    }) =>
      withdrawalsService.updateWithdrawalStatus(
        Number(id),
        status,
        notes,
        proofFile
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: withdrawalKeys.all });
      queryClient.invalidateQueries({ queryKey: withdrawalKeys.lists() });
      navigate("/dashboard/withdrawals");
    },
    onError: (error: any) => {
      console.error("Update error:", error);
    },
  });

  // Initialize form with withdrawal data
  useEffect(() => {
    if (withdrawal) {
      setWithdrawalStatus(withdrawal.status);
      setManagerNotes(""); // No notes field in API response
      // Don't set paymentProof with API path - let it show via the condition in JSX
      setPaymentProof(null);
    }
  }, [withdrawal]);

  const handlePaymentProofSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5242880) {
        console.error("File size must be less than 5MB");
        event.target.value = "";
        return;
      }

      if (!file.type.startsWith("image/")) {
        console.error("Please select a valid image file");
        event.target.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setPaymentProof(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetPaymentProof = () => {
    setPaymentProof(null);
    const input = document.getElementById(
      "paymentProofInput"
    ) as HTMLInputElement;
    if (input) input.value = "";
  };

  const saveChanges = () => {
    if (!withdrawal) return;

    // Get the file from input
    const fileInput = document.getElementById(
      "paymentProofInput"
    ) as HTMLInputElement;
    const proofFile = fileInput?.files?.[0];

    updateStatusMutation.mutate({
      status: withdrawalStatus,
      notes: managerNotes || undefined,
      proofFile,
    });
  };

  const updateStatus = () => {
    saveChanges();
  };

  if (isLoading) {
    return (
      <PermissionRoute requiredPermission="withdrawals.read">
        <Layout>
          <Header
            title="Withdrawal Details"
            subtitle="Loading withdrawal information..."
            backButton={{
              onClick: () => navigate("/dashboard/withdrawals"),
              label: "Back",
            }}
          />
          <main className="main-content flex-1 overflow-auto p-5">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-brand-light">
                  Loading withdrawal details...
                </p>
              </div>
            </div>
          </main>
        </Layout>
      </PermissionRoute>
    );
  }

  if (error || !withdrawal) {
    return (
      <PermissionRoute requiredPermission="withdrawals.read">
        <Layout>
          <Header
            title="Withdrawal Details"
            subtitle="Error loading withdrawal information"
            backButton={{
              onClick: () => navigate("/dashboard/withdrawals"),
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
              <button
                onClick={() => navigate("/dashboard/withdrawals")}
                className="btn-primary rounded-[8px] border border-[#2151A0] hover:brightness-110 focus:ring-2 focus:ring-[#0C51D9] transition-all duration-300 blue-gradient blue-btn-shadow px-6 py-3"
              >
                <span className="text-brand-white text-base font-semibold">
                  Back to Withdrawals
                </span>
              </button>
            </div>
          </main>
        </Layout>
      </PermissionRoute>
    );
  }

  return (
    <PermissionRoute requiredPermission="withdrawals.read">
      <Layout>
        <Header
          title="Withdrawal Details"
          subtitle="Complete withdrawal information and status management"
          backButton={{
            onClick: () => navigate("/dashboard/withdrawals"),
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
                    className={getWithdrawalStatusBadgeClasses(
                      withdrawal.status
                    )}
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
                      target.src = getAvatarSrc(
                        undefined,
                        withdrawal.user.name
                      );
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-brand-dark text-lg font-bold">
                    {withdrawal.user.name}
                  </h4>
                  <p className="text-brand-light text-base">Mentor</p>
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
                  <span className="text-brand-light text-base">Expertise</span>
                  <span className="text-brand-dark text-base font-medium">
                    {withdrawal.user.expertise || "Not specified"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-brand-light text-base">
                    Processed By
                  </span>
                  <span className="text-brand-dark text-base font-medium">
                    {withdrawal.processed_by_user?.name || "Not processed yet"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-brand-light text-base">Bank</span>
                  <span className="text-brand-dark text-base font-medium">
                    {withdrawal.bank_name} -{" "}
                    {maskAccountNumber(withdrawal.account_number)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-brand-light text-base">
                    Account Name
                  </span>
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
                    Withdrawal Amount
                  </span>
                  <span className="text-brand-dark text-base font-medium">
                    {formatCurrency(withdrawal.amount)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-brand-light text-base">Status</span>
                  <span
                    className={getWithdrawalStatusBadgeClasses(
                      withdrawal.status
                    )}
                  >
                    {withdrawal.status}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-brand-dark text-lg font-bold">
                      Total Amount
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
                      Withdrawal Code
                    </span>
                    <span className="text-brand-dark text-base font-medium">
                      {withdrawal.withdrawal_code}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Management and Payment Proof Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Management */}
            <div className="bg-white border border-[#DCDEDD] rounded-[16px] p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-50 rounded-[12px] flex items-center justify-center">
                  <Settings className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-brand-dark text-lg font-bold">
                    Status Management
                  </h3>
                  <p className="text-brand-light text-sm">
                    Update withdrawal status and add notes
                  </p>
                </div>
              </div>
              <form className="space-y-4">
                {/* Status Selection */}
                <div>
                  <label className="block text-brand-dark text-base font-semibold mb-1">
                    Update Status
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <CheckCircle className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      value={withdrawalStatus}
                      onChange={(e) => setWithdrawalStatus(e.target.value)}
                      className="w-full pl-12 pr-8 py-3 border border-[#DCDEDD] rounded-[16px] hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2 transition-all duration-300 bg-white appearance-none"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="REJECTED">Rejected</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>
                </div>

                {/* Manager Notes */}
                <div>
                  <label className="block text-brand-dark text-base font-semibold mb-1">
                    Manager Notes
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-4 pointer-events-none">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      rows={4}
                      value={managerNotes}
                      onChange={(e) => setManagerNotes(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-[#DCDEDD] rounded-[16px] hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2 focus:bg-white transition-all duration-300"
                      placeholder="Add notes about this withdrawal decision..."
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={saveChanges}
                    className="flex-1 bg-white border border-[#DCDEDD] text-brand-dark py-3 px-4 rounded-[8px] font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={updateStatus}
                    className="flex-1 btn-primary rounded-[8px] border border-[#2151A0] hover:brightness-110 focus:ring-2 focus:ring-[#0C51D9] transition-all duration-300 blue-gradient blue-btn-shadow px-4 py-3 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4 text-white" />
                    <span className="text-brand-white text-sm font-semibold">
                      Update Status
                    </span>
                  </button>
                </div>
              </form>
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
                    Upload payment confirmation photo
                  </p>
                </div>
              </div>

              {/* Photo Upload Section */}
              <div className="mb-4">
                <label className="block text-brand-dark text-base font-semibold mb-1">
                  Payment Screenshot
                </label>
                <div className="flex items-start gap-4">
                  <div className="w-64 h-42 relative">
                    {paymentProof || withdrawal.proof_payment_withdrawal ? (
                      <img
                        src={
                          paymentProof ||
                          getImageSrc(
                            withdrawal.proof_payment_withdrawal || undefined,
                            "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=256&fit=crop"
                          )
                        }
                        alt="Payment Proof"
                        className="w-64 h-42 object-cover rounded-[16px] cursor-pointer"
                        onClick={() => setShowPreviewModal(true)}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=256&fit=crop";
                        }}
                      />
                    ) : (
                      <div className="w-64 h-42 bg-gray-50 rounded-[16px] border-2 border-dashed border-[#DCDEDD] flex flex-col items-center justify-center text-gray-400">
                        <Image className="w-10 h-10 mb-2" />
                        <span className="text-sm font-medium">
                          Payment Proof
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <input
                      type="file"
                      id="paymentProofInput"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePaymentProofSelect}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        document.getElementById("paymentProofInput")?.click()
                      }
                      className="border border-[#DCDEDD] rounded-[8px] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 px-4 py-2 flex items-center gap-2"
                    >
                      <ImagePlus className="w-4 h-4 text-gray-600" />
                      <span className="text-brand-dark text-base font-semibold">
                        Select Photo
                      </span>
                    </button>
                    {(paymentProof || withdrawal.proof_payment_withdrawal) && (
                      <button
                        type="button"
                        onClick={() => setShowPreviewModal(true)}
                        className="border border-[#DCDEDD] rounded-[8px] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 px-4 py-2 flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                        <span className="text-brand-dark text-base font-semibold">
                          Preview
                        </span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={resetPaymentProof}
                      className="border border-[#DCDEDD] rounded-[8px] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 px-4 py-2 flex items-center gap-2"
                    >
                      <X className="w-4 h-4 text-gray-600" />
                      <span className="text-brand-dark text-base font-semibold">
                        Remove
                      </span>
                    </button>
                    <p className="text-brand-light text-xs">
                      JPG, PNG up to 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-brand-light text-base">
                    Payment Date
                  </span>
                  <span className="text-brand-dark text-base font-medium">
                    {withdrawal.processed_at
                      ? formatDate(withdrawal.processed_at)
                      : "Not processed yet"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-brand-light text-base">
                    Withdrawal Code
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
                    className={getWithdrawalStatusBadgeClasses(
                      withdrawal.status
                    )}
                  >
                    {withdrawal.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Payment Proof Preview Modal */}
        {showPreviewModal &&
          (paymentProof || withdrawal.proof_payment_withdrawal) && (
            <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="bg-white rounded-[20px] border border-[#DCDEDD] w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
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
                      type="button"
                      onClick={() => setShowPreviewModal(false)}
                      className="w-10 h-10 rounded-full border border-[#DCDEDD] flex items-center justify-center hover:border-[#0C51D9] hover:border-2 transition-all duration-200"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
                {/* Modal Content */}
                <div className="p-6 flex items-center justify-center">
                  <img
                    src={
                      paymentProof ||
                      getImageSrc(
                        withdrawal.proof_payment_withdrawal || undefined,
                        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop"
                      )
                    }
                    alt="Payment Proof Preview"
                    className="max-w-full max-h-[60vh] object-contain rounded-[16px]"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop";
                    }}
                  />
                </div>
              </div>
            </div>
          )}
      </Layout>
    </PermissionRoute>
  );
}
