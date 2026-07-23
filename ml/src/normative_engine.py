from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class NormativeDecision:
    scenario_id: str
    benchmark_option_id: str
    rationale: str


NORMATIVE_DECISIONS: tuple[NormativeDecision, ...] = (
    NormativeDecision(
        "conjunction-judgement-1",
        "finance",
        "The broader event is more probable than the combined finance-and-investing event.",
    ),
    NormativeDecision(
        "conjunction-judgement-2",
        "designer",
        "The broader designer statement is more probable than designer plus freelance business.",
    ),
    NormativeDecision(
        "conjunction-judgement-3",
        "volunteers",
        "The broader volunteering statement is more probable than volunteering plus campaign participation.",
    ),
    NormativeDecision(
        "conjunction-judgement-4",
        "pass-exam",
        "Passing the exam is broader than passing and achieving a top grade.",
    ),
    NormativeDecision(
        "conjunction-judgement-5",
        "data-analyst",
        "Working as a data analyst is broader than data analyst plus predictive modelling.",
    ),
    NormativeDecision(
        "framing-effect-1",
        "guaranteed-return-500",
        "The guaranteed gain is the conservative benchmark in the positive frame.",
    ),
    NormativeDecision(
        "framing-effect-2",
        "chance-lose-1000",
        "The risky loss option represents the common loss-frame benchmark used for comparison.",
    ),
    NormativeDecision(
        "framing-effect-3",
        "retain-profits",
        "Retaining profits is used as the stable benchmark for the business frame.",
    ),
    NormativeDecision(
        "framing-effect-4",
        "pay-avoid-loss",
        "Paying to avoid the potential loss removes uncertainty and is used as the protective benchmark.",
    ),
    NormativeDecision(
        "framing-effect-5",
        "gain-1000-80",
        "The high-probability gain is used as the positive-frame benchmark.",
    ),
    NormativeDecision(
        "risk-preference-1",
        "chance-900",
        "The risky option has higher expected value: 0.5 * 900 = 450, compared with guaranteed 400.",
    ),
    NormativeDecision(
        "risk-preference-2",
        "guaranteed-loss-300",
        "The guaranteed smaller loss is used as the conservative downside-risk benchmark.",
    ),
    NormativeDecision(
        "risk-preference-3",
        "stable-job",
        "The stable role represents the risk-averse benchmark under career uncertainty.",
    ),
    NormativeDecision(
        "risk-preference-4",
        "chance-8000",
        "The risky option has expected value 0.25 * 8000 = 2000, matching the guaranteed option while testing risk tolerance.",
    ),
    NormativeDecision(
        "risk-preference-5",
        "moderate-results",
        "Guaranteed moderate results are used as the stability benchmark for project selection.",
    ),
    NormativeDecision(
        "probability-judgement-1",
        "one-red-card",
        "One red card is more probable than two consecutive red cards.",
    ),
    NormativeDecision(
        "probability-judgement-2",
        "owns-car",
        "Owning a car is broader than owning a car and commuting daily.",
    ),
    NormativeDecision(
        "probability-judgement-3",
        "above-average",
        "Scoring above average is broader than scoring above average and receiving a distinction.",
    ),
    NormativeDecision(
        "probability-judgement-4",
        "passes-inspection",
        "Passing inspection is broader than passing inspection and shipping on time.",
    ),
    NormativeDecision(
        "probability-judgement-5",
        "employed",
        "Being employed is broader than being employed and working full-time.",
    ),
)


def get_normative_decision(scenario_id: str) -> NormativeDecision | None:
    for decision in NORMATIVE_DECISIONS:
        if decision.scenario_id == scenario_id:
            return decision

    return None


def main() -> None:
    print("scenario_id,benchmark_option_id,rationale")

    for decision in NORMATIVE_DECISIONS:
        print(
            f"{decision.scenario_id},"
            f"{decision.benchmark_option_id},"
            f"{decision.rationale}"
        )


if __name__ == "__main__":
    main()