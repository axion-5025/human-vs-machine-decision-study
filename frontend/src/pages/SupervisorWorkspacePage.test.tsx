import {
  render,
  screen,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { SUPERVISOR_QUESTIONS } from "../supervisor/supervisorQuestions";
import {
  initializeSupervisorSession,
  saveSupervisorAnswer,
  startSupervisorQuestions,
  SUPERVISOR_SESSION_STORAGE_KEY,
} from "../supervisor/supervisorStorage";
import SupervisorWorkspacePage from "./SupervisorWorkspacePage";

type User = ReturnType<typeof userEvent.setup>;

const FIRST_QUESTION = SUPERVISOR_QUESTIONS[0];
const SECOND_QUESTION = SUPERVISOR_QUESTIONS[1];

if (!FIRST_QUESTION || !SECOND_QUESTION) {
  throw new Error("Supervisor question test fixtures are missing.");
}

function getSupervisorOptionLabel(
  questionIndex: number,
  optionIndex: number,
): string {
  const question = SUPERVISOR_QUESTIONS[questionIndex];

  if (!question) {
    throw new Error(`Missing supervisor question at index ${questionIndex}.`);
  }

  const option = question.options[optionIndex];

  if (!option) {
    throw new Error(
      `Missing supervisor option at question ${questionIndex}, option ${optionIndex}.`,
    );
  }

  return option.label;
}

function renderSupervisorWorkspacePage() {
  return render(
    <MemoryRouter>
      <SupervisorWorkspacePage />
    </MemoryRouter>,
  );
}

async function initializeAndBegin() {
  const user = userEvent.setup();

  renderSupervisorWorkspacePage();

  await user.click(
    screen.getByRole("button", {
      name: /start supervisor session/i,
    }),
  );

  await user.click(
    screen.getByRole("button", {
      name: /begin guided questions/i,
    }),
  );

  return user;
}

async function answerCurrentQuestion(
  user: User,
  questionIndex: number,
  optionIndex = 0,
) {
  await user.click(
    screen.getByLabelText(
      getSupervisorOptionLabel(questionIndex, optionIndex),
    ),
  );

  const isLastQuestion =
    questionIndex === SUPERVISOR_QUESTIONS.length - 1;

  await user.click(
    screen.getByRole("button", {
      name: isLastQuestion
        ? /finish experience/i
        : /continue/i,
    }),
  );
}

async function answerAllSupervisorQuestions(user: User) {
  for (
    let questionIndex = 0;
    questionIndex < SUPERVISOR_QUESTIONS.length;
    questionIndex += 1
  ) {
    await answerCurrentQuestion(
      user,
      questionIndex,
      questionIndex % 2,
    );
  }
}

describe("SupervisorWorkspacePage", () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("explains the research-data boundary", () => {
    renderSupervisorWorkspacePage();

    expect(
      screen.getByRole("heading", {
        name: /explore the study without affecting participant data/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/excluded from research results/i),
    ).toBeInTheDocument();

    expect(screen.getByText("Never created")).toBeInTheDocument();
    expect(screen.getByText("Disabled")).toBeInTheDocument();
  });

  it("initializes locally without making a network request", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn();

    vi.stubGlobal("fetch", fetchMock);

    renderSupervisorWorkspacePage();

    await user.click(
      screen.getByRole("button", {
        name: /start supervisor session/i,
      }),
    );

    expect(
      screen.getByRole("heading", {
        name: /supervisor workspace is ready/i,
      }),
    ).toBeInTheDocument();

    expect(
      sessionStorage.getItem(SUPERVISOR_SESSION_STORAGE_KEY),
    ).not.toBeNull();

    expect(localStorage.length).toBe(0);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("requires a response and completes all guided questions", async () => {
    const user = await initializeAndBegin();

    expect(
      screen.getByRole("button", { name: "Continue" }),
    ).toBeDisabled();

    expect(
      screen.getByText(
        `Question 1 of ${SUPERVISOR_QUESTIONS.length}`,
      ),
    ).toBeInTheDocument();

    await answerAllSupervisorQuestions(user);

    expect(
      screen.getByRole("heading", {
        name: /your responses are ready for review/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getAllByText(/70% confident/i),
    ).toHaveLength(SUPERVISOR_QUESTIONS.length);

    expect(
      screen.getByText(
        getSupervisorOptionLabel(
          SUPERVISOR_QUESTIONS.length - 1,
          (SUPERVISOR_QUESTIONS.length - 1) % 2,
        ),
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: /view comparative analysis/i,
      }),
    ).toHaveAttribute("href", "/supervisor/analysis");
  });

  it("restores the next question from session storage", () => {
    let session = startSupervisorQuestions(
      initializeSupervisorSession({
        sessionId: "supervisor-refresh-test",
        startedAt: "2026-06-26T12:00:00.000Z",
      }),
    );

    session = saveSupervisorAnswer(session, {
      questionId: FIRST_QUESTION.id,
      optionId: FIRST_QUESTION.options[0].id,
      confidence: 74,
      answeredAt: "2026-06-26T12:05:00.000Z",
    });

    expect(session.currentQuestionIndex).toBe(1);

    renderSupervisorWorkspacePage();

    expect(
      screen.getByRole("heading", {
        name: SECOND_QUESTION.title,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        `Question 2 of ${SUPERVISOR_QUESTIONS.length}`,
      ),
    ).toBeInTheDocument();
  });

  it("moves back to an answered question", async () => {
    const user = await initializeAndBegin();

    await answerCurrentQuestion(user, 0, 0);

    await user.click(
      screen.getByRole("button", { name: "Previous" }),
    );

    expect(
      screen.getByRole("heading", {
        name: FIRST_QUESTION.title,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(FIRST_QUESTION.options[0].label),
    ).toBeChecked();
  });

  it("restarts questions and resets the full session", async () => {
    const user = await initializeAndBegin();

    await answerAllSupervisorQuestions(user);

    await user.click(
      screen.getByRole("button", {
        name: /restart questions/i,
      }),
    );

    expect(
      screen.getByRole("heading", {
        name: FIRST_QUESTION.title,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Continue" }),
    ).toBeDisabled();

    const storedSession = sessionStorage.getItem(
      SUPERVISOR_SESSION_STORAGE_KEY,
    );

    expect(storedSession).not.toBeNull();

    sessionStorage.clear();

    renderSupervisorWorkspacePage();

    expect(
      screen.getAllByRole("button", {
        name: /start supervisor session/i,
      }),
    ).not.toHaveLength(0);
  });
});