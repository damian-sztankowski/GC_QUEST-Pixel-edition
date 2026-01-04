import { Question, DifficultyLevel } from '../types';

export const EASY_QUESTIONS: Record<number, Question[]> = {
  1: [ // Section 1: Digital Transformation
    { 
      text: "What term describes software designed specifically to run in the [clue]cloud environment[/clue] from the start?", 
      options: ["Legacy", "Cloud-native", "On-premises", "Mainframe"], 
      correctIndex: 1, 
      explanation: "Cloud-native applications are built to take full advantage of cloud scalability and flexibility.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "Native to the environment." 
    },
    { 
      text: "Moving from buying physical servers (CapEx) to paying for cloud usage (OpEx) helps avoid [clue]_______[/clue].", 
      options: ["Monthly bills", "Over-provisioning hardware", "Using the internet", "Software updates"], 
      correctIndex: 1, 
      explanation: "OpEx allows you to pay only for what you use, avoiding the waste of buying too much hardware upfront.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "Buying too much." 
    },
    { 
      text: "Which cloud computing model offers the user the [clue]least management responsibility[/clue]?", 
      options: ["IaaS", "PaaS", "SaaS", "On-Premises"], 
      correctIndex: 2, 
      explanation: "SaaS (Software as a Service) is fully managed by the provider; you just use the app.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "Just log in and use." 
    },
    { 
      text: "What is the physical location where Google houses its [clue]servers and equipment[/clue]?", 
      options: ["Region", "Zone", "Data Center", "Point of Presence"], 
      correctIndex: 2, 
      explanation: "A data center is the secure facility that houses the physical computing hardware.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "The building itself." 
    },
    { 
      text: "Google Cloud's commitment to [clue]Open Source[/clue] technology primarily provides which benefit?", 
      options: ["Freedom/No vendor lock-in", "Higher costs", "Slower updates", "Proprietary code"], 
      correctIndex: 0, 
      explanation: "Open standards allow customers to move their data and apps easily, preventing lock-in.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "Freedom to move." 
    },
    { 
      text: "In the Shared Responsibility Model, who is responsible for [clue]content and data[/clue] stored in the cloud?", 
      options: ["Google", "The Customer", "The Government", "The ISP"], 
      correctIndex: 1, 
      explanation: "The customer is always responsible for the security and privacy of their own data.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "You own your files." 
    },
    { 
      text: "What does [clue]Latency[/clue] refer to in cloud networking?", 
      options: ["Total storage space", "The delay in data transfer", "The cost of the network", "The number of servers"], 
      correctIndex: 1, 
      explanation: "Latency is the time it takes for data to travel from point A to point B.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "Lag or delay." 
    },
    { 
      text: "Which cloud deployment model involves using [clue]only Google Cloud[/clue] resources?", 
      options: ["Private Cloud", "Public Cloud", "Hybrid Cloud", "On-Premises"], 
      correctIndex: 1, 
      explanation: "Google Cloud is a Public Cloud provider where resources are shared among customers.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "Open to the public." 
    },
    { 
      text: "Infrastructure as a Service (IaaS) provides virtualized [clue]_______[/clue].", 
      options: ["Applications", "Computing resources (Compute, Storage, Network)", "Code runtimes", "Email accounts"], 
      correctIndex: 1, 
      explanation: "IaaS replaces the physical hardware layer with virtualized equivalents.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "Raw infrastructure." 
    },
    { 
      text: "What is a [clue]Zone[/clue] in Google Cloud infrastructure?", 
      options: ["A separate country", "A deployment area within a Region", "A billing account", "A wifi network"], 
      correctIndex: 1, 
      explanation: "Zones are isolated locations within a Region designed to prevent failures from spreading.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "Part of a Region." 
    }
  ],
  2: [ // Section 2: Data Transformation
    { 
      text: "Which concept refers to a centralized repository for storing [clue]raw, unprocessed data[/clue]?", 
      options: ["Data Warehouse", "Data Lake", "Relational Database", "Spreadsheet"], 
      correctIndex: 1, 
      explanation: "A Data Lake holds raw data in its native format until it is needed.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "A large pool of raw liquid." 
    },
    { 
      text: "Data that is organized into [clue]tables with rows and columns[/clue] is known as:", 
      options: ["Unstructured data", "Structured data", "Object data", "Streaming data"], 
      correctIndex: 1, 
      explanation: "Structured data fits neatly into relational database schemas.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "Think of an Excel sheet." 
    },
    { 
      text: "Which Google Cloud service is an [clue]Object Storage[/clue] service for files like images and videos?", 
      options: ["Cloud SQL", "Cloud Storage", "BigQuery", "Spanner"], 
      correctIndex: 1, 
      explanation: "Cloud Storage is designed to store unstructured objects (blobs) like media files.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "Buckets for objects." 
    },
    { 
      text: "What is [clue]Looker[/clue] primarily used for?", 
      options: ["Storing passwords", "Business Intelligence (BI) and Data Visualization", "Running virtual machines", "Networking"], 
      correctIndex: 1, 
      explanation: "Looker is a platform for BI that helps users visualize and explore data.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "Looking at data." 
    },
    { 
      text: "Which database type uses [clue]SQL[/clue] (Structured Query Language)?", 
      options: ["Relational", "NoSQL", "Object Store", "File Store"], 
      correctIndex: 0, 
      explanation: "Relational databases (like Cloud SQL) use SQL for defining and manipulating data.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "Relations and tables." 
    },
    { 
      text: "What is the primary role of [clue]Pub/Sub[/clue] in a data pipeline?", 
      options: ["Long term storage", "Ingesting and buffering real-time messages", "Visualizing charts", "Training AI"], 
      correctIndex: 1, 
      explanation: "Pub/Sub handles the ingestion of streaming event data asynchronously.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "Publish and Subscribe." 
    },
    { 
      text: "Which storage class is best for data accessed [clue]once a year[/clue] (e.g., regulations)?", 
      options: ["Standard", "Nearline", "Coldline", "Archive"], 
      correctIndex: 3, 
      explanation: "Archive storage offers the lowest storage cost for data accessed extremely rarely.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "Deep freeze." 
    },
    { 
      text: "What does [clue]Data Democratization[/clue] mean?", 
      options: ["Voting on data", "Making data accessible to everyone in the organization", "Locking data away", "Selling data"], 
      correctIndex: 1, 
      explanation: "It ensures all employees, not just technical staff, can access data to make decisions.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "Power to the people." 
    },
    { 
      text: "Which service is a fully managed, serverless [clue]Data Warehouse[/clue]?", 
      options: ["Compute Engine", "BigQuery", "Cloud Storage", "Firestore"], 
      correctIndex: 1, 
      explanation: "BigQuery is Google's petabyte-scale data warehouse for analytics.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "Big Analytics." 
    },
    { 
      text: "What is the difference between [clue]Batch[/clue] and [clue]Streaming[/clue] data?", 
      options: ["Batch is faster", "Streaming is real-time; Batch is processed in chunks", "Streaming is for files", "Batch is for video"], 
      correctIndex: 1, 
      explanation: "Streaming processes data as it arrives; Batch processes accumulated data at intervals.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "Live flow vs. Scheduled chunks." 
    }
  ],
  3: [ // Section 3: Innovating with AI
    { 
      text: "What is the primary difference between [clue]AI and Data Analytics[/clue]?", 
      options: ["Analytics looks backward (what happened); AI predicts forward (what will happen)", "AI is for math only", "Analytics requires no data", "AI is always manual"], 
      correctIndex: 0, 
      explanation: "Analytics describes historical data; AI/ML uses that data to make predictions or generate content.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "History vs Future." 
    },
    { 
      text: "Which Google Cloud tool allows you to build ML models using [clue]Standard SQL[/clue]?", 
      options: ["Cloud SQL", "BigQuery ML", "Cloud Spanner", "Compute Engine"], 
      correctIndex: 1, 
      explanation: "BigQuery ML lets data analysts create and execute ML models using existing SQL skills.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "ML in the warehouse." 
    },
    { 
      text: "Which Pre-trained API would you use to [clue]convert audio logs into written text[/clue]?", 
      options: ["Text-to-Speech API", "Speech-to-Text API", "Translation API", "Vision API"], 
      correctIndex: 1, 
      explanation: "Speech-to-Text converts audio streams into text.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "Listening to writing." 
    },
    { 
      text: "What is a [clue]TPU (Tensor Processing Unit)[/clue]?", 
      options: ["A hard drive", "Google's custom hardware chip optimized for ML", "A network cable", "A software license"], 
      correctIndex: 1, 
      explanation: "TPUs are ASICs designed specifically to accelerate machine learning workloads.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "Hardware for AI." 
    },
    { 
      text: "Which solution allows you to train high-quality models with [clue]no coding[/clue] required?", 
      options: ["Vertex AI Custom Training", "AutoML", "TensorFlow", "Cloud Shell"], 
      correctIndex: 1, 
      explanation: "AutoML provides a graphical interface to train custom models without writing code.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "Automatic Machine Learning." 
    },
    { 
      text: "What is the [clue]Vision API[/clue] used for?", 
      options: ["Listening to music", "Detecting objects, text, and faces in images", "Predicting stock prices", "Running VMs"], 
      correctIndex: 1, 
      explanation: "Vision API uses pre-trained models to analyze image content.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "Seeing AI." 
    },
    { 
      text: "What is the relationship between [clue]Data Quality[/clue] and ML Model success?", 
      options: ["No relationship", "Garbage in, Garbage out (High quality data is essential)", "More data is always better than good data", "ML fixes bad data automatically"], 
      correctIndex: 1, 
      explanation: "An ML model is only as good as the data used to train it.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "Garbage In..." 
    },
    { 
      text: "What is [clue]TensorFlow[/clue]?", 
      options: ["A database", "An open-source software library for machine learning", "A paid service", "A type of storage"], 
      correctIndex: 1, 
      explanation: "TensorFlow is an end-to-end open source platform for machine learning.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "Open source ML library." 
    },
    { 
      text: "Which API allows you to create a [clue]chatbot[/clue] that speaks naturally?", 
      options: ["Text-to-Speech API", "Vision API", "BigQuery", "Cloud Armor"], 
      correctIndex: 0, 
      explanation: "Text-to-Speech converts written text into human-like spoken audio.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "Talking computer." 
    },
    { 
      text: "What distinguishes [clue]Machine Learning[/clue] from standard programming?", 
      options: ["It is slower", "The system learns from data rather than following explicit rules", "It uses no code", "It is only for games"], 
      correctIndex: 1, 
      explanation: "In ML, the computer learns patterns from examples rather than being explicitly programmed for every rule.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "Learning vs Coding." 
    }
  ],
  4: [ // Section 4: Modernize Infrastructure
    { 
      text: "Which migration path involves moving an application to the cloud [clue]with no code changes[/clue]?", 
      options: ["Refactor", "Lift and Shift (Rehost)", "Reimagine", "Retire"], 
      correctIndex: 1, 
      explanation: "Rehosting (Lift and Shift) moves the application as-is to Virtual Machines.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "Pick up and move." 
    },
    { 
      text: "What is a [clue]Virtual Machine (VM)[/clue]?", 
      options: ["A physical robot", "A software emulation of a physical computer", "A database", "A network cable"], 
      correctIndex: 1, 
      explanation: "VMs act like physical computers but run as software on Google's hardware.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "Digital computer." 
    },
    { 
      text: "What is the primary benefit of [clue]Serverless Computing[/clue]?", 
      options: ["You manage the physical servers", "You pay for idle time", "You manage no infrastructure and pay only for usage", "It is slower"], 
      correctIndex: 2, 
      explanation: "Serverless removes the need to manage servers and scales automatically.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "No ops." 
    },
    { 
      text: "Which Google Cloud product is designed for [clue]managing APIs[/clue]?", 
      options: ["Apigee", "Compute Engine", "Cloud Storage", "BigQuery"], 
      correctIndex: 0, 
      explanation: "Apigee is the platform for developing, managing, and securing APIs.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "API Management." 
    },
    { 
      text: "What is a [clue]Microservice[/clue]?", 
      options: ["A tiny computer", "Breaking a large app into small, independent services", "A large monolithic code file", "A type of storage"], 
      correctIndex: 1, 
      explanation: "Microservices architecture splits complex apps into small pieces that talk to each other.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "Small pieces." 
    },
    { 
      text: "Which service is best for running [clue]Containers[/clue] if you want Google to manage the cluster?", 
      options: ["Compute Engine", "Google Kubernetes Engine (GKE)", "Cloud SQL", "VPC"], 
      correctIndex: 1, 
      explanation: "GKE is the managed environment for deploying containerized applications.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "Managed Kubernetes." 
    },
    { 
      text: "What does [clue]Retire[/clue] mean in the context of migration?", 
      options: ["Moving to the cloud", "Turning off an app that is no longer needed", "Rewriting the app", "Keeping it on-prem"], 
      correctIndex: 1, 
      explanation: "Retiring involves decommissioning applications that provide no value.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "Shutting down." 
    },
    { 
      text: "What defines [clue]Hybrid Cloud[/clue]?", 
      options: ["Using only Google Cloud", "Using Google Cloud and AWS", "Using Google Cloud combined with On-Premises data centers", "Using no cloud"], 
      correctIndex: 2, 
      explanation: "Hybrid links your internal data center to the public cloud.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "Mixing On-prem and Cloud." 
    },
    { 
      text: "What is [clue]Cloud Run[/clue]?", 
      options: ["A database", "A serverless platform for running containers", "A storage unit", "A networking tool"], 
      correctIndex: 1, 
      explanation: "Cloud Run lets you run containers without managing the underlying nodes.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "Run containers easily." 
    },
    { 
      text: "What is an [clue]API (Application Programming Interface)[/clue]?", 
      options: ["A graphical user interface", "A software intermediary that allows two applications to talk to each other", "A hard drive", "A password"], 
      correctIndex: 1, 
      explanation: "APIs allow different software systems to communicate and exchange data.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "The messenger." 
    }
  ],
  5: [ // Section 5: Trust and Security
    { 
      text: "Which security concept ensures that data is [clue]accessible[/clue] when needed?", 
      options: ["Confidentiality", "Integrity", "Availability", "Authorization"], 
      correctIndex: 2, 
      explanation: "Availability ensures that authorized users have access to information and assets when required.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "CIA Triad: A." 
    },
    { 
      text: "What is the primary purpose of [clue]Google Cloud Armor[/clue]?", 
      options: ["Antivirus", "DDoS protection and WAF", "Password management", "Email filtering"], 
      correctIndex: 1, 
      explanation: "Cloud Armor protects applications from Distributed Denial of Service (DDoS) attacks and web exploits.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "The Shield." 
    },
    { 
      text: "By default, Google Cloud [clue]encrypts[/clue] customer data in which state?", 
      options: ["Only when paid for", "At rest", "Only in the US", "Never"], 
      correctIndex: 1, 
      explanation: "Google Cloud encrypts all customer data at rest by default, with no action required from the user.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "Automatic protection." 
    },
    { 
      text: "What is [clue]Identity and Access Management (IAM)[/clue]?", 
      options: ["A firewall", "A tool to define who can do what on which resource", "A database", "A VPN"], 
      correctIndex: 1, 
      explanation: "IAM is the framework for managing access control (permissions) for cloud resources.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "Who, What, Where." 
    },
    { 
      text: "What does [clue]2SV (Two-Step Verification)[/clue] prevent?", 
      options: ["DDoS attacks", "Unauthorized access using stolen passwords", "Viruses", "Hardware failure"], 
      correctIndex: 1, 
      explanation: "2SV requires a second form of proof (like a phone tap), stopping attackers who only have a password.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "Phone + Password." 
    },
    { 
      text: "Which Google Trust Principle states that [clue]you own your data[/clue]?", 
      options: ["Google owns your data", "The customer owns their data; Google processes it", "Data is public", "Google sells data"], 
      correctIndex: 1, 
      explanation: "Google explicitly states that customers retain ownership of their data and Google does not sell it.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "It's yours." 
    },
    { 
      text: "What is [clue]Phishing[/clue]?", 
      options: ["A network scan", "Deceptive attempts to steal credentials/info", "A type of encryption", "A firewall rule"], 
      correctIndex: 1, 
      explanation: "Phishing uses social engineering (like fake emails) to trick users into revealing secrets.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "Baiting users." 
    },
    { 
      text: "What is the difference between [clue]Authentication[/clue] and Authorization?", 
      options: ["They are the same", "Authentication = Who are you; Authorization = What can you do", "Authentication is for machines", "Authorization is for login"], 
      correctIndex: 1, 
      explanation: "AuthN verifies identity (ID badge); AuthZ checks permissions (Keycard access).", 
      difficulty: DifficultyLevel.EASY, 
      hint: "ID vs Permissions." 
    },
    { 
      text: "Which tool helps you find and redact [clue]Sensitive Data (PII)[/clue]?", 
      options: ["Cloud DLP (Data Loss Prevention)", "Compute Engine", "Cloud SQL", "VPC"], 
      correctIndex: 0, 
      explanation: "Cloud DLP scans data streams and storage for things like Credit Card numbers and redacts them.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "Preventing leaks." 
    },
    { 
      text: "What is [clue]Defense-in-Depth[/clue]?", 
      options: ["One strong firewall", "Layered security controls (Hardware, Network, User, Storage)", "Using deep learning", "Building underground data centers"], 
      correctIndex: 1, 
      explanation: "It involves multiple layers of defense so that if one fails, others are still in place.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "Layers like an onion." 
    }
  ],
  6: [ // Section 6: Scaling with Operations
    { 
      text: "Which tool sends [clue]notifications[/clue] when your cloud spending exceeds a specific dollar amount?", 
      options: ["Cloud Quotas", "Budgets and Alerts", "Cloud Trace", "IAM"], 
      correctIndex: 1, 
      explanation: "Budgets track spend and Alerts notify you (via email/Slack) when you hit a threshold.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "Spending alarm." 
    },
    { 
      text: "What is the [clue]root node[/clue] of the Google Cloud Resource Hierarchy?", 
      options: ["The Project", "The Folder", "The Organization", "The User"], 
      correctIndex: 2, 
      explanation: "The Organization node sits at the top; policies applied here flow down to everything.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "The Company." 
    },
    { 
      text: "What does [clue]SLA[/clue] stand for?", 
      options: ["Service Level Agreement", "Server Level Access", "Secure Local Area", "System Log Analysis"], 
      correctIndex: 0, 
      explanation: "An SLA is a financial commitment from Google to provide a certain level of uptime.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "The Contract." 
    },
    { 
      text: "Which Google Cloud tool helps you measure your [clue]environmental impact[/clue]?", 
      options: ["Carbon Footprint", "Cloud Trace", "Cloud Build", "BigQuery"], 
      correctIndex: 0, 
      explanation: "Carbon Footprint reports the greenhouse gas emissions associated with your usage.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "Green report." 
    },
    { 
      text: "What is a [clue]Quota[/clue] designed to prevent?", 
      options: ["Hackers", "Unintentional resource overuse or billing spikes", "Data loss", "Slow internet"], 
      correctIndex: 1, 
      explanation: "Quotas put a hard cap on how many resources (like CPUs) you can create to prevent accidents.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "The Cap." 
    },
    { 
      text: "What is the purpose of [clue]Labels[/clue] on resources?", 
      options: ["To encrypt them", "To organize and track costs (e.g., 'team:marketing')", "To speed up VMs", "To delete them"], 
      correctIndex: 1, 
      explanation: "Labels are key-value tags used for filtering in billing reports and operations.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "Tagging." 
    },
    { 
      text: "Which support plan is available to [clue]everyone for free[/clue]?", 
      options: ["Standard", "Basic", "Premium", "Enhanced"], 
      correctIndex: 1, 
      explanation: "Basic support is free and includes access to documentation and billing support.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "Entry level." 
    },
    { 
      text: "What is [clue]DevOps[/clue]?", 
      options: ["A software tool", "A culture combining Development and Operations to increase speed", "Buying servers", "Hiring more managers"], 
      correctIndex: 1, 
      explanation: "DevOps breaks down silos between those who write code and those who run it.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "Dev + Ops." 
    },
    { 
      text: "To group multiple projects by department (e.g., 'HR', 'IT'), use:", 
      options: ["Buckets", "Folders", "Labels", "Orgs"], 
      correctIndex: 1, 
      explanation: "Folders are used to group projects and apply policies to that group.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "File cabinet." 
    },
    { 
      text: "What is [clue]High Availability (HA)[/clue]?", 
      options: ["Using the cheapest server", "Designing systems that stay operational even when parts fail", "Backing up data", "Using faster CPUs"], 
      correctIndex: 1, 
      explanation: "HA ensures your service stays up (available) as much as possible.", 
      difficulty: DifficultyLevel.EASY, 
      hint: "Always Up." 
    }
  ]
};