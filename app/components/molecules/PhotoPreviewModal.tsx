import { Image as ImageIcon } from 'lucide-react';
import { Modal } from './Modal';

export interface PhotoPreviewModalProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

export function PhotoPreviewModal({
  isOpen,
  imageUrl,
  onClose,
  title = "Photo Preview",
  subtitle = "Preview of your selected image"
}: PhotoPreviewModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      icon={<ImageIcon className="w-6 h-6 text-blue-600" />}
      size="lg"
    >
      <div className="flex items-center justify-center">
        <img
          src={imageUrl}
          alt={title}
          className="max-w-full max-h-[60vh] object-contain rounded-[16px]"
        />
      </div>
    </Modal>
  );
}