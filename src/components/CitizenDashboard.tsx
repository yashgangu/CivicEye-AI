import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Check, X, Eye, ThumbsUp, ShieldAlert, Award, MessageSquare, ListFilter, MapPin, ChevronDown, ChevronUp, Sparkles, TrendingUp, HelpCircle } from "lucide-react";
import { Issue, UserProfile } from "../types";

interface CitizenDashboardProps {
  issues: Issue[];
  user: UserProfile;
  onOpenReportModal: () => void;
  onIssueUpdated: (updatedIssue: Issue, updatedUser: UserProfile) => void;
}

export default function CitizenDashboard({ issues, user, onOpenReportModal, onIssueUpdated }: CitizenDashboardProps) {
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [expandedIssueId, setExpandedIssueId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [submittingVote, setSubmittingVote] = useState<string | null>(null);

  const activeIssues = issues.filter((i) => i.status !== "Resolved");
  const categories = ["All", "Pothole", "Water Leakage", "Garbage Dump", "Broken Streetlight", "Fallen Electric Pole", "Damaged Public Infrastructure"];

  const filteredIssues = activeIssues.filter((i) => {
    if (filterCategory === "All") return true;
    return i.category === filterCategory;
  });

  const handleVote = async (issueId: string, type: "confirm" | "reject") => {
    setSubmittingVote(issueId);
    try {
      const res = await fetch("/api/issues/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issueId,
          citizenEmail: user.email,
          type,
          comment: commentText[issueId] || (type === "confirm" ? "Verified. This requires urgent fixing." : "This does not seem to exist or is already handled.")
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to vote");
      }

      const data = await res.json();
      onIssueUpdated(data.issue, data.user);
      
      // Clear comment text for this issue
      setCommentText({ ...commentText, [issueId]: "" });
      alert(`🎉 Thank you! Verification logged successfully. You earned +10 points!`);
    } catch (err: any) {
      alert(err.message || "Something went wrong.");
    } finally {
      setSubmittingVote(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="citizen-dashboard-grid">
      
      {/* LEFT COLUMN: ACTIVE ISSUES FEED (8 cols) */}
      <div className="lg:col-span-8 space-y-6" id="citizen-feed-container">
        
        {/* Filter bar and CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-zinc-900/30 border border-zinc-800 p-4 rounded-2xl">
          <div className="flex items-center gap-2 overflow-x-auto" id="feed-category-filters">
            <span className="text-xs text-zinc-500 font-mono shrink-0 uppercase">Filter:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all shrink-0 ${
                  filterCategory === cat
                    ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                }`}
              >
                {cat === "All" ? "All Active" : cat}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenReportModal}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shrink-0 cursor-pointer shadow-lg shadow-blue-900/20"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            New Report
          </button>
        </div>

        {/* Issues List Feed */}
        <div className="space-y-4" id="feed-items-list">
          {filteredIssues.map((issue) => {
            const isExpanded = expandedIssueId === issue.id;
            const hasUserVoted = issue.verifications.some((v) => v.citizenEmail.toLowerCase() === user.email.toLowerCase());

            return (
              <motion.div
                key={issue.id}
                layout
                className={`bg-zinc-900/40 border rounded-2xl overflow-hidden transition-all shadow-xl relative ${
                  isExpanded ? "border-zinc-700" : "border-zinc-800/80 hover:border-zinc-800"
                }`}
              >
                {/* Horizontal priority indicator ribbon */}
                <div className={`absolute top-0 left-0 right-0 h-[2px] ${
                  issue.priorityScore >= 85 ? "bg-rose-500" : issue.priorityScore >= 70 ? "bg-amber-500" : "bg-blue-500"
                }`} />

                {/* Primary Card Row */}
                <div className="p-5 flex flex-col sm:flex-row gap-5 items-start">
                  {/* Thumbnail */}
                  <div className="w-full sm:w-32 aspect-video sm:aspect-square shrink-0 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 relative">
                    <img src={issue.imageUrl} className="w-full h-full object-cover" alt="civic-thumbnail" referrerPolicy="no-referrer" />
                    <span className={`absolute bottom-2 left-2 px-2 py-0.5 rounded border text-[8px] font-mono font-bold uppercase ${
                      issue.status === "In Progress"
                        ? "bg-amber-950/90 border-amber-500/40 text-amber-400 animate-pulse"
                        : issue.status === "Resolved"
                        ? "bg-green-950/90 border-green-500/40 text-green-400"
                        : "bg-zinc-950/90 border-zinc-800 text-zinc-400"
                    }`}>
                      {issue.status}
                    </span>
                  </div>

                  {/* Header Meta */}
                  <div className="flex-1 space-y-2.5">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-[9px] font-mono tracking-wider uppercase px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-400">
                        {issue.category}
                      </span>
                      
                      {/* Priority Tag */}
                      <div className="flex items-center gap-1.5">
                        <TrendingUp className={`w-3.5 h-3.5 ${issue.priorityScore >= 85 ? "text-rose-500" : "text-amber-500"}`} />
                        <span className={`text-xs font-mono font-bold ${
                          issue.priorityScore >= 85 ? "text-rose-400" : issue.priorityScore >= 70 ? "text-amber-400" : "text-blue-400"
                        }`}>
                          PRIORITY {issue.priorityScore}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-bold text-zinc-200 text-base leading-snug">{issue.title}</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans line-clamp-2">{issue.description}</p>
                    
                    {/* Location details */}
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-sans pt-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-500/85 shrink-0" />
                      <span className="line-clamp-1">{issue.gps.address}</span>
                    </div>

                    {/* Meta stats */}
                    <div className="flex items-center gap-4 text-[11px] font-mono text-zinc-500 pt-2 border-t border-zinc-800/40">
                      <span>Verified: <strong className="text-zinc-300">{issue.verificationCount}</strong></span>
                      <span>Risk Level: <strong className="text-zinc-300">{issue.impact.riskLevel}</strong></span>
                      <span>Assigned: <strong className="text-blue-400">{issue.department}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Expand Accordion Trigger bar */}
                <button
                  onClick={() => setExpandedIssueId(isExpanded ? null : issue.id)}
                  className="w-full py-2 bg-zinc-950/40 border-t border-zinc-800 hover:bg-zinc-950/60 transition-colors flex items-center justify-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer"
                >
                  <span>{isExpanded ? "Collapse Audit Details" : "Expand Verification Console & Comments"}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {/* Expanded Section */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      className="overflow-hidden border-t border-zinc-800 bg-zinc-950/30"
                    >
                      <div className="p-5 space-y-6">
                        
                        {/* 1. Priority Score reasoning (Agent 4) */}
                        <div className="bg-zinc-950/80 border border-zinc-800/80 p-4 rounded-xl space-y-1.5">
                          <span className="text-[9px] font-mono text-rose-400 block tracking-wider uppercase">AGENT 4: PRIORITY RATIONALE</span>
                          <p className="text-xs text-zinc-300 leading-relaxed">{issue.priorityReason}</p>
                        </div>

                        {/* 2. Verification Form */}
                        <div className="space-y-3.5">
                          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Community Validation Room</span>
                          
                          {hasUserVoted ? (
                            <div className="p-3 bg-blue-950/15 border border-blue-500/20 rounded-xl text-xs text-blue-400 flex items-center gap-2">
                              <Check className="w-4 h-4 stroke-[3]" />
                              <span>You have successfully logged your civic verification vote for this report. Thank you!</span>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <p className="text-xs text-zinc-500 leading-normal">
                                Do you live nearby or can you confirm this issue exists? Log an official vote to dynamically boost or de-escalate this ticket's municipal priority!
                              </p>
                              <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                  type="text"
                                  placeholder="Leave optional validation commentary (e.g. 'Can confirm, blocking lanes...')"
                                  value={commentText[issue.id] || ""}
                                  onChange={(e) => setCommentText({ ...commentText, [issue.id]: e.target.value })}
                                  className="flex-1 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-3.5 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:bg-zinc-950"
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleVote(issue.id, "confirm")}
                                    disabled={submittingVote === issue.id}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer shrink-0 shadow-md shadow-blue-900/20"
                                  >
                                    <ThumbsUp className="w-3.5 h-3.5 fill-white text-white" />
                                    Verify
                                  </button>
                                  <button
                                    onClick={() => handleVote(issue.id, "reject")}
                                    disabled={submittingVote === issue.id}
                                    className="px-4 py-2 bg-rose-950 hover:bg-rose-900 border border-rose-500/20 text-rose-400 rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer shrink-0"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                    Reject
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* 3. Verifications Comments timeline */}
                        <div className="space-y-3 pt-4 border-t border-zinc-800/40">
                          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Citizen Verification Log ({issue.verifications.length})</span>
                          <div className="space-y-2.5 max-h-44 overflow-y-auto pr-1">
                            {issue.verifications.map((v, vidx) => (
                              <div key={vidx} className="bg-zinc-950/50 border border-zinc-900 p-3 rounded-xl space-y-1.5 text-xs text-zinc-300">
                                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                                  <span className="font-semibold text-zinc-400">{v.citizenEmail.split("@")[0]}</span>
                                  <span>{new Date(v.timestamp).toLocaleDateString()}</span>
                                </div>
                                <p className="leading-relaxed font-sans">{v.comment}</p>
                              </div>
                            ))}

                            {issue.verifications.length === 0 && (
                              <p className="text-[11px] text-zinc-600 text-center py-4 font-mono">No validations logged. Be the first to verify!</p>
                            )}
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}

          {filteredIssues.length === 0 && (
            <div className="text-center py-12 bg-zinc-900/10 border border-dashed border-zinc-800 rounded-2xl text-zinc-500">
              No active reports in this category. Great job!
            </div>
          )}
        </div>

      </div>

      {/* RIGHT COLUMN: REWARDS & LEADERBOARD (4 cols) */}
      <div className="lg:col-span-4 space-y-6" id="rewards-sidebar">
        
        {/* User Rewards Card */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 shadow-xl relative overflow-hidden" id="rewards-points-card">
          <div className="absolute top-0 right-0 p-3 text-amber-500/5">
            <Award className="w-24 h-24 stroke-[1]" />
          </div>

          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Your Achievements</span>
          
          <div className="flex items-center gap-4 mt-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Award className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-zinc-200 text-sm">Level: Community Guardian</h4>
              <p className="text-xs text-amber-400 font-mono font-semibold">{user.rewardPoints} Accumulated Points</p>
            </div>
          </div>

          {/* Level Progress */}
          <div className="mt-5 space-y-1.5 font-sans text-xs">
            <div className="flex justify-between text-zinc-400 text-[11px]">
              <span>Progress to next rank</span>
              <span>{user.rewardPoints}/300 Pts</span>
            </div>
            <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-800">
              <div className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full" style={{ width: `${Math.min(100, (user.rewardPoints / 300) * 100)}%` }} />
            </div>
          </div>

          {/* Achievements tags */}
          <div className="mt-5 pt-4 border-t border-zinc-800/60 space-y-2">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">Unlocked Badges</span>
            <div className="flex flex-wrap gap-1.5" id="achievements-badges-row">
              {user.achievements.map((ach) => (
                <span
                  key={ach}
                  className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-500/15 text-[10px] font-mono font-semibold"
                >
                  🏆 {ach}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Gamified Leaderboard */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-4" id="leaderboard-card">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-sans">Community Heroes Board</h4>
          </div>
          
          <div className="space-y-3 text-xs" id="leaderboard-list">
            
            <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-950/35 border border-zinc-800">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-amber-400 font-bold w-4">#1</span>
                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80" className="w-6 h-6 rounded-full object-cover" />
                <span className="text-zinc-300 font-medium">Elena Rostova</span>
              </div>
              <span className="font-mono font-bold text-amber-400">480 Pts</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-950/10 border border-zinc-850">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-zinc-400 font-bold w-4">#2</span>
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" className="w-6 h-6 rounded-full object-cover" />
                <span className="text-zinc-300">Marcus Vance</span>
              </div>
              <span className="font-mono text-zinc-400">310 Pts</span>
            </div>

            {/* User current row */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-blue-600/10 border border-blue-500/20">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-blue-400 font-bold w-4">#3</span>
                <img src={user.avatar} className="w-6 h-6 rounded-full object-cover" />
                <span className="text-blue-400 font-semibold">{user.name} (You)</span>
              </div>
              <span className="font-mono font-bold text-blue-400">{user.rewardPoints} Pts</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-950/10 border border-zinc-850">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-zinc-500 w-4">#4</span>
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80" className="w-6 h-6 rounded-full object-cover" />
                <span className="text-zinc-400">Aisha Taylor</span>
              </div>
              <span className="font-mono text-zinc-500">120 Pts</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
