import {
  BookOpen,
  Code,
  Edit,
  Plus,
  Shapes,
  Target,
  Trash2,
  Trophy,
  Zap,
  X,
  Layers,
  Hash
} from 'lucide-react';
import { Link, useParams } from 'react-router';
import { useState } from 'react';
import {
  useSectionsByCourse,
  useCreateSection,
  useUpdateSection,
  useDeleteSection,
} from '~/hooks/api/useSections';
import type { Section } from '~/services/sections.service';
import { createSectionSchema, updateSectionSchema } from '~/schemas/sections';
import type { CreateSectionFormData, UpdateSectionFormData } from '~/schemas/sections';
import { Button } from '~/components/atoms/Button';

interface Course {
  sections?: Array<{
    id: number;
    title: string;
    description: string;
    order_index: number;
    total_lessons: number;
    lessons: Array<{
      id: number;
      title: string;
      content_type: string;
      content_url: string;
      content_text?: string;
      duration_minutes: number;
      order_index: number;
      is_active: boolean;
    }>;
  }>;
}

interface LessonsTabProps {
  course: Course;
}

export function LessonsTab({ }: LessonsTabProps) {
  const { id } = useParams();
  const courseId = Number(id);

  // Modal state management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<number | null>(null);
  const [sectionName, setSectionName] = useState('');
  const [sectionIndex, setSectionIndex] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Fetch sections using custom hook
  const {
    data: sectionsData,
    isLoading: sectionsLoading,
  } = useSectionsByCourse(courseId);

  const sections = sectionsData?.data || [];

  // Modal control functions
  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingSectionId(null);
    setSectionName('');
    setSectionIndex('');
    setValidationErrors({});
    document.body.style.overflow = 'auto';
  };

  // Mutations with callbacks
  const createSectionMutation = useCreateSection({
    onSuccess: () => {
      closeModal();
      // TODO: Show success notification
    },
    onError: () => {
      // TODO: Show error notification
    },
  });

  const updateSectionMutation = useUpdateSection({
    onSuccess: () => {
      closeModal();
      // TODO: Show success notification
    },
    onError: () => {
      // TODO: Show error notification
    },
  });

  const deleteSectionMutation = useDeleteSection(courseId, {
    onSuccess: () => {
      // TODO: Show success notification
    },
    onError: () => {
      // TODO: Show error notification
    },
  });

  // Icons untuk sections (cyclic)
  const sectionIcons = [
    { icon: Shapes, color: 'orange' },
    { icon: Target, color: 'blue' },
    { icon: Code, color: 'green' },
    { icon: Zap, color: 'purple' },
    { icon: Trophy, color: 'yellow' }
  ];

  const getIconConfig = (index: number) => {
    return sectionIcons[index % sectionIcons.length];
  };

  const openModal = () => {
    setIsModalOpen(true);
    setIsEditMode(false);
    setEditingSectionId(null);
    document.body.style.overflow = 'hidden';
  };

  const openEditModal = (section: Section) => {
    setIsModalOpen(true);
    setIsEditMode(true);
    setEditingSectionId(section.id);
    setSectionName(section.title);
    setSectionIndex(section.order_index.toString());
    document.body.style.overflow = 'hidden';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    try {
      if (isEditMode && editingSectionId) {
        // Update existing section
        const formData: UpdateSectionFormData = {
          title: sectionName,
          order_index: Number(sectionIndex),
        };

        const validatedData = updateSectionSchema.parse(formData);

        updateSectionMutation.mutate({
          id: editingSectionId,
          data: validatedData,
        });
      } else {
        // Create new section
        const formData: CreateSectionFormData = {
          title: sectionName,
          course_id: courseId,
          order_index: Number(sectionIndex),
          description: '', // Optional field
        };

        const validatedData = createSectionSchema.parse(formData);
        createSectionMutation.mutate(validatedData);
      }
    } catch (error) {
      if (error instanceof Error && 'issues' in error) {
        const zodError = error as any;
        const errors: Record<string, string> = {};
        zodError.issues?.forEach((issue: any) => {
          if (issue.path.length > 0) {
            errors[issue.path[0]] = issue.message;
          }
        });
        setValidationErrors(errors);
      }
    }
  };

  const handleDeleteSection = (sectionId: number) => {
    if (window.confirm('Are you sure you want to delete this section? This action cannot be undone.')) {
      deleteSectionMutation.mutate(sectionId);
    }
  };

  return (
    <div>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-brand-dark text-2xl font-bold">Course Lesson</h2>
        <Button
          onClick={openModal}
          variant="primary"
          className="rounded-[8px] px-6 py-3 flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-white" />
          <span className="text-brand-white text-sm font-semibold">Add New Section</span>
        </Button>
      </div>

      {/* Course Sections */}
      {sectionsLoading ? (
        <div className="bg-white border border-[#DCDEDD] rounded-[16px] p-6">
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading sections...</p>
          </div>
        </div>
      ) : sections && sections.length > 0 ? (
        sections
          .sort((a, b) => a.order_index - b.order_index)
          .map((section, index) => {
            const iconConfig = getIconConfig(index);
            const IconComponent = iconConfig.icon;

            return (
              <div key={section.id} className="bg-white border border-[#DCDEDD] rounded-[16px] p-6 mb-4">
                <div className="flex items-center justify-between">
                  {/* Group 1: Icon + Title Info */}
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-${iconConfig.color}-50 rounded-[12px] flex items-center justify-center`}>
                      <IconComponent className={`w-6 h-6 text-${iconConfig.color}-600`} />
                    </div>
                    <div>
                      <h3 className="text-brand-dark text-lg font-bold">{section.title}</h3>
                      <p className="text-brand-light text-sm">Section No. {section.order_index}</p>
                    </div>
                  </div>

                  {/* Group 2: Metadata */}
                  <div className="flex items-center gap-3">
                    <p className="text-brand-dark text-base font-bold">{section.total_lessons || 0} lessons</p>
                    <span className="px-3 py-1 rounded-md text-sm font-semibold bg-[#F0FDF4] text-[#166534] ml-[50px]">Active</span>
                  </div>

                  {/* Group 3: Action Buttons */}
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/dashboard/mentor/courses/${id}/sections/${section.id}/lessons`}
                      className="bg-white border border-[#DCDEDD] text-brand-dark py-3 px-6 rounded-[8px] font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span className="text-sm">Lessons</span>
                    </Link>
                    <button
                      onClick={() => openEditModal(section)}
                      className="bg-white border border-[#DCDEDD] text-brand-dark py-3 px-6 rounded-[8px] font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      <span className="text-sm">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteSection(section.id)}
                      disabled={deleteSectionMutation.isPending}
                      className="bg-white border border-[#DCDEDD] text-brand-dark py-3 px-6 rounded-[8px] font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm">
                        {deleteSectionMutation.isPending ? 'Deleting...' : 'Delete'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
      ) : (
        // Empty state ketika belum ada sections
        <div className="bg-white border border-[#DCDEDD] rounded-[16px] p-6">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-brand-dark text-xl font-bold mb-2">Course Sections</h3>
            <p className="text-brand-light text-base">Organize your course content into structured sections and lessons</p>
          </div>
        </div>
      )}

      {/* Add New Section Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-[20px] border border-[#DCDEDD] w-full max-w-lg mx-4 overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#DCDEDD]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-[12px] flex items-center justify-center">
                    <Plus className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-brand-dark text-xl font-bold">
                      {isEditMode ? 'Edit Section' : 'Add New Section'}
                    </h3>
                    <p className="text-brand-light text-sm font-normal">
                      {isEditMode ? 'Update section information' : 'Create a new section for your course lessons'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-10 h-10 rounded-full border border-[#DCDEDD] flex items-center justify-center hover:border-[#0C51D9] hover:border-2 transition-all duration-200"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Section Name */}
                <div>
                  <label className="block text-brand-dark text-base font-semibold mb-1">Section Name *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Layers className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={sectionName}
                      onChange={(e) => {
                        setSectionName(e.target.value);
                        // Clear error when user starts typing
                        if (validationErrors.title) {
                          setValidationErrors(prev => ({ ...prev, title: '' }));
                        }
                      }}
                      className={`w-full pl-12 pr-4 py-3 border rounded-[16px] hover:border-2 focus:border-2 focus:bg-white transition-all duration-300 font-semibold ${
                        validationErrors.title
                          ? 'border-red-500 hover:border-red-500 focus:border-red-500'
                          : 'border-[#DCDEDD] hover:border-[#0C51D9] focus:border-[#0C51D9]'
                      }`}
                      placeholder="Enter section name"
                    />
                  </div>
                  {validationErrors.title && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.title}</p>
                  )}
                </div>

                {/* Section Index */}
                <div>
                  <label className="block text-brand-dark text-base font-semibold mb-1">Section Index *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Hash className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      required
                      min="1"
                      value={sectionIndex}
                      onChange={(e) => {
                        setSectionIndex(e.target.value);
                        // Clear error when user starts typing
                        if (validationErrors.order_index) {
                          setValidationErrors(prev => ({ ...prev, order_index: '' }));
                        }
                      }}
                      className={`w-full pl-12 pr-4 py-3 border rounded-[16px] hover:border-2 focus:border-2 focus:bg-white transition-all duration-300 font-semibold ${
                        validationErrors.order_index
                          ? 'border-red-500 hover:border-red-500 focus:border-red-500'
                          : 'border-[#DCDEDD] hover:border-[#0C51D9] focus:border-[#0C51D9]'
                      }`}
                      placeholder="Enter section index"
                    />
                  </div>
                  {validationErrors.order_index && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.order_index}</p>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 border border-[#DCDEDD] rounded-[8px] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 px-6 py-3 flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                    <span className="text-brand-dark text-base font-semibold">Cancel</span>
                  </button>
                  <Button
                    type="submit"
                    disabled={createSectionMutation.isPending || updateSectionMutation.isPending}
                    variant="primary"
                    className="flex-1 rounded-[8px] px-6 py-3 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4 text-white" />
                    <span className="text-brand-white text-base font-semibold">
                      {isEditMode
                        ? (updateSectionMutation.isPending ? 'Updating...' : 'Update Section')
                        : (createSectionMutation.isPending ? 'Adding...' : 'Add Now')
                      }
                    </span>
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}