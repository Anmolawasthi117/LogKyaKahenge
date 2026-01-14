import { motion } from 'framer-motion';
import type { PersonaInfo } from '../lib/types';
import { useAppStore } from '../store/useAppStore';

interface PersonaCardProps {
  persona: PersonaInfo;
  index: number;
}

export function PersonaCard({ persona, index }: PersonaCardProps) {
  const { selectedPersona, setSelectedPersona } = useAppStore();
  const isSelected = selectedPersona === persona.id;

  return (
    <motion.button
      onClick={() => setSelectedPersona(isSelected ? null : persona.id)}
      className={`
        relative w-full text-left p-6 border-4 border-ink-black
        transition-all duration-200 cursor-pointer group
        ${isSelected 
          ? 'bg-ink-black text-old-paper shadow-none translate-x-1 translate-y-1' 
          : 'bg-old-paper text-charcoal shadow-[6px_6px_0px_#1A1A1A] hover:shadow-[4px_4px_0px_#1A1A1A] hover:translate-x-[2px] hover:translate-y-[2px]'
        }
      `}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ 
        rotate: isSelected ? 0 : [-0.5, 0.5, -0.5, 0],
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Selection Indicator */}
      {isSelected && (
        <motion.div
          className="absolute -top-3 -right-3 w-8 h-8 bg-saffron border-3 border-ink-black rounded-full flex items-center justify-center text-ink-black font-bold text-sm"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
        >
          ✓
        </motion.div>
      )}

      {/* Decorative Corner */}
      <div 
        className="absolute top-0 right-0 w-12 h-12"
        style={{ 
          background: persona.bgGradient,
          clipPath: 'polygon(100% 0, 0 0, 100% 100%)'
        }}
      />

      {/* Icon & Title */}
      <div className="flex items-start gap-4 mb-4">
        <motion.span 
          className="text-5xl"
          animate={isSelected ? { 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          } : {}}
          transition={{ duration: 0.5 }}
        >
          {persona.icon}
        </motion.span>
        
        <div className="flex-1 min-w-0">
          <h3 className={`
            font-headline font-bold text-xl leading-tight
            ${isSelected ? 'text-saffron' : 'text-charcoal'}
          `}>
            {persona.name}
          </h3>
          <p className={`
            text-xs font-body opacity-70 mt-0.5
            ${isSelected ? 'text-old-paper' : 'text-charcoal'}
          `}>
            {persona.nameHindi}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className={`
        text-sm font-body leading-relaxed mb-4
        ${isSelected ? 'text-old-paper/90' : 'text-charcoal/80'}
      `}>
        {persona.description}
      </p>

      {/* Vibe Tag */}
      <div className="flex flex-wrap gap-2">
        {persona.vibe.split(', ').map((tag, i) => (
          <span
            key={i}
            className={`
              inline-block px-2 py-1 text-xs font-body font-medium uppercase tracking-wider
              border-2 border-current
              ${isSelected ? 'border-old-paper/50 text-old-paper/80' : 'border-charcoal/30 text-charcoal/70'}
            `}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Hover Decoration */}
      <motion.div
        className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        initial={false}
      >
        <span className="text-2xl">{isSelected ? '🔥' : '👆'}</span>
      </motion.div>
    </motion.button>
  );
}
