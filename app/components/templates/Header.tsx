import { BaseHeader } from './BaseHeader';

interface BackButton {
  onClick?: () => void;
  to?: string;
  label: string;
}

interface HeaderProps {
  title: string;
  subtitle: string;
  backButton?: BackButton;
}

export function Header({ title, subtitle, backButton }: HeaderProps) {
  return (
    <BaseHeader
      title={title}
      subtitle={subtitle}
      backButton={backButton}
      variant="normal"
    />
  );
}