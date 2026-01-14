import type { GitHubData } from '../types';

export async function fetchGitHubData(username: string): Promise<GitHubData> {
    try {
        // Fetch user profile
        const userResponse = await fetch(`https://api.github.com/users/${username}`);

        if (!userResponse.ok) {
            if (userResponse.status === 404) {
                throw new Error('User not found. Check your username.');
            }
            throw new Error('Failed to fetch GitHub profile');
        }

        const userData = await userResponse.json();

        // Fetch repos to calculate stars and languages
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
        const repos = reposResponse.ok ? await reposResponse.json() : [];

        // Calculate total stars
        const totalStars = repos.reduce((acc: number, repo: { stargazers_count: number }) =>
            acc + (repo.stargazers_count || 0), 0
        );

        // Get top languages
        const languageCount: Record<string, number> = {};
        repos.forEach((repo: { language: string | null }) => {
            if (repo.language) {
                languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
            }
        });

        const topLanguages = Object.entries(languageCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([lang]) => lang);

        return {
            username: userData.login,
            name: userData.name || userData.login,
            avatar: userData.avatar_url,
            bio: userData.bio,
            publicRepos: userData.public_repos,
            followers: userData.followers,
            following: userData.following,
            totalStars,
            topLanguages,
            createdAt: userData.created_at,
        };
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Failed to fetch GitHub data');
    }
}
