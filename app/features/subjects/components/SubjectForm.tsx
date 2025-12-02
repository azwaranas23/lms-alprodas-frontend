import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Layers, FileText, Tag, ChevronDown, ImagePlus, Eye, X as XIcon, Image, Upload, Plus, Save } from 'lucide-react';
import { Button } from '~/components/atoms/Button';
import { TopicModal } from './TopicModal';
import { PhotoPreviewModal } from './PhotoPreviewModal';
import { type Subject } from '~/services/subjects.service';
import { useCreateSubject, useUpdateSubject } from '~/hooks/api/useSubjects';
import { topicsService } from '~/services/topics.service';
import { BASE_URL } from '~/constants/api';
import { subjectSchema, type SubjectFormData } from '~/schemas/subjects';
import { ApiErrorMessage } from '~/components/atoms/ApiErrorMessage';
import { ErrorMessage } from '~/components/atoms/ErrorMessage';
import { z } from 'zod';

interface SubjectFormProps {
  mode: 'add' | 'edit';
  initialData?: Subject;
  onSubmit?: (data: FormData) => Promise<void>;
}

export function SubjectForm({ mode, initialData, onSubmit }: SubjectFormProps) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createSubjectMutation = useCreateSubject();
  const updateSubjectMutation = useUpdateSubject();

  const [formData, setFormData] = useState<SubjectFormData>({
    id: initialData?.id,
    name: initialData?.name || '',
    description: initialData?.description || '',
    topic_id: initialData?.topic_id?.toString() || '',
    image: undefined
  });

  const [selectedTopic, setSelectedTopic] = useState<{id: string; name: string; imageUrl: string} | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    initialData?.image ? `${BASE_URL}${initialData.image}` : ''
  );
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [showPhotoPreview, setShowPhotoPreview] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const loading = createSubjectMutation.isPending || updateSubjectMutation.isPending;

  // Fetch topic details in edit mode
  useEffect(() => {
    const fetchTopicDetails = async () => {
      if (mode === 'edit' && initialData?.topic_id && !selectedTopic) {
        try {
          const topicDetails = await topicsService.getTopicById(initialData.topic_id);
          setSelectedTopic({
            id: topicDetails.id.toString(),
            name: topicDetails.name,
            imageUrl: topicDetails.image ? `${BASE_URL}${topicDetails.image}` : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'
          });
        } catch (err) {
          console.error('Error fetching topic details:', err);
          // Fallback to basic info from subject
          if (initialData?.topic) {
            setSelectedTopic({
              id: initialData.topic_id.toString(),
              name: initialData.topic.name,
              imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'
            });
          }
        }
      }
    };

    fetchTopicDetails();
  }, [mode, initialData, selectedTopic]);

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
      description: formData.description?.trim() || undefined,
      topic_id: selectedTopic?.id ? String(selectedTopic.id) : '',
      image: formData.image
    };

    const validation = subjectSchema.safeParse(validationData);

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
    if (selectedTopic?.id) {
      submitData.append('topic_id', selectedTopic.id);
    }

    if (formData.image) {
      submitData.append('image', formData.image);
    }

    if (mode === 'add') {
      createSubjectMutation.mutate(submitData, {
        onSuccess: () => {
          navigate('/dashboard/subjects');
        },
        onError: (err: any) => {
          console.error('Error creating subject:', err);
          setValidationErrors({ submit: err.response?.data || 'Failed to save subject' });
        }
      });
    } else if (mode === 'edit' && formData.id) {
      updateSubjectMutation.mutate(
        { id: formData.id, data: submitData },
        {
          onSuccess: () => {
            navigate('/dashboard/subjects');
          },
          onError: (err: any) => {
            console.error('Error updating subject:', err);
            setValidationErrors({ submit: err.response?.data || 'Failed to save subject' });
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
              <Layers className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-brand-dark text-xl font-bold">Subject Information</h3>
              <p className="text-brand-light text-sm font-normal">
                {mode === 'add' ? 'Basic subject details and description' : 'Update subject details and description'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5">
            <div className="mb-4">
              <label className="block text-brand-dark text-base font-semibold mb-1">Subject Photo</label>
              <div className="flex items-start gap-4">
                <div className="w-64 h-42">
                  <div className="relative w-64 h-42">
                    <div className="w-64 h-42 absolute bg-gray-50 rounded-[16px] border-2 border-dashed border-[#DCDEDD]"></div>

                    <div className="w-64 h-42 relative z-10 flex items-center justify-center rounded-[16px] overflow-hidden">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Subject Photo" className="w-64 h-42 object-cover rounded-[16px]" />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-gray-400 h-full">
                          <Image className="w-10 h-10 mb-2" />
                          <span className="text-sm font-medium">Subject Photo</span>
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
              <label className="block text-brand-dark text-base font-semibold mb-1">Subject Name *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Layers className="h-5 w-5 text-gray-400" />
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
                  placeholder="Enter subject name"
                />
              </div>
              <ErrorMessage message={validationErrors.name} />
            </div>

            <div className="mb-4">
              <label className="block text-brand-dark text-base font-semibold mb-1">About Subject</label>
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
                  placeholder="Describe what students will learn in this subject..."
                />
              </div>
              <ErrorMessage message={validationErrors.description} />
            </div>

            <div className="mb-6">
              <label className="block text-brand-dark text-base font-semibold mb-1">Select Topic *</label>
              <button
                type="button"
                onClick={() => setShowTopicModal(true)}
                className={`w-full border rounded-[16px] focus:bg-white transition-all duration-300 font-semibold px-4 py-3 flex items-center gap-3 text-left ${
                  validationErrors.topic_id
                    ? 'border-2 border-[#DC2626] hover:border-[#DC2626] focus:border-[#DC2626]'
                    : 'border-[#DCDEDD] hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2'
                }`}
              >
                <Tag className="w-5 h-5 text-gray-400" />
                <span className={`flex-1 ${selectedTopic ? 'text-brand-dark font-semibold' : 'text-[#0D2929] font-normal'}`}>
                  {selectedTopic?.name || 'Select topic for this subject'}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {selectedTopic && (
                <div className="mt-3 p-4 bg-gray-50 rounded-[12px] border border-[#DCDEDD]">
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-20 relative overflow-hidden rounded-[8px]">
                      <img
                        src={selectedTopic.imageUrl}
                        alt="Selected Topic"
                        className="w-24 h-20 rounded-[8px] object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-brand-dark text-base font-semibold">{selectedTopic.name}</h4>
                      <p className="text-brand-light text-sm">Selected topic for this subject</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedTopic(null)}
                      className="text-brand-light hover:text-brand-dark transition-colors"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
              <ErrorMessage message={validationErrors.topic_id} />
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
                onClick={() => navigate('/dashboard/subjects')}
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
                      {loading ? 'Creating...' : 'Create Subject'}
                    </span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 text-white" />
                    <span className="text-brand-white text-base font-semibold">
                      {loading ? 'Updating...' : 'Update Subject'}
                    </span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>

      <TopicModal
        isOpen={showTopicModal}
        onClose={() => setShowTopicModal(false)}
        onSelectTopic={(topic) => {
          setSelectedTopic({
            id: topic.id.toString(),
            name: topic.name,
            imageUrl: topic.image ? `${BASE_URL}${topic.image}` : ''
          });
          // Clear validation error when user selects a topic
          if (validationErrors.topic_id) {
            setValidationErrors({ ...validationErrors, topic_id: '' });
          }
          setShowTopicModal(false);
        }}
      />

      <PhotoPreviewModal
        isOpen={showPhotoPreview}
        imageUrl={imagePreview}
        onClose={() => setShowPhotoPreview(false)}
      />
    </>
  );
}