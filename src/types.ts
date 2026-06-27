export interface GPSLocation {
  lat: number;
  lng: number;
  address: string;
}

export interface Verification {
  citizenEmail: string;
  type: "confirm" | "reject";
  comment?: string;
  timestamp: string;
}

export interface ImpactAssessment {
  riskLevel: "Critical" | "High" | "Medium" | "Low";
  accidentProbability: number; // 0 to 100
  environmentalImpact: string;
  populationAffected: number;
  nearbyFacilities: string[]; // e.g., ["Nearby Hospital (0.2km)", "High School (0.4km)"]
  explanation: string;
}

export interface ResolutionRecommendation {
  responsibleDepartment: string;
  suggestedResolution: string;
  estimatedCost: string;
  estimatedCompletionTime: string;
  requiredWorkforce: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  confidenceScore: number; // e.g. 94 for 94%
  department: string;
  status: "Reported" | "In Progress" | "Resolved";
  imageUrl: string;
  resolvedImageUrl?: string;
  resolvedNotes?: string;
  resolvedAt?: string;
  resolutionTimeDays?: number;
  gps: GPSLocation;
  reporterEmail: string;
  reporterName: string;
  verificationCount: number;
  rejectionCount: number;
  verifications: Verification[];
  impact: ImpactAssessment;
  priorityScore: number; // Calculated on server
  priorityReason: string;
  resolution: ResolutionRecommendation;
  createdAt: string;
  citizenSatisfactionScore?: number; // 1-5 stars if citizen rates the resolution
}

export interface UserProfile {
  email: string;
  name: string;
  role: "citizen" | "authority" | "admin";
  avatar: string;
  rewardPoints: number;
  achievements: string[]; // e.g. ["Top Verifier", "Community Hero"]
}

export interface PredictiveHotspot {
  id: string;
  title: string;
  category: string;
  gps: GPSLocation;
  riskFactor: number; // 0 to 100
  predictionReason: string;
  confidenceScore: number;
  timeHorizon: string; // e.g. "Next 30 days"
}

export interface CopilotMessage {
  role: "user" | "model";
  text: string;
  timestamp: string;
}
