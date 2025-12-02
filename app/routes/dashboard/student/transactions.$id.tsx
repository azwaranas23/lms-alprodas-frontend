import { useParams } from "react-router";
import { StudentLayout } from "~/components/templates/StudentLayout";
import { TransactionDetails } from "~/features/transactions/components/TransactionDetails";

export function meta() {
  return [
    { title: "Transaction Details - LMS Alprodas" },
    {
      name: "description",
      content: "Complete transaction information and payment details",
    },
  ];
}

export default function StudentTransactionDetailsPage() {
  const { id } = useParams();

  if (!id) {
    return (
      <StudentLayout
        title="Transaction Details"
        subtitle="Complete transaction information and payment details"
      >
        <main className="main-content flex-1 overflow-auto p-5">
          <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
            <div className="text-center py-10">
              <p className="text-red-500">Transaction not found</p>
            </div>
          </div>
        </main>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <TransactionDetails transactionId={id} />
    </StudentLayout>
  );
}
