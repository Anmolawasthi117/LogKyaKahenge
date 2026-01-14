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
    <div className="min-h-screen bg-old-paper py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate('/')}
          className="mb-8 flex items-center gap-2 px-4 py-2 border-2 border-ink-black bg-old-paper shadow-[3px_3px_0px_#1A1A1A] hover:shadow-[1px_1px_0px_#1A1A1A] hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-headline font-bold text-sm"
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
            <div className="px-4 py-2 bg-saffron border-3 border-ink-black font-headline font-bold text-sm uppercase tracking-widest shadow-[3px_3px_0px_#1A1A1A]">
              Step 1 of 3
            </div>
          </div>
          <h1 className="font-headline font-extrabold text-4xl md:text-5xl text-charcoal mb-4">
            Choose Your <span className="text-saffron">Roaster</span>
          </h1>
          <p className="font-body text-lg text-charcoal/70 max-w-xl mx-auto">
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
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={() => navigate('/evidence')}
            disabled={!selectedPersona}
            className={`
              group flex items-center gap-3 px-10 py-5 border-4 border-ink-black font-headline font-bold text-xl uppercase tracking-wider transition-all
              ${selectedPersona 
                ? 'bg-saffron shadow-[6px_6px_0px_#1A1A1A] hover:shadow-[3px_3px_0px_#1A1A1A] hover:translate-x-[3px] hover:translate-y-[3px] cursor-pointer' 
                : 'bg-charcoal/20 text-charcoal/50 cursor-not-allowed shadow-none'
              }
            `}
            whileHover={selectedPersona ? { scale: 1.02 } : {}}
            whileTap={selectedPersona ? { scale: 0.98 } : {}}
          >
            Continue
            <ArrowRight className={`w-5 h-5 transition-transform ${selectedPersona ? 'group-hover:translate-x-2' : ''}`} />
          </motion.button>
        </motion.div>

        {!selectedPersona && (
          <motion.p
            className="text-center mt-4 text-sm text-charcoal/60 font-body"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            👆 Select a persona to continue
          </motion.p>
        )}
      </div>
    </div>
  );
}
