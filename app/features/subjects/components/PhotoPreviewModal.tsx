import { PhotoPreviewModal as BasePhotoPreviewModal } from '~/components/molecules/PhotoPreviewModal';

interface PhotoPreviewModalProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
}

export function PhotoPreviewModal({ isOpen, imageUrl, onClose }: PhotoPreviewModalProps) {
  return (
    <BasePhotoPreviewModal
      isOpen={isOpen}
      imageUrl={imageUrl}
      onClose={onClose}
      title="Subject Photo Preview"
      subtitle="Preview of your selected subject image"
    />
  );
}