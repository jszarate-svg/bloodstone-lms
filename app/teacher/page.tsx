"use client";

import Link from "next/link";
import { 
  Users, 
  FileText, 
  Sparkles, 
  Grid, 
  CheckCircle2, 
  TrendingUp, 
  BookOpen, 
  GraduationCap,
  ArrowUpRight
} from "lucide-react";

export default function TeacherDashboard() {
  const tools = [
    {
      title: "Seat Plan Generator",
      description: "Smart automated seating arrangements, custom grid dimensions, and print-ready classroom layouts.",
      href: "/teacher/seatplan",
      icon: Users,
      badge: "NEW TOOL",
      badgeStyle: "bg-red-500/10 text-red-400 border-red-500/20",
      accent: "from-red-500/20 to-orange-500/5",
    },
    {
      title: "SF2 Generator",
      description: "Official DepEd School Form 2 daily attendance logger with wet-ink signature spacing.",
      href: "#",
      icon: FileText,
      badge: "MONITORING",
      badgeStyle: "bg-slate-800 text-slate-400 border-slate-700/50",
      accent: "from-slate-800/40 to-slate-900/40",
    },
    {
      title: "ILAW DLP Generator",
      description: "Parse lesson objectives and auto-generate weekly DepEd Daily Lesson Plans with AI.",
      href: "#",
      icon: Sparkles,
      badge: "GEMINI AI",
      badgeStyle: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      accent: "from-purple-500/20 to-pink-500/5",
    },
    {
      title: "WeeLMat Generator",
      description: "Automatically compile 5-day Weekly Learning Matrices directly from saved DLP records.",
      href: "#",
      icon: Grid,
      badge: "AUTO-LINKED",
      badgeStyle: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      accent: "from-blue-500/20 to-indigo-500/5",
    },
    {
      title: "Student Information System",
      description: "Manage enrolled rosters, batch-print grade slips, credentials, and academic logs.",
      href: "#",
      icon: GraduationCap,
      badge: "ROSTER",
      badgeStyle: "bg-slate-800 text-slate-400 border-slate-700/50",
      accent: "from-slate-800/40 to-slate-900/40",
    },
    {
      title: "ARAL Program MS",
      description: "Track ARAL attendance, progress benchmarks, and generate weekly learner metrics.",
      href: "#",
      icon: TrendingUp,
      badge: "TRACKER",
      badgeStyle: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      accent: "from-emerald-500/20 to-teal-500/5",
    },
  ];

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 p-6 md:p-10 space-y-8 selection:bg-red-500/30">
      {/* Top Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-950/30 via-slate-900/60 to-slate-900/80 border border-slate-800/80 p-8 backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Grade 11 - BLOODSTONE Adviser Portal
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-200">Judimer</span>
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
            Manage your classroom roster, generate compliant DepEd documentation, and organize seat plans seamlessly.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden group hover:border-slate-700/80 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Enrolled</span>
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">33</span>
            <span className="text-xs text-slate-400">20 Male • 13 Female</span>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden group hover:border-slate-700/80 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Attendance Rate</span>
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400">98.3%</span>
            <span className="text-xs text-slate-400">Month of OCTOBER</span>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden group hover:border-slate-700/80 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Class Academic Avg</span>
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">0.0</span>
            <span className="text-xs text-slate-400">Grade 11 - BLOODSTONE</span>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden group hover:border-slate-700/80 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">ARAL Program Tutees</span>
            <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">18</span>
            <span className="text-xs text-slate-400">64.6% Attendance Rate</span>
          </div>
        </div>
      </div>

      {/* Main Tools Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white tracking-wide">Adviser Suite & Management Tools</h2>
          <span className="text-xs text-slate-500">6 Active Modules</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <Link key={index} href={tool.href} className="block group">
                <div className="relative h-full bg-slate-900/50 hover:bg-slate-900/80 border border-slate-800/80 hover:border-red-500/40 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-red-950/20 backdrop-blur-xl flex flex-col justify-between overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${tool.accent} opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none`}/>
                  
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-3.5 bg-slate-800/60 border border-slate-700/50 text-red-400 rounded-xl group-hover:bg-red-600 group-hover:text-white group-hover:border-red-500 transition-all duration-300">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-bold tracking-wider px-2.5 py-1 border rounded-full uppercase ${tool.badgeStyle}`}>
                        {tool.badge}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between group-hover:text-red-400 transition">
                        <h3 className="font-bold text-white text-lg tracking-tight">
                          {tool.title}
                        </h3>
                        <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-red-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                      </div>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
