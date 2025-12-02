export type TransactionStatus = 'paid' | 'pending' | 'failed';

interface TransactionStatusBadgeProps {
  status: TransactionStatus;
}

const statusConfig = {
  paid: {
    text: 'Paid',
    className: 'px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full'
  },
  pending: {
    text: 'Pending',
    className: 'px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full'
  },
  failed: {
    text: 'Failed',
    className: 'px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full'
  }
};

export function TransactionStatusBadge({ status }: TransactionStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={config.className}>
      {config.text}
    </span>
  );
}