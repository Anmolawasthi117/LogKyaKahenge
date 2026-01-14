import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Flame, Zap, Users, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

export function LandingPage() {
  const navigate = useNavigate();
  const [humbledCount, setHumbledCount] = useState(42069);

  // Simulate real-time counter
  useEffect(() => {
    const interval = setInterval(() => {
      setHumbledCount(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-old-paper relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating emojis */}
        {['🔥', '💀', '😭', '🌶️', '👨‍👦', '👵', '🧒', '🧠'].map((emoji, i) => (
          <motion.span
            key={i}
            className="absolute text-4xl opacity-20"
            style={{
              left: `${10 + (i * 12)}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {emoji}
          </motion.span>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 min-h-screen flex flex-col justify-center">
        {/* Badge */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-mustard border-3 border-ink-black font-headline font-bold text-sm uppercase tracking-widest shadow-[4px_4px_0px_#1A1A1A]">
            <span>🇮🇳</span>
            <span>Proudly Desi Roasts</span>
            <span>🌶️</span>
          </div>
        </motion.div>

        {/* Hero Headline */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h1 className="font-headline font-extrabold text-6xl md:text-8xl text-charcoal leading-none mb-4">
            Get{' '}
            <span className="relative inline-block">
              <span className="text-saffron">Humbled</span>
              <motion.span
                className="absolute -bottom-2 left-0 right-0 h-2 bg-saffron"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              />
            </span>
            {' '}by AI
          </h1>
          <p className="font-body text-xl md:text-2xl text-charcoal/70 max-w-2xl mx-auto">
            Hand us your digital footprint. Our Desi personas will expose your life choices 
            with the warmth of a disappointed Indian parent.
          </p>
        </motion.div>

        {/* Humbled Counter */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="card-brutal inline-flex items-center gap-6 px-8 py-4">
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-saffron" />
              <span className="font-headline text-sm uppercase tracking-wider text-charcoal/60">
                Souls Humbled
              </span>
            </div>
            <motion.div
              className="font-headline font-extrabold text-4xl text-saffron"
              key={humbledCount}
              initial={{ scale: 1.2, color: '#D63031' }}
              animate={{ scale: 1, color: '#FF4D00' }}
              transition={{ duration: 0.3 }}
            >
              {humbledCount.toLocaleString()}
            </motion.div>
            <motion.div
              className="w-3 h-3 bg-parrot-green rounded-full"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            />
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {[
            { icon: <Flame className="w-5 h-5" />, text: '4 Brutal Personas' },
            { icon: <Zap className="w-5 h-5" />, text: '6 Platform Support' },
            { icon: '🤖', text: 'AI-Powered Roasts' },
          ].map((feature, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-4 py-2 bg-old-paper-dark border-2 border-ink-black font-body font-medium"
            >
              {typeof feature.icon === 'string' ? (
                <span>{feature.icon}</span>
              ) : (
                <span className="text-saffron">{feature.icon}</span>
              )}
              <span>{feature.text}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <motion.button
            onClick={() => navigate('/persona')}
            className="group relative px-12 py-6 bg-saffron border-4 border-ink-black font-headline font-bold text-2xl uppercase tracking-wider shadow-[8px_8px_0px_#1A1A1A] hover:shadow-[4px_4px_0px_#1A1A1A] hover:translate-x-1 hover:translate-y-1 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="flex items-center gap-4">
              <span>🎯</span>
              Pick Your Poison
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </span>
          </motion.button>
        </motion.div>

        {/* Persona Preview */}
        <motion.div
          className="mt-16 flex justify-center gap-4 flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          {['👨‍👦', '👵', '🧒', '🧠'].map((emoji, i) => (
            <motion.div
              key={i}
              className="w-16 h-16 bg-old-paper border-3 border-ink-black flex items-center justify-center text-3xl shadow-[3px_3px_0px_#1A1A1A]"
              whileHover={{ 
                y: -10, 
                rotate: [-5, 5, -5, 0],
                transition: { duration: 0.3 }
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </motion.div>

        {/* Disclaimer */}
        <motion.p
          className="text-center mt-12 text-sm text-charcoal/50 font-body"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          ⚠️ Side effects may include: existential crisis, calling your parents, 
          and reconsidering your life choices.
        </motion.p>
      </div>
    </div>
  );
}
