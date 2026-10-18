'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, LogOut, Award, Calendar, Lock, Eye, EyeOff, Printer, UserCheck } from 'lucide-react';

export default function StudentPortal() {
  const router = useRouter();
  const [studentLrn, setStudentLrn] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    const lrn = localStorage.getItem('user_lrn') || '117792150110';
    setStudentLrn(lrn);
  }, []);

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 4) return;

    const studentAccounts = JSON.parse(localStorage.getItem('student_accounts_registry') || '{}');
    studentAccounts[studentLrn] = {
      ...(studentAccounts[studentLrn] || {}),
      lrn: studentLrn,
      password: newPassword,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem('student_accounts_registry', JSON.stringify(studentAccounts));
    setPasswordSuccess('Password updated successfully! Your adviser can view this in SIS.');
    setNewPassword('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-red-500 selection:text-white">
      
      {/* HEADER */}
      <header className="bg-slate-900/90 border-b border-slate-800 px-6 py-3.5 flex justify-between items-center sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <span className="text-lg font-black tracking-tight text-white">
            BLOODSTONE <span className="text-red-500">LMS</span>
          </span>
          <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Student Portal
          </span>
        </div>

        <button 
          onClick={() => {
            localStorage.removeItem('user_role');
            localStorage.removeItem('user_lrn');
            router.push('/');
          }} 
          className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700/80 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700/50 transition">
          <LogOut className="w-3.5 h-3.5" /> Logout
        </button>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-4xl mx-auto p-6 space-y-6">
        
        {/* STUDENT WELCOME CARD */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
          <div>
            <div className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" /> Senior High School Program
            </div>
            <h2 className="text-2xl font-black text-white">Learner Portal</h2>
            <p className="text-xs text-slate-400 mt-1">
              LRN: <span className="font-mono text-amber-300 font-bold">{studentLrn}</span> • Grade 11 - Section BLOODSTONE
            </p>
          </div>

          <button 
            onClick={() => window.print()}
            className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg transition">
            <Printer className="w-4 h-4" /> Print My Grade Slip
          </button>
        </div>

        {/* GRADE SLIP DISPLAY */}
        <div className="bg-white text-slate-900 p-6 rounded-2xl shadow-2xl font-sans border border-slate-300">
          <div className="text-center border-b-2 border-slate-900 pb-3 mb-4 space-y-0.5">
            <div className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Department of Education • Bagonbon National High School</div>
            <div className="text-sm font-black text-slate-900 uppercase">Official Learner Grade Slip</div>
            <div className="text-[10px] font-semibold text-slate-700">School Year 2026-2027</div>
          </div>

          <table className="w-full text-xs border-collapse border border-slate-900 text-center mb-4">
            <thead>
              <tr className="bg-slate-200 font-bold text-slate-900">
                <th className="border border-slate-900 p-2 text-left">Learning Area / Subject</th>
                <th className="border border-slate-900 p-2 w-16">Term 1</th>
                <th className="border border-slate-900 p-2 w-16">Term 2</th>
                <th className="border border-slate-900 p-2 w-16">Term 3</th>
                <th className="border border-slate-900 p-2 w-20">Final Rating</th>
                <th className="border border-slate-900 p-2 w-20">Remarks</th>
              </tr>
            </thead>
            <tbody className="font-medium">
              <tr>
                <td className="border border-slate-900 p-2 text-left font-bold">General Mathematics</td>
                <td className="border border-slate-900 p-2">88</td>
                <td className="border border-slate-900 p-2">90</td>
                <td className="border border-slate-900 p-2">91</td>
                <td className="border border-slate-900 p-2 font-bold">89.7</td>
                <td className="border border-slate-900 p-2 font-bold text-emerald-700">PASSED</td>
              </tr>
              <tr>
                <td className="border border-slate-900 p-2 text-left font-bold">General Science</td>
                <td className="border border-slate-900 p-2">85</td>
                <td className="border border-slate-900 p-2">87</td>
                <td className="border border-slate-900 p-2">89</td>
                <td className="border border-slate-900 p-2 font-bold">87.0</td>
                <td className="border border-slate-900 p-2 font-bold text-emerald-700">PASSED</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* STUDENT PASSWORD MANAGEMENT PANEL */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" /> Update Student Account Password
          </h3>

          {passwordSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl text-xs">
              {passwordSuccess}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 p-2.5 pr-10 rounded-xl text-xs text-white focus:outline-none focus:border-red-500/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-500 hover:text-slate-300">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition">
              Update Password
            </button>
          </form>
        </div>

      </main>
    </div>
  );
}
