import type { ChessData } from '../types';

export async function fetchChessData(username: string): Promise<ChessData> {
    try {
        // Fetch player profile
        const profileResponse = await fetch(`https://api.chess.com/pub/player/${username}`);

        if (!profileResponse.ok) {
            if (profileResponse.status === 404) {
                throw new Error('Chess.com profile not found');
            }
            throw new Error('Failed to fetch Chess.com profile');
        }

        const profileData = await profileResponse.json();

        // Fetch player stats
        const statsResponse = await fetch(`https://api.chess.com/pub/player/${username}/stats`);
        const statsData = statsResponse.ok ? await statsResponse.json() : {};

        // Extract ratings with fallbacks
        const getRating = (mode: 'chess_rapid' | 'chess_blitz' | 'chess_bullet') => {
            return statsData[mode]?.last?.rating || 0;
        };

        const getRecord = (mode: 'chess_rapid' | 'chess_blitz' | 'chess_bullet') => {
            const record = statsData[mode]?.record || {};
            return {
                wins: record.win || 0,
                losses: record.loss || 0,
                draws: record.draw || 0,
            };
        };

        // Aggregate wins/losses across all modes
        const rapidRecord = getRecord('chess_rapid');
        const blitzRecord = getRecord('chess_blitz');
        const bulletRecord = getRecord('chess_bullet');

        const totalWins = rapidRecord.wins + blitzRecord.wins + bulletRecord.wins;
        const totalLosses = rapidRecord.losses + blitzRecord.losses + bulletRecord.losses;
        const totalDraws = rapidRecord.draws + blitzRecord.draws + bulletRecord.draws;

        return {
            username: profileData.username,
            avatar: profileData.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
            rapidRating: getRating('chess_rapid'),
            blitzRating: getRating('chess_blitz'),
            bulletRating: getRating('chess_bullet'),
            wins: totalWins,
            losses: totalLosses,
            draws: totalDraws,
        };
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Failed to fetch Chess.com data');
    }
}
