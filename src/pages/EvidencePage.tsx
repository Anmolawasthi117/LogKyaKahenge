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
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate('/persona')}
          className="mb-8 flex items-center gap-2 px-4 py-2 bg-bg-glass border border-border rounded-lg hover:border-border-hover transition-all font-display font-semibold text-sm text-text-secondary hover:text-text-primary"
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
            <div className="px-4 py-2 bg-accent-cyan rounded-full font-display font-semibold text-sm uppercase tracking-widest text-white">
              Step 2 of 3
            </div>
          </div>
          <h1 className="font-display font-black text-4xl md:text-5xl text-text-primary mb-4">
            The Evidence <span className="text-accent-pink">Locker</span> 📁
          </h1>
          <p className="font-body text-lg text-text-secondary max-w-xl mx-auto">
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
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-bg-glass backdrop-blur-md border border-border rounded-xl">
              <img src={persona.avatar} alt={persona.name} className="w-8 h-8 rounded-lg object-cover" />
              <div>
                <div className="font-display font-bold text-sm text-text-primary">Your Roaster</div>
                <div className="text-xs text-text-muted">{persona.name}</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Platform Form */}
        <motion.div
          className="bg-bg-glass backdrop-blur-md border border-border rounded-2xl p-6 mb-8"
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
          <label 
            className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all border ${
              roastAll 
                ? 'bg-accent-orange/10 border-accent-orange/30' 
                : 'bg-bg-glass border-border hover:border-border-hover'
            }`}
          >
            <motion.div
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                roastAll 
                  ? 'bg-gradient-to-br from-accent-orange to-accent-pink' 
                  : 'bg-bg-card border border-border'
              }`}
              whileTap={{ scale: 0.9 }}
            >
              {roastAll && <Zap className="w-5 h-5 text-white" />}
            </motion.div>
            <div>
              <div className="font-display font-bold text-lg text-text-primary">
                🔥 Roast my entire existence
              </div>
              <div className="text-sm text-text-secondary font-body">
                Enable cross-platform roasting for maximum damage.
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
          <div className="inline-flex items-center gap-3 px-5 py-3 bg-bg-glass border border-border rounded-xl">
            <span className="font-display font-bold text-2xl text-accent-pink">
              {verifiedPlatforms.length}
            </span>
            <span className="font-body text-sm text-text-secondary">
              platform{verifiedPlatforms.length !== 1 ? 's' : ''} verified
            </span>
          </div>
        </motion.div>

        {/* Continue Button */}
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            onClick={() => navigate('/loading')}
            disabled={!canProceed}
            className={`
              group flex items-center gap-3 px-10 py-5 rounded-xl font-display font-bold text-lg transition-all
              ${canProceed 
                ? 'bg-accent-pink text-white cursor-pointer' 
                : 'bg-bg-glass text-text-muted cursor-not-allowed border border-border'
              }
            `}
            style={{
              boxShadow: canProceed ? '0 0 40px rgba(255, 51, 102, 0.3)' : 'none',
            }}
            whileHover={canProceed ? { scale: 1.02, boxShadow: '0 0 60px rgba(255, 51, 102, 0.4)' } : {}}
            whileTap={canProceed ? { scale: 0.98 } : {}}
          >
            🔥 Begin Humiliation
            <ArrowRight className={`w-5 h-5 transition-transform ${canProceed ? 'group-hover:translate-x-2' : ''}`} />
          </motion.button>

          {!canProceed && (
            <motion.p
              className="text-sm text-text-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              👆 Verify at least one platform to continue
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
