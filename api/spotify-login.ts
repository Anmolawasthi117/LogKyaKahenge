import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Spotify OAuth Login — Redirects the user to Spotify's authorization page.
 * GET /api/spotify-login
 */
export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    const clientId = process.env.SPOTIFY_CLIENT_ID || process.env.VITE_SPOTIFY_CLIENT_ID;

    if (!clientId) {
        return res.status(500).json({ error: 'Spotify Client ID not configured' });
    }

    // Determine redirect URI based on environment
    const redirectUri =
        process.env.SPOTIFY_REDIRECT_URI ||
        `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}/api/spotify-callback`;

    // Scopes needed for fetching music taste data
    const scopes = [
        'user-read-private',
        'user-read-email',
        'user-top-read',
        'user-read-recently-played',
        'playlist-read-private',
    ].join(' ');

    // Generate a random state for CSRF protection
    const state = Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        scope: scopes,
        redirect_uri: redirectUri,
        state: state,
        show_dialog: 'true', // Always show the auth dialog
    });

    const spotifyAuthUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;

    return res.redirect(302, spotifyAuthUrl);
}
