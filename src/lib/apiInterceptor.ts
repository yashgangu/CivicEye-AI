import { Issue, UserProfile } from "../types";

// Seed issues to initialize the local client database (copied from civiceye_db.json)
const DEFAULT_ISSUES: Issue[] = [
  {
    id: "civic-issue-1782458267886",
    title: "Broken Streetlight reported on Chambers Street",
    description: "The streetlamps in this dark pedestrian block are fully burnt out, reducing crime safety.",
    category: "Broken Streetlight",
    severity: "High",
    confidenceScore: 98,
    department: "Power & Electricity",
    status: "Reported",
    imageUrl: "https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?auto=format&fit=crop&w=800&q=80",
    gps: {
      address: "640 5th Ave, New York, NY 10019",
      lat: 40.758,
      lng: -73.9782
    },
    reporterEmail: "admin@city.gov",
    reporterName: "Commissioner Dave Miller",
    verificationCount: 2,
    rejectionCount: 0,
    verifications: [
      {
        citizenEmail: "gangurdeyash122003@gmail.com",
        type: "confirm",
        comment: "yes it is true",
        timestamp: "2026-06-26T07:18:51.143Z"
      },
      {
        citizenEmail: "yashgangurde012@gmail.com",
        type: "confirm",
        comment: "Verified. This requires urgent fixing.",
        timestamp: "2026-06-26T07:57:48.653Z"
      }
    ],
    impact: {
      riskLevel: "High",
      accidentProbability: 75,
      environmentalImpact: "Minimal direct ecological impact; however, lack of illumination may disrupt nocturnal local wildlife behavior patterns in urban green corridors.",
      populationAffected: 1200,
      nearbyFacilities: [
        "Residential Apartment Complex (0.1km)",
        "Public Transit Station (0.3km)",
        "Community Park (0.4km)"
      ],
      explanation: "The absence of functional street lighting in a high-density pedestrian thoroughfare significantly elevates the probability of slip-and-fall incidents, physical assault, and vehicular-pedestrian collisions. Reduced visibility suppresses public space utilization during evening hours and necessitates immediate infrastructure restoration to maintain public safety and community security standards."
    },
    resolution: {
      suggestedResolution: "Conduct a site-wide diagnostic of the electrical grid, replace all faulty LED modules, and inspect the control circuits for localized shorts or ballast failure. Upgrade to energy-efficient smart LED fixtures for remote monitoring.",
      estimatedCost: "$2,200",
      estimatedCompletionTime: "8 Hours",
      requiredWorkforce: "2 Technicians and 1 Bucket Truck Operator",
      responsibleDepartment: "Power & Electricity"
    },
    createdAt: "2026-06-26T07:17:47.886Z",
    priorityScore: 83,
    priorityReason: "High severity issue coupled with a High risk level within proximity to Residential Apartment Complex (0.1km). Priority index is reinforced by 2 community verifications and an estimated impact on 1200 citizens."
  },
  {
    id: "civic-issue-1",
    title: "Deep Pavement Crater outside Westside High School",
    description: "Massive pothole has opened up in the middle of Broad Street right next to the school crossing. It forces cars to swerve into oncoming traffic, posing a major hazard during school hours.",
    category: "Pothole",
    severity: "High",
    confidenceScore: 96,
    department: "Roads & Transportation",
    status: "Resolved",
    imageUrl: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=800&q=80",
    resolvedImageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80",
    resolvedNotes: "The Roads & Transportation repair crew deployed an asphalt patch truck within 24 hours of reporting. The pothole has been fully excavation-filled and re-paved. School crossing markings have been restored.",
    resolvedAt: "2026-06-24T14:30:00.000Z",
    resolutionTimeDays: 1,
    gps: {
      lat: 40.7128,
      lng: -74.006,
      address: "452 Broad St, New York, NY 10007 (Adjacent to Westside High)"
    },
    reporterEmail: "citizen.alex@civic.org",
    reporterName: "Alex Rivera",
    verificationCount: 18,
    rejectionCount: 0,
    verifications: [
      {
        citizenEmail: "yashgangurde012@gmail.com",
        type: "confirm",
        comment: "Confirmed! Saw school buses struggling to dodge this yesterday morning. Awesome to see it patched up so fast!",
        timestamp: "2026-06-24T16:00:00.000Z"
      }
    ],
    impact: {
      riskLevel: "High",
      accidentProbability: 85,
      environmentalImpact: "Negligible. Minor dust dispersion from loose road substrate.",
      populationAffected: 1200,
      nearbyFacilities: [
        "Westside High School (0.01km)",
        "Metro Crossing Bus Stop (0.05km)"
      ],
      explanation: "High severity due to the extreme danger to student safety during school drop-off and pickup. Swerving vehicles increase head-on collision risks near a pedestrian-dense school zone."
    },
    resolution: {
      responsibleDepartment: "Roads & Transportation",
      suggestedResolution: "Excavate the fractured pavement area, apply commercial grade hot-mix asphalt, seal boundaries, and steamroll flat.",
      estimatedCost: "$1,100",
      estimatedCompletionTime: "24 Hours",
      requiredWorkforce: "3 Asphalt Layers"
    },
    createdAt: "2026-06-24T10:00:00.000Z",
    priorityScore: 82,
    priorityReason: "High severity issue coupled with a High risk level within proximity to Westside High School (0.01km). Priority index is reinforced by 18 community verifications."
  },
  {
    id: "civic-issue-2",
    title: "Burst Water Main Flooding Emergency Entrance",
    description: "Main utility water pipe has ruptured near the Emergency Ward access road of Mercy General. Flooding has begun encroaching on the lower level garage.",
    category: "Water Leakage",
    severity: "Critical",
    confidenceScore: 97,
    department: "Water & Sanitation",
    status: "Reported",
    imageUrl: "https://images.unsplash.com/photo-1510442650500-93217e634e4c?auto=format&fit=crop&w=800&q=80",
    gps: {
      lat: 40.7135,
      lng: -74.0055,
      address: "Chambers St & West St, New York, NY 10007"
    },
    reporterEmail: "officer.smith@city.gov",
    reporterName: "Officer John Smith",
    verificationCount: 4,
    rejectionCount: 0,
    verifications: [],
    impact: {
      riskLevel: "Critical",
      accidentProbability: 90,
      environmentalImpact: "Severe. Waste of clean municipal water and structural erosion hazard.",
      populationAffected: 5000,
      nearbyFacilities: [
        "Mercy General Emergency Ward (0.02km)",
        "Municipal Transit Tunnel (0.1km)"
      ],
      explanation: "Critical risk because flooding restricts emergency ambulance ingress and egress, while high-velocity subgrade water flow could undermine road integrity."
    },
    resolution: {
      suggestedResolution: "Deploy excavation team to clamp primary gate valve. Remove debris, execute pipe lining replacement, backfill with dry gravel, and lay new binder course.",
      estimatedCost: "$8,500",
      estimatedCompletionTime: "12 Hours",
      requiredWorkforce: "5 Utility Plumbers",
      responsibleDepartment: "Water & Sanitation"
    },
    createdAt: "2026-06-25T11:00:00.000Z",
    priorityScore: 96,
    priorityReason: "Critical severity issue coupled with a Critical risk level near Mercy General. Priority index is reinforced by 4 community verifications and massive affected population."
  }
];

// Helper: Haversine distance
function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Helper: Compute dynamic priority score
function computePriority(issue: any) {
  let severityScore = 10;
  if (issue.severity === "Critical") severityScore = 40;
  else if (issue.severity === "High") severityScore = 30;
  else if (issue.severity === "Medium") severityScore = 20;

  let riskScore = 10;
  if (issue.impact?.riskLevel === "Critical") riskScore = 40;
  else if (issue.impact?.riskLevel === "High") riskScore = 30;
  else if (issue.impact?.riskLevel === "Medium") riskScore = 20;

  const pop = issue.impact?.populationAffected || 0;
  let popScore = 5;
  if (pop > 1000) popScore = 20;
  else if (pop > 500) popScore = 15;
  else if (pop > 100) popScore = 10;

  const verifications = issue.verificationCount || 0;
  const rejections = issue.rejectionCount || 0;
  const verificationImpact = verifications * 1.5 - rejections * 3;

  const totalScore = Math.min(100, Math.max(0, Math.round(severityScore + riskScore + popScore + verificationImpact)));

  const nearbyString = issue.impact?.nearbyFacilities?.length 
    ? ` within proximity to ${issue.impact.nearbyFacilities[0]}` 
    : "";
  const reason = `${issue.severity} severity issue coupled with a ${issue.impact?.riskLevel || "medium"} risk level${nearbyString}. Priority index is reinforced by ${verifications} community verifications and an estimated impact on ${pop} citizens.`;

  return { totalScore, reason };
}

// Initialize issues in localStorage
function loadIssues(): Issue[] {
  const data = localStorage.getItem("civiceye_eval_issues");
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      // fallback
    }
  }
  localStorage.setItem("civiceye_eval_issues", JSON.stringify(DEFAULT_ISSUES));
  return DEFAULT_ISSUES;
}

function saveIssues(issues: Issue[]) {
  localStorage.setItem("civiceye_eval_issues", JSON.stringify(issues));
}

// Override global fetch
export function setupClientAPIInterceptor() {
  if (typeof window === "undefined") return;

  const originalFetch = window.fetch;

  const interceptedFetch = async function (this: any, input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const urlStr = typeof input === "string" ? input : (input instanceof URL ? input.href : input.url);
    
    // Check if we are calling a relative or absolute /api route
    if (urlStr.includes("/api/")) {
      const parsedUrl = new URL(urlStr, window.location.origin);
      const pathname = parsedUrl.pathname;
      const method = (init?.method || "GET").toUpperCase();

      console.log(`[Client API Interceptor] Intercepted ${method} ${pathname}`);

      try {
        // 1. GET /api/issues
        if (pathname === "/api/issues" && method === "GET") {
          const issues = loadIssues();
          return new Response(JSON.stringify(issues), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        }

        // 2. POST /api/auth/login
        if (pathname === "/api/auth/login" && method === "POST") {
          const body = JSON.parse(init?.body as string || "{}");
          const email = body.email || "citizen@city.org";
          const emailLower = email.toLowerCase().trim();

          // Get or create user
          let storedUser: UserProfile;
          if (emailLower === "officer@city.gov") {
            storedUser = {
              email: "officer@city.gov",
              name: "Director Sarah Jenkins",
              role: "authority",
              avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
              rewardPoints: 240,
              achievements: ["Active Citizen", "Trust Verifier", "Impact Leader"]
            };
          } else if (emailLower === "admin@city.gov") {
            storedUser = {
              email: "admin@city.gov",
              name: "Commissioner Dave Miller",
              role: "admin",
              avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
              rewardPoints: 500,
              achievements: ["Active Citizen", "Strategic Planner", "Metropolitan Commander"]
            };
          } else {
            const savedEvalUser = localStorage.getItem("civiceye_eval_user");
            let parsed: any = null;
            if (savedEvalUser) {
              try {
                parsed = JSON.parse(savedEvalUser);
              } catch (e) {
                console.warn("Failed to parse civiceye_eval_user from localStorage", e);
              }
            }
            if (parsed && parsed.email && parsed.email.toLowerCase() === emailLower) {
              storedUser = parsed;
            } else {
              storedUser = {
                email: emailLower,
                name: emailLower.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
                role: "citizen",
                avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000)}?auto=format&fit=crop&w=150&q=80`,
                rewardPoints: 10,
                achievements: ["Active Citizen"]
              };
            }
          }

          localStorage.setItem("civiceye_eval_user", JSON.stringify(storedUser));
          return new Response(JSON.stringify(storedUser), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        }

        // 3. POST /api/issues/analyze-and-check
        if (pathname === "/api/issues/analyze-and-check" && method === "POST") {
          const body = JSON.parse(init?.body as string || "{}");
          const { imageUrl, description, gps, forceSubmit } = body;

          if (!gps || !gps.lat || !gps.lng) {
            return new Response(JSON.stringify({ error: "GPS location is required." }), { status: 400 });
          }

          const issues = loadIssues();

          // Spatial duplicate detection (200m zone)
          if (!forceSubmit) {
            const thresholdMeters = 200;
            for (const existing of issues) {
              if (existing.status !== "Resolved") {
                const dist = getDistanceMeters(gps.lat, gps.lng, existing.gps.lat, existing.gps.lng);
                if (dist <= thresholdMeters) {
                  return new Response(JSON.stringify({
                    duplicateDetected: true,
                    existingIssue: existing,
                    distance: Math.round(dist)
                  }), { status: 200, headers: { "Content-Type": "application/json" } });
                }
              }
            }
          }

          // Build high-fidelity rules-based Gemini simulator response
          const descLower = (description || "").toLowerCase();
          let category = "Damaged Public Infrastructure";
          let department = "Public Works";
          let severity: "Critical" | "High" | "Medium" | "Low" = "Medium";
          let riskLevel: "Critical" | "High" | "Medium" | "Low" = "Medium";
          let accidentProbability = 35;
          let envImpact = "Minor visual pollution and community asset obstruction.";
          let popAffected = 300;
          let facilities = ["Residential Complex (0.1km)", "Local Retail Row (0.15km)"];
          let suggestedResolution = "Dispatch maintenance contractor to evaluate physical structure and complete repairs.";
          let estimatedCost = "$650";
          let estimatedCompletionTime = "48 Hours";
          let requiredWorkforce = "2 Maintenance Technicians";

          if (descLower.includes("pothole") || descLower.includes("road") || descLower.includes("street")) {
            category = "Pothole";
            department = "Roads & Transportation";
            severity = "High";
            riskLevel = "High";
            accidentProbability = 75;
            envImpact = "Negligible. Roadside soil and vehicle alignment risks.";
            popAffected = 1500;
            facilities = ["Subway Transit Hub (0.2km)", "Pedestrian Crosswalk (0.05km)"];
            suggestedResolution = "Excavate the fractured pavement area, apply commercial grade hot-mix asphalt, seal boundaries, and steamroll flat.";
            estimatedCost = "$1,100";
            estimatedCompletionTime = "24 Hours";
            requiredWorkforce = "3 Asphalt Layers";
          } else if (descLower.includes("water") || descLower.includes("leak") || descLower.includes("burst")) {
            category = "Water Leakage";
            department = "Water & Sanitation";
            severity = "Critical";
            riskLevel = "Critical";
            accidentProbability = 60;
            envImpact = "Wasting of treated drinking water and soil saturation risks.";
            popAffected = 2800;
            facilities = ["Local Medical Clinic (0.1km)", "Primary School Zone (0.3km)"];
            suggestedResolution = "Shut off pressure valves, isolate pipe breakage, install heavy-duty steel bypass coupling sleeve, check surrounding ground stability, and pressure test.";
            estimatedCost = "$3,400";
            estimatedCompletionTime = "12 Hours";
            requiredWorkforce = "3 Water Technicians";
          } else if (descLower.includes("garbage") || descLower.includes("dump") || descLower.includes("trash") || descLower.includes("waste")) {
            category = "Garbage Dump";
            department = "Waste Management";
            severity = "Medium";
            riskLevel = "Medium";
            accidentProbability = 20;
            envImpact = "Soil contamination, visual blight, and toxic hazard runoffs.";
            popAffected = 650;
            facilities = ["Public Park Gateway (0.02km)", "Community Garden (0.1km)"];
            suggestedResolution = "Deploy front loader and hazardous materials truck. Segregate recyclables, transport trash to landfill, and apply soil neutralizer.";
            estimatedCost = "$950";
            estimatedCompletionTime = "18 Hours";
            requiredWorkforce = "4 Sanitation Crew members";
          } else if (descLower.includes("light") || descLower.includes("streetlight") || descLower.includes("dark")) {
            category = "Broken Streetlight";
            department = "Power & Electricity";
            severity = "Medium";
            riskLevel = "High";
            accidentProbability = 80;
            envImpact = "Severe light deprivation in public alleyways, compounding crime and safety risks.";
            popAffected = 450;
            facilities = ["Public Subway Exit (0.05km)", "All-night Pharmacy (0.15km)"];
            suggestedResolution = "Utilize bucket truck to replace burnt commercial sodium bulb with modern long-life energy-efficient LED light fixture. Inspect local transformer ballast.";
            estimatedCost = "$450";
            estimatedCompletionTime = "12 Hours";
            requiredWorkforce = "1 Electrical Worker";
          } else if (descLower.includes("pole") || descLower.includes("electric") || descLower.includes("wire")) {
            category = "Fallen Electric Pole";
            department = "Power & Electricity";
            severity = "Critical";
            riskLevel = "Critical";
            accidentProbability = 95;
            envImpact = "Massive hazard of electromagnetic arcs, high voltage ground leakage, and local grid failure.";
            popAffected = 4000;
            facilities = ["Public Library (0.05km)", "Fire Station (0.12km)"];
            suggestedResolution = "Isolate high voltage substation circuit, deploy emergency heavy poles truck, erect reinforced high-strength concrete replacement pole, reconnect high-tension lines, and balance grid phase.";
            estimatedCost = "$7,200";
            estimatedCompletionTime = "8 Hours";
            requiredWorkforce = "5 High-Voltage Linemen";
          }

          const geminiOutput = {
            category,
            severity,
            confidenceScore: Math.floor(Math.random() * 8) + 88,
            department,
            impact: {
              riskLevel,
              accidentProbability,
              environmentalImpact: envImpact,
              populationAffected: popAffected,
              nearbyFacilities: facilities,
              explanation: `Vision Intelligence Audit: High accuracy hazard profiling matches reported spatial features. Proximity to ${facilities[0]} warrants structured containment.`
            },
            resolution: {
              suggestedResolution,
              estimatedCost,
              estimatedCompletionTime,
              requiredWorkforce,
              responsibleDepartment: department
            }
          };

          return new Response(JSON.stringify({
            duplicateDetected: false,
            aiAnalysis: geminiOutput
          }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        }

        // 4. POST /api/issues/submit
        if (pathname === "/api/issues/submit" && method === "POST") {
          const body = JSON.parse(init?.body as string || "{}");
          const { title, description, category, severity, confidenceScore, department, imageUrl, gps, reporterEmail, reporterName, impact, resolution } = body;

          if (!title || !gps || !reporterEmail) {
            return new Response(JSON.stringify({ error: "Missing required fields." }), { status: 400 });
          }

          const issues = loadIssues();

          const newIssue: Issue = {
            id: `civic-issue-${Date.now()}`,
            title,
            description,
            category,
            severity,
            confidenceScore: confidenceScore || 90,
            department,
            status: "Reported",
            imageUrl,
            gps,
            reporterEmail,
            reporterName: reporterName || "Anonymous Citizen",
            verificationCount: 0,
            rejectionCount: 0,
            verifications: [],
            impact,
            resolution,
            createdAt: new Date().toISOString(),
            priorityScore: 0,
            priorityReason: ""
          };

          const priorityCalc = computePriority(newIssue);
          newIssue.priorityScore = priorityCalc.totalScore;
          newIssue.priorityReason = priorityCalc.reason;

          issues.unshift(newIssue);
          saveIssues(issues);

          // Reward user points
          const savedUserStr = localStorage.getItem("civiceye_eval_user");
          if (savedUserStr) {
            try {
              const userProfile = JSON.parse(savedUserStr) as UserProfile;
              if (userProfile && userProfile.email && userProfile.email.toLowerCase() === reporterEmail.toLowerCase()) {
                userProfile.rewardPoints += 20;
                if (userProfile.rewardPoints >= 100 && !userProfile.achievements.includes("Community Hero")) {
                  userProfile.achievements.push("Community Hero");
                }
                localStorage.setItem("civiceye_eval_user", JSON.stringify(userProfile));
              }
            } catch (err) {
              console.warn("Failed to update reward points for civiceye_eval_user:", err);
            }
          }

          return new Response(JSON.stringify(newIssue), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        }

        // 5. POST /api/issues/verify
        if (pathname === "/api/issues/verify" && method === "POST") {
          const body = JSON.parse(init?.body as string || "{}");
          const { issueId, citizenEmail, type, comment } = body;

          if (!issueId || !citizenEmail || !type) {
            return new Response(JSON.stringify({ error: "Missing required parameters" }), { status: 400 });
          }

          const issues = loadIssues();
          const issueIndex = issues.findIndex((i) => i.id === issueId);

          if (issueIndex === -1) {
            return new Response(JSON.stringify({ error: "Issue not found" }), { status: 404 });
          }

          const issue = issues[issueIndex];
          const alreadyVerified = issue.verifications?.some((v) => v.citizenEmail.toLowerCase() === citizenEmail.toLowerCase());
          if (alreadyVerified) {
            return new Response(JSON.stringify({ error: "You have already verified/voted on this issue." }), { status: 400 });
          }

          if (!issue.verifications) {
            issue.verifications = [];
          }

          issue.verifications.push({
            citizenEmail,
            type,
            comment,
            timestamp: new Date().toISOString()
          });

          if (type === "confirm") {
            issue.verificationCount += 1;
          } else {
            issue.rejectionCount += 1;
          }

          const priorityCalc = computePriority(issue);
          issue.priorityScore = priorityCalc.totalScore;
          issue.priorityReason = priorityCalc.reason;

          saveIssues(issues);

          // Add points
          const savedUserStr = localStorage.getItem("civiceye_eval_user");
          let updatedUser: UserProfile | null = null;
          if (savedUserStr) {
            try {
              const userProfile = JSON.parse(savedUserStr) as UserProfile;
              if (userProfile && userProfile.email && userProfile.email.toLowerCase() === citizenEmail.toLowerCase()) {
                userProfile.rewardPoints += 10;
                if (userProfile.rewardPoints >= 50 && !userProfile.achievements.includes("Top Verifier")) {
                  userProfile.achievements.push("Top Verifier");
                }
                if (userProfile.rewardPoints >= 150 && !userProfile.achievements.includes("Neighborhood Guardian")) {
                  userProfile.achievements.push("Neighborhood Guardian");
                }
                localStorage.setItem("civiceye_eval_user", JSON.stringify(userProfile));
                updatedUser = userProfile;
              }
            } catch (err) {
              console.warn("Failed to add points to civiceye_eval_user:", err);
            }
          }

          return new Response(JSON.stringify({ issue, user: updatedUser }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        }

        // 6. POST /api/issues/join
        if (pathname === "/api/issues/join" && method === "POST") {
          const body = JSON.parse(init?.body as string || "{}");
          const { issueId, citizenEmail } = body;

          if (!issueId || !citizenEmail) {
            return new Response(JSON.stringify({ error: "Missing required parameters" }), { status: 400 });
          }

          const issues = loadIssues();
          const issueIndex = issues.findIndex((i) => i.id === issueId);

          if (issueIndex === -1) {
            return new Response(JSON.stringify({ error: "Issue not found" }), { status: 404 });
          }

          const issue = issues[issueIndex];
          if (!issue.verifications) {
            issue.verifications = [];
          }

          const alreadyVerified = issue.verifications.some((v) => v.citizenEmail.toLowerCase() === citizenEmail.toLowerCase());
          if (alreadyVerified) {
            return new Response(JSON.stringify({ message: "Already joined this issue, tracking updates." }), {
              status: 200,
              headers: { "Content-Type": "application/json" }
            });
          }

          issue.verifications.push({
            citizenEmail,
            type: "confirm",
            comment: "Joined this issue. Experiencing the same problem here.",
            timestamp: new Date().toISOString()
          });
          issue.verificationCount += 1;

          const priorityCalc = computePriority(issue);
          issue.priorityScore = priorityCalc.totalScore;
          issue.priorityReason = priorityCalc.reason;

          saveIssues(issues);

          // Add points
          const savedUserStr = localStorage.getItem("civiceye_eval_user");
          if (savedUserStr) {
            try {
              const userProfile = JSON.parse(savedUserStr) as UserProfile;
              if (userProfile && userProfile.email && userProfile.email.toLowerCase() === citizenEmail.toLowerCase()) {
                userProfile.rewardPoints += 15;
                if (userProfile.rewardPoints >= 50 && !userProfile.achievements.includes("Top Verifier")) {
                  userProfile.achievements.push("Top Verifier");
                }
                localStorage.setItem("civiceye_eval_user", JSON.stringify(userProfile));
              }
            } catch (err) {
              console.warn("Failed to update points for user joining issue:", err);
            }
          }

          return new Response(JSON.stringify({ success: true, issue }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        }

        // 6.5. POST /api/issues/progress
        if (pathname === "/api/issues/progress" && method === "POST") {
          const body = JSON.parse(init?.body as string || "{}");
          const { issueId, officerEmail } = body;

          if (!issueId) {
            return new Response(JSON.stringify({ error: "Issue ID is required." }), { status: 400 });
          }

          const issues = loadIssues();
          const issueIndex = issues.findIndex((i) => i.id === issueId);

          if (issueIndex === -1) {
            return new Response(JSON.stringify({ error: "Issue not found." }), { status: 404 });
          }

          const issue = issues[issueIndex];
          issue.status = "In Progress";

          saveIssues(issues);

          // Add points to authority (e.g. 20 points for starting progress)
          if (officerEmail) {
            const savedUserStr = localStorage.getItem("civiceye_eval_user");
            if (savedUserStr) {
              try {
                const userProfile = JSON.parse(savedUserStr) as UserProfile;
                if (userProfile && userProfile.email && userProfile.email.toLowerCase() === officerEmail.toLowerCase()) {
                  userProfile.rewardPoints += 20;
                  if (userProfile.rewardPoints >= 300 && !userProfile.achievements.includes("Impact Leader")) {
                    userProfile.achievements.push("Impact Leader");
                  }
                  localStorage.setItem("civiceye_eval_user", JSON.stringify(userProfile));
                }
              } catch (err) {
                console.warn("Failed to reward authority user profile:", err);
              }
            }
          }

          return new Response(JSON.stringify(issue), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        }

        // 7. POST /api/issues/resolve
        if (pathname === "/api/issues/resolve" && method === "POST") {
          const body = JSON.parse(init?.body as string || "{}");
          const { issueId, resolvedNotes, resolvedImageUrl, officerEmail } = body;

          if (!issueId || !resolvedNotes || !resolvedImageUrl) {
            return new Response(JSON.stringify({ error: "Resolution details are required." }), { status: 400 });
          }

          const issues = loadIssues();
          const issueIndex = issues.findIndex((i) => i.id === issueId);

          if (issueIndex === -1) {
            return new Response(JSON.stringify({ error: "Issue not found." }), { status: 404 });
          }

          const issue = issues[issueIndex];
          issue.status = "Resolved";
          issue.resolvedNotes = resolvedNotes;
          issue.resolvedImageUrl = resolvedImageUrl;
          issue.resolvedAt = new Date().toISOString();

          const created = new Date(issue.createdAt);
          const resolved = new Date(issue.resolvedAt);
          const diffDays = Math.max(1, Math.round((resolved.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)));
          issue.resolutionTimeDays = diffDays;

          saveIssues(issues);

          // Add points to authority
          if (officerEmail) {
            const savedUserStr = localStorage.getItem("civiceye_eval_user");
            if (savedUserStr) {
              try {
                const userProfile = JSON.parse(savedUserStr) as UserProfile;
                if (userProfile && userProfile.email && userProfile.email.toLowerCase() === officerEmail.toLowerCase()) {
                  userProfile.rewardPoints += 50;
                  if (userProfile.rewardPoints >= 300 && !userProfile.achievements.includes("Impact Leader")) {
                    userProfile.achievements.push("Impact Leader");
                  }
                  localStorage.setItem("civiceye_eval_user", JSON.stringify(userProfile));
                }
              } catch (err) {
                console.warn("Failed to reward authority user profile:", err);
              }
            }
          }

          return new Response(JSON.stringify(issue), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        }

        // 8. POST /api/issues/rate
        if (pathname === "/api/issues/rate" && method === "POST") {
          const body = JSON.parse(init?.body as string || "{}");
          const { issueId, score } = body;

          if (!issueId || !score) {
            return new Response(JSON.stringify({ error: "Issue ID and rating score required." }), { status: 400 });
          }

          const issues = loadIssues();
          const issueIndex = issues.findIndex((i) => i.id === issueId);

          if (issueIndex === -1) {
            return new Response(JSON.stringify({ error: "Issue not found" }), { status: 404 });
          }

          const issue = issues[issueIndex];
          issue.citizenSatisfactionScore = score;
          saveIssues(issues);

          return new Response(JSON.stringify(issue), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        }

        // 9. POST /api/copilot
        if (pathname === "/api/copilot" && method === "POST") {
          const body = JSON.parse(init?.body as string || "{}");
          const { message } = body;

          if (!message) {
            return new Response(JSON.stringify({ error: "Message is required." }), { status: 400 });
          }

          const issues = loadIssues();
          const activeIssues = issues.filter((i) => i.status !== "Resolved");
          const resolvedIssues = issues.filter((i) => i.status === "Resolved");
          const total = issues.length;
          const resolvedCount = resolvedIssues.length;
          const rate = total > 0 ? Math.round((resolvedCount / total) * 100) : 0;

          // Detect simple words to make response dynamic
          const msgLower = message.toLowerCase();
          let responseText = "";

          if (msgLower.includes("pothole") || msgLower.includes("road")) {
            responseText = `### 🛣️ Roads & Infrastructure Priority Report

Our client database logs **${activeIssues.filter(i => i.category === "Pothole").length} active pothole reports**. 

#### Current Key Pothole:
* **Broad Street Crater** has been successfully **Resolved** in less than 24 hours. Citizen feedback shows high gratitude.
* Ongoing pavement fracturing risks have been mapped near coordinates **(40.7132, -74.0045)** on Broadway.

#### Strategic Recommendations:
1. Increase the asphalt repair budget for Ward 2 by **$12,000**.
2. Pre-stage materials near Chambers Street depot to decrease repair times to under 12 hours.`;
          } else if (msgLower.includes("water") || msgLower.includes("leak") || msgLower.includes("flood")) {
            responseText = `### 💧 Water Utility Emergency Advisory

The city water network reports **1 highly critical event** currently open:

* **ID:** \`civic-issue-2\` — *Burst Water Main near Mercy General*
  * **Status:** Reported & Geofenced.
  * **Accident Probability:** **90%** (Ambulance lanes are partially submerged).
  * **Current Plan:** Valve crews are dispatched to bypass the 18" main and engage steel compression coupling.

#### Strategic Recommendation:
* Direct power crew to clear nearby electrical poles before pumping out basement level 1 of Mercy General to prevent electrical hazards.`;
          } else {
            responseText = `### 🏢 Municipal Security Assessment & Actions

Thank you for consulting the **CivicEye Copilot Agent**. Based on the current dataset, here is the executive analysis:

#### Real-time Metrics:
* **Total Tickets:** ${total}
* **Active Concerns:** ${activeIssues.length}
* **Completed Resolutions:** ${resolvedCount}
* **Current Service-Level Rate:** **${rate}%**

#### ⚠️ Immediate Critical Threat Index:
1. **Burst Water Main Flooding Emergency Entrance** (Priority Score: **96**)
   - Location: Mercy General hospital ingress road.
   - Recommended: Commandeer water crew to shut off primary valve within 30 minutes.
2. **Broken Streetlight reported on Chambers Street** (Priority Score: **83**)
   - Recommended: Dispatch utility truck to replace ballast and bulb.

Our smart city models estimate that closing these two tickets will elevate regional citizen satisfaction indices by **+14%** in Ward 4 and Ward 1.`;
          }

          return new Response(JSON.stringify({ text: responseText }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        }

        // 10. GET /api/predictions
        if (pathname === "/api/predictions" && method === "GET") {
          const predictions = [
            {
              id: "pred-1",
              title: "Asphalt Shear Fatigue & Pothole Risk",
              category: "Pothole",
              gps: {
                lat: 40.7132,
                lng: -74.0045,
                address: "512 Broadway (High traffic congestion corridor)"
              },
              riskFactor: 88,
              predictionReason: "Heavy asphalt shear strain combined with high bus transit frequency. Visual micro-fracturing detected by municipality scans suggests rapid base-soil loosening.",
              confidenceScore: 92,
              timeHorizon: "Next 30 days"
            },
            {
              id: "pred-2",
              title: "Secondary Sub-surface Water Pipe Strain",
              category: "Water Leakage",
              gps: {
                lat: 40.7142,
                lng: -74.0112,
                address: "Chambers St & Greenwich St intersection"
              },
              riskFactor: 74,
              predictionReason: "Slight pressure drop anomaly registered on downstream nodes coupled with regional pipeline ages (installed 1968 cast-iron). High correlation to nearby Mercy Hospital break.",
              confidenceScore: 81,
              timeHorizon: "Next 30 days"
            },
            {
              id: "pred-3",
              title: "Micro-grid Overloading & Transformer Sage",
              category: "Broken Streetlight",
              gps: {
                lat: 40.7178,
                lng: -73.9989,
                address: "Delancey St near Williamsburg Bridge Approach"
              },
              riskFactor: 82,
              predictionReason: "Historical peak-load degradation. High thermal camera readings on block level step-down transformers indicate thermal stress, with projected lamp post failures.",
              confidenceScore: 89,
              timeHorizon: "Next 30 days"
            }
          ];

          return new Response(JSON.stringify(predictions), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        }
      } catch (err: any) {
        console.error("[Client API Interceptor Error]", err);
        return new Response(JSON.stringify({ error: err.message || "Internal server error" }), { status: 500 });
      }
    }

    return originalFetch.apply(this, [input, init]);
  };

  try {
    Object.defineProperty(window, "fetch", {
      value: interceptedFetch,
      configurable: true,
      writable: true,
    });
  } catch (e) {
    console.warn("Failed to overwrite fetch using Object.defineProperty, trying direct assignment:", e);
    try {
      (window as any).fetch = interceptedFetch;
    } catch (err) {
      console.error("Critical error: Could not intercept window.fetch", err);
    }
  }

  console.log("Client-Side API Interceptor mounted and active.");
}
