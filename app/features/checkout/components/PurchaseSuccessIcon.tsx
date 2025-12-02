import { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

export function PurchaseSuccessIcon() {
  useEffect(() => {
    // Add bounce animation to the title
    const showConfetti = () => {
      console.log('🎉 Course purchased successfully!');

      // Add a simple celebration effect to the title
      const title = document.querySelector('h1');
      if (title) {
        title.style.animation = 'bounce 0.5s ease-in-out';

        setTimeout(() => {
          title.style.animation = '';
        }, 500);
      }
    };

    // Add bounce animation via CSS
    const style = document.createElement('style');
    style.textContent = `
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
          transform: translateY(0);
        }
        40% {
          transform: translateY(-10px);
        }
        60% {
          transform: translateY(-5px);
        }
      }
    `;
    document.head.appendChild(style);

    // Show confetti animation
    showConfetti();

    return () => {
      // Cleanup style element
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
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
        <CheckCircle className="w-16 h-16 text-white relative z-10" />
      </div>
    </div>
  );
}