import type { VercelRequest, VercelResponse } from '@vercel/node';

// Support both Vercel KV and Upstash Redis
const KV_REST_API_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

const VIEWS_KEY = 'site_views';
const INITIAL_VIEWS = 100;

async function kvCommand(command: string[]): Promise<any> {
    if (!KV_REST_API_URL || !KV_REST_API_TOKEN) {
        console.warn('Redis credentials not configured. Need KV_REST_API_URL/KV_REST_API_TOKEN or UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN');
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
            const text = await response.text();
            console.error('Redis API error:', response.status, text);
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
        // Key doesn't exist or error, initialize it
        await setViews(INITIAL_VIEWS);
        return INITIAL_VIEWS;
    }

    return parseInt(result, 10) || INITIAL_VIEWS;
}

async function setViews(count: number): Promise<void> {
    await kvCommand(['SET', VIEWS_KEY, count.toString()]);
}

async function incrementViews(): Promise<number> {
    // First check if key exists
    const currentResult = await kvCommand(['GET', VIEWS_KEY]);

    if (currentResult === null) {
        // Key doesn't exist, initialize with INITIAL_VIEWS + 1
        await setViews(INITIAL_VIEWS + 1);
        return INITIAL_VIEWS + 1;
    }

    // Key exists, increment it
    const newValue = await kvCommand(['INCR', VIEWS_KEY]);

    if (newValue === null) {
        // Fallback if INCR fails
        return parseInt(currentResult, 10) || INITIAL_VIEWS;
    }

    return parseInt(newValue, 10);
}

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Check if credentials are configured
    if (!KV_REST_API_URL || !KV_REST_API_TOKEN) {
        console.warn('Redis not configured, returning default count');
        return res.status(200).json({ count: INITIAL_VIEWS, configured: false });
    }

    try {
        if (req.method === 'POST') {
            // Increment and return new count
            const count = await incrementViews();
            return res.status(200).json({ count, configured: true });
        } else {
            // GET - just return current count
            const count = await getViews();
            return res.status(200).json({ count, configured: true });
        }
    } catch (error) {
        console.error('API error:', error);
        return res.status(200).json({ count: INITIAL_VIEWS, error: 'Failed to process request' });
    }
}
