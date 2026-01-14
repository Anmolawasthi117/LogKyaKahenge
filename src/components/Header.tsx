import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Flame, Github } from 'lucide-react';

export function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-50 bg-old-paper border-b-4 border-ink-black">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div
            className="relative"
            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-12 h-12 bg-saffron border-3 border-ink-black flex items-center justify-center shadow-[3px_3px_0px_#1A1A1A]">
              <Flame className="w-7 h-7 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-flame-red rounded-full border-2 border-ink-black animate-pulse" />
          </motion.div>
          
          <div className="flex flex-col">
            <motion.h1 
              className="text-xl md:text-2xl font-headline font-extrabold text-charcoal tracking-tight"
              whileHover={{ scale: 1.02 }}
            >
              Log<span className="text-saffron">Kya</span>Kahenge
            </motion.h1>
            <span className="text-xs font-body text-charcoal-light tracking-widest uppercase hidden sm:block">
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
            className="p-2 border-2 border-ink-black bg-old-paper shadow-[2px_2px_0px_#1A1A1A] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            whileHover={{ rotate: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Github className="w-5 h-5" />
          </motion.a>
          
          {!isHome && (
            <Link to="/">
              <motion.button
                className="btn-brutal text-sm hidden md:block"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                🔥 New Roast
              </motion.button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
