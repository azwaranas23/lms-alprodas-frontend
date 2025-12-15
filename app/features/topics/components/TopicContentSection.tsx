import { useState, useEffect } from "react";
import {
  Layers,
  BookOpen,
  Map,
  Users,
  Clock,
  Star,
  ChevronDown,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router";
import { subjectsService } from "~/services/subjects.service";
import { coursesService } from "~/services/courses.service";
import type { Subject } from "~/types/subjects";
import type { Course } from "~/types/courses";
import { env } from "~/config/env";
import { Button } from "~/components/atoms/Button";
import { Card } from "~/components/molecules/Card";
import { formatCurrency, getAvatarSrc } from "~/utils/formatters";
import { Tooltip } from "~/components/atoms/Tooltip";
import { Image } from "~/components/atoms/Image";

interface SubjectCardProps {
  subject: Subject;
}

function SubjectCard({ subject }: SubjectCardProps) {
  const getGradient = (index: number) => {
    const gradients = [
      "from-blue-100 to-purple-100",
      "from-yellow-100 to-orange-100",
      "from-cyan-100 to-blue-100",
      "from-green-100 to-emerald-100",
      "from-green-100 to-teal-100",
      "from-purple-100 to-pink-100",
    ];
    return gradients[index % gradients.length];
  };

  return (
    <Card hover className="h-full flex flex-col p-4">
      {/* Subject Image */}
      <div
        className={`w-full h-48 bg-gradient-to-br ${getGradient(subject.id)} relative overflow-hidden rounded-[12px] mb-4`}
      >
        <Image
          src={subject.image || undefined}
          alt={subject.name}
          className="w-full h-full object-cover rounded-[12px]"
          imageType="subject"
          identifier={subject.id.toString()}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <h4 className="text-brand-dark text-lg font-bold mb-2">
          {subject.name}
        </h4>
        <p className="text-brand-light text-sm line-clamp-2 mb-4 flex-1">
          {subject.description || "Explore this subject area"}
        </p>

        <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span>{subject.total_courses} Courses</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{subject.total_students} Students</span>
          </div>
        </div>

        <a href="/courses" className="mt-auto">
          <Button
            variant="outline"
            className="w-full py-2 text-sm flex justify-center items-center gap-2"
          >
            View All Courses
            <ArrowRight className="w-4 h-4" />
          </Button>
        </a>
      </div>
    </Card>
  );
}

interface CourseCardProps {
  course: Course;
}

function CourseCard({ course }: CourseCardProps) {
  const getGradient = (index: number) => {
    const gradients = [
      "from-blue-100 to-purple-100",
      "from-yellow-100 to-orange-100",
      "from-cyan-100 to-blue-100",
      "from-green-100 to-emerald-100",
      "from-green-100 to-teal-100",
      "from-purple-100 to-pink-100",
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="bg-white border border-[#DCDEDD] rounded-[20px] hover:border-[#0C51D9] hover:border-2 hover:shadow-lg transition-all duration-300 p-6">
      <div className="mb-4">
        <div
          className={`w-full h-48 bg-gradient-to-br ${getGradient(course.id)} relative overflow-hidden rounded-[12px] mb-4`}
        >
          <Image
            src={course.images?.[0]?.image_path}
            alt={course.title}
            className="w-full h-full object-cover rounded-[12px]"
            imageType="course"
            identifier={course.id.toString()}
          />
          {/* Enrolled Badge */}
          {course.is_enrolled && (
            <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Enrolled
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-brand-dark text-lg font-bold leading-tight">
            {course.title}
          </h3>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-semibold text-gray-700">5.0</span>
          </div>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {course.total_students} students
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {course.total_lessons} lessons
            </span>
          </div>
        </div>
        {course.mentor && (
          <div className="flex items-center gap-3 mb-4">
            <img
              src={getAvatarSrc(
                course.mentor.profile?.avatar,
                course.mentor.name
              )}
              alt={course.mentor.name}
              className="w-8 h-8 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.src = getAvatarSrc(
                  undefined,
                  course?.mentor?.name || "User"
                );
              }}
            />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {course.mentor.name}
              </p>
              <p className="text-xs text-gray-500">Mentor</p>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold text-brand-dark">
          {course.is_enrolled ? "Enrolled" : "Enroll Now"}
        </div>
        <Link to={`/course/${course.id}`}>
          <Button variant="primary" className="px-4 py-2 rounded-[8px] text-sm">
            View Course
          </Button>
        </Link>
      </div>
    </div>
  );
}

interface TopicContentSectionProps {
  topicId: number;
}

export function TopicContentSection({ topicId }: TopicContentSectionProps) {
  const [activeTab, setActiveTab] = useState("subjects");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [hasMoreCourses, setHasMoreCourses] = useState(false);
  const [currentLimit, setCurrentLimit] = useState(6);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setSubjectsLoading(true);
        const response = await subjectsService.getSubjectsByTopic(topicId);
        setSubjects(response.data.items);
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      } finally {
        setSubjectsLoading(false);
      }
    };

    fetchSubjects();
  }, [topicId]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setCoursesLoading(true);
        const response = await coursesService.getCoursesByTopic(topicId, {
          page: 1,
          limit: 6,
        });
        setCourses(response.data.items);
        setHasMoreCourses(response.data.meta.has_next);
        setCurrentLimit(6);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setCoursesLoading(false);
      }
    };

    if (activeTab === "courses") {
      fetchCourses();
    }
  }, [topicId, activeTab]);

  const handleTabSwitch = (tabName: string) => {
    setActiveTab(tabName);
  };

  const handleLoadMore = async () => {
    try {
      setLoadingMore(true);
      const newLimit = currentLimit + 6;
      const response = await coursesService.getCoursesByTopic(topicId, {
        page: 1,
        limit: newLimit,
      });
      setCourses(response.data.items);
      setHasMoreCourses(response.data.meta.has_next);
      setCurrentLimit(newLimit);
    } catch (error) {
      console.error("Failed to load more courses:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tabs Navigation */}
        <Card className="mb-6 p-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeTab === "subjects" ? "primary" : "outline"}
              onClick={() => handleTabSwitch("subjects")}
              className="px-4 py-3 rounded-[12px]"
            >
              <Layers className="w-4 h-4" />
              <span>Subjects</span>
            </Button>
            <Button
              variant={activeTab === "courses" ? "primary" : "outline"}
              onClick={() => handleTabSwitch("courses")}
              className="px-4 py-3 rounded-[12px]"
            >
              <BookOpen className="w-4 h-4" />
              <span>Courses</span>
            </Button>
          </div>
        </Card>

        {/* Tab Content Container */}
        <div>
          {/* Subjects Tab Content */}
          {activeTab === "subjects" && (
            <div>
              <div className="mb-6">
                <h2 className="text-brand-dark text-3xl font-bold mb-4">
                  Subject Areas
                </h2>
                <p className="text-brand-light text-lg">
                  Explore specialized subjects within this topic
                </p>
              </div>

              {/* Subjects Grid */}
              {subjectsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="border border-[#DCDEDD] rounded-[20px] p-4 animate-pulse flex flex-col"
                    >
                      <div className="w-full h-48 bg-gray-200 rounded-[12px] mb-4"></div>
                      <div className="flex-1 flex flex-col">
                        <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded mb-4 w-full"></div>
                        <div className="flex justify-between items-center mb-4">
                          <div className="h-4 bg-gray-200 rounded w-20"></div>
                          <div className="h-4 bg-gray-200 rounded w-20"></div>
                        </div>
                        <div className="h-10 bg-gray-200 rounded w-full mt-auto"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subjects.map((subject) => (
                    <SubjectCard key={subject.id} subject={subject} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Courses Tab Content */}
          {activeTab === "courses" && (
            <div>
              <div className="mb-6">
                <h2 className="text-brand-dark text-3xl font-bold mb-4">
                  All Courses
                </h2>
                <p className="text-brand-light text-lg">
                  Browse all available courses in this topic
                </p>
              </div>

              {/* Courses Grid */}
              {coursesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="bg-white border border-[#DCDEDD] rounded-[20px] p-6 animate-pulse"
                    >
                      <div className="w-full h-48 bg-gray-200 rounded-[12px] mb-4"></div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="h-5 bg-gray-200 rounded flex-1 mr-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-12"></div>
                      </div>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded mb-1"></div>
                          <div className="h-3 bg-gray-200 rounded w-16"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="h-6 bg-gray-200 rounded w-24"></div>
                        <div className="h-8 bg-gray-200 rounded w-20"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              )}

              {/* Load More Button */}
              {!coursesLoading && courses.length > 0 && hasMoreCourses && (
                <div className="flex justify-center mt-12">
                  <Button
                    variant="outline"
                    className="px-8 py-4 text-lg"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                  >
                    <span>
                      {loadingMore ? "Loading..." : "Load More Courses"}
                    </span>
                    <ChevronDown className="w-5 h-5" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
