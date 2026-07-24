import {
  expect,
  type Page,
  test,
} from "@playwright/test";

import { PRESENTATION_DATASET_ID } from "../src/supervisor/presentationAnalysis";
import { SUPERVISOR_QUESTIONS } from "../src/supervisor/supervisorQuestions";

const EXPECTED_SUPERVISOR_QUESTION_COUNT = 20;

function collectResearchApiRequests(page: Page): string[] {
  const requests: string[] = [];

  page.on("request", (request) => {
    const url = request.url();

    if (
      url.includes("/api/v1/") ||
      url.endsWith("/health")
    ) {
      requests.push(url);
    }
  });

  return requests;
}

async function startSupervisorQuestions(page: Page): Promise<void> {
  await page.goto("/supervisor");

  await page
    .getByRole("button", {
      name: /start supervisor session/i,
    })
    .click();

  await expect(
    page.getByRole("heading", {
      name: /supervisor workspace is ready/i,
    }),
  ).toBeVisible();

  await page
    .getByRole("button", {
      name: /begin guided questions/i,
    })
    .click();

  await expect(
    page.getByText(
      `Question 1 of ${SUPERVISOR_QUESTIONS.length}`,
    ),
  ).toBeVisible();
}

async function answerSupervisorQuestion(
  page: Page,
  questionIndex: number,
): Promise<void> {
  const question = SUPERVISOR_QUESTIONS[questionIndex];

  if (!question) {
    throw new Error(
      `Missing supervisor question at index ${questionIndex}.`,
    );
  }

  const option =
    question.options[questionIndex % question.options.length];

  if (!option) {
    throw new Error(
      `Missing supervisor option for question '${question.id}'.`,
    );
  }

  await expect(
    page.getByText(
      `Question ${questionIndex + 1} of ${SUPERVISOR_QUESTIONS.length}`,
    ),
  ).toBeVisible();

  await expect(
    page.getByRole("heading", {
      name: question.title,
    }),
  ).toBeVisible();

  await page
    .getByLabel(option.label)
    .check();

  const isLastQuestion =
    questionIndex === SUPERVISOR_QUESTIONS.length - 1;

  await page
    .getByRole("button", {
      name: isLastQuestion
        ? /finish experience/i
        : /continue/i,
    })
    .click();
}

async function completeSupervisorQuestions(
  page: Page,
): Promise<void> {
  for (
    let questionIndex = 0;
    questionIndex < SUPERVISOR_QUESTIONS.length;
    questionIndex += 1
  ) {
    await answerSupervisorQuestion(page, questionIndex);
  }

  await expect(
    page.getByRole("heading", {
      name: /your responses are ready for review/i,
    }),
  ).toBeVisible();
}

test.describe("supervisor workspace", () => {
  test("supervisor questions complete without API traffic", async ({
    page,
  }) => {
    expect(SUPERVISOR_QUESTIONS).toHaveLength(
      EXPECTED_SUPERVISOR_QUESTION_COUNT,
    );

    const apiRequests = collectResearchApiRequests(page);

    await startSupervisorQuestions(page);
    await completeSupervisorQuestions(page);

    await expect(
      page.getByText(/excluded from participant totals/i),
    ).toBeVisible();

    await expect(
      page.getByRole("link", {
        name: /view comparative analysis/i,
      }),
    ).toHaveAttribute("href", "/supervisor/analysis");

    expect(apiRequests).toEqual([]);
  });

  test("supervisor questions recover after refresh", async ({
    page,
  }) => {
    const apiRequests = collectResearchApiRequests(page);

    await startSupervisorQuestions(page);
    await answerSupervisorQuestion(page, 0);

    await expect(
      page.getByText(
        `Question 2 of ${SUPERVISOR_QUESTIONS.length}`,
      ),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", {
        name: SUPERVISOR_QUESTIONS[1].title,
      }),
    ).toBeVisible();

    await page.reload();

    await expect(
      page.getByText(
        `Question 2 of ${SUPERVISOR_QUESTIONS.length}`,
      ),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", {
        name: SUPERVISOR_QUESTIONS[1].title,
      }),
    ).toBeVisible();

    expect(apiRequests).toEqual([]);
  });

  test("presentation analysis remains isolated from research APIs", async ({
    page,
  }) => {
    const apiRequests = collectResearchApiRequests(page);

    await startSupervisorQuestions(page);
    await completeSupervisorQuestions(page);

    await page
      .getByRole("link", {
        name: /view comparative analysis/i,
      })
      .click();

    await expect(page).toHaveURL(/\/supervisor\/analysis$/);

    await expect(
      page.getByRole("heading", {
        name: /human and model decision patterns/i,
      }),
    ).toBeVisible();

    const analysisText = await page
      .locator("body")
      .innerText();

    expect(analysisText).toContain(
      PRESENTATION_DATASET_ID,
    );

    expect(analysisText).toMatch(
      /not live research results/i,
    );

    expect(analysisText).toMatch(
      /Research writes\s+0/i,
    );

    expect(analysisText).toMatch(
      /Live participant query\s+Never/i,
    );

    expect(analysisText).toMatch(
      /Local session source\s+sessionStorage/i,
    );

    expect(apiRequests).toEqual([]);
  });
});