import { useState } from 'react';
import { Bell, MessageCircle, Settings, ChevronDown, ArrowLeft, LogOut, User } from 'lucide-react';
import { Link } from 'react-router';
import { useUser } from '~/hooks/useUser';
import { authService } from '~/services/auth.service';
import { Avatar } from '~/components/atoms/Avatar';

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
  const { getFullName, getRoleName, getAvatar, getEmail } = useUser();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

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

  const renderActionButtons = () => {
    if (!showActions) return null;

    return (
      <div className="flex items-center gap-3">
        <button className="w-10 h-10 rounded-full border border-[#DCDEDD] flex items-center justify-center hover:border-[#0C51D9] hover:border-2 transition-all duration-200 cursor-pointer" type="button">
          <Bell className="w-5 h-5 text-gray-600" />
        </button>
        <button className="w-10 h-10 rounded-full border border-[#DCDEDD] flex items-center justify-center hover:border-[#0C51D9] hover:border-2 transition-all duration-200 cursor-pointer" type="button">
          <MessageCircle className="w-5 h-5 text-gray-600" />
        </button>
        <button className="w-10 h-10 rounded-full border border-[#DCDEDD] flex items-center justify-center hover:border-[#0C51D9] hover:border-2 transition-all duration-200 cursor-pointer" type="button">
          <Settings className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    );
  };

  const renderUserProfile = () => {
    if (!showUserProfile) return null;

    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-1 transition-colors cursor-pointer"
          type="button"
        >
          <Avatar
            src={getAvatar() || undefined}
            name={getFullName()}
            size="md"
          />
          <div className="text-left">
            <p className="text-brand-dark text-base font-semibold">{getFullName()}</p>
            <p className="text-brand-dark text-base font-normal leading-7">{getRoleName()}</p>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div className="py-2">
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                type="button"
              >
                <User className="w-4 h-4" />
                Profile
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                type="button"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <hr className="my-2 border-gray-200" />
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                type="button"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    );
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
          {renderActionButtons()}

          {/* Divider */}
          {showActions && showUserProfile && (
            <div className="w-px h-8 bg-[#DCDEDD] mx-5"></div>
          )}

          {renderUserProfile()}
        </div>
      </div>
    </header>
  );
}