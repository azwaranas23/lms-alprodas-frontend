import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Tag, FileText, ImagePlus, Eye, X as XIcon, Image, Upload, Plus, Save } from 'lucide-react';
import { Button } from '~/components/atoms/Button';
import { PhotoPreviewModal } from './PhotoPreviewModal';
import { type Topic } from '~/services/topics.service';
import { useCreateTopic, useUpdateTopic } from '~/hooks/api/useTopics';
import { BASE_URL } from '~/constants/api';
import { topicSchema, type TopicFormData } from '~/schemas/topics';
import { ApiErrorMessage } from '~/components/atoms/ApiErrorMessage';
import { ErrorMessage } from '~/components/atoms/ErrorMessage';
import { z } from 'zod';


interface TopicFormProps {
  mode: 'add' | 'edit';
  initialData?: Topic;
  onSubmit?: (data: FormData) => Promise<void>;
}

export function TopicForm({ mode, initialData, onSubmit }: TopicFormProps) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createTopicMutation = useCreateTopic();
  const updateTopicMutation = useUpdateTopic();
  
  const [formData, setFormData] = useState<TopicFormData>({
    id: initialData?.id,
    name: initialData?.name || '',
    description: initialData?.description || '',
    image: undefined
  });

  const [imagePreview, setImagePreview] = useState<string>(
    initialData?.image ? `${BASE_URL}${initialData.image}` : ''
  );
  const [showPhotoPreview, setShowPhotoPreview] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const loading = createTopicMutation.isPending || updateTopicMutation.isPending;

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Clear previous image validation errors
    setValidationErrors(prev => ({ ...prev, image: '' }));

    // Validate with Zod
    const imageValidation = z.instanceof(File)
      .refine((file) => file.size <= 2097152, 'File size must be less than 2MB')
      .refine((file) => file.type.startsWith('image/'), 'Please select a valid image file')
      .safeParse(file);

    if (!imageValidation.success) {
      const errorMessage = imageValidation.error.issues[0]?.message || 'Invalid file';
      setValidationErrors(prev => ({ ...prev, image: errorMessage }));
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      setFormData({ ...formData, image: file });
    };
    reader.readAsDataURL(file);
  };

  const resetImage = () => {
    setImagePreview('');
    setFormData({ ...formData, image: undefined });
    setValidationErrors(prev => ({ ...prev, image: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    // Validate form data with Zod
    const validationData = {
      name: formData.name,
      description: formData.description || undefined,
      image: formData.image
    };

    const validation = topicSchema.safeParse(validationData);

    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        errors[field] = issue.message;
      });
      setValidationErrors(errors);
      return;
    }

    const submitData = new FormData();
    submitData.append('name', formData.name);
    if (formData.description) {
      submitData.append('description', formData.description);
    }

    if (formData.image) {
      submitData.append('image', formData.image);
    }

    if (mode === 'add') {
      createTopicMutation.mutate(submitData, {
        onSuccess: () => {
          navigate('/dashboard/topics');
        },
        onError: (err: any) => {
          console.error('Error creating topic:', err);
          setValidationErrors({ submit: err.response?.data || 'Failed to save topic' });
        }
      });
    } else if (mode === 'edit' && formData.id) {
      updateTopicMutation.mutate(
        { id: formData.id, data: submitData },
        {
          onSuccess: () => {
            navigate('/dashboard/topics');
          },
          onError: (err: any) => {
            console.error('Error updating topic:', err);
            setValidationErrors({ submit: err.response?.data || 'Failed to save topic' });
          }
        }
      );
    }
  };

  return (
    <>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-50 rounded-[12px] flex items-center justify-center">
              {mode === 'add' ? (
                <Tag className="w-6 h-6 text-blue-600" />
              ) : (
                <Save className="w-6 h-6 text-blue-600" />
              )}
            </div>
            <div>
              <h3 className="text-brand-dark text-xl font-bold">
                {mode === 'add' ? 'Topic Information' : 'Edit Topic Information'}
              </h3>
              <p className="text-brand-light text-sm font-normal">
                {mode === 'add' ? 'Basic topic details and description' : 'Update topic details and description'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5">
            <div className="mb-4">
              <label className="block text-brand-dark text-base font-semibold mb-1">Topic Photo</label>
              <div className="flex items-start gap-4">
                <div className="w-64 h-42">
                  <div className="relative w-64 h-42">
                    <div className="w-64 h-42 absolute bg-gray-50 rounded-[16px] border-2 border-dashed border-[#DCDEDD]"></div>
                    
                    <div className="w-64 h-42 relative z-10 flex items-center justify-center rounded-[16px] overflow-hidden">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Topic Photo" className="w-64 h-42 object-cover rounded-[16px]" />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-gray-400 h-full">
                          <Image className="w-10 h-10 mb-2" />
                          <span className="text-sm font-medium">Topic Photo</span>
                        </div>
                      )}
                    </div>
                    
                    {!imagePreview && (
                      <div 
                        className="absolute inset-0 rounded-[16px] flex items-center justify-center transition-all duration-300 cursor-pointer z-20 group" 
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 rounded-[16px] transition-opacity duration-300"></div>
                        <Upload className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 relative z-10" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageSelect}
                  />
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    className="border border-[#DCDEDD] rounded-[8px] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 px-4 py-2 flex items-center gap-2"
                  >
                    <ImagePlus className="w-4 h-4 text-gray-600" />
                    <span className="text-brand-dark text-base font-semibold">
                      {mode === 'add' ? 'Select Photo' : 'Change Photo'}
                    </span>
                  </button>
                  {imagePreview && (
                    <button 
                      type="button" 
                      onClick={() => setShowPhotoPreview(true)}
                      className="border border-[#DCDEDD] rounded-[8px] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 px-4 py-2 flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                      <span className="text-brand-dark text-base font-semibold">Preview Photo</span>
                    </button>
                  )}
                  <button 
                    type="button" 
                    onClick={resetImage}
                    className="border border-[#DCDEDD] rounded-[8px] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 px-4 py-2 flex items-center gap-2"
                  >
                    <XIcon className="w-4 h-4 text-gray-600" />
                    <span className="text-brand-dark text-base font-semibold">Remove Photo</span>
                  </button>
                  <p className="text-brand-light text-xs">JPG, PNG up to 2MB (recommended: 640x424px)</p>
                  <ErrorMessage message={validationErrors.image} />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-brand-dark text-base font-semibold mb-1">Topic Name *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Tag className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    // Clear validation error when user starts typing
                    if (validationErrors.name) {
                      setValidationErrors(prev => ({ ...prev, name: '' }));
                    }
                  }}
                  className={`w-full pl-12 pr-4 py-3 bg-white border rounded-[16px] focus:bg-white transition-all duration-300 font-semibold ${
                    validationErrors.name
                      ? 'border-2'
                      : 'border-[#DCDEDD] hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2'
                  }`}
                  style={validationErrors.name ? { borderColor: '#DC2626' } : {}}
                  placeholder="Enter topic name"
                />
              </div>
              <ErrorMessage message={validationErrors.name} />
            </div>

            <div className="mb-6">
              <label className="block text-brand-dark text-base font-semibold mb-1">Topic Description</label>
              <div className="relative">
                <div className="absolute top-3 left-4 pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  rows={4}
                  value={formData.description || ''}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    // Clear validation error when user starts typing
                    if (validationErrors.description) {
                      setValidationErrors(prev => ({ ...prev, description: '' }));
                    }
                  }}
                  className={`w-full pl-12 pr-4 py-3 bg-white border rounded-[16px] focus:bg-white transition-all duration-300 font-semibold ${
                    validationErrors.description
                      ? 'border-2'
                      : 'border-[#DCDEDD] hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2'
                  }`}
                  style={validationErrors.description ? { borderColor: '#DC2626' } : {}}
                  placeholder="Describe what students will learn in this topic..."
                />
              </div>
              <ErrorMessage message={validationErrors.description} />
            </div>

            {validationErrors.submit && (
              <ApiErrorMessage
                title="Submit Error"
                message={validationErrors.submit}
              />
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard/topics')}
                className="flex-1 border border-[#DCDEDD] rounded-[8px] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 px-6 py-3 flex items-center justify-center gap-2"
              >
                <XIcon className="w-4 h-4 text-gray-600" />
                <span className="text-brand-dark text-base font-semibold">Cancel</span>
              </button>
              <Button
                type="submit"
                disabled={loading}
                variant="primary"
                className="flex-1 rounded-[8px] px-6 py-3"
              >
                {mode === 'add' ? (
                  <>
                    <Plus className="w-4 h-4 text-white" />
                    <span className="text-brand-white text-base font-semibold">
                      {loading ? 'Creating...' : 'Create Topic'}
                    </span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 text-white" />
                    <span className="text-brand-white text-base font-semibold">
                      {loading ? 'Updating...' : 'Update Topic'}
                    </span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>

      <PhotoPreviewModal 
        isOpen={showPhotoPreview}
        imageUrl={imagePreview}
        onClose={() => setShowPhotoPreview(false)}
      />
    </>
  );
}