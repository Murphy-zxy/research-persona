
export interface Question {
  id: number;
  text: string;
  options: Option[];
}

export interface Option {
  id: string;
  text: string;
  weights: {
    theory: number;        // 理论 vs 应用
    breadth: number;       // 广度 vs 深度
    risk: number;          // 风险 vs 稳健
    collaboration: number; // 独立 vs 合作
    exploration: number;   // 探索 vs 优化
    labType: number;       // Wet Lab (-5) vs Dry Lab (+5)
    modelFocus: number;    // 模型开发 (high) vs 模型应用 (low)
    policyFocus: number;   // 技术导向 (low) vs 政策/社会分析 (high)
  };
}

export interface ResearchScores {
  theory: number;
  breadth: number;
  risk: number;
  collaboration: number;
  exploration: number;
  labType: number;
  modelFocus: number;
  policyFocus: number;
}

export interface PersonaAnalysis {
  archetype: string;
  title: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  tasteAdvice: string;
  matchedResearchers: string[];
}

export enum AppState {
  WELCOME,
  QUIZ,
  ANALYZING,
  RESULT
}
