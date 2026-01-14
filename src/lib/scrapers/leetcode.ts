import type { LeetCodeData } from '../types';

// Using LeetCode Stats API - a public CORS-enabled API
// Multiple fallback APIs for reliability
const LEETCODE_APIS = [
  'https://leetcode-stats-api.herokuapp.com',
  'https://leetcode-api-faisalshohag.vercel.app',
];

export async function fetchLeetCodeData(username: string): Promise<LeetCodeData> {
  // Try each API endpoint
  for (const apiBase of LEETCODE_APIS) {
    try {
      const response = await fetch(`${apiBase}/${username}`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      // Handle rate limiting - wait and retry
      if (response.status === 429) {
        console.log(`Rate limited by ${apiBase}, trying next...`);
        continue;
      }

      if (response.status === 404) {
        throw new Error('LeetCode user not found');
      }

      if (!response.ok) {
        console.log(`API ${apiBase} returned ${response.status}, trying next...`);
        continue;
      }

      const data = await response.json();

      // Check if valid response
      if (data.status === 'error' || data.message === 'user does not exist') {
        throw new Error('LeetCode user not found');
      }

      // Parse the response (different APIs have slightly different formats)
      const easySolved = data.easySolved || data.easy || 0;
      const mediumSolved = data.mediumSolved || data.medium || 0;
      const hardSolved = data.hardSolved || data.hard || 0;
      const totalSolved = data.totalSolved || (easySolved + mediumSolved + hardSolved);

      return {
        username: username,
        avatar: `https://api.dicebear.com/7.x/thumbs/svg?seed=${username}&backgroundColor=FF4D00`,
        ranking: data.ranking || 0,
        easySolved,
        mediumSolved,
        hardSolved,
        totalSolved,
        acceptanceRate: data.acceptanceRate || 0,
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        throw error; // Re-throw user not found errors immediately
      }
      console.log(`API ${apiBase} failed:`, error);
    }
  }

  // If all APIs failed, allow user to proceed with manual entry simulation
  // This creates a "manual verification" that allows roasting to continue
  console.warn('All LeetCode APIs failed, using manual mode');

  // Return mock data so user can still proceed
  return {
    username: username,
    avatar: `https://api.dicebear.com/7.x/thumbs/svg?seed=${username}&backgroundColor=FF4D00`,
    ranking: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    totalSolved: 0,
    acceptanceRate: 0,
  };
}
