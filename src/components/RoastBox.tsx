import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

interface RoastBoxProps {
  text: string;
  isStreaming?: boolean;
  personaIcon?: string;
}

export function RoastBox({ text, isStreaming = false, personaIcon = '🔥' }: RoastBoxProps) {
  const [displayedText, setDisplayedText] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Typewriter effect for streaming
  useEffect(() => {
    if (!isStreaming) {
      setDisplayedText(text);
      return;
    }

    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
        
        // Auto-scroll to bottom
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      } else {
        clearInterval(interval);
      }
    }, 20); // 20ms per character

    return () => clearInterval(interval);
  }, [text, isStreaming]);

  // Split text into words for animation
  const words = displayedText.split(' ');

  return (
    <motion.div
      className="relative w-full max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Main Container */}
      <div className="bg-bg-glass backdrop-blur-xl border border-border rounded-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-accent-pink/20 to-accent-purple/20 border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{personaIcon}</span>
            <span className="font-display font-bold text-sm uppercase tracking-wider text-text-primary">
              Roast Certificate
            </span>
          </div>
          <div className="text-xs text-text-muted font-body">
            {new Date().toLocaleDateString('en-IN')}
          </div>
        </div>

        {/* Content Area */}
        <div
          ref={containerRef}
          className="p-6 md:p-8 min-h-[300px] max-h-[500px] overflow-y-auto"
        >
          <AnimatePresence mode="popLayout">
            <motion.p className="font-body text-lg leading-relaxed text-text-secondary">
              {words.map((word, index) => (
                <motion.span
                  key={`${index}-${word}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.1,
                    delay: isStreaming ? 0 : index * 0.02,
                  }}
                  className="inline-block mr-1"
                >
                  {word}
                </motion.span>
              ))}
              
              {/* Blinking Cursor */}
              {isStreaming && displayedText.length < text.length && (
                <motion.span
                  className="inline-block w-2 h-5 bg-accent-pink ml-1 align-middle rounded-sm cursor-blink"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ boxShadow: '0 0 10px rgba(255, 51, 102, 0.5)' }}
                />
              )}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-6 py-4 flex items-center justify-between bg-bg-card">
          <div className="flex items-center gap-2">
            <div 
              className="px-3 py-1 text-xs font-display font-semibold uppercase rounded-full bg-gradient-to-r from-accent-pink/20 to-accent-purple/20 text-accent-pink border border-accent-pink/30"
            >
              Verified Burn
            </div>
          </div>
          
          <div className="text-right">
            <div className="font-display font-bold text-sm text-text-primary">
              LogKyaKahenge.com
            </div>
            <div className="text-xs text-text-muted font-body">
              Professional Humiliation Services
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
