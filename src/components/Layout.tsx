import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from './Header';

export function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col">
      {/* Background effects */}
      <div className="fixed inset-0 bg-glow pointer-events-none" />
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      
      <Header />
      
      {/* Main Content Area with page transitions */}
      <motion.main 
        className="flex-1 relative z-10"
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <Outlet />
      </motion.main>
    </div>
  );
}
