"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Users, 
  FileText, 
  Sparkles, 
  Grid, 
  GraduationCap, 
  TrendingUp, 
  Sun, 
  LogOut, 
  X 
} from "lucide-react";

export default function TeacherDashboard() {
  const [showBanner, setShowBanner] = useState(true);

  const tools = [
    {
      title: "Seat Plan Generator",
      description: "Smart automated seating arrangements, grid customization, and printable classroom layouts.",
      href: "/teacher/seatplan",
      badge: "NEW TOOL",
      badgeColor: "bg-rose-500/10 text-rose-300 border-rose-500/20",
      icon: Users,
    },
    {
      title: "SF2 Generator",
      description: "Official DepEd School Form 2 daily attendance generator with dedicated wet ink signature spacing.",
      href: "#",
      badge: "MONITORING",
      badgeColor: "bg-slate-800/80 text-slate-400 border-slate-700/50",
      icon: FileText,
    },
    {
      title: "ILAW DLP Generator",
      description: "Input lesson details, parse multi-session slide decks, and generate weekly DepEd Daily Lesson Plans.",
      href: "#",
      badge: "GEMINI AI",
      badgeColor: "bg-purple-500/10 text-purple-300 border-purple-500/20",
      icon: Sparkles,
    },
    {
      title: "WeeLMat Generator",
      description: "Automatically generates 5-Day Weekly Learning Matrix from your saved DLP plans.",
      href: "#",
      badge: "AUTO-LINKED",
      badgeColor: "bg-blue-500/10 text-blue-300 border-blue-500/20",
      icon: Grid,
    },
    {
      title: "Student Information System",
      description: "Enrolled learners roster, batch grade slip printer, passwords & grade management.",
      href: "#",
      badge: "MONITORING",
      badgeColor: "bg-slate-800/80 text-slate-400 border-slate-700/50",
      icon: GraduationCap,
    },
    {
      title: "ARAL Program MS",
      description: "Track ARAL attendance logs, progress targets & generate automated weekly learner reports.",
      href: "#",
      badge: "MONITORING",
      badgeColor: "bg-slate-800/80 text-slate-400 border-slate-700/50",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-screen bg-[#08090D] text-slate-100 selection:bg-rose-500/30 font-sans tracking-tight">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#08090D]/80 backdrop-blur-xl px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="font-black text-lg tracking-wider text-white">
            BLOODSTONE <span className="text-rose-500 text-sm font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 ml-1">TEACHER PORTAL</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-full hover:bg-amber-500/20 transition">
            <Sun className="w-3.5 h-3.5" /> Light Mode
          </button>
          <div className="text-right hidden md:block">
            <div className="text-xs font-bold text-slate-200">JUDIMER JOHN S. ZARATE</div>
            <div className="text-[10px] text-slate-400">Class Adviser • Grade 11</div>
          </div>
          <button className="p-2 text-slate-400 hover:text-white bg-slate-900/60 border border-white/[0.08] rounded-xl hover:bg-slate-800 transition">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
        {/* Welcome Banner */}
        {showBanner && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-950/20 via-slate-900/40 to-slate-900/60 border border-white/[0.08] p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] backdrop-blur-2xl transition-all">
            <div className="flex items-start justify-between gap-4 relative z-10">
              <div className="space-y-1">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  Good Evening, <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-200">Judimer Zarate</span>!
                </h1>
                <p className="text-xs md:text-sm text-slate-400">
                  Welcome back to the Bloodstone LMS Portal. Grade 11 - BLOODSTONE active management session.
                </p>
              </div>
              <button 
                onClick={() => setShowBanner(false)}
                className="text-slate-500 hover:text-slate-300 p-1 rounded-lg hover:bg-white/5 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Section Header */}
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">Adviser Dashboard</h2>
          <p className="text-xs text-slate-400 mt-0.5">Overview & management suite for Grade 11 - BLOODSTONE</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#11131F]/50 border border-white/[0.08] backdrop-blur-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
            <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Total Enrolled</div>
            <div className="text-3xl font-black text-white mt-2">33</div>
            <div className="text-[11px] text-slate-500 mt-1">20 Male • 13 Female</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#11131F]/50 border border-white/[0.08] backdrop-blur-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
            <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Attendance Rate</div>
            <div className="text-3xl font-black text-emerald-400 mt-2">98.3%</div>
            <div className="text-[11px] text-slate-500 mt-1">Month of OCTOBER</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#11131F]/50 border border-white/[0.08] backdrop-blur-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
            <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Class Academic Avg</div>
            <div className="text-3xl font-black text-amber-400 mt-2">0.0</div>
            <div className="text-[11px] text-slate-500 mt-1">Grade 11 - BLOODSTONE</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#11131F]/50 border border-white/[0.08] backdrop-blur-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
            <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">ARAL Program Tutees</div>
            <div className="text-3xl font-black text-rose-400 mt-2">18</div>
            <div className="text-[11px] text-slate-500 mt-1">64.6% Attendance Rate</div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <Link 
                key={idx} 
                href={tool.href}
                className="group relative block p-6 rounded-2xl bg-[#11131F]/60 hover:bg-[#151827]/90 border border-white/[0.08] hover:border-rose-500/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] hover:shadow-2xl hover:shadow-rose-950/20 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-rose-400 group-hover:bg-rose-500 group-hover:text-white transition-all duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full border uppercase ${tool.badgeColor}`}>
                    {tool.badge}
                  </span>
                </div>

                <div className="mt-5 space-y-2">
                  <h3 className="font-bold text-white text-base group-hover:text-rose-300 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
