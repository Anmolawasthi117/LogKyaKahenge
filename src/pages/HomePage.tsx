import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Flame, Zap, ArrowRight } from 'lucide-react';
import { PersonaCard } from '../components/PersonaCard';
import { PlatformForm } from '../components/PlatformForm';
import { useAppStore } from '../store/useAppStore';
import { PERSONAS } from '../lib/constants';

export function HomePage() {
  const navigate = useNavigate();
  const { selectedPersona, verifiedPlatforms } = useAppStore();

  const canProceed = selectedPersona && verifiedPlatforms.length >= 1;

  const handleStartRoast = () => {
    if (canProceed) {
      navigate('/roast');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <motion.section 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="inline-block mb-4"
          animate={{ rotate: [0, -5, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <span className="inline-block px-4 py-2 bg-mustard border-3 border-ink-black font-headline font-bold text-sm uppercase tracking-widest shadow-[3px_3px_0px_#1A1A1A]">
            🇮🇳 Proudly Desi 🌶️
          </span>
        </motion.div>

        <h1 className="font-headline font-extrabold text-5xl md:text-7xl text-charcoal mb-4">
          Get <span className="text-saffron">Brutally</span> Roasted
        </h1>
        
        <p className="font-body text-xl text-charcoal/70 max-w-2xl mx-auto mb-8">
          Hand over your digital footprint. Let our Desi personas expose your life choices 
          with the warmth of a disappointed Indian parent.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 px-4 py-2 bg-old-paper-dark border-2 border-ink-black">
            <Zap className="w-5 h-5 text-saffron" />
            <span className="font-body font-medium">AI-Powered Roasts</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-old-paper-dark border-2 border-ink-black">
            <Flame className="w-5 h-5 text-flame-red" />
            <span className="font-body font-medium">6 Platform Support</span>
          </div>
        </div>
      </motion.section>

      {/* Step 1: Choose Persona */}
      <section className="mb-16">
        <motion.div 
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-12 h-12 bg-saffron border-3 border-ink-black flex items-center justify-center font-headline font-extrabold text-xl shadow-[3px_3px_0px_#1A1A1A]">
            1
          </div>
          <div>
            <h2 className="font-headline font-bold text-2xl text-charcoal">
              Choose Your Roaster
            </h2>
            <p className="text-sm text-charcoal/60 font-body">
              Pick the persona that will destroy your self-esteem
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PERSONAS.map((persona, index) => (
            <PersonaCard key={persona.id} persona={persona} index={index} />
          ))}
        </div>
      </section>

      {/* Step 2: Add Platforms */}
      <section className="mb-16">
        <motion.div 
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="w-12 h-12 bg-peacock-blue border-3 border-ink-black flex items-center justify-center font-headline font-extrabold text-xl text-white shadow-[3px_3px_0px_#1A1A1A]">
            2
          </div>
          <div>
            <h2 className="font-headline font-bold text-2xl text-charcoal">
              Submit Your Evidence
            </h2>
            <p className="text-sm text-charcoal/60 font-body">
              The more platforms, the more ammunition we have
            </p>
          </div>
        </motion.div>

        <motion.div
          className="card-brutal max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <PlatformForm />
        </motion.div>
      </section>

      {/* Start Roast Button */}
      <motion.section 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <motion.button
          onClick={handleStartRoast}
          disabled={!canProceed}
          className={`
            group relative px-12 py-5 font-headline font-bold text-xl uppercase tracking-wider
            border-4 border-ink-black transition-all duration-200
            ${canProceed 
              ? 'bg-saffron text-ink-black shadow-[8px_8px_0px_#1A1A1A] hover:shadow-[4px_4px_0px_#1A1A1A] hover:translate-x-1 hover:translate-y-1 cursor-pointer' 
              : 'bg-charcoal/20 text-charcoal/50 cursor-not-allowed'
            }
          `}
          whileHover={canProceed ? { scale: 1.02 } : {}}
          whileTap={canProceed ? { scale: 0.98 } : {}}
        >
          <span className="flex items-center gap-3">
            🔥 Start Roasting Me
            <ArrowRight className={`w-6 h-6 transition-transform ${canProceed ? 'group-hover:translate-x-2' : ''}`} />
          </span>
        </motion.button>

        {!canProceed && (
          <motion.p 
            className="mt-4 text-sm text-charcoal/60 font-body"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {!selectedPersona 
              ? '👆 Select a persona to continue' 
              : '👆 Verify at least one platform to continue'
            }
          </motion.p>
        )}
      </motion.section>
    </div>
  );
}
