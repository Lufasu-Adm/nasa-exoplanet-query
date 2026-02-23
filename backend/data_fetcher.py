import requests
import pandas as pd
import io
import joblib
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'habitability_model.pkl')

def get_planet_type(row):
    # Logika klasifikasi tipe planet untuk aset visual
    if row['pl_rade'] > 10: return "gas_giant"
    if row['pl_rade'] > 2: return "neptunian"
    if row['st_teff'] > 5000: return "lava"
    if row['st_teff'] < 3000: return "ice"
    return "rocky"

def fetch_nasa_data(limit=100):
    url = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync"
    # Ambil 5000 planet untuk mendapatkan ~250 planet dengan data lengkap (pl_bmasse)
    query = f"SELECT TOP 5000 pl_name, pl_rade, pl_bmasse, st_teff, sy_dist FROM ps"
    
    try:
        response = requests.get(url, params={"query": query, "format": "csv"}, timeout=15)
        if response.status_code != 200:
            return {"error": "NASA_API_OFFLINE"}

        df = pd.read_csv(io.StringIO(response.text))

        # Fill missing values untuk st_teff dan sy_dist
        if len(df) > 0:
            df['st_teff'] = df['st_teff'].fillna(df['st_teff'].mean())
            df['sy_dist'] = df['sy_dist'].fillna(df['sy_dist'].median())

        # Drop rows dengan missing critical values
        df.dropna(subset=['pl_rade', 'pl_bmasse'], inplace=True)
        df.drop_duplicates(subset=['pl_name'], keep='first', inplace=True)

        # ML Inference - dengan fallback ke simple scoring jika model fail
        if len(df) > 0:
            if os.path.exists(MODEL_PATH):
                try:
                    model = joblib.load(MODEL_PATH)
                    features = df[['pl_rade', 'pl_bmasse', 'st_teff', 'sy_dist']]
                    if len(features) > 0:
                        df['habitability_score'] = model.predict_proba(features)[:, 1]
                    else:
                        df['habitability_score'] = 0.0
                except Exception as model_err:
                    df['habitability_score'] = (1 - abs((df['pl_rade'] - 1) / (df['pl_rade'] + 1))) * \
                                               (1 - abs((df['pl_bmasse'] - 1) / (df['pl_bmasse'] + 1)))
                    df['habitability_score'] = df['habitability_score'].clip(lower=0)
            else:
                df['habitability_score'] = (1 - abs((df['pl_rade'] - 1) / (df['pl_rade'] + 1))) * \
                                           (1 - abs((df['pl_bmasse'] - 1) / (df['pl_bmasse'] + 1)))
                df['habitability_score'] = df['habitability_score'].clip(lower=0)

            # Klasifikasi Tipe Permukaan
            df['planet_type'] = df.apply(get_planet_type, axis=1)

        # Limit hasil ke jumlah yang diminta user
        result = df.to_dict(orient="records")
        return result[:limit]
    except Exception as e:
        return {"error": str(e)}

def get_model_feature_importance():
    """Extract feature importance dari ML model"""
    try:
        if not os.path.exists(MODEL_PATH):
            return {"error": "Model file not found"}
        
        model = joblib.load(MODEL_PATH)
        
        # Check jika model punya feature_importances_
        if not hasattr(model, 'feature_importances_'):
            return {"error": "Model does not support feature importance"}
        
        # Get feature names dari model
        feature_names = model.feature_names_in_ if hasattr(model, 'feature_names_in_') else None
        importances = model.feature_importances_.tolist()
        
        if feature_names is None:
            # Fallback ke default names jika tidak ada
            feature_names = ['pl_rade', 'pl_bmasse', 'st_teff', 'sy_dist']
        
        # Convert ke list of dicts untuk easier visualization
        importance_list = []
        for name, importance in zip(feature_names, importances):
            # Friendly names untuk display
            friendly_names = {
                'pl_rade': 'Planet Radius (R⊕)',
                'pl_bmasse': 'Planet Mass (M⊕)',
                'st_teff': 'Star Temperature (K)',
                'sy_dist': 'System Distance (pc)'
            }
            display_name = friendly_names.get(name, name)
            importance_list.append({
                "feature": name,
                "display_name": display_name,
                "importance": float(importance),
                "percentage": float(importance * 100)
            })
        
        # Sort by importance descending
        importance_list.sort(key=lambda x: x['importance'], reverse=True)
        
        return importance_list
    except Exception as e:
        return {"error": str(e)}