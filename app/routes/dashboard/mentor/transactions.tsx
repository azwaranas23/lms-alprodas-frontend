import { MentorLayout } from "~/components/templates/MentorLayout";
import { MentorTransactionsList } from "~/features/mentors/components/MentorTransactionsList";

export function meta() {
  return [
    { title: "My Transactions - LMS Alprodas" },
    {
      name: "description",
      content: "Monitor and manage all course purchase transactions",
    },
  ];
}

export default function MentorTransactionsPage() {
  return (
    <MentorLayout
      title="Transaction Management"
      subtitle="Monitor and manage all course purchase transactions"
    >
      <MentorTransactionsList />
    </MentorLayout>
  );
}
