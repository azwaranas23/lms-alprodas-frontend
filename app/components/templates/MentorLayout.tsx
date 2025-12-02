import { type ReactNode } from 'react';
import { MentorSidebar } from './MentorSidebar';
import { BaseHeader } from './BaseHeader';

interface MentorLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function MentorLayout({ children, title, subtitle }: MentorLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <div className="flex h-screen">
        <MentorSidebar />
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