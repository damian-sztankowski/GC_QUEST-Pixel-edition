
import { Question, DifficultyLevel } from '../types';

export const NORMAL_QUESTIONS: Record<number, Question[]> = {
  1: [ // Section 1: Digital Transformation
    { 
      text: "A company wants to focus on code and not manage OS patches. Which model is best?", 
      options: ["IaaS", "PaaS", "On-Premises", "Colocation"], 
      correctIndex: 1, 
      explanation: "PaaS (Platform as a Service) manages the runtime and OS, letting devs focus on code.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Platform for developers." 
    },
    { 
      text: "How does Google's [clue]global fiber network[/clue] benefit a multinational business?", 
      options: ["It lowers software licensing costs", "It reduces latency and improves reliability", "It automatically writes code", "It provides free storage"], 
      correctIndex: 1, 
      explanation: "A private global fiber network avoids the public internet, ensuring speed and consistent uptime.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Faster and more reliable." 
    },
    { 
      text: "What is a key risk for organizations that [clue]do not adopt[/clue] cloud technology?", 
      options: ["They save too much money", "They lose competitive advantage and agility", "They have too much security", "They cannot hire staff"], 
      correctIndex: 1, 
      explanation: "Failing to modernize leads to technical debt and inability to react to market changes.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Falling behind." 
    },
    { 
      text: "Why is [clue]Multicloud[/clue] a common strategy for enterprises?", 
      options: ["It is the cheapest option", "To avoid vendor lock-in and use best-of-breed services", "It simplifies security", "Google requires it"], 
      correctIndex: 1, 
      explanation: "Multicloud allows using specific strengths of different providers (e.g., Google AI + AWS Storage).", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Best of all worlds." 
    },
    { 
      text: "Which factor contributes most to a lower [clue]Total Cost of Ownership (TCO)[/clue] in the cloud?", 
      options: ["Cheaper hard drives", "Elimination of data center maintenance and staffing costs", "Slower internet speeds", "Using old software"], 
      correctIndex: 1, 
      explanation: "TCO savings come from removing the overhead of powering, cooling, and guarding physical servers.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Hidden costs of on-prem." 
    },
    { 
      text: "When is [clue]Private Cloud[/clue] typically preferred over Public Cloud?", 
      options: ["For cheapest hosting", "For strict regulatory requirements requiring total isolation", "For global scale", "For startup apps"], 
      correctIndex: 1, 
      explanation: "Private clouds offer dedicated resources for strict compliance needs, often at a higher cost.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Strict isolation." 
    },
    { 
      text: "Google Cloud's [clue]Transformation Cloud[/clue] framework includes 'Data Democratization'. What does this mean?", 
      options: ["Making data public", "Making data accessible and actionable for all employees", "Deleting data", "Selling data"], 
      correctIndex: 1, 
      explanation: "It empowers every employee to make data-driven decisions, not just data scientists.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Data for everyone." 
    },
    { 
      text: "In IaaS, the customer manages the [clue]_______[/clue], unlike in PaaS.", 
      options: ["Physical Network", "Operating System (OS)", "Data Center Security", "Hardware replacement"], 
      correctIndex: 1, 
      explanation: "In IaaS, you must patch and secure the OS. In PaaS, the provider does it.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Windows or Linux updates." 
    },
    { 
      text: "What is the role of [clue]DNS (Domain Name Server)[/clue] in cloud infrastructure?", 
      options: ["Storing files", "Translating human-readable names to IP addresses", "Encrypting data", "Cooling servers"], 
      correctIndex: 1, 
      explanation: "DNS directs users to the correct server IP when they type a website name.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Phonebook for the internet." 
    },
    { 
      text: "What defines [clue]Elasticity[/clue] vs Scalability?", 
      options: ["They are the same", "Elasticity helps during short-term spikes; Scalability is long-term growth", "Elasticity is manual", "Scalability is only for storage"], 
      correctIndex: 1, 
      explanation: "Elasticity is the ability to automatically expand/contract (breathing); Scalability is handling growth (getting bigger).", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Spikes vs Growth." 
    }
  ],
  2: [ // Section 2: Data Transformation
    { 
      text: "A gaming company needs a database that scales globally with [clue]strong consistency[/clue]. Choice?", 
      options: ["Cloud SQL", "Cloud Spanner", "BigQuery", "Memorystore"], 
      correctIndex: 1, 
      explanation: "Spanner is unique in providing global scalability with relational strong consistency.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Planet-scale SQL." 
    },
    { 
      text: "You have terabytes of [clue]IoT sensor data[/clue] arriving every second. Which database optimizes for high write throughput?", 
      options: ["Cloud Storage", "Cloud Bigtable", "Cloud SQL", "Firestore"], 
      correctIndex: 1, 
      explanation: "Bigtable is a wide-column NoSQL store designed for massive write/read throughput (IoT/AdTech).", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Big throughput." 
    },
    { 
      text: "Which tool allows you to build [clue]ETL pipelines[/clue] (Extract, Transform, Load) for both stream and batch data?", 
      options: ["Dataflow", "Dataprep", "Cloud Compose", "Pub/Sub"], 
      correctIndex: 0, 
      explanation: "Dataflow is a fully managed service for executing Apache Beam pipelines.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Flowing data." 
    },
    { 
      text: "Why choose [clue]Firestore[/clue] for a mobile app?", 
      options: ["It handles petabyte analytics", "It offers real-time offline sync and document storage", "It is an SQL database", "It is for cold storage"], 
      correctIndex: 1, 
      explanation: "Firestore is a NoSQL document DB optimized for mobile/web app development with offline capabilities.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Mobile backend." 
    },
    { 
      text: "How does [clue]Nearline[/clue] storage differ from Standard storage?", 
      options: ["It is faster", "It is cheaper for storage but has a 30-day minimum retention", "It deletes data automatically", "It is only for images"], 
      correctIndex: 1, 
      explanation: "Nearline is for data accessed roughly once a month (e.g., monthly backups).", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Near, but not hot." 
    },
    { 
      text: "What is the business value of [clue]Streaming Analytics[/clue] over Batch?", 
      options: ["Cheaper storage", "Ability to react to events/fraud in real-time", "Easier to code", "Better graphs"], 
      correctIndex: 1, 
      explanation: "Streaming allows immediate action (e.g., blocking a fraudulent transaction) as it happens.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Immediate reaction." 
    },
    { 
      text: "Which product is a managed [clue]MySQL / PostgreSQL[/clue] service for general web apps?", 
      options: ["Cloud SQL", "Spanner", "Bigtable", "BigQuery"], 
      correctIndex: 0, 
      explanation: "Cloud SQL manages traditional relational databases, handling backups and patching.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "The standard SQL choice." 
    },
    { 
      text: "To visualize BigQuery data [clue]without moving it[/clue], which tool integrates natively?", 
      options: ["Looker / Looker Studio", "Cloud Build", "Cloud Spanner", "Compute Engine"], 
      correctIndex: 0, 
      explanation: "Looker queries the data directly in the database (in-database architecture), ensuring real-time results.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Direct visualization." 
    },
    { 
      text: "What defines [clue]Unstructured Data[/clue]?", 
      options: ["It has a schema", "It does not fit into rows/columns (e.g., emails, videos, tweets)", "It is always small", "It is numeric only"], 
      correctIndex: 1, 
      explanation: "Unstructured data lacks a predefined data model, making it harder to analyze with traditional tools.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Messy data." 
    },
    { 
      text: "If you need to migrate an [clue]Oracle[/clue] database to GCP with minimal downtime, you might use:", 
      options: ["Database Migration Service (DMS)", "Transfer Appliance", "Copy Paste", "Cloud CDN"], 
      correctIndex: 0, 
      explanation: "DMS helps migrate databases to Cloud SQL or Spanner reliably.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Migration tool." 
    }
  ],
  3: [ // Section 3: Innovating with AI
    { 
      text: "You need to detect [clue]specific defective parts[/clue] unique to your manufacturing line. Which solution?", 
      options: ["Vision API", "AutoML Vision", "Cloud Translation", "Speech-to-Text"], 
      correctIndex: 1, 
      explanation: "The standard Vision API detects generic objects (like 'screw'), but AutoML learns *your* specific defects.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Custom data, no code." 
    },
    { 
      text: "A global app needs to translate user comments into English [clue]instantly[/clue]. Best choice?", 
      options: ["Hire translators", "Cloud Translation API", "AutoML Translation", "BigQuery ML"], 
      correctIndex: 1, 
      explanation: "The Pre-trained Translation API is instant, supports 100+ languages, and requires no training.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Ready-made translation." 
    },
    { 
      text: "Why choose [clue]Pre-trained APIs[/clue] over Custom Models?", 
      options: ["For higher accuracy on niche data", "For speed of deployment and low effort", "To spend more money", "To use TensorFlow"], 
      correctIndex: 1, 
      explanation: "Pre-trained APIs are ready to use immediately, requiring zero machine learning expertise.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Fastest implementation." 
    },
    { 
      text: "What allows BigQuery users to build models [clue]without exporting data[/clue]?", 
      options: ["BigQuery ML", "Dataflow", "Cloud Storage", "Pub/Sub"], 
      correctIndex: 0, 
      explanation: "BigQuery ML runs the model training directly inside the data warehouse, avoiding complex data movement.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "In-place ML." 
    },
    { 
      text: "When is [clue]Vertex AI (Custom Training)[/clue] the right choice?", 
      options: ["When you have no data", "When standard APIs and AutoML don't meet specific business needs", "When you want the cheapest option", "When you don't know Python"], 
      correctIndex: 1, 
      explanation: "Custom training is for when you need full control over the model architecture for maximum differentiation.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Maximum control." 
    },
    { 
      text: "What does [clue]Responsible AI[/clue] involve regarding 'Explainability'?", 
      options: ["Keeping the code secret", "Understanding why an AI model made a specific prediction", "Making the AI speak", "Using less electricity"], 
      correctIndex: 1, 
      explanation: "Explainability ensures humans can trust the AI's decisions by understanding the 'why'.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Glass box vs Black box." 
    },
    { 
      text: "A bank wants to predict [clue]customer churn[/clue] using their SQL database. Which tool is fastest?", 
      options: ["TensorFlow on TPU", "BigQuery ML", "Vision API", "App Engine"], 
      correctIndex: 1, 
      explanation: "Since the data is already in tables, BigQuery ML is the most efficient path to prediction.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "SQL prediction." 
    },
    { 
      text: "What allows [clue]unstructured data[/clue] (like emails) to be searchable and analyzable?", 
      options: ["Cloud SQL", "Natural Language API", "Cloud Monitoring", "VPC"], 
      correctIndex: 1, 
      explanation: "Natural Language API extracts entities, sentiment, and syntax from unstructured text.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Understanding text." 
    },
    { 
      text: "Which tradeoff exists when moving from [clue]APIs to Custom Models[/clue]?", 
      options: ["Custom is faster to build", "Custom requires more expertise/effort but offers differentiation", "Custom is always cheaper", "APIs are less accurate"], 
      correctIndex: 1, 
      explanation: "You trade development speed and ease (APIs) for customization and competitive advantage (Custom).", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Effort vs Reward." 
    },
    { 
      text: "To classify images of [clue]clouds vs snow[/clue] (generic objects), what is the most efficient start?", 
      options: ["Vision API", "Train a custom TensorFlow model", "Hire a meteorologist", "BigQuery"], 
      correctIndex: 0, 
      explanation: "The Vision API already knows what 'clouds' and 'snow' look like.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Don't reinvent the wheel." 
    }
  ],
  4: [ // Section 4: Modernize Infrastructure
    { 
      text: "What is the key difference between [clue]VMs and Containers[/clue]?", 
      options: ["VMs are smaller", "Containers share the OS kernel; VMs have their own full OS", "Containers are slower", "VMs are serverless"], 
      correctIndex: 1, 
      explanation: "Because containers share the OS, they are lightweight and start up instantly compared to VMs.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Shared Kernel vs Full OS." 
    },
    { 
      text: "When should you choose [clue]App Engine[/clue] over Compute Engine?", 
      options: ["When you want full control of the OS", "When you want to focus on code and let Google handle scaling (PaaS)", "When you need to install custom drivers", "When you have a legacy app"], 
      correctIndex: 1, 
      explanation: "App Engine is a PaaS designed for developers who don't want to manage infrastructure.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Focus on Code." 
    },
    { 
      text: "How does [clue]Preemptible / Spot VMs[/clue] lower costs?", 
      options: ["They are slower", "They use excess capacity and can be stopped by Google at any time", "They are older hardware", "They have no storage"], 
      correctIndex: 1, 
      explanation: "Google sells spare capacity at a huge discount, but can reclaim it if needed (good for batch jobs).", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Spare capacity." 
    },
    { 
      text: "What is the business value of [clue]Refactoring[/clue] an application?", 
      options: ["It is the fastest migration", "It takes advantage of cloud-native features (scalability/agility) by rewriting code", "It is the cheapest upfront", "It requires no testing"], 
      correctIndex: 1, 
      explanation: "Refactoring requires effort but unlocks the full long-term value of the cloud (Auto-scaling, Serverless).", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Short term pain, long term gain." 
    },
    { 
      text: "How can a company [clue]Monetize APIs[/clue]?", 
      options: ["By selling the code", "By charging developers/partners for access to data or services via the API", "By closing the API", "By making them slow"], 
      correctIndex: 1, 
      explanation: "Companies like Stripe or Maps charge for every time you call their API.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Pay per call." 
    },
    { 
      text: "Which service enables [clue]Event-Driven[/clue] architecture (e.g., trigger code when a file is uploaded)?", 
      options: ["Cloud Functions", "Compute Engine", "Cloud SQL", "VPC"], 
      correctIndex: 0, 
      explanation: "Cloud Functions are single-purpose functions that respond to cloud events.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Glue code." 
    },
    { 
      text: "Why use [clue]GKE Enterprise[/clue] (formerly Anthos)?", 
      options: ["To just run VMs", "To manage container fleets across Hybrid and Multi-cloud environments consistently", "To save money on storage", "To build websites"], 
      correctIndex: 1, 
      explanation: "It provides a 'single pane of glass' to manage Kubernetes clusters anywhere (On-prem, AWS, GCP).", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "One control panel." 
    },
    { 
      text: "What does [clue]Load Balancing[/clue] achieve?", 
      options: ["Compresses data", "Distributes traffic across multiple instances to prevent overloading", "Encrypts data", "Backs up data"], 
      correctIndex: 1, 
      explanation: "It ensures no single server crashes under high load by spreading the work.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Traffic cop." 
    },
    { 
      text: "If you have a specialized legacy app that requires a specific [clue]modified OS kernel[/clue], use:", 
      options: ["Cloud Run", "App Engine", "Compute Engine", "Cloud Functions"], 
      correctIndex: 2, 
      explanation: "Compute Engine (IaaS) gives you full control to modify the OS.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Full Control." 
    },
    { 
      text: "What is [clue]Autoscaling[/clue]?", 
      options: ["Making monitors bigger", "Automatically adding/removing resources based on traffic demand", "Increasing price", "Automatic updates"], 
      correctIndex: 1, 
      explanation: "Autoscaling saves money by reducing servers when traffic is low and adding them when high.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Right-sizing dynamically." 
    }
  ],
  5: [ // Section 5: Trust and Security
    { 
      text: "How does Google's [clue]Titan Chip[/clue] contribute to hardware security?", 
      options: ["It makes CPUs faster", "It establishes a hardware root of trust to verify boot integrity", "It encrypts WiFi", "It is a GPU"], 
      correctIndex: 1, 
      explanation: "The Titan chip ensures the machine boots trusted code and hasn't been tampered with physically.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Root of Trust." 
    },
    { 
      text: "What is the purpose of the [clue]Compliance Reports Manager[/clue]?", 
      options: ["To report bugs", "To provide on-demand access to audit reports (SOC, PCI, ISO)", "To manage billing", "To chat with support"], 
      correctIndex: 1, 
      explanation: "It allows customers to download third-party audit reports to verify Google's compliance.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Proof of audits." 
    },
    { 
      text: "Which state of data is protected by [clue]TLS (Transport Layer Security)[/clue]?", 
      options: ["Data at Rest", "Data in Transit", "Data in Use", "Deleted Data"], 
      correctIndex: 1, 
      explanation: "Google uses TLS to encrypt data as it moves over the network (in transit).", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Moving data." 
    },
    { 
      text: "What is [clue]SecOps[/clue] (Security Operations)?", 
      options: ["A video game", "The practice of collaboration between IT security and operations teams", "Secret Operations", "Buying hardware"], 
      correctIndex: 1, 
      explanation: "SecOps focuses on agility and speed in detecting and responding to threats.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Security + Operations." 
    },
    { 
      text: "Which Google product acts as a [clue]Security Dashboard[/clue] for risk management?", 
      options: ["Security Command Center", "Cloud Build", "BigQuery", "Admin Console"], 
      correctIndex: 0, 
      explanation: "SCC provides a centralized view of assets, vulnerabilities, and threats.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Command HQ." 
    },
    { 
      text: "How does [clue]Data Residency[/clue] differ from Data Sovereignty?", 
      options: ["They are identical", "Residency is about WHERE data is stored; Sovereignty is about WHO controls it (jurisdiction)", "Residency is cheaper", "Sovereignty is only for royalty"], 
      correctIndex: 1, 
      explanation: "Residency is physical location; Sovereignty implies legal authority over that data.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Location vs Jurisdiction." 
    },
    { 
      text: "Why does Google publish [clue]Transparency Reports[/clue]?", 
      options: ["To show off profits", "To disclose government requests for customer data", "To list all employee names", "To show server speeds"], 
      correctIndex: 1, 
      explanation: "Transparency reports build trust by showing how often governments request user data.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Government requests." 
    },
    { 
      text: "In the Shared Responsibility model, who secures the [clue]Operating System[/clue] in Compute Engine (IaaS)?", 
      options: ["Google", "The Customer", "The Internet Provider", "No one"], 
      correctIndex: 1, 
      explanation: "In IaaS, the customer must patch and secure the OS. Google secures the hardware.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "IaaS = You manage OS." 
    },
    { 
      text: "What is [clue]Identity-Aware Proxy (IAP)[/clue] used for?", 
      options: ["Making internet faster", "Accessing apps based on user identity/context without a VPN", "Encrypting databases", "Deleting logs"], 
      correctIndex: 1, 
      explanation: "IAP implements the Zero Trust model by verifying identity for every request.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "No VPN needed." 
    },
    { 
      text: "What is the benefit of [clue]Federated Identity[/clue]?", 
      options: ["Using multiple passwords", "Using existing credentials (like AD or Okta) to sign in to Google Cloud", "Having no identity", "Using a robot"], 
      correctIndex: 1, 
      explanation: "Federation allows employees to use their existing corporate login for GCP.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Single Sign-On." 
    }
  ],
  6: [ // Section 6: Scaling with Operations
    { 
      text: "Which tool allows you to [clue]visualize historical spend[/clue] and forecast future costs?", 
      options: ["Cloud Billing Reports", "Pricing Calculator", "Cloud Trace", "IAM"], 
      correctIndex: 0, 
      explanation: "Billing Reports provide graphs of actual spend over time.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "The cost graph." 
    },
    { 
      text: "What is an [clue]SLO (Service Level Objective)[/clue]?", 
      options: ["A legal contract", "An internal goal for reliability (e.g., 99.9%)", "A billing alert", "A type of database"], 
      correctIndex: 1, 
      explanation: "An SLO is the target reliability level you aim for to keep users happy.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "The Goal." 
    },
    { 
      text: "How does [clue]Region Selection[/clue] impact sustainability?", 
      options: ["It doesn't", "Some regions run on lower-carbon energy sources than others", "Regions are all coal-powered", "Closer regions use more power"], 
      correctIndex: 1, 
      explanation: "Google provides 'Low CO2' icons for regions that run on cleaner energy grids.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Clean grids." 
    },
    { 
      text: "Which Support Plan offers [clue]15-minute response times[/clue] for critical P1 issues?", 
      options: ["Basic", "Standard", "Enhanced", "Premium"], 
      correctIndex: 3, 
      explanation: "Premium Support is designed for mission-critical enterprise workloads.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Top Tier." 
    },
    { 
      text: "What is the [clue]Active Assist[/clue] (Unattended Project Recommender) useful for?", 
      options: ["Identifying and deleting abandoned projects to save money/carbon", "Writing code", "Faster networking", "Backups"], 
      correctIndex: 0, 
      explanation: "It identifies projects that haven't been used recently so you can shut them down.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Digital janitor." 
    },
    { 
      text: "What is the difference between [clue]HA (High Availability)[/clue] and DR (Disaster Recovery)?", 
      options: ["No difference", "HA is for everyday uptime; DR is for recovering from catastrophic loss", "HA is cheaper", "DR is automatic"], 
      correctIndex: 1, 
      explanation: "HA keeps you running during minor failures; DR brings you back after a major region/data loss.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Uptime vs Rescue." 
    },
    { 
      text: "What is [clue]Policy Inheritance[/clue] in the resource hierarchy?", 
      options: ["Policies only apply to the root", "A policy set at the Organization level applies to all Folders and Projects below it", "Projects ignore parent policies", "You must set policies manually everywhere"], 
      correctIndex: 1, 
      explanation: "Permissions flow down the tree, simplifying management.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Flows downhill." 
    },
    { 
      text: "To get a discount for a predictable workload, you should purchase a:", 
      options: ["Sudden Use Discount", "Committed Use Discount (CUD)", "Preemptible VM", "Free Tier"], 
      correctIndex: 1, 
      explanation: "CUDs give deep discounts in exchange for a 1 or 3-year commitment.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Commitment." 
    },
    { 
      text: "Which role creates the bridge between [clue]Development and Operations[/clue] using software engineering?", 
      options: ["Project Manager", "Site Reliability Engineer (SRE)", "Sales Rep", "Data Analyst"], 
      correctIndex: 1, 
      explanation: "SREs apply software engineering principles to infrastructure and operations problems.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Google's approach to Ops." 
    },
    { 
      text: "How does the [clue]Pricing Calculator[/clue] differ from Billing Reports?", 
      options: ["Calculator estimates future costs; Reports show past/current actuals", "Calculator pays the bill", "Reports are for free users only", "They are the same"], 
      correctIndex: 0, 
      explanation: "Use the calculator *before* you build; use reports *after* you build.", 
      difficulty: DifficultyLevel.NORMAL, 
      hint: "Estimate vs Actual." 
    }
  ]
};
