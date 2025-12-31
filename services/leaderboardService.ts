
import { CloudRole, LeaderboardEntry, DifficultyLevel } from '../types';

const LEADERBOARD_KEY = 'pixel_cloud_escape_scores';

const LEGACY_HEROES: LeaderboardEntry[] = [
  { name: 'PIXEL_KING', score: 9999, role: CloudRole.DIGITAL_LEADER, time: '05:22', date: new Date(2024, 0, 1).toISOString() },
  { name: 'RETRO_CLOUD', score: 8500, role: CloudRole.DIGITAL_LEADER, time: '06:45', date: new Date(2024, 0, 1).toISOString() },
  { name: 'BIT_QUESTER', score: 7200, role: CloudRole.DIGITAL_LEADER, time: '07:12', date: new Date(2024, 0, 1).toISOString() },
  { name: 'CDL_HERO', score: 6400, role: CloudRole.DIGITAL_LEADER, time: '08:50', date: new Date(2024, 0, 1).toISOString() }
];

export const leaderboardService = {
  getScores: (): LeaderboardEntry[] => {
    const stored = localStorage.getItem(LEADERBOARD_KEY);
    const userScores: LeaderboardEntry[] = stored ? JSON.parse(stored) : [];
    
    // Merge user scores with legacy heroes and sort
    const allScores = [...userScores, ...LEGACY_HEROES];
    return allScores.sort((a, b) => b.score - a.score).slice(0, 10);
  },

  saveScore: (entry: LeaderboardEntry): void => {
    const stored = localStorage.getItem(LEADERBOARD_KEY);
    const userScores: LeaderboardEntry[] = stored ? JSON.parse(stored) : [];
    
    userScores.push({
      ...entry,
      date: new Date().toISOString()
    });
    
    // Sort and keep top 50 user scores locally
    const updated = userScores.sort((a, b) => b.score - a.score).slice(0, 50);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updated));
  },

  clearScores: (): void => {
    localStorage.removeItem(LEADERBOARD_KEY);
  }
};