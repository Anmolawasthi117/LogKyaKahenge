import type { PersonaInfo, PlatformInfo } from './types';

// Import persona avatar images
import tanaShahAvatar from '../assets/Tana shah.png';
import pinkyAuntyAvatar from '../assets/Pinky aunty.png';
import deluluDivyaAvatar from '../assets/Delulu Divya.png';
import drDimagAvatar from '../assets/Dr. Dimag-Chatterjee.png';

export const PERSONAS: PersonaInfo[] = [
    {
        id: 'khadoos-baap',
        name: 'Tana Shah',
        nameHindi: 'The Strict Dad',
        description: 'The strict father who is perpetually disappointed. Every achievement is "not enough."',
        avatar: tanaShahAvatar,
        color: '#8B4513',
        bgGradient: 'linear-gradient(135deg, #D2691E 0%, #8B4513 100%)',
        vibe: 'Stern, Disappointed, Old-School',
    },
    {
        id: 'desi-aunty',
        name: 'Pinky Aunty',
        nameHindi: 'The Nosy Aunty',
        description: 'The neighborhood gossip queen. Compares you to Sharma ji\'s son since 1995.',
        avatar: pinkyAuntyAvatar,
        color: '#FF69B4',
        bgGradient: 'linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%)',
        vibe: 'Judgmental, Nosy, Gold-obsessed',
    },
    {
        id: 'gen-z-kid',
        name: 'Delulu Divya',
        nameHindi: 'The Gen Z Roaster',
        description: 'Speaks fluent brainrot. Will call you "cheugy" and mean it as an insult.',
        avatar: deluluDivyaAvatar,
        color: '#00FF00',
        bgGradient: 'linear-gradient(135deg, #39FF14 0%, #00FF00 100%)',
        vibe: 'Unhinged, Slang-heavy, Chaotic',
    },
    {
        id: 'therapist',
        name: 'Dr. Dimag',
        nameHindi: 'Unpaid Therapist',
        description: 'Professional coldness. Diagnoses your failures with clinical precision.',
        avatar: drDimagAvatar,
        color: '#4169E1',
        bgGradient: 'linear-gradient(135deg, #6495ED 0%, #4169E1 100%)',
        vibe: 'Cold, Clinical, Savage',
    },
];

export const PLATFORMS: PlatformInfo[] = [
    {
        id: 'github',
        name: 'GitHub',
        icon: '🐙',
        color: '#333333',
        placeholder: 'username',
    },
    {
        id: 'chess',
        name: 'Chess.com',
        icon: '♟️',
        color: '#769656',
        placeholder: 'username',
    },
    {
        id: 'leetcode',
        name: 'LeetCode',
        icon: '💻',
        color: '#FFA116',
        placeholder: 'username',
    },
    {
        id: 'spotify',
        name: 'Spotify',
        icon: '🎵',
        color: '#1DB954',
        placeholder: 'Coming Soon',
        comingSoon: true,
    },
    {
        id: 'reddit',
        name: 'Reddit',
        icon: '🤖',
        color: '#FF4500',
        placeholder: 'username (without u/)',
    },
    {
        id: 'behance',
        name: 'Behance',
        icon: '🎨',
        color: '#1769FF',
        placeholder: 'Coming Soon',
        comingSoon: true,
    },
];

// Burn level labels
export const BURN_LEVELS = [
    { min: 0, max: 25, label: 'Light Sizzle', emoji: '🔥' },
    { min: 25, max: 50, label: 'Nicely Toasted', emoji: '🔥🔥' },
    { min: 50, max: 75, label: 'Burnt to Crisp', emoji: '🔥🔥🔥' },
    { min: 75, max: 100, label: 'Maximum Destruction', emoji: '💀🔥' },
];

// Random savage titles for high burn levels (90-100)
export const SAVAGE_TITLES = [
    'Absolutely Annihilated',
    'Soul Crusher',
    'No Survivors',
    'Total Devastation',
    'Beyond Recovery',
    'Emotional Damage',
    'Family Dishonor',
    'Career Ended',
    'Reality Check',
    'Digital Cremation',
];

// Sample ticker roasts for the humiliation ticker
export const SAMPLE_ROASTS = [
    "GitHub pe 50 repos hai par 0 stars... repo nahi, graveyard hai 💀",
    "Chess.com pe 1200 rating? Bhai tuition ke marks bhi isse zyada the 😭",
    "LeetCode easy solve karke LinkedIn pe celebrate karta hai... sab dekh rahe hain bhai",
    "Spotify wrapped mein sirf sad songs? Therapist ki fees bachao, music hai tumhara 🎵",
    "Reddit karma 500? Real life mein bhi teri baat koi nahi sunta lagta hai 🤖",
    "Behance pe 3 projects? Designer nahi, Canva premium user hai tu 🎨",
    "GitHub green squares sab gray... depression nahi, laziness hai ye 💚➡️⬜",
    "Chess blitz rating tera IQ se kam hai... aur IQ bhi kuch khaas nahi 🧠",
];
