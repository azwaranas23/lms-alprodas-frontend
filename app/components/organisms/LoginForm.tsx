import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { useLogin } from '~/hooks/useAuth';
import { loginSchema, type LoginFormData } from '~/schemas/auth';
import { ApiErrorMessage } from '~/components/atoms/ApiErrorMessage';

export function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [rememberMe, setRememberMe] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  const loginMutation = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Form submitted, preventing default');
    setValidationErrors({});
    setHasSubmitted(true);

    // Validate form data with Zod
    const validation = loginSchema.safeParse(formData);
    
    if (!validation.success) {
      // Handle Zod validation errors
      const errors: Record<string, string> = {};
      
      // In Zod v4, use 'issues' instead of 'errors'
      if (validation.error?.issues && Array.isArray(validation.error.issues)) {
        validation.error.issues.forEach((issue) => {
          const field = issue.path?.[0] as string;
          if (field) {
            // Only set first error for each field
            if (!errors[field]) {
              errors[field] = issue.message;
            }
          }
        });
      }
      
      setValidationErrors(errors);
      return; // Don't proceed if validation fails
    }

    // If validation passes, submit to API
    loginMutation.mutate(validation.data);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    if (loginMutation.isError) {
      loginMutation.reset();
    }
  };

  return (
    <>
      {loginMutation.isError && (
        <ApiErrorMessage
          title="Invalid Credentials"
          message={loginMutation.error?.response?.data?.message || 'The email or password you entered is incorrect. Please try again.'}
        />
      )}

      <form className="space-y-6" onSubmit={handleSubmit} method="post">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block mb-2 text-gray-600 text-sm font-semibold">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              disabled={loginMutation.isPending}
              className={`w-full pl-10 pr-4 py-3 bg-white border rounded-[16px] transition-all duration-300 ${
                validationErrors.email
                  ? 'border-[#DC2626] border-2'
                  : 'border-[#DCDEDD] hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2 focus:bg-white'
              }`}
              placeholder="Enter your email"
            />
          </div>
          {validationErrors.email && (
            <div className="mt-2">
              <p className="text-danger text-sm font-normal">
                {validationErrors.email}
              </p>
            </div>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block mb-2 text-gray-600 text-sm font-semibold">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={formData.password}
              onChange={handleInputChange}
              disabled={loginMutation.isPending}
              className={`w-full pl-10 pr-4 py-3 bg-white border rounded-[16px] transition-all duration-300 ${
                validationErrors.password
                  ? 'border-[#DC2626] border-2'
                  : 'border-[#DCDEDD] hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2 focus:bg-white'
              }`}
              placeholder="Enter your password"
            />
          </div>
          {validationErrors.password && (
            <div className="mt-2">
              <p className="text-danger text-sm font-normal">
                {validationErrors.password}
              </p>
            </div>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={loginMutation.isPending}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="remember" className="ml-2 text-brand-light text-sm font-normal">
              Remember me
            </label>
          </div>
          <a href="#" className="text-blue-500 text-sm font-semibold hover:brightness-110 transition-all duration-300">
            Forgot password?
          </a>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="btn-primary rounded-[8px] border border-[#2151A0] hover:brightness-110 focus:ring-2 focus:ring-[#0C51D9] transition-all duration-300 blue-gradient blue-btn-shadow px-4 py-3 flex items-center gap-2 w-full justify-center text-brand-white text-sm font-semibold"
        >
          {loginMutation.isPending ? (
            <>
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing In...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 3H21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 3L13 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 8V19C16 19.5304 15.7893 20.0391 15.4142 20.4142C15.0391 20.7893 14.5304 21 14 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V10C3 9.46957 3.21071 8.96086 3.58579 8.58579C3.96086 8.21071 4.46957 8 5 8H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Sign In to Dashboard
            </>
          )}
        </button>
      </form>
    </>
  );
}