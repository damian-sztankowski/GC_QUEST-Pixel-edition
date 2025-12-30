
import { CloudRole, Level, RoleConfig, DifficultyLevel } from './types';

export const ROLES: RoleConfig[] = [
  {
    type: CloudRole.DIGITAL_LEADER,
    icon: '☁️',
    description: 'The hero of the cloud. Master business value, data, and infrastructure in a retro 16-bit environment.',
    color: 'blue',
    avatarPrompt: '16-bit pixel art icon of a blue superhero cloud with a digital cape, solid black background, retro video game style, centered, high contrast, vibrant Google blue colors.'
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
    title: 'Digital Transformation', 
    description: '1.1 Business Transformation drivers, 1.2 Cloud concepts (CapEx/OpEx, TCO), 1.3 Computing Models (IaaS, PaaS, SaaS) and Shared Responsibility.', 
    topic: 'Section 1: Digital Transformation with Google Cloud', 
    difficulty: 'Foundational',
    puzzleType: 'CATCHER'
  },
  { 
    id: 2, 
    title: 'Data Transformation', 
    description: '2.1 Value of Data (Databases vs Warehouses vs Lakes), 2.2 Solutions (SQL, Spanner, Bigtable, BigQuery), 2.3 Analytics (Looker, Pub/Sub, Dataflow).', 
    topic: 'Section 2: Exploring Data Transformation with Google Cloud', 
    difficulty: 'Foundational',
    puzzleType: 'SORTER'
  },
  { 
    id: 3, 
    title: 'AI & Machine Learning', 
    description: '3.1 AI/ML Fundamentals, 3.2 Solution Selection (Pre-trained vs AutoML vs Custom), 3.3 Building (Vertex AI, BigQuery ML, TPUs).', 
    topic: 'Section 3: Innovating with Google Cloud Artificial Intelligence', 
    difficulty: 'Foundational',
    puzzleType: 'DEFENDER'
  },
  { 
    id: 4, 
    title: 'Modernizing Infrastructure', 
    description: '4.1 Migration (Lift/Shift, Refactor), 4.2 Compute (VMs, GKE, Serverless), 4.3 App Modernization (Cloud Run, Anthos/GKE Enterprise), 4.5 APIs (Apigee).', 
    topic: 'Section 4: Modernize Infrastructure and Applications with Google Cloud', 
    difficulty: 'Foundational',
    puzzleType: 'CATCHER'
  },
  { 
    id: 5, 
    title: 'Trust and Security', 
    description: '5.1 Cloud Security concepts, 5.2 Google Trusted Infrastructure (IAM, Encryption, Cloud Armor), 5.3 Compliance and Trust Principles.', 
    topic: 'Section 5: Trust and Security with Google Cloud', 
    difficulty: 'Foundational',
    puzzleType: 'SORTER'
  },
  { 
    id: 6, 
    title: 'Scaling & Operations', 
    description: '6.1 Financial Governance (Cost Mgmt, Budgets), 6.2 Operational Excellence (SRE, DevOps, SRE terms), 6.3 Sustainability goals.', 
    topic: 'Section 6: Scaling with Google Cloud Operations', 
    difficulty: 'Foundational',
    puzzleType: 'DEFENDER'
  }
];

export const MOCK_LEADERBOARD = [
  { name: 'PIXEL_KING', score: 9999, role: CloudRole.DIGITAL_LEADER, time: '05:22' },
  { name: 'RETRO_CLOUD', score: 8500, role: CloudRole.DIGITAL_LEADER, time: '06:45' },
  { name: 'BIT_QUESTER', score: 7200, role: CloudRole.DIGITAL_LEADER, time: '07:12' },
  { name: 'CDL_HERO', score: 6400, role: CloudRole.DIGITAL_LEADER, time: '08:50' }
];