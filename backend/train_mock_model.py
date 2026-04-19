import numpy as np
import xgboost as xgb
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
import os

print("Generating synthetic data for 18 features...")
# 18 features corresponding to the provided parameters
X, y = make_classification(
    n_samples=2000, 
    n_features=18, 
    n_informative=10, 
    n_redundant=4, 
    random_state=42, 
    weights=[0.7, 0.3] # Class imbalance to reflect SMOTE background
)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("Training XGBoost mock model...")
model = xgb.XGBClassifier(
    n_estimators=100,
    max_depth=5,
    learning_rate=0.1,
    random_state=42,
    eval_metric='logloss'
)

model.fit(X_train, y_train)

# Save model
model_path = os.path.join(os.path.dirname(__file__), "model.json")
model.save_model(model_path)
print(f"Mock model saved to {model_path} successfully.")
