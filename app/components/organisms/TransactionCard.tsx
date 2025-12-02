import { Eye } from 'lucide-react';
import { TransactionStatusBadge, type TransactionStatus } from '~/components/atoms/TransactionStatusBadge';
import { Button } from '../atoms/Button';
import { Avatar } from '../atoms/Avatar';
import { Image } from '../atoms/Image';
import { Card } from '../molecules/Card';
import { Tooltip } from '../atoms/Tooltip';
import { getAvatarSrc } from '~/utils/formatters';

export interface Transaction {
  id: string;
  courseTitle: string;
  courseCategory: string;
  courseImage: string;
  totalAmount: string;
  studentName: string;
  studentEmail: string;
  studentAvatar: string;
  status: TransactionStatus;
}

interface TransactionCardProps {
  transaction: Transaction;
  onViewDetails?: (transactionId: string) => void;
  context?: 'mentor' | 'student';
}

export function TransactionCard({ transaction, onViewDetails, context = 'mentor' }: TransactionCardProps) {
  const handleDetailsClick = () => {
    onViewDetails?.(transaction.id);
  };

  return (
    <Card hover className="p-4">
      <div className="flex items-center gap-16">
        {/* Course Info Section */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          {/* Course Thumbnail */}
          <div className="w-32 h-24 bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden rounded-[12px] flex-shrink-0">
            <Image
              src={transaction.courseImage}
              alt={transaction.courseTitle}
              className="w-full h-full object-cover rounded-[12px]"
              imageType="course"
              identifier={transaction.id}
            />
          </div>
          
          {/* Course Info */}
          <div className="flex flex-col min-w-0 flex-1">
            <Tooltip content={transaction.courseTitle} align="left">
              <h5 className="text-brand-dark text-lg font-bold leading-tight truncate mb-1">
                {transaction.courseTitle}
              </h5>
            </Tooltip>
            <Tooltip content={transaction.courseCategory} align="left">
              <p className="text-sm text-gray-600 truncate">{transaction.courseCategory}</p>
            </Tooltip>
          </div>
        </div>

        {/* Total Amount */}
        <div className="flex flex-col text-right min-w-[120px] flex-shrink-0">
          <p className="text-sm text-gray-600">Total Amount</p>
          <Tooltip content={transaction.totalAmount} align="right">
            <p className="text-lg font-bold text-brand-dark truncate">{transaction.totalAmount}</p>
          </Tooltip>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 min-w-[180px] flex-shrink-0">
          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
            <img
              src={getAvatarSrc(transaction.studentAvatar, transaction.studentName)}
              alt={transaction.studentName}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = getAvatarSrc(undefined, transaction.studentName);
              }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <Tooltip content={transaction.studentName} align="center">
              <h4 className="text-brand-dark text-base font-semibold leading-tight truncate">
                {transaction.studentName}
              </h4>
            </Tooltip>
            <Tooltip content={transaction.studentEmail} align="center">
              <p className="text-sm text-gray-600 truncate">{transaction.studentEmail}</p>
            </Tooltip>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className="flex-shrink-0">
          <TransactionStatusBadge status={transaction.status} />
        </div>
        
        {/* Details Button */}
        <div className="flex-shrink-0">
          <Button
            variant="primary"
            onClick={handleDetailsClick}
            className="px-4 py-2"
            size="sm"
          >
            <Eye className="w-4 h-4 text-white" />
            <span className="text-brand-white text-sm font-semibold">Details</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}