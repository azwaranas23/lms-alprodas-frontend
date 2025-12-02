import { StudentLayout } from "~/components/templates/StudentLayout";
import { StudentTransactionsList } from "~/features/students/components/StudentTransactionsList";

export function meta() {
  return [
    { title: "My Transactions - LMS Alprodas" },
    {
      name: "description",
      content: "View and track your course purchase history",
    },
  ];
}

export default function StudentTransactionsPage() {
  return (
    <StudentLayout
      title="My Transactions"
      subtitle="View and track your course purchase history"
    >
      <StudentTransactionsList />
    </StudentLayout>
  );
}
