import { Download, Mail, User, BookOpen, CreditCard, CheckCircle, Clock, Headphones, MessageCircle, Undo, Calendar, Receipt } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { TransactionStatusBadge, type TransactionStatus } from '~/components/atoms/TransactionStatusBadge';
import { Header } from '~/components/templates/Header';
import { Button } from '~/components/atoms/Button';
import { Tooltip } from '~/components/atoms/Tooltip';
import { transactionsService } from '~/services/transactions.service';
import { QUERY_KEYS } from '~/constants/api';
import { getAvatarSrc, formatCurrency, formatDate } from '~/utils/formatters';
import { Image } from '~/components/atoms/Image';

interface TimelineItem {
  id: string;
  title: string;
  timestamp: string;
  status: 'completed' | 'processed' | 'initiated';
  color: 'green' | 'blue' | 'yellow';
  icon: 'check-circle' | 'credit-card' | 'clock';
}

interface TransactionDetailsProps {
  transactionId: string;
}

const mockTimeline: TimelineItem[] = [
  {
    id: '1',
    title: 'Payment Completed',
    timestamp: 'January 15, 2025, 09:15 AM',
    status: 'completed',
    color: 'green',
    icon: 'check-circle'
  },
  {
    id: '2',
    title: 'Payment Processed',
    timestamp: 'January 15, 2025, 09:14 AM',
    status: 'processed',
    color: 'blue',
    icon: 'credit-card'
  },
  {
    id: '3',
    title: 'Order Created',
    timestamp: 'January 15, 2025, 09:10 AM',
    status: 'initiated',
    color: 'yellow',
    icon: 'clock'
  }
];

export function TransactionDetails({ transactionId }: TransactionDetailsProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const { data: transactionData, isLoading, error } = useQuery({
    queryKey: [...QUERY_KEYS.transactions.mentor, 'detail', transactionId],
    queryFn: () => transactionsService.getTransactionById(Number(transactionId)),
    enabled: !!transactionId,
  });


  const transaction = transactionData?.data;

  const handleBack = () => {
    // Check context and navigate accordingly
    if (location.pathname.includes('/mentor/transactions')) {
      navigate('/dashboard/mentor/transactions');
    } else if (location.pathname.includes('/student/transactions')) {
      navigate('/dashboard/student/transactions');
    } else {
      navigate('/dashboard/transactions');
    }
  };

  if (isLoading) {
    return (
      <>
        <Header
          title="Transaction Details"
          subtitle="Loading transaction information..."
          backButton={{
            onClick: handleBack,
            label: 'Back'
          }}
        />
        <main className="main-content flex-1 overflow-auto p-5">
          <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-500">Loading transaction details...</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (error || !transaction) {
    return (
      <>
        <Header
          title="Transaction Details"
          subtitle="Error loading transaction information"
          backButton={{
            onClick: handleBack,
            label: 'Back'
          }}
        />
        <main className="main-content flex-1 overflow-auto p-5">
          <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
            <div className="text-center py-10">
              <p className="text-red-500">Error loading transaction details. Please try again later.</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  const handleDownloadReceipt = () => {
    console.log('Downloading receipt...');
  };

  const handleSendToStudent = () => {
    console.log('Sending receipt to student...');
  };

  const handleContactSupport = () => {
    console.log('Contacting support...');
  };

  const handleInitiateRefund = () => {
    console.log('Initiating refund...');
  };

  const getTimelineIcon = (iconType: string) => {
    switch (iconType) {
      case 'check-circle': return CheckCircle;
      case 'credit-card': return CreditCard;
      case 'clock': return Clock;
      default: return Clock;
    }
  };

  return (
    <>
      <Header 
        title="Transaction Details" 
        subtitle="Complete transaction information and payment details"
        backButton={{
          onClick: handleBack,
          label: 'Back'
        }}
      />
      
      <main className="main-content flex-1 overflow-auto p-5">
        {/* Transaction Header */}
        <div className="bg-white border border-[#DCDEDD] rounded-[20px] mb-6 p-6">
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-brand-dark text-3xl font-extrabold">{transaction.order_id}</h1>
                <TransactionStatusBadge status={transaction.status.toLowerCase() as TransactionStatus} />
              </div>
              <div className="flex items-center gap-6 text-base text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(transaction.transaction_date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  <span>{transaction.payment_method ? transaction.payment_method.replace(/_/g, ' ').toUpperCase() : 'Pending Payment'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4" />
                  <span>{transaction.order_id}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="primary"
                onClick={handleDownloadReceipt}
                className="px-6 py-3"
              >
                <Download className="w-4 h-4 text-white" />
                <span className="text-brand-white text-sm font-semibold">Download Receipt</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleSendToStudent}
                className="py-3 px-6"
              >
                <Mail className="w-4 h-4" />
                Send to Student
              </Button>
            </div>
          </div>
        </div>

      {/* Information Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Student Information */}
        <div className="bg-white border border-[#DCDEDD] rounded-[16px] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-[12px] flex items-center justify-center">
              <User className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-brand-dark text-lg font-bold">Student Information</h3>
              <p className="text-brand-light text-sm">Student profile and contact details</p>
            </div>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={getAvatarSrc(transaction.student.profile?.avatar, transaction.student.name)}
                alt={transaction.student.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = getAvatarSrc(undefined, transaction.student.name);
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <Tooltip content={transaction.student.name} align="left">
                <h4 className="text-brand-dark text-lg font-bold truncate">{transaction.student.name}</h4>
              </Tooltip>
              <Tooltip content={transaction.student.email} align="left">
                <p className="text-brand-light text-base truncate">{transaction.student.email}</p>
              </Tooltip>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center gap-4">
              <span className="text-brand-light text-base flex-shrink-0">Email</span>
              <Tooltip content={transaction.student.email} align="right" className="min-w-0 flex-1 text-right">
                <span className="text-brand-dark text-base font-medium truncate block">{transaction.student.email}</span>
              </Tooltip>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-brand-light text-base flex-shrink-0">Gender</span>
              <span className="text-brand-dark text-base font-medium">{transaction.student.profile?.gender || 'Not specified'}</span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-brand-light text-base flex-shrink-0">Role</span>
              <span className="text-brand-dark text-base font-medium">Student</span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-brand-light text-base flex-shrink-0">Bio</span>
              <Tooltip content={transaction.student.profile?.bio || 'Not provided'} align="right" className="min-w-0 flex-1 text-right">
                <span className="text-brand-dark text-base font-medium truncate block">{transaction.student.profile?.bio || 'Not provided'}</span>
              </Tooltip>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-brand-light text-base flex-shrink-0">Expertise</span>
              <Tooltip content={transaction.student.profile?.expertise || 'Not specified'} align="right" className="min-w-0 flex-1 text-right">
                <span className="text-brand-dark text-base font-medium truncate block">{transaction.student.profile?.expertise || 'Not specified'}</span>
              </Tooltip>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-brand-light text-base flex-shrink-0">Experience</span>
              <span className="text-brand-dark text-base font-medium">{transaction.student.profile?.experience_years ? `${transaction.student.profile.experience_years} years` : 'Not specified'}</span>
            </div>
          </div>
        </div>

        {/* Course Information */}
        <div className="bg-white border border-[#DCDEDD] rounded-[16px] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-teal-50 rounded-[12px] flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h3 className="text-brand-dark text-lg font-bold">Course Information</h3>
              <p className="text-brand-light text-sm">Course details and specifications</p>
            </div>
          </div>
          <div className="mb-4">
            <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden rounded-[12px] mb-3">
              <Image
                src={transaction.course.image}
                alt={transaction.course.title}
                className="w-full h-full object-cover rounded-[12px]"
                imageType="course"
                identifier={transaction.id.toString()}
              />
            </div>
            <div className="min-w-0">
              <Tooltip content={transaction.course.title} align="left">
                <h4 className="text-brand-dark text-lg font-bold mb-1 truncate">{transaction.course.title}</h4>
              </Tooltip>
              <Tooltip content={transaction.course.subject?.name || 'Web Development'} align="left">
                <p className="text-brand-light text-base truncate">{transaction.course.subject?.name || 'Web Development'}</p>
              </Tooltip>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center gap-4">
              <span className="text-brand-light text-base flex-shrink-0">Description</span>
              <Tooltip content={transaction.course.description || 'No description available'} align="right" className="min-w-0 flex-1 text-right">
                <span className="text-brand-dark text-base font-medium truncate block">{transaction.course.description || 'No description available'}</span>
              </Tooltip>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-brand-light text-base flex-shrink-0">Instructor</span>
              <Tooltip content={transaction.course.mentor?.name || 'Not specified'} align="right" className="min-w-0 flex-1 text-right">
                <span className="text-brand-dark text-base font-medium truncate block">{transaction.course.mentor?.name || 'Not specified'}</span>
              </Tooltip>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-brand-light text-base flex-shrink-0">Instructor Expertise</span>
              <Tooltip content={transaction.course.mentor?.profile?.expertise || 'Not specified'} align="right" className="min-w-0 flex-1 text-right">
                <span className="text-brand-dark text-base font-medium truncate block">{transaction.course.mentor?.profile?.expertise || 'Not specified'}</span>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Details and Transaction Status Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Payment Details */}
        <div className="bg-white border border-[#DCDEDD] rounded-[16px] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-[12px] flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-brand-dark text-lg font-bold">Payment Details</h3>
              <p className="text-brand-light text-sm">Breakdown and payment information</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-brand-light text-base">Sub Total</span>
              <span className="text-brand-dark text-base font-medium">{formatCurrency(transaction.base_price)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-brand-light text-base">Tax (11%)</span>
              <span className="text-brand-dark text-base font-medium">{formatCurrency(transaction.ppn_amount)}</span>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-brand-dark text-lg font-bold">Grand Total</span>
                <span className="text-brand-dark text-lg font-bold">{formatCurrency(transaction.amount)}</span>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-brand-light text-base">Payment Provider</span>
                <span className="text-brand-dark text-base font-medium">Midtrans Payment Gateway</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-light text-base">Payment Method</span>
                <span className="text-brand-dark text-base font-medium">{transaction.payment_method ? transaction.payment_method.replace(/_/g, ' ').toUpperCase() : 'Pending'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-light text-base">Transaction Fee</span>
                <span className="text-brand-dark text-base font-medium">{formatCurrency(transaction.platform_fee)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Status */}
        <div className="bg-white border border-[#DCDEDD] rounded-[16px] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-[12px] flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-brand-dark text-lg font-bold">Transaction Status</h3>
              <p className="text-brand-light text-sm">Current status and payment confirmation</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-brand-light text-base">Current Status</span>
              <TransactionStatusBadge status={transaction.status.toLowerCase() as TransactionStatus} />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-brand-light text-base">Payment Confirmed</span>
              <span className="text-brand-dark text-base font-medium">{transaction.paid_at ? formatDate(transaction.paid_at) : 'Payment pending'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-brand-light text-base">Processing Time</span>
              <span className="text-brand-dark text-base font-medium">Processed instantly</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-brand-light text-base">Course Access</span>
              <span className="text-success text-base font-medium">{transaction.status === 'PAID' ? 'Full access granted' : 'Access pending payment'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-brand-light text-base">Certificate</span>
              <span className="text-brand-dark text-base font-medium">{transaction.status === 'PAID' ? 'Available upon course completion' : 'Available after payment'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-brand-light text-base">Refund Policy</span>
              <span className="text-brand-dark text-base font-medium">30-day money back guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Timeline and Support Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Timeline */}
        <div className="bg-white border border-[#DCDEDD] rounded-[16px] p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-50 rounded-[12px] flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-brand-dark text-lg font-bold">Transaction Timeline</h3>
              <p className="text-brand-light text-sm">Complete transaction history and updates</p>
            </div>
          </div>
          <div className="space-y-4">
            {mockTimeline.map((item) => {
              const IconComponent = getTimelineIcon(item.icon);
              const colorMap = {
                green: { bg: 'bg-green-50', border: 'border-green-200', dot: 'bg-green-500', text: 'text-green-600' },
                blue: { bg: 'bg-blue-50', border: 'border-blue-200', dot: 'bg-blue-500', text: 'text-blue-600' },
                yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', dot: 'bg-yellow-500', text: 'text-yellow-600' }
              };
              const colors = colorMap[item.color];

              return (
                <div key={item.id} className={`flex items-center gap-4 p-4 ${colors.bg} rounded-[12px] border ${colors.border}`}>
                  <div className={`w-3 h-3 ${colors.dot} rounded-full`}></div>
                  <div className="flex-1">
                    <p className="text-brand-dark text-base font-medium">{item.title}</p>
                    <p className="text-brand-light text-sm">{item.timestamp}</p>
                  </div>
                  <div className={`flex items-center gap-1 ${colors.text}`}>
                    <IconComponent className="w-4 h-4" />
                    <span className="text-sm font-medium capitalize">{item.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Support Actions */}
        <div className="bg-white border border-[#DCDEDD] rounded-[16px] p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-orange-50 rounded-[12px] flex items-center justify-center">
              <Headphones className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-brand-dark text-lg font-bold">Support Actions</h3>
              <p className="text-brand-light text-sm">Additional actions and customer support</p>
            </div>
          </div>
          <div className="flex flex-col gap-4 justify-between items-start">
            <div className="flex-1">
              <h4 className="text-brand-dark text-base font-bold mb-1">Need assistance with this transaction?</h4>
              <p className="text-brand-light text-sm">Contact our support team for any issues or questions regarding this purchase.</p>
            </div>
            <div className="flex flex-col gap-3 w-full">
              <Button
                variant="outline"
                onClick={handleContactSupport}
                className="w-full justify-center"
              >
                <MessageCircle className="w-4 h-4" />
                Contact Support
              </Button>
              <Button
                variant="danger"
                onClick={handleInitiateRefund}
                className="w-full justify-center"
              >
                <Undo className="w-4 h-4" />
                Initiate Refund
              </Button>
            </div>
          </div>
        </div>
      </div>
      </main>
    </>
  );
}