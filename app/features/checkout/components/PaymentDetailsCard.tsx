import { CreditCard, Shield, Clock } from 'lucide-react';
import { Button } from '~/components/atoms/Button';

interface PaymentDetailsCardProps {
  paymentData: {
    subTotal: string;
    taxAmount: string;
    grandTotal: string;
  };
  onPayNow: () => void;
  isProcessing?: boolean;
}

export function PaymentDetailsCard({ paymentData, onPayNow, isProcessing = false }: PaymentDetailsCardProps) {
  return (
    <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-50 rounded-[12px] flex items-center justify-center">
          <CreditCard className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-brand-dark text-lg font-bold">Payment Details</h3>
          <p className="text-brand-light text-sm">Course pricing and payment breakdown</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-brand-light text-base">Sub Total</span>
          <span className="text-brand-dark text-base font-medium">{paymentData.subTotal}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-brand-light text-base">Tax (11%)</span>
          <span className="text-brand-dark text-base font-medium">{paymentData.taxAmount}</span>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-brand-dark text-xl font-bold">Grand Total</span>
            <span className="text-brand-dark text-xl font-bold">{paymentData.grandTotal}</span>
          </div>
        </div>
      </div>

      {/* Payment Provider Info */}
      <div className="mb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="text-brand-light text-sm">SSL encrypted transactions</span>
          </div>
          <div className="flex items-center gap-3">
            <CreditCard className="w-4 h-4 text-green-600" />
            <span className="text-brand-light text-sm">Multiple payment methods</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-green-600" />
            <span className="text-brand-light text-sm">Instant confirmation</span>
          </div>
        </div>
      </div>

      {/* Pay Now Button */}
      <Button
        onClick={onPayNow}
        variant="primary"
        disabled={isProcessing}
        className="w-full px-6 py-4 text-lg font-semibold"
      >
        {isProcessing ? 'Processing Payment...' : 'Pay Now'}
      </Button>

      <div className="mt-4 text-center">
        <p className="text-brand-light text-xs">
          By proceeding, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}