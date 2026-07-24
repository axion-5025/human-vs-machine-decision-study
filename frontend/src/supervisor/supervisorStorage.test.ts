import {
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import { SUPERVISOR_QUESTIONS } from "./supervisorQuestions";

import {
  clearSupervisorSession,
  initializeSupervisorSession,
  loadSupervisorSession,
  restartSupervisorQuestions,
  saveSupervisorAnswer,
  setSupervisorQuestionIndex,
  startSupervisorQuestions,
  SUPERVISOR_SESSION_STORAGE_KEY,
} from "./supervisorStorage";

function createSupervisorAnswer(
  questionIndex: number,
  optionIndex = 0,
  confidence = 72,
) {
  const question = SUPERVISOR_QUESTIONS[questionIndex];

  if (!question) {
    throw new Error(`Missing supervisor question fixture at index ${questionIndex}.`);
  }

  const option = question.options[optionIndex];

  if (!option) {
    throw new Error(
      `Missing supervisor option fixture at question ${questionIndex}, option ${optionIndex}.`,
    );
  }

  return {
    questionId: question.id,
    optionId: option.id,
    confidence,
    answeredAt: new Date(
      Date.UTC(2026, 5, 26, 12, questionIndex, 0),
    ).toISOString(),
  };
}

const FIRST_ANSWER = createSupervisorAnswer(
  0,
  0,
  72,
);

describe("supervisorStorage", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("stores an isolated ready session in sessionStorage", () => {
    const session = initializeSupervisorSession({
      sessionId: "supervisor-storage-test",
      startedAt: "2026-06-26T12:00:00.000Z",
    });

    expect(session).toEqual({
      version: 2,
      sessionId: "supervisor-storage-test",
      startedAt: "2026-06-26T12:00:00.000Z",
      phase: "ready",
      currentQuestionIndex: 0,
      answers: [],
      storage: "session",
      affectsResearchData: false,
    });

    expect(loadSupervisorSession()).toEqual(session);
    expect(localStorage.length).toBe(0);
  });

  it("starts and persists the guided questions", () => {
    const session = initializeSupervisorSession({
      sessionId: "supervisor-start-test",
    });

    const updatedSession = startSupervisorQuestions(session);

    expect(updatedSession.phase).toBe("questions");
    expect(updatedSession.currentQuestionIndex).toBe(0);
    expect(loadSupervisorSession()).toEqual(updatedSession);
  });

  it("saves answers, advances questions, and completes the experience", () => {
    let session = startSupervisorQuestions(
      initializeSupervisorSession({
        sessionId: "supervisor-answer-test",
      }),
    );

    session = saveSupervisorAnswer(session, FIRST_ANSWER);

    expect(session.phase).toBe("questions");
    expect(session.currentQuestionIndex).toBe(1);
    expect(session.answers).toEqual([FIRST_ANSWER]);

    for (
      let questionIndex = 1;
      questionIndex < SUPERVISOR_QUESTIONS.length;
      questionIndex += 1
    ) {
      session = saveSupervisorAnswer(
        session,
        createSupervisorAnswer(
          questionIndex,
          questionIndex % 2,
          60 + questionIndex,
        ),
      );
    }

    expect(session.phase).toBe("complete");
    expect(session.currentQuestionIndex).toBe(
      SUPERVISOR_QUESTIONS.length - 1,
    );
    expect(session.answers).toHaveLength(SUPERVISOR_QUESTIONS.length);
    expect(session.completedAt).toEqual(expect.any(String));
    expect(loadSupervisorSession()).toEqual(session);
  });

  it("allows navigation to an answered question and a clean restart", () => {
    let session = startSupervisorQuestions(
      initializeSupervisorSession({
        sessionId: "supervisor-navigation-test",
      }),
    );

    session = saveSupervisorAnswer(session, FIRST_ANSWER);
    session = setSupervisorQuestionIndex(session, 0);

    expect(session.currentQuestionIndex).toBe(0);
    expect(session.phase).toBe("questions");

    session = restartSupervisorQuestions(session);

    expect(session.currentQuestionIndex).toBe(0);
    expect(session.answers).toEqual([]);
    expect(session.phase).toBe("questions");
  });

  it("rejects unknown questions, options, confidence, and indexes", () => {
    const session = startSupervisorQuestions(
      initializeSupervisorSession({
        sessionId: "supervisor-validation-test",
      }),
    );

    expect(() =>
      saveSupervisorAnswer(session, {
        ...FIRST_ANSWER,
        questionId: "unknown-question",
      }),
    ).toThrow("Unknown supervisor question.");

    expect(() =>
      saveSupervisorAnswer(session, {
        ...FIRST_ANSWER,
        optionId: "unknown-option",
      }),
    ).toThrow("Unknown supervisor response option.");

    expect(() =>
      saveSupervisorAnswer(session, {
        ...FIRST_ANSWER,
        confidence: 101,
      }),
    ).toThrow("Confidence must be an integer from 0 to 100.");

    expect(() =>
      setSupervisorQuestionIndex(session, -1),
    ).toThrow("Supervisor question index is out of range.");
  });

  it("removes malformed and legacy workspace state", () => {
    sessionStorage.setItem(
      SUPERVISOR_SESSION_STORAGE_KEY,
      JSON.stringify({
        version: 2,
        affectsResearchData: true,
      }),
    );

    sessionStorage.setItem(
      "decision-study.supervisor-workspace.v1",
      "legacy-value",
    );

    expect(loadSupervisorSession()).toBeNull();

    expect(
      sessionStorage.getItem(SUPERVISOR_SESSION_STORAGE_KEY),
    ).toBeNull();

    expect(
      sessionStorage.getItem(
        "decision-study.supervisor-workspace.v1",
      ),
    ).toBeNull();
  });

  it("clears only supervisor workspace keys", () => {
    sessionStorage.setItem("other-session-key", "keep-me");

    initializeSupervisorSession({
      sessionId: "supervisor-clear-test",
    });

    clearSupervisorSession();

    expect(loadSupervisorSession()).toBeNull();
    expect(
      sessionStorage.getItem("other-session-key"),
    ).toBe("keep-me");
  });
});