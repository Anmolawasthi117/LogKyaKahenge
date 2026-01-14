import type { VercelRequest, VercelResponse } from '@vercel/node';

// Support both Vercel KV and Upstash Redis (must be REST API URLs starting with https://)
const rawUrl = process.env.UPSTASH_REDIS_REST_URL || '';
const rawToken = process.env.UPSTASH_REDIS_REST_TOKEN || '';

// Validate that URL is actually an HTTPS REST API URL (not redis:// protocol)
const isValidRestUrl = rawUrl.startsWith('https://');
const KV_REST_API_URL = isValidRestUrl ? rawUrl : null;
const KV_REST_API_TOKEN = isValidRestUrl ? rawToken : null;

const VIEWS_KEY = 'site_views';
const INITIAL_VIEWS = 100;

async function kvCommand(command: string[]): Promise<any> {
    if (!KV_REST_API_URL || !KV_REST_API_TOKEN) {
        return null;
    }

    try {
        const response = await fetch(KV_REST_API_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${KV_REST_API_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(command),
        });

        if (!response.ok) {
            console.error('Redis API error:', response.status);
            return null;
        }

        const data = await response.json();
        return data.result;
    } catch (error) {
        console.error('Redis fetch error:', error);
        return null;
    }
}

async function getViews(): Promise<number> {
    const result = await kvCommand(['GET', VIEWS_KEY]);

    if (result === null) {
        await setViews(INITIAL_VIEWS);
        return INITIAL_VIEWS;
    }

    return parseInt(result, 10) || INITIAL_VIEWS;
}

async function setViews(count: number): Promise<void> {
    await kvCommand(['SET', VIEWS_KEY, count.toString()]);
}

async function incrementViews(): Promise<number> {
    const currentResult = await kvCommand(['GET', VIEWS_KEY]);

    if (currentResult === null) {
        await setViews(INITIAL_VIEWS + 1);
        return INITIAL_VIEWS + 1;
    }

    const newValue = await kvCommand(['INCR', VIEWS_KEY]);

    if (newValue === null) {
        return parseInt(currentResult, 10) || INITIAL_VIEWS;
    }

    return parseInt(newValue, 10);
}

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // If no valid REST API configured, return default count
    if (!KV_REST_API_URL || !KV_REST_API_TOKEN) {
        return res.status(200).json({ count: INITIAL_VIEWS, configured: false });
    }

    try {
        if (req.method === 'POST') {
            const count = await incrementViews();
            return res.status(200).json({ count, configured: true });
        } else {
            const count = await getViews();
            return res.status(200).json({ count, configured: true });
        }
    } catch (error) {
        console.error('API error:', error);
        return res.status(200).json({ count: INITIAL_VIEWS, error: 'Failed to process request' });
    }
}
