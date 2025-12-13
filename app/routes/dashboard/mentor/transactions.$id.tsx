import { useParams } from "react-router";
import { MentorLayout } from "~/components/templates/MentorLayout";
import { TransactionDetails } from "~/features/transactions/components/TransactionDetails";

export function meta() {
  return [
    { title: "Transaction Details - Alprodas LMS" },
    {
      name: "description",
      content: "Complete transaction information and payment details",
    },
  ];
}

export default function MentorTransactionDetailsPage() {
  const { id } = useParams();

  if (!id) {
    return <div>Transaction not found</div>;
  }

  return (
    <MentorLayout>
      <TransactionDetails transactionId={id} />
    </MentorLayout>
  );
}
