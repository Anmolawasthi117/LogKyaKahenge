import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { PersonaCard } from '../components/PersonaCard';
import { useAppStore } from '../store/useAppStore';
import { PERSONAS } from '../lib/constants';

export function PersonaPage() {
  const navigate = useNavigate();
  const { selectedPersona } = useAppStore();

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate('/')}
          className="mb-8 flex items-center gap-2 px-4 py-2 bg-bg-glass border border-border rounded-lg hover:border-border-hover transition-all font-display font-semibold text-sm text-text-secondary hover:text-text-primary"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </motion.button>

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="inline-block mb-4">
            <div className="px-4 py-2 bg-accent-pink rounded-full font-display font-semibold text-sm uppercase tracking-widest text-white">
              Step 1 of 3
            </div>
          </div>
          <h1 className="font-display font-black text-4xl md:text-5xl text-text-primary mb-4">
            Choose Your <span className="text-accent-pink">Roaster</span>
          </h1>
          <p className="font-body text-lg text-text-secondary max-w-xl mx-auto">
            Each persona has a unique style of destroying your self-esteem. Choose wisely.
          </p>
        </motion.div>

        {/* Persona Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          {PERSONAS.map((persona, index) => (
            <PersonaCard key={persona.id} persona={persona} index={index} />
          ))}
        </div>

        {/* Continue Button */}
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={() => navigate('/evidence')}
            disabled={!selectedPersona}
            className={`
              group flex items-center gap-3 px-10 py-5 rounded-xl font-display font-bold text-lg transition-all
              ${selectedPersona 
                ? 'bg-accent-pink text-white cursor-pointer' 
                : 'bg-bg-glass text-text-muted cursor-not-allowed border border-border'
              }
            `}
            style={{
              boxShadow: selectedPersona ? '0 0 40px rgba(255, 51, 102, 0.3)' : 'none',
            }}
            whileHover={selectedPersona ? { scale: 1.02, boxShadow: '0 0 60px rgba(255, 51, 102, 0.4)' } : {}}
            whileTap={selectedPersona ? { scale: 0.98 } : {}}
          >
            Continue
            <ArrowRight className={`w-5 h-5 transition-transform ${selectedPersona ? 'group-hover:translate-x-2' : ''}`} />
          </motion.button>

          {!selectedPersona && (
            <motion.p
              className="text-sm text-text-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              👆 Select a persona to continue
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
