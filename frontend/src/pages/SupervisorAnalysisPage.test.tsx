import {
  render,
  screen,
} from "@testing-library/react";
import {
  MemoryRouter,
  Route,
  Routes,
} from "react-router-dom";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  getPresentationScenario,
} from "../supervisor/presentationAnalysis";
import { SUPERVISOR_QUESTIONS } from "../supervisor/supervisorQuestions";
import {
  initializeSupervisorSession,
  saveSupervisorAnswer,
  startSupervisorQuestions,
} from "../supervisor/supervisorStorage";
import SupervisorAnalysisPage from "./SupervisorAnalysisPage";

type SupervisorQuestion = (typeof SUPERVISOR_QUESTIONS)[number];
type SupervisorOption = SupervisorQuestion["options"][number];

interface CompletedAnswerFixture {
  questionId: string;
  optionId: string;
  confidence: number;
}

function getSupervisorQuestion(index: number): SupervisorQuestion {
  const question = SUPERVISOR_QUESTIONS[index];

  if (!question) {
    throw new Error(`Missing supervisor question fixture at index ${index}.`);
  }

  return question;
}

function getSupervisorOption(
  question: SupervisorQuestion,
  optionId: string,
): SupervisorOption {
  const option = question.options.find(
    (candidate) => candidate.id === optionId,
  );

  if (!option) {
    throw new Error(
      `Missing supervisor option fixture '${optionId}' for '${question.id}'.`,
    );
  }

  return option;
}

function getAnswerFixture(questionIndex: number): CompletedAnswerFixture {
  const question = getSupervisorQuestion(questionIndex);
  const presentationScenario = getPresentationScenario(question.id);

  const optionId =
    presentationScenario?.consensusOptionId ?? question.options[0]?.id;

  if (!optionId) {
    throw new Error(`Missing supervisor option fixture for '${question.id}'.`);
  }

  return {
    questionId: question.id,
    optionId,
    confidence: 60 + questionIndex,
  };
}

function completeSupervisorSession(): CompletedAnswerFixture[] {
  let session = startSupervisorQuestions(
    initializeSupervisorSession({
      sessionId: "supervisor-analysis-test",
      startedAt: "2026-06-26T12:00:00.000Z",
    }),
  );

  const answers: CompletedAnswerFixture[] = [];

  for (
    let questionIndex = 0;
    questionIndex < SUPERVISOR_QUESTIONS.length;
    questionIndex += 1
  ) {
    const answer = getAnswerFixture(questionIndex);

    answers.push(answer);

    session = saveSupervisorAnswer(session, {
      ...answer,
      answeredAt: new Date(
        Date.UTC(2026, 5, 26, 12, questionIndex, 0),
      ).toISOString(),
    });
  }

  return answers;
}

function calculateExpectedAverageConfidence(
  answers: readonly CompletedAnswerFixture[],
): number {
  const total = answers.reduce(
    (sum, answer) => sum + answer.confidence,
    0,
  );

  return Math.round(total / answers.length);
}

function calculateExpectedConsensusAlignment(
  answers: readonly CompletedAnswerFixture[],
): number {
  return answers.filter((answer) => {
    const presentationScenario = getPresentationScenario(answer.questionId);

    return presentationScenario?.consensusOptionId === answer.optionId;
  }).length;
}

function renderAnalysisRoute() {
  return render(
    <MemoryRouter initialEntries={["/supervisor/analysis"]}>
      <Routes>
        <Route
          path="/supervisor/analysis"
          element={<SupervisorAnalysisPage />}
        />
        <Route
          path="/supervisor"
          element={<div>Supervisor workspace route</div>}
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe("SupervisorAnalysisPage", () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("redirects when no completed supervisor session exists", () => {
    renderAnalysisRoute();

    expect(
      screen.getByText("Supervisor workspace route"),
    ).toBeInTheDocument();
  });

  it("renders presentation-only comparison cards and charts", () => {
    completeSupervisorSession();
    renderAnalysisRoute();

    expect(
      screen.getByRole("heading", {
        name: /human and model decision patterns/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/not live research results/i),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Human benchmark",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Reasoning model",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("img", {
        name: /scenario alignment comparison chart/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("img", {
        name: /confidence comparison chart/i,
      }),
    ).toBeInTheDocument();
  });

  it("summarizes local confidence and consensus alignment", () => {
    const answers = completeSupervisorSession();

    renderAnalysisRoute();

    const expectedAverageConfidence =
      calculateExpectedAverageConfidence(answers);

    const expectedConsensusAlignment =
      calculateExpectedConsensusAlignment(answers);

    expect(
      screen.getAllByText(`${expectedAverageConfidence}%`).length,
    ).toBeGreaterThan(0);

    expect(
      screen.getByText(
        `${expectedConsensusAlignment}/${SUPERVISOR_QUESTIONS.length}`,
      ),
    ).toBeInTheDocument();

    const firstQuestion = getSupervisorQuestion(0);
    const firstAnswer = answers[0];

    if (!firstAnswer) {
      throw new Error("Missing first supervisor answer fixture.");
    }

    const firstSelectedOption = getSupervisorOption(
      firstQuestion,
      firstAnswer.optionId,
    );

    expect(
      screen.getByText(firstSelectedOption.label),
    ).toBeInTheDocument();
  });

  it("does not request live research data", () => {
    const fetchMock = vi.fn();

    vi.stubGlobal("fetch", fetchMock);

    completeSupervisorSession();
    renderAnalysisRoute();

    expect(fetchMock).not.toHaveBeenCalled();
    expect(localStorage.length).toBe(0);

    vi.unstubAllGlobals();
  });

  it("provides navigation back to the isolated workspace", () => {
    completeSupervisorSession();
    renderAnalysisRoute();

    expect(
      screen.getAllByRole("link", {
        name: /return to supervisor workspace/i,
      }),
    ).not.toHaveLength(0);
  });
});