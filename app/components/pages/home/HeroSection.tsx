import { ArrowRight, Play, Star, TrendingUp, Users } from "lucide-react";
import { Button } from "~/components/atoms/Button";
import { motion } from "framer-motion";

interface HeroSectionProps {
  onSmoothScroll: (e: React.MouseEvent<HTMLElement>, href: string) => void;
}

export function HeroSection({ onSmoothScroll }: HeroSectionProps) {
  return (
    <section id="home" className="relative overflow-hidden bg-white pb-16 lg:pt-48 lg:pb-24">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-blue-50/50 via-purple-50/30 to-white -z-10 rounded-b-[4rem]" />

      <div className="max-w-7xl py-12 mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">

        {/* Main Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.2
                }
              }
            }}
            className="text-5xl md:text-7xl font-extrabold text-brand-dark mb-6 leading-tight tracking-tight"
          >
            <span className="inline-block bg-[linear-gradient(110deg,#1a202c,45%,#2563eb,55%,#1a202c)] bg-[length:200%_100%] bg-clip-text text-transparent animate-background-shine">
              Learn, Practice, Master,
            </span>
            <br className="hidden lg:block" />
            <motion.span
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } }
              }}
              className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
            >
              Alprodas LMS
            </motion.span>
          </motion.h1>
          <p className="text-lg text-brand-light mb-8 max-w-2xl mx-auto leading-relaxed">
            Experience the future of online education. Access high-quality courses, track your progress, and earn certifications—all in one intuitive platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              variant="primary"
              onClick={(e) => onSmoothScroll(e, "#courses")}
              className="rounded-full px-8 py-4 text-base font-bold shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transition-all min-w-[160px]"
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              onClick={(e) => onSmoothScroll(e, "#topics")}
              className="rounded-full px-8 py-4 text-base font-semibold border-2 hover:bg-gray-50 min-w-[160px] inline-flex justify-center items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              Watch Demo
            </Button>
          </div>
        </motion.div>

        {/* Central Image & Floating Widgets */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-5xl mx-auto mt-16"
        >
          {/* Background Blob Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-purple-100/50 via-blue-100/50 to-pink-100/50 rounded-full blur-3xl -z-10 animate-pulse" />

          {/* Main Character Image */}
          <div className="relative z-10">
            <img
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
              alt="Happy Student"
              className="w-full max-w-[800px] mx-auto rounded-[40px] shadow-2xl border-4 border-white"
            />
          </div>

          {/* Floating Widget: Chart (Bottom Left) */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="hidden md:block absolute bottom-12 -left-8 lg:-left-20 z-20 bg-white p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
          >
            <div className="flex items-end gap-2 h-16 w-32">
              {[40, 70, 45, 90, 65, 85].map((h, i) => (
                <div key={i} className="flex-1 bg-blue-100 rounded-t-sm relative group">
                  <div
                    className="absolute bottom-0 w-full bg-blue-500 rounded-t-sm transition-all duration-1000"
                    style={{ height: `${h}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between items-center">
              <span className="text-xs font-bold text-gray-700">Growth</span>
              <span className="text-xs text-green-500 font-bold flex items-center gap-1">
                <TrendingUp size={12} /> +24%
              </span>
            </div>
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
}
