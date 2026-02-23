import { BrowserRouter, Routes, Route, useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { PersonaPage } from './pages/PersonaPage';
import { EvidencePage } from './pages/EvidencePage';
import { LoadingPage } from './pages/LoadingPage';
import { ResultPage } from './pages/ResultPage';
import { parseSpotifyCallback } from './lib/scrapers/spotify';
import { useAppStore } from './store/useAppStore';
import './index.css';

/**
 * Handles the Spotify OAuth callback redirect.
 * When the user returns from Spotify auth, the URL will contain ?spotify_data=<base64>.
 * This component parses that data, stores it, and redirects to /evidence.
 */
function SpotifyCallbackHandler() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setPlatformData, setVerifiedPlatform, setError } = useAppStore();

  useEffect(() => {
    const spotifyData = searchParams.get('spotify_data');
    const spotifyError = searchParams.get('spotify_error');

    if (spotifyData) {
      try {
        const data = parseSpotifyCallback(spotifyData);
        setPlatformData('spotify', data);
        setVerifiedPlatform('spotify', true);
        console.log('🎵 Spotify data loaded:', data.displayName);
      } catch {
        setError('spotify', 'Failed to load Spotify data. Please try again.');
        console.error('❌ Failed to parse Spotify data');
      }
      // Clean the URL and redirect to evidence page
      navigate('/evidence', { replace: true });
    } else if (spotifyError) {
      setError('spotify', `Spotify connection failed: ${spotifyError}`);
      navigate('/evidence', { replace: true });
    }
  }, [searchParams, navigate, setPlatformData, setVerifiedPlatform, setError]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <SpotifyCallbackHandler />
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

