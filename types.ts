
export enum GameState {
  HOME = 'HOME',
  ROLE_SELECTION = 'ROLE_SELECTION',
  CHAPTER_SELECTION = 'CHAPTER_SELECTION',
  PLAYING = 'PLAYING',
  PUZZLE = 'PUZZLE',
  LEVEL_COMPLETE = 'LEVEL_COMPLETE',
  GAME_OVER = 'GAME_OVER',
  ABOUT = 'ABOUT'
}

export enum CloudRole {
  DIGITAL_LEADER = 'Cloud Digital Leader',
  CLOUD_ARCHITECT = 'Professional Cloud Architect',
  DATA_ENGINEER = 'Professional Data Engineer',
  SECURITY_ENGINEER = 'Professional Security Engineer'
}

export enum DifficultyLevel {
  EASY = 'EASY',
  NORMAL = 'NORMAL',
  HARD = 'HARD'
}

export type PuzzleType = 'CATCHER' | 'SORTER' | 'DEFENDER' | 'STACKER' | 'SILO' | 'LAB' | 'SHOOTER' | 'FIREWALL' | 'TRIAGE';

export interface Level {
  id: number;
  title: string;
  description: string;
  topic: string;
  difficulty: 'Foundational' | 'Professional';
  puzzleType: PuzzleType;
}

export interface Question {
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint?: string;
}

export interface RoleConfig {
  type: CloudRole;
  icon: string;
  description: string;
  color: string;
  accent: string;
  avatarPrompt: string;
  avatarBase64?: string;
}

// Added NotificationType export to fix external reference errors
export type NotificationType = 'INFO' | 'SUCCESS' | 'ERROR' | 'ACHIEVEMENT';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title: string;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  role: CloudRole;
  time?: string;
  date?: string;
  difficulty?: DifficultyLevel;
}
