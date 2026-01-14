import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { X, Share2, Download, Twitter, Linkedin, MessageCircle, Flame, Loader2 } from 'lucide-react';
import { toPng } from 'html-to-image';
import type { RoastResult, PersonaInfo } from '../lib/types';

interface ShareCardProps {
  roast: RoastResult;
  persona: PersonaInfo;
  onClose: () => void;
}

export function ShareCard({ roast, persona, onClose }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const shareUrl = typeof window !== 'undefined' ? 'https://logkyakahenge.com' : '';
  
  // Get the best roast excerpt (first meaty paragraph or significant chunk)
  const getBestRoastExcerpt = () => {
    const paragraphs = roast.roastText
      .split(/\n{1,2}/)
      .map(p => p.trim())
      .filter(p => p.length > 50); // Only substantial paragraphs
    
    // Find the most impactful paragraph (usually 2nd or 3rd one)
    const bestParagraph = paragraphs[1] || paragraphs[0] || roast.roastText.slice(0, 200);
    
    // Limit to ~200 chars for social sharing
    return bestParagraph.length > 200 
      ? bestParagraph.slice(0, 200) + '...' 
      : bestParagraph;
  };

  const roastExcerpt = getBestRoastExcerpt();
  const shareText = `I just got ROASTED by ${persona.name} on LogKyaKahenge! 🔥\n\n"${roastExcerpt}"\n\nGet your brutal roast at:`;

  // Share handlers
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'LogKyaKahenge - My Roast',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Share cancelled or failed', err);
      }
    }
  };

  const handleTwitterShare = () => {
    const tweetText = encodeURIComponent(`${shareText} ${shareUrl}`);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
  };

  const handleLinkedInShare = () => {
    const linkedInUrl = encodeURIComponent(shareUrl);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${linkedInUrl}`, '_blank');
  };

  const handleWhatsAppShare = () => {
    const whatsappText = encodeURIComponent(`${shareText} ${shareUrl}`);
    window.open(`https://wa.me/?text=${whatsappText}`, '_blank');
  };

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#0D0D0D',
      });
      
      const link = document.createElement('a');
      link.download = `logkyakahenge-roast-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to download image:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-xl my-8"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 w-10 h-10 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Downloadable Card */}
        <div
          ref={cardRef}
          className="rounded-2xl overflow-hidden"
          style={{ 
            background: 'linear-gradient(180deg, #1A0A0F 0%, #0D0D0D 50%, #0A0A0F 100%)',
          }}
        >
          {/* Header with Branding */}
          <div className="relative px-6 py-5 border-b border-white/10">
            {/* Glow effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-accent-pink/30 blur-[80px] -z-10" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Flame className="w-8 h-8 text-accent-pink" />
                  <div className="absolute inset-0 blur-lg bg-accent-pink/50" />
                </div>
                <div>
                  <h1 className="font-display font-black text-xl text-white tracking-tight">
                    Log<span className="text-accent-pink">Kya</span>Kahenge
                  </h1>
                  <p className="text-xs text-white/50">Professional Humiliation Services</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="px-3 py-1.5 bg-accent-pink/20 border border-accent-pink/30 rounded-lg">
                  <span className="font-display font-bold text-accent-pink text-sm">
                    🔥 {roast.burnLevel}% BURN
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Roaster Info */}
          <div className="px-6 py-4 border-b border-white/5">
            <div className="flex items-center gap-4">
              <img 
                src={persona.avatar} 
                alt={persona.name} 
                className="w-14 h-14 rounded-xl object-cover ring-2 ring-accent-pink/30"
              />
              <div>
                <h2 className="font-display font-bold text-lg text-white">{persona.name}</h2>
                <p className="text-sm text-accent-pink">{persona.nameHindi}</p>
                <p className="text-xs text-white/40 mt-0.5">{persona.vibe}</p>
              </div>
            </div>
          </div>

          {/* Roast Content */}
          <div className="px-6 py-6">
            <div className="relative">
              {/* Quote marks */}
              <span className="absolute -top-2 -left-1 text-5xl text-accent-pink/20 font-serif leading-none">"</span>
              
              <blockquote className="font-body text-base text-white/80 leading-relaxed pl-4 pr-2">
                {roastExcerpt}
              </blockquote>
              
              <span className="absolute -bottom-4 right-0 text-5xl text-accent-pink/20 font-serif leading-none">"</span>
            </div>
          </div>

          {/* Platform Evidence */}
          {roast.platforms.length > 0 && (
            <div className="px-6 pb-4">
              <div className="flex flex-wrap gap-2">
                {roast.platforms.map((platform) => (
                  <span
                    key={platform}
                    className="px-2.5 py-1 bg-white/5 border border-white/10 text-white/60 text-xs font-display uppercase rounded-md"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Footer with CTA */}
          <div className="px-6 py-5 bg-gradient-to-r from-accent-pink/10 to-purple-500/10 border-t border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider">Get roasted at</p>
                <p className="font-display font-bold text-white text-lg">logkyakahenge.com</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-accent-pink rounded-xl">
                <Flame className="w-4 h-4 text-white" />
                <span className="font-display font-bold text-white text-sm">ROAST ME</span>
              </div>
            </div>
          </div>
        </div>

        {/* Share Buttons (outside downloadable area) */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          {/* Download Image */}
          <motion.button
            onClick={handleDownloadImage}
            disabled={isDownloading}
            className="col-span-2 flex items-center justify-center gap-2 px-4 py-4 bg-accent-pink rounded-xl font-display font-bold text-white"
            style={{ boxShadow: '0 0 40px rgba(255, 51, 102, 0.3)' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isDownloading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Download className="w-5 h-5" />
            )}
            {isDownloading ? 'Generating...' : 'Download Image'}
          </motion.button>

          {/* Native Share (if available) */}
          {'share' in navigator && (
            <motion.button
              onClick={handleNativeShare}
              className="col-span-2 flex items-center justify-center gap-2 px-4 py-3 bg-white/10 border border-white/20 rounded-xl font-display font-semibold text-white"
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.15)' }}
              whileTap={{ scale: 0.98 }}
            >
              <Share2 className="w-4 h-4" />
              Share
            </motion.button>
          )}

          {/* Twitter */}
          <motion.button
            onClick={handleTwitterShare}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1DA1F2] rounded-xl font-display font-semibold text-white"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Twitter className="w-4 h-4" />
            Twitter
          </motion.button>

          {/* WhatsApp */}
          <motion.button
            onClick={handleWhatsAppShare}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] rounded-xl font-display font-semibold text-white"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </motion.button>

          {/* LinkedIn */}
          <motion.button
            onClick={handleLinkedInShare}
            className="col-span-2 flex items-center justify-center gap-2 px-4 py-3 bg-[#0A66C2] rounded-xl font-display font-semibold text-white"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Linkedin className="w-4 h-4" />
            Share on LinkedIn
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
