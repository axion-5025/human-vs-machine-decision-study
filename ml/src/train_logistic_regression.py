from __future__ import annotations

import csv
import json
from datetime import datetime, timezone
from pathlib import Path

from feature_schema import FEATURE_COLUMNS, dot_product, encode_training_row, sigmoid


ML_ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ML_ROOT / "data" / "synthetic_training_data.csv"
MODEL_PATH = ML_ROOT / "models" / "logistic_regression_model.json"
METADATA_PATH = ML_ROOT / "models" / "model_metadata.json"


def load_training_rows() -> tuple[list[list[float]], list[int]]:
    if not DATA_PATH.exists():
        raise FileNotFoundError(
            f"Training data not found: {DATA_PATH}. "
            "Run ml/src/generate_synthetic_data.py first."
        )

    features: list[list[float]] = []
    labels: list[int] = []

    with DATA_PATH.open("r", newline="", encoding="utf-8") as csv_file:
        reader = csv.DictReader(csv_file)

        for row in reader:
            features.append(encode_training_row(row))
            labels.append(int(row["is_benchmark_choice"]))

    return features, labels


def train_logistic_regression(
    features: list[list[float]],
    labels: list[int],
    *,
    learning_rate: float = 0.15,
    epochs: int = 4000,
) -> list[float]:
    if not features:
        raise ValueError("No training rows found.")

    weights = [0.0 for _ in features[0]]

    for _ in range(epochs):
        gradients = [0.0 for _ in weights]

        for row_features, label in zip(features, labels):
            prediction = sigmoid(dot_product(weights, row_features))
            error = prediction - label

            for index, feature_value in enumerate(row_features):
                gradients[index] += error * feature_value

        row_count = len(features)

        for index in range(len(weights)):
            weights[index] -= learning_rate * gradients[index] / row_count

    return weights


def evaluate(
    weights: list[float],
    features: list[list[float]],
    labels: list[int],
) -> dict[str, float]:
    correct = 0

    for row_features, label in zip(features, labels):
        probability = sigmoid(dot_product(weights, row_features))
        predicted_label = 1 if probability >= 0.5 else 0

        if predicted_label == label:
            correct += 1

    accuracy = correct / len(labels)

    return {
        "accuracy": round(accuracy, 4),
        "training_rows": float(len(labels)),
    }


def main() -> None:
    features, labels = load_training_rows()
    weights = train_logistic_regression(features, labels)
    metrics = evaluate(weights, features, labels)

    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)

    model_payload = {
        "model_type": "logistic_regression",
        "scope": "synthetic_reference_model",
        "feature_columns": list(FEATURE_COLUMNS),
        "weights": weights,
        "decision_threshold": 0.5,
    }

    metadata_payload = {
        "created_at": datetime.now(timezone.utc).isoformat(),
        "dataset_path": str(DATA_PATH),
        "model_path": str(MODEL_PATH),
        "training_rows": int(metrics["training_rows"]),
        "accuracy_on_synthetic_training_data": metrics["accuracy"],
        "important_note": (
            "This is a synthetic reference model for demonstration and "
            "technical reproducibility. It is not a validated research-grade "
            "production model."
        ),
    }

    MODEL_PATH.write_text(
        json.dumps(model_payload, indent=2),
        encoding="utf-8",
    )

    METADATA_PATH.write_text(
        json.dumps(metadata_payload, indent=2),
        encoding="utf-8",
    )

    print(f"Trained logistic-regression reference model.")
    print(f"Rows: {int(metrics['training_rows'])}")
    print(f"Synthetic training accuracy: {metrics['accuracy']}")
    print(f"Model written to: {MODEL_PATH}")
    print(f"Metadata written to: {METADATA_PATH}")


if __name__ == "__main__":
    main()