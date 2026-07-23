export type ComparisonSeriesId =
  | "human"
  | "reasoning-model"
  | "general-model"
  | "lightweight-model";

export interface PresentationComparisonSeries {
  id: ComparisonSeriesId;
  label: string;
  category: string;
  alignment: number;
  confidence: number;
  consistency: number;
  summary: string;
}

export interface PresentationScenarioComparison {
  questionId: string;
  title: string;
  category: string;
  consensusOptionId: string;
  insight: string;
  alignment: Record<ComparisonSeriesId, number>;
}

export const PRESENTATION_DATA_NOTICE =
  "Illustrative presentation dataset. These values are not live research results.";

export const PRESENTATION_DATASET_ID = "supervisor-presentation-v2";

export const PRESENTATION_SERIES: readonly PresentationComparisonSeries[] = [
  {
    id: "human",
    label: "Human benchmark",
    category: "Illustrative participant aggregate",
    alignment: 63,
    confidence: 64,
    consistency: 72,
    summary:
      "A sample human baseline showing moderate alignment and variable confidence.",
  },
  {
    id: "reasoning-model",
    label: "Reasoning model",
    category: "Illustrative analytical model",
    alignment: 84,
    confidence: 78,
    consistency: 88,
    summary:
      "A presentation profile emphasizing deliberate, probability-aware reasoning.",
  },
  {
    id: "general-model",
    label: "General model",
    category: "Illustrative general-purpose model",
    alignment: 77,
    confidence: 74,
    consistency: 80,
    summary:
      "A balanced presentation profile with strong but not uniform alignment.",
  },
  {
    id: "lightweight-model",
    label: "Lightweight model",
    category: "Illustrative compact model",
    alignment: 63,
    confidence: 69,
    consistency: 65,
    summary:
      "A lower-cost presentation profile with more variation across scenarios.",
  },
];

export const PRESENTATION_SCENARIOS: readonly PresentationScenarioComparison[] = [
  {
    questionId: "conjunction-judgement-1",
    title: "Decision Scenario 1",
    category: "Conjunction judgement",
    consensusOptionId: "finance",
    insight:
      "The broader event is treated as the benchmark because a combined event cannot be more probable than one of its parts.",
    alignment: {
      human: 54,
      "reasoning-model": 88,
      "general-model": 79,
      "lightweight-model": 63,
    },
  },
  {
    questionId: "conjunction-judgement-2",
    title: "Decision Scenario 2",
    category: "Conjunction judgement",
    consensusOptionId: "designer",
    insight:
      "The benchmark favors the simpler probability statement over the more detailed combined description.",
    alignment: {
      human: 58,
      "reasoning-model": 86,
      "general-model": 78,
      "lightweight-model": 62,
    },
  },
  {
    questionId: "conjunction-judgement-3",
    title: "Decision Scenario 3",
    category: "Conjunction judgement",
    consensusOptionId: "volunteers",
    insight:
      "The normative comparison highlights how descriptive detail can make a less probable combined event feel more representative.",
    alignment: {
      human: 55,
      "reasoning-model": 87,
      "general-model": 77,
      "lightweight-model": 61,
    },
  },
  {
    questionId: "conjunction-judgement-4",
    title: "Decision Scenario 4",
    category: "Conjunction judgement",
    consensusOptionId: "pass-exam",
    insight:
      "Passing the exam is broader than passing and achieving a top grade, so it is the stronger probability benchmark.",
    alignment: {
      human: 60,
      "reasoning-model": 89,
      "general-model": 80,
      "lightweight-model": 64,
    },
  },
  {
    questionId: "conjunction-judgement-5",
    title: "Decision Scenario 5",
    category: "Conjunction judgement",
    consensusOptionId: "data-analyst",
    insight:
      "The analytical profile resists the added-detail effect and selects the broader event.",
    alignment: {
      human: 57,
      "reasoning-model": 88,
      "general-model": 79,
      "lightweight-model": 63,
    },
  },

  {
    questionId: "framing-effect-1",
    title: "Decision Scenario 6",
    category: "Framing",
    consensusOptionId: "guaranteed-return-500",
    insight:
      "The presentation benchmark treats the guaranteed gain as the safer framing choice.",
    alignment: {
      human: 62,
      "reasoning-model": 81,
      "general-model": 74,
      "lightweight-model": 59,
    },
  },
  {
    questionId: "framing-effect-2",
    title: "Decision Scenario 7",
    category: "Framing",
    consensusOptionId: "chance-lose-1000",
    insight:
      "Loss framing often increases risk-seeking behaviour, so the risky loss option is used as the illustrative consensus.",
    alignment: {
      human: 61,
      "reasoning-model": 80,
      "general-model": 73,
      "lightweight-model": 58,
    },
  },
  {
    questionId: "framing-effect-3",
    title: "Decision Scenario 8",
    category: "Framing",
    consensusOptionId: "retain-profits",
    insight:
      "The retained-profit framing provides a stable benchmark for comparing gain-preserving choices.",
    alignment: {
      human: 64,
      "reasoning-model": 82,
      "general-model": 75,
      "lightweight-model": 60,
    },
  },
  {
    questionId: "framing-effect-4",
    title: "Decision Scenario 9",
    category: "Framing",
    consensusOptionId: "pay-avoid-loss",
    insight:
      "The benchmark favors the protective option because it removes the uncertainty of a larger loss.",
    alignment: {
      human: 59,
      "reasoning-model": 79,
      "general-model": 72,
      "lightweight-model": 57,
    },
  },
  {
    questionId: "framing-effect-5",
    title: "Decision Scenario 10",
    category: "Framing",
    consensusOptionId: "gain-1000-80",
    insight:
      "The high-probability gain option is used as the presentation benchmark for positive framing.",
    alignment: {
      human: 65,
      "reasoning-model": 83,
      "general-model": 76,
      "lightweight-model": 61,
    },
  },

  {
    questionId: "risk-preference-1",
    title: "Decision Scenario 11",
    category: "Risk preferences",
    consensusOptionId: "chance-900",
    insight:
      "The risky option has a higher expected value, so it is used as the analytical benchmark.",
    alignment: {
      human: 73,
      "reasoning-model": 83,
      "general-model": 78,
      "lightweight-model": 67,
    },
  },
  {
    questionId: "risk-preference-2",
    title: "Decision Scenario 12",
    category: "Risk preferences",
    consensusOptionId: "guaranteed-loss-300",
    insight:
      "The guaranteed smaller loss is used as the conservative benchmark for downside risk.",
    alignment: {
      human: 66,
      "reasoning-model": 80,
      "general-model": 75,
      "lightweight-model": 64,
    },
  },
  {
    questionId: "risk-preference-3",
    title: "Decision Scenario 13",
    category: "Risk preferences",
    consensusOptionId: "stable-job",
    insight:
      "The stable job option represents risk-averse decision behaviour under career uncertainty.",
    alignment: {
      human: 70,
      "reasoning-model": 78,
      "general-model": 74,
      "lightweight-model": 66,
    },
  },
  {
    questionId: "risk-preference-4",
    title: "Decision Scenario 14",
    category: "Risk preferences",
    consensusOptionId: "chance-8000",
    insight:
      "The high-upside option has comparable expected value and highlights tolerance for variance.",
    alignment: {
      human: 68,
      "reasoning-model": 84,
      "general-model": 77,
      "lightweight-model": 65,
    },
  },
  {
    questionId: "risk-preference-5",
    title: "Decision Scenario 15",
    category: "Risk preferences",
    consensusOptionId: "moderate-results",
    insight:
      "The guaranteed moderate outcome is used as the project-risk stability benchmark.",
    alignment: {
      human: 71,
      "reasoning-model": 79,
      "general-model": 76,
      "lightweight-model": 66,
    },
  },

  {
    questionId: "probability-judgement-1",
    title: "Decision Scenario 16",
    category: "Probability judgement",
    consensusOptionId: "one-red-card",
    insight:
      "A single red-card event is more probable than two consecutive red-card events.",
    alignment: {
      human: 60,
      "reasoning-model": 90,
      "general-model": 81,
      "lightweight-model": 66,
    },
  },
  {
    questionId: "probability-judgement-2",
    title: "Decision Scenario 17",
    category: "Probability judgement",
    consensusOptionId: "owns-car",
    insight:
      "Owning a car is broader than owning a car and commuting daily.",
    alignment: {
      human: 59,
      "reasoning-model": 89,
      "general-model": 80,
      "lightweight-model": 65,
    },
  },
  {
    questionId: "probability-judgement-3",
    title: "Decision Scenario 18",
    category: "Probability judgement",
    consensusOptionId: "above-average",
    insight:
      "Scoring above average is broader than scoring above average and receiving a distinction.",
    alignment: {
      human: 58,
      "reasoning-model": 88,
      "general-model": 79,
      "lightweight-model": 64,
    },
  },
  {
    questionId: "probability-judgement-4",
    title: "Decision Scenario 19",
    category: "Probability judgement",
    consensusOptionId: "passes-inspection",
    insight:
      "Passing inspection is broader than passing inspection and being shipped on time.",
    alignment: {
      human: 61,
      "reasoning-model": 89,
      "general-model": 80,
      "lightweight-model": 65,
    },
  },
  {
    questionId: "probability-judgement-5",
    title: "Decision Scenario 20",
    category: "Probability judgement",
    consensusOptionId: "employed",
    insight:
      "Being employed is broader than being employed and working full-time.",
    alignment: {
      human: 60,
      "reasoning-model": 88,
      "general-model": 79,
      "lightweight-model": 64,
    },
  },
];

export function calculateRoundedAverage(
  values: readonly number[],
): number {
  if (values.length === 0) {
    return 0;
  }

  const total = values.reduce(
    (sum, value) => sum + value,
    0,
  );

  return Math.round(total / values.length);
}

export function getPresentationScenario(
  questionId: string,
): PresentationScenarioComparison | undefined {
  return PRESENTATION_SCENARIOS.find(
    (scenario) => scenario.questionId === questionId,
  );
}