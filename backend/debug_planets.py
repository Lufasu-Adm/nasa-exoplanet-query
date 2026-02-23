import requests
import pandas as pd
import io

url = 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync'
query = 'SELECT TOP 200 pl_name, pl_rade, pl_bmasse, st_teff, sy_dist FROM ps'

print("Fetching NASA API data...")
try:
    response = requests.get(url, params={'query': query, 'format': 'csv'}, timeout=15)
    df = pd.read_csv(io.StringIO(response.text))
    print(f'Total planets from NASA API: {len(df)}')
    
    # Check missing values
    print(f'Missing pl_rade: {df["pl_rade"].isna().sum()}')
    print(f'Missing pl_bmasse: {df["pl_bmasse"].isna().sum()}')
    print(f'Missing st_teff: {df["st_teff"].isna().sum()}')
    print(f'Missing sy_dist: {df["sy_dist"].isna().sum()}')
    
    # After filtering
    df_clean = df.dropna(subset=['pl_rade', 'pl_bmasse'])
    print(f'\nAfter filtering null pl_rade/pl_bmasse: {len(df_clean)}')
    
    # After dedup
    df_dedup = df_clean.drop_duplicates(subset=['pl_name'])
    print(f'After dedup: {len(df_dedup)}')
    
    # Print first 10 planet names
    print(f'\nFirst 10 planets:')
    print(df_dedup['pl_name'].head(10).tolist())
    
except Exception as e:
    print(f'Error: {e}')
    import traceback
    traceback.print_exc()
