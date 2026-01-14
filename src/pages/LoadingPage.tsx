import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { PERSONAS } from '../lib/constants';
import { generateRoastPrompt } from '../lib/prompts';
import { generateRoast } from '../lib/ai';

// Funny loading messages based on platforms
const LOADING_MESSAGES = {
  github: [
    "Judging your commit messages... 'fixed stuff' really? 🙄",
    "Counting your stars... not finding many...",
    "Analyzing your green squares... sparse.",
    "Reading your README files... if they exist.",
  ],
  leetcode: [
    "Checking your LeetCode... why so many 'Easy' problems, beta?",
    "Looking at your acceptance rate... ouch.",
    "Counting the Hard problems you avoided...",
    "Reviewing your solutions... brute force, huh?",
  ],
  chess: [
    "Analyzing your chess games... interesting choices.",
    "Your ELO is... something alright.",
    "Counting how many times you blundered your queen...",
    "Looking at your timeouts... do you even play?",
  ],
  reddit: [
    "Reading your Reddit comments... yikes.",
    "Checking your post history... 😬",
    "Counting your karma... is that all?",
    "Analyzing the subreddits you follow... interesting taste.",
  ],
  general: [
    "Grandpa is putting on his glasses to judge you...",
    "Aunty is warming up her disappointment...",
    "Loading maximum embarrassment protocol...",
    "Preparing weapons-grade honesty...",
    "Consulting with the council of disapproval...",
    "Calibrating the roast-o-meter...",
    "Gathering all the evidence against you...",
    "Preparing to destroy your self-esteem...",
  ],
};

export function LoadingPage() {
  const navigate = useNavigate();
  const { selectedPersona, platformData, verifiedPlatforms, setCurrentRoast, addToRoastHistory } = useAppStore();
  
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [roastText, setRoastText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const persona = PERSONAS.find(p => p.id === selectedPersona);

  // Get messages based on verified platforms
  const getMessages = useCallback(() => {
    const messages: string[] = [];
    verifiedPlatforms.forEach(platform => {
      const platformMessages = LOADING_MESSAGES[platform as keyof typeof LOADING_MESSAGES];
      if (platformMessages) {
        messages.push(...platformMessages);
      }
    });
    messages.push(...LOADING_MESSAGES.general);
    return messages;
  }, [verifiedPlatforms]);

  // Cycle through messages
  useEffect(() => {
    const messages = getMessages();
    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % messages.length);
      setCurrentMessage(messages[(messageIndex + 1) % messages.length]);
    }, 2500);

    setCurrentMessage(messages[0]);
    return () => clearInterval(interval);
  }, [getMessages, messageIndex]);

  // Generate roast
  useEffect(() => {
    if (!selectedPersona || verifiedPlatforms.length === 0) {
      navigate('/evidence');
      return;
    }

    const generateTheRoast = async () => {
      try {
        const prompt = generateRoastPrompt(selectedPersona, platformData);
        let fullText = '';

        await generateRoast(prompt, (chunk) => {
          fullText += chunk;
          setRoastText(fullText);
          // Update progress based on text length
          const estimatedProgress = Math.min((fullText.length / 1500) * 100, 95);
          setProgress(estimatedProgress);
        });

        setProgress(100);

        // Create roast result
        const sentences = fullText.split(/[.!?]/).filter(s => s.trim().length > 20);
        const signatureLine = sentences[Math.floor(sentences.length / 2)]?.trim() || 'You got roasted!';

        const roastResult = {
          id: Date.now().toString(),
          persona: selectedPersona,
          platforms: verifiedPlatforms,
          roastText: fullText,
          signatureLine,
          burnLevel: 100,
          createdAt: new Date(),
          userAvatars: Object.values(platformData)
            .filter((d): d is NonNullable<typeof d> => d !== undefined && d !== null && typeof d === 'object' && 'avatar' in d && typeof (d as { avatar?: string }).avatar === 'string')
            .map((d) => (d as { avatar: string }).avatar),
        };

        setCurrentRoast(roastResult);
        addToRoastHistory(roastResult);
        setIsComplete(true);

        // Navigate to result after a short delay
        setTimeout(() => {
          navigate('/result');
        }, 1500);
      } catch (error) {
        console.error('Roast generation failed:', error);
        navigate('/result');
      }
    };

    generateTheRoast();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-ink-black flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Persona Icon */}
        {persona && (
          <motion.div
            className="mb-8"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, -5, 5, 0],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
            }}
          >
            <span className="text-8xl">{persona.icon}</span>
          </motion.div>
        )}

        {/* Status Message */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMessage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8"
          >
            <p className="font-headline font-bold text-2xl md:text-3xl text-old-paper">
              {currentMessage}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="relative mb-8">
          <div className="h-4 bg-charcoal border-2 border-old-paper/30 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-saffron via-flame-red to-saffron"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="mt-2 font-body text-old-paper/70">
            {Math.round(progress)}% - {isComplete ? 'Complete!' : 'Generating roast...'}
          </div>
        </div>

        {/* Loading Spinner */}
        {!isComplete && (
          <div className="flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-4 h-4 bg-saffron"
                animate={{
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>
        )}

        {/* Complete Message */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-headline font-bold text-3xl text-parrot-green"
          >
            ✅ Roast Ready!
          </motion.div>
        )}

        {/* Preview of roast text (hidden but processing) */}
        <div className="sr-only">{roastText}</div>
      </div>
    </div>
  );
}
