import { type ReactNode, useState } from "react";
import { BaseSidebar } from "./BaseSidebar";
import { BaseHeader } from "./BaseHeader";

interface BackButton {
  onClick?: () => void;
  to?: string;
  label: string;
}

interface LayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  backButton?: BackButton;
  variant?: "normal" | "wizard" | "learning";
}

export function Layout({
  children,
  title,
  subtitle,
  backButton,
  variant = "normal",
}: LayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <div className="flex h-screen">
        <BaseSidebar
          variant={variant}
          isCollapsed={isSidebarCollapsed}
          toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          {(title || subtitle) && (
            <BaseHeader
              title={title || ""}
              subtitle={subtitle || ""}
              backButton={backButton}
              variant={variant}
            />
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
