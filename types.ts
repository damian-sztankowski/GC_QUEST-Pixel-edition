
export enum GameState {
  HOME = 'HOME',
  ROLE_SELECTION = 'ROLE_SELECTION',
  CHAPTER_SELECTION = 'CHAPTER_SELECTION',
  PLAYING = 'PLAYING',
  PUZZLE = 'PUZZLE',
  LEVEL_COMPLETE = 'LEVEL_COMPLETE',
  GAME_OVER = 'GAME_OVER',
  LEADERBOARD = 'LEADERBOARD',
  ABOUT = 'ABOUT'
}

export enum CloudRole {
  DIGITAL_LEADER = 'Cloud Digital Leader'
}

export enum DifficultyLevel {
  EASY = 'EASY',
  NORMAL = 'NORMAL',
  HARD = 'HARD'
}

export type PuzzleType = 'CATCHER' | 'SORTER' | 'DEFENDER';

export interface Level {
  id: number;
  title: string;
  description: string;
  topic: string;
  difficulty: 'Foundational';
  puzzleType: PuzzleType;
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

export interface PuzzleGame {
  id: string;
  title: string;
  instructions: string;
  type: 'SORTER' | 'CONNECTOR' | 'DEFENDER';
}

export type NotificationType = 'INFO' | 'SUCCESS' | 'ERROR' | 'ACHIEVEMENT';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title: string;
}