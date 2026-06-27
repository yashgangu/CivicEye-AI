import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Sparkles, MessageSquare, Send, CheckCircle2, ChevronDown, ChevronUp, MapPin, Layers, Loader2, ListFilter, Play, Wrench, ShieldAlert, Camera } from "lucide-react";
import { Issue, CopilotMessage, UserProfile } from "../types";

interface AuthorityDashboardProps {
  issues: Issue[];
  user: UserProfile;
  onIssueResolved: (updatedIssue: Issue) => void;
  onIssueInProgress: (updatedIssue: Issue) => void;
}

// Preset resolved images for quick test clearance
const RESOLVED_PRESETS = [
  {
    category: "Pothole",
    url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80",
    notes: "Road repair crew has fully filled the excavation site with high-durability hot-pour asphalt patch and sealed all edges to prevent future water erosion. Broad Street lane is fully restored."
  },
  {
    category: "Water Leakage",
    url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
    notes: "Main control line secured. Broke ground and replaced the fractured 12-inch cast iron pipe segment with heavy-duty modern PVC pipeline coupling. Area has been safety verified and dry-backfilled."
  },
  {
    category: "Garbage Dump",
    url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
    notes: "Specialized waste collection truck dispatched. Handled total extraction of scrap and toxic chemicals. Soil surface tested negative for leakage and area has been treated. Park trail is safe."
  },
  {
    category: "Broken Streetlight",
    url: "https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?auto=format&fit=crop&w=800&q=80",
    notes: "Erected bucket crane truck and swapped the outdated failed bulb assembly with a long-life energy efficient 150W LED unit. Calibrated photo-sensors for automatic twilight activation."
  },
  {
    category: "Fallen Electric Pole",
    url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
    notes: "Power grids isolated. Cleared the storm debris, erected a steel-reinforced concrete utility pole, and re-strung the electrical cables. Grid load balanced and fully energized."
  },
  {
    category: "Damaged Public Infrastructure",
    url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    notes: "Maintenance staff completed localized repairs, applied fresh weather-resistant paint, and structurally reinforced the asset. Opened to public."
  }
];

export default function AuthorityDashboard({ issues, user, onIssueResolved, onIssueInProgress }: AuthorityDashboardProps) {
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [resolvingIssueId, setResolvingIssueId] = useState<string | null>(null);
  
  // Resolution form states
  const [resolvedNotes, setResolvedNotes] = useState("");
  const [customResolvedUrl, setCustomResolvedUrl] = useState("");
  const [selectedPresetUrl, setSelectedPresetUrl] = useState("");
  const [submittingResolution, setSubmittingResolution] = useState(false);
  const [markingInProgressId, setMarkingInProgressId] = useState<string | null>(null);

  // Camera States for Authority
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false
      });
      setCameraStream(stream);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(e => console.error("Error playing video:", e));
        }
      }, 100);
    } catch (err: any) {
      console.error("Camera access error:", err);
      alert("Unable to access camera. Please make sure camera permissions are enabled in your browser.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setSelectedPresetUrl(dataUrl); // Set captured photo as resolution image proof URL
        stopCamera();
      }
    }
  };

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  // Copilot States
  const [copilotInput, setCopilotInput] = useState("");
  const [copilotMessages, setCopilotMessages] = useState<CopilotMessage[]>([
    {
      role: "model",
      text: "Welcome, Director. I am your Municipality Copilot. I analyze all active civic reports and recommend where you should prioritize your repair crew deployments, budget, and workforce. Ask me anything, or click one of the quick queries below.",
      timestamp: new Date().toISOString()
    }
  ]);
  const [copilotLoading, setCopilotLoading] = useState(false);

  // Active issues for authority view
  const activeIssues = issues.filter((i) => i.status !== "Resolved");
  const departments = ["All", "Roads & Transportation", "Water & Sanitation", "Waste Management", "Public Works", "Power & Electricity"];

  const filteredIssues = activeIssues.filter((i) => {
    if (selectedDept === "All") return true;
    return i.department === selectedDept;
  });

  // Load preset image details when authority prepares to resolve an issue
  const initiateResolve = (issue: Issue) => {
    stopCamera();
    setResolvingIssueId(issue.id);
    const preset = RESOLVED_PRESETS.find((p) => p.category === issue.category) || RESOLVED_PRESETS[5];
    setSelectedPresetUrl(preset.url);
    setResolvedNotes(preset.notes);
  };

  const handleResolveSubmit = async (issueId: string) => {
    const finalUrl = customResolvedUrl || selectedPresetUrl;
    if (!finalUrl) {
      alert("Please provide a resolution proof image.");
      return;
    }
    if (!resolvedNotes.trim()) {
      alert("Please write the official resolution notes first.");
      return;
    }

    setSubmittingResolution(true);
    try {
      const res = await fetch("/api/issues/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issueId,
          resolvedNotes,
          resolvedImageUrl: finalUrl,
          officerEmail: user.email
        })
      });

      if (!res.ok) {
        throw new Error("Failed to post resolution status");
      }

      const updatedIssue: Issue = await res.json();
      onIssueResolved(updatedIssue);
      alert("🎉 Issue marked as resolved! Post uploaded to the Transparency Wall and satisfaction index initiated.");
      
      // Reset forms
      setResolvingIssueId(null);
      setResolvedNotes("");
      setCustomResolvedUrl("");
      stopCamera();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setSubmittingResolution(false);
    }
  };

  const handleMarkInProgress = async (issueId: string) => {
    setMarkingInProgressId(issueId);
    try {
      const res = await fetch("/api/issues/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issueId,
          officerEmail: user.email
        })
      });

      if (!res.ok) {
        throw new Error("Failed to post progress status");
      }

      const updatedIssue: Issue = await res.json();
      onIssueInProgress(updatedIssue);
      alert("⚙️ Issue status set to 'In Progress'! Citizens can see work has started on the live feed.");
    } catch (err) {
      console.error(err);
      alert("Something went wrong changing status.");
    } finally {
      setMarkingInProgressId(null);
    }
  };

  // Municipality Copilot Chat submit
  const handleCopilotSend = async (messageText?: string) => {
    const query = messageText || copilotInput;
    if (!query.trim()) return;

    const userMessage: CopilotMessage = {
      role: "user",
      text: query,
      timestamp: new Date().toISOString()
    };

    setCopilotMessages((prev) => [...prev, userMessage]);
    setCopilotInput("");
    setCopilotLoading(true);

    try {
      const historyPayload = copilotMessages.slice(-5).map((m) => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: historyPayload
        })
      });

      if (!res.ok) {
        throw new Error("Copilot response error");
      }

      const data = await res.json();
      
      setCopilotMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: data.text,
          timestamp: new Date().toISOString()
        }
      ]);
    } catch (err) {
      console.error(err);
      setCopilotMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "⚠️ Apologies, the core server agent encountered a routing interruption. Please check your internet connection and try querying again.",
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setCopilotLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="authority-portal-grid">
      
      {/* LEFT BLOCK: COPILOT CONSOLE (5 cols) */}
      <div className="lg:col-span-5 flex flex-col h-[700px] bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl" id="copilot-panel">
        
        {/* Panel Header */}
        <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Shield className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-sans flex items-center gap-1">
              Municipality Copilot <span className="text-[9px] bg-blue-950 text-blue-400 border border-blue-500/15 px-1.5 py-0.5 rounded font-mono uppercase">Agent 6</span>
            </h3>
            <p className="text-[10px] text-zinc-500 font-mono">REPORTS & ACTION RECOMMENDATION ENGINE</p>
          </div>
        </div>

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs scrollbar-thin scrollbar-thumb-zinc-800" id="copilot-feed">
          {copilotMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col max-w-[85%] space-y-1 ${
                msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
              }`}
            >
              <div
                className={`p-3.5 rounded-xl leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-zinc-950/60 border border-zinc-800 text-zinc-300 rounded-tl-none font-sans"
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[8px] font-mono text-zinc-500">
                {msg.role === "user" ? "Officer" : "CivicEye AI"} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}

          {copilotLoading && (
            <div className="flex items-center gap-2 text-blue-400 font-mono text-[10px] bg-zinc-950/40 p-3 border border-zinc-800 rounded-xl w-fit">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing city-wide reports directory...</span>
            </div>
          )}
        </div>

        {/* Quick Query presets */}
        <div className="px-4 py-2 border-t border-zinc-800 bg-zinc-950/40 flex gap-1.5 overflow-x-auto" id="quick-queries-bar">
          <button
            onClick={() => handleCopilotSend("What needs immediate attention?")}
            className="px-2.5 py-1.5 bg-zinc-900 hover:bg-blue-950/10 border border-zinc-800 hover:border-blue-500/20 text-zinc-400 hover:text-blue-400 text-[10px] rounded-lg transition-all shrink-0 cursor-pointer"
          >
            🚨 Immediate attention?
          </button>
          <button
            onClick={() => handleCopilotSend("Which department is overloaded right now?")}
            className="px-2.5 py-1.5 bg-zinc-900 hover:bg-blue-950/10 border border-zinc-800 hover:border-blue-500/20 text-zinc-400 hover:text-blue-400 text-[10px] rounded-lg transition-all shrink-0 cursor-pointer"
          >
            📈 Department loads?
          </button>
          <button
            onClick={() => handleCopilotSend("Summarize our active reports and budget priorities.")}
            className="px-2.5 py-1.5 bg-zinc-900 hover:bg-blue-950/10 border border-zinc-800 hover:border-blue-500/20 text-zinc-400 hover:text-blue-400 text-[10px] rounded-lg transition-all shrink-0 cursor-pointer"
          >
            📋 Budget priorities?
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-zinc-950 border-t border-zinc-800 flex gap-2">
          <input
            type="text"
            placeholder="Query Copilot for municipal insights..."
            value={copilotInput}
            onChange={(e) => setCopilotInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCopilotSend()}
            className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-2.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none"
          />
          <button
            onClick={() => handleCopilotSend()}
            className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center justify-center cursor-pointer transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* RIGHT BLOCK: ACTION REGISTRY (7 cols) */}
      <div className="lg:col-span-7 space-y-6" id="registry-panel">
        
        {/* Filter Registry header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-zinc-900/30 border border-zinc-800 p-4 rounded-2xl">
          <div className="flex items-center gap-2 overflow-x-auto" id="registry-department-filters">
            <span className="text-xs text-zinc-500 font-mono shrink-0 uppercase">Sector:</span>
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all shrink-0 ${
                  selectedDept === dept
                    ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                }`}
              >
                {dept === "All" ? "All Sectors" : dept.split(" & ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* List of Active Dangers needing resolution */}
        <div className="space-y-4" id="registry-issues-feed">
          {filteredIssues.map((issue) => {
            const isResolving = resolvingIssueId === issue.id;

            return (
              <div
                key={issue.id}
                className={`bg-zinc-900/40 border rounded-2xl p-5 space-y-4 relative transition-all ${
                  isResolving ? "border-blue-500/40 bg-zinc-950/20" : "border-zinc-800"
                }`}
              >
                {/* Horizontal priority indicator ribbon */}
                <div className={`absolute top-0 left-0 right-0 h-[2px] ${
                  issue.priorityScore >= 85 ? "bg-rose-500" : "bg-amber-500"
                }`} />

                {/* Primary row */}
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <img src={issue.imageUrl} className="w-full sm:w-24 h-16 rounded-lg object-cover border border-zinc-800 shrink-0" alt="auth-item" />
                  
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono bg-zinc-950 text-zinc-400 border border-zinc-800 px-1.5 py-0.5 rounded uppercase">
                          {issue.category}
                        </span>
                        {issue.status === "In Progress" ? (
                          <span className="text-[9px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded uppercase font-bold flex items-center gap-1">
                            <span className="w-1 h-1 bg-amber-400 rounded-full animate-ping" />
                            In Progress
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono bg-zinc-950 text-zinc-500 border border-zinc-800 px-1.5 py-0.5 rounded uppercase">
                            Reported
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono font-bold text-rose-400">
                        Priority: {issue.priorityScore}
                      </span>
                    </div>
                    <h4 className="font-bold text-zinc-200 text-sm">{issue.title}</h4>
                    <p className="text-[11px] text-zinc-500 flex items-center gap-1 font-sans">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                      {issue.gps.address}
                    </p>
                  </div>
                </div>

                {/* Toggle Action block */}
                {!isResolving ? (
                  <div className="flex items-center justify-between pt-3 border-t border-zinc-850 text-xs">
                    <span className="text-zinc-500">Estimated Cost: <strong className="text-zinc-300 font-mono">{issue.resolution?.estimatedCost || "$1,100"}</strong></span>
                    <div className="flex items-center gap-2">
                      {issue.status !== "In Progress" && (
                        <button
                          onClick={() => handleMarkInProgress(issue.id)}
                          disabled={markingInProgressId === issue.id}
                          className="px-4 py-2 bg-zinc-950 hover:bg-amber-600/10 border border-zinc-800 hover:border-amber-500/20 text-amber-400 hover:text-amber-300 font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
                        >
                          {markingInProgressId === issue.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                          ) : (
                            <Play className="w-3.5 h-3.5 text-amber-400" />
                          )}
                          Mark In Progress
                        </button>
                      )}
                      <button
                        onClick={() => initiateResolve(issue)}
                        className="px-4 py-2 bg-zinc-950 hover:bg-blue-600/10 border border-zinc-800 hover:border-blue-500/20 text-blue-400 hover:text-blue-300 font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        Resolve Report
                      </button>
                    </div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="pt-4 border-t border-zinc-800 space-y-4"
                    id="resolve-form"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-blue-400 block uppercase">Official Resolution notes</span>
                      <textarea
                        value={resolvedNotes}
                        onChange={(e) => setResolvedNotes(e.target.value)}
                        className="w-full min-h-[80px] bg-zinc-950 border border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 focus:outline-none font-sans"
                        placeholder="Write detailed notes for the public Transparency Wall..."
                      />
                    </div>

                    <div className="space-y-2 border border-zinc-850 p-3.5 rounded-xl bg-zinc-950/40">
                      <span className="text-[10px] font-mono text-blue-400 block uppercase">Resolution Proof Photo</span>
                      
                      {isCameraActive ? (
                        <div className="flex flex-col items-center gap-2.5 bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
                          <video
                            ref={videoRef}
                            className="w-full h-48 bg-zinc-900 rounded-lg object-cover"
                            playsInline
                          />
                          <div className="flex items-center gap-2.5 w-full">
                            <button
                              type="button"
                              onClick={capturePhoto}
                              className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/15"
                            >
                              <Camera className="w-3.5 h-3.5" />
                              Capture Photo
                            </button>
                            <button
                              type="button"
                              onClick={stopCamera}
                              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 rounded-lg text-xs cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {selectedPresetUrl.startsWith("data:") ? (
                            <div className="flex items-center gap-3 bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
                              <img src={selectedPresetUrl} alt="Captured resolution proof" className="w-16 h-12 rounded object-cover border border-zinc-800" />
                              <div className="text-left">
                                <p className="text-[11px] font-semibold text-green-400">Captured Proof Ready</p>
                                <button
                                  type="button"
                                  onClick={startCamera}
                                  className="text-[10px] text-blue-400 hover:underline flex items-center gap-1 mt-0.5"
                                >
                                  Retake Photo
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={startCamera}
                                className="flex-1 py-2 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Camera className="w-4 h-4 text-blue-400" />
                                Click Instant Photo
                              </button>
                            </div>
                          )}
                          
                          <div className="space-y-1">
                            <span className="text-[9px] font-mono text-zinc-500 block uppercase">Or paste Custom/Preset Photo URL</span>
                            <input
                              type="text"
                              value={selectedPresetUrl}
                              onChange={(e) => setSelectedPresetUrl(e.target.value)}
                              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 focus:outline-none font-mono"
                              placeholder="Paste image URL of cleared/repaired site..."
                            />
                            <p className="text-[9px] text-zinc-500">We pre-loaded a high-resolution Unsplash repair preset for you based on category.</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setResolvingIssueId(null);
                          stopCamera();
                        }}
                        className="px-3 py-1.5 hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 rounded text-[11px] font-mono cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleResolveSubmit(issue.id)}
                        disabled={submittingResolution}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-blue-500/10"
                      >
                        {submittingResolution ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                        Publish Resolved Proof
                      </button>
                    </div>
                  </motion.div>
                )}

              </div>
            );
          })}

          {filteredIssues.length === 0 && (
            <div className="text-center py-12 bg-zinc-900/10 border border-dashed border-zinc-800 rounded-2xl text-zinc-500">
              No outstanding issues in this department's queue. Outstanding work!
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
