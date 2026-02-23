import requests
import pandas as pd
import io

url = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync"
query = "SELECT TOP 5 pl_name, pl_rade, pl_bmasse, pl_orbper, st_teff, sy_dist FROM ps"

print("Fetching from NASA API...")
response = requests.get(url, params={"query": query, "format": "csv"}, timeout=15)
print(f"Status: {response.status_code}")
print(f"Response length: {len(response.text)}")
print("First 300 chars:", response.text[:300])

try:
    df = pd.read_csv(io.StringIO(response.text))
    print(f"\nDataFrame shape: {df.shape}")
    print(f"Columns: {df.columns.tolist()}")
    print("\nDataFrame:")
    print(df)
    print(f"\nData with NaN:")
    print(df.isna())
    
    # Test deduplikasi
    print(f"\nBefore dedup: {len(df)} rows")
    df.drop_duplicates(subset=['pl_name'], keep='first', inplace=True)
    print(f"After dedup: {len(df)} rows")
    
    # Test dropna
    df_before = len(df)
    df.dropna(subset=['pl_rade', 'pl_bmasse'], inplace=True)
    print(f"After dropna: {len(df)} rows (removed {df_before - len(df)})")
    
    # Test fillna
    df['st_teff'] = df['st_teff'].fillna(df['st_teff'].mean())
    df['sy_dist'] = df['sy_dist'].fillna(df['sy_dist'].median())
    print(f"After fillna: {len(df)} rows")
    
    # Test ESI calc
    df['habitability_score'] = (1 - abs((df['pl_rade'] - 1) / (df['pl_rade'] + 1))) * \
                               (1 - abs((df['pl_bmasse'] - 1) / (df['pl_bmasse'] + 1)))
    df['habitability_score'] = df['habitability_score'].clip(lower=0)
    print(f"After ESI calc: {len(df)} rows")
    
    result = df.to_dict(orient="records")
    print(f"\nFinal result: {len(result)} records")
    print("Result:", result[:2] if result else "EMPTY")
    
except Exception as e:
    print(f"Error reading CSV: {e}")
    import traceback
    traceback.print_exc()
