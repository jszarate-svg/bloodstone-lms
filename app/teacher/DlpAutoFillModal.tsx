"use client";

import React, { useState, useEffect } from 'react';


  const formatText = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
  };

export default function DlpAutoFillModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [rawText, setRawText] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.innerText && target.innerText.includes('Parse Session 1 with Gemini AI')) {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(true);
      }
    };
    window.addEventListener('click', handleGlobalClick, true);
    return () => window.removeEventListener('click', handleGlobalClick, true);
  }, []);

  if (!mounted || !isOpen) return null;

  const handleParseAndApply = () => {
    if (!rawText.trim()) return;

    // Precision extractor for Gemini's tabular / inline output structure
    const getBlock = (startRegex: RegExp, endRegexes: RegExp[]) => {
      const startMatch = rawText.match(startRegex);
      if (!startMatch) return '';
      
      const startIndex = startMatch.index! + startMatch[0].length;
      let endIndex = rawText.length;

      for (const endReg of endRegexes) {
        const endMatch = rawText.substring(startIndex).match(endReg);
        if (endMatch && endMatch.index !== undefined) {
          endIndex = Math.min(endIndex, startIndex + endMatch.index);
        }
      }

      return rawText.substring(startIndex, endIndex).trim().replace(/\s+/g, ' ');
    };

    const parsedData = {
      lessonName: getBlock(/Name of Lesson/i, [/Date & Time/i, /Designed by/i]),
      learningCompetency: getBlock(/Learning Competency:?/i, [/Learning Objectives:?/i, /Learner Context:?/i]),
      objectiveKnowledge: getBlock(/1\.\s*Kaalaman:?/i, [/2\.\s*Kasanayan:?/i, /3\.\s*Saloobin:?/i, /Learner Context:?/i]),
      objectiveSkills: getBlock(/2\.\s*Kasanayan:?/i, [/3\.\s*Saloobin:?/i, /Learner Context:?/i]),
      objectiveAttitude: getBlock(/3\.\s*Saloobin:?/i, [/Learner Context:?/i, /Learning Experience/i]),
      learnerContext: getBlock(/Learner Context:?/i, [/Learning Experience/i, /Pre-Lesson/i]),
      preLesson: getBlock(/Pre-Lesson Activity[^\n]*:?/i, [/Lesson Flow/i, /1\.\s*Direct Instruction/i]),
      directInstruction: getBlock(/1\.\s*Direct Instruction[^\n]*:?/i, [/2\.\s*Group Activity/i, /3\.\s*Application/i]),
      groupActivity: getBlock(/2\.\s*Group Activity[^\n]*:?/i, [/3\.\s*Application/i, /4\.\s*Concluding/i]),
      applicationSynthesis: getBlock(/3\.\s*Application & Synthesis[^\n]*:?/i, [/4\.\s*Concluding/i, /Learning Resources/i]),
      concludingActivity: getBlock(/4\.\s*Concluding Activity[^\n]*:?/i, [/Learning Resources/i, /Opportunities/i]),
      references: getBlock(/References/i, [/Declaration of AI Use/i, /Intentions/i]),
    };

    window.dispatchEvent(new CustomEvent('apply-dlp-autofill', { detail: parsedData }));
    setRawText('');
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[99999] flex items-center justify-center p-4 print:hidden">
      <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl p-6 max-w-2xl w-full shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            ⚡ Instant Gemini DLP Importer
          </h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold"
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Paste the raw output block from Gemini to auto-fill all DLP fields on the page.
        </p>

        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Paste raw text from Gemini..."
          rows={10}
          className="w-full p-3 border rounded-xl dark:bg-slate-800 dark:text-white dark:border-slate-700 text-sm focus:ring-2 focus:ring-red-500 outline-none"
        />

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleParseAndApply}
            className="px-5 py-2 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition"
          >
            Auto-Fill & Link DLP
          </button>
        </div>
      </div>
    </div>
  );
}
