import type { Route } from "./+types/login";
import { LoginPage } from "~/components/pages/LoginPage";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Login - Alprodas LMS" },
    {
      name: "description",
      content: "Login to access your Alprodas LMS learning dashboard",
    },
    { name: "viewport", content: "width=device-width, initial-scale=1.0" },
  ];
}

export default function Login() {
  return <LoginPage />;
}
