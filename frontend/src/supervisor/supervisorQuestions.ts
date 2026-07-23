export interface SupervisorQuestionOption {
  id: string;
  label: string;
}

export interface SupervisorQuestion {
  id: string;
  category: string;
  title: string;
  context: string;
  prompt: string;
  options: readonly SupervisorQuestionOption[];
}

/**
 * Supervisor presentation questions.
 *
 * These questions mirror the 20-question participant survey for demonstration
 * purposes only. Supervisor responses remain browser-local through sessionStorage
 * and are not submitted to the research database.
 */
export const SUPERVISOR_QUESTIONS: readonly SupervisorQuestion[] = [
  {
    id: "conjunction-judgement-1",
    category: "Conjunction judgement",
    title: "Decision Scenario 1",
    context:
      "A person is described as highly analytical and detail-oriented.",
    prompt: "Which statement is more probable?",
    options: [
      {
        id: "finance",
        label: "The person works in finance.",
      },
      {
        id: "finance-investor",
        label:
          "The person works in finance and regularly invests in the stock market.",
      },
    ],
  },
  {
    id: "conjunction-judgement-2",
    category: "Conjunction judgement",
    title: "Decision Scenario 2",
    context:
      "A person is described as creative and enjoys working independently.",
    prompt: "Which statement is more probable?",
    options: [
      {
        id: "designer",
        label: "The person is a designer.",
      },
      {
        id: "designer-freelance",
        label: "The person is a designer and runs a freelance business.",
      },
    ],
  },
  {
    id: "conjunction-judgement-3",
    category: "Conjunction judgement",
    title: "Decision Scenario 3",
    context:
      "A person is described as socially active and interested in community work.",
    prompt: "Which statement is more probable?",
    options: [
      {
        id: "volunteers",
        label: "The person volunteers occasionally.",
      },
      {
        id: "volunteers-campaigns",
        label:
          "The person volunteers occasionally and participates in local campaigns.",
      },
    ],
  },
  {
    id: "conjunction-judgement-4",
    category: "Conjunction judgement",
    title: "Decision Scenario 4",
    context: "A student consistently performs well academically.",
    prompt: "Which statement is more probable?",
    options: [
      {
        id: "pass-exam",
        label: "The student will pass the exam.",
      },
      {
        id: "pass-exam-top-grade",
        label: "The student will pass the exam and achieve a top grade.",
      },
    ],
  },
  {
    id: "conjunction-judgement-5",
    category: "Conjunction judgement",
    title: "Decision Scenario 5",
    context:
      "A person is described as organised and enjoys working with data.",
    prompt: "Which statement is more probable?",
    options: [
      {
        id: "data-analyst",
        label: "The person works as a data analyst.",
      },
      {
        id: "data-analyst-models",
        label:
          "The person works as a data analyst and regularly builds predictive models.",
      },
    ],
  },

  {
    id: "framing-effect-1",
    category: "Framing",
    title: "Decision Scenario 6",
    context: "Investment Scenario. You are considering two investment options.",
    prompt: "Which option do you choose?",
    options: [
      {
        id: "guaranteed-return-500",
        label: "A guaranteed return of £500.",
      },
      {
        id: "chance-gain-1000",
        label:
          "A 50% chance to gain £1000 and a 50% chance to gain nothing.",
      },
    ],
  },
  {
    id: "framing-effect-2",
    category: "Framing",
    title: "Decision Scenario 7",
    context: "Loss Framing.",
    prompt: "Which option do you choose?",
    options: [
      {
        id: "guaranteed-loss-500",
        label: "A guaranteed loss of £500.",
      },
      {
        id: "chance-lose-1000",
        label:
          "A 50% chance to lose £1000 and a 50% chance to lose nothing.",
      },
    ],
  },
  {
    id: "framing-effect-3",
    category: "Framing",
    title: "Decision Scenario 8",
    context: "Business Decision. A company is deciding between two strategies.",
    prompt: "Which option is preferable?",
    options: [
      {
        id: "retain-profits",
        label: "This strategy will ensure 70% of profits are retained.",
      },
      {
        id: "lose-profits-risk",
        label: "This strategy carries a 30% chance of losing all profits.",
      },
    ],
  },
  {
    id: "framing-effect-4",
    category: "Framing",
    title: "Decision Scenario 9",
    context: "Insurance Decision.",
    prompt: "Which option do you choose?",
    options: [
      {
        id: "pay-avoid-loss",
        label: "Pay £200 to fully avoid a potential loss.",
      },
      {
        id: "chance-loss-1000",
        label: "20% chance of losing £1000 and 80% chance of losing nothing.",
      },
    ],
  },
  {
    id: "framing-effect-5",
    category: "Framing",
    title: "Decision Scenario 10",
    context: "Investment Framing.",
    prompt: "Which option do you prefer?",
    options: [
      {
        id: "gain-1000-80",
        label: "80% chance of gaining £1000.",
      },
      {
        id: "gain-nothing-20",
        label: "20% chance of gaining nothing.",
      },
    ],
  },

  {
    id: "risk-preference-1",
    category: "Risk preferences",
    title: "Decision Scenario 11",
    context: "Financial Choice.",
    prompt: "Which option do you choose?",
    options: [
      {
        id: "guaranteed-400",
        label: "Guaranteed £400.",
      },
      {
        id: "chance-900",
        label: "50% chance of £900 and 50% chance of £0.",
      },
    ],
  },
  {
    id: "risk-preference-2",
    category: "Risk preferences",
    title: "Decision Scenario 12",
    context: "Loss Scenario.",
    prompt: "Which option do you choose?",
    options: [
      {
        id: "guaranteed-loss-300",
        label: "Guaranteed loss of £300.",
      },
      {
        id: "chance-loss-700",
        label: "50% chance of losing £700 and 50% chance of losing nothing.",
      },
    ],
  },
  {
    id: "risk-preference-3",
    category: "Risk preferences",
    title: "Decision Scenario 13",
    context: "Career Decision.",
    prompt: "Which option do you prefer?",
    options: [
      {
        id: "stable-job",
        label: "Stable job with a fixed salary.",
      },
      {
        id: "startup-job",
        label:
          "Startup job with higher potential earnings but high uncertainty.",
      },
    ],
  },
  {
    id: "risk-preference-4",
    category: "Risk preferences",
    title: "Decision Scenario 14",
    context: "Investment Growth.",
    prompt: "Which option do you choose?",
    options: [
      {
        id: "guaranteed-2000",
        label: "Guaranteed return of £2000.",
      },
      {
        id: "chance-8000",
        label: "25% chance of £8000 and 75% chance of £0.",
      },
    ],
  },
  {
    id: "risk-preference-5",
    category: "Risk preferences",
    title: "Decision Scenario 15",
    context: "Project Choice.",
    prompt: "Which option do you choose?",
    options: [
      {
        id: "moderate-results",
        label: "Choose a project with guaranteed moderate results.",
      },
      {
        id: "high-potential-risk",
        label: "Choose a project with high potential but risk of failure.",
      },
    ],
  },

  {
    id: "probability-judgement-1",
    category: "Probability judgement",
    title: "Decision Scenario 16",
    context: "Card drawing scenario.",
    prompt: "Which statement is more probable?",
    options: [
      {
        id: "one-red-card",
        label: "Drawing one red card from a standard deck.",
      },
      {
        id: "two-red-cards",
        label: "Drawing two red cards consecutively without replacement.",
      },
    ],
  },
  {
    id: "probability-judgement-2",
    category: "Probability judgement",
    title: "Decision Scenario 17",
    context: "Ownership and commuting scenario.",
    prompt: "Which statement is more likely?",
    options: [
      {
        id: "owns-car",
        label: "A randomly selected individual owns a car.",
      },
      {
        id: "owns-car-commutes",
        label: "A randomly selected individual owns a car and commutes daily.",
      },
    ],
  },
  {
    id: "probability-judgement-3",
    category: "Probability judgement",
    title: "Decision Scenario 18",
    context: "Student performance scenario.",
    prompt: "Which statement is more probable?",
    options: [
      {
        id: "above-average",
        label: "A randomly selected student scores above average.",
      },
      {
        id: "above-average-distinction",
        label:
          "A randomly selected student scores above average and receives a distinction.",
      },
    ],
  },
  {
    id: "probability-judgement-4",
    category: "Probability judgement",
    title: "Decision Scenario 19",
    context: "Product quality scenario.",
    prompt: "Which statement is more likely?",
    options: [
      {
        id: "passes-inspection",
        label: "A product passes quality inspection.",
      },
      {
        id: "passes-shipped",
        label: "A product passes inspection and is shipped on time.",
      },
    ],
  },
  {
    id: "probability-judgement-5",
    category: "Probability judgement",
    title: "Decision Scenario 20",
    context: "Employment scenario.",
    prompt: "Which statement is more probable?",
    options: [
      {
        id: "employed",
        label: "A person is employed.",
      },
      {
        id: "employed-full-time",
        label: "A person is employed and works full-time.",
      },
    ],
  },
];