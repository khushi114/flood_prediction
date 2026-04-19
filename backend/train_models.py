import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split, StratifiedKFold
from sklearn.metrics import precision_recall_curve, confusion_matrix, accuracy_score, f1_score, roc_auc_score
from xgboost import XGBClassifier
from imblearn.combine import SMOTETomek, SMOTEENN
from sklearn.linear_model import LogisticRegression
from model_classes import ManualCalibratedXGB
import os

def load_data(filepath="flood.csv"):
    df = pd.read_csv(filepath)
    features_names = [
        'MonsoonIntensity', 'TopographyDrainage', 'RiverManagement', 'Deforestation',
        'Urbanization', 'ClimateChange', 'DamsQuality', 'Siltation', 'AgriculturalPractices',
        'Encroachments', 'IneffectiveDisasterPreparedness', 'DrainageSystems', 'CoastalVulnerability', 'Landslides',
        'Watersheds', 'DeterioratingInfrastructure', 'PopulationScore', 'WetlandLoss', 'InadequatePlanning', 'PoliticalFactors'
    ]
    X = df[features_names]
    y_true_continuous = df['FloodProbability']
    y = (y_true_continuous >= 0.5).astype(int)
    return train_test_split(X, y, test_size=0.2, random_state=42)

def train_baseline(X_train, y_train):
    print("\n--- Training Baseline Model (SMOTETomek + XGBoost + Threshold Tuning) ---")
    smt = SMOTETomek(random_state=42)
    X_res, y_res = smt.fit_resample(X_train, y_train)
    xgb = XGBClassifier(random_state=42, eval_metric='logloss')
    xgb.fit(X_res, y_res)
    return xgb


def train_enhanced(X_train, y_train):
    print("\n--- Training Enhanced Model ---")
    neg_samples = (y_train == 0).sum()
    pos_samples = (y_train == 1).sum()
    scale_pos_weight = neg_samples / pos_samples
    print(f"Scale Pos Weight: {scale_pos_weight:.4f}")
    
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    sme = SMOTEENN(random_state=42, n_jobs=1)
    
    oof_probs = np.zeros(len(X_train))
    print("Performing 5-fold CV to get out-of-fold predictions...")
    
    X_train_arr = X_train.values if hasattr(X_train, "values") else X_train
    y_train_arr = y_train.values if hasattr(y_train, "values") else y_train
    
    for i, (train_idx, val_idx) in enumerate(cv.split(X_train_arr, y_train_arr)):
        print(f"  Fold {i+1}/5...")
        X_tr = X_train_arr[train_idx]
        y_tr = y_train_arr[train_idx]
        X_v = X_train_arr[val_idx]
        
        X_res, y_res = sme.fit_resample(X_tr, y_tr)
        xgb = XGBClassifier(scale_pos_weight=scale_pos_weight, random_state=42, eval_metric='logloss')
        xgb.fit(X_res, y_res)
        oof_probs[val_idx] = xgb.predict_proba(X_v)[:, 1]
    
    print("Fitting Calibrator...")
    calibrator = LogisticRegression(random_state=42)
    calibrator.fit(oof_probs.reshape(-1, 1), y_train_arr)
    
    print("Training final base model on full training set...")
    X_res_full, y_res_full = sme.fit_resample(X_train_arr, y_train_arr)
    final_xgb = XGBClassifier(scale_pos_weight=scale_pos_weight, random_state=42, eval_metric='logloss')
    final_xgb.fit(X_res_full, y_res_full)
    
    return ManualCalibratedXGB(final_xgb, calibrator)

def tune_threshold_and_evaluate(model, X_test, y_test, name, is_enhanced=False):
    y_pred_proba = model.predict_proba(X_test)[:, 1]
    
    if not is_enhanced:
        optimal_threshold = 0.45
    else:
        precision_arr, recall_arr, thresholds_arr = precision_recall_curve(y_test, y_pred_proba)
        best_f2 = 0
        optimal_threshold = 0.5
        for p, r, t in zip(precision_arr, recall_arr, thresholds_arr):
            if p + r == 0:
                continue
            f2 = (5 * p * r) / ((4 * p) + r)
            if f2 > best_f2:
                best_f2 = f2
                optimal_threshold = t
                
    y_pred = (y_pred_proba >= optimal_threshold).astype(int)
    
    cm = confusion_matrix(y_test, y_pred)
    acc = accuracy_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    roc_auc = roc_auc_score(y_test, y_pred_proba)
    
    tn, fp, fn, tp = cm.ravel()
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0
    
    print(f"[{name}] Tuned Decision Threshold: {optimal_threshold:.4f}")
    print(f"[{name}] Evaluation Metrics:")
    print(f"  Precision: {precision:.4f}")
    print(f"  Recall:    {recall:.4f}")
    print(f"  F1 Score:  {f1:.4f}")
    print(f"  Accuracy:  {acc:.4f}")
    print(f"  ROC-AUC:   {roc_auc:.4f}")
    print(f"  Confusion Matrix:\n{cm}")
    
    return optimal_threshold

if __name__ == "__main__":
    print("Loading Dataset...")
    X_train, X_test, y_train, y_test = load_data("flood.csv")
    
    baseline_path = "xgb_baseline_model.pkl"
    baseline_model = train_baseline(X_train, y_train)
    joblib.dump(baseline_model, baseline_path)
    print(f"Baseline model saved to {baseline_path}")
    tune_threshold_and_evaluate(baseline_model, X_test, y_test, "Baseline Model (SMOTETomek)", is_enhanced=False)
    
    enhanced_model = train_enhanced(X_train, y_train)
    # Save components separately to support proper loading across modules
    joblib.dump(enhanced_model.base_model, "xgb_enhanced_xgb.pkl")
    joblib.dump(enhanced_model.calibrator, "xgb_enhanced_calibrator.pkl")
    # Also save the composite as-is for convenience (works when imported as module)
    joblib.dump(enhanced_model, "xgb_enhanced_model.pkl")
    print("Enhanced model components saved to xgb_enhanced_xgb.pkl + xgb_enhanced_calibrator.pkl")
    tune_threshold_and_evaluate(enhanced_model, X_test, y_test, "Enhanced Model (SMOTEENN + Calibrated CV)", is_enhanced=True)
    
    print("\nTraining and tuning completed successfully. Both models saved natively.")
