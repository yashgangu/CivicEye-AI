import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Upload, MapPin, Sparkles, AlertCircle, CheckCircle2, ChevronRight, ArrowLeft, Coins, Heart, Loader2, Camera, Compass, Edit3 } from "lucide-react";
import { GPSLocation, ImpactAssessment, ResolutionRecommendation, Issue, UserProfile } from "../types";

interface ReportIssueModalProps {
  onClose: () => void;
  user: UserProfile;
  onIssuePublished: (newIssue: Issue) => void;
}

// Visual preset options for users to click to immediately try CivicEye AI
const IMAGE_PRESETS = [
  {
    id: "preset-pothole",
    name: "Severe Asphalt Pothole",
    category: "Pothole",
    url: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=800&q=80",
    description: "Deep pothole in the center of the driving lane forcing cars to swerve."
  },
  {
    id: "preset-water",
    name: "Sewer Pipe Water Burst",
    category: "Water Leakage",
    url: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80",
    description: "High pressure water pipe spraying water across the main intersection sidewalk."
  },
  {
    id: "preset-garbage",
    name: "Illegal Garbage Dump",
    category: "Garbage Dump",
    url: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80",
    description: "Hazardous commercial waste piled up behind public school playground fencing."
  },
  {
    id: "preset-streetlight",
    name: "Flickering Streetlight",
    category: "Broken Streetlight",
    url: "https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?auto=format&fit=crop&w=800&q=80",
    description: "The streetlamps in this dark pedestrian block are fully burnt out, reducing crime safety."
  },
  {
    id: "preset-pole",
    name: "Cracked Storm Pole",
    category: "Fallen Electric Pole",
    url: "https://images.unsplash.com/photo-1471644865543-ef7341011a4b?auto=format&fit=crop&w=800&q=80",
    description: "Wooden utility pole leaning at a dangerous angle with low hanging wires."
  }
];

const GPS_PRESETS = [
  { address: "245 Chambers St, New York, NY 10007", lat: 40.7138, lng: -74.0095 },
  { address: "12 Wall St, New York, NY 10005", lat: 40.7061, lng: -74.0088 },
  { address: "750 Broadway, New York, NY 10003", lat: 40.7289, lng: -73.9928 },
  { address: "640 5th Ave, New York, NY 10019", lat: 40.7580, lng: -73.9782 }
];

export default function ReportIssueModal({ onClose, user, onIssuePublished }: ReportIssueModalProps) {
  const [step, setStep] = useState(1);
  const [description, setDescription] = useState("");
  const [selectedPresetImage, setSelectedPresetImage] = useState<typeof IMAGE_PRESETS[0] | null>(null);
  const [customImage, setCustomImage] = useState<string | null>(null);
  
  // GPS State
  const [gps, setGps] = useState<GPSLocation>({
    address: "245 Chambers St, New York, NY 10007",
    lat: 40.7138,
    lng: -74.0095
  });

  // API Call States
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [error, setError] = useState("");

  // Duplicate Check & AI Output States
  const [duplicateFound, setDuplicateFound] = useState(false);
  const [duplicateIssue, setDuplicateIssue] = useState<Issue | null>(null);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any | null>(null);

  // File drag-over state
  const [dragOver, setDragOver] = useState(false);

  // Camera States
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    setError("");
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
      setError("Unable to access camera. Please make sure camera permissions are enabled in your browser.");
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
        setCustomImage(dataUrl);
        setSelectedPresetImage(null);
        stopCamera();
      }
    }
  };

  // Simplified GPS Location States
  const [locationMode, setLocationMode] = useState<"auto" | "manual" | null>("manual");
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState<string | null>(null);

  const handleAutoFetchLocation = () => {
    setFetchingLocation(true);
    setError("");
    setLocationSuccess(null);
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setFetchingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        let detectedAddress = `Detected Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
        
        try {
          // Reverse geocode via Nominatim (OpenStreetMap)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                "User-Agent": "CivicEyeAI/1.0"
              }
            }
          );
          if (response.ok) {
            const data = await response.json();
            if (data && data.display_name) {
              detectedAddress = data.display_name;
            }
          }
        } catch (e) {
          console.warn("Nominatim reverse geocode failed:", e);
        }

        setGps({
          lat: latitude,
          lng: longitude,
          address: detectedAddress
        });
        setLocationSuccess(detectedAddress);
        setFetchingLocation(false);
      },
      (err) => {
        console.error("Geolocation error:", err);
        setError("Could not auto-detect location. Please make sure location permissions are granted, or enter it manually.");
        setFetchingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const geocodeManualAddress = async (addrStr: string) => {
    if (!addrStr.trim()) return;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addrStr)}&limit=1`,
        {
          headers: {
            "User-Agent": "CivicEyeAI/1.0"
          }
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const first = data[0];
          setGps({
            address: addrStr,
            lat: parseFloat(first.lat),
            lng: parseFloat(first.lon)
          });
          return;
        }
      }
    } catch (e) {
      console.warn("Geocoding failed, using fallback:", e);
    }
    
    // Fallback: If Nominatim fails, check presets, or generate an NYC center offset
    const matchedPreset = GPS_PRESETS.find(p => p.address.toLowerCase().includes(addrStr.toLowerCase()));
    if (matchedPreset) {
      setGps({
        address: addrStr,
        lat: matchedPreset.lat,
        lng: matchedPreset.lng
      });
    } else {
      const randomOffsetLat = (Math.random() - 0.5) * 0.02;
      const randomOffsetLng = (Math.random() - 0.5) * 0.02;
      setGps({
        address: addrStr,
        lat: 40.7128 + randomOffsetLat,
        lng: -74.0060 + randomOffsetLng
      });
    }
  };

  const selectQuickLocation = (p: typeof GPS_PRESETS[0]) => {
    setGps(p);
    setLocationSuccess(null);
    setLocationMode("manual");
  };

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  // Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setCustomImage(reader.result as string);
        setSelectedPresetImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCustomImage(reader.result as string);
        setSelectedPresetImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectPresetImage = (preset: typeof IMAGE_PRESETS[0]) => {
    setSelectedPresetImage(preset);
    setCustomImage(null);
    setDescription(preset.description);
  };

  const selectGpsPreset = (p: typeof GPS_PRESETS[0]) => {
    setGps(p);
  };

  // Run AI Agent Pipeline (Duplicate, Vision, Impact, Priorities, Recommendation)
  const runAiAgentsPipeline = async (forceSubmit = false) => {
    const imageUrl = selectedPresetImage ? selectedPresetImage.url : customImage;
    if (!imageUrl) {
      setError("Please select or upload an image proof first.");
      return;
    }
    if (!description.trim()) {
      setError("Please add a short descriptive explanation.");
      return;
    }

    setLoading(true);
    setError("");
    setLoadingMessage("Agent 3: Scanning community database for duplicate reports...");

    try {
      const res = await fetch("/api/issues/analyze-and-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl,
          description,
          gps,
          forceSubmit
        })
      });

      if (!res.ok) {
        throw new Error("AI Agent Pipeline failed to return results");
      }

      const data = await res.json();

      if (data.duplicateDetected && !forceSubmit) {
        // Halt and show duplicate card
        setDuplicateFound(true);
        setDuplicateIssue(data.existingIssue);
        setLoading(false);
        return;
      }

      // If no duplicate, or force submit, proceed to show AI analysis
      setLoadingMessage("Agent 1: Running computer vision category matching...");
      await new Promise(r => setTimeout(r, 600));
      
      setLoadingMessage("Agent 2: Assessing sub-surface and hospital proximity risks...");
      await new Promise(r => setTimeout(r, 600));

      setLoadingMessage("Agent 5: Synthesizing resolution costs and workforce profiles...");
      await new Promise(r => setTimeout(r, 500));

      setAiAnalysisResult(data.aiAnalysis);
      setDuplicateFound(false);
      setStep(3); // Go to results step
    } catch (err: any) {
      setError(err.message || "Something went wrong during Agent execution.");
    } finally {
      setLoading(false);
    }
  };

  // Join existing duplicate
  const handleJoinDuplicate = async () => {
    if (!duplicateIssue) return;
    setLoading(true);
    setLoadingMessage("Joining existing community report and boosting priority points...");

    try {
      const res = await fetch("/api/issues/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issueId: duplicateIssue.id,
          citizenEmail: user.email,
          citizenName: user.name
        })
      });

      if (!res.ok) {
        throw new Error("Failed to join report");
      }

      alert("🎉 Thank you! You've successfully joined this report. The issue priority score has been raised to boost municipal action speed!");
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Submit and Publish issue
  const handlePublishIssue = async () => {
    if (!aiAnalysisResult) return;
    setLoading(true);
    setLoadingMessage("Publishing verified report into city-wide registry...");

    try {
      const imageUrl = selectedPresetImage ? selectedPresetImage.url : customImage;
      const payload = {
        title: `${aiAnalysisResult.category} reported on Chambers Street`,
        description,
        category: aiAnalysisResult.category,
        severity: aiAnalysisResult.severity,
        confidenceScore: aiAnalysisResult.confidenceScore,
        department: aiAnalysisResult.department,
        imageUrl,
        gps,
        reporterEmail: user.email,
        reporterName: user.name,
        impact: aiAnalysisResult.impact,
        resolution: aiAnalysisResult.resolution
      };

      const res = await fetch("/api/issues/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("Failed to submit issue to server");
      }

      const published: Issue = await res.json();
      onIssuePublished(published);
      alert("🚀 Civic report successfully published! You have earned +20 Community Hero points.");
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-sm" id="modal-backdrop">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
        id="modal-container"
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600" />
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800" id="modal-header">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
              AI Autonomous Civic Reporter
            </h3>
            <p className="text-xs text-zinc-500">Coordinate and verify municipal dangers through multi-agent analysis</p>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-zinc-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 z-50 bg-zinc-950/90 backdrop-blur-xs flex flex-col items-center justify-center space-y-4 px-6 text-center">
            <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
            <p className="text-sm font-mono text-blue-400">{loadingMessage}</p>
          </div>
        )}

        {/* Content View */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6" id="modal-content">
          
          {error && (
            <div className="p-3.5 bg-rose-950/30 border border-rose-500/20 text-xs text-rose-400 rounded-lg flex items-start gap-2 font-mono">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: UPLOAD & DESCRIBE */}
          {step === 1 && (
            <div className="space-y-6">
              
              {/* Presets and Upload */}
              <div className="space-y-3">
                <label className="block text-xs font-mono tracking-wider uppercase text-zinc-400">
                  Step 1: Choose a preset image or upload yours
                </label>
                
                {/* Image Presets Selector */}
                <div className="grid grid-cols-5 gap-2" id="preset-selector-grid">
                  {IMAGE_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => selectPresetImage(p)}
                      className={`relative aspect-square rounded-lg overflow-hidden border transition-all cursor-pointer ${
                        selectedPresetImage?.id === p.id 
                          ? "border-blue-500 ring-2 ring-blue-500/20 scale-[0.98]" 
                          : "border-zinc-800 hover:border-zinc-700"
                      }`}
                      title={p.name}
                    >
                      <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 bg-zinc-950/80 py-1 text-[8px] font-semibold text-center text-zinc-300 truncate px-1">
                        {p.category}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="text-center py-2 text-xs font-mono text-zinc-650">— OR —</div>

                {isCameraActive ? (
                  <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-950 flex flex-col items-center gap-3" id="camera-capture-container">
                    <video
                      ref={videoRef}
                      className="w-full h-64 bg-zinc-900 rounded-lg object-cover"
                      playsInline
                    />
                    <div className="flex items-center gap-3 w-full">
                      <button
                        type="button"
                        onClick={capturePhoto}
                        className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-blue-500/20"
                      >
                        <Camera className="w-4 h-4" />
                        Capture Instant Photo
                      </button>
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Drag and Drop Zone */}
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById("file-upload")?.click()}
                      className={`border border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                        dragOver ? "border-blue-500 bg-blue-950/10" : "border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/10"
                      } ${customImage ? "bg-zinc-950/40" : ""}`}
                      id="drag-drop-zone"
                    >
                      <input
                        type="file"
                        id="file-upload"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      {customImage ? (
                        <div className="flex items-center justify-center gap-4">
                          <img src={customImage} alt="Uploaded preview" className="w-20 h-20 rounded-lg object-cover border border-zinc-800" />
                          <div className="text-left space-y-1">
                            <p className="text-xs font-semibold text-zinc-300">Custom Image Uploaded</p>
                            <p className="text-[10px] text-zinc-500 font-mono">Click here to upload another</p>
                          </div>
                        </div>
                      ) : selectedPresetImage ? (
                        <div className="flex items-center justify-center gap-4">
                          <img src={selectedPresetImage.url} alt="Selected preset" className="w-20 h-20 rounded-lg object-cover border border-zinc-800" />
                          <div className="text-left space-y-1">
                            <p className="text-xs font-semibold text-blue-400">{selectedPresetImage.name}</p>
                            <p className="text-[10px] text-zinc-400 font-sans line-clamp-1">{selectedPresetImage.description}</p>
                            <p className="text-[10px] text-zinc-500 font-mono">Click to upload custom file instead</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1.5 text-zinc-400">
                          <Upload className="w-6 h-6 mx-auto text-zinc-500" />
                          <p className="text-xs">Drag and drop or <span className="text-blue-400 font-medium">browse files</span></p>
                          <p className="text-[10px] text-zinc-600 font-mono">Supports JPG, PNG, WEBP files</p>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={startCamera}
                      className="w-full py-2.5 bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-750 text-zinc-300 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <Camera className="w-4 h-4 text-blue-400" />
                      Capture Instantly with Web Camera
                    </button>
                  </>
                )}
              </div>

              {/* Description Input */}
              <div className="space-y-2">
                <label className="block text-xs font-mono tracking-wider uppercase text-zinc-400">
                  Step 2: Describe the problem
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain exactly where this is located and why it represents an immediate danger to the community..."
                  className="w-full min-h-[100px] bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-3 text-zinc-200 placeholder-zinc-600 text-sm focus:outline-none transition-all resize-none"
                />
              </div>

              {/* Next Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 text-white rounded-lg text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer"
                >
                  Continue to GPS Location
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* STEP 2: GPS LOCATION */}
          {step === 2 && (
            <div className="space-y-6">
              
              <div className="space-y-3">
                <label className="block text-xs font-mono tracking-wider uppercase text-zinc-400">
                  Step 2: Provide Issue Location
                </label>
                <p className="text-xs text-zinc-500">Specify where the issue is located so authorities and agents can inspect it instantly.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Option 1: Auto Fetch */}
                  <button
                    type="button"
                    onClick={() => {
                      setLocationMode("auto");
                      handleAutoFetchLocation();
                    }}
                    className={`p-5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between h-36 ${
                      locationMode === "auto"
                        ? "bg-blue-950/25 border-blue-500/55 text-blue-300 shadow-lg shadow-blue-500/5"
                        : "bg-zinc-950/40 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                    }`}
                    id="auto-location-btn"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                        <Compass className="w-5 h-5" />
                      </div>
                      <span className="text-[9px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-bold">Recommended</span>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold font-sans">Fetch Current Location</h4>
                      <p className="text-[10px] text-zinc-500 font-sans leading-snug">Automatically detect your device's exact GPS coordinates instantly.</p>
                    </div>
                  </button>

                  {/* Option 2: Manual Entry */}
                  <button
                    type="button"
                    onClick={() => {
                      setLocationMode("manual");
                      setLocationSuccess(null);
                    }}
                    className={`p-5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between h-36 ${
                      locationMode === "manual"
                        ? "bg-blue-950/25 border-blue-500/55 text-blue-300 shadow-lg shadow-blue-500/5"
                        : "bg-zinc-950/40 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                    }`}
                    id="manual-location-btn"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="p-2.5 rounded-xl bg-zinc-800/80 text-zinc-300">
                        <Edit3 className="w-5 h-5 text-blue-400" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold font-sans">Manually Add Address</h4>
                      <p className="text-[10px] text-zinc-500 font-sans leading-snug">Type in the street name, landmark, or select a preset zone.</p>
                    </div>
                  </button>
                </div>

                {/* Auto Fetch Loading / Success Panel */}
                {locationMode === "auto" && (
                  <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-xl space-y-2">
                    {fetchingLocation ? (
                      <div className="flex items-center gap-3 text-xs text-zinc-400 py-2">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                        <span>Detecting satellite coordinates...</span>
                      </div>
                    ) : locationSuccess ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-green-400 font-semibold">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>Precise Location Verified</span>
                        </div>
                        <p className="text-[11px] text-zinc-300 font-mono bg-zinc-900/50 p-2.5 rounded border border-zinc-850 break-words">{locationSuccess}</p>
                      </div>
                    ) : (
                      <div className="text-xs text-zinc-500 py-1 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-blue-500" />
                        <span>Ready to capture coordinates. Click 'Fetch Current Location' above.</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Manual Address Input Panel */}
                {locationMode === "manual" && (
                  <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-xl space-y-3.5">
                    <div className="space-y-1">
                      <span className="block text-[10px] text-zinc-500 font-mono">STREET ADDRESS / LANDMARK</span>
                      <input
                        type="text"
                        value={gps.address}
                        onChange={(e) => {
                          setGps({ ...gps, address: e.target.value });
                          geocodeManualAddress(e.target.value);
                        }}
                        placeholder="e.g. 750 Broadway, New York, NY"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-700 mt-1"
                      />
                    </div>

                    <div className="space-y-2">
                      <span className="block text-[9px] text-zinc-600 font-mono uppercase">Quick Presets</span>
                      <div className="flex flex-wrap gap-2">
                        {GPS_PRESETS.map((p, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => selectQuickLocation(p)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-sans border transition-all cursor-pointer ${
                              gps.address === p.address
                                ? "bg-blue-950/35 border-blue-500/40 text-blue-300"
                                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                            }`}
                          >
                            {p.address.split(",")[0]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action and Back buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Describe Details
                </button>

                <button
                  type="button"
                  onClick={() => runAiAgentsPipeline(false)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg text-xs tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-500/5"
                >
                  <Sparkles className="w-4 h-4 fill-white text-white" />
                  Analyze via AI Agents
                </button>
              </div>

              {/* DUPLICATE REPORT DETECTED BANNER */}
              <AnimatePresence>
                {duplicateFound && duplicateIssue && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="p-5 bg-amber-950/20 border border-amber-500/20 rounded-xl space-y-4 relative"
                    id="duplicate-alert"
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-amber-400">Agent 3: Duplicate Report Detected nearby!</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          A similar <strong>{duplicateIssue.category}</strong> report was already published by {duplicateIssue.reporterName} within 200m of your pinned coordinates.
                        </p>
                      </div>
                    </div>

                    <div className="bg-zinc-950/50 border border-zinc-800 p-3.5 rounded-lg flex gap-3">
                      <img src={duplicateIssue.imageUrl} className="w-12 h-12 rounded object-cover border border-zinc-800" />
                      <div className="text-xs space-y-0.5">
                        <p className="font-semibold text-zinc-200">{duplicateIssue.title}</p>
                        <p className="text-zinc-500 font-mono">Location: {duplicateIssue.gps.address}</p>
                        <p className="text-[10px] text-zinc-400">Current priority index: <span className="font-bold text-amber-400">{duplicateIssue.priorityScore}</span> with {duplicateIssue.verificationCount} verifications.</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => runAiAgentsPipeline(true)}
                        className="w-full sm:w-auto text-center px-4 py-2 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded font-mono text-[10px] cursor-pointer"
                      >
                        Bypass & Force Submit
                      </button>
                      <button
                        type="button"
                        onClick={handleJoinDuplicate}
                        className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Heart className="w-3.5 h-3.5 fill-slate-950" />
                        Verify & Join Report (+15 Pts)
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          )}

          {/* STEP 3: AI ANALYSIS RESULTS & PUBLISH */}
          {step === 3 && aiAnalysisResult && (
            <div className="space-y-6">
              
              <div className="bg-blue-950/10 border border-blue-500/20 p-4 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">AI Assessment complete!</h4>
                  <p className="text-xs text-zinc-400">Review recommendations below formulated by our computer-vision and impact model systems.</p>
                </div>
              </div>

              {/* Assessment Breakdown Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="ai-breakdown-cards">
                
                {/* Card 1: Agent 1 Vision */}
                <div className="bg-zinc-950/60 border border-zinc-800/80 p-4 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AGENT 1: VISION CLASSIFIER</span>
                  </div>
                  <div className="space-y-1.5">
                    <div>
                      <span className="text-[10px] text-zinc-500 block uppercase">CATEGORIZED THREAT</span>
                      <span className="text-sm font-bold text-zinc-200">{aiAnalysisResult.category}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-zinc-500 block uppercase">SEVERITY LEVEL</span>
                        <span className="text-xs font-semibold text-rose-400">{aiAnalysisResult.severity}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 block uppercase">CONFIDENCE</span>
                        <span className="text-xs font-mono font-bold text-zinc-300">{aiAnalysisResult.confidenceScore}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Agent 2 Impact */}
                <div className="bg-zinc-950/60 border border-zinc-800/80 p-4 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AGENT 2: IMPACT AUDIT</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500">Accident Probability:</span>
                      <span className="font-mono text-zinc-200 font-bold">{aiAnalysisResult.impact.accidentProbability}%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500">Est. Affected/Day:</span>
                      <span className="font-mono text-zinc-200 font-bold">{aiAnalysisResult.impact.populationAffected} Citizens</span>
                    </div>
                    <div className="text-[11px] text-zinc-400 bg-zinc-900 p-2 rounded leading-relaxed border border-zinc-800/50">
                      {aiAnalysisResult.impact.explanation}
                    </div>
                  </div>
                </div>

                {/* Card 3: Agent 5 Resolution Recommendation */}
                <div className="bg-zinc-950/60 border border-zinc-800/80 p-4 rounded-xl space-y-3 md:col-span-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AGENT 5: MUNICIPAL RESOLUTION SPECS</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-[10px] text-zinc-500 block">RESPONSIBLE DEPT</span>
                      <span className="font-semibold text-zinc-200">{aiAnalysisResult.department}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 block">ESTIMATED COST</span>
                      <span className="font-mono text-blue-400 font-bold">{aiAnalysisResult.resolution.estimatedCost}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 block">COMPLETION WINDOW</span>
                      <span className="font-mono text-zinc-200">{aiAnalysisResult.resolution.estimatedCompletionTime}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 block">WORKFORCE REQ</span>
                      <span className="font-mono text-zinc-200">{aiAnalysisResult.resolution.requiredWorkforce}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-zinc-800/60">
                    <span className="text-[10px] text-zinc-500 block mb-1">SUGGESTED RESOLUTION PROCEDURE</span>
                    <p className="text-xs text-zinc-400 leading-relaxed">{aiAnalysisResult.resolution.suggestedResolution}</p>
                  </div>
                </div>

              </div>

              {/* Publishing confirmation action footer */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Review GPS Location
                </button>

                <button
                  type="button"
                  onClick={handlePublishIssue}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg text-xs tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-blue-500/10"
                >
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  Publish Verified Ticket (+20 Pts)
                </button>
              </div>

            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}
