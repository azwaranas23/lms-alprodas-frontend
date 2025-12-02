import { useState, useRef } from 'react';
import { Camera, FolderOpen, X } from 'lucide-react';

interface ProfilePhotoUploadProps {
  onPhotoChange?: (file: File | null) => void;
}

export function ProfilePhotoUpload({ onPhotoChange }: ProfilePhotoUploadProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        console.error('File size must be less than 2MB');
        event.target.value = '';
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        console.error('Please select an image file');
        event.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = function(e) {
        if (e.target?.result) {
          setSelectedPhoto(e.target.result as string);
          onPhotoChange?.(file);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const deletePhoto = () => {
    setSelectedPhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onPhotoChange?.(null);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <label className="block text-brand-dark text-sm font-semibold mb-2">Profile Photo</label>
      <div className="flex items-center gap-4">
        <div className="w-32 h-32">
          {!selectedPhoto ? (
            <div className="w-32 h-32 bg-gray-100 border-2 border-dashed border-[#DCDEDD] rounded-full flex items-center justify-center">
              <Camera className="w-12 h-12 text-gray-400" />
            </div>
          ) : (
            <div className="relative w-32 h-32">
              <img
                src={selectedPhoto}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-2 border-[#DCDEDD]"
              />
              <button
                type="button"
                onClick={deletePhoto}
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handlePhotoSelect}
          />
          <button
            type="button"
            onClick={openFileDialog}
            className="border border-[#DCDEDD] rounded-[8px] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 px-4 py-2 flex items-center gap-2"
          >
            <FolderOpen className="w-4 h-4 text-gray-600" />
            <span className="text-brand-dark text-base font-semibold">Browse Photo</span>
          </button>
          <p className="text-brand-light text-xs">JPG, PNG up to 2MB</p>
        </div>
      </div>
    </div>
  );
}