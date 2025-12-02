// Environment configuration
// For client-side environment variables in React Router v7

export const getEnvConfig = () => {
	// In React Router v7, we need to handle env variables differently
	// For client-side access, we use import.meta.env
	const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3005/api";
	const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:3005";

	return {
		API_URL: apiUrl,
		BASE_URL: baseUrl,
		IS_PRODUCTION: import.meta.env.PROD || false,
		IS_DEVELOPMENT: import.meta.env.DEV || false,
	};
};

export const env = getEnvConfig();
