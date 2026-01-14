import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

interface RoastBubblesProps {
  text: string;
  personaAvatar?: string;
  personaName?: string;
  isStreaming?: boolean;
}

export function RoastBubbles({ 
  text, 
  personaAvatar, 
  personaName = 'Roaster',
  isStreaming = false 
}: RoastBubblesProps) {
  const [visibleBubbles, setVisibleBubbles] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Split text into paragraphs - handle both \n\n and single \n with long gaps
  const paragraphs = text
    .split(/\n{1,2}/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  // Animate bubbles appearing one by one
  useEffect(() => {
    if (paragraphs.length === 0) return;

    if (!isStreaming) {
      // If not streaming, show all bubbles with staggered animation
      let count = 0;
      const interval = setInterval(() => {
        count++;
        setVisibleBubbles(count);
        
        // Auto-scroll to bottom
        if (containerRef.current) {
          containerRef.current.scrollTo({
            top: containerRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
        
        if (count >= paragraphs.length) {
          clearInterval(interval);
        }
      }, 400); // 400ms delay between each bubble

      return () => clearInterval(interval);
    } else {
      // If streaming, show bubbles as paragraphs complete
      setVisibleBubbles(paragraphs.length);
    }
  }, [paragraphs.length, isStreaming]);

  // Auto-scroll when new bubbles appear
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [visibleBubbles]);

  return (
    <motion.div
      className="relative w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Chat Container - No max height to show full content */}
      <div 
        ref={containerRef}
        className="space-y-4 overflow-y-auto pr-2 pb-4"
        style={{ scrollbarWidth: 'thin' }}
      >
        <AnimatePresence mode="popLayout">
          {paragraphs.slice(0, visibleBubbles).map((paragraph, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-3"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ 
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
                delay: isStreaming ? 0 : 0.1
              }}
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                {index === 0 || index % 3 === 0 ? (
                  personaAvatar ? (
                    <motion.img 
                      src={personaAvatar} 
                      alt={personaName}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-accent-pink/30"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    />
                  ) : (
                    <motion.div 
                      className="w-10 h-10 rounded-full bg-accent-pink/20 flex items-center justify-center text-xl"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    >
                      🔥
                    </motion.div>
                  )
                ) : (
                  <div className="w-10" /> // Spacer for alignment
                )}
              </div>

              {/* Bubble */}
              <motion.div
                className="relative flex-1 max-w-[85%]"
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {/* Bubble Content */}
                <div 
                  className="relative px-5 py-4 rounded-2xl rounded-tl-sm bg-gradient-to-br from-bg-glass to-bg-card border border-border backdrop-blur-sm"
                  style={{
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                  }}
                >
                  {/* Glow effect for first bubble */}
                  {index === 0 && (
                    <div className="absolute inset-0 rounded-2xl rounded-tl-sm bg-accent-pink/5 pointer-events-none" />
                  )}
                  
                  <p className="font-body text-base leading-relaxed text-text-secondary relative z-10">
                    {paragraph}
                  </p>
                </div>

                {/* Bubble tail */}
                {(index === 0 || index % 3 === 0) && (
                  <div 
                    className="absolute -left-2 top-3 w-4 h-4 bg-gradient-to-br from-bg-glass to-bg-card border-l border-t border-border rotate-[-45deg]"
                    style={{ borderRadius: '2px' }}
                  />
                )}
              </motion.div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          {visibleBubbles < paragraphs.length && (
            <motion.div
              className="flex items-start gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="w-10" />
              <div className="px-5 py-4 rounded-2xl bg-bg-glass border border-border">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2.5 h-2.5 rounded-full bg-accent-pink"
                      animate={{
                        y: [0, -6, 0],
                        opacity: [0.4, 1, 0.4],
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.15,
                      }}
                      style={{
                        boxShadow: '0 0 8px rgba(255, 51, 102, 0.5)',
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom fade gradient for scroll indication */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-bg-dark to-transparent pointer-events-none" />
    </motion.div>
  );
}
