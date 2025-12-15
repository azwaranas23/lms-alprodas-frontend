import { type ReactNode, useState } from 'react';
import { StudentSidebar } from './StudentSidebar';
import { BaseHeader } from './BaseHeader';

interface StudentLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function StudentLayout({ children, title, subtitle }: StudentLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <div className="flex h-screen">
        <StudentSidebar
          isCollapsed={isSidebarCollapsed}
          toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          {(title || subtitle) && (
            <BaseHeader
              title={title || ''}
              subtitle={subtitle || ''}
            />
          )}
          {children}
        </div>
      </div>
    </div>
  );
}