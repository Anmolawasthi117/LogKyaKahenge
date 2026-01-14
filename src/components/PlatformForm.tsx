import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, AlertCircle, X } from 'lucide-react';
import { PLATFORMS } from '../lib/constants';
import type { Platform } from '../lib/types';
import { useAppStore } from '../store/useAppStore';
import { fetchGitHubData } from '../lib/scrapers/github';
import { fetchChessData } from '../lib/scrapers/chess';
import { fetchLeetCodeData } from '../lib/scrapers/leetcode';
import { fetchRedditData } from '../lib/scrapers/reddit';

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
        relative p-4 border-3 border-ink-black transition-all duration-200
        ${isEnabled 
          ? 'bg-old-paper shadow-[4px_4px_0px_#1A1A1A]' 
          : 'bg-old-paper/50 opacity-60'
        }
        ${isVerified ? 'border-parrot-green' : ''}
        ${error ? 'border-flame-red' : ''}
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
              w-6 h-6 border-2 border-ink-black flex items-center justify-center
              transition-colors
              ${platform.comingSoon ? 'bg-charcoal/20 cursor-not-allowed' : isEnabled ? 'bg-saffron cursor-pointer' : 'bg-old-paper cursor-pointer'}
            `}
            whileHover={platform.comingSoon ? {} : { scale: 1.1 }}
            whileTap={platform.comingSoon ? {} : { scale: 0.9 }}
          >
            {isEnabled && !platform.comingSoon && <Check className="w-4 h-4 text-ink-black" strokeWidth={3} />}
          </motion.div>
          
          <span className="text-2xl">{platform.icon}</span>
          <span className={`font-headline font-bold text-lg ${platform.comingSoon ? 'text-charcoal/50' : 'text-charcoal group-hover:text-saffron'} transition-colors`}>
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
              className="flex items-center gap-1 px-2 py-1 bg-mustard text-ink-black text-xs font-bold border-2 border-ink-black"
            >
              🚀 Coming Soon
            </motion.div>
          )}
          {isVerified && !platform.comingSoon && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="flex items-center gap-1 px-2 py-1 bg-parrot-green text-ink-black text-xs font-bold border-2 border-ink-black"
            >
              <Check className="w-3 h-3" /> Verified
            </motion.div>
          )}
          {error && !platform.comingSoon && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="flex items-center gap-1 px-2 py-1 bg-flame-red text-white text-xs font-bold border-2 border-ink-black"
            >
              <AlertCircle className="w-3 h-3" /> Error
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Section */}
      {isEnabled && !platform.comingSoon && (
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
                input-brutal w-full text-sm
                ${isVerified ? 'bg-parrot-green/10' : ''}
                ${error ? 'border-flame-red' : ''}
              `}
            />
            {isVerified && (
              <button
                onClick={handleClear}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-flame-red/20 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <motion.button
            onClick={handleVerify}
            disabled={isLoading || !username.trim() || isVerified}
            className={`
              px-4 py-2 font-headline font-bold text-sm uppercase
              border-3 border-ink-black transition-all
              ${isVerified 
                ? 'bg-parrot-green text-ink-black cursor-not-allowed' 
                : 'bg-saffron text-ink-black shadow-[3px_3px_0px_#1A1A1A] hover:shadow-[1px_1px_0px_#1A1A1A] hover:translate-x-[2px] hover:translate-y-[2px]'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
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
            className="mt-3 flex items-center gap-3 p-2 bg-ink-black/5 border border-ink-black/20"
          >
            <img 
              src={data.avatar as string} 
              alt="Profile" 
              className="w-10 h-10 border-2 border-ink-black object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-body font-medium text-sm text-charcoal truncate">
                {'name' in data ? (data.name as string) : username}
              </p>
              <p className="text-xs text-charcoal/60">@{username}</p>
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
            className="mt-2 text-xs text-flame-red font-body"
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
          <h2 className="font-headline font-bold text-2xl text-charcoal">
            The Evidence Locker 📁
          </h2>
          <p className="text-sm text-charcoal/70 font-body mt-1">
            Add your profiles. The more you add, the harder we roast.
          </p>
        </div>
        
        <div className="text-right">
          <div className="text-3xl font-headline font-extrabold text-saffron">
            {enabledPlatforms.length}
          </div>
          <div className="text-xs text-charcoal/60 uppercase tracking-wider">
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
