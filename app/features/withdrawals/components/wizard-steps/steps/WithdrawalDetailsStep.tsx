import { useState, useEffect } from "react";
import {
	Wallet,
	CreditCard,
	ArrowRight,
	ArrowLeft,
	Lightbulb,
	Check,
	ShieldCheck,
	Loader2,
	X,
} from "lucide-react";
import { withdrawalsService } from "~/services/withdrawals.service";
import { useWithdrawal } from "~/contexts/WithdrawalContext";
import { withdrawalAmountSchema } from "~/schemas/withdrawals";
import { ApiErrorMessage } from "~/components/atoms/ApiErrorMessage";

interface WithdrawalDetailsStepProps {
	onNext: () => void;
	onBack: () => void;
}

export default function WithdrawalDetailsStep({
	onNext,
	onBack,
}: WithdrawalDetailsStepProps) {
	const { formData, updateFormData } = useWithdrawal();
	const [withdrawalAmount, setWithdrawalAmount] = useState(
		formData.formattedAmount || ""
	);
	const [balance, setBalance] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isValidating, setIsValidating] = useState(false);
	const [validationError, setValidationError] = useState<any>(null);
	const [zodError, setZodError] = useState("");

	useEffect(() => {
		const loadBalance = async () => {
			try {
				const response =
					await withdrawalsService.getWithdrawalBalance();
				setBalance(response.data);
			} catch (error) {
				console.error("Failed to load balance:", error);
				setValidationError(
					"Failed to load balance information. Please try again."
				);
			} finally {
				setIsLoading(false);
			}
		};

		loadBalance();
	}, []);

	const formatCurrency = (value: string) => {
		let cleanValue = value.replace(/[^\d]/g, "");
		if (cleanValue) {
			return parseInt(cleanValue).toLocaleString("id-ID");
		}
		return "";
	};

	const setPercentage = (percent: number) => {
		if (!balance) return;
		const amount = Math.floor(balance.available_balance * (percent / 100));
		setWithdrawalAmount(amount.toLocaleString("id-ID"));
	};

	const handleAmountChange = (value: string) => {
		const cleanValue = value.replace(/[^\d]/g, "");
		const numericAmount = parseInt(cleanValue) || 0;

		setWithdrawalAmount(formatCurrency(value));

		// Clear validation error when user types
		if (validationError) {
			setValidationError(null);
		}

		// Validate against minimum and maximum
		if (numericAmount > 0 && numericAmount < 100000) {
			setZodError("Minimum withdrawal amount is Rp 100,000");
			return;
		}

		if (balance && numericAmount > balance.available_balance) {
			setZodError(`Maximum withdrawal amount is Rp ${balance.available_balance.toLocaleString("id-ID")}`);
			return;
		}

		// Clear Zod error if valid
		if (zodError) {
			setZodError("");
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!withdrawalAmount || !balance) {
			return;
		}

		const amount = parseInt(withdrawalAmount.replace(/[^\d]/g, ""));

		// Validate with Zod first
		const validation = withdrawalAmountSchema.safeParse({ amount });

		if (!validation.success) {
			const firstError = validation.error.issues[0];
			setZodError(firstError.message);
			return;
		}

		setIsValidating(true);
		setValidationError(null);
		setZodError("");

		try {
			const response = await withdrawalsService.checkBalance(amount);
			const { can_withdraw } = response.data;

			if (can_withdraw) {
				// Save withdrawal amount to context
				updateFormData({
					amount,
					formattedAmount: withdrawalAmount,
				});
				onNext();
			} else {
				setValidationError(
					"Insufficient balance for this withdrawal amount."
				);
			}
		} catch (error: any) {
			console.error("Balance check error:", error);

			// Pass structured API error data directly to ApiErrorMessage
			const errorData = error?.response?.data || "Failed to validate withdrawal amount. Please try again.";
			setValidationError(errorData);
		} finally {
			setIsValidating(false);
		}
	};

	return (
		<div className="flex gap-6 pl-5 items-start">
			{/* Form Section */}
			<div className="flex-1">
				{/* E-Wallet Balance Card */}
				<div className="main-card rounded-[20px] border border-[#0B1042] relative overflow-hidden p-6 mb-6">
					<div className="flex flex-col justify-center h-full relative z-10">
						{/* Available Badge */}
						<div className="flex items-center gap-2 mb-3">
							<div className="flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
								<Wallet className="w-3 h-3 text-white" />
								<span className="text-brand-white text-xs font-semibold">
									Available Balance
								</span>
							</div>
						</div>

						<div className="flex items-center justify-between mb-4">
							<div>
								<p className="text-brand-white-90 text-sm font-medium">
									Your E-Wallet
								</p>
								<p
									className="text-brand-white text-5xl font-extrabold leading-none my-4"
									id="totalBalance"
								>
									{isLoading ? (
										<span className="flex items-center gap-2">
											<Loader2 className="w-8 h-8 animate-spin" />
											Loading...
										</span>
									) : balance ? (
										`Rp ${balance.available_balance.toLocaleString("id-ID")}`
									) : (
										"Rp 0"
									)}
								</p>
								<p className="text-brand-white-80 text-base font-normal">
									Available for withdrawal
								</p>
							</div>
							<div className="w-16 h-16 bg-white/20 rounded-[20px] flex items-center justify-center">
								<Wallet className="w-8 h-8 text-white" />
							</div>
						</div>

						{/* Additional Info */}
						<div className="flex items-center gap-3 mt-auto">
							<div className="flex items-center gap-1">
								<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
								<span className="text-brand-white-70 text-xs font-normal">
									Active Account
								</span>
							</div>
							<div className="flex items-center gap-1">
								<ShieldCheck className="w-3 h-3 text-white opacity-70" />
								<span className="text-brand-white-70 text-xs font-normal">
									Verified
								</span>
							</div>
						</div>
					</div>
				</div>

				<form className="space-y-6" onSubmit={handleSubmit}>
					{/* Withdrawal Amount Section */}
					<div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
						<div className="flex items-center gap-3 mb-6">
							<div className="w-12 h-12 bg-blue-50 rounded-[12px] flex items-center justify-center">
								<CreditCard className="w-6 h-6 text-blue-600" />
							</div>
							<div>
								<h3 className="text-brand-dark text-xl font-bold">
									Withdrawal Details
								</h3>
								<p className="text-brand-light text-sm font-normal">
									Specify the amount you want to withdraw
								</p>
							</div>
						</div>

						<div className="space-y-5">
							{/* Withdrawal Amount Input */}
							<div className="mb-6">
								<label className="block text-brand-dark text-base font-semibold mb-1">
									Withdrawal Amount *
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
										<span className="text-gray-400 text-lg font-semibold">
											Rp
										</span>
									</div>
									<input
										type="text"
										id="withdrawalAmount"
										required
										value={withdrawalAmount}
										onChange={(e) =>
											handleAmountChange(e.target.value)
										}
										className={`w-full pl-16 pr-4 py-4 text-2xl font-bold rounded-[16px] focus:bg-white transition-all duration-300 ${
											zodError
												? "border-2 border-[#DC2626]"
												: "border border-[#DCDEDD] hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2"
										}`}
										placeholder="0"
									/>
								</div>
								{zodError && (
									<p className="mt-2 text-sm text-[#DC2626] font-medium">
										{zodError}
									</p>
								)}
								<div className="mt-2 flex items-center justify-between">
									<p className="text-brand-light text-sm">
										Minimum withdrawal: Rp 100,000
									</p>
									<p className="text-brand-light text-sm">
										Maximum: {balance ? `Rp ${balance.available_balance.toLocaleString("id-ID")}` : "Rp 0"}
									</p>
								</div>
							</div>

							{/* Quick Amount Selection */}
							<div className="mb-6">
								<label className="block text-brand-dark text-base font-semibold mb-3">
									Quick Select
								</label>
								<div className="grid grid-cols-4 gap-3">
									<button
										type="button"
										onClick={() => setPercentage(25)}
										className="border border-[#DCDEDD] rounded-[12px] hover:border-[#0C51D9] hover:border-2 hover:bg-blue-50 transition-all duration-300 px-4 py-3 text-center"
									>
										<div className="text-brand-dark text-lg font-bold">
											25%
										</div>
										<div className="text-brand-light text-xs">
											{balance ? `Rp ${Math.floor(balance.available_balance * 0.25).toLocaleString("id-ID")}` : "Rp 0"}
										</div>
									</button>
									<button
										type="button"
										onClick={() => setPercentage(50)}
										className="border border-[#DCDEDD] rounded-[12px] hover:border-[#0C51D9] hover:border-2 hover:bg-blue-50 transition-all duration-300 px-4 py-3 text-center"
									>
										<div className="text-brand-dark text-lg font-bold">
											50%
										</div>
										<div className="text-brand-light text-xs">
											{balance ? `Rp ${Math.floor(balance.available_balance * 0.5).toLocaleString("id-ID")}` : "Rp 0"}
										</div>
									</button>
									<button
										type="button"
										onClick={() => setPercentage(75)}
										className="border border-[#DCDEDD] rounded-[12px] hover:border-[#0C51D9] hover:border-2 hover:bg-blue-50 transition-all duration-300 px-4 py-3 text-center"
									>
										<div className="text-brand-dark text-lg font-bold">
											75%
										</div>
										<div className="text-brand-light text-xs">
											{balance ? `Rp ${Math.floor(balance.available_balance * 0.75).toLocaleString("id-ID")}` : "Rp 0"}
										</div>
									</button>
									<button
										type="button"
										onClick={() => setPercentage(100)}
										className="border border-[#DCDEDD] rounded-[12px] hover:border-[#0C51D9] hover:border-2 hover:bg-blue-50 transition-all duration-300 px-4 py-3 text-center"
									>
										<div className="text-brand-dark text-lg font-bold">
											100%
										</div>
										<div className="text-brand-light text-xs">
											{balance ? `Rp ${balance.available_balance.toLocaleString("id-ID")}` : "Rp 0"}
										</div>
									</button>
								</div>
							</div>
						</div>
					</div>

					{/* API Validation Error */}
					{validationError && (
						<ApiErrorMessage
							title="Amount Validation Failed"
							message={validationError}
						/>
					)}

					{/* Form Navigation */}
					<div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-brand-dark text-sm font-medium">
									Step 2 of 4
								</p>
								<p className="text-brand-light text-xs font-normal mt-1">
									Specify withdrawal amount and details
								</p>
							</div>
							<div className="flex items-center gap-3">
								<button
									type="button"
									onClick={onBack}
									className="border border-[#DCDEDD] rounded-[8px] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 px-6 py-3 flex items-center gap-2"
								>
									<ArrowLeft className="w-4 h-4 text-gray-600" />
									<span className="text-brand-dark text-base font-semibold">
										Back
									</span>
								</button>
								<button
									type="submit"
									disabled={
										!withdrawalAmount ||
										!balance ||
										isValidating ||
										!!zodError
									}
									className="btn-primary rounded-[8px] border border-[#2151A0] hover:brightness-110 focus:ring-2 focus:ring-[#0C51D9] transition-all duration-300 blue-gradient blue-btn-shadow px-6 py-3 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{isValidating ? (
										<>
											<Loader2 className="w-4 h-4 text-white animate-spin" />
											<span className="text-brand-white text-base font-semibold">
												Validating...
											</span>
										</>
									) : (
										<>
											<span className="text-brand-white text-base font-semibold">
												Continue
											</span>
											<ArrowRight className="w-4 h-4 text-white" />
										</>
									)}
								</button>
							</div>
						</div>
					</div>
				</form>
			</div>

			{/* Tips Section */}
			<div className="w-80 flex-shrink-0 pr-5">
				<div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6 sticky top-5">
					<div className="flex items-center gap-3 mb-4">
						<div className="w-10 h-10 bg-green-50 rounded-[12px] flex items-center justify-center">
							<Lightbulb className="w-5 h-5 text-green-600" />
						</div>
						<div>
							<h3 className="text-brand-dark text-lg font-bold">
								Withdrawal Tips
							</h3>
						</div>
					</div>

					<div className="space-y-4">
						<div className="flex items-start gap-3">
							<div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
								<Check className="w-3 h-3 text-green-600" />
							</div>
							<div>
								<p className="text-brand-dark text-base font-semibold">
									Plan your amount
								</p>
								<p className="text-brand-light text-xs font-normal">
									Consider your upcoming expenses and keep
									some balance
								</p>
							</div>
						</div>

						<div className="flex items-start gap-3">
							<div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
								<Check className="w-3 h-3 text-green-600" />
							</div>
							<div>
								<p className="text-brand-dark text-base font-semibold">
									Processing time
								</p>
								<p className="text-brand-light text-xs font-normal">
									Withdrawals typically take 1-3 business days
								</p>
							</div>
						</div>

						<div className="flex items-start gap-3">
							<div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
								<Check className="w-3 h-3 text-green-600" />
							</div>
							<div>
								<p className="text-brand-dark text-base font-semibold">
									No hidden fees
								</p>
								<p className="text-brand-light text-xs font-normal">
									We don't charge any withdrawal fees
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
