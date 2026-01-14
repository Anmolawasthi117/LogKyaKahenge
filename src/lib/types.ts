// Platform and Persona Types for LogKyaKahenge

export type Persona = 'khadoos-baap' | 'desi-aunty' | 'gen-z-kid' | 'therapist';

export interface PersonaInfo {
    id: Persona;
    name: string;
    nameHindi: string;
    description: string;
    avatar: string;
    color: string;
    bgGradient: string;
    vibe: string;
}

export type Platform = 'github' | 'chess' | 'leetcode' | 'spotify' | 'reddit' | 'behance';

export interface PlatformInfo {
    id: Platform;
    name: string;
    icon: string;
    color: string;
    placeholder: string;
    comingSoon?: boolean;
}

// API Response Types
export interface GitHubData {
    username: string;
    name: string;
    avatar: string;
    bio: string | null;
    publicRepos: number;
    followers: number;
    following: number;
    totalStars: number;
    topLanguages: string[];
    createdAt: string;
}

export interface ChessData {
    username: string;
    avatar: string;
    rapidRating: number;
    blitzRating: number;
    bulletRating: number;
    wins: number;
    losses: number;
    draws: number;
}

export interface LeetCodeData {
    username: string;
    avatar: string;
    ranking: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    totalSolved: number;
    acceptanceRate: number;
}

export interface SpotifyData {
    displayName: string;
    avatar: string;
    topArtists: string[];
    topTracks: string[];
    totalPlaylists: number;
}

export interface RedditData {
    username: string;
    avatar: string;
    karma: number;
    postKarma: number;
    commentKarma: number;
    accountAge: string;
    topSubreddits: string[];
}

export interface BehanceData {
    username: string;
    avatar: string;
    displayName: string;
    projectCount: number;
    appreciations: number;
    followers: number;
    views: number;
}

export type PlatformData = {
    github?: GitHubData;
    chess?: ChessData;
    leetcode?: LeetCodeData;
    spotify?: SpotifyData;
    reddit?: RedditData;
    behance?: BehanceData;
};

export interface RoastResult {
    id: string;
    persona: Persona;
    platforms: Platform[];
    roastText: string;
    signatureLine: string;
    burnLevel: number; // 0-100
    createdAt: Date;
    userAvatars: string[];
}

// Store State Types
export interface AppState {
    // Persona selection
    selectedPersona: Persona | null;
    setSelectedPersona: (persona: Persona | null) => void;

    // Platform data
    platformUsernames: Partial<Record<Platform, string>>;
    setPlatformUsername: (platform: Platform, username: string) => void;

    platformData: PlatformData;
    setPlatformData: (platform: Platform, data: unknown) => void;
    clearPlatformData: () => void;

    // Loading states
    loadingPlatforms: Platform[];
    setLoadingPlatform: (platform: Platform, loading: boolean) => void;

    verifiedPlatforms: Platform[];
    setVerifiedPlatform: (platform: Platform, verified: boolean) => void;

    // Roast state
    isRoasting: boolean;
    setIsRoasting: (roasting: boolean) => void;

    currentRoast: RoastResult | null;
    setCurrentRoast: (roast: RoastResult | null) => void;

    roastHistory: RoastResult[];
    addToRoastHistory: (roast: RoastResult) => void;

    // Error handling
    errors: Partial<Record<Platform, string>>;
    setError: (platform: Platform, error: string | null) => void;

    // Reset
    resetAll: () => void;
}
