import {
	createContext,
	useContext,
	useState,
	useEffect,
	type ReactNode,
} from "react";
import { authService } from "~/services/auth.service";

export interface WithdrawalFormData {
	// Step 1: Account Verification
	passwordVerified: boolean;
	password: string;

	// Step 2: Withdrawal Details
	amount: number;
	formattedAmount: string;

	// Step 3: Bank Information
	bankName: string;
	accountNumber: string;
	accountHolderName: string;

	// User profile data
	userProfile: {
		name: string;
		email: string;
		avatar?: string;
	};
}

interface WithdrawalContextType {
	formData: WithdrawalFormData;
	updateFormData: (data: Partial<WithdrawalFormData>) => void;
	resetFormData: () => void;
}

const getDefaultFormData = (): WithdrawalFormData => {
	const user = authService.getUser();

	return {
		passwordVerified: false,
		password: "",
		amount: 0,
		formattedAmount: "",
		bankName: "",
		accountNumber: "",
		accountHolderName: user?.name || "",
		userProfile: {
			name: user?.name || "",
			email: user?.email || "",
			avatar:
				user?.user_profile?.avatar ||
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
		},
	};
};

const WithdrawalContext = createContext<WithdrawalContextType | null>(null);

interface WithdrawalProviderProps {
	children: ReactNode;
}

export function WithdrawalProvider({ children }: WithdrawalProviderProps) {
	const [formData, setFormData] =
		useState<WithdrawalFormData>(getDefaultFormData());

	const updateFormData = (data: Partial<WithdrawalFormData>) => {
		setFormData((prev) => ({ ...prev, ...data }));
	};

	const resetFormData = () => {
		setFormData(getDefaultFormData());
	};

	const value: WithdrawalContextType = {
		formData,
		updateFormData,
		resetFormData,
	};

	return (
		<WithdrawalContext.Provider value={value}>
			{children}
		</WithdrawalContext.Provider>
	);
}

export function useWithdrawal() {
	const context = useContext(WithdrawalContext);
	if (!context) {
		throw new Error(
			"useWithdrawal must be used within a WithdrawalProvider"
		);
	}
	return context;
}
