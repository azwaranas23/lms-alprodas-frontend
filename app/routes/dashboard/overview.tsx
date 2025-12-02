import type { Route } from "./+types/overview";
import { Overview } from "~/features/dashboard/components/Overview";
import { ManagerRoute } from "~/features/auth/components/RoleBasedRoute";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard Overview - LMS Alprodas" },
    {
      name: "description",
      content: "Monitor your platform performance and learning metrics",
    },
  ];
}

export default function DashboardOverviewPage() {
  return (
    <ManagerRoute>
      <Overview />
    </ManagerRoute>
  );
}
