import { formatCurrency, formatCurrencyCompact, formatDate } from '~/utils/formatters';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';
import { Image } from '../atoms/Image';

interface Transaction {
  id: number;
  order_id: string;
  amount: number;
  status: string;
  payment_method: string;
  transaction_date: string;
  course: {
    id: number;
    title: string;
    image?: string;
  };
  student: {
    id: number;
    name: string;
    email: string;
  };
}

interface TransactionItemProps {
  transaction: Transaction;
  onDetailsClick?: (id: number) => void;
  showDetailsButton?: boolean;
  useCompactCurrency?: boolean;
}

const getBadgeVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "success":
    case "paid":
      return "success";
    case "pending":
      return "pending";
    case "failed":
      return "failed";
    default:
      return "success";
  }
};

export function TransactionItem({
  transaction,
  onDetailsClick,
  showDetailsButton = true,
  useCompactCurrency = false
}: TransactionItemProps) {
  const handleDetailsClick = () => {
    onDetailsClick?.(transaction.id);
  };

  const amount = useCompactCurrency
    ? formatCurrencyCompact(transaction.amount)
    : formatCurrency(transaction.amount);

  return (
    <div className="flex items-center gap-3">
      <Image
        src={transaction.course.image}
        alt={transaction.course.title}
        className="w-24 h-16 rounded-lg object-cover"
        imageType="course"
        identifier={transaction.course.id.toString()}
      />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="text-brand-dark text-lg font-bold">
            {transaction.course.title}
          </p>
          <Badge variant={getBadgeVariant(transaction.status)}>
            {transaction.status}
          </Badge>
        </div>
        <p className="text-brand-dark text-sm font-normal mt-1">
          {formatDate(transaction.transaction_date)} • {amount}
        </p>
      </div>
      {showDetailsButton && (
        <Button
          variant="outline"
          onClick={handleDetailsClick}
          className="py-[14px] px-5"
        >
          Details
        </Button>
      )}
    </div>
  );
}