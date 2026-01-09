
import { Question } from './types';

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "在阅读论文时，你对以下“美感”敏感度如何？",
    options: [
      { id: 'a', text: "深层逻辑与普适框架的简洁美", weights: { theory: 2, breadth: 1, risk: 1, collaboration: -1, exploration: 1, labType: 1, modelFocus: 2, policyFocus: -1 } },
      { id: 'b', text: "解决实际工程/社会问题的效能美", weights: { theory: -2, breadth: 0, risk: 0, collaboration: 1, exploration: -1, labType: 0, modelFocus: -1, policyFocus: 1 } },
      { id: 'c', text: "跨领域思维碰撞产生的新奇美", weights: { theory: 1, breadth: 2, risk: 1, collaboration: 1, exploration: 2, labType: 0, modelFocus: 0, policyFocus: 2 } }
    ]
  },
  {
    id: 2,
    text: "面对一个全新的科研周期，你的切入点如何偏向？",
    options: [
      { id: 'a', text: "深挖某个未被定义的纯粹未知点", weights: { theory: 1, breadth: 1, risk: 2, collaboration: -1, exploration: 2, labType: 0, modelFocus: 2, policyFocus: 0 } },
      { id: 'b', text: "在成熟领域追求极致的精确度", weights: { theory: -1, breadth: -1, risk: -2, collaboration: 0, exploration: -2, labType: 0, modelFocus: -1, policyFocus: -1 } },
      { id: 'c', text: "在多变量的复杂系统中寻找平衡", weights: { theory: 0, breadth: 1, risk: 1, collaboration: 2, exploration: 1, labType: 0, modelFocus: 0, policyFocus: 2 } }
    ]
  },
  {
    id: 3,
    text: "你渴望在什么样的“信息流”中工作？",
    options: [
      { id: 'a', text: "微观世界的物理化学信号流", weights: { theory: -1, breadth: -1, risk: 1, collaboration: 1, exploration: 1, labType: -3, modelFocus: -1, policyFocus: -1 } },
      { id: 'b', text: "高吞吐量的纯代码与比特流", weights: { theory: 1, breadth: 1, risk: 1, collaboration: -1, exploration: 1, labType: 3, modelFocus: 3, policyFocus: -2 } },
      { id: 'c', text: "宏观维度的政策文本与社会脉动", weights: { theory: 1, breadth: 2, risk: -1, collaboration: 0, exploration: 0, labType: 1, modelFocus: -2, policyFocus: 3 } }
    ]
  },
  {
    id: 4,
    text: "对于“科研工具”，你的第一直觉是？",
    options: [
      { id: 'a', text: "创造一个前所未有的底层工具/模型", weights: { theory: 1, breadth: 0, risk: 2, collaboration: -1, exploration: 2, labType: 0, modelFocus: 3, policyFocus: -1 } },
      { id: 'b', text: "将现有最强工具应用到深水区", weights: { theory: -1, breadth: 1, risk: -1, collaboration: 1, exploration: -1, labType: 0, modelFocus: -3, policyFocus: 0 } },
      { id: 'c', text: "从政策视角审视工具的公正性", weights: { theory: 1, breadth: 1, risk: 0, collaboration: 2, exploration: 1, labType: 0, modelFocus: -1, policyFocus: 3 } }
    ]
  },
  {
    id: 5,
    text: "你希望你的 Research 最终沉淀为什么？",
    options: [
      { id: 'a', text: "教科书里的定理（长期价值）", weights: { theory: 3, breadth: -1, risk: 2, collaboration: -2, exploration: 2, labType: 0, modelFocus: 1, policyFocus: -2 } },
      { id: 'b', text: "行业的核心产品/标准（应用价值）", weights: { theory: -2, breadth: 0, risk: -1, collaboration: 2, exploration: -1, labType: -1, modelFocus: -1, policyFocus: -1 } },
      { id: 'c', text: "政府/国际组织的行动建议（社会价值）", weights: { theory: 0, breadth: 2, risk: 1, collaboration: 2, exploration: 1, labType: 0, modelFocus: -2, policyFocus: 3 } }
    ]
  }
];
