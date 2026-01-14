import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Download, RefreshCw, Loader2 } from 'lucide-react';
import { RoastBox } from '../components/RoastBox';
import { BurnMeter } from '../components/BurnMeter';
import { ShareCard } from '../components/ShareCard';
import { useAppStore } from '../store/useAppStore';
import { PERSONAS } from '../lib/constants';
import { generateRoastPrompt } from '../lib/prompts';
import { generateRoast } from '../lib/ai';

export function RoastPage() {
  const navigate = useNavigate();
  const {
    selectedPersona,
    platformData,
    verifiedPlatforms,
    isRoasting,
    setIsRoasting,
    currentRoast,
    setCurrentRoast,
    addToRoastHistory,
  } = useAppStore();

  const [roastText, setRoastText] = useState('');
  const [burnLevel, setBurnLevel] = useState(0);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showShareCard, setShowShareCard] = useState(false);

  const persona = PERSONAS.find((p) => p.id === selectedPersona);

  // Redirect if no persona selected
  useEffect(() => {
    if (!selectedPersona || verifiedPlatforms.length === 0) {
      navigate('/');
    }
  }, [selectedPersona, verifiedPlatforms, navigate]);

  // Generate roast on mount
  const generateNewRoast = useCallback(async () => {
    if (!selectedPersona) return;

    setIsRoasting(true);
    setIsStreaming(true);
    setRoastText('');
    setBurnLevel(0);
    setError(null);

    try {
      // Generate prompt
      const prompt = generateRoastPrompt(selectedPersona, platformData);

      // Stream the roast
      let fullText = '';
      await generateRoast(prompt, (chunk) => {
        fullText += chunk;
        setRoastText(fullText);
        
        // Gradually increase burn level
        const progress = Math.min((fullText.length / 1500) * 100, 95);
        setBurnLevel(progress);
      });

      // Finalize with random burn level 90-100
      setIsStreaming(false);
      const finalBurnLevel = Math.floor(Math.random() * 11) + 90; // 90-100
      setBurnLevel(finalBurnLevel);

      // Extract a signature line (first sentence that's impactful)
      const sentences = fullText.split(/[.!?]/).filter(s => s.trim().length > 20);
      const signatureLine = sentences[Math.floor(sentences.length / 2)]?.trim() || 'You got roasted!';

      const roastResult = {
        id: Date.now().toString(),
        persona: selectedPersona,
        platforms: verifiedPlatforms,
        roastText: fullText,
        signatureLine,
        burnLevel: finalBurnLevel,
        createdAt: new Date(),
        userAvatars: Object.values(platformData)
          .filter((d): d is NonNullable<typeof d> => d !== undefined && d !== null && typeof d === 'object' && 'avatar' in d && typeof (d as { avatar?: string }).avatar === 'string')
          .map((d) => (d as { avatar: string }).avatar),
      };

      setCurrentRoast(roastResult);
      addToRoastHistory(roastResult);
    } catch (err) {
      console.error('Roast generation failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate roast');
      setIsStreaming(false);
      
      // Fallback roast for when AI fails
      const fallbackRoast = `Oh, looks like even our AI couldn't handle roasting you. That's how unremarkable your digital presence is – not even worth the compute cycles. 

But let me try manually: You came here hoping for a brutal roast, but your profiles are so forgettable that our servers literally gave up. Maybe that's the real roast? 

Pro tip: If you want to be roasted, first you need to be... something. Anything. Right now you're giving "generic NPC in a loading screen" energy.

${persona?.id === 'khadoos-baap' ? "Log kya kahenge? Kuch nahi, kyunki koi notice hi nahi karega." : ""}
${persona?.id === 'desi-aunty' ? "Haaye beta, itna boring profile? Sharma ji ka beta toh at least interesting toh hai." : ""}`;
      
      setRoastText(fallbackRoast);
      setBurnLevel(69);
    } finally {
      setIsRoasting(false);
    }
  }, [selectedPersona, platformData, verifiedPlatforms, setIsRoasting, setCurrentRoast, addToRoastHistory, persona?.id]);

  useEffect(() => {
    generateNewRoast();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!persona) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 border-2 border-ink-black bg-old-paper shadow-[3px_3px_0px_#1A1A1A] hover:shadow-[1px_1px_0px_#1A1A1A] hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-headline font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex items-center gap-3">
          <img src={persona.avatar} alt={persona.name} className="w-10 h-10 rounded-lg object-cover" />
          <div>
            <h1 className="font-headline font-bold text-xl text-charcoal">
              {persona.name}
            </h1>
            <p className="text-xs text-charcoal/60">{persona.vibe}</p>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Roast Box */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {error && !roastText ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="card-brutal p-8 text-center"
              >
                <p className="text-flame-red font-body mb-4">{error}</p>
                <button
                  onClick={generateNewRoast}
                  className="btn-brutal"
                >
                  Try Again
                </button>
              </motion.div>
            ) : (
              <RoastBox
                key="roast"
                text={roastText}
                isStreaming={isStreaming}
                personaAvatar={persona.avatar}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Burn Meter */}
          <motion.div
            className="card-brutal flex flex-col items-center p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-headline font-bold text-lg text-charcoal mb-4">
              🔥 Burn Meter
            </h3>
            <BurnMeter progress={burnLevel} isAnimating={!isStreaming} />
          </motion.div>

          {/* Actions */}
          <motion.div
            className="card-brutal p-6 space-y-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="font-headline font-bold text-lg text-charcoal mb-4">
              Actions
            </h3>

            <motion.button
              onClick={() => setShowShareCard(true)}
              disabled={isRoasting}
              className="w-full btn-brutal flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Share2 className="w-4 h-4" />
              Share Roast
            </motion.button>

            <motion.button
              onClick={generateNewRoast}
              disabled={isRoasting}
              className="w-full btn-brutal-secondary flex items-center justify-center gap-2 border-3 border-ink-black shadow-[3px_3px_0px_#1A1A1A] py-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isRoasting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              Regenerate
            </motion.button>

            <motion.button
              onClick={() => {
                // Download as text file
                const blob = new Blob([roastText], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `roast-${Date.now()}.txt`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              disabled={isRoasting || !roastText}
              className="w-full btn-brutal-ghost flex items-center justify-center gap-2 border-2 border-ink-black py-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="w-4 h-4" />
              Download
            </motion.button>
          </motion.div>

          {/* Platforms Used */}
          <motion.div
            className="card-brutal p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="font-headline font-bold text-sm text-charcoal/60 mb-3 uppercase tracking-wider">
              Evidence Used
            </h3>
            <div className="flex flex-wrap gap-2">
              {verifiedPlatforms.map((platform) => (
                <span
                  key={platform}
                  className="px-3 py-1 bg-ink-black text-old-paper text-xs font-headline font-bold uppercase"
                >
                  {platform}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Share Card Modal */}
      <AnimatePresence>
        {showShareCard && currentRoast && (
          <ShareCard
            roast={currentRoast}
            persona={persona}
            onClose={() => setShowShareCard(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
