import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Spotify OAuth Callback — Exchanges the auth code for a token,
 * fetches user's music data, and redirects back to the app.
 * GET /api/spotify-callback?code=XXX&state=YYY
 */

interface SpotifyArtist {
    name: string;
    genres: string[];
}

interface SpotifyTrack {
    name: string;
    artists: { name: string }[];
}

interface SpotifyPlaylist {
    name: string;
}

interface SpotifyRecentItem {
    track: {
        name: string;
        artists: { name: string }[];
    };
}

async function exchangeCodeForToken(code: string, redirectUri: string): Promise<string> {
    const clientId = process.env.SPOTIFY_CLIENT_ID || process.env.VITE_SPOTIFY_CLIENT_ID || '';
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET || process.env.VITE_SPOTIFY_CLIENT_SECRET || '';

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Token exchange failed: ${error}`);
    }

    const data = await response.json();
    return data.access_token;
}

async function fetchSpotifyApi(token: string, endpoint: string): Promise<any> {
    const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        console.error(`Spotify API error for ${endpoint}:`, response.status);
        return null;
    }

    return response.json();
}

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    const { code, error: spotifyError } = req.query;

    // Determine the app's origin for redirecting back
    const origin = `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}`;

    if (spotifyError || !code) {
        // User denied access or an error occurred
        return res.redirect(302, `${origin}/evidence?spotify_error=${spotifyError || 'no_code'}`);
    }

    try {
        const redirectUri =
            process.env.SPOTIFY_REDIRECT_URI ||
            `${origin}/api/spotify-callback`;

        // 1. Exchange code for access token
        const accessToken = await exchangeCodeForToken(code as string, redirectUri);

        // 2. Fetch all data in parallel
        const [profile, topArtists, topTracks, recentlyPlayed, playlists] = await Promise.all([
            fetchSpotifyApi(accessToken, '/me'),
            fetchSpotifyApi(accessToken, '/me/top/artists?limit=10&time_range=medium_term'),
            fetchSpotifyApi(accessToken, '/me/top/tracks?limit=10&time_range=medium_term'),
            fetchSpotifyApi(accessToken, '/me/player/recently-played?limit=20'),
            fetchSpotifyApi(accessToken, '/me/playlists?limit=50'),
        ]);

        // 3. Build SpotifyData object
        const artistItems: SpotifyArtist[] = topArtists?.items || [];
        const trackItems: SpotifyTrack[] = topTracks?.items || [];
        const recentItems: SpotifyRecentItem[] = recentlyPlayed?.items || [];
        const playlistItems: SpotifyPlaylist[] = playlists?.items || [];

        // Extract top genres from artists
        const genreCount: Record<string, number> = {};
        artistItems.forEach((artist) => {
            artist.genres?.forEach((genre) => {
                genreCount[genre] = (genreCount[genre] || 0) + 1;
            });
        });
        const topGenres = Object.entries(genreCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([genre]) => genre);

        const spotifyData = {
            displayName: profile?.display_name || 'Unknown',
            avatar: profile?.images?.[0]?.url || '',
            topArtists: artistItems.map((a) => a.name),
            topTracks: trackItems.map((t) => `${t.name} - ${t.artists.map((a) => a.name).join(', ')}`),
            totalPlaylists: playlists?.total || 0,
            playlistNames: playlistItems.map((p) => p.name),
            recentlyPlayed: recentItems
                .map((item) => `${item.track.name} - ${item.track.artists.map((a) => a.name).join(', ')}`)
                .filter((v, i, a) => a.indexOf(v) === i) // deduplicate
                .slice(0, 10),
            topGenres,
        };

        // 4. Encode data and redirect back to app
        const encodedData = Buffer.from(JSON.stringify(spotifyData)).toString('base64url');

        return res.redirect(302, `${origin}/evidence?spotify_data=${encodedData}`);
    } catch (err) {
        console.error('Spotify callback error:', err);
        return res.redirect(302, `${origin}/evidence?spotify_error=fetch_failed`);
    }
}
