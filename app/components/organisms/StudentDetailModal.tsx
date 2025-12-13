import { X, Mail, BookOpen, Calendar, User } from "lucide-react";
import { getAvatarSrc } from "~/utils/formatters";

interface StudentDetailModalProps {
    student: {
        id: string;
        name: string;
        email: string;
        specialization: string;
        enrolledCourses: number;
        status: "Active" | "Inactive" | "Graduated";
        avatar: string;
        latestEnrollment?: string;
    } | null;
    isOpen: boolean;
    onClose: () => void;
}

const getStatusStyle = (status: string) => {
    switch (status) {
        case "Active":
            return "bg-green-100 text-green-800";
        case "Inactive":
            return "bg-red-100 text-red-800";
        case "Graduated":
            return "bg-blue-100 text-blue-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

export function StudentDetailModal({
    student,
    isOpen,
    onClose,
}: StudentDetailModalProps) {
    if (!isOpen || !student) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-[20px] w-full max-w-md mx-4 shadow-2xl border border-[#DCDEDD] animate-in fade-in zoom-in duration-200">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>

                {/* Header with Avatar */}
                <div className="pt-8 pb-6 px-6 border-b border-gray-100">
                    <div className="flex flex-col items-center">
                        <div className="relative mb-4">
                            <img
                                src={getAvatarSrc(student.avatar, student.name)}
                                alt={student.name}
                                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = getAvatarSrc(undefined, student.name);
                                }}
                            />
                            <span
                                className={`absolute bottom-0 right-0 px-2 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                                    student.status
                                )}`}
                            >
                                {student.status}
                            </span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{student.name}</h2>
                        <p className="text-sm text-gray-500">{student.specialization}</p>
                    </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Mail className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Email</p>
                            <p className="text-sm text-gray-900 font-semibold">
                                {student.email}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Enrolled Courses</p>
                            <p className="text-sm text-gray-900 font-semibold">
                                {student.enrolledCourses} Course{student.enrolledCourses !== 1 ? "s" : ""}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <User className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Student ID</p>
                            <p className="text-sm text-gray-900 font-semibold">#{student.id}</p>
                        </div>
                    </div>

                    {student.latestEnrollment && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Latest Enrollment</p>
                                <p className="text-sm text-gray-900 font-semibold">
                                    {new Date(student.latestEnrollment).toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 pt-0">
                    <button
                        onClick={onClose}
                        className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
