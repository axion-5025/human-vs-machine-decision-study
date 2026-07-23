from __future__ import annotations

import math


FEATURE_COLUMNS: tuple[str, ...] = (
    "bias",
    "category_conjunction",
    "category_framing",
    "category_risk",
    "category_probability",
    "option_is_b",
    "option_is_broader_event",
    "option_has_expected_value_advantage",
    "option_is_loss_protective",
)


def sigmoid(value: float) -> float:
    if value >= 0:
        z = math.exp(-value)
        return 1.0 / (1.0 + z)

    z = math.exp(value)
    return z / (1.0 + z)


def encode_training_row(row: dict[str, str]) -> list[float]:
    category = row["category"]

    return [
        1.0,
        1.0 if category == "conjunction-judgement" else 0.0,
        1.0 if category == "framing" else 0.0,
        1.0 if category == "risk-preference" else 0.0,
        1.0 if category == "probability-judgement" else 0.0,
        1.0 if row["option_code"] == "B" else 0.0,
        float(row["option_is_broader_event"]),
        float(row["option_has_expected_value_advantage"]),
        float(row["option_is_loss_protective"]),
    ]


def dot_product(left: list[float], right: list[float]) -> float:
    return sum(left_value * right_value for left_value, right_value in zip(left, right))