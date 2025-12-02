import { useState } from "react";
import {
	UserCheck,
	User,
	Mail,
	Lock,
	ShieldCheck,
	Check,
	ArrowRight,
	ShieldAlert,
	Loader2,
	X,
} from "lucide-react";
import { withdrawalsService } from "~/services/withdrawals.service";
import { useWithdrawal } from "~/contexts/WithdrawalContext";
import { getAvatarSrc } from "~/utils/formatters";

interface AccountVerificationStepProps {
	onNext: () => void;
	onBack?: () => void;
}

export default function AccountVerificationStep({
	onNext,
	onBack,
}: AccountVerificationStepProps) {
	const { formData, updateFormData } = useWithdrawal();
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [passwordMatch, setPasswordMatch] = useState(true);
	const [isValidating, setIsValidating] = useState(false);
	const [validationError, setValidationError] = useState("");

	const handlePasswordChange = (value: string) => {
		setPassword(value);
		if (confirmPassword && value !== confirmPassword) {
			setPasswordMatch(false);
		} else {
			setPasswordMatch(true);
		}
	};

	const handleConfirmPasswordChange = (value: string) => {
		setConfirmPassword(value);
		if (password && value !== password) {
			setPasswordMatch(false);
		} else {
			setPasswordMatch(true);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!password || !confirmPassword || !passwordMatch) {
			return;
		}

		setIsValidating(true);
		setValidationError("");

		try {
			const response =
				await withdrawalsService.validatePassword(password);
			const isValid = response.data.is_valid;

			if (isValid) {
				updateFormData({
					passwordVerified: true,
					password: password,
				});
				onNext();
			} else {
				setValidationError(
					"Invalid password. Please check your password and try again."
				);
			}
		} catch (error: any) {
			console.error("Password validation error:", error);

			// Handle Zod validation errors from API
			if (
				error?.response?.data?.errors &&
				Array.isArray(error.response.data.errors)
			) {
				const zodErrors = error.response.data.errors;
				// Format: "path: message" for each error, separated by newlines
				const errorList = zodErrors
					.map((err: any) => `• ${err.path}: ${err.message}`)
					.join("\n");
				setValidationError(errorList);
			} else {
				const errorMessage =
					error?.response?.data?.message ||
					"Failed to validate password. Please try again.";
				setValidationError(errorMessage);
			}
		} finally {
			setIsValidating(false);
		}
	};

	return (
		<div className="flex gap-6 pl-5 items-start">
			{/* Form Section */}
			<div className="flex-1">
				<form className="space-y-6" onSubmit={handleSubmit}>
					{/* Account Verification Section */}
					<div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
						<div className="flex items-center gap-3 mb-6">
							<div className="w-12 h-12 bg-blue-50 rounded-[12px] flex items-center justify-center">
								<UserCheck className="w-6 h-6 text-blue-600" />
							</div>
							<div>
								<h3 className="text-brand-dark text-xl font-bold">
									Account Verification
								</h3>
								<p className="text-brand-light text-sm font-normal">
									Verify your identity before processing
									withdrawal
								</p>
							</div>
						</div>

						<div className="space-y-5">
							{/* Profile Photo Display */}
							<div className="flex items-center justify-center mb-6">
								<div className="relative">
									<img
										src={getAvatarSrc(
											formData.userProfile.avatar,
											formData.userProfile.name
										)}
										alt="Profile Photo"
										className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
										onError={(e) => {
											e.currentTarget.src = getAvatarSrc(
												undefined,
												formData.userProfile.name
											);
										}}
									/>
									<div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
										<Check className="w-4 h-4 text-white" />
									</div>
								</div>
							</div>

							{/* Full Name (Auto-filled, readonly) */}
							<div className="mb-4">
								<label className="block text-brand-dark text-base font-semibold mb-1">
									Full Name
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
										<User className="h-5 w-5 text-gray-400" />
									</div>
									<input
										type="text"
										readOnly
										value={formData.userProfile.name}
										className="w-full pl-12 pr-4 py-3 border border-[#DCDEDD] rounded-[16px] bg-gray-50 text-gray-700 font-semibold cursor-not-allowed"
									/>
								</div>
							</div>

							{/* Email (Auto-filled, readonly) */}
							<div className="mb-4">
								<label className="block text-brand-dark text-base font-semibold mb-1">
									Email Address
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
										<Mail className="h-5 w-5 text-gray-400" />
									</div>
									<input
										type="email"
										readOnly
										value={formData.userProfile.email}
										className="w-full pl-12 pr-4 py-3 border border-[#DCDEDD] rounded-[16px] bg-gray-50 text-gray-700 font-semibold cursor-not-allowed"
									/>
								</div>
							</div>

							{/* Password */}
							<div className="mb-4">
								<label className="block text-brand-dark text-base font-semibold mb-1">
									Password *
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
										<Lock className="h-5 w-5 text-gray-400" />
									</div>
									<input
										type="password"
										required
										value={password}
										onChange={(e) =>
											handlePasswordChange(e.target.value)
										}
										className="w-full pl-12 pr-4 py-3 border border-[#DCDEDD] rounded-[16px] hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2 focus:bg-white transition-all duration-300 font-semibold"
										placeholder="Enter your password"
									/>
								</div>
							</div>

							{/* Confirm Password */}
							<div className="mb-4">
								<label className="block text-brand-dark text-base font-semibold mb-1">
									Confirm Password *
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
										<ShieldCheck className="h-5 w-5 text-gray-400" />
									</div>
									<input
										type="password"
										required
										value={confirmPassword}
										onChange={(e) =>
											handleConfirmPasswordChange(
												e.target.value
											)
										}
										className={`w-full pl-12 pr-4 py-3 border rounded-[16px] hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2 focus:bg-white transition-all duration-300 font-semibold ${
											!passwordMatch
												? "border-red-500"
												: "border-[#DCDEDD]"
										}`}
										placeholder="Confirm your password"
									/>
								</div>
								{!passwordMatch && (
									<p className="text-danger text-sm mt-1">
										Passwords do not match
									</p>
								)}
							</div>

							{/* Validation Error */}
							{validationError && (
								<div
									className="rounded-[8px] p-4"
									style={{
										background: "#FEE2E2",
										border: "1px solid #F87171",
									}}
								>
									<div className="flex items-center gap-3">
										<X className="w-5 h-5 text-[#DC2626]" />
										<div>
											<h4 className="text-danger text-sm font-semibold m-0">
												Password Validation Failed
											</h4>
											<p className="text-danger text-sm font-normal m-0 whitespace-pre-line">
												{validationError}
											</p>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>

					{/* Form Navigation */}
					<div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-brand-dark text-sm font-medium">
									Step 1 of 4
								</p>
								<p className="text-brand-light text-xs font-normal mt-1">
									Verify your account to proceed with
									withdrawal
								</p>
							</div>
							<div className="flex items-center gap-3">
								{onBack && (
									<button
										type="button"
										onClick={onBack}
										className="border border-[#DCDEDD] rounded-[8px] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 px-6 py-3 flex items-center gap-2"
									>
										<span className="text-brand-dark text-base font-semibold">
											Cancel
										</span>
									</button>
								)}
								<button
									type="submit"
									disabled={
										!password ||
										!confirmPassword ||
										!passwordMatch ||
										isValidating
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
						<div className="w-10 h-10 bg-yellow-50 rounded-[12px] flex items-center justify-center">
							<ShieldAlert className="w-5 h-5 text-yellow-600" />
						</div>
						<div>
							<h3 className="text-brand-dark text-lg font-bold">
								Security Tips
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
									Use strong password
								</p>
								<p className="text-brand-light text-xs font-normal">
									Your password should be secure and private
								</p>
							</div>
						</div>

						<div className="flex items-start gap-3">
							<div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
								<Check className="w-3 h-3 text-green-600" />
							</div>
							<div>
								<p className="text-brand-dark text-base font-semibold">
									Verify your identity
								</p>
								<p className="text-brand-light text-xs font-normal">
									This step ensures account security
								</p>
							</div>
						</div>

						<div className="flex items-start gap-3">
							<div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
								<Check className="w-3 h-3 text-green-600" />
							</div>
							<div>
								<p className="text-brand-dark text-base font-semibold">
									Double-check information
								</p>
								<p className="text-brand-light text-xs font-normal">
									Ensure all details are accurate before
									proceeding
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
