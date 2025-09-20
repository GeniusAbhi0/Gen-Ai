export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface CareerOpportunity {
  title: string;
  match: number;
  description: string;
  demand: string;
}

export interface SkillToLearn {
  skill: string;
  priority: "High" | "Medium" | "Low";
  relevance: number;
}

export interface RoadmapPhase {
  phase: string;
  duration: string;
  title: string;
  description: string;
  resources: string[];
}
