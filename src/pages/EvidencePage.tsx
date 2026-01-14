import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Zap } from 'lucide-react';
import { PlatformForm } from '../components/PlatformForm';
import { useAppStore } from '../store/useAppStore';
import { PERSONAS } from '../lib/constants';

export function EvidencePage() {
  const navigate = useNavigate();
  const { selectedPersona, verifiedPlatforms } = useAppStore();
  const [roastAll, setRoastAll] = useState(false);

  const persona = PERSONAS.find(p => p.id === selectedPersona);

  // Redirect if no persona selected
  if (!selectedPersona) {
    navigate('/persona');
    return null;
  }

  const canProceed = verifiedPlatforms.length >= 1;

  return (
    <div className="min-h-screen bg-old-paper py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate('/persona')}
          className="mb-8 flex items-center gap-2 px-4 py-2 border-2 border-ink-black bg-old-paper shadow-[3px_3px_0px_#1A1A1A] hover:shadow-[1px_1px_0px_#1A1A1A] hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-headline font-bold text-sm"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </motion.button>

        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="inline-block mb-4">
            <div className="px-4 py-2 bg-peacock-blue text-white border-3 border-ink-black font-headline font-bold text-sm uppercase tracking-widest shadow-[3px_3px_0px_#1A1A1A]">
              Step 2 of 3
            </div>
          </div>
          <h1 className="font-headline font-extrabold text-4xl md:text-5xl text-charcoal mb-4">
            The Evidence <span className="text-saffron">Locker</span> 📁
          </h1>
          <p className="font-body text-lg text-charcoal/70 max-w-xl mx-auto">
            Submit your digital footprint. The more platforms you add, the more ammunition we have.
          </p>
        </motion.div>

        {/* Selected Persona Badge */}
        {persona && (
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-ink-black text-old-paper border-3 border-ink-black">
              <span className="text-2xl">{persona.icon}</span>
              <div>
                <div className="font-headline font-bold text-sm">Your Roaster</div>
                <div className="text-xs opacity-70">{persona.name}</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Platform Form */}
        <motion.div
          className="card-brutal mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <PlatformForm />
        </motion.div>

        {/* Roast All Checkbox */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <label className="flex items-center gap-4 p-4 border-3 border-ink-black bg-mustard/30 cursor-pointer hover:bg-mustard/50 transition-colors">
            <motion.div
              className={`w-8 h-8 border-3 border-ink-black flex items-center justify-center transition-colors ${roastAll ? 'bg-flame-red' : 'bg-old-paper'}`}
              whileTap={{ scale: 0.9 }}
            >
              {roastAll && <Zap className="w-5 h-5 text-white" />}
            </motion.div>
            <div>
              <div className="font-headline font-bold text-lg text-charcoal">
                🔥 Roast my entire existence
              </div>
              <div className="text-sm text-charcoal/70 font-body">
                Enable cross-platform roasting for maximum damage. We'll find contradictions across all your profiles.
              </div>
            </div>
            <input
              type="checkbox"
              checked={roastAll}
              onChange={(e) => setRoastAll(e.target.checked)}
              className="sr-only"
            />
          </label>
        </motion.div>

        {/* Verified Count */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-old-paper-dark border-2 border-ink-black">
            <span className="font-headline font-bold text-2xl text-saffron">
              {verifiedPlatforms.length}
            </span>
            <span className="font-body text-sm text-charcoal/70">
              platform{verifiedPlatforms.length !== 1 ? 's' : ''} verified
            </span>
          </div>
        </motion.div>

        {/* Continue Button */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            onClick={() => navigate('/loading')}
            disabled={!canProceed}
            className={`
              group flex items-center gap-3 px-10 py-5 border-4 border-ink-black font-headline font-bold text-xl uppercase tracking-wider transition-all
              ${canProceed 
                ? 'bg-flame-red text-white shadow-[6px_6px_0px_#1A1A1A] hover:shadow-[3px_3px_0px_#1A1A1A] hover:translate-x-[3px] hover:translate-y-[3px] cursor-pointer' 
                : 'bg-charcoal/20 text-charcoal/50 cursor-not-allowed shadow-none'
              }
            `}
            whileHover={canProceed ? { scale: 1.02 } : {}}
            whileTap={canProceed ? { scale: 0.98 } : {}}
          >
            🔥 Begin Humiliation
            <ArrowRight className={`w-5 h-5 transition-transform ${canProceed ? 'group-hover:translate-x-2' : ''}`} />
          </motion.button>
        </motion.div>

        {!canProceed && (
          <motion.p
            className="text-center mt-4 text-sm text-charcoal/60 font-body"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            👆 Verify at least one platform to continue
          </motion.p>
        )}
      </div>
    </div>
  );
}
