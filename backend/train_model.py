import pandas as pd
import requests
import io
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

def train_habitability_model():
    url = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync"
    # Mengambil sampel data yang lebih besar untuk akurasi model
    query = "SELECT TOP 5000 pl_rade, pl_bmasse, st_teff, sy_dist FROM ps"
    
    response = requests.get(url, params={"query": query, "format": "csv"})
    df = pd.read_csv(io.StringIO(response.text))
    df.dropna(inplace=True)

    # Labeling: Simulasi Ground Truth berdasarkan kriteria habitabilitas standar
    # Radius (0.5 - 2.0 Earth), Massa (0.1 - 10 Earth), Temp (2500 - 7000 K)
    df['target'] = ((df['pl_rade'].between(0.5, 2.0)) & 
                    (df['pl_bmasse'].between(0.1, 10.0)) & 
                    (df['st_teff'].between(2500, 7000))).astype(int)

    X = df[['pl_rade', 'pl_bmasse', 'st_teff', 'sy_dist']]
    y = df['target']

    # Split data dan training
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # Export model
    joblib.dump(model, 'habitability_model.pkl')
    print(f"Model trained. Accuracy: {model.score(X_test, y_test):.2f}")

if __name__ == "__main__":
    train_habitability_model()