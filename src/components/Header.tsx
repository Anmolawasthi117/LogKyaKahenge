import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Flame, Github } from 'lucide-react';

export function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-50 bg-bg-dark/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-10 h-10 bg-accent-pink rounded-xl flex items-center justify-center">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <motion.div 
              className="absolute -top-1 -right-1 w-3 h-3 bg-accent-green rounded-full"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ boxShadow: '0 0 8px #00FF88' }}
            />
          </motion.div>
          
          <div className="flex flex-col">
            <motion.h1 
              className="text-lg md:text-xl font-display font-bold text-text-primary tracking-tight"
              whileHover={{ opacity: 0.8 }}
            >
              Log<span className="text-accent-pink">Kya</span>Kahenge
            </motion.h1>
            <span className="text-xs text-text-muted tracking-wide hidden sm:block">
              Roast-as-a-Service
            </span>
          </div>
        </Link>

        {/* Nav Actions */}
        <div className="flex items-center gap-3">
          <motion.a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 bg-bg-glass border border-border rounded-lg hover:border-border-hover transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Github className="w-5 h-5 text-text-secondary" />
          </motion.a>
          
          {!isHome && (
            <Link to="/">
              <motion.button
                className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-accent-pink rounded-lg font-display font-semibold text-sm text-white"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ boxShadow: '0 0 20px rgba(255, 51, 102, 0.3)' }}
              >
                <Flame className="w-4 h-4" />
                <span>New Roast</span>
              </motion.button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
