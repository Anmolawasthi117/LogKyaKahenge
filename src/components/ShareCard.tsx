import { motion } from 'framer-motion';
import { X, Share2, Download, Twitter, Linkedin, MessageCircle } from 'lucide-react';
import type { RoastResult, PersonaInfo } from '../lib/types';

interface ShareCardProps {
  roast: RoastResult;
  persona: PersonaInfo;
  onClose: () => void;
}

export function ShareCard({ roast, persona, onClose }: ShareCardProps) {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `I just got ROASTED by ${persona.name} on LogKyaKahenge! 🔥\n\n"${roast.signatureLine}"\n\nGet your brutal roast at:`;

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

  const handleDownload = () => {
    // Create a text file download
    const content = `
╔══════════════════════════════════════════════════════════╗
║                    LOGKYAKAHENGE                         ║
║                  Official Roast Certificate              ║
╚══════════════════════════════════════════════════════════╝

Roaster: ${persona.name} | ${persona.nameHindi}
Date: ${new Date(roast.createdAt).toLocaleDateString('en-IN')}
Burn Level: ${roast.burnLevel}%

────────────────────────────────────────────────────────────

${roast.roastText}

────────────────────────────────────────────────────────────

Signature Line:
"${roast.signatureLine}"

────────────────────────────────────────────────────────────

Get your roast at: logkyakahenge.com
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roast-certificate-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-darker/90 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-lg bg-bg-dark border border-border rounded-2xl overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: '0 0 60px rgba(255, 51, 102, 0.2)' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-bg-glass border border-border rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:border-border-hover transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-accent-pink/20 to-accent-purple/20 border-b border-border px-6 py-5">
          <div className="flex items-center gap-3">
            <img src={persona.avatar} alt={persona.name} className="w-10 h-10 rounded-lg object-cover" />
            <div>
              <h2 className="font-display font-bold text-xl text-text-primary">Share Your Roast</h2>
              <p className="text-xs text-text-muted">Spread the humiliation</p>
            </div>
          </div>
        </div>

        {/* Preview Card */}
        <div className="p-6">
          <div className="bg-bg-glass border border-border rounded-xl p-4 mb-6">
            {/* User Avatars */}
            {roast.userAvatars.length > 0 && (
              <div className="flex -space-x-2 mb-4">
                {roast.userAvatars.slice(0, 3).map((avatar, i) => (
                  <img
                    key={i}
                    src={avatar}
                    alt=""
                    className="w-10 h-10 border-2 border-bg-dark rounded-full object-cover bg-bg-card"
                  />
                ))}
              </div>
            )}

            {/* Signature Line */}
            <blockquote className="font-body text-lg text-text-secondary italic mb-4">
              "{roast.signatureLine}"
            </blockquote>

            {/* Persona Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={persona.avatar} alt={persona.name} className="w-6 h-6 rounded object-cover" />
                <span className="font-display font-bold text-sm text-text-primary">{persona.name}</span>
              </div>
              <div className="px-3 py-1 text-xs font-display font-semibold uppercase rounded-full bg-gradient-to-r from-accent-pink/20 to-accent-purple/20 text-accent-pink border border-accent-pink/30">
                {roast.burnLevel}% BURN
              </div>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="grid grid-cols-2 gap-3">
            {/* Native Share (if available) */}
            {'share' in navigator && (
              <motion.button
                onClick={handleNativeShare}
                className="col-span-2 flex items-center justify-center gap-2 px-4 py-3 bg-accent-pink rounded-xl font-display font-semibold text-white"
                style={{ boxShadow: '0 0 30px rgba(255, 51, 102, 0.3)' }}
                whileHover={{ scale: 1.02 }}
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
              X / Twitter
            </motion.button>

            {/* LinkedIn */}
            <motion.button
              onClick={handleLinkedInShare}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-[#0A66C2] rounded-xl font-display font-semibold text-white"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
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

            {/* Download */}
            <motion.button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-bg-glass border border-border rounded-xl font-display font-semibold text-text-primary hover:border-border-hover"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="w-4 h-4" />
              Download
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
