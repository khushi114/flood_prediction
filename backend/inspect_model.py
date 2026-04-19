import joblib
import pickle
import os

model_path = os.path.join(os.path.dirname(__file__), "xgb_sm_model.pkl")
try:
    try:
        model = joblib.load(model_path)
    except Exception:
        with open(model_path, 'rb') as f:
            model = pickle.load(f)
            
    print("Model type:", type(model))
    if hasattr(model, 'feature_importances_'):
        print("Feature importances:", model.feature_importances_)
    else:
        print("No feature importances found.")
        
    if hasattr(model, 'classes_'):
        print("Classes:", model.classes_)
except Exception as e:
    print("Error:", e)
