
import { CloudRole, Level, RoleConfig } from './types';

export const ROLES: RoleConfig[] = [
  {
    type: CloudRole.DIGITAL_LEADER,
    icon: '☁️',
    description: 'The hero of the cloud. Master business value, data, and infrastructure in a retro 16-bit environment.',
    color: 'blue',
    avatarPrompt: '16-bit pixel art icon of a blue superhero cloud with a digital cape, solid black background, retro video game style, centered, high contrast, vibrant Google blue colors.'
  }
];

export const LEVELS: Level[] = [
  { 
    id: 1, 
    title: 'Digital Transformation', 
    description: 'Cloud concepts, business value of the cloud, and the shared responsibility model.', 
    topic: 'Section 1: Digital Transformation with Google Cloud', 
    difficulty: 'Foundational' 
  },
  { 
    id: 2, 
    title: 'Exploring Data Transformation', 
    description: 'Value of data, data migration, databases (SQL, Spanner, Bigtable), and data warehousing (BigQuery).', 
    topic: 'Section 2: Exploring Data Transformation with Google Cloud', 
    difficulty: 'Foundational' 
  },
  { 
    id: 3, 
    title: 'Innovating with AI', 
    description: 'Artificial Intelligence, Machine Learning, Generative AI, and Vertex AI foundational concepts.', 
    topic: 'Section 3: Innovating with Google Cloud Artificial Intelligence', 
    difficulty: 'Foundational' 
  },
  { 
    id: 4, 
    title: 'Modernizing Infrastructure', 
    description: 'Compute solutions (GCE, GKE, App Engine, Cloud Run), networking, and storage.', 
    topic: 'Section 4: Modernize Infrastructure and Applications with Google Cloud', 
    difficulty: 'Foundational' 
  },
  { 
    id: 5, 
    title: 'Trust and Security', 
    description: 'Identity and Access Management (IAM), data security, and compliance foundations.', 
    topic: 'Section 5: Trust and Security with Google Cloud', 
    difficulty: 'Foundational' 
  },
  { 
    id: 6, 
    title: 'Operations and Scaling', 
    description: 'Site Reliability Engineering (SRE), monitoring (Cloud Operations Suite), and cost management.', 
    topic: 'Section 6: Scaling with Google Cloud Operations', 
    difficulty: 'Foundational' 
  }
];

export const MOCK_LEADERBOARD = [
  { name: 'PIXEL_KING', score: 9999, role: CloudRole.DIGITAL_LEADER, time: '05:22' },
  { name: 'RETRO_CLOUD', score: 8500, role: CloudRole.DIGITAL_LEADER, time: '06:45' },
  { name: 'BIT_QUESTER', score: 7200, role: CloudRole.DIGITAL_LEADER, time: '07:12' },
  { name: 'CDL_HERO', score: 6400, role: CloudRole.DIGITAL_LEADER, time: '08:50' }
];
