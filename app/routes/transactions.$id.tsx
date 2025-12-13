import { useParams } from "react-router";
import type { Route } from "./+types/transactions.$id";
import { Layout } from "~/components/templates/Layout";
import { TransactionDetails } from "~/features/transactions/components/TransactionDetails";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Transaction Details - Alprodas LMS" },
    {
      name: "description",
      content: "View detailed transaction information and payment history",
    },
  ];
}

export default function TransactionDetailsPage() {
  const { id } = useParams();

  if (!id) {
    return <div>Transaction not found</div>;
  }

  return (
    <Layout>
      <TransactionDetails transactionId={id} />
    </Layout>
  );
}
