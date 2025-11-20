export interface FactRecord {
  questions: string[];
  answer: string;
  tags?: string[];
  language?: string;
  embedding?: number[];
}

export interface GenerateAnswerParams {
  context: string;
  question: string;
  language: string;
  allowGeneral?: boolean;
}

