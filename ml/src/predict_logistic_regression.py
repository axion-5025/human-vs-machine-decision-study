from __future__ import annotations

import csv
import json
from pathlib import Path

from feature_schema import dot_product, encode_training_row, sigmoid


ML_ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ML_ROOT / "data" / "synthetic_training_data.csv"
MODEL_PATH = ML_ROOT / "models" / "logistic_regression_model.json"


def load_model() -> dict[str, object]:
    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"Model not found: {MODEL_PATH}. Run train_logistic_regression.py first."
        )

    return json.loads(MODEL_PATH.read_text(encoding="utf-8"))


def main() -> None:
    model = load_model()
    weights = [float(value) for value in model["weights"]]

    with DATA_PATH.open("r", newline="", encoding="utf-8") as csv_file:
        reader = csv.DictReader(csv_file)

        print("scenario_id,option_id,predicted_benchmark_probability")

        for row in reader:
            features = encode_training_row(row)
            probability = sigmoid(dot_product(weights, features))

            print(
                f"{row['scenario_id']},"
                f"{row['option_id']},"
                f"{probability:.4f}"
            )


if __name__ == "__main__":
    main()