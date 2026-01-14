import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from './Header';
import { HumiliationTicker } from './HumiliationTicker';

export function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-old-paper flex flex-col">
      <Header />
      
      {/* Main Content Area with page transitions */}
      <motion.main 
        className="flex-1 pb-20"
        key={location.pathname}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet />
      </motion.main>
      
      {/* Bottom Ticker */}
      <HumiliationTicker />
    </div>
  );
}
