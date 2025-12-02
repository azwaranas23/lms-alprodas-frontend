import { useState, useRef, useEffect } from "react";
import { Image, Upload, ImagePlus, X, Check, ArrowRight, ArrowLeft, AlertCircle } from "lucide-react";
import { env } from "~/config/env";

interface CourseData {
	mainPhoto?: File;
	previewPhoto?: File;
	contentPhoto?: File;
	certificatePhoto?: File;
	images?: Array<{ image_path: string }>;
}

interface CoursePhotosStepProps {
	data: CourseData;
	onUpdate: (data: Partial<CourseData>) => void;
	onNext: () => void;
	onPrevious: () => void;
}

interface PhotoUploadProps {
	id: number;
	label: string;
	required?: boolean;
	file?: File;
	onPhotoSelect: (file: File | null) => void;
	placeholderText: string;
	initialImageUrl?: string;
	error?: string;
}

function PhotoUpload({
	id,
	label,
	required,
	file,
	onPhotoSelect,
	placeholderText,
	initialImageUrl,
	error,
}: PhotoUploadProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [previewUrl, setPreviewUrl] = useState<string>(initialImageUrl || "");

	console.log(`PhotoUpload ${id} - initialImageUrl:`, initialImageUrl);
	console.log(`PhotoUpload ${id} - previewUrl:`, previewUrl);

	useEffect(() => {
		if (initialImageUrl && !file) {
			setPreviewUrl(initialImageUrl);
		} else if (file) {
			// If there's a file, create object URL for preview
			const url = URL.createObjectURL(file);
			setPreviewUrl(url);

			// Cleanup function to revoke object URL
			return () => {
				URL.revokeObjectURL(url);
			};
		}
	}, [initialImageUrl, file]);

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = event.target.files?.[0];
		if (selectedFile) {
			if (selectedFile.size > 5242880) {
				console.error("File size must be less than 5MB");
				if (fileInputRef.current) fileInputRef.current.value = "";
				return;
			}

			if (!selectedFile.type.startsWith("image/")) {
				console.error("Please select a valid image file");
				if (fileInputRef.current) fileInputRef.current.value = "";
				return;
			}

			// Just update the file, useEffect will handle the preview URL
			onPhotoSelect(selectedFile);
		}
	};

	const handleReset = () => {
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
		}
		setPreviewUrl("");
		onPhotoSelect(null);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	const handleClick = () => {
		fileInputRef.current?.click();
	};

	return (
		<div className="space-y-3">
			<label className="block text-brand-dark text-base font-semibold">
				{label} {required && "*"}
			</label>
			<div className="w-full h-42">
				<div className="relative w-full h-42">
					<div className={`w-full h-42 absolute bg-gray-50 rounded-[16px] border-2 border-dashed ${error ? 'border-[#DC2626]' : 'border-[#DCDEDD]'}`}></div>

					<div className="w-full h-42 relative z-10 flex items-center justify-center rounded-[16px] overflow-hidden">
						{previewUrl ? (
							<img
								src={previewUrl}
								alt={`Course Photo ${id}`}
								className="w-full h-42 object-cover rounded-[16px]"
							/>
						) : (
							<div className="flex flex-col items-center justify-center text-gray-400 h-full">
								<Image className="w-10 h-10 mb-2" />
								<span className="text-sm font-medium">
									{placeholderText}
								</span>
							</div>
						)}
					</div>

					{!previewUrl && (
						<div
							className="absolute inset-0 rounded-[16px] flex items-center justify-center transition-all duration-300 cursor-pointer z-20 group hover:bg-black hover:bg-opacity-30"
							onClick={handleClick}
						>
							<Upload className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 relative z-10" />
						</div>
					)}
				</div>
			</div>

			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				className="hidden"
				onChange={handleFileSelect}
			/>

			<div className="flex gap-2">
				<button
					type="button"
					onClick={handleClick}
					className="flex-1 border border-[#DCDEDD] rounded-[8px] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 px-3 py-2 flex items-center justify-center gap-2"
				>
					<ImagePlus className="w-4 h-4 text-gray-600" />
					<span className="text-brand-dark text-sm font-semibold">
						Select
					</span>
				</button>
				<button
					type="button"
					onClick={handleReset}
					className="flex-1 border border-[#DCDEDD] rounded-[8px] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 px-3 py-2 flex items-center justify-center gap-2"
				>
					<X className="w-4 h-4 text-gray-600" />
					<span className="text-brand-dark text-sm font-semibold">
						Remove
					</span>
				</button>
			</div>
			{error && (
				<div className="flex items-center gap-2 text-danger text-sm mt-1">
					<AlertCircle className="w-4 h-4" />
					<span>{error}</span>
				</div>
			)}
		</div>
	);
}

export function CoursePhotosStep({
	data,
	onUpdate,
	onNext,
	onPrevious,
}: CoursePhotosStepProps) {
	const [errors, setErrors] = useState<{ mainPhoto?: string }>({});

	console.log('CoursePhotosStep - data:', data);
	console.log('CoursePhotosStep - data.images:', data.images);

	const handlePhotoSelect = (photoType: string, file: File | null) => {
		onUpdate({
			...data,
			[photoType]: file,
		});
		// Clear error when user selects a file
		if (photoType === 'mainPhoto' && file && errors.mainPhoto) {
			setErrors({});
		}
	};

	const handleNext = () => {
		// Validate main photo is required
		if (!data.mainPhoto && !data.images?.[0]?.image_path) {
			setErrors({ mainPhoto: 'Main course photo is required' });
			return;
		}

		setErrors({});
		onNext();
	};

	return (
		<div className="space-y-6">
			{/* Course Photos Section */}
			<div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
				<div className="flex items-center gap-3 mb-6">
					<div className="w-12 h-12 bg-blue-50 rounded-[12px] flex items-center justify-center">
						<Image className="w-6 h-6 text-blue-600" />
					</div>
					<div>
						<h3 className="text-brand-dark text-xl font-bold">
							Course Photos
						</h3>
						<p className="text-brand-light text-sm font-normal">
							Add visual content to showcase your course
						</p>
					</div>
				</div>

				{/* Photo Upload Grid */}
				<div className="space-y-6">
					<div className="grid grid-cols-2 gap-6">
						<PhotoUpload
							id={1}
							label="Main Course Photo"
							required={true}
							file={data.mainPhoto}
							onPhotoSelect={(file) =>
								handlePhotoSelect("mainPhoto", file)
							}
							placeholderText="Main Photo"
							initialImageUrl={data.images?.[0]?.image_path ? `${env.BASE_URL}/${data.images[0].image_path}` : undefined}
							error={errors.mainPhoto}
						/>

						<PhotoUpload
							id={2}
							label="Course Preview Photo"
							file={data.previewPhoto}
							onPhotoSelect={(file) =>
								handlePhotoSelect("previewPhoto", file)
							}
							placeholderText="Preview Photo"
							initialImageUrl={data.images?.[1]?.image_path ? `${env.BASE_URL}/${data.images[1].image_path}` : undefined}
						/>

						<PhotoUpload
							id={3}
							label="Content Sample Photo"
							file={data.contentPhoto}
							onPhotoSelect={(file) =>
								handlePhotoSelect("contentPhoto", file)
							}
							placeholderText="Content Sample"
							initialImageUrl={data.images?.[2]?.image_path ? `${env.BASE_URL}/${data.images[2].image_path}` : undefined}
						/>

						<PhotoUpload
							id={4}
							label="Certificate Design Photo"
							file={data.certificatePhoto}
							onPhotoSelect={(file) =>
								handlePhotoSelect("certificatePhoto", file)
							}
							placeholderText="Certificate Design"
							initialImageUrl={data.images?.[3]?.image_path ? `${env.BASE_URL}/${data.images[3].image_path}` : undefined}
						/>
					</div>
				</div>
			</div>

			{/* Form Navigation */}
			<div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-brand-dark text-sm font-medium">
							Step 2 of 5
						</p>
						<p className="text-brand-light text-xs font-normal mt-1">
							Upload photos to showcase your course content
						</p>
					</div>
					<div className="flex items-center gap-3">
						<button
							type="button"
							onClick={onPrevious}
							className="border border-[#DCDEDD] rounded-[8px] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 px-6 py-3 flex items-center gap-2"
						>
							<ArrowLeft className="w-4 h-4 text-gray-600" />
							<span className="text-brand-dark text-base font-semibold">
								Previous
							</span>
						</button>
						<button
							type="button"
							onClick={handleNext}
							className="btn-primary rounded-[8px] border border-[#2151A0] hover:brightness-110 focus:ring-2 focus:ring-[#0C51D9] transition-all duration-300 blue-gradient blue-btn-shadow px-6 py-3 flex items-center gap-2"
						>
							<span className="text-brand-white text-base font-semibold">
								Next: Course Details
							</span>
							<ArrowRight className="w-4 h-4 text-white" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
