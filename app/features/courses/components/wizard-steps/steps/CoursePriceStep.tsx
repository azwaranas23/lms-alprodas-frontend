import { DollarSign, Globe, FileText, User, Star, Users, BookOpen, Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { coursePriceSchema } from '~/schemas/courses';
import { z } from 'zod';
import { useState } from 'react';
import { useUser } from '~/hooks/useUser';
import { Button } from '~/components/atoms/Button';
import { FormField, FormInput } from '~/components/molecules/FormField';
import { Avatar } from '~/components/atoms/Avatar';

interface CourseData {
  price?: number;
  availability?: 'published' | 'draft';
  mentor?: {
    id: number;
    name: string;
    profile?: {
      expertise?: string;
      avatar?: string;
      totalCourses?: number;
      totalStudents?: number;
    };
  };
}

interface CoursePriceStepProps {
  data: CourseData;
  onUpdate: (data: Partial<CourseData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function CoursePriceStep({ data, onUpdate, onNext, onPrevious }: CoursePriceStepProps) {
  const { getFullName, getAvatar, getExpertise, getTotalCourses, getTotalStudents } = useUser();
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Use mentor data from course (edit mode) or current user (add mode)
  const mentorName = data.mentor?.name || getFullName();
  const mentorExpertise = data.mentor?.profile?.expertise || getExpertise();
  const mentorAvatar = data.mentor?.profile?.avatar || getAvatar();
  const mentorTotalCourses = data.mentor?.profile?.totalCourses || getTotalCourses();
  const mentorTotalStudents = data.mentor?.profile?.totalStudents || getTotalStudents();

  const [priceDisplay, setPriceDisplay] = useState<string>(
    data.price ? data.price.toLocaleString('id-ID') : ''
  );

  const handlePriceChange = (value: string) => {
    // Remove all non-numeric characters
    const numericValue = value.replace(/[^\d]/g, '');
    const price = parseInt(numericValue) || 0;

    // Update actual price value (without dots)
    onUpdate({ price });

    // Update display with thousand separator (with dots)
    setPriceDisplay(price > 0 ? price.toLocaleString('id-ID') : '');

    // Clear error when user starts typing
    if (errors.price) {
      setErrors(prev => ({ ...prev, price: '' }));
    }
  };

  const handleAvailabilityChange = (availability: 'published' | 'draft') => {
    onUpdate({ availability });
    // Clear error when user selects
    if (errors.availability) {
      setErrors(prev => ({ ...prev, availability: '' }));
    }
  };

  const validateAndNext = () => {
    try {
      // Validate the actual data without defaults
      const validationData = {
        price: data.price,
        availability: data.availability,
      };

      // Check if required fields are provided
      const validationErrors: Record<string, string> = {};

      if (!data.price || data.price === 0) {
        validationErrors.price = 'Price is required';
      }

      if (!data.availability) {
        validationErrors.availability = 'Please select course availability';
      }

      // If we have validation errors, set them and return early
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      // Parse with actual values (no defaults)
      coursePriceSchema.parse({
        price: Number(data.price),
        availability: data.availability,
      });

      // Clear errors and proceed
      setErrors({});
      onNext();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Convert Zod errors to our error format
        const newErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path && err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <div className="space-y-6">
          {/* Course Pricing Section */}
          <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-50 rounded-[12px] flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-brand-dark text-xl font-bold">Course Pricing</h3>
                <p className="text-brand-light text-sm font-normal">Set your course price and availability</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Course Price Input */}
              <FormField label="Course Price" required error={errors.price} className="mb-6">
                <FormInput
                  type="text"
                  required
                  value={priceDisplay}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  error={errors.price}
                  icon={<span className="text-gray-400 font-semibold text-lg">Rp</span>}
                  placeholder="0"
                />
              </FormField>

              {/* Course Availability Radio Options */}
              <div className="mb-6">
                <label className="block text-brand-dark text-base font-semibold mb-3">Course Availability *</label>
                <div className="flex gap-4">
                  {/* Published Option */}
                  <label className="group card flex items-center justify-between w-full min-h-[60px] rounded-[16px] border border-[#DCDEDD] p-4 has-[:checked]:ring-2 has-[:checked]:ring-[#0C51D9] has-[:checked]:ring-offset-2 transition-all duration-300 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-50 rounded-[12px] flex items-center justify-center">
                        <Globe className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex flex-col">
                        <p className="text-brand-dark text-base font-semibold">Published</p>
                        <p className="text-brand-light text-sm">Publicly available</p>
                      </div>
                    </div>
                    <div className="relative flex items-center justify-center w-fit h-8 shrink-0 rounded-xl border border-[#DCDEDD] py-2 px-3 gap-2">
                      <input
                        type="radio"
                        name="availability"
                        value="published"
                        checked={data.availability === 'published'}
                        onChange={() => handleAvailabilityChange('published')}
                        className="hidden"
                      />
                      <div className="flex size-[18px] rounded-full shadow-sm border border-[#DCDEDD] group-has-[:checked]:border-[5px] group-has-[:checked]:border-[#0C51D9] transition-all duration-300"></div>
                      <p className="text-xs font-semibold after:content-['Select'] group-has-[:checked]:after:content-['Selected']"></p>
                    </div>
                  </label>

                  {/* Draft Option */}
                  <label className="group card flex items-center justify-between w-full min-h-[60px] rounded-[16px] border border-[#DCDEDD] p-4 has-[:checked]:ring-2 has-[:checked]:ring-[#0C51D9] has-[:checked]:ring-offset-2 transition-all duration-300 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-50 rounded-[12px] flex items-center justify-center">
                        <FileText className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="flex flex-col">
                        <p className="text-brand-dark text-base font-semibold">Draft</p>
                        <p className="text-brand-light text-sm">Saved as draft, not visible</p>
                      </div>
                    </div>
                    <div className="relative flex items-center justify-center w-fit h-8 shrink-0 rounded-xl border border-[#DCDEDD] py-2 px-3 gap-2">
                      <input
                        type="radio"
                        name="availability"
                        value="draft"
                        checked={data.availability === 'draft'}
                        onChange={() => handleAvailabilityChange('draft')}
                        className="hidden"
                      />
                      <div className="flex size-[18px] rounded-full shadow-sm border border-[#DCDEDD] group-has-[:checked]:border-[5px] group-has-[:checked]:border-[#0C51D9] transition-all duration-300"></div>
                      <p className="text-xs font-semibold after:content-['Select'] group-has-[:checked]:after:content-['Selected']"></p>
                    </div>
                  </label>
                </div>
                {errors.availability && (
                  <div className="mt-2">
                    <p className="text-danger text-sm">{errors.availability}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mentor Profile Section */}
          <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-50 rounded-[12px] flex items-center justify-center">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-brand-dark text-xl font-bold">Course Mentor</h3>
                <p className="text-brand-light text-sm font-normal">This course will be attributed to your profile</p>
              </div>
            </div>

            {/* Mentor Profile Display */}
            <div className="flex items-center justify-between gap-4 p-4 bg-gray-50 rounded-[16px] border border-gray-200">
              <div className="flex items-center gap-4">
                <Avatar
                  src={mentorAvatar || undefined}
                  name={mentorName}
                  size="lg"
                />
                <div>
                  <h4 className="text-brand-dark text-lg font-bold">{mentorName}</h4>
                  <p className="text-brand-light text-sm">{mentorExpertise}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-brand-dark text-sm font-medium">4.9</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-brand-dark text-sm font-medium">{mentorTotalStudents} Students</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4 text-green-600" />
                  <span className="text-brand-dark text-sm font-medium">{mentorTotalCourses} Courses</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Navigation */}
          <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-brand-dark text-sm font-medium">Step 4 of 5</p>
                <p className="text-brand-light text-xs font-normal mt-1">Set course price and availability settings</p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={onPrevious}
                  className="px-6 py-3 rounded-[8px]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-base font-semibold">Previous</span>
                </Button>
                <Button
                  variant="primary"
                  onClick={validateAndNext}
                  className="px-6 py-3 rounded-[8px]"
                >
                  <span className="text-brand-white text-base font-semibold">Next: Review Summary</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </Button>
              </div>
            </div>
          </div>
    </div>
  );
}