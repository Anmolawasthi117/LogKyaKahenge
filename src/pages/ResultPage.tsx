import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, RefreshCw, ThumbsUp, Heart, AlertTriangle } from 'lucide-react';
import { RoastBubbles } from '../components/RoastBubbles';
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
    <div className="min-h-screen py-8 px-4 pb-24">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-bg-glass border border-border rounded-lg hover:border-border-hover transition-all font-display font-semibold text-sm text-text-secondary hover:text-text-primary"
          >
            <ArrowLeft className="w-4 h-4" />
            Home
          </button>

          <div className="flex items-center gap-3">
            <img src={persona.avatar} alt={persona.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-accent-pink/30" />
            <div className="text-right">
              <h1 className="font-display font-bold text-xl text-text-primary">
                {persona.name}
              </h1>
              <p className="text-xs text-text-muted">{persona.nameHindi}</p>
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
          <div 
            className="px-6 py-3 bg-accent-pink rounded-xl font-display font-bold text-lg uppercase tracking-widest text-white"
            style={{ boxShadow: '0 0 40px rgba(255, 51, 102, 0.3)' }}
          >
            🔥 You've Been Humbled 🔥
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Roast Bubbles */}
          <div className="lg:col-span-2">
            <motion.div
              className="bg-bg-glass/50 backdrop-blur-xl border border-border rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <RoastBubbles
                text={currentRoast.roastText}
                personaAvatar={persona.avatar}
                personaName={persona.name}
                isStreaming={false}
              />
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Burn Meter */}
            <motion.div
              className="bg-bg-glass backdrop-blur-md border border-border rounded-2xl flex flex-col items-center p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="font-display font-bold text-lg text-text-primary mb-4">
                🔥 Burn Level
              </h3>
              <BurnMeter progress={currentRoast.burnLevel} isAnimating={true} />
            </motion.div>

            {/* Cringe Score */}
            <motion.div
              className="bg-bg-glass backdrop-blur-md border border-border rounded-2xl p-6 text-center"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="font-display font-bold text-sm text-text-muted uppercase tracking-wider mb-2">
                Cringe Score
              </h3>
              <div 
                className="font-display font-extrabold text-5xl text-accent-pink mb-2"
              >
                {cringeScore}/100
              </div>
              <p className="text-xs text-text-muted font-body">
                Based on {verifiedPlatforms.length} platform{verifiedPlatforms.length !== 1 ? 's' : ''} analyzed
              </p>
            </motion.div>

            {/* Platforms Used */}
            <motion.div
              className="bg-bg-glass backdrop-blur-md border border-border rounded-2xl p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="font-display font-bold text-sm text-text-muted mb-3 uppercase tracking-wider">
                Evidence Used Against You
              </h3>
              <div className="flex flex-wrap gap-2">
                {verifiedPlatforms.map((platform) => (
                  <span
                    key={platform}
                    className="px-3 py-1 bg-gradient-to-r from-accent-pink/20 to-accent-purple/20 border border-accent-pink/30 text-text-primary text-xs font-display font-semibold uppercase rounded-lg"
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
          <h3 className="font-display font-bold text-xl text-text-primary text-center mb-6">
            How did we do? 🤔
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { id: 'true', icon: <ThumbsUp className="w-5 h-5" />, text: 'This is true 😭', gradient: 'from-green-500 to-emerald-600' },
              { id: 'personal', icon: <AlertTriangle className="w-5 h-5" />, text: 'Too personal 😬', gradient: 'from-yellow-500 to-orange-500' },
              { id: 'love', icon: <Heart className="w-5 h-5" />, text: 'I loved it 🔥', gradient: 'from-pink-500 to-rose-600' },
            ].map((option) => (
              <motion.button
                key={option.id}
                onClick={() => handleFeedback(option.id)}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-xl font-display font-semibold transition-all
                  ${feedback === option.id 
                    ? `bg-gradient-to-r ${option.gradient} text-white` 
                    : 'bg-bg-glass border border-border text-text-secondary hover:border-border-hover'
                  }
                `}
                style={{
                  boxShadow: feedback === option.id ? '0 0 30px rgba(255, 51, 102, 0.3)' : 'none',
                }}
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
            className="flex items-center gap-2 px-8 py-4 bg-accent-pink rounded-xl font-display font-bold text-lg text-white transition-all"
            style={{ boxShadow: '0 0 40px rgba(255, 51, 102, 0.3)' }}
            whileHover={{ scale: 1.02, boxShadow: '0 0 60px rgba(255, 51, 102, 0.4)' }}
            whileTap={{ scale: 0.98 }}
          >
            <Share2 className="w-5 h-5" />
            Share Roast
          </motion.button>

          <motion.button
            onClick={handleRoastAgain}
            className="flex items-center gap-2 px-8 py-4 bg-bg-glass border border-border rounded-xl font-display font-bold text-lg text-text-primary transition-all hover:border-border-hover"
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
