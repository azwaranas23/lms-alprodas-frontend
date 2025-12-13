import { useParams } from "react-router";
import type { Route } from "./+types/transactions.$id";
import { Layout } from "~/components/templates/Layout";
import { PermissionRoute } from "~/features/auth/components/PermissionRoute";
import { TransactionDetails } from "~/features/transactions/components/TransactionDetails";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Transaction Details - Alprodas LMS" },
    {
      name: "description",
      content: "View detailed transaction information and payment details",
    },
  ];
}

export default function TransactionDetailPage() {
  const { id } = useParams();

  if (!id) {
    return (
      <PermissionRoute requiredPermission="transactions.read">
        <Layout>
          <main className="main-content flex-1 overflow-auto p-5">
            <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
              <div className="text-center py-10">
                <p className="text-red-500">Transaction not found</p>
              </div>
            </div>
          </main>
        </Layout>
      </PermissionRoute>
    );
  }

  return (
    <PermissionRoute requiredPermission="transactions.read">
      <Layout>
        <TransactionDetails transactionId={id} />
      </Layout>
    </PermissionRoute>
  );
}
