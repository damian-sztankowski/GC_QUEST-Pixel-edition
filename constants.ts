
import { CloudRole, Level, RoleConfig, DifficultyLevel } from './types';

export const ROLES: RoleConfig[] = [
  {
    type: CloudRole.DIGITAL_LEADER,
    icon: 'HERO',
    description: 'The young adept of the cloud. Master business value, data, and infrastructure in a retro 16-bit environment.',
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
    description: 'Why choose Google Cloud for digital transformation? Key concepts: cloud vs on-prem, cloud-native, open source standards. Benefits: scalability, flexibility, agility, security, strategic value. Infrastructure models: public, private, hybrid, and multicloud. Implications of non-adoption. Financials: CapEx to OpEx shift, Total Cost of Ownership (TCO). Networking basics: IP, DNS, regions, zones, latency, and bandwidth. Service models: IaaS, PaaS, SaaS benefits and trade-offs. Shared Responsibility Model for provider vs customer.', 
    topic: 'Section 1: Digital Transformation with Google Cloud', 
    difficulty: 'Foundational',
    puzzleType: 'CATCHER'
  },
  { 
    id: 2, 
    title: 'Data Transformation', 
    description: 'The value of data and its role in digital transformation. Data types: structured vs unstructured. Storage types: Databases, Data Warehouses, and Data Lakes. Google Cloud SQL vs Spanner vs Bigtable. Large scale analytics with BigQuery. Real-time streaming with Pub/Sub and Dataflow. Data visualization and business intelligence with Looker. Benefits of managed data services for agility and cost-efficiency.', 
    topic: 'Section 2: Exploring Data Transformation with Google Cloud', 
    difficulty: 'Foundational',
    puzzleType: 'SORTER'
  },
  { 
    id: 3, 
    title: 'AI & Machine Learning', 
    description: 'AI vs ML fundamentals. Selecting the right solution: Pre-trained APIs (Vision, Translation, Speech) vs AutoML for custom labels vs Vertex AI for custom models. Infrastructure for ML: GPUs and TPUs. Building, deploying, and managing ML models on Vertex AI. The role of BigQuery ML for SQL-based models. Responsible AI principles and ethics in cloud innovation.', 
    topic: 'Section 3: Innovating with Google Cloud Artificial Intelligence', 
    difficulty: 'Foundational',
    puzzleType: 'DEFENDER'
  },
  { 
    id: 4, 
    title: 'Modernizing Infrastructure', 
    description: 'Legacy vs Modernized Infrastructure. Compute options: Virtual Machines (Compute Engine), Containers (GKE), and Serverless (Cloud Run, Cloud Functions). Migration strategies: Rehost (Lift & Shift), Replatform, and Rearchitect. Benefits of App Modernization and CI/CD pipelines. Managing hybrid/multicloud with Anthos and GKE Enterprise. API management with Apigee to unlock legacy value.', 
    topic: 'Section 4: Modernize Infrastructure and Applications with Google Cloud', 
    difficulty: 'Foundational',
    puzzleType: 'CATCHER'
  },
  { 
    id: 5, 
    title: 'Trust and Security', 
    description: 'Security in the cloud: Defense in Depth and Zero Trust. Google Trusted Infrastructure: data encryption at rest and in transit. Shared Responsibility for security. IAM (Identity and Access Management) and the Principle of Least Privilege. Cloud Armor for DDoS protection. Compliance standards (GDPR, HIPAA). Data sovereignty and residency. Google’s Trust Principles: your data is yours.', 
    topic: 'Section 5: Trust and Security with Google Cloud', 
    difficulty: 'Foundational',
    puzzleType: 'SORTER'
  },
  { 
    id: 6, 
    title: 'Scaling & Operations', 
    description: 'Financial governance and cost management in the cloud. Google Cloud Resource Hierarchy (Org > Folder > Project > Resource). Billing reports, quotas, and budgets. Operational excellence: DevOps and Site Reliability Engineering (SRE). Reliability metrics: SLIs, SLOs, and SLAs. Error budgets and post-mortems. Google Cloud Sustainability: carbon-neutral goals, carbon-free energy, and net-zero emissions.', 
    topic: 'Section 6: Scaling with Google Cloud Operations', 
    difficulty: 'Foundational',
    puzzleType: 'DEFENDER'
  }
];