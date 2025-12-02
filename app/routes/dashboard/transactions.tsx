import type { Route } from "./+types/transactions";
import { Layout } from "~/components/templates/Layout";
import { PermissionRoute } from "~/features/auth/components/PermissionRoute";
import { TransactionsList } from "~/features/transactions/components/TransactionsList";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Transactions Management - LMS Alprodas" },
    {
      name: "description",
      content: "Monitor and manage all course purchase transactions",
    },
  ];
}

export default function TransactionsPage() {
  return (
    <PermissionRoute requiredPermission="transactions.read">
      <Layout
        title="Transaction Management"
        subtitle="Monitor and manage all course purchase transactions"
      >
        <TransactionsList />
      </Layout>
    </PermissionRoute>
  );
}
