/**
 * Utility function to concatenate class names, similar to the popular `clsx` library
 * Handles conditional classes and filters out falsy values
 */
export function cn(...inputs: (string | undefined | false | null)[]): string {
	return inputs.filter(Boolean).join(" ");
}

/**
 * Common spacing utilities for consistent layout
 */
export const spacing = {
	// Padding utilities
	p: {
		none: "p-0",
		xs: "p-1",
		sm: "p-2",
		md: "p-4",
		lg: "p-6",
		xl: "p-8",
		"2xl": "p-12",
		"3xl": "p-16",
	},
	px: {
		none: "px-0",
		xs: "px-1",
		sm: "px-2",
		md: "px-4",
		lg: "px-6",
		xl: "px-8",
		"2xl": "px-12",
		"3xl": "px-16",
	},
	py: {
		none: "py-0",
		xs: "py-1",
		sm: "py-2",
		md: "py-4",
		lg: "py-6",
		xl: "py-8",
		"2xl": "py-12",
		"3xl": "py-16",
	},
	// Margin utilities
	m: {
		none: "m-0",
		xs: "m-1",
		sm: "m-2",
		md: "m-4",
		lg: "m-6",
		xl: "m-8",
		"2xl": "m-12",
		"3xl": "m-16",
	},
	mx: {
		none: "mx-0",
		xs: "mx-1",
		sm: "mx-2",
		md: "mx-4",
		lg: "mx-6",
		xl: "mx-8",
		"2xl": "mx-12",
		"3xl": "mx-16",
		auto: "mx-auto",
	},
	my: {
		none: "my-0",
		xs: "my-1",
		sm: "my-2",
		md: "my-4",
		lg: "my-6",
		xl: "my-8",
		"2xl": "my-12",
		"3xl": "my-16",
	},
	// Gap utilities for flexbox and grid
	gap: {
		none: "gap-0",
		xs: "gap-1",
		sm: "gap-2",
		md: "gap-4",
		lg: "gap-6",
		xl: "gap-8",
		"2xl": "gap-12",
	},
};

/**
 * Layout utilities for common patterns
 */
export const layout = {
	// Container utilities
	container: {
		base: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
		sm: "max-w-3xl mx-auto px-4 sm:px-6 lg:px-8",
		lg: "max-w-full mx-auto px-4 sm:px-6 lg:px-8",
	},
	// Flexbox utilities
	flex: {
		center: "flex items-center justify-center",
		between: "flex items-center justify-between",
		start: "flex items-center justify-start",
		end: "flex items-center justify-end",
		col: "flex flex-col",
		colCenter: "flex flex-col items-center justify-center",
		wrap: "flex flex-wrap",
	},
	// Grid utilities
	grid: {
		cols1: "grid grid-cols-1",
		cols2: "grid grid-cols-1 md:grid-cols-2",
		cols3: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
		cols4: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
		autoFit: "grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))]",
		autoFill: "grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))]",
	},
	// Common section utilities
	section: {
		base: "py-20",
		sm: "py-12",
		lg: "py-32",
		withBg: "py-20 bg-[#F9F9F9]",
	},
};

/**
 * Typography utilities for consistent text styling
 */
export const typography = {
	heading: {
		h1: "text-4xl md:text-6xl font-extrabold text-brand-dark",
		h2: "text-3xl md:text-4xl font-extrabold text-brand-dark",
		h3: "text-xl font-bold text-brand-dark",
		h4: "text-lg font-bold text-brand-dark",
		h5: "text-base font-bold text-brand-dark",
		h6: "text-sm font-bold text-brand-dark",
	},
	body: {
		lg: "text-xl text-brand-light",
		base: "text-base text-brand-light",
		sm: "text-sm text-brand-light",
		xs: "text-xs text-brand-light",
	},
	label: {
		base: "text-sm font-medium text-brand-dark",
		sm: "text-xs font-medium text-brand-dark",
	},
};

/**
 * Common animation and transition utilities
 */
export const animation = {
	transition: {
		base: "transition-all duration-300",
		fast: "transition-all duration-150",
		slow: "transition-all duration-500",
	},
	hover: {
		lift: "hover:shadow-lg hover:-translate-y-1 transition-all duration-300",
		scale: "hover:scale-105 transition-transform duration-300",
		opacity: "hover:opacity-80 transition-opacity duration-300",
	},
};

/**
 * Brand-specific utilities
 */
export const brand = {
	card: {
		base: "bg-white border border-[#DCDEDD] rounded-[20px]",
		hover: "bg-white border border-[#DCDEDD] rounded-[20px] hover:border-[#0C51D9] hover:border-2 hover:shadow-lg transition-all duration-300",
		interactive: "bg-white border border-[#DCDEDD] rounded-[20px] hover:border-[#0C51D9] hover:border-2 transition-all duration-300",
	},
	button: {
		radius: "rounded-[12px]",
		radiusSm: "rounded-[8px]",
	},
	colors: {
		primary: "text-blue-600",
		primaryBg: "bg-blue-600",
		secondary: "text-brand-dark",
		muted: "text-brand-light",
	},
};

/**
 * Pre-composed component utilities for common patterns
 */
export const patterns = {
	// Card layouts
	cardGrid: cn(layout.grid.cols3, spacing.gap.lg),
	cardGridResponsive: cn(layout.grid.cols4, spacing.gap.lg),

	// Page headers
	pageHeader: cn(layout.flex.between, spacing.my.xl),
	sectionHeader: cn("text-center", spacing.my["2xl"]),

	// Form layouts
	formGroup: cn(layout.flex.col, spacing.gap.sm),
	formRow: cn(layout.flex.between, spacing.gap.md),

	// Loading states
	skeleton: "animate-pulse bg-gray-200 rounded",
	loadingCard: cn(brand.card.base, spacing.p.lg, "animate-pulse"),

	// Status indicators
	successText: "text-green-600 font-medium",
	errorText: "text-red-600 font-medium",
	warningText: "text-yellow-600 font-medium",

	// Common button groups
	buttonGroup: cn(layout.flex.start, spacing.gap.md),
	buttonGroupEnd: cn(layout.flex.end, spacing.gap.md),
};

// Export individual utilities for convenience
export { spacing as sp, layout as ly, typography as ty, animation as anim, brand as br };