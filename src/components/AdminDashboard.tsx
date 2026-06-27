import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Sparkles, Shield, AlertTriangle, MapPin, TrendingUp, Cpu, BarChart3, Clock, CheckCircle2, ShieldCheck, Loader2 } from "lucide-react";
import { Issue, PredictiveHotspot } from "../types";

interface AdminDashboardProps {
  issues: Issue[];
}

export default function AdminDashboard({ issues }: AdminDashboardProps) {
  const [predictions, setPredictions] = useState<PredictiveHotspot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPredictiveHotspots();
  }, []);

  const fetchPredictiveHotspots = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/predictions");
      if (!res.ok) {
        throw new Error("Failed to compile neural predictions");
      }
      const data = await res.json();
      setPredictions(data);
    } catch (err: any) {
      setError(err.message || "Failed to load forecasts");
    } finally {
      setLoading(false);
    }
  };

  // Compute stats
  const total = issues.length;
  const resolved = issues.filter((i) => i.status === "Resolved").length;
  const active = total - resolved;
  const rate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  // Department counts
  const depts = ["Roads & Transportation", "Water & Sanitation", "Waste Management", "Public Works", "Power & Electricity"];
  const deptStats = depts.map((d) => {
    const deptIssues = issues.filter((i) => i.department === d);
    const resolvedDept = deptIssues.filter((i) => i.status === "Resolved").length;
    return {
      name: d.split(" & ")[0],
      total: deptIssues.length,
      resolved: resolvedDept,
      pending: deptIssues.length - resolvedDept,
      rate: deptIssues.length > 0 ? Math.round((resolvedDept / deptIssues.length) * 100) : 100
    };
  });

  return (
    <div className="space-y-8" id="admin-insights-viewport">
      
      {/* Header */}
      <div className="border-b border-zinc-800 pb-5" id="admin-header">
        <h2 className="text-2xl font-bold text-white font-sans flex items-center gap-2">
          <Cpu className="w-6 h-6 text-blue-400" />
          Smart City Executive Insights
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          Monitor real-time infrastructure indices, department workloads, and neural forecasting data to prevent municipal breakdowns.
        </p>
      </div>

      {/* Grid: SVG Charts and Hotspots */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: VISUAL PERFORMANCE GRAPHS (7 cols) */}
        <div className="lg:col-span-7 space-y-6" id="performance-analysis">
          
          {/* Department Performance Custom Bar Chart */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div>
              <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wide flex items-center gap-2 font-sans">
                <BarChart3 className="w-4 h-4 text-blue-400" />
                Sector Resolution Efficiency
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">Ratio of reported vs. fully resolved tickets by sector</p>
            </div>

            {/* Custom SVG/HTML Bar Stack chart */}
            <div className="space-y-4" id="custom-bar-chart">
              {deptStats.map((ds) => (
                <div key={ds.name} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-sans">
                    <span className="font-semibold text-zinc-300">{ds.name}</span>
                    <div className="space-x-3 text-[11px] font-mono">
                      <span className="text-zinc-500">Active: <strong className="text-zinc-300">{ds.pending}</strong></span>
                      <span className="text-blue-400">Resolved: <strong className="font-bold">{ds.resolved}</strong></span>
                      <span className="text-blue-400 font-bold">{ds.rate}% Rate</span>
                    </div>
                  </div>

                  {/* Meter Track */}
                  <div className="w-full bg-zinc-950 h-3 rounded-full overflow-hidden border border-zinc-800 relative flex">
                    {/* Resolved fraction */}
                    <div
                      className="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${ds.rate}%` }}
                    />
                    {/* Pending fraction */}
                    {ds.pending > 0 && (
                      <div className="bg-zinc-800 h-full flex-1" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Metrics grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-zinc-500 block">AVERAGE CLOSE TIME</span>
                <span className="text-xl font-bold text-zinc-200">18.4 Hours</span>
              </div>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-zinc-500 block">SYSTEM ACCURACY</span>
                <span className="text-xl font-bold text-zinc-200">94.2% Audit</span>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: PREDICTIVE HOTSPOTS (5 cols) */}
        <div className="lg:col-span-5 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between" id="predictive-hotspots">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wide flex items-center gap-2 font-sans">
                  <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
                  Agent 7: Neural Hotspots
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">Statistical forecasts of infrastructure fatigue risks in next 30 days</p>
              </div>
              <button
                onClick={fetchPredictiveHotspots}
                className="p-1.5 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors cursor-pointer"
                title="Refresh Predictive Models"
              >
                <Cpu className="w-4 h-4" />
              </button>
            </div>

            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                <span className="text-xs font-mono text-blue-400">Compiling prediction neural maps...</span>
              </div>
            ) : error ? (
              <div className="py-12 text-center text-xs text-rose-400 font-mono">
                {error}
              </div>
            ) : (
              <div className="space-y-4" id="hotspots-list">
                {predictions.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-xl space-y-3 relative overflow-hidden group hover:border-blue-500/20 transition-all"
                  >
                    {/* Glowing side line */}
                    <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-blue-500/80" />
                    
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-500/10 uppercase">
                          {p.category}
                        </span>
                        <h4 className="font-bold text-zinc-300 text-xs mt-1.5">{p.title}</h4>
                      </div>
                      
                      <div className="text-right">
                        <span className="text-[9px] font-mono text-zinc-500 block uppercase">RISK FACTORS</span>
                        <span className="text-xs font-mono font-bold text-blue-400">{p.riskFactor}%</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-zinc-400 leading-normal font-sans">{p.predictionReason}</p>

                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-2 border-t border-zinc-900">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-500/70" />
                        {p.gps.address.split(" (")[0]}
                      </span>
                      <span>Conf: {p.confidenceScore}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-800/60 text-[10px] font-mono text-zinc-500 text-center flex items-center justify-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>AI forecasts are mathematical projections based on municipal stresses.</span>
          </div>
        </div>

      </div>

    </div>
  );
}
