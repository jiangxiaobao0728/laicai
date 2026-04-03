export interface Representative {
  name: string;
  title: string;
  story: string;
  image: string;
}

export interface Dimension {
  id: string;
  name: string;
  description: string;
  careers: string[];
  color: string;
  profile: string;
  strengths: string[];
  blindSpots: string[];
  actionSteps: string[];
  mindset: string;
  representative: Representative;
}

export interface Option {
  text: string;
  score: number;
}

export interface Question {
  id: number;
  dimensionId: string;
  text: string;
  options: Option[];
}

export interface Answer {
  questionId: number;
  score: number;
}

export type TestPhase = 'welcome' | 'testing' | 'result';
