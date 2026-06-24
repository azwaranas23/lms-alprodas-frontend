import { BaseHeader } from './BaseHeader';

interface BackButton {
  onClick: () => void;
  label: string;
}

interface DynamicHeaderProps {
  title: string;
  subtitle: string;
  backButton?: BackButton;
}

export function DynamicHeader({ title, subtitle, backButton }: Readonly<DynamicHeaderProps>) {
  return (
    <BaseHeader
      title={title}
      subtitle={subtitle}
      backButton={backButton}
      variant="normal"
    />
  );
}