import type { VercelRequest, VercelResponse } from '@vercel/node';

const KV_REST_API_URL = process.env.KV_REST_API_URL;
const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN;

const VIEWS_KEY = 'site_views';
const INITIAL_VIEWS = 100;

async function getViews(): Promise<number> {
    if (!KV_REST_API_URL || !KV_REST_API_TOKEN) {
        console.warn('KV credentials not configured');
        return INITIAL_VIEWS;
    }

    try {
        const response = await fetch(`${KV_REST_API_URL}/get/${VIEWS_KEY}`, {
            headers: {
                Authorization: `Bearer ${KV_REST_API_TOKEN}`,
            },
        });

        const data = await response.json();

        if (data.result === null) {
            // Key doesn't exist, initialize it
            await setViews(INITIAL_VIEWS);
            return INITIAL_VIEWS;
        }

        return parseInt(data.result, 10) || INITIAL_VIEWS;
    } catch (error) {
        console.error('Failed to get views:', error);
        return INITIAL_VIEWS;
    }
}

async function setViews(count: number): Promise<void> {
    if (!KV_REST_API_URL || !KV_REST_API_TOKEN) {
        return;
    }

    try {
        await fetch(`${KV_REST_API_URL}/set/${VIEWS_KEY}/${count}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${KV_REST_API_TOKEN}`,
            },
        });
    } catch (error) {
        console.error('Failed to set views:', error);
    }
}

async function incrementViews(): Promise<number> {
    if (!KV_REST_API_URL || !KV_REST_API_TOKEN) {
        console.warn('KV credentials not configured');
        return INITIAL_VIEWS;
    }

    try {
        const response = await fetch(`${KV_REST_API_URL}/incr/${VIEWS_KEY}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${KV_REST_API_TOKEN}`,
            },
        });

        const data = await response.json();

        // If key didn't exist, INCR starts from 0, so we need to add our initial offset
        if (data.result === 1) {
            // First increment ever, set to initial + 1
            await setViews(INITIAL_VIEWS + 1);
            return INITIAL_VIEWS + 1;
        }

        return parseInt(data.result, 10) || INITIAL_VIEWS;
    } catch (error) {
        console.error('Failed to increment views:', error);
        return INITIAL_VIEWS;
    }
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

    try {
        if (req.method === 'POST') {
            // Increment and return new count
            const count = await incrementViews();
            return res.status(200).json({ count });
        } else {
            // GET - just return current count
            const count = await getViews();
            return res.status(200).json({ count });
        }
    } catch (error) {
        console.error('API error:', error);
        return res.status(500).json({ count: INITIAL_VIEWS, error: 'Failed to process request' });
    }
}
