"use client";
import { useEffect, useState } from "react";
import PlanetCard from "../components/PlanetCard";
import FeatureImportanceChart from "../components/FeatureImportanceChart";

export default function Dashboard() {
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlanets = async () => {
      try {
        console.log("🔍 Checking backend health...");
        
        // Cek health check backend dulu dengan timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const healthRes = await fetch("http://localhost:8000/", {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        
        console.log("✅ Health check response:", healthRes.status);
        
        if (!healthRes.ok) {
          throw new Error(`Backend health check failed: ${healthRes.status}`);
        }

        const healthData = await healthRes.json();
        console.log("✅ Backend status:", healthData);

        // Jika backend OK, fetch data
        console.log("🔍 Fetching exoplanet data...");
        const res = await fetch("http://localhost:8000/api/exoplanets?limit=100");
        if (!res.ok) throw new Error(`Failed to fetch data: ${res.status}`);
        
        const result = await res.json();
        if (result.success) {
          console.log("✅ Data fetched successfully:", result.data.length, "planets");
          setPlanets(result.data);
        } else {
          throw new Error(result.message);
        }
      } catch (err: any) {
        console.error("❌ Error:", err);
        console.error("Error name:", err.name);
        console.error("Error message:", err.message);
        console.error("Error details:", JSON.stringify(err, null, 2));
        
        const errorMsg = err.name === "AbortError" 
          ? "Backend is not responding (timeout). Check if Backend is running"
          : err.message === "Failed to fetch" 
          ? "Check if Backend is running"
          : err.message || "Unknown error occurred";
        
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };
    fetchPlanets();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto w-full">
        <header className="mb-8 md:mb-12 border-b border-zinc-800 pb-6 md:pb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-mono tracking-tighter italic">
            <span className="text-emerald-500 mr-2">&gt;</span> NASA EXOPLANET QUERY
          </h1>
          <p className="text-zinc-500 font-mono text-xs md:text-sm mt-2 uppercase tracking-widest">
            End-to-end habitability analysis pipeline.
          </p>
        </header>

        {/* Feature Importance Analysis Section */}
        <div className="mb-12">
          <FeatureImportanceChart />
        </div>

        {error ? (
          <div className="p-6 bg-red-950/20 border border-red-900 rounded-xl font-mono text-red-500 text-sm">
            [SYSTEM_ERROR]: {error}
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center h-48 animate-pulse text-emerald-500 font-mono text-xs tracking-widest">
            INITIALIZING_DATA_FETCH_FROM_NASA_TAP...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
            {planets.map((planet: any, index: number) => (
              <PlanetCard key={planet.pl_name} planet={planet} index={index} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}