import type { Route } from "./+types/overview";
import MentorDashboard from "./dashboard";
import { MentorRoute } from "~/features/auth/components/RoleBasedRoute";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Mentor Dashboard - Alprodas LMS" },
    {
      name: "description",
      content: "Monitor your mentor performance and student progress",
    },
  ];
}

export default function MentorOverviewPage() {
  return (
    <MentorRoute>
      <MentorDashboard />
    </MentorRoute>
  );
}
