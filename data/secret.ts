import { Question, DifficultyLevel } from '../types';

export const SECRET_QUESTIONS: Record<number, Question[]> = {
  99: [
    {
      text: "Before Kubernetes was open-sourced, what was the internal Google system that managed containers for a decade?",
      options: ["Omega", "Borg", "Vader", "Locutus"],
      correctIndex: 1,
      explanation: "Borg was the internal predecessor to Kubernetes. K8s was built based on lessons learned from running Borg at scale.",
      difficulty: DifficultyLevel.HARD,
      hint: "Resistance is futile."
    },
    {
      text: "What was the very [clue]first product[/clue] Google Cloud launched in 2008?",
      options: ["Compute Engine", "Cloud Storage", "App Engine", "BigQuery"],
      correctIndex: 2,
      explanation: "Google App Engine (GAE) launched in April 2008, long before the term 'Serverless' was popular.",
      difficulty: DifficultyLevel.HARD,
      hint: "PaaS pioneer."
    },
    {
      text: "Google wraps its subsea cables in [clue]Kevlar[/clue]. Why?",
      options: ["To protect against russian subs", "To protect against shark bites", "To improve speed", "To look cool"],
      correctIndex: 1,
      explanation: "In the past, sharks were attracted to the electromagnetic fields of the cables and tried to bite them.",
      difficulty: DifficultyLevel.HARD,
      hint: "Jaws."
    },
    {
      text: "What is the name of the internal security model that evolved into the public [clue]Zero Trust[/clue] offering?",
      options: ["BeyondCorp", "IronDome", "SkyNet", "TrustNoOne"],
      correctIndex: 0,
      explanation: "BeyondCorp is the internal Google initiative that shifted access controls from the network perimeter to individual users.",
      difficulty: DifficultyLevel.HARD,
      hint: "Beyond the Corporate Network."
    },
    {
      text: "To save energy, Google uses [clue]AI[/clue] to manage data center cooling. How much energy did this save?",
      options: ["5%", "10%", "40%", "90%"],
      correctIndex: 2,
      explanation: "DeepMind AI reduced the energy used for cooling by 40%, a massive sustainability win.",
      difficulty: DifficultyLevel.HARD,
      hint: "Almost half."
    },
    {
      text: "What happens to a Google hard drive when it is [clue]retired[/clue]?",
      options: ["It is sold on eBay", "It is crushed and shredded", "It is thrown in a lake", "It is reformatted and donated"],
      correctIndex: 1,
      explanation: "Google follows a strict destruction policy (shredding/crushing) to ensure no data can ever be recovered.",
      difficulty: DifficultyLevel.HARD,
      hint: "Physical destruction."
    },
    {
      text: "The seminal whitepaper that led to the creation of [clue]Hadoop[/clue] was based on which Google technology?",
      options: ["MapReduce", "BigTable", "Spanner", "Colossus"],
      correctIndex: 0,
      explanation: "The Google MapReduce paper (2004) inspired Doug Cutting to create Hadoop.",
      difficulty: DifficultyLevel.HARD,
      hint: "Mapping and Reducing."
    },
    {
      text: "Google's private global network is named after which planet (internal code name)?",
      options: ["Mars", "Jupiter", "Saturn", "Pluto"],
      correctIndex: 1,
      explanation: "Google's datacenter network fabric generation is often codenamed Jupiter.",
      difficulty: DifficultyLevel.HARD,
      hint: "The biggest gas giant."
    },
    {
      text: "What is the [clue]Gopher[/clue]?",
      options: ["A mascot for the Go language", "A tunneling protocol", "A Cloud SQL tool", "A security flaw"],
      correctIndex: 0,
      explanation: "The Go Gopher is the iconic mascot for the Go (Golang) programming language, created at Google.",
      difficulty: DifficultyLevel.HARD,
      hint: "Golang mascot."
    },
    {
      text: "Google Cloud aims to operate on [clue]24/7 Carbon-Free Energy[/clue] by what year?",
      options: ["2025", "2030", "2040", "2050"],
      correctIndex: 1,
      explanation: "This is the most ambitious sustainability goal in the industry: clean energy, every hour, everywhere, by 2030.",
      difficulty: DifficultyLevel.HARD,
      hint: "The next decade."
    }
  ]
};