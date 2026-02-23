import type { SpotifyData } from '../types';

/**
 * Spotify OAuth flow helper.
 * Unlike other scrapers, Spotify uses OAuth — no direct API calls from the frontend.
 * The serverless functions handle the full flow.
 */

/**
 * Initiates the Spotify login flow by redirecting to our serverless function.
 */
export function initiateSpotifyLogin(): void {
    window.location.href = '/api/spotify-login';
}

/**
 * Parses the base64url-encoded Spotify data returned by the callback.
 */
export function parseSpotifyCallback(encodedData: string): SpotifyData {
    try {
        const jsonString = atob(encodedData.replace(/-/g, '+').replace(/_/g, '/'));
        const data = JSON.parse(jsonString);

        return {
            displayName: data.displayName || 'Unknown',
            avatar: data.avatar || '',
            topArtists: data.topArtists || [],
            topTracks: data.topTracks || [],
            totalPlaylists: data.totalPlaylists || 0,
            playlistNames: data.playlistNames || [],
            recentlyPlayed: data.recentlyPlayed || [],
            topGenres: data.topGenres || [],
        };
    } catch (error) {
        console.error('Failed to parse Spotify callback data:', error);
        throw new Error('Failed to parse Spotify data. Please try connecting again.');
    }
}
