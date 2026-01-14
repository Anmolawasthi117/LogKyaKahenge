import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { PersonaPage } from './pages/PersonaPage';
import { EvidencePage } from './pages/EvidencePage';
import { LoadingPage } from './pages/LoadingPage';
import { ResultPage } from './pages/ResultPage';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          {/* Landing page - no layout wrapper */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Flow pages with layout */}
          <Route element={<Layout />}>
            <Route path="/persona" element={<PersonaPage />} />
            <Route path="/evidence" element={<EvidencePage />} />
            <Route path="/result" element={<ResultPage />} />
          </Route>
          
          {/* Loading page - custom full-screen */}
          <Route path="/loading" element={<LoadingPage />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}

export default App;
