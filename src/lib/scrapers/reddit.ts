import type { RedditData } from '../types';

export async function fetchRedditData(username: string): Promise<RedditData> {
    try {
        // Reddit's public API - note: may be blocked by CORS in browser
        const response = await fetch(`https://www.reddit.com/user/${username}/about.json`, {
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Reddit user not found');
            }
            throw new Error('Failed to fetch Reddit profile');
        }

        const data = await response.json();
        const userData = data.data;

        // Calculate account age
        const createdUtc = userData.created_utc;
        const accountAgeMs = Date.now() - createdUtc * 1000;
        const years = Math.floor(accountAgeMs / (365.25 * 24 * 60 * 60 * 1000));
        const months = Math.floor((accountAgeMs % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000));
        const accountAge = years > 0 ? `${years}y ${months}m` : `${months}m`;

        return {
            username: userData.name,
            avatar: userData.icon_img?.split('?')[0] || `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
            karma: userData.total_karma || (userData.link_karma + userData.comment_karma),
            postKarma: userData.link_karma,
            commentKarma: userData.comment_karma,
            accountAge,
            topSubreddits: [], // Would require additional scraping
        };
    } catch (error) {
        if (error instanceof Error && error.message.includes('not found')) {
            throw error;
        }
        // Provide fallback error for CORS issues
        throw new Error('Unable to verify Reddit profile (CORS restriction)');
    }
}
