import { useEffect } from 'react';
import { Trophy } from 'lucide-react';

export function SuccessIcon() {
  useEffect(() => {
    // Trigger confetti celebration
    const timer = setTimeout(() => {
      import('canvas-confetti')
        .then((module) => {
          const confetti = module.default;
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        })
        .catch((err) => {
          console.error('Failed to load canvas-confetti:', err);
        });
    }, 500);

    // Success animation
    const successTimer = setTimeout(() => {
      console.log('🎉 Course completed successfully!');
    }, 500);

    return () => {
      clearTimeout(timer);
      clearTimeout(successTimer);
    };
  }, []);

  return (
    <div className="mb-8">
      <div className="w-32 h-32 mx-auto relative flex items-center justify-center">
        {/* Background circle */}
        <div className="w-32 h-32 absolute bg-gradient-to-br from-primary-100 to-primary-200 rounded-full"></div>
        {/* Overlapping smaller circle */}
        <div className="w-24 h-24 absolute bg-gradient-to-br from-primary-500 to-primary-600 rounded-full opacity-90"></div>
        {/* Success icon */}
        <Trophy className="w-16 h-16 text-white relative z-10" />
      </div>
    </div>
  );
}