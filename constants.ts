
import { CloudRole, Level, RoleConfig, DifficultyLevel } from './types';

export const ROLES: RoleConfig[] = [
  {
    type: CloudRole.DIGITAL_LEADER,
    icon: 'HERO_BLUE',
    description: 'Master business value and foundational infrastructure. The perfect start for cloud novices.',
    color: 'blue',
    accent: '#4285F4',
    avatarPrompt: '16-bit pixel art of a blue futuristic digital explorer, solid black background, retro video game style.'
  }
];

export const DIFFICULTY_SETTINGS = {
  [DifficultyLevel.EASY]: {
    timeMultiplier: 1.5,
    scoreMultiplier: 0.75,
    speedMultiplier: 0.7,
    timeBonus: 15,
    label: 'JUNIOR_ADMIN'
  },
  [DifficultyLevel.NORMAL]: {
    timeMultiplier: 1.0,
    scoreMultiplier: 1.0,
    speedMultiplier: 1.0,
    timeBonus: 8,
    label: 'CLOUD_ARCHITECT'
  },
  [DifficultyLevel.HARD]: {
    timeMultiplier: 0.6,
    scoreMultiplier: 2.0,
    speedMultiplier: 1.5,
    timeBonus: 4,
    label: 'SRE_LEGEND'
  }
};

export const LEVELS: Level[] = [
  { 
    id: 1, 
    title: 'Digital Core', 
    description: 'Cloud value proposition, on-prem vs cloud, CapEx to OpEx, and shared responsibility.', 
    topic: 'Digital Transformation & Shared Responsibility', 
    difficulty: 'Foundational',
    puzzleType: 'TRIAGE'
  },
  { 
    id: 2, 
    title: 'Data Silos', 
    description: 'Structured vs Unstructured data, Cloud SQL vs Spanner vs Bigtable, and BigQuery analytics.', 
    topic: 'Data Storage & Analytics', 
    difficulty: 'Foundational',
    puzzleType: 'SILO'
  },
  { 
    id: 3, 
    title: 'Neural Lab', 
    description: 'Vertex AI, Pre-trained APIs, AutoML, and the custom model lifecycle.', 
    topic: 'AI & Machine Learning', 
    difficulty: 'Foundational',
    puzzleType: 'LAB'
  },
  { 
    id: 4, 
    title: 'Compute Node', 
    description: 'VMs, GKE, Cloud Run, and Serverless modernization strategies.', 
    topic: 'Modernizing Infrastructure', 
    difficulty: 'Foundational',
    puzzleType: 'SHOOTER'
  },
  { 
    id: 5, 
    title: 'Zero Trust Gate', 
    description: 'IAM roles, Cloud Armor, Identity-Aware Proxy, and defense in depth.', 
    topic: 'Trust and Security', 
    difficulty: 'Foundational',
    puzzleType: 'FIREWALL'
  },
  { 
    id: 6, 
    title: 'Global Hierarchy', 
    description: 'Org structure, folders, projects, and resource billing governance.', 
    topic: 'Scaling & Operations Hierarchy', 
    difficulty: 'Foundational',
    puzzleType: 'STACKER'
  }
];
