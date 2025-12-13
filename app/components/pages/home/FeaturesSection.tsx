import { MonitorPlay, Users, Award, Clock, ShieldCheck, Puzzle } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Expert-Led Instruction",
    description: "Learn from industry professionals with years of real-world experience in top tech companies.",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Lifetime Access",
    description: "Purchase once and get unlimited access to course materials, updates, and future content additions.",
    icon: Clock,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Practical Projects",
    description: "Build a professional portfolio with hands-on projects that simulate real work environments.",
    icon: MonitorPlay,
    color: "text-teal-600",
    bgColor: "bg-teal-50",
  },
  {
    title: "Recognized Certification",
    description: "Earn certificates upon completion to showcase your skills to potential employers.",
    icon: Award,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    title: "24/7 Community Support",
    description: "Get unstuck quickly with round-the-clock support from mentors and peer learning groups.",
    icon: ShieldCheck,
    color: "text-pink-600",
    bgColor: "bg-pink-50",
  },
  {
    title: "Career Guidance",
    description: "Get personalized career advice and interview preparation to help you.",
    icon: Puzzle,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark mb-4">
            Why Choose Alprodas LMS?
          </h2>
          <p className="text-xl text-brand-light">
            We provide everything you need to transform your career and master
            new skills.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={item}
                whileHover={{
                  y: -10,
                  boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
                }}
                className="group p-6 rounded-[20px] border border-gray-100 bg-white transition-colors duration-300"
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
