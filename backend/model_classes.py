"""
Shared model class definitions — import from here so joblib can pickle/unpickle correctly.
"""
import numpy as np
from sklearn.base import BaseEstimator, ClassifierMixin


class ManualCalibratedXGB(BaseEstimator, ClassifierMixin):
    """
    Wraps a trained XGBoost base model with a Logistic Regression calibrator
    fitted on out-of-fold predictions from StratifiedKFold CV.

    Components:
      - base_model: XGBClassifier trained on SMOTEENN-resampled full training data
      - calibrator: LogisticRegression fitted on OOF probabilities (sigmoid calibration)
    """
    def __init__(self, base_model=None, calibrator=None):
        self.base_model = base_model
        self.calibrator = calibrator
        self.classes_ = np.array([0, 1])

    def predict_proba(self, X):
        X_arr = X.values if hasattr(X, "values") else X
        raw_probs = self.base_model.predict_proba(X_arr)[:, 1].reshape(-1, 1)
        return self.calibrator.predict_proba(raw_probs)

    def predict(self, X):
        return (self.predict_proba(X)[:, 1] >= 0.5).astype(int)
