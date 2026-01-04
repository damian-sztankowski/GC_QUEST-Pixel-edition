
import { Question, DifficultyLevel } from '../types';

export const HARD_QUESTIONS: Record<number, Question[]> = {
  1: [ // Digital Core
    { 
      text: "A CTO argues that migrating to cloud increases [clue]OpEx[/clue] too much. What is the counter-argument regarding agility?", 
      options: ["OpEx is always lower than CapEx", "OpEx aligns spend with revenue and allows faster pivots", "Cloud is free for startups", "CapEx has tax benefits"], 
      correctIndex: 1, 
      explanation: "While OpEx is a monthly cost, it provides the strategic value of paying only for what is needed to innovate quickly.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "Aligning cost with value." 
    },
    { 
      text: "Which 'Transformation Cloud' pillar addresses the need for [clue]secure collaboration[/clue] in a hybrid workforce?", 
      options: ["Infrastructure Modernization", "People Connections", "Data Democratization", "Trusted Transactions"], 
      correctIndex: 1, 
      explanation: "People Connections (via Workspace) focuses on how culture and tools evolve for hybrid work.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "Connecting people." 
    },
    { 
      text: "In the Shared Responsibility Model, if a [clue]PaaS[/clue] database is compromised due to a weak user password, who is at fault?", 
      options: ["Google Cloud", "The Customer", "The Database Vendor", "Shared Fault"], 
      correctIndex: 1, 
      explanation: "Identity and Access Management (passwords) are always the customer's responsibility, even in PaaS/SaaS.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "User credentials." 
    },
    { 
      text: "Why might a company choose a [clue]Hybrid Cloud[/clue] approach specifically for 'Data Residency' compliance?", 
      options: ["To save money", "To keep sensitive data on-prem while using cloud compute", "Because Google has no local regions", "To use older hardware"], 
      correctIndex: 1, 
      explanation: "Hybrid allows keeping regulated data physically on-premises while bursting to the cloud for processing.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "Best of both worlds for compliance." 
    },
    { 
      text: "What distinguishes Google's approach to [clue]Sustainability[/clue] from simply buying carbon offsets?", 
      options: ["They don't use electricity", "They match 100% of usage with renewable energy and aim for 24/7 carbon-free", "They charge customers for carbon", "They only use solar"], 
      correctIndex: 1, 
      explanation: "Google is the first major cloud provider to commit to running on carbon-free energy 24/7 by 2030.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "24/7 Carbon Free." 
    },
    { 
      text: "How does the [clue]Open Cloud[/clue] philosophy support a company's long-term digital strategy?", 
      options: ["It forces them to use Google tools", "It ensures interoperability and prevents 'sunk cost' in proprietary formats", "It makes all code public", "It removes security features"], 
      correctIndex: 1, 
      explanation: "Open Cloud (Kubernetes, Anthos) ensures that investments today work on any cloud tomorrow.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "Interoperability." 
    },
    { 
      text: "An organization is facing [clue]Latency[/clue] issues for users in Asia. They are hosted in 'us-central1'. What is the correct infrastructure fix?", 
      options: ["Increase bandwidth", "Deploy resources to a Region in Asia", "Use a larger VM", "Compress data"], 
      correctIndex: 1, 
      explanation: "Latency is determined by physical distance. Moving the workload closer to the user is the only true fix.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "Physics (Speed of light)." 
    },
    { 
      text: "When calculating [clue]TCO[/clue] for a cloud migration, which 'Shadow IT' cost is often reduced?", 
      options: ["Software licenses", "Unsanctioned/Unmanaged innovative projects", "Electricity bills", "Security guards"], 
      correctIndex: 1, 
      explanation: "Centralized cloud governance gives visibility into resources that were previously hidden/unmanaged (Shadow IT).", 
      difficulty: DifficultyLevel.HARD, 
      hint: "Hidden IT projects." 
    },
    { 
      text: "What is the [clue]Network Edge[/clue] in Google's infrastructure?", 
      options: ["The data center wall", "Points of Presence (PoPs) closest to the user", "The user's laptop", "The subsea cable"], 
      correctIndex: 1, 
      explanation: "Edge PoPs are entry points to Google's network located as close to users/ISPs as possible.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "Entry point near the user." 
    },
    { 
      text: "Which scenario best fits a [clue]Serverless[/clue] (PaaS/FaaS) model over IaaS?", 
      options: ["Migrating a legacy app with hardcoded IP addresses", "An event-driven app with unpredictable, 'spiky' traffic", "A database requiring custom kernel tuning", "A storage archive"], 
      correctIndex: 1, 
      explanation: "Serverless shines where traffic is unpredictable, as it scales to zero and handles bursts automatically.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "Unpredictable spikes." 
    }
  ],
  2: [ // Section 2: Data Transformation
    { 
      text: "Why is [clue]Data Governance[/clue] essential before democratizing data access?", 
      options: ["To prevent people from working", "To ensure quality, security, and compliance (who sees what)", "To save money on storage", "To delete old data"], 
      correctIndex: 1, 
      explanation: "Without governance, democratization risks data leaks, compliance violations, and usage of bad data.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "Safety first." 
    },
    { 
      text: "A retail company wants to run analytics on data residing in [clue]AWS and Azure[/clue] without moving it. Use:", 
      options: ["BigQuery Omni", "Cloud SQL", "Dataflow", "Multi-region Storage"], 
      correctIndex: 0, 
      explanation: "BigQuery Omni allows you to run BigQuery analytics on data stored in other clouds.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "Omni-cloud." 
    },
    { 
      text: "Which database is best suited for a [clue]Lift and Shift[/clue] of a legacy SQL Server application?", 
      options: ["Cloud Spanner", "Cloud SQL for SQL Server", "BigQuery", "Firestore"], 
      correctIndex: 1, 
      explanation: "Cloud SQL supports SQL Server engines, minimizing code changes for legacy app migration.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "Same engine, managed home." 
    },
    { 
      text: "Describe the [clue]Data Value Chain[/clue] process:", 
      options: ["Delete -> Restore -> Archive", "Ingest -> Process -> Store -> Analyze -> Activate", "Buy -> Sell -> Profit", "Code -> Test -> Deploy"], 
      correctIndex: 1, 
      explanation: "Value is created by ingesting raw data, processing it, storing it, analyzing it, and acting on insights.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "From raw to action." 
    },
    { 
      text: "When modernizing a data warehouse to the cloud, why switch from [clue]ETL to ELT[/clue] (Extract, Load, Transform)?", 
      options: ["ELT is slower", "Cloud storage is cheap and BigQuery computes fast, so load raw first then transform", "ETL is illegal", "ELT uses less network"], 
      correctIndex: 1, 
      explanation: "BigQuery's power allows you to load raw data first and transform it using SQL (ELT), which is more agile.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "Load first, think later." 
    },
    { 
      text: "A customer needs to store [clue]financial records[/clue] for 7 years that cannot be deleted or overwritten. Use:", 
      options: ["Cloud Storage Bucket Lock / Retention Policy", "Standard Storage", "Cloud SQL", "Local SSD"], 
      correctIndex: 0, 
      explanation: "Bucket Lock (WORM compliance) ensures data cannot be modified or deleted for a set period.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "Compliance lock." 
    },
    { 
      text: "How does Looker's [clue]Semantic Layer[/clue] (LookML) add value?", 
      options: ["It encrypts data", "It defines metrics once so everyone uses the same definitions", "It makes graphs pretty", "It deletes duplicates"], 
      correctIndex: 1, 
      explanation: "LookML creates a trusted source of truth, so 'Revenue' means the same thing to Sales and Finance.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "Single source of truth." 
    },
    { 
      text: "Which combination creates a [clue]Serverless Streaming Pipeline[/clue]?", 
      options: ["Kafka on VMs -> Spark on VMs", "Pub/Sub -> Dataflow -> BigQuery", "FTP -> Excel -> Email", "Cloud Storage -> Compute Engine"], 
      correctIndex: 1, 
      explanation: "Pub/Sub (Ingest), Dataflow (Process), and BigQuery (Analyze) are all fully managed and serverless.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "The Google Trio." 
    },
    { 
      text: "Your app requires [clue]microsecond[/clue] latency for a leaderboard. Which data solution?", 
      options: ["Memorystore", "BigQuery", "Cloud Storage", "Spanner"], 
      correctIndex: 0, 
      explanation: "Memorystore (Redis/Memcached) is an in-memory store for sub-millisecond access.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "In-memory speed." 
    },
    { 
      text: "How does the cloud unlock value from [clue]previously untapped[/clue] unstructured data?", 
      options: ["By deleting it", "By using AI/ML (Vision/NLP) to extract insights from images/text", "By compressing it", "By printing it"], 
      correctIndex: 1, 
      explanation: "Cloud AI services can 'read' documents and 'see' images, turning unstructured data into structured insights.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "AI making sense of chaos." 
    }
  ],
  3: [ // Section 3: Innovating with AI
    { 
      text: "Why is [clue]Vertex AI[/clue] considered a 'Unified' platform?", 
      options: ["It combines Google Drive and Photos", "It brings AutoML and Custom Training into a single environment (MLOps)", "It is only for billing", "It merges AWS and Azure"], 
      correctIndex: 1, 
      explanation: "Vertex AI unifies all Google Cloud ML tools, allowing seamless transition from experimentation to production.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "All-in-one AI." 
    },
    { 
      text: "A healthcare provider needs an ML model to diagnose diseases. Why is [clue]Explainable AI[/clue] critical here?", 
      options: ["To speed up the diagnosis", "Regulatory compliance and trust (doctors must know WHY)", "To use less data", "To save costs"], 
      correctIndex: 1, 
      explanation: "In high-stakes industries (Health/Finance), 'black box' decisions are unacceptable; rationale is required.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "Life or death decisions." 
    },
    { 
      text: "How does building a [clue]Custom Model[/clue] create 'Business Differentiation'?", 
      options: ["It saves time", "It uses unique proprietary data to solve problems competitors cannot", "It uses standard public data", "It is easier than APIs"], 
      correctIndex: 1, 
      explanation: "If everyone uses the same standard API, there is no advantage. Custom models leverage your unique data.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "Unique value." 
    },
    { 
      text: "You have a massive dataset of [clue]customer support calls[/clue]. How do you unlock value from this unstructured audio?", 
      options: ["Listen to them one by one", "Speech-to-Text API -> Natural Language API -> BigQuery", "Store in Coldline", "Delete them"], 
      correctIndex: 1, 
      explanation: "First transcribe audio to text, then analyze sentiment/topics, then query the results for trends.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "The AI Pipeline." 
    },
    { 
      text: "What is the primary advantage of using [clue]AutoML[/clue] over the standard Vision API?", 
      options: ["It is free", "It detects generic objects", "It allows training on YOUR specific labels/products with no code", "It requires a PhD"], 
      correctIndex: 2, 
      explanation: "AutoML bridges the gap: it uses your custom data but handles the complex model training for you.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "Custom but easy." 
    },
    { 
      text: "When selecting a GPU vs a [clue]TPU[/clue] for training, what is the main consideration?", 
      options: ["TPUs are for graphics", "TPUs are optimized specifically for TensorFlow matrix math", "GPUs are only for gaming", "TPUs are slower"], 
      correctIndex: 1, 
      explanation: "TPUs provide massive acceleration for specific matrix operations common in neural networks (TensorFlow).", 
      difficulty: DifficultyLevel.HARD, 
      hint: "Specialized for Math." 
    },
    { 
      text: "A retailer wants to predict demand for 10,000 products. They have historical sales data in BigQuery. Why use [clue]BigQuery ML[/clue]?", 
      options: ["To move data to a GPU cluster", "To avoid data movement and iterate quickly using SQL", "To visualize the data", "To encrypt the data"], 
      correctIndex: 1, 
      explanation: "Moving massive data is slow and risky. BQML brings the compute to the data.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "Data gravity." 
    },
    { 
      text: "How does [clue]Data Bias[/clue] negatively impact business value?", 
      options: ["It makes models too fast", "It leads to alienating user groups and reputational damage", "It increases storage costs", "It makes the API crash"], 
      correctIndex: 1, 
      explanation: "If training data is not representative, the model will make unfair decisions, harming the brand and users.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "Unfair outcomes." 
    },
    { 
      text: "Which feature of Vertex AI helps with [clue]managing experiments[/clue] and tracking parameters?", 
      options: ["Vertex AI Experiments / Metadata", "Cloud Storage", "Billing Reports", "IAM"], 
      correctIndex: 0, 
      explanation: "It tracks which data/parameters produced which model version, essential for reproducibility.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "Lab notebook." 
    },
    { 
      text: "Your startup wants to build a translation app for a [clue]rare fictional language[/clue]. Can you use the Cloud Translation API?", 
      options: ["Yes, it knows all languages", "No, you need AutoML Translation to train on the new language pairs", "Yes, using Speech-to-Text", "No, it is impossible"], 
      correctIndex: 1, 
      explanation: "The standard API only knows real languages. AutoML allows teaching the model new custom language pairs.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "Teaching new languages." 
    }
  ],
  4: [ // Section 4: Modernize Infrastructure
    { 
      text: "Why might a business choose [clue]Replatforming[/clue] (Move and Improve) over Lift and Shift?", 
      options: ["It is faster", "To gain some cloud benefits (like managed databases) without a full rewrite", "It requires no changes", "It is free"], 
      correctIndex: 1, 
      explanation: "Replatforming involves small changes (like switching to Cloud SQL) to get quick wins without a total rewrite.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "Middle ground." 
    },
    { 
      text: "A bank needs to keep sensitive data on-premise but wants to use Google AI. What strategy is this?", 
      options: ["Full Migration", "Hybrid Cloud", "Multi-cloud", "Private Cloud"], 
      correctIndex: 1, 
      explanation: "Hybrid cloud connects the secure on-prem environment with public cloud innovation.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "Best of both worlds." 
    },
    { 
      text: "How does [clue]Apigee[/clue] help with legacy modernization?", 
      options: ["It rewrites the code", "It wraps legacy backends with a modern API layer for new apps to consume", "It acts as a firewall", "It deletes the legacy app"], 
      correctIndex: 1, 
      explanation: "Apigee acts as a facade, hiding the complexity of legacy systems behind modern, clean APIs.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "Modern face, old brain." 
    },
    { 
      text: "Which workload is ideal for [clue]Cloud Run[/clue]?", 
      options: ["A 24/7 background database", "A stateless web service in a container that needs to scale to zero", "A legacy Windows app", "A virtual machine"], 
      correctIndex: 1, 
      explanation: "Cloud Run excels at stateless HTTP containers that need to scale rapidly based on requests.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "Stateless container." 
    },
    { 
      text: "Why is [clue]Vendor Lock-in[/clue] a concern in 'Refactoring' using proprietary PaaS?", 
      options: ["It isn't a concern", "Code written for a specific proprietary platform is hard to move to another cloud", "It costs less", "It is faster"], 
      correctIndex: 1, 
      explanation: "Writing code deeply tied to one vendor's specific tools makes it expensive to switch later.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "Stuck with one provider." 
    },
    { 
      text: "How does [clue]GKE Enterprise[/clue] support a Multi-cloud strategy?", 
      options: ["It blocks AWS", "It allows deploying the same policy and security config across GKE, AWS, and Azure", "It merges billing", "It deletes external clusters"], 
      correctIndex: 1, 
      explanation: "It provides consistent policy enforcement and management across different cloud providers.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "Consistent Policy." 
    },
    { 
      text: "A startup wants to run a batch job every night that processes images. They have a tight budget. Strategy?", 
      options: ["Run on a dedicated GKE cluster", "Use Compute Engine Spot/Preemptible VMs", "Buy a physical server", "Use Premium App Engine"], 
      correctIndex: 1, 
      explanation: "Batch jobs are fault-tolerant, making them perfect candidates for the massive discounts of Spot VMs.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "Cheap and interruptible." 
    },
    { 
      text: "What is the [clue]Cold Start[/clue] issue in Serverless?", 
      options: ["Servers freezing", "The slight delay when a function triggers for the first time after being idle", "Low temperature in data center", "Cooling costs"], 
      correctIndex: 1, 
      explanation: "Because serverless scales to zero, the first request requires spinning up a new instance, causing latency.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "Waking up." 
    },
    { 
      text: "Which computing option offers the [clue]highest portability[/clue] for code?", 
      options: ["App Engine Standard", "Cloud Functions", "Containers (GKE/Cloud Run)", "Bare Metal"], 
      correctIndex: 2, 
      explanation: "Containers package dependencies with the code, allowing them to run identically on any cloud or laptop.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "Ship anywhere." 
    },
    { 
      text: "What does [clue]Move and Improve[/clue] imply for migration?", 
      options: ["Rehost only", "Migrate first (Rehost), then optimize (Replatform) over time", "Delete everything", "Rewrite everything first"], 
      correctIndex: 1, 
      explanation: "It strikes a balance: get to the cloud quickly, then optimize services (e.g., switch to managed DBs) later.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "Migrate then Optimize." 
    }
  ],
  5: [ // Section 5: Trust and Security
    { 
      text: "Which technology protects [clue]Data in Use[/clue] (while being processed in RAM)?", 
      options: ["Cloud Storage", "Confidential Computing", "Cloud Armor", "VPN"], 
      correctIndex: 1, 
      explanation: "Confidential Computing uses hardware enclaves to encrypt data even while the CPU is processing it.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "Encrypted RAM." 
    },
    { 
      text: "What is the business value of [clue]Binary Authorization[/clue] in a container pipeline?", 
      options: ["Faster builds", "Ensuring only trusted/signed images are deployed to production", "Cheaper storage", "Better code quality"], 
      correctIndex: 1, 
      explanation: "It prevents supply-chain attacks by blocking any software that hasn't been digitally signed/verified.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "Trusted Supply Chain." 
    },
    { 
      text: "How does [clue]VPC Service Controls[/clue] prevent data exfiltration?", 
      options: ["By encrypting data", "By creating a security perimeter that blocks unauthorized data copy across services", "By adding passwords", "By scanning for viruses"], 
      correctIndex: 1, 
      explanation: "It acts like a firewall for GCP APIs, preventing data from moving from a secure project to an insecure one.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "API Perimeter." 
    },
    { 
      text: "A customer wants to manage their own encryption keys but use Google's hardware. Solution?", 
      options: ["Default Encryption", "Customer-Supplied Encryption Keys (CSEK)", "Cloud HSM (Hardware Security Module)", "Local Laptop"], 
      correctIndex: 2, 
      explanation: "Cloud HSM allows customers to generate and manage keys in a FIPS 140-2 Level 3 certified hardware device.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "Hardware Keys." 
    },
    { 
      text: "Regarding Google's [clue]Trust Principles[/clue]: Does Google use customer data for advertising?", 
      options: ["Yes, for all customers", "No, Google Cloud scans no customer data for ads", "Only for free tier users", "Yes, if they opt-in"], 
      correctIndex: 1, 
      explanation: "Google Cloud strictly prohibits scanning customer content for advertising purposes.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "No Ads." 
    },
    { 
      text: "Why is [clue]Non-repudiation[/clue] important in Cloud Audit Logs?", 
      options: ["It makes logs smaller", "It prevents a user from denying they performed an action", "It deletes old logs", "It speeds up search"], 
      correctIndex: 1, 
      explanation: "Immutable audit logs provide legal proof of who did what, which cannot be denied later.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "Undeniable proof." 
    },
    { 
      text: "What is the core philosophy of the [clue]Zero Trust[/clue] model?", 
      options: ["Trust the internal network", "Verify every request as if it comes from an open network", "Trust only VPN users", "Trust no hardware"], 
      correctIndex: 1, 
      explanation: "Zero Trust assumes the internal network is just as hostile as the public internet.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "BeyondCorp." 
    },
    { 
      text: "If a government requests customer data, what is Google's [clue]first step[/clue]?", 
      options: ["Hand it over immediately", "Direct the government to request it from the customer directly", "Delete the data", "Encrypt the data"], 
      correctIndex: 1, 
      explanation: "Google's policy is to notify the customer and direct the requestor to them whenever legally possible.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "Customer first." 
    },
    { 
      text: "What is [clue]Context-Aware Access[/clue]?", 
      options: ["Access based on password only", "Access decisions based on user ID, device health, location, and IP", "Access based on paying more", "Access for admins only"], 
      correctIndex: 1, 
      explanation: "It moves beyond simple passwords to check the context (is the laptop managed? is the IP safe?) before granting access.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "Context matters." 
    },
    { 
      text: "How does [clue]Cloud Asset Inventory[/clue] assist with security/compliance?", 
      options: ["It stores files", "It provides a historical time-series view of all resources and policies", "It buys assets", "It tracks physical hardware"], 
      correctIndex: 1, 
      explanation: "It allows security teams to ask 'What did our firewall rules look like last Tuesday?'.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "Time machine for config." 
    }
  ],
  6: [ // Section 6: Scaling with Operations
    { 
      text: "To perform complex, custom SQL analysis on your billing data (e.g., 'cost per transaction'), you should:", 
      options: ["Use the standard report", "Enable Cloud Billing Export to BigQuery", "Use a calculator", "Check your email"], 
      correctIndex: 1, 
      explanation: "Exporting billing data to BigQuery allows you to join cost data with business metrics for granular analysis.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "SQL for Money." 
    },
    { 
      text: "In SRE terms, what is an [clue]Error Budget[/clue]?", 
      options: ["Money for fixing bugs", "The amount of unreliability (downtime) you can tolerate before stopping new releases", "The cost of SRE staff", "A penalty fee"], 
      correctIndex: 1, 
      explanation: "If you have a 99.9% SLO, your error budget is the remaining 0.1%. If you burn it, you stop launching features.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "Allowance for failure." 
    },
    { 
      text: "Why is [clue]24/7 Carbon-Free Energy[/clue] harder than 'Carbon Neutral'?", 
      options: ["It isn't", "Neutral buys offsets; 24/7 means matching usage with clean energy every hour, everywhere", "Neutral is illegal", "24/7 is cheaper"], 
      correctIndex: 1, 
      explanation: "Carbon Neutral can be achieved by planting trees. 24/7 means the grid powering you is clean right now.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "Matching supply and demand." 
    },
    { 
      text: "What allows Google Support engineers to access your data/resources [clue]only with your explicit approval[/clue]?", 
      options: ["Access Transparency & Access Approval", "IAM", "Cloud Armor", "VPN"], 
      correctIndex: 0, 
      explanation: "Access Approval ensures Google can't touch your data to fix a bug unless you click 'Approve' first.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "You hold the key." 
    },
    { 
      text: "How does using [clue]Spot VMs[/clue] relate to fault-tolerant architecture?", 
      options: ["You shouldn't use them", "Your app must be able to handle sudden shutdowns (resilience) to save money", "They are for databases", "They never shut down"], 
      correctIndex: 1, 
      explanation: "To use Spot VMs, you *must* architect your app to survive nodes disappearing instantly (Chaos Engineering).", 
      difficulty: DifficultyLevel.HARD, 
      hint: "Designing for failure." 
    },
    { 
      text: "A large enterprise wants to separate [clue]Prod, Test, and Dev[/clue] environments with different policies. Best practice?", 
      options: ["Use one project with labels", "Use separate Folders for each environment under the Organization", "Use different credit cards", "Use separate Organizations"], 
      correctIndex: 1, 
      explanation: "Folders allow you to apply strict security policies to 'Prod' and loose policies to 'Dev'.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "Environment isolation." 
    },
    { 
      text: "What is [clue]Toil[/clue] in the context of SRE?", 
      options: ["Hard work", "Manual, repetitive, tactical work that scales linearly with growth", "Writing code", "Attending meetings"], 
      correctIndex: 1, 
      explanation: "SREs aim to eliminate toil (manual work) through automation.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "Manual grunt work." 
    },
    { 
      text: "Which strategy helps allocate [clue]Shared Costs[/clue] (like a shared database) to different teams?", 
      options: ["Guessing", "re-architecting everything", "Measuring utilization and using Label-based cost splitting", "Charging IT"], 
      correctIndex: 2, 
      explanation: "Advanced FinOps involves tagging resources and splitting shared costs based on usage metrics.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "Splitting the bill." 
    },
    { 
      text: "What is the difference between [clue]Sustained Use[/clue] (SUD) and Committed Use (CUD)?", 
      options: ["None", "SUD is automatic for running VMs long; CUD requires a contract", "CUD is automatic", "SUD is for storage"], 
      correctIndex: 1, 
      explanation: "SUD applies automatically on GKE/Compute; CUD is a proactive contract you sign for bigger savings.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "Automatic vs Contract." 
    },
    { 
      text: "In a [clue]P1 (Priority 1)[/clue] support case, what is the impact level?", 
      options: ["Question about billing", "Feature request", "Critical impact: Service unusable for all users", "Minor bug"], 
      correctIndex: 2, 
      explanation: "P1 is 'System Down'—the highest urgency level requiring immediate attention.", 
      difficulty: DifficultyLevel.HARD, 
      hint: "System Down." 
    }
  ]
};
