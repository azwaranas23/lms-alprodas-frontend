import type { Route } from "./+types/overview";
import { Overview } from "~/features/dashboard/components/Overview";
import { PermissionRoute } from "~/features/auth/components/PermissionRoute";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard Overview - LMS Alprodas" },
    {
      name: "description",
      content: "Monitor your platform performance and learning metrics",
    },
  ];
}

export default function OverviewPage() {
  return (
    <PermissionRoute requiredPermission="dashboard.read">
      <Overview />
    </PermissionRoute>
  );
}
