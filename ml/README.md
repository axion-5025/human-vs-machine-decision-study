# Human vs Machine Decision Study — ML Reference Module

This folder contains the machine-learning reference module for the Human vs Machine Decision Study.

It includes:

- synthetic training data
- logistic-regression training code
- saved model artifact
- model metadata
- prediction code
- normative benchmark engine

## Scope

This is a reproducible reference ML module built from synthetic demonstration data.

It should not be presented as a final validated research model or production-grade statistical model. Its purpose is to make the machine-comparison approach visible, inspectable, and runnable for technical review.

## Folder Structure

```text
ml/
  data/
    synthetic_training_data.csv
  models/
    logistic_regression_model.json
    model_metadata.json
  src/
    feature_schema.py
    generate_synthetic_data.py
    train_logistic_regression.py
    predict_logistic_regression.py
    normative_engine.py