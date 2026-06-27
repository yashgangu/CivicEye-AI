import React from "react";
import { Eye, Award, LogOut, User, Sparkles, Shield, Compass, CheckSquare, Layers, HelpCircle } from "lucide-react";
import { UserProfile } from "../types";
import { motion } from "motion/react";

interface HeaderProps {
  user: UserProfile;
  currentTab: string;
  setTab: (tab: string) => void;
  onLogout: () => void;
  onRoleChange: (role: "citizen" | "authority" | "admin") => void;
}

export default function Header({ user, currentTab, setTab, onLogout, onRoleChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#0c0c0e]/80 backdrop-blur-md border-b border-zinc-800 px-4 py-3" id="main-header">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Branding */}
        <div className="flex items-center justify-between" id="header-brand">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setTab("landing")}>
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-900/20">
              <Eye className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1">
                CivicEye <span className="text-blue-400 font-mono text-[10px] px-1.5 py-0.2 bg-blue-600/10 border border-blue-500/20 rounded">AI</span>
              </h1>
              <p className="text-[10px] text-zinc-500 font-mono tracking-wider">RESOLVING COMMUNITIES</p>
            </div>
          </div>
          
          <button onClick={onLogout} className="md:hidden p-2 text-zinc-400 hover:text-rose-400 transition-colors" title="Log Out">
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0" id="header-tabs">
          <button
            onClick={() => setTab("landing")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
              currentTab === "landing"
                ? "bg-zinc-900 text-white border border-zinc-800"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Home
          </button>
          
          <button
            onClick={() => setTab("citizen")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
              currentTab === "citizen"
                ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            Citizen Dashboard
          </button>

          <button
            onClick={() => setTab("transparency")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
              currentTab === "transparency"
                ? "bg-amber-600/10 text-amber-400 border border-amber-500/20"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Transparency Wall
          </button>

          {(user.role === "authority" || user.role === "admin") && (
            <button
              onClick={() => setTab("authority")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                currentTab === "authority"
                  ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Authority Portal
            </button>
          )}

          {user.role === "admin" && (
            <button
              onClick={() => setTab("admin")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                currentTab === "admin"
                  ? "bg-purple-600/10 text-purple-400 border border-purple-500/20"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Admin Insights
            </button>
          )}
        </nav>

        {/* User Stats and Logout */}
        <div className="flex items-center justify-between md:justify-end gap-3.5" id="header-user-section">
          {/* User Profile Info */}
          <div className="flex items-center gap-3 bg-zinc-900/40 border border-zinc-800/80 px-3 py-1.5 rounded-xl" id="user-info-badge">
            <div className="text-right hidden sm:block">
              <span className="block text-xs font-semibold text-zinc-200">{user.name}</span>
              <div className="flex items-center gap-1 justify-end">
                <Award className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="text-xs font-mono font-bold text-amber-400">{user.rewardPoints} Pts</span>
              </div>
            </div>
            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-zinc-700 object-cover" />
          </div>

          <button
            onClick={onLogout}
            className="hidden md:flex items-center justify-center p-2.5 bg-zinc-900 hover:bg-rose-950/30 border border-zinc-800 hover:border-rose-500/20 text-zinc-400 hover:text-rose-400 rounded-xl transition-all cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
}
