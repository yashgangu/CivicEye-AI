import React, { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Eye, ShieldCheck, Heart, Star, Calendar, Clock, DollarSign, Users, CheckCircle2, MapPin } from "lucide-react";
import { Issue, UserProfile } from "../types";

interface TransparencyWallProps {
  issues: Issue[];
  user: UserProfile;
  onRateIssue: (issueId: string, score: number) => void;
}

export default function TransparencyWall({ issues, user, onRateIssue }: TransparencyWallProps) {
  const resolvedIssues = issues.filter((i) => i.status === "Resolved");
  const [hoveredStars, setHoveredStars] = useState<{ [key: string]: number }>({});

  const handleRating = async (issueId: string, score: number) => {
    try {
      const res = await fetch("/api/issues/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issueId, score })
      });
      if (res.ok) {
        onRateIssue(issueId, score);
      }
    } catch (err) {
      console.error("Failed to post satisfaction score:", err);
    }
  };

  return (
    <div className="space-y-8" id="transparency-wall-viewport">
      
      {/* Page Header */}
      <div className="border-b border-zinc-800 pb-5" id="transparency-header">
        <h2 className="text-2xl font-bold text-white font-sans flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-blue-400" />
          The Transparency Wall
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          Review authentic before vs. after photographic proof of resolved municipal problems, completed costs, and citizen satisfaction audits.
        </p>
      </div>

      {/* Main comparison grid */}
      <div className="grid grid-cols-1 gap-10" id="resolved-comparisons-list">
        {resolvedIssues.map((issue) => (
          <motion.div
            key={issue.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden p-6 shadow-2xl relative space-y-6"
          >
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
            
            {/* Split layout: Visual on top/left, metadata on right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Image side-by-side (8 columns on lg) */}
              <div className="lg:col-span-8 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* BEFORE (Left) */}
                  <div className="space-y-1.5 relative">
                    <span className="absolute top-3 left-3 bg-rose-500/90 text-white font-mono text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full z-10 shadow">
                      Before (Reported)
                    </span>
                    <div className="aspect-[4/3] rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950">
                      <img
                        src={issue.imageUrl}
                        alt="Before problem state"
                        className="w-full h-full object-cover brightness-95"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>

                  {/* AFTER (Right) */}
                  <div className="space-y-1.5 relative">
                    <span className="absolute top-3 left-3 bg-blue-500/95 text-white font-mono text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full z-10 shadow">
                      After (Resolved)
                    </span>
                    <div className="aspect-[4/3] rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950">
                      <img
                        src={issue.resolvedImageUrl || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80"}
                        alt="After resolved state"
                        className="w-full h-full object-cover brightness-105"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                </div>

                {/* Authority Resolution Notes */}
                <div className="bg-zinc-950/50 border border-zinc-800/80 rounded-xl p-4 space-y-1">
                  <span className="text-[10px] font-mono text-blue-400 block uppercase">REPAIR COMPLIANCE STATEMENT</span>
                  <p className="text-xs text-zinc-300 leading-relaxed font-sans">{issue.resolvedNotes}</p>
                </div>
              </div>

              {/* Stats & Feedback side (4 columns on lg) */}
              <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
                
                {/* Meta block */}
                <div className="space-y-4">
                  <div>
                    <span className="text-[9px] font-mono text-zinc-500 block uppercase">ISSUE REGISTRY</span>
                    <h3 className="text-lg font-bold text-zinc-200 line-clamp-1">{issue.title}</h3>
                    <p className="text-xs text-zinc-500 mt-0.5 font-mono">ID: {issue.id}</p>
                  </div>

                  {/* Metrics List */}
                  <div className="space-y-2.5 font-sans">
                    <div className="flex items-start justify-between text-xs py-1.5 border-b border-zinc-800/60 gap-4">
                      <span className="text-zinc-500 flex items-center gap-1.5 shrink-0">
                        <MapPin className="w-3.5 h-3.5 text-blue-400" />
                        Location:
                      </span>
                      <span className="font-semibold text-zinc-300 text-right line-clamp-2">{issue.gps?.address || "Unknown Location"}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs py-1.5 border-b border-zinc-800/60">
                      <span className="text-zinc-500 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                        Resolution Duration:
                      </span>
                      <span className="font-semibold text-zinc-300">{issue.resolutionTimeDays || 1} Day(s)</span>
                    </div>

                    <div className="flex items-center justify-between text-xs py-1.5 border-b border-zinc-800/60">
                      <span className="text-zinc-500 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-zinc-500" />
                        Assigned Sector:
                      </span>
                      <span className="font-semibold text-zinc-300">{issue.department}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs py-1.5 border-b border-zinc-800/60">
                      <span className="text-zinc-500 flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-zinc-500" />
                        Final Repair Cost:
                      </span>
                      <span className="font-mono font-semibold text-blue-400">{issue.resolution?.estimatedCost || "$1,100"}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs py-1.5 border-b border-zinc-800/60">
                      <span className="text-zinc-500 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-zinc-500" />
                        Verified Dangers Checked:
                      </span>
                      <span className="font-semibold text-zinc-300">{issue.verificationCount} citizens</span>
                    </div>
                  </div>
                </div>

                {/* Rating Feedback Block */}
                <div className="bg-zinc-950/65 border border-zinc-800/70 p-4 rounded-xl space-y-3" id="satisfaction-panel">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wide">Citizen satisfaction audit</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 bg-zinc-800 text-zinc-400 rounded">Interactive</span>
                  </div>
                  
                  <div className="flex items-center gap-1" id="stars-row">
                    {[1, 2, 3, 4, 5].map((starValue) => {
                      const currentRating = issue.citizenSatisfactionScore || 0;
                      const hoverVal = hoveredStars[issue.id] || 0;
                      const active = hoverVal ? starValue <= hoverVal : starValue <= currentRating;

                      return (
                        <button
                          key={starValue}
                          type="button"
                          onMouseEnter={() => setHoveredStars({ ...hoveredStars, [issue.id]: starValue })}
                          onMouseLeave={() => setHoveredStars({ ...hoveredStars, [issue.id]: 0 })}
                          onClick={() => handleRating(issue.id, starValue)}
                          className="p-1 hover:scale-115 transition-transform cursor-pointer"
                          title={`Rate ${starValue} Stars`}
                        >
                          <Star
                            className={`w-5 h-5 ${
                              active ? "text-amber-400 fill-amber-400" : "text-zinc-700 fill-transparent"
                            } transition-colors`}
                          />
                        </button>
                      );
                    })}
                  </div>

                  <p className="text-[10px] text-zinc-500 leading-normal">
                    {issue.citizenSatisfactionScore 
                      ? `Rated ${issue.citizenSatisfactionScore}/5 Stars by the neighborhood.` 
                      : "No satisfaction ratings logged yet. Click above to leave feedback."}
                  </p>
                </div>

              </div>

            </div>
          </motion.div>
        ))}

        {resolvedIssues.length === 0 && (
          <div className="text-center py-12 bg-zinc-900/10 border border-dashed border-zinc-800 rounded-2xl text-zinc-500">
            No resolved issues found in this sector's history.
          </div>
        )}
      </div>

    </div>
  );
}
