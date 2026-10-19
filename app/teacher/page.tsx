"use client";
import { useState } from "react";

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <header className="border-b border-slate-800 pb-4 mb-8 flex justify-between items-center">
        <h1 className="text-xl font-black">BLOODSTONE <span className="text-red-500">LMS</span> - Teacher Portal</h1>
      </header>
      <main className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Adviser Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-red-500/50 cursor-pointer transition">
            <h3 className="font-bold text-lg mb-1">SF2 Attendance</h3>
            <p className="text-xs text-slate-400">School Form 2 Daily Attendance Report</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-red-500/50 cursor-pointer transition">
            <h3 className="font-bold text-lg mb-1">ILAW DLP Generator</h3>
            <p className="text-xs text-slate-400">Daily Lesson Log Generator</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-red-500/50 cursor-pointer transition">
            <h3 className="font-bold text-lg mb-1">ARAL Program</h3>
            <p className="text-xs text-slate-400">Reading & Tutoring Progress</p>
          </div>
        </div>
      </main>
    </div>
  );
}
