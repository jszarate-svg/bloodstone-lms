"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Users, Shuffle, UserCheck, Grid, Printer, RotateCcw, Sparkles, ArrowLeft } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  gender: 'Male' | 'Female';
}

export default function SeatPlanPage() {
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(6);
  const [rawRoster, setRawRoster] = useState('');
  const [students, setStudents] = useState<Student[]>([
    { id: '1', name: 'Abalos, Juan', gender: 'Male' },
    { id: '2', name: 'Bautista, Maria', gender: 'Female' },
    { id: '3', name: 'Cruz, Pedro', gender: 'Male' },
    { id: '4', name: 'Dizon, Ana', gender: 'Female' },
    { id: '5', name: 'Espina, Carlos', gender: 'Male' },
    { id: '6', name: 'Flores, Elena', gender: 'Female' },
    { id: '7', name: 'Garcia, Jose', gender: 'Male' },
    { id: '8', name: 'Hernandez, Teresa', gender: 'Female' },
    { id: '9', name: 'Ignacio, Gabriel', gender: 'Male' },
    { id: '10', name: 'Joaquin, Sofia', gender: 'Female' },
  ]);
  const [seatingGrid, setSeatingGrid] = useState<(Student | null)[][]>([]);

  // Statistics
  const maleCount = useMemo(() => students.filter((s) => s.gender === 'Male').length, [students]);
  const femaleCount = useMemo(() => students.filter((s) => s.gender === 'Female').length, [students]);
  const totalCount = students.length;

  // Smart Recommendation Logic
  const recommendation = useMemo(() => {
    if (totalCount === 0) {
      return {
        bestRows: 5,
        bestCols: 6,
        capacity: 30,
        emptySeats: 30,
        patternSuggestion: 'Random Shuffle',
        rationale: 'Add students to calculate recommendation.',
      };
    }

    let bestRows = Math.ceil(Math.sqrt(totalCount));
    let bestCols = Math.ceil(totalCount / bestRows);

    if (bestCols > 8) {
      bestCols = 8;
      bestRows = Math.ceil(totalCount / bestCols);
    }

    const capacity = bestRows * bestCols;
    const emptySeats = capacity - totalCount;

    let patternSuggestion = 'Random Shuffle';
    if (Math.abs(maleCount - femaleCount) <= 4) {
      patternSuggestion = 'Gender-Balanced (Boy-Girl Alternating)';
    } else if (maleCount > femaleCount * 2 || femaleCount > maleCount * 2) {
      patternSuggestion = 'Alphabetical Grouping';
    }

    return {
      bestRows,
      bestCols,
      capacity,
      emptySeats,
      patternSuggestion,
      rationale: `Optimal layout for ${totalCount} students: ${bestRows} rows × ${bestCols} columns (${emptySeats} empty seats). Best pattern: ${patternSuggestion}.`,
    };
  }, [totalCount, maleCount, femaleCount]);

  // Roster Import
  const handleImportRoster = () => {
    if (!rawRoster.trim()) return;

    const lines = rawRoster.split('\n').filter((l) => l.trim().length > 0);
    const parsed: Student[] = lines.map((line, idx) => {
      const parts = line.split(',');
      const name = parts[0]?.trim() || line.trim();
      const rawGender = parts[1]?.trim().toLowerCase();
      let gender: 'Male' | 'Female' = 'Male';

      if (rawGender === 'f' || rawGender === 'female' || rawGender === 'babae') {
        gender = 'Female';
      }

      return {
        id: `imported-${idx}-${Date.now()}`,
        name,
        gender,
      };
    });

    setStudents(parsed);
    setRawRoster('');
  };

  // Populate Grid
  const populateGrid = (studentList: Student[], targetRows = rows, targetCols = cols) => {
    const newGrid: (Student | null)[][] = Array.from({ length: targetRows }, () =>
      Array(targetCols).fill(null)
    );

    let index = 0;
    for (let r = 0; r < targetRows; r++) {
      for (let c = 0; c < targetCols; c++) {
        if (index < studentList.length) {
          newGrid[r][c] = studentList[index];
          index++;
        }
      }
    }
    setSeatingGrid(newGrid);
  };

  const handleApplySmartLayout = () => {
    const { bestRows, bestCols, patternSuggestion } = recommendation;
    setRows(bestRows);
    setCols(bestCols);

    if (patternSuggestion.includes('Gender-Balanced')) {
      handleShuffleGender(bestRows, bestCols);
    } else if (patternSuggestion.includes('Alphabetical')) {
      handleSortAlphabetical(bestRows, bestCols);
    } else {
      handleShuffleRandom(bestRows, bestCols);
    }
  };

  const handleShuffleRandom = (r = rows, c = cols) => {
    const shuffled = [...students].sort(() => Math.random() - 0.5);
    populateGrid(shuffled, r, c);
  };

  const handleShuffleGender = (r = rows, c = cols) => {
    const males = students.filter((s) => s.gender === 'Male').sort(() => Math.random() - 0.5);
    const females = students.filter((s) => s.gender === 'Female').sort(() => Math.random() - 0.5);

    const result: Student[] = [];
    const max = Math.max(males.length, females.length);

    for (let i = 0; i < max; i++) {
      if (i < males.length) result.push(males[i]);
      if (i < females.length) result.push(females[i]);
    }

    populateGrid(result, r, c);
  };

  const handleSortAlphabetical = (r = rows, c = cols) => {
    const sorted = [...students].sort((a, b) => a.name.localeCompare(b.name));
    populateGrid(sorted, r, c);
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 font-sans p-6 sm:p-10 space-y-6">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto flex items-center justify-between print:hidden">
        <Link
          href="/teacher"
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-xl transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Adviser Dashboard
        </Link>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-lg transition"
        >
          <Printer className="w-4 h-4" /> Print Classroom Layout
        </button>
      </div>

      {/* Main Generator Box */}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-[#0b0e1e]/90 border border-slate-800/80 rounded-2xl p-6 shadow-2xl print:hidden space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-950/40 border border-red-800/30 text-red-500 rounded-xl">
              <Grid className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Seat Plan Generator</h2>
              <p className="text-xs text-slate-400">Standalone seat layout manager for Grade 11 - BLOODSTONE</p>
            </div>
          </div>

          {/* Smart Recommendation Banner */}
          <div className="p-4 bg-amber-950/20 border border-amber-800/40 rounded-xl flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3 text-xs font-bold text-amber-300">
                <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Smart Recommendation Engine</span>
                <span className="px-2.5 py-0.5 bg-amber-900/60 border border-amber-700/50 text-amber-200 rounded-full text-[10px]">
                  {totalCount} Total Students ({maleCount} Boys, {femaleCount} Girls)
                </span>
              </div>
              <p className="text-xs text-amber-200/70">{recommendation.rationale}</p>
            </div>

            <button
              onClick={handleApplySmartLayout}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-red-600 hover:opacity-90 text-white font-bold text-xs rounded-lg shadow transition"
            >
              <Sparkles className="w-3.5 h-3.5" /> Auto-Apply Smart Arrangement
            </button>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-slate-800">
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Grid className="w-4 h-4 text-red-500" /> Grid Layout (Rows × Columns)
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Rows</span>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={rows}
                    onChange={(e) => setRows(Number(e.target.value))}
                    className="w-full mt-1 p-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-center font-bold text-white outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <span className="text-slate-500 font-bold mt-5">×</span>
                <div className="flex-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Columns</span>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={cols}
                    onChange={(e) => setCols(Number(e.target.value))}
                    className="w-full mt-1 p-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-center font-bold text-white outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Users className="w-4 h-4 text-red-500" /> Quick Roster Import
              </label>
              <div className="flex gap-2">
                <textarea
                  value={rawRoster}
                  onChange={(e) => setRawRoster(e.target.value)}
                  placeholder="Paste roster: Name, Gender (e.g. Santos, Maria, Female)"
                  rows={2}
                  className="flex-1 p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none focus:ring-2 focus:ring-red-500"
                />
                <button
                  onClick={handleImportRoster}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg transition self-end"
                >
                  Import Roster
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => handleShuffleRandom()}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 text-xs font-bold rounded-lg transition"
            >
              <Shuffle className="w-3.5 h-3.5" /> Random Shuffle
            </button>
            <button
              onClick={() => handleShuffleGender()}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 text-xs font-bold rounded-lg transition"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-400" /> Alternate Boy / Girl
            </button>
            <button
              onClick={() => handleSortAlphabetical()}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 text-xs font-bold rounded-lg transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Alphabetical (A-Z)
            </button>
          </div>
        </div>

        {/* Printable Grid Display */}
        <div className="bg-[#0b0e1e]/90 border border-slate-800/80 rounded-2xl p-8 shadow-2xl space-y-6">
          <div className="w-full max-w-md mx-auto py-2.5 bg-slate-900 text-slate-300 text-center font-bold text-xs rounded-lg tracking-widest uppercase border border-slate-800 shadow-inner">
            BLACKBOARD / TEACHER'S DESK
          </div>

          <div
            className="grid gap-3 max-w-5xl mx-auto pt-4"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          >
            {seatingGrid.length > 0
              ? seatingGrid.map((row, rIdx) =>
                  row.map((student, cIdx) => (
                    <div
                      key={`seat-${rIdx}-${cIdx}`}
                      className={`min-h-[80px] p-3 rounded-xl border flex flex-col justify-between transition-all ${
                        student
                          ? student.gender === 'Female'
                            ? 'bg-rose-950/20 border-rose-900/40 text-rose-300'
                            : 'bg-sky-950/20 border-sky-900/40 text-sky-300'
                          : 'bg-slate-900/40 border-dashed border-slate-800 text-slate-600'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px] font-bold opacity-60">
                        <span>R{rIdx + 1}C{cIdx + 1}</span>
                        {student && <span>{student.gender === 'Female' ? '♀' : '♂'}</span>}
                      </div>

                      <div className="text-center py-1">
                        {student ? (
                          <p className="text-xs font-bold line-clamp-2">{student.name}</p>
                        ) : (
                          <p className="text-[10px] italic">Empty Seat</p>
                        )}
                      </div>
                    </div>
                  ))
                )
              : Array.from({ length: rows * cols }).map((_, idx) => (
                  <div
                    key={`empty-${idx}`}
                    className="min-h-[80px] p-3 rounded-xl border border-dashed border-slate-800 bg-slate-900/40 flex items-center justify-center text-[10px] text-slate-500 font-medium text-center"
                  >
                    Empty Seat (Click to Edit)
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}
