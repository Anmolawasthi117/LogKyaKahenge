import { motion } from 'framer-motion';
import { SAMPLE_ROASTS } from '../lib/constants';

export function HumiliationTicker() {
  // Double the roasts for seamless infinite scroll
  const tickerContent = [...SAMPLE_ROASTS, ...SAMPLE_ROASTS];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 overflow-hidden bg-gradient-to-r from-saffron via-flame-red to-saffron border-t-4 border-ink-black">
      <div className="relative py-3">
        {/* Decorative Label */}
        <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center px-4 bg-ink-black text-old-paper font-headline font-bold text-sm tracking-wider">
          <span className="hidden md:block">🔥 LIVE HUMILIATION</span>
          <span className="md:hidden">🔥</span>
        </div>
        
        {/* Scrolling Content */}
        <motion.div
          className="flex whitespace-nowrap"
          animate={{
            x: ['0%', '-50%'],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: 40,
              ease: 'linear',
            },
          }}
        >
          {tickerContent.map((roast, index) => (
            <span
              key={index}
              className="inline-flex items-center px-8 font-body font-medium text-white text-sm md:text-base"
            >
              <span className="mr-3">💀</span>
              {roast}
              <span className="ml-8 text-2xl opacity-50">•</span>
            </span>
          ))}
        </motion.div>
        
        {/* Fade edges */}
        <div className="absolute left-16 md:left-40 top-0 bottom-0 w-12 bg-gradient-to-r from-saffron to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-saffron to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
