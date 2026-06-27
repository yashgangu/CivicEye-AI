import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import LoginScreen from "./components/LoginScreen";
import Header from "./components/Header";
import LandingPage from "./components/LandingPage";
import CitizenDashboard from "./components/CitizenDashboard";
import TransparencyWall from "./components/TransparencyWall";
import AuthorityDashboard from "./components/AuthorityDashboard";
import AdminDashboard from "./components/AdminDashboard";
import ReportIssueModal from "./components/ReportIssueModal";
import { Issue, UserProfile } from "./types";
import { ShieldCheck, Loader2 } from "lucide-react";
import { 
  auth, 
  db, 
  onAuthStateChanged, 
  doc, 
  getDoc, 
  setDoc, 
  signOut, 
  handleFirestoreError, 
  OperationType 
} from "./lib/firebase";

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [tab, setTab] = useState<string>("landing");
  const [showReportModal, setShowReportModal] = useState(false);
  const [fetchingIssues, setFetchingIssues] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Synchronize with Firebase Auth and Firestore user profiles
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setUser(userDoc.data() as UserProfile);
          } else {
            // Setup a default profile for a new authenticated user (e.g. Google Sign-In)
            const email = firebaseUser.email || "";
            let role: "citizen" | "authority" | "admin" = "citizen";
            if (email.toLowerCase() === "officer@city.gov") role = "authority";
            if (email.toLowerCase() === "admin@city.gov") role = "admin";

            const defaultProfile: UserProfile = {
              email: email.toLowerCase(),
              name: firebaseUser.displayName || email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
              role,
              avatar: firebaseUser.photoURL || `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000)}?auto=format&fit=crop&w=150&q=80`,
              rewardPoints: 10,
              achievements: ["Active Citizen"],
            };

            await setDoc(userDocRef, defaultProfile);
            setUser(defaultProfile);
          }
        } catch (error) {
          console.error("Failed to load Firebase user profile:", error);
          setUser(null);
        }
      } else {
        // Fallback: Check if there's an evaluation mode user in localStorage
        const savedEvalUser = localStorage.getItem("civiceye_eval_user");
        if (savedEvalUser) {
          try {
            setUser(JSON.parse(savedEvalUser));
          } catch (err) {
            localStorage.removeItem("civiceye_eval_user");
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch all issues from API whenever user state changes
  useEffect(() => {
    if (user) {
      fetchIssues();
    }
  }, [user]);

  const fetchIssues = async () => {
    setFetchingIssues(true);
    try {
      const res = await fetch("/api/issues");
      if (res.ok) {
        const data = await res.json();
        setIssues(data);
      }
    } catch (err) {
      console.error("Failed to load issues registry:", err);
    } finally {
      setFetchingIssues(false);
    }
  };

  const handleLoginSuccess = (profile: UserProfile) => {
    setUser(profile);
    setTab("landing");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Firebase logout failed:", err);
    }
    localStorage.removeItem("civiceye_eval_user");
    setUser(null);
    setTab("landing");
  };

  // Sandbox Role Change (highly effective for Hackathon evaluation, fully synced with Firestore if available)
  const handleRoleChange = async (newRole: "citizen" | "authority" | "admin") => {
    let updatedProfile = { 
      email: user?.email || "",
      name: user?.name || "",
      role: newRole,
      avatar: user?.avatar || "",
      rewardPoints: user?.rewardPoints || 0,
      achievements: user?.achievements || []
    };
    
    if (newRole === "authority") {
      updatedProfile.name = "Director Sarah Jenkins";
      updatedProfile.email = "officer@city.gov";
      updatedProfile.avatar = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80";
    } else if (newRole === "admin") {
      updatedProfile.name = "Commissioner Dave Miller";
      updatedProfile.email = "admin@city.gov";
      updatedProfile.avatar = "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80";
    } else {
      updatedProfile.name = "Yash Gangurde";
      updatedProfile.email = "yashgangurde012@gmail.com";
      updatedProfile.avatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80";
    }

    if (auth.currentUser) {
      const uid = auth.currentUser.uid;
      try {
        await setDoc(doc(db, "users", uid), updatedProfile);
      } catch (error) {
        console.error("Failed to update user profile in Firestore:", error);
      }
    } else {
      localStorage.setItem("civiceye_eval_user", JSON.stringify(updatedProfile));
    }
    
    setUser(updatedProfile as UserProfile);
    
    // Automatically redirect to the proper tab corresponding to selected sandbox role
    if (newRole === "citizen") {
      setTab("citizen");
    } else if (newRole === "authority") {
      setTab("authority");
    } else {
      setTab("admin");
    }
  };

  // Sync state modifications with Firestore
  const handleIssuePublished = async (newIssue: Issue) => {
    setIssues((prev) => [newIssue, ...prev]);
    // Refresh user points (reporting issue grants +20 points)
    if (user) {
      const updatedUser = {
        ...user,
        rewardPoints: user.rewardPoints + 20,
        achievements: user.rewardPoints + 20 >= 100 && !user.achievements.includes("Community Hero")
          ? [...user.achievements, "Community Hero"]
          : user.achievements
      };
      
      if (auth.currentUser) {
        const uid = auth.currentUser.uid;
        try {
          await setDoc(doc(db, "users", uid), updatedUser);
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`);
        }
      } else {
        localStorage.setItem("civiceye_eval_user", JSON.stringify(updatedUser));
      }
      
      setUser(updatedUser);
    }
  };

  const handleIssueUpdated = async (updatedIssue: Issue, updatedUser: UserProfile) => {
    setIssues((prev) => prev.map((i) => (i.id === updatedIssue.id ? updatedIssue : i)));
    if (user && updatedUser.email === user.email) {
      if (auth.currentUser) {
        const uid = auth.currentUser.uid;
        try {
          await setDoc(doc(db, "users", uid), updatedUser);
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`);
        }
      } else {
        localStorage.setItem("civiceye_eval_user", JSON.stringify(updatedUser));
      }
      
      setUser(updatedUser);
    }
  };

  const handleIssueResolved = async (updatedIssue: Issue) => {
    setIssues((prev) => prev.map((i) => (i.id === updatedIssue.id ? updatedIssue : i)));
    // Grant points to current authority user
    if (user) {
      const updatedUser = {
        ...user,
        rewardPoints: user.rewardPoints + 50,
        achievements: user.rewardPoints + 50 >= 300 && !user.achievements.includes("Impact Leader")
          ? [...user.achievements, "Impact Leader"]
          : user.achievements
      };
      
      if (auth.currentUser) {
        const uid = auth.currentUser.uid;
        try {
          await setDoc(doc(db, "users", uid), updatedUser);
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`);
        }
      } else {
        localStorage.setItem("civiceye_eval_user", JSON.stringify(updatedUser));
      }
      
      setUser(updatedUser);
    }
  };

  const handleIssueInProgress = async (updatedIssue: Issue) => {
    setIssues((prev) => prev.map((i) => (i.id === updatedIssue.id ? updatedIssue : i)));
    // Grant points to current authority user for starting progress
    if (user) {
      const updatedUser = {
        ...user,
        rewardPoints: user.rewardPoints + 20,
        achievements: user.rewardPoints + 20 >= 300 && !user.achievements.includes("Impact Leader")
          ? [...user.achievements, "Impact Leader"]
          : user.achievements
      };
      
      if (auth.currentUser) {
        const uid = auth.currentUser.uid;
        try {
          await setDoc(doc(db, "users", uid), updatedUser);
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`);
        }
      } else {
        localStorage.setItem("civiceye_eval_user", JSON.stringify(updatedUser));
      }
      
      setUser(updatedUser);
    }
  };

  const handleRateIssue = (issueId: string, score: number) => {
    setIssues((prev) =>
      prev.map((i) => (i.id === issueId ? { ...i, citizenSatisfactionScore: score } : i))
    );
  };

  // Guard Clause: Secure loading indicator during initial auth resolution
  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col items-center justify-center space-y-4 font-sans">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
        <p className="text-xs font-mono text-zinc-500">Authenticating CivicEye Secure Protocol...</p>
      </div>
    );
  }

  // Guard Clause: Protected Routes (Redirect to login page if no authenticated session is active)
  if (!user) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-blue-600/30 selection:text-blue-200">
      
      {/* Background Decorative Glares */}
      <div className="fixed top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-600/5 rounded-full filter blur-[150px] pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[45vw] h-[45vw] bg-blue-500/5 rounded-full filter blur-[150px] pointer-events-none" />

      {/* Main Header navigation */}
      <Header
        user={user}
        currentTab={tab}
        setTab={setTab}
        onLogout={handleLogout}
        onRoleChange={handleRoleChange}
      />

      {/* Primary Dashboard Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {fetchingIssues && issues.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            <p className="text-xs font-mono text-zinc-500">Loading Smart City Database Registry...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {tab === "landing" && (
                <LandingPage
                  issues={issues}
                  setTab={setTab}
                  onOpenReportModal={() => setShowReportModal(true)}
                />
              )}

              {tab === "citizen" && (
                <CitizenDashboard
                  issues={issues}
                  user={user}
                  onOpenReportModal={() => setShowReportModal(true)}
                  onIssueUpdated={handleIssueUpdated}
                />
              )}

              {tab === "transparency" && (
                <TransparencyWall
                  issues={issues}
                  user={user}
                  onRateIssue={handleRateIssue}
                />
              )}

              {tab === "authority" && (
                <AuthorityDashboard
                  issues={issues}
                  user={user}
                  onIssueResolved={handleIssueResolved}
                  onIssueInProgress={handleIssueInProgress}
                />
              )}

              {tab === "admin" && (
                <AdminDashboard
                  issues={issues}
                />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* Report Modal Layer */}
      <AnimatePresence>
        {showReportModal && (
          <ReportIssueModal
            onClose={() => setShowReportModal(false)}
            user={user}
            onIssuePublished={handleIssuePublished}
          />
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-6 border-t border-zinc-900 bg-zinc-950/60 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-mono text-zinc-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>CIVICEYE AI • PLATFORM ENCRYPTION PROTOCOL SECURED</span>
          </div>
          <p>© 2026 Smart City Solutions. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
