
export enum GameState {
  HOME = 'HOME',
  ROLE_SELECTION = 'ROLE_SELECTION',
  PLAYING = 'PLAYING',
  LEVEL_COMPLETE = 'LEVEL_COMPLETE',
  GAME_OVER = 'GAME_OVER',
  LEADERBOARD = 'LEADERBOARD'
}

export enum CloudRole {
  DIGITAL_LEADER = 'Cloud Digital Leader'
}

export interface Level {
  id: number;
  title: string;
  description: string;
  topic: string;
  difficulty: 'Foundational';
}

export interface Question {
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  role: CloudRole;
  time: string;
}

export interface RoleConfig {
  type: CloudRole;
  icon: string;
  description: string;
  color: string;
  avatarPrompt: string;
  avatarBase64?: string;
}
