import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, RefreshCw, ThumbsUp, Heart, AlertTriangle } from 'lucide-react';
import { RoastBox } from '../components/RoastBox';
import { BurnMeter } from '../components/BurnMeter';
import { ShareCard } from '../components/ShareCard';
import { useAppStore } from '../store/useAppStore';
import { PERSONAS } from '../lib/constants';

export function ResultPage() {
  const navigate = useNavigate();
  const { selectedPersona, currentRoast, verifiedPlatforms, resetAll } = useAppStore();
  const [showShareCard, setShowShareCard] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const persona = PERSONAS.find(p => p.id === selectedPersona);

  // Memoize the cringe score so it doesn't change on feedback button click
  const cringeScore = useMemo(() => Math.floor(Math.random() * 30) + 70, [currentRoast?.id]);

  // Redirect if no roast
  if (!currentRoast || !persona) {
    navigate('/');
    return null;
  }

  const handleRoastAgain = () => {
    resetAll();
    navigate('/');
  };

  const handleFeedback = (type: string) => {
    setFeedback(type);
    // Could send analytics here
  };

  return (
    <div className="min-h-screen bg-old-paper py-8 px-4 pb-24">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 border-2 border-ink-black bg-old-paper shadow-[3px_3px_0px_#1A1A1A] hover:shadow-[1px_1px_0px_#1A1A1A] hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-headline font-bold text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Home
          </button>

          <div className="flex items-center gap-3">
            <span className="text-4xl">{persona.icon}</span>
            <div className="text-right">
              <h1 className="font-headline font-bold text-xl text-charcoal">
                {persona.name}
              </h1>
              <p className="text-xs text-charcoal/60">{persona.vibe}</p>
            </div>
          </div>
        </motion.div>

        {/* Result Badge */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="px-6 py-3 bg-flame-red text-white border-4 border-ink-black font-headline font-bold text-lg uppercase tracking-widest shadow-[4px_4px_0px_#1A1A1A]">
            🔥 You've Been Humbled 🔥
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Roast Box */}
          <div className="lg:col-span-2">
            <RoastBox
              text={currentRoast.roastText}
              isStreaming={false}
              personaIcon={persona.icon}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Burn Meter */}
            <motion.div
              className="card-brutal flex flex-col items-center p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="font-headline font-bold text-lg text-charcoal mb-4">
                🔥 Burn Level
              </h3>
              <BurnMeter progress={currentRoast.burnLevel} isAnimating={true} />
            </motion.div>

            {/* Cringe Score */}
            <motion.div
              className="card-brutal p-6 text-center"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="font-headline font-bold text-sm text-charcoal/60 uppercase tracking-wider mb-2">
                Cringe Score
              </h3>
              <div className="font-headline font-extrabold text-5xl text-flame-red mb-2">
                {cringeScore}/100
              </div>
              <p className="text-xs text-charcoal/60 font-body">
                Based on {verifiedPlatforms.length} platform{verifiedPlatforms.length !== 1 ? 's' : ''} analyzed
              </p>
            </motion.div>

            {/* Platforms Used */}
            <motion.div
              className="card-brutal p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="font-headline font-bold text-sm text-charcoal/60 mb-3 uppercase tracking-wider">
                Evidence Used Against You
              </h3>
              <div className="flex flex-wrap gap-2">
                {verifiedPlatforms.map((platform) => (
                  <span
                    key={platform}
                    className="px-3 py-1 bg-ink-black text-old-paper text-xs font-headline font-bold uppercase"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Feedback Section */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="font-headline font-bold text-xl text-charcoal text-center mb-6">
            How did we do? 🤔
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { id: 'true', icon: <ThumbsUp className="w-5 h-5" />, text: 'This is true 😭', color: 'bg-parrot-green' },
              { id: 'personal', icon: <AlertTriangle className="w-5 h-5" />, text: 'Too personal 😬', color: 'bg-mustard' },
              { id: 'love', icon: <Heart className="w-5 h-5" />, text: 'I loved it 🔥', color: 'bg-lotus-pink' },
            ].map((option) => (
              <motion.button
                key={option.id}
                onClick={() => handleFeedback(option.id)}
                className={`
                  flex items-center gap-2 px-6 py-3 border-3 border-ink-black font-headline font-bold
                  shadow-[4px_4px_0px_#1A1A1A] hover:shadow-[2px_2px_0px_#1A1A1A] hover:translate-x-[2px] hover:translate-y-[2px] transition-all
                  ${feedback === option.id ? option.color + ' text-ink-black' : 'bg-old-paper text-charcoal'}
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {option.icon}
                {option.text}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="mt-12 flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <motion.button
            onClick={() => setShowShareCard(true)}
            className="flex items-center gap-2 px-8 py-4 bg-saffron border-4 border-ink-black font-headline font-bold text-lg uppercase shadow-[6px_6px_0px_#1A1A1A] hover:shadow-[3px_3px_0px_#1A1A1A] hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Share2 className="w-5 h-5" />
            Share Roast
          </motion.button>

          <motion.button
            onClick={handleRoastAgain}
            className="flex items-center gap-2 px-8 py-4 bg-old-paper border-4 border-ink-black font-headline font-bold text-lg uppercase shadow-[6px_6px_0px_#1A1A1A] hover:shadow-[3px_3px_0px_#1A1A1A] hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RefreshCw className="w-5 h-5" />
            Roast Again
          </motion.button>
        </motion.div>
      </div>

      {/* Share Card Modal */}
      <AnimatePresence>
        {showShareCard && (
          <ShareCard
            roast={currentRoast}
            persona={persona}
            onClose={() => setShowShareCard(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
