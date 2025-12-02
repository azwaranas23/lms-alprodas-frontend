import { Navbar } from '~/components/organisms/Navbar';
import { Logo } from '~/components/atoms/Logo';
import { LoginForm } from '~/components/organisms/LoginForm';
import { SocialLoginButtons } from '~/components/molecules/SocialLoginButtons';
import { GuestRoute } from "~/features/auth/components/GuestRoute";

export function LoginPage() {
  return (
    <GuestRoute>
      <div className="min-h-screen" style={{ background: '#F9F9F9' }}>
        <Navbar />

        <div className="flex" style={{ minHeight: 'calc(100vh - 80px)' }}>
          <div className="hidden lg:flex lg:w-1/2 relative">
            <img
              src="https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Modern office workspace"
              className="object-cover w-full h-full"
            />
          </div>

          <div className="w-full lg:w-1/2 flex items-center justify-center" style={{ padding: '20px' }}>
            <div className="w-full max-w-md space-y-8">
              <Logo variant="form" />
              <LoginForm />
              <SocialLoginButtons />
            </div>
          </div>
        </div>
      </div>
    </GuestRoute>
  );
}