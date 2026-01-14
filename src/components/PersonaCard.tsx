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

  // Different accent colors for each persona
  const accentColors = {
    'khadoos-baap': 'bg-orange-500',
    'desi-aunty': 'bg-pink-500',
    'gen-z-kid': 'bg-green-500',
    'therapist': 'bg-blue-500',
  };

  const glowColors = {
    'khadoos-baap': 'rgba(249, 115, 22, 0.4)',
    'desi-aunty': 'rgba(236, 72, 153, 0.4)',
    'gen-z-kid': 'rgba(34, 197, 94, 0.4)',
    'therapist': 'rgba(59, 130, 246, 0.4)',
  };

  return (
    <motion.button
      onClick={() => setSelectedPersona(isSelected ? null : persona.id)}
      className={`
        relative w-full text-left p-6 rounded-2xl cursor-pointer group
        transition-all duration-300 overflow-hidden
        ${isSelected 
          ? 'bg-bg-card-hover border-2' 
          : 'bg-bg-glass border border-border hover:border-border-hover'
        }
      `}
      style={{
        borderColor: isSelected ? glowColors[persona.id] : undefined,
        boxShadow: isSelected ? `0 0 40px ${glowColors[persona.id]}` : undefined,
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1]
      }}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Gradient overlay on hover/selected */}
      <motion.div
        className={`absolute inset-0 ${accentColors[persona.id]} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}
        animate={{ opacity: isSelected ? 0.1 : 0 }}
      />

      {/* Selection Indicator */}
      {isSelected && (
        <motion.div
          className={`absolute top-4 right-4 w-8 h-8 ${accentColors[persona.id]} rounded-full flex items-center justify-center text-white font-bold text-sm`}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
        >
          ✓
        </motion.div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {/* Icon & Title */}
        <div className="flex items-start gap-4 mb-4">
          <motion.div 
            className={`w-14 h-14 rounded-xl ${accentColors[persona.id]} flex items-center justify-center text-3xl`}
            animate={isSelected ? { 
              scale: [1, 1.1, 1],
            } : {}}
            transition={{ duration: 0.3 }}
          >
            {persona.icon}
          </motion.div>
          
          <div className="flex-1 min-w-0">
            <h3 className={`font-display font-bold text-lg ${isSelected ? 'text-text-primary' : 'text-text-primary'}`}>
              {persona.name}
            </h3>
            <p className="text-sm text-text-muted">
              {persona.nameHindi}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-text-secondary leading-relaxed mb-4">
          {persona.description}
        </p>

        {/* Vibe Tags */}
        <div className="flex flex-wrap gap-2">
          {persona.vibe.split(', ').map((tag, i) => (
            <span
              key={i}
              className={`
                inline-block px-2.5 py-1 text-xs font-medium uppercase tracking-wider rounded-full
                ${isSelected 
                  ? 'bg-text-primary/10 text-text-primary' 
                  : 'bg-bg-glass text-text-muted border border-border'
                }
              `}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.button>
  );
}
