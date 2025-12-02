import { useState } from 'react';
import { User, Mail, ShieldCheck, Banknote, Percent, Clock, Building2, CreditCard, UserCheck, FileText, ArrowLeft, Send, Loader2, Info, Check, X, CheckCircle } from 'lucide-react';
import { useCreateWithdrawal } from '~/hooks/api/useWithdrawals';
import { useWithdrawal } from '~/contexts/WithdrawalContext';
import { Button } from '~/components/atoms/Button';
import { Checkbox } from '~/components/atoms/Checkbox';

interface ReviewSubmitStepProps {
  onBack: () => void;
  onSubmit: () => void;
}

export default function ReviewSubmitStep({ onBack, onSubmit }: ReviewSubmitStepProps) {
  const { formData } = useWithdrawal();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [processUnderstood, setProcessUnderstood] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const createWithdrawalMutation = useCreateWithdrawal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!termsAccepted || !processUnderstood) {
      setSubmissionError('Please accept all terms and conditions before submitting.');
      return;
    }

    setSubmissionError('');

    const withdrawalRequest = {
      amount: formData.amount,
      bankName: formData.bankName,
      accountNumber: formData.accountNumber,
      accountHolderName: formData.accountHolderName,
      password: formData.password
    };

    createWithdrawalMutation.mutate(withdrawalRequest, {
      onSuccess: (response) => {
        // Store withdrawal data for success page
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('withdrawalSuccessData', JSON.stringify(response.data));
        }
        onSubmit();
      },
      onError: (error: any) => {
        console.error('Withdrawal submission error:', error);

        // Handle Zod validation errors from API
        if (error?.response?.data?.errors && Array.isArray(error.response.data.errors)) {
          const zodErrors = error.response.data.errors;
          // Format: "path: message" for each error, separated by newlines
          const errorList = zodErrors.map((err: any) => `• ${err.path}: ${err.message}`).join('\n');
          setSubmissionError(errorList);
        } else {
          const errorMessage = error?.response?.data?.message ||
            'Failed to submit withdrawal request. Please try again.';
          setSubmissionError(errorMessage);
        }
      }
    });
  };

  const canSubmit = termsAccepted && processUnderstood && !createWithdrawalMutation.isPending;

  return (
    <div className="flex gap-6 pl-5 items-start">
      {/* Form Section */}
      <div className="flex-1">
        {/* Withdrawal Review Header */}
        <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-[12px] flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-brand-dark text-xl font-bold">Withdrawal Review</h3>
              <p className="text-brand-light text-sm font-normal">Review all your information before submitting</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* Account Information */}
            <div className="space-y-4">
              <h4 className="text-brand-dark text-lg font-bold">Account Information</h4>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-brand-light text-sm font-medium">Full Name</p>
                    <p className="text-brand-dark text-base font-semibold">{formData.userProfile.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-brand-light text-sm font-medium">Email Address</p>
                    <p className="text-brand-dark text-base font-semibold">{formData.userProfile.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-brand-light text-sm font-medium">Password Verification</p>
                    <p className="text-brand-dark text-base font-semibold">✓ Verified</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Withdrawal Details */}
            <div className="space-y-4">
              <h4 className="text-brand-dark text-lg font-bold">Withdrawal Details</h4>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Banknote className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-brand-light text-sm font-medium">Requested Amount</p>
                    <p className="text-brand-dark text-base font-semibold">Rp {formData.amount.toLocaleString('id-ID')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Percent className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-brand-light text-sm font-medium">Processing Fee</p>
                    <p className="text-brand-dark text-base font-semibold">FREE</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-brand-light text-sm font-medium">Processing Time</p>
                    <p className="text-brand-dark text-base font-semibold">1-3 business days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bank Information Review */}
        <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-50 rounded-[12px] flex items-center justify-center">
              <Building2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-brand-dark text-xl font-bold">Bank Information</h3>
              <p className="text-brand-light text-sm font-normal">Your withdrawal destination</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* Bank Details */}
            <div className="space-y-4">
              <h4 className="text-brand-dark text-lg font-bold">Bank Details</h4>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-brand-light text-sm font-medium">Bank Name</p>
                    <p className="text-brand-dark text-base font-semibold">{formData.bankName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-brand-light text-sm font-medium">Account Number</p>
                    <p className="text-brand-dark text-base font-semibold">****-****-{formData.accountNumber.slice(-4)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Holder */}
            <div className="space-y-4">
              <h4 className="text-brand-dark text-lg font-bold">Account Holder</h4>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <UserCheck className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-brand-light text-sm font-medium">Account Holder Name</p>
                    <p className="text-brand-dark text-base font-semibold">{formData.accountHolderName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-brand-light text-sm font-medium">Verification Status</p>
                    <p className="text-brand-dark text-base font-semibold">✓ Name Verified</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final Amount Summary */}
        <div className="main-card rounded-[20px] border border-[#0B1042] relative overflow-hidden p-6 mb-6">
          <div className="flex flex-col justify-center h-full relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-brand-white-90 text-sm font-medium">Final Amount</p>
                <p className="text-brand-white text-4xl font-extrabold leading-none my-4">Rp {formData.amount.toLocaleString('id-ID')}</p>
                <p className="text-brand-white-80 text-base font-normal">Amount to be transferred to your account</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-[20px] flex items-center justify-center">
                <Banknote className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Additional Info */}
            <div className="flex items-center gap-3 mt-6">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-brand-white-70 text-xs font-normal">No fees applied</span>
              </div>
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-white opacity-70" />
                <span className="text-brand-white-70 text-xs font-normal">Secure Transfer</span>
              </div>
            </div>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-yellow-50 rounded-[12px] flex items-center justify-center">
              <FileText className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-brand-dark text-xl font-bold">Terms & Conditions</h3>
              <p className="text-brand-light text-sm font-normal">Please read and accept our terms</p>
            </div>
          </div>

          <div className="space-y-4">
            <Checkbox
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            >
              <span className="text-brand-dark text-sm">
                I confirm that all the information provided is accurate and I accept the
                <a href="#" className="text-blue-600 hover:text-blue-800 font-semibold"> Terms and Conditions</a>
                and <a href="#" className="text-blue-600 hover:text-blue-800 font-semibold">Privacy Policy</a>.
              </span>
            </Checkbox>

            <Checkbox
              checked={processUnderstood}
              onChange={(e) => setProcessUnderstood(e.target.checked)}
            >
              <span className="text-brand-dark text-sm">
                I understand that the withdrawal process may take 1-3 business days and cannot be cancelled once submitted.
              </span>
            </Checkbox>
          </div>
        </div>

        {/* Submission Error */}
        {submissionError && (
          <div className="rounded-[8px] p-4 mb-6" style={{ background: '#FEE2E2', border: '1px solid #F87171' }}>
            <div className="flex items-center gap-3">
              <X className="w-5 h-5 text-[#DC2626]" />
              <div>
                <h4 className="text-danger text-sm font-semibold m-0">Submission Failed</h4>
                <p className="text-danger text-sm font-normal m-0 whitespace-pre-line">
                  {submissionError}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form Navigation */}
        <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-brand-dark text-sm font-medium">Step 4 of 4</p>
              <p className="text-brand-light text-xs font-normal mt-1">Ready to submit your withdrawal request</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="px-6 py-3"
              >
                <ArrowLeft className="w-4 h-4 text-gray-600" />
                <span className="text-brand-dark text-base font-semibold">Back</span>
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={!canSubmit}
                isLoading={createWithdrawalMutation.isPending}
                className="px-8 py-3"
              >
                {createWithdrawalMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                    <span className="text-brand-white text-base font-semibold">Processing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-white" />
                    <span className="text-brand-white text-base font-semibold">Submit Request</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="w-80 flex-shrink-0 pr-5">
        <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6 sticky top-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-[12px] flex items-center justify-center">
              <Info className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-brand-dark text-lg font-bold">Final Review</h3>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-blue-600" />
              </div>
              <div>
                <p className="text-brand-dark text-base font-semibold">Double-check details</p>
                <p className="text-brand-light text-xs font-normal">Ensure all information is correct before submitting</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-blue-600" />
              </div>
              <div>
                <p className="text-brand-dark text-base font-semibold">Processing timeline</p>
                <p className="text-brand-light text-xs font-normal">You'll receive confirmation within 24 hours</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-blue-600" />
              </div>
              <div>
                <p className="text-brand-dark text-base font-semibold">Cannot be cancelled</p>
                <p className="text-brand-light text-xs font-normal">Once submitted, the request cannot be modified</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}