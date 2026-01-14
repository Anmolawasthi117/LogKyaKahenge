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
      {/* Decorative Tape */}
      <div className="absolute -top-4 left-8 z-10">
        <div className="tape font-headline font-bold text-xs text-charcoal/80">
          OFFICIAL ROAST
        </div>
      </div>
      <div className="absolute -top-4 right-8 z-10">
        <div className="tape font-headline font-bold text-xs text-charcoal/80 transform rotate-2">
          CONFIDENTIAL
        </div>
      </div>

      {/* Main Paper Container */}
      <div className="crumpled-paper torn-edge border-4 border-ink-black shadow-[8px_8px_0px_#1A1A1A] bg-old-paper">
        {/* Header Bar */}
        <div className="bg-ink-black text-old-paper px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{personaIcon}</span>
            <span className="font-headline font-bold text-sm uppercase tracking-wider">
              Roast Certificate
            </span>
          </div>
          <div className="text-xs font-body opacity-70">
            {new Date().toLocaleDateString('en-IN')}
          </div>
        </div>

        {/* Content Area */}
        <div
          ref={containerRef}
          className="p-8 min-h-[300px] max-h-[500px] overflow-y-auto newspaper-text"
        >
          <AnimatePresence mode="popLayout">
            <motion.p className="font-body text-lg leading-relaxed text-charcoal">
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
                  className="inline-block w-3 h-6 bg-saffron ml-1 align-middle cursor-blink"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-ink-black/20 px-6 py-4 bg-old-paper-dark flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="stamp text-xs px-3 py-1">
              VERIFIED BURN
            </div>
          </div>
          
          <div className="text-right">
            <div className="font-headline font-bold text-sm text-charcoal">
              LogKyaKahenge.com
            </div>
            <div className="text-xs text-charcoal/60 font-body">
              Professional Humiliation Services
            </div>
          </div>
        </div>
      </div>

      {/* Coffee Stain Decoration */}
      <div className="absolute -bottom-6 -left-6 w-16 h-16 rounded-full bg-[#8B4513] opacity-10 blur-sm" />
      <div className="absolute -top-8 -right-4 w-12 h-12 rounded-full bg-[#8B4513] opacity-5 blur-sm" />
    </motion.div>
  );
}
