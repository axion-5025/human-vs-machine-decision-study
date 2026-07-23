from __future__ import annotations

import csv
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = PROJECT_ROOT / "data" / "synthetic_training_data.csv"


SCENARIOS = [
    ("conjunction-judgement-1", "conjunction-judgement", "finance",
     ("A", "finance", "The person works in finance.", 1, 0, 0),
     ("B", "finance-investor", "The person works in finance and regularly invests in the stock market.", 0, 0, 0)),
    ("conjunction-judgement-2", "conjunction-judgement", "designer",
     ("A", "designer", "The person is a designer.", 1, 0, 0),
     ("B", "designer-freelance", "The person is a designer and runs a freelance business.", 0, 0, 0)),
    ("conjunction-judgement-3", "conjunction-judgement", "volunteers",
     ("A", "volunteers", "The person volunteers occasionally.", 1, 0, 0),
     ("B", "volunteers-campaigns", "The person volunteers occasionally and participates in local campaigns.", 0, 0, 0)),
    ("conjunction-judgement-4", "conjunction-judgement", "pass-exam",
     ("A", "pass-exam", "The student will pass the exam.", 1, 0, 0),
     ("B", "pass-exam-top-grade", "The student will pass the exam and achieve a top grade.", 0, 0, 0)),
    ("conjunction-judgement-5", "conjunction-judgement", "data-analyst",
     ("A", "data-analyst", "The person works as a data analyst.", 1, 0, 0),
     ("B", "data-analyst-models", "The person works as a data analyst and regularly builds predictive models.", 0, 0, 0)),

    ("framing-effect-1", "framing", "guaranteed-return-500",
     ("A", "guaranteed-return-500", "A guaranteed return of 500.", 0, 0, 0),
     ("B", "chance-gain-1000", "A 50% chance to gain 1000 and a 50% chance to gain nothing.", 0, 0, 0)),
    ("framing-effect-2", "framing", "chance-lose-1000",
     ("A", "guaranteed-loss-500", "A guaranteed loss of 500.", 0, 0, 1),
     ("B", "chance-lose-1000", "A 50% chance to lose 1000 and a 50% chance to lose nothing.", 0, 0, 0)),
    ("framing-effect-3", "framing", "retain-profits",
     ("A", "retain-profits", "This strategy will ensure 70% of profits are retained.", 0, 0, 0),
     ("B", "lose-profits-risk", "This strategy carries a 30% chance of losing all profits.", 0, 0, 0)),
    ("framing-effect-4", "framing", "pay-avoid-loss",
     ("A", "pay-avoid-loss", "Pay 200 to fully avoid a potential loss.", 0, 0, 1),
     ("B", "chance-loss-1000", "20% chance of losing 1000 and 80% chance of losing nothing.", 0, 0, 0)),
    ("framing-effect-5", "framing", "gain-1000-80",
     ("A", "gain-1000-80", "80% chance of gaining 1000.", 0, 1, 0),
     ("B", "gain-nothing-20", "20% chance of gaining nothing.", 0, 0, 0)),

    ("risk-preference-1", "risk-preference", "chance-900",
     ("A", "guaranteed-400", "Guaranteed 400.", 0, 0, 0),
     ("B", "chance-900", "50% chance of 900 and 50% chance of 0.", 0, 1, 0)),
    ("risk-preference-2", "risk-preference", "guaranteed-loss-300",
     ("A", "guaranteed-loss-300", "Guaranteed loss of 300.", 0, 0, 1),
     ("B", "chance-loss-700", "50% chance of losing 700 and 50% chance of losing nothing.", 0, 0, 0)),
    ("risk-preference-3", "risk-preference", "stable-job",
     ("A", "stable-job", "Stable job with a fixed salary.", 0, 0, 1),
     ("B", "startup-job", "Startup job with higher potential earnings but high uncertainty.", 0, 1, 0)),
    ("risk-preference-4", "risk-preference", "chance-8000",
     ("A", "guaranteed-2000", "Guaranteed return of 2000.", 0, 0, 0),
     ("B", "chance-8000", "25% chance of 8000 and 75% chance of 0.", 0, 1, 0)),
    ("risk-preference-5", "risk-preference", "moderate-results",
     ("A", "moderate-results", "Choose a project with guaranteed moderate results.", 0, 0, 1),
     ("B", "high-potential-risk", "Choose a project with high potential but risk of failure.", 0, 1, 0)),

    ("probability-judgement-1", "probability-judgement", "one-red-card",
     ("A", "one-red-card", "Drawing one red card from a standard deck.", 1, 0, 0),
     ("B", "two-red-cards", "Drawing two red cards consecutively without replacement.", 0, 0, 0)),
    ("probability-judgement-2", "probability-judgement", "owns-car",
     ("A", "owns-car", "A randomly selected individual owns a car.", 1, 0, 0),
     ("B", "owns-car-commutes", "A randomly selected individual owns a car and commutes daily.", 0, 0, 0)),
    ("probability-judgement-3", "probability-judgement", "above-average",
     ("A", "above-average", "A randomly selected student scores above average.", 1, 0, 0),
     ("B", "above-average-distinction", "A randomly selected student scores above average and receives a distinction.", 0, 0, 0)),
    ("probability-judgement-4", "probability-judgement", "passes-inspection",
     ("A", "passes-inspection", "A product passes quality inspection.", 1, 0, 0),
     ("B", "passes-shipped", "A product passes inspection and is shipped on time.", 0, 0, 0)),
    ("probability-judgement-5", "probability-judgement", "employed",
     ("A", "employed", "A person is employed.", 1, 0, 0),
     ("B", "employed-full-time", "A person is employed and works full-time.", 0, 0, 0)),
]


def main() -> None:
    DATA_PATH.parent.mkdir(parents=True, exist_ok=True)

    fieldnames = [
        "scenario_id",
        "category",
        "option_code",
        "option_id",
        "option_label",
        "option_is_broader_event",
        "option_has_expected_value_advantage",
        "option_is_loss_protective",
        "is_benchmark_choice",
    ]

    rows = []

    for scenario_id, category, benchmark_option_id, option_a, option_b in SCENARIOS:
        for option_code, option_id, option_label, broader, expected_value, loss_protective in (option_a, option_b):
            rows.append(
                {
                    "scenario_id": scenario_id,
                    "category": category,
                    "option_code": option_code,
                    "option_id": option_id,
                    "option_label": option_label,
                    "option_is_broader_event": broader,
                    "option_has_expected_value_advantage": expected_value,
                    "option_is_loss_protective": loss_protective,
                    "is_benchmark_choice": 1 if option_id == benchmark_option_id else 0,
                }
            )

    with DATA_PATH.open("w", newline="", encoding="utf-8") as csv_file:
        writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"Wrote {len(rows)} synthetic training rows to {DATA_PATH}")


if __name__ == "__main__":
    main()