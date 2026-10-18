'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, User, Lock, ArrowRight, Eye, EyeOff, KeyRound, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Initial Setup state for Teacher
  const [isFirstTeacherSetup, setIsFirstTeacherSetup] = useState(false);
  const [newTeacherPassword, setNewTeacherPassword] = useState('');
  const [confirmTeacherPassword, setConfirmTeacherPassword] = useState('');

  useEffect(() => {
    const savedTeacherPass = localStorage.getItem('teacher_custom_password');
    if (!savedTeacherPass) {
      setIsFirstTeacherSetup(true);
    }
  }, []);

  const handleTeacherInitialSetup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherPassword || newTeacherPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (newTeacherPassword !== confirmTeacherPassword) {
      setError('Passwords do not match.');
      return;
    }

    localStorage.setItem('teacher_custom_password', newTeacherPassword);
    localStorage.setItem('user_role', 'teacher');
    localStorage.setItem('user_name', 'Judimer Zarate');
    setIsFirstTeacherSetup(false);
    router.push('/teacher');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanInput = identifier.trim();
    const isLRN = /^\d{12}$/.test(cleanInput);

    if (isLRN) {
      // AUTO-DETECTED STUDENT LOGIN (12-Digit LRN)
      const studentAccounts = JSON.parse(localStorage.getItem('student_accounts_registry') || '{}');
      const studentRegisteredPass = studentAccounts[cleanInput]?.password;

      if (studentRegisteredPass) {
        if (password !== studentRegisteredPass) {
          setError('Incorrect student password.');
          return;
        }
      } else {
        // First-time password creation for student
        if (!password) {
          setError('First time logging in? Enter a new password to register your account.');
          return;
        }
        studentAccounts[cleanInput] = {
          lrn: cleanInput,
          password: password,
          createdAt: new Date().toISOString()
        };
        localStorage.setItem('student_accounts_registry', JSON.stringify(studentAccounts));
      }

      localStorage.setItem('user_role', 'student');
      localStorage.setItem('user_lrn', cleanInput);
      router.push('/student');
    } else {
      // AUTO-DETECTED TEACHER LOGIN
      const savedPass = localStorage.getItem('teacher_custom_password') || 'teacher123';
      
      if (password === savedPass) {
        localStorage.setItem('user_role', 'teacher');
        localStorage.setItem('user_name', 'Judimer Zarate');
        router.push('/teacher');
      } else {
        setError('Incorrect password. (For student login, make sure LRN is 12 digits)');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 font-sans selection:bg-red-500 selection:text-white">
      
      {/* BRANDING HEADER */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-3.5 py-1 rounded-full text-red-400 text-xs font-bold uppercase tracking-widest">
          <GraduationCap className="w-4 h-4" /> Bagonbon NHS Portal
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white">
          BLOODSTONE <span className="text-red-500">LMS</span>
        </h1>
        <p className="text-xs text-slate-400">Class Management & Student Grade Inquiry System</p>
      </div>

      {/* LOGIN CARD */}
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 shadow-2xl space-y-6 backdrop-blur-md">
        
        {isFirstTeacherSetup ? (
          /* FIRST TIME TEACHER SETUP FORM */
          <form onSubmit={handleTeacherInitialSetup} className="space-y-4">
            <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl text-xs text-amber-300 font-medium space-y-1">
              <p className="font-bold flex items-center gap-1.5"><KeyRound className="w-4 h-4 text-amber-400" /> Initial Teacher Setup</p>
              <p className="text-[11px] text-amber-200/80">Welcome Adviser Judimer! Set your custom teacher password before opening the dashboard.</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-2.5 rounded-xl text-xs font-medium text-center">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-300">Create Custom Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  value={newTeacherPassword}
                  onChange={e => setNewTeacherPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 pl-9 pr-10 rounded-xl text-xs text-white focus:outline-none focus:border-red-500/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-300">Confirm Custom Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Repeat custom password"
                  value={confirmTeacherPassword}
                  onChange={e => setConfirmTeacherPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 pl-9 pr-10 rounded-xl text-xs text-white focus:outline-none focus:border-red-500/50"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg transition">
              Save Password & Access Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* UNIFIED AUTO-DETECT FORM */
          <form onSubmit={handleLogin} className="space-y-4">
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs font-medium text-center">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-slate-300">Identifier</label>
                <span className="text-[10px] text-slate-400 font-medium">LRN or Teacher Username</span>
              </div>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Enter 12-digit LRN (Student) or Username (Teacher)"
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 pl-9 rounded-xl text-xs text-white focus:outline-none focus:border-red-500/50"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-300">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter account password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 pl-9 pr-10 rounded-xl text-xs text-white focus:outline-none focus:border-red-500/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg transition">
              Sign In <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
