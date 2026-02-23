import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, AlertCircle, X, Music } from 'lucide-react';
import { PLATFORMS } from '../lib/constants';
import type { Platform } from '../lib/types';
import { useAppStore } from '../store/useAppStore';
import { fetchGitHubData } from '../lib/scrapers/github';
import { fetchChessData } from '../lib/scrapers/chess';
import { fetchLeetCodeData } from '../lib/scrapers/leetcode';
import { fetchRedditData } from '../lib/scrapers/reddit';
import { initiateSpotifyLogin } from '../lib/scrapers/spotify';

interface PlatformInputProps {
  platformId: Platform;
  isEnabled: boolean;
  onToggle: () => void;
}

function PlatformInput({ platformId, isEnabled, onToggle }: PlatformInputProps) {
  const platform = PLATFORMS.find(p => p.id === platformId)!;
  const [username, setUsername] = useState('');
  
  const {
    loadingPlatforms,
    verifiedPlatforms,
    platformData,
    errors,
    setLoadingPlatform,
    setVerifiedPlatform,
    setPlatformData,
    setPlatformUsername,
    setError,
  } = useAppStore();

  const isLoading = loadingPlatforms.includes(platformId);
  const isVerified = verifiedPlatforms.includes(platformId);
  const error = errors[platformId];
  const data = platformData[platformId];

  const handleVerify = useCallback(async () => {
    if (!username.trim()) return;
    
    setLoadingPlatform(platformId, true);
    setError(platformId, null);
    setVerifiedPlatform(platformId, false);

    try {
      let result;
      switch (platformId) {
        case 'github':
          result = await fetchGitHubData(username);
          break;
        case 'chess':
          result = await fetchChessData(username);
          break;
        case 'leetcode':
          result = await fetchLeetCodeData(username);
          break;
        case 'reddit':
          result = await fetchRedditData(username);
          break;
        case 'spotify':
          // Spotify uses OAuth, handled separately
          return;
        case 'behance':
          // Mock verification for now
          await new Promise(resolve => setTimeout(resolve, 1000));
          result = { username, avatar: '' };
          break;
      }

      if (result) {
        setPlatformData(platformId, result);
        setPlatformUsername(platformId, username);
        setVerifiedPlatform(platformId, true);
      }
    } catch (err) {
      setError(platformId, err instanceof Error ? err.message : 'Profile not found');
    } finally {
      setLoadingPlatform(platformId, false);
    }
  }, [username, platformId, setLoadingPlatform, setError, setVerifiedPlatform, setPlatformData, setPlatformUsername]);

  const handleClear = () => {
    setUsername('');
    setVerifiedPlatform(platformId, false);
    setPlatformData(platformId, undefined);
    setError(platformId, null);
  };

  return (
    <motion.div
      className={`
        relative p-4 rounded-xl transition-all duration-200 border
        ${isEnabled 
          ? 'bg-bg-glass border-border' 
          : 'bg-bg-card/30 border-transparent opacity-60'
        }
        ${isVerified ? 'border-accent-green/50' : ''}
        ${error ? 'border-red-500/50' : ''}
      `}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Toggle & Platform Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={platform.comingSoon ? undefined : onToggle}
          className={`flex items-center gap-3 group ${platform.comingSoon ? 'cursor-not-allowed' : ''}`}
          disabled={platform.comingSoon}
        >
          <motion.div
            className={`
              w-6 h-6 rounded-md flex items-center justify-center border transition-colors
              ${platform.comingSoon 
                ? 'bg-bg-card border-border cursor-not-allowed' 
                : isEnabled 
                  ? 'bg-accent-pink border-transparent cursor-pointer' 
                  : 'bg-bg-glass border-border cursor-pointer'
              }
            `}
            whileHover={platform.comingSoon ? {} : { scale: 1.1 }}
            whileTap={platform.comingSoon ? {} : { scale: 0.9 }}
          >
            {isEnabled && !platform.comingSoon && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
          </motion.div>
          
          <span className="text-2xl">{platform.icon}</span>
          <span className={`font-display font-bold text-lg ${platform.comingSoon ? 'text-text-muted' : 'text-text-primary group-hover:text-accent-pink'} transition-colors`}>
            {platform.name}
          </span>
        </button>

        {/* Status Badge */}
        <AnimatePresence mode="wait">
          {platform.comingSoon && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="flex items-center gap-1 px-2 py-1 bg-accent-orange/20 text-accent-orange text-xs font-semibold rounded-full"
            >
              🚀 Coming Soon
            </motion.div>
          )}
          {isVerified && !platform.comingSoon && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="flex items-center gap-1 px-2 py-1 bg-accent-green/20 text-accent-green text-xs font-semibold rounded-full"
            >
              <Check className="w-3 h-3" /> Verified
            </motion.div>
          )}
          {error && !platform.comingSoon && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 text-xs font-semibold rounded-full"
            >
              <AlertCircle className="w-3 h-3" /> Error
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Section — Spotify uses OAuth button, others use text input */}
      {isEnabled && !platform.comingSoon && platformId === 'spotify' && !isVerified && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
        >
          <motion.button
            onClick={() => initiateSpotifyLogin()}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg text-sm font-display font-bold text-white transition-all"
            style={{
              background: 'linear-gradient(135deg, #1DB954 0%, #1ed760 100%)',
              boxShadow: '0 0 25px rgba(29, 185, 84, 0.3)',
            }}
            whileHover={{ scale: 1.02, boxShadow: '0 0 35px rgba(29, 185, 84, 0.5)' }}
            whileTap={{ scale: 0.98 }}
          >
            <Music className="w-5 h-5" />
            🎵 Connect Spotify
          </motion.button>
        </motion.div>
      )}

      {/* Spotify disconnect button when verified */}
      {isEnabled && platformId === 'spotify' && isVerified && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="flex items-center gap-2"
        >
          <div className="flex-1 px-4 py-3 rounded-lg text-sm font-body bg-accent-green/10 border border-accent-green/30 text-accent-green">
            ✅ Spotify Connected
          </div>
          <button
            onClick={handleClear}
            className="p-3 hover:bg-red-500/20 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-text-muted" />
          </button>
        </motion.div>
      )}

      {/* Standard text input for non-Spotify platforms */}
      {isEnabled && !platform.comingSoon && platformId !== 'spotify' && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="flex gap-2"
        >
          <div className="flex-1 relative">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
              placeholder={platform.placeholder}
              disabled={isLoading || isVerified}
              className={`
                w-full px-4 py-3 rounded-lg text-sm font-body
                bg-bg-card border border-border text-text-primary
                placeholder:text-text-muted
                focus:outline-none focus:border-accent-pink focus:ring-2 focus:ring-accent-pink/20
                transition-all
                ${isVerified ? 'bg-accent-green/10 border-accent-green/30' : ''}
                ${error ? 'border-red-500/50' : ''}
              `}
            />
            {isVerified && (
              <button
                onClick={handleClear}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-red-500/20 rounded-md transition-colors"
              >
                <X className="w-4 h-4 text-text-muted" />
              </button>
            )}
          </div>
          
          <motion.button
            onClick={handleVerify}
            disabled={isLoading || !username.trim() || isVerified}
            className={`
              px-4 py-2 font-display font-semibold text-sm rounded-lg transition-all
              ${isVerified 
                ? 'bg-accent-green text-white cursor-not-allowed' 
                : 'bg-accent-pink text-white hover:opacity-90'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            style={{
              boxShadow: !isVerified && !isLoading ? '0 0 20px rgba(255, 51, 102, 0.3)' : 'none',
            }}
            whileHover={!isVerified && !isLoading ? { scale: 1.02 } : {}}
            whileTap={!isVerified && !isLoading ? { scale: 0.98 } : {}}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isVerified ? (
              <Check className="w-4 h-4" />
            ) : (
              'Verify'
            )}
          </motion.button>
        </motion.div>
      )}

      {/* Avatar Preview */}
      <AnimatePresence>
        {isVerified && data && 'avatar' in data && data.avatar && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-3 flex items-center gap-3 p-3 bg-bg-card border border-border rounded-lg"
          >
            <img 
              src={data.avatar as string} 
              alt="Profile" 
              className="w-10 h-10 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-body font-medium text-sm text-text-primary truncate">
                {'name' in data ? (data.name as string) : username}
              </p>
              <p className="text-xs text-text-muted">@{username}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 text-xs text-red-400 font-body"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function PlatformForm() {
  const [enabledPlatforms, setEnabledPlatforms] = useState<Platform[]>(['github', 'leetcode']);

  const togglePlatform = (platformId: Platform) => {
    setEnabledPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-bold text-xl text-text-primary">
            Your Digital Footprint 👣
          </h2>
          <p className="text-sm text-text-secondary font-body mt-1">
            Add your profiles. The more you add, the harder we roast.
          </p>
        </div>
        
        <div className="text-right">
          <div className="text-3xl font-display font-extrabold text-accent-pink">
            {enabledPlatforms.length}
          </div>
          <div className="text-xs text-text-muted uppercase tracking-wider">
            platforms
          </div>
        </div>
      </div>

      <div className="grid gap-3">
        {PLATFORMS.map((platform) => (
          <PlatformInput
            key={platform.id}
            platformId={platform.id}
            isEnabled={enabledPlatforms.includes(platform.id)}
            onToggle={() => togglePlatform(platform.id)}
          />
        ))}
      </div>
    </div>
  );
}
