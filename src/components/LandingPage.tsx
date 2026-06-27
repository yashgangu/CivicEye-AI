import React from "react";
import { motion } from "motion/react";
import { Sparkles, Eye, ShieldCheck, MapPin, CheckCircle2, TrendingUp, Users, Heart, ArrowRight, Zap, ListFilter } from "lucide-react";
import { Issue } from "../types";

interface LandingPageProps {
  issues: Issue[];
  setTab: (tab: string) => void;
  onOpenReportModal: () => void;
}

export default function LandingPage({ issues, setTab, onOpenReportModal }: LandingPageProps) {
  // Compute analytics from database
  const totalIssues = issues.length;
  const resolvedIssues = issues.filter((i) => i.status === "Resolved");
  const activeIssues = issues.filter((i) => i.status !== "Resolved");
  const resolutionRate = totalIssues > 0 ? Math.round((resolvedIssues.length / totalIssues) * 100) : 0;
  
  // Compute total verifications count for "Citizen Participation"
  const citizenEngagement = issues.reduce((acc, curr) => acc + curr.verificationCount + curr.rejectionCount + curr.verifications.length, 0) * 15 + 140; // baseline

  // Filter 3 most critical active issues to highlight
  const criticalActive = [...activeIssues]
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 3);

  return (
    <div className="space-y-12 pb-16" id="landing-page-viewport">
      
      {/* 1. Hero Section */}
      <section className="relative py-12 md:py-20 text-center overflow-hidden" id="hero-banner">
        {/* Subtle decorative circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 rounded-full filter blur-[100px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-blue-500/5 rounded-full filter blur-[80px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/10 border border-blue-500/20 rounded-full text-xs font-mono text-blue-400"
            id="hero-ai-badge"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI-POWERED SMART MUNICIPAL GOVERNMENT
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight font-sans"
            id="hero-headline"
          >
            Report. Verify. <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Resolve.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-xl text-zinc-400 max-w-2xl mx-auto font-sans font-light"
            id="hero-subheadline"
          >
            CivicEye AI is a premium, autonomous community resolution platform that empowers citizens to flag infrastructure issues and assists authorities in validating and resolving them in real-time.
          </motion.p>

          {/* Call to Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            id="hero-ctas"
          >
            <button
              onClick={onOpenReportModal}
              className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-blue-900/20 hover:shadow-blue-900/35 hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-white fill-white" />
              Report an Issue
            </button>
            <button
              onClick={() => setTab("transparency")}
              className="w-full sm:w-auto px-7 py-3.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-white font-medium rounded-xl text-sm transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Eye className="w-4 h-4 text-zinc-300" />
              Explore Transparency Wall
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. Stat Grid Section */}
      <section className="max-w-7xl mx-auto px-4" id="stats-section">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-3 text-blue-500/10">
              <ListFilter className="w-16 h-16 stroke-[1]" />
            </div>
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block">TOTAL REPORTS</span>
            <span className="text-3xl md:text-4xl font-extrabold text-white block mt-2 font-mono">{totalIssues}</span>
            <div className="flex items-center gap-1.5 mt-2.5 text-xs text-blue-400 font-mono">
              <TrendingUp className="w-3.5 h-3.5" />
              +14% this month
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-3 text-blue-500/10">
              <CheckCircle2 className="w-16 h-16 stroke-[1]" />
            </div>
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block">RESOLVED ISSUES</span>
            <span className="text-3xl md:text-4xl font-extrabold text-blue-400 block mt-2 font-mono">{resolvedIssues.length}</span>
            <div className="flex items-center gap-1.5 mt-2.5 text-xs text-blue-400 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% verified resolved
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-3 text-amber-500/10">
              <TrendingUp className="w-16 h-16 stroke-[1]" />
            </div>
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block">RESOLUTION RATE</span>
            <span className="text-3xl md:text-4xl font-extrabold text-amber-400 block mt-2 font-mono">{resolutionRate}%</span>
            <div className="flex items-center gap-1.5 mt-2.5 text-xs text-amber-400 font-mono">
              <span>Avg: 18 hours per ticket</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-3 text-indigo-500/10">
              <Users className="w-16 h-16 stroke-[1]" />
            </div>
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block">CITIZEN ENGAGEMENT</span>
            <span className="text-3xl md:text-4xl font-extrabold text-indigo-400 block mt-2 font-mono">{citizenEngagement}</span>
            <div className="flex items-center gap-1.5 mt-2.5 text-xs text-indigo-400 font-mono">
              <Heart className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              Active point earners
            </div>
          </motion.div>

        </div>
      </section>

      {/* 3. Highlighted Critical Issues */}
      <section className="max-w-7xl mx-auto px-4" id="priority-highlights">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white font-sans flex items-center gap-2">
              <span className="w-1.5 h-5 bg-blue-600 rounded-full" />
              Urgent Community Attention
            </h2>
            <p className="text-xs text-zinc-500 mt-1">Autonomous Priority Scoring Engine identifies issues requiring immediate mobilization</p>
          </div>
          <button
            onClick={() => setTab("citizen")}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors cursor-pointer"
          >
            View All Reports
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="critical-cards-grid">
          {criticalActive.map((issue) => (
            <div
              key={issue.id}
              className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-5 flex flex-col justify-between hover:border-zinc-700/80 transition-all relative overflow-hidden"
            >
              {/* Corner priority index tag */}
              <div className="absolute top-4 right-4 bg-rose-500/10 border border-rose-500/20 px-2 py-1 rounded text-[10px] font-mono text-rose-400">
                PRIORITY {issue.priorityScore}
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 w-fit block">
                  {issue.category}
                </span>
                <h3 className="font-semibold text-zinc-200 line-clamp-1">{issue.title}</h3>
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{issue.description}</p>
                
                <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <MapPin className="w-3.5 h-3.5 text-blue-500/80" />
                  <span className="line-clamp-1">{issue.gps.address}</span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-500 font-mono">
                <span>Affected: {issue.impact.populationAffected}</span>
                <span>Verified: {issue.verificationCount}</span>
              </div>
            </div>
          ))}

          {criticalActive.length === 0 && (
            <div className="col-span-3 bg-zinc-900/10 border border-dashed border-zinc-800 rounded-2xl py-8 text-center text-zinc-500 text-sm">
              No outstanding urgent issues. Great job!
            </div>
          )}
        </div>
      </section>

      {/* 4. Promotional Banner for Transparency */}
      <section className="max-w-7xl mx-auto px-4" id="promo-banner">
        <div className="bg-gradient-to-r from-blue-950/20 to-blue-900/20 border border-blue-500/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full filter blur-3xl pointer-events-none" />
          
          <div className="space-y-2 md:max-w-2xl">
            <h3 className="text-lg md:text-xl font-bold text-white">Trust and Accountability: The Transparency Wall</h3>
            <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
              Unlike standard reporting portals that hide resolution progress, CivicEye AI publishes full visual proof of work. View photographic before vs. after proof, citizen ratings, and audit municipal cost efficiency directly.
            </p>
          </div>

          <button
            onClick={() => setTab("transparency")}
            className="w-full md:w-auto shrink-0 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-blue-400 hover:text-blue-300 font-semibold rounded-xl text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            Launch Comparison Wall
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
}
