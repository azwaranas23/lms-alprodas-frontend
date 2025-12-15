import { useState } from 'react';
import { Bell, MessageCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';
import { useUser } from '~/hooks/useUser';
import { authService } from '~/services/auth.service';
import { UserProfileDropdown } from '~/components/molecules/UserProfileDropdown';

interface BackButton {
  onClick?: () => void;
  to?: string;
  label: string;
}

interface BaseHeaderProps {
  title: string;
  subtitle: string;
  backButton?: BackButton;
  variant?: 'normal' | 'wizard' | 'learning';
  showActions?: boolean;
  showUserProfile?: boolean;
  className?: string;
}

export function BaseHeader({
  title,
  subtitle,
  backButton,
  variant = 'normal',
  showActions = true,
  showUserProfile = true,
  className = ''
}: BaseHeaderProps) {
  const { getFullName } = useUser();


  // Variant-specific styling
  const getHeaderClasses = () => {
    const baseClasses = "page-header bg-white border-b border-[#DCDEDD] px-5 py-4";

    switch (variant) {
      case 'wizard':
        return `${baseClasses} shadow-sm`;
      case 'learning':
        return `${baseClasses} bg-gray-50 border-gray-200`;
      default:
        return baseClasses;
    }
  };

  const renderBackButton = () => {
    if (!backButton) return null;

    const buttonContent = (
      <div className="border border-[#DCDEDD] rounded-[8px] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 px-3 py-2 flex items-center gap-2 cursor-pointer">
        <ArrowLeft className="w-4 h-4 text-gray-600" />
        <span className="text-brand-dark text-base font-semibold">{backButton.label}</span>
      </div>
    );

    if (backButton.to) {
      return (
        <Link to={backButton.to}>
          {buttonContent}
        </Link>
      );
    }

    return (
      <div onClick={backButton.onClick}>
        {buttonContent}
      </div>
    );
  };

  const renderUserProfile = () => {
    if (!showUserProfile) return null;

    return <UserProfileDropdown />;
  };

  return (
    <header className={`${getHeaderClasses()} ${className}`}>
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {renderBackButton()}
          <div>
            <h2 className="text-brand-dark text-2xl font-extrabold">{title}</h2>
            <p className="text-brand-light text-sm font-normal mt-1">{subtitle}</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {renderUserProfile()}
        </div>
      </div>
    </header>
  );
}