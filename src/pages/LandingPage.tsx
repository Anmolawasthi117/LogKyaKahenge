import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Skull, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Header } from '../components/Header';

export function LandingPage() {
  const navigate = useNavigate();
  const [humbledCount, setHumbledCount] = useState(42069);
  const [isHovering, setIsHovering] = useState(false);

  // Simulate real-time counter
  useEffect(() => {
    const interval = setInterval(() => {
      setHumbledCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-bg-dark relative overflow-hidden">
      {/* Header */}
      <Header />
      
      {/* Animated Background */}
      <div className="absolute inset-0 animated-gradient" />
      <div className="absolute inset-0 bg-grid opacity-20" />
      
      {/* Red glow at top for intensity */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent-pink/20 blur-[150px] rounded-full" />
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between px-4 py-8 md:py-12">
        {/* Top Section - Warning Badge */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-pink/10 border border-accent-pink/30 rounded-full">
            <Skull className="w-4 h-4 text-accent-pink" />
            <span className="text-sm font-semibold text-accent-pink uppercase tracking-wider">No Mercy Mode</span>
          </div>
        </motion.div>

        {/* Center Section - Hero */}
        <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto text-center py-8 md:py-16">
          {/* Main Headline - THE HOOK */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight mb-6">
              <span className="text-text-primary">We will</span>
              <br />
              <span className="text-accent-pink">destroy</span>
              <span className="text-text-primary"> your</span>
              <br />
              <span className="text-text-primary">ego.</span>
            </h1>
          </motion.div>

          {/* Subheadline - More aggressive */}
          <motion.p
            className="text-lg md:text-xl text-text-secondary max-w-xl mx-auto mb-4 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Give us your GitHub, LeetCode, or Chess.com. 
            Our AI personas will tear apart everything you thought was impressive.
          </motion.p>

          {/* Warning text */}
          <motion.p
            className="text-sm text-accent-pink/80 mb-10 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            ⚠️ This will hurt. Proceed anyway?
          </motion.p>

          {/* CTA Button - THE MAGNET */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <motion.button
              onClick={() => navigate('/persona')}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              className="group relative px-8 py-5 md:px-12 md:py-6 bg-accent-pink rounded-2xl font-display font-bold text-lg md:text-xl text-white cursor-pointer overflow-hidden"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              style={{
                boxShadow: isHovering 
                  ? '0 0 60px rgba(255, 51, 102, 0.6)' 
                  : '0 0 40px rgba(255, 51, 102, 0.4)',
              }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              />
              
              <span className="relative flex items-center gap-3">
                <span>Roast Me</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>
          </motion.div>

          {/* Persona preview - more menacing */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mt-10 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <p className="w-full text-xs text-text-muted uppercase tracking-wider mb-2">Your executioners await</p>
            {[
              { icon: '👨‍👦', label: 'Strict Dad' },
              { icon: '👵', label: 'Nosy Aunty' },
              { icon: '🧒', label: 'Gen Z' },
              { icon: '🧠', label: 'Therapist' },
            ].map((persona, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-2 px-3 py-2 bg-bg-glass backdrop-blur-sm border border-border rounded-lg"
                whileHover={{ scale: 1.05, borderColor: 'rgba(255, 51, 102, 0.3)' }}
              >
                <span className="text-xl">{persona.icon}</span>
                <span className="text-sm text-text-secondary hidden sm:inline">{persona.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom Section - Humbled Counter + Stats */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          {/* Humbled Counter - Social Proof */}
          <div className="flex justify-center">
            <motion.div 
              className="inline-flex items-center gap-4 md:gap-6 px-6 py-4 bg-bg-glass backdrop-blur-xl border border-border rounded-2xl"
              whileHover={{ borderColor: 'rgba(255, 51, 102, 0.3)' }}
            >
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-accent-pink" />
                <span className="text-sm font-medium text-text-secondary uppercase tracking-wide">
                  Egos Crushed
                </span>
              </div>
              
              <motion.div
                className="font-display font-black text-3xl md:text-4xl text-accent-pink"
                key={humbledCount}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {humbledCount.toLocaleString()}
              </motion.div>
              
              {/* Live indicator */}
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-2 h-2 bg-accent-green rounded-full"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [1, 0.7, 1],
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                  style={{ boxShadow: '0 0 10px #00FF88' }}
                />
                <span className="text-xs text-text-muted uppercase tracking-wider hidden md:inline">Live</span>
              </div>
            </motion.div>
          </div>

          {/* Brutal taglines */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-text-muted text-sm">
            <span>💀 Brutally Honest</span>
            <span>🔥 No Filter</span>
            <span>😭 100% Accurate</span>
          </div>

          {/* Disclaimer - more intense */}
          <p className="text-center text-xs text-text-muted px-4">
            Side effects include: questioning your life choices, existential dread, and an urge to delete your accounts.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
