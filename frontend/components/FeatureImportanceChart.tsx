"use client";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface FeatureImportance {
  feature: string;
  display_name: string;
  importance: number;
  percentage: number;
}

export default function FeatureImportanceChart() {
  const [importance, setImportance] = useState<FeatureImportance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImportance = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/feature-importance");
        const result = await res.json();

        if (result.success && Array.isArray(result.data)) {
          setImportance(result.data);
        } else {
          throw new Error(result.message || "Failed to fetch feature importance");
        }
      } catch (err: any) {
        console.error("Feature importance error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchImportance();
  }, []);

  if (loading)
    return (
      <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 animate-pulse">
        <div className="h-8 bg-zinc-700 rounded w-1/3 mb-4" />
        <div className="h-48 bg-zinc-700 rounded" />
      </div>
    );

  if (error)
    return (
      <div className="p-6 rounded-2xl bg-red-950/20 border border-red-900 text-red-500 font-mono text-sm">
        Error: {error}
      </div>
    );

  const colors = ["#10b981", "#06b6d4", "#f59e0b", "#ef4444"];

  return (
    <div className="p-4 md:p-6 rounded-lg md:rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-emerald-500/50 transition-all">
      <div className="mb-4 md:mb-6">
        <h2 className="text-lg md:text-2xl font-bold text-emerald-400 font-mono mb-2">
          <span className="text-emerald-600 mr-2">⚙</span>Feature Importance
        </h2>
        <p className="text-zinc-500 text-xs md:text-sm font-mono">
          Kontribusi variabel dalam model AI untuk prediksi habitability
        </p>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={importance}
          margin={{ top: 20, right: 10, left: 40, bottom: 80 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#27272a"
            vertical={false}
            horizontalPoints={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
          />
          <XAxis
            dataKey="display_name"
            angle={-45}
            textAnchor="end"
            height={120}
            tick={{ fill: "#a1a1aa", fontSize: 10 }}
            interval={0}
          />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
            label={{
              value: "Importance (%)",
              angle: -90,
              position: "insideLeft",
              fill: "#a1a1aa",
              offset: 10,
            }}
            tick={{ fill: "#a1a1aa", fontSize: 11 }}
            width={35}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f1f23",
              border: "1px solid #27272a",
              borderRadius: "8px",
              color: "#fafafa",
              fontFamily: "monospace",
            }}
            formatter={(value: any) => [
              `${(value * 100).toFixed(2)}%`,
              "Importance",
            ]}
            cursor={{ fill: "rgba(16, 185, 129, 0.1)" }}
          />
          <Bar dataKey="percentage" fill="#10b981" radius={[8, 8, 0, 0]}>
            {importance.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {importance.map((item, idx) => (
          <div
            key={item.feature}
            className="p-3 md:p-4 rounded-lg bg-zinc-900/50 border border-zinc-800"
          >
            <div className="flex items-start justify-between mb-2 gap-2">
              <span className="font-mono text-xs md:text-sm font-bold text-zinc-400">
                #{idx + 1}
              </span>
              <span
                className="px-2 py-0.5 rounded text-xs font-mono font-bold whitespace-nowrap"
                style={{
                  backgroundColor: colors[idx % colors.length] + "20",
                  color: colors[idx % colors.length],
                }}
              >
                {item.percentage.toFixed(2)}%
              </span>
            </div>
            <h4 className="font-mono font-bold text-emerald-400 mb-1 text-xs md:text-sm">
              {item.display_name}
            </h4>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full"
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: colors[idx % colors.length],
                }}
              />
            </div>
            <p className="text-[10px] md:text-xs text-zinc-500 mt-1 md:mt-2 font-mono truncate">
              {item.feature}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 md:mt-6 p-3 md:p-4 rounded-lg bg-emerald-950/20 border border-emerald-900/50">
        <p className="text-[11px] md:text-xs text-emerald-300 font-mono leading-relaxed">
          💡 <strong>Radius Planet</strong> (~61%) paling krusial, diikuti <strong>Massa</strong> (~31%). Lingkungan berpengaruh kecil.
        </p>
      </div>
    </div>
  );
}
