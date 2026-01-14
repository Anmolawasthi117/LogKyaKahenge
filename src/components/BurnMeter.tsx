import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import { BURN_LEVELS, SAVAGE_TITLES } from '../lib/constants';

interface BurnMeterProps {
  progress: number; // 0-100
  isAnimating?: boolean;
}

export function BurnMeter({ progress, isAnimating = true }: BurnMeterProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  // Get current burn level
  const currentLevel = BURN_LEVELS.find(
    (level) => progress >= level.min && progress < level.max
  ) || BURN_LEVELS[BURN_LEVELS.length - 1];

  // Get a random savage title for high burn levels (memoized so it doesn't change on re-render)
  const savageTitle = useMemo(() => {
    if (progress >= 90) {
      return SAVAGE_TITLES[Math.floor(Math.random() * SAVAGE_TITLES.length)];
    }
    return null;
  }, [progress >= 90]); // Only recalculate when crossing the 90 threshold

  // Animate progress smoothly
  useEffect(() => {
    if (!isAnimating) {
      setAnimatedProgress(progress);
      return;
    }

    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;
    const increment = progress / steps;
    let current = 0;

    const interval = setInterval(() => {
      current += increment;
      if (current >= progress) {
        setAnimatedProgress(progress);
        clearInterval(interval);
      } else {
        setAnimatedProgress(current);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [progress, isAnimating]);

  // Calculate gauge angle (from -135 to 135 degrees)
  const angle = -135 + (animatedProgress / 100) * 270;

  return (
    <div className="relative w-64 h-40">
      {/* SVG Gauge */}
      <svg viewBox="0 0 200 120" className="w-full h-full">
        {/* Background Arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#2D3436"
          strokeWidth="12"
          strokeLinecap="round"
          opacity="0.2"
        />

        {/* Gradient Definition */}
        <defs>
          <linearGradient id="burnGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00B894" />
            <stop offset="33%" stopColor="#FDCB6E" />
            <stop offset="66%" stopColor="#FF4D00" />
            <stop offset="100%" stopColor="#D63031" />
          </linearGradient>
        </defs>

        {/* Progress Arc */}
        <motion.path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="url(#burnGradient)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray="251.2"
          initial={{ strokeDashoffset: 251.2 }}
          animate={{ strokeDashoffset: 251.2 - (animatedProgress / 100) * 251.2 }}
          transition={{ duration: 0.1 }}
          className={animatedProgress > 75 ? 'burn-glow' : ''}
        />

        {/* Scale Marks */}
        {[0, 25, 50, 75, 100].map((mark) => {
          const markAngle = (-135 + (mark / 100) * 270) * (Math.PI / 180);
          const innerRadius = 65;
          const outerRadius = 75;
          const x1 = 100 + innerRadius * Math.cos(markAngle);
          const y1 = 100 + innerRadius * Math.sin(markAngle);
          const x2 = 100 + outerRadius * Math.cos(markAngle);
          const y2 = 100 + outerRadius * Math.sin(markAngle);

          return (
            <line
              key={mark}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#2D3436"
              strokeWidth="2"
              opacity="0.5"
            />
          );
        })}

        {/* Needle */}
        <motion.g
          initial={{ rotate: -135, originX: 100, originY: 100 }}
          animate={{ rotate: angle }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        >
          <polygon
            points="100,40 95,100 105,100"
            fill="#1A1A1A"
          />
          <circle cx="100" cy="100" r="8" fill="#FF4D00" stroke="#1A1A1A" strokeWidth="3" />
        </motion.g>
      </svg>

      {/* Level Label */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center"
        key={savageTitle || currentLevel.label}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-2xl">{currentLevel.emoji}</span>
          <span className="font-headline font-bold text-lg text-charcoal">
            {Math.round(animatedProgress)}%
          </span>
        </div>
        <p className="font-body font-medium text-sm text-charcoal">
          {savageTitle || currentLevel.label}
        </p>
      </motion.div>
    </div>
  );
}
