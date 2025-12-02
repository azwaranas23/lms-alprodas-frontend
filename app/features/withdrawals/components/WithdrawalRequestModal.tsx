import { useEffect, useState } from "react";
import { WithdrawalWizardContent } from "./WithdrawalWizardContent";

interface WithdrawalRequestModalProps {
	isOpen: boolean;
	onClose: () => void;
	onComplete?: () => void;
}

export default function WithdrawalRequestModal({
	isOpen,
	onClose,
	onComplete,
}: WithdrawalRequestModalProps) {
	const [currentStep, setCurrentStep] = useState(1);
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}

		return () => {
			document.body.style.overflow = "auto";
		};
	}, [isOpen]);

	const handleComplete = () => {
		onComplete?.();
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 bg-white">
			<WithdrawalWizardContent
				currentStep={currentStep}
				onStepChange={setCurrentStep}
				onComplete={handleComplete}
				onCancel={onClose}
			/>
		</div>
	);
}
