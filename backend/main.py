from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from data_fetcher import fetch_nasa_data, get_model_feature_importance
import uvicorn

app = FastAPI(title="NASA Exoplanet AI API")

# Update CORS: Izinkan localhost dan development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost", "http://127.0.0.1:3000"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "online", "api": "ready"}

@app.get("/api/exoplanets")
def get_planets(limit: int = 100):
    try:
        data = fetch_nasa_data(limit)
        if isinstance(data, dict) and "error" in data:
            return {"success": False, "message": data["error"], "data": []}
        return {"success": True, "data": data}
    except Exception as e:
        # Menangkap error agar server tetap hidup
        return {"success": False, "message": f"Server Logic Error: {str(e)}", "data": []}

@app.get("/api/feature-importance")
def get_feature_importance():
    """Return feature importance dari ML model untuk visualisasi"""
    try:
        importance_data = get_model_feature_importance()
        if isinstance(importance_data, dict) and "error" in importance_data:
            return {"success": False, "message": importance_data["error"], "data": []}
        return {"success": True, "data": importance_data}
    except Exception as e:
        return {"success": False, "message": f"Server Error: {str(e)}", "data": []}

if __name__ == "__main__":
    # Gunakan 0.0.0.0 untuk listen di semua interfaces dan disable reload
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)