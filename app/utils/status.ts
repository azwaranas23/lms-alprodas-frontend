export const getStatusBadgeClasses = (status: string): string => {
	const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";

	switch (status.toUpperCase()) {
		case "PUBLISHED":
		case "ACTIVE":
		case "SUCCESS":
		case "COMPLETED":
		case "APPROVED":
			return `${baseClasses} bg-green-100 text-green-800`;
		case "DRAFT":
		case "PENDING":
		case "PROCESSING":
			return `${baseClasses} bg-yellow-100 text-yellow-800`;
		case "ARCHIVED":
		case "INACTIVE":
		case "DISABLED":
			return `${baseClasses} bg-gray-100 text-gray-800`;
		case "FAILED":
		case "REJECTED":
		case "ERROR":
			return `${baseClasses} bg-red-100 text-red-800`;
		case "WARNING":
			return `${baseClasses} bg-orange-100 text-orange-800`;
		case "INFO":
			return `${baseClasses} bg-blue-100 text-blue-800`;
		default:
			return `${baseClasses} bg-gray-100 text-gray-800`;
	}
};

export const getStatusColor = (status: string): string => {
	switch (status.toUpperCase()) {
		case "PUBLISHED":
		case "ACTIVE":
		case "SUCCESS":
		case "COMPLETED":
		case "APPROVED":
			return "green";
		case "DRAFT":
		case "PENDING":
		case "PROCESSING":
			return "yellow";
		case "ARCHIVED":
		case "INACTIVE":
		case "DISABLED":
			return "gray";
		case "FAILED":
		case "REJECTED":
		case "ERROR":
			return "red";
		case "WARNING":
			return "orange";
		case "INFO":
			return "blue";
		default:
			return "gray";
	}
};

export const getTransactionStatusBadgeClasses = (status: string): string => {
	const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";

	switch (status.toUpperCase()) {
		case "SUCCESS":
		case "COMPLETED":
			return `${baseClasses} bg-green-100 text-green-700`;
		case "PENDING":
			return `${baseClasses} bg-yellow-100 text-yellow-700`;
		case "FAILED":
			return `${baseClasses} bg-red-100 text-red-700`;
		default:
			return `${baseClasses} bg-gray-100 text-gray-700`;
	}
};

export const getWithdrawalStatusBadgeClasses = (status: string): string => {
	const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full";

	switch (status.toUpperCase()) {
		case "COMPLETED":
			return `${baseClasses} bg-green-100 text-green-800`;
		case "PENDING":
			return `${baseClasses} bg-yellow-100 text-yellow-800`;
		case "PROCESSING":
			return `${baseClasses} bg-blue-100 text-blue-800`;
		case "REJECTED":
			return `${baseClasses} bg-red-100 text-red-800`;
		default:
			return `${baseClasses} bg-gray-100 text-gray-800`;
	}
};

export const formatStatus = (status: string): string => {
	return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};