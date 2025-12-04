// app/features/courses/components/CourseBenefitsTab.tsx
interface BenefitItem {
  icon: string;
  color: string;
  title: string;
  description: string;
}

const BENEFITS: BenefitItem[] = [
  {
    icon: "🚀",
    color: "blue",
    title: "Career Advancement",
    description:
      "Master one of the most in-demand frontend frameworks and boost your career prospects.",
  },
  {
    icon: "💻",
    color: "green",
    title: "Hands-on Projects",
    description:
      "Build multiple real-world projects that you can showcase in your portfolio.",
  },
  {
    icon: "👥",
    color: "purple",
    title: "Community Support",
    description: "Join a learning community and get help when you need it.",
  },
  {
    icon: "⏰",
    color: "orange",
    title: "Lifetime Access",
    description:
      "Access course content forever, including future updates and new lessons.",
  },
  {
    icon: "🏆",
    color: "yellow",
    title: "Certificate of Completion",
    description:
      "Receive a verified certificate upon completion to showcase your skills.",
  },
  {
    icon: "🎧",
    color: "red",
    title: "Expert Support",
    description:
      "Get direct access to instructor for questions and code reviews.",
  },
];

export function CourseBenefitsTab() {
  return (
    <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-8">
      <h2 className="text-2xl font-bold text-brand-dark mb-6">
        Course Benefits
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {BENEFITS.map((benefit, index) => (
          <div key={index} className="flex items-start gap-4">
            <div
              className={`w-12 h-12 bg-${benefit.color}-50 rounded-[12px] flex items-center justify-center flex-shrink-0 text-xl`}
            >
              {benefit.icon}
            </div>
            <div>
              <h3 className="text-lg font-bold text-brand-dark mb-2">
                {benefit.title}
              </h3>
              <p className="text-brand-light">{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
