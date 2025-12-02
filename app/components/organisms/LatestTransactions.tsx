import { Card } from '../molecules/Card';
import { TransactionItem } from '../molecules/TransactionItem';

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

interface LatestTransactionsProps {
  transactions: Transaction[];
  onTransactionDetails?: (id: number | string) => void;
  title?: string;
  showDetailsButton?: boolean;
  useCompactCurrency?: boolean;
}

export function LatestTransactions({
  transactions,
  onTransactionDetails,
  title = "Latest Transactions",
  showDetailsButton = true,
  useCompactCurrency = false
}: LatestTransactionsProps) {
  const handleDetailsClick = (id: number) => {
    onTransactionDetails?.(id);
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-brand-dark text-lg font-bold">{title}</h3>
      </div>
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            onDetailsClick={handleDetailsClick}
            showDetailsButton={showDetailsButton}
            useCompactCurrency={useCompactCurrency}
          />
        ))}
      </div>
    </Card>
  );
}