/**
 * Design Tokens following Atomic Design principles
 * Maintains exact values from existing codebase - no style changes
 *
 * Hierarchy:
 * 1. Atoms: Basic design tokens (colors, spacing, typography)
 * 2. Molecules: Combinations of atoms
 * 3. Organisms: Complex component styles
 */

// ============================================
// ATOMS - Foundational design tokens
// ============================================

export const atoms = {
	// Color Atoms - Primitive values
	colors: {
		// Primary palette
		blue: {
			50: '#eff6ff',
			100: '#dbeafe',
			500: '#3b82f6',
			600: '#2563eb',
			primary: '#0C51D9',
			secondary: '#2151A0',
		},
		// Neutral palette
		gray: {
			50: '#f9fafb',
			100: '#f3f4f6',
			400: '#9ca3af',
			500: '#6b7280',
			600: '#4b5563',
			700: '#374151',
			800: '#1f2937',
			900: '#111827',
			border: '#DCDEDD',
			background: '#F9F9F9',
		},
		// Semantic colors
		green: {
			100: '#dcfce7',
			500: '#22c55e',
			700: '#15803d',
			800: '#166534',
		},
		yellow: {
			100: '#fef3c7',
			700: '#a16207',
			800: '#854d0e',
		},
		red: {
			100: '#fee2e2',
			500: '#ef4444',
			700: '#b91c1c',
			800: '#991b1b',
		},
		// Base
		white: '#FFFFFF',
		black: '#000000',
	},

	// Spacing Atoms - Based on 4px grid system
	spacing: {
		0: '0',
		1: '0.25rem', // 4px
		2: '0.5rem',  // 8px
		3: '0.75rem', // 12px
		4: '1rem',    // 16px
		5: '1.25rem', // 20px
		6: '1.5rem',  // 24px
		8: '2rem',    // 32px
		10: '2.5rem', // 40px
		12: '3rem',   // 48px
		16: '4rem',   // 64px
	},

	// Border Radius Atoms
	borderRadius: {
		none: '0',
		sm: '8px',
		md: '12px',
		lg: '16px',
		xl: '20px',
		full: '9999px',
	},

	// Typography Atoms
	fontSize: {
		xs: '0.75rem',   // 12px
		sm: '0.875rem',  // 14px
		base: '1rem',    // 16px
		lg: '1.125rem',  // 18px
		xl: '1.25rem',   // 20px
		'2xl': '1.5rem', // 24px
		'3xl': '1.875rem', // 30px
	},

	fontWeight: {
		normal: '400',
		medium: '500',
		semibold: '600',
		bold: '700',
	},

	// Shadow Atoms
	shadows: {
		sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
		md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
		lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
		xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
	},

	// Transition Atoms
	transitions: {
		fast: '200ms',
		default: '300ms',
		slow: '500ms',
	},
} as const;

// ============================================
// MOLECULES - Combinations of atoms
// ============================================

export const molecules = {
	// Status Badge Molecules
	statusBadge: {
		base: 'px-2 py-1 text-xs font-semibold rounded-full',
		success: `bg-green-100 text-green-800`,
		warning: `bg-yellow-100 text-yellow-800`,
		error: `bg-red-100 text-red-800`,
		info: `bg-blue-100 text-blue-800`,
		inactive: `bg-gray-100 text-gray-800`,
	},

	// Button Molecules
	button: {
		// Base button structure
		base: 'font-semibold transition-all duration-300 inline-flex items-center justify-center',
		// Sizes
		sizes: {
			sm: 'px-3 py-2 text-sm',
			md: 'px-4 py-3',
			lg: 'px-6 py-4 text-lg',
		},
		// Variants (exact from codebase)
		variants: {
			primary: 'btn-primary rounded-[8px] border border-[#2151A0] hover:brightness-110 focus:ring-2 focus:ring-[#0C51D9] blue-gradient blue-btn-shadow',
			secondary: 'bg-white border border-[#DCDEDD] text-brand-dark rounded-[8px] hover:bg-gray-50',
			ghost: 'hover:bg-gray-100 rounded-[8px]',
		},
	},

	// Input Molecules
	input: {
		base: 'w-full border border-[#DCDEDD] rounded-[16px] transition-all duration-300',
		hover: 'hover:border-[#0C51D9] hover:border-2',
		focus: 'focus:border-[#0C51D9] focus:border-2 focus:bg-white focus:outline-none',
		error: 'border-red-500 focus:border-red-500',
		sizes: {
			sm: 'px-3 py-2 text-sm',
			md: 'px-4 py-3',
			lg: 'px-6 py-4 text-lg',
		},
	},

	// Card Molecules
	card: {
		base: 'bg-white border border-[#DCDEDD] rounded-[20px]',
		padding: {
			sm: 'p-4',
			md: 'p-6',
			lg: 'p-8',
		},
		hover: 'hover:border-[#0C51D9] hover:border-2 hover:shadow-lg transition-all duration-300',
	},

	// Badge Molecules
	badge: {
		base: 'inline-flex items-center font-medium rounded-full',
		sizes: {
			sm: 'px-2 py-0.5 text-xs',
			md: 'px-3 py-1 text-sm',
			lg: 'px-4 py-2 text-base',
		},
	},
} as const;

// ============================================
// ORGANISMS - Complex component compositions
// ============================================

export const organisms = {
	// Page Layout Organism
	page: {
		container: 'min-h-screen bg-[#F9F9F9]',
		mainContent: 'main-content flex-1 overflow-auto p-5',
		section: 'bg-white border border-[#DCDEDD] rounded-[20px] p-6',
	},

	// Navigation Organism
	navigation: {
		sidebar: 'w-64 bg-white border-r border-[#DCDEDD]',
		header: 'h-16 bg-white border-b border-[#DCDEDD] px-6',
		menuItem: 'px-4 py-3 hover:bg-gray-50 transition-colors rounded-[8px]',
		activeMenuItem: 'bg-[#0C51D9] text-white',
	},

	// Form Organism
	form: {
		container: 'space-y-6',
		group: 'space-y-2',
		label: 'text-sm font-medium text-gray-700',
		helpText: 'text-xs text-gray-500 mt-1',
		errorText: 'text-xs text-red-600 mt-1',
	},

	// Table Organism
	table: {
		container: 'overflow-x-auto',
		wrapper: 'min-w-full bg-white border border-[#DCDEDD] rounded-[20px]',
		header: 'bg-gray-50 border-b border-[#DCDEDD]',
		row: 'border-b border-[#DCDEDD] hover:bg-gray-50 transition-colors',
		cell: 'px-6 py-4',
	},

	// Modal Organism
	modal: {
		overlay: 'fixed inset-0 bg-black bg-opacity-50 z-50',
		container: 'fixed inset-0 z-50 flex items-center justify-center p-4',
		content: 'bg-white rounded-[20px] max-w-lg w-full p-6',
		header: 'mb-4 text-xl font-bold text-gray-900',
		body: 'mb-6 text-gray-600',
		footer: 'flex gap-3 justify-end',
	},
} as const;

// ============================================
// TEMPLATES - Page-level compositions
// ============================================

export const templates = {
	// Dashboard Template
	dashboard: {
		layout: 'flex h-screen bg-[#F9F9F9]',
		sidebar: organisms.navigation.sidebar,
		mainArea: 'flex-1 flex flex-col overflow-hidden',
		header: organisms.navigation.header,
		content: organisms.page.mainContent,
	},

	// Auth Template
	auth: {
		container: 'min-h-screen bg-[#F9F9F9] flex items-center justify-center',
		card: 'bg-white rounded-[20px] shadow-xl p-8 w-full max-w-md',
		logo: 'mb-8 text-center',
		form: organisms.form.container,
	},
} as const;

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get exact color value from tokens
 */
type ColorValue = string | Record<string, string | Record<string, string>>;

export const getColor = (path: string): string => {
	const keys = path.split('.');
	let value: ColorValue = atoms.colors;

	for (const key of keys) {
		if (typeof value === 'object' && value !== null && key in value) {
			value = value[key];
		} else {
			return '#000000';
		}
	}

	return typeof value === 'string' ? value : '#000000';
};

/**
 * Build component classes from molecules
 */
export const buildComponentClass = (
	component: keyof typeof molecules,
	variant?: string,
	size?: string,
	additional?: string
): string => {
	const componentConfig = molecules[component];

	if (!componentConfig) return '';

	const baseClass = 'base' in componentConfig ? componentConfig.base : '';
	const variantClass = variant && 'variants' in componentConfig ?
		(componentConfig.variants as Record<string, string>)[variant] || '' : '';
	const sizeClass = size && 'sizes' in componentConfig ?
		(componentConfig.sizes as Record<string, string>)[size] || '' : '';

	return [baseClass, variantClass, sizeClass, additional]
		.filter(Boolean)
		.join(' ');
};