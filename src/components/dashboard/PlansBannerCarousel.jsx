import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import everydayBankingImg from '../../assets/plans/everyday-banking.png';
import premiumBankingImg from '../../assets/plans/premium-banking.jpg';
import smartSavingsImg from '../../assets/plans/smart-savings.jpg';
import studentBankingImg from '../../assets/plans/student-banking.jpg';

const plans = [
  {
    id: 'everyday',
    title: 'Everyday Banking',
    image: everydayBankingImg,
    alt: 'Everyday Banking Plan - Simple. Secure. Always with you.',
  },
  {
    id: 'premium',
    title: 'Premium Banking',
    image: premiumBankingImg,
    alt: 'Premium Banking Plan - VISA Infinite experience for your next level',
  },
  {
    id: 'smart-savings',
    title: 'Smart Savings Plan',
    image: smartSavingsImg,
    alt: 'Smart Savings Plan - A simple way to grow your money',
  },
  {
    id: 'student',
    title: 'Student Banking Plan',
    image: studentBankingImg,
    alt: 'Student Banking Plan - Learn, grow and achieve more with zero fees',
  },
];

export default function PlansBannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance plans every 2 seconds (2000ms)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % plans.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % plans.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + plans.length) % plans.length);
  };

  const currentPlan = plans[currentIndex];

  return (
    <div
      className="relative mb-6 w-full overflow-hidden rounded-2xl border border-white/90 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured Banking Plans"
    >
      {/* 2-Second Progress Bar Timer indicator at top */}
      <div className="absolute top-0 inset-x-0 h-1 bg-black/10 z-20 overflow-hidden">
        <motion.div
          key={currentIndex}
          initial={{ width: '0%' }}
          animate={{ width: isPaused ? '0%' : '100%' }}
          transition={{ duration: 2, ease: 'linear' }}
          className="h-full bg-brand-500 shadow-sm"
        />
      </div>

      {/* ── Banner Strip Covering Full Width ── */}
      <div className="relative w-full h-[220px] sm:h-[260px] lg:h-[300px] overflow-hidden flex items-center justify-center">
        <AnimatePresence mode="wait">
          {/* Ambient blurred backdrop that dynamically matches and covers 100% of the page width */}
          <motion.div
            key={`bg-${currentPlan.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 w-full h-full overflow-hidden"
          >
            <img
              src={currentPlan.image}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover blur-2xl scale-125 brightness-90 saturate-150"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
            <div className="absolute inset-0 bg-slate-900/10" />
          </motion.div>
        </AnimatePresence>

        {/* Foreground sharp uncropped banner image with subtle shadow */}
        <AnimatePresence mode="wait">
          <motion.img
            key={`img-${currentPlan.id}`}
            src={currentPlan.image}
            alt={currentPlan.alt}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="relative z-10 h-full w-auto max-w-full object-contain select-none shadow-2xl rounded-xl"
          />
        </AnimatePresence>

        {/* Previous / Next Arrow Controls */}
        <button
          onClick={handlePrev}
          aria-label="Previous plan"
          className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/90 text-text-primary shadow-lg backdrop-blur-md hover:bg-white hover:scale-105 transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 z-10"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={handleNext}
          aria-label="Next plan"
          className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/90 text-text-primary shadow-lg backdrop-blur-md hover:bg-white hover:scale-105 transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 z-10"
        >
          <ChevronRight size={20} />
        </button>

        {/* Floating Glass Pill for Slide Indicator Dots */}
        <div className="absolute bottom-3 inset-x-0 z-10 flex items-center justify-center pointer-events-auto">
          <div className="flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-md px-3 py-1.5 border border-white/20 shadow-md">
            {plans.map((plan, index) => {
              const isActive = index === currentIndex;
              return (
                <button
                  key={plan.id}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to slide ${index + 1}: ${plan.title}`}
                  className={`h-2 rounded-full transition-all duration-300 ${isActive
                    ? 'w-6 bg-white shadow-sm'
                    : 'w-2 bg-white/40 hover:bg-white/80'
                    }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
