import { LatestTransactions as BaseLatestTransactions } from '~/components/organisms/LatestTransactions';

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
  onTransactionDetails?: (id: string) => void;
}

export function LatestTransactions({ transactions, onTransactionDetails }: LatestTransactionsProps) {
  const handleDetailsClick = (id: number | string) => {
    if (onTransactionDetails) {
      onTransactionDetails(id.toString());
    }
  };

  return (
    <BaseLatestTransactions
      transactions={transactions}
      onTransactionDetails={handleDetailsClick}
      title="Latest Transactions"
      showDetailsButton={true}
      useCompactCurrency={true}
    />
  );
}