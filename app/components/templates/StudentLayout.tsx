import { type ReactNode } from 'react';
import { StudentSidebar } from './StudentSidebar';
import { BaseHeader } from './BaseHeader';

interface StudentLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function StudentLayout({ children, title, subtitle }: StudentLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <div className="flex h-screen">
        <StudentSidebar />
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