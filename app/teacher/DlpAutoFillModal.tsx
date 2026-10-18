"use client";

import React, { useState, useEffect } from 'react';

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

    // Helper to search text blocks by multi-keyword criteria
    const extractSection = (keywords: string[]): string => {
      const lines = rawText.split('\n');
      let captured: string[] = [];
      let recording = false;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const lower = line.toLowerCase();

        // Check if current line acts as a header for requested section
        const isTargetHeader = keywords.some(kw => lower.includes(kw.toLowerCase()));
        
        if (isTargetHeader) {
          recording = true;
          // Capture content on same line after colon if present
          if (line.includes(':')) {
            const afterColon = line.split(':').slice(1).join(':').trim();
            if (afterColon) captured.push(afterColon);
          }
          continue;
        }

        // Stop recording when encountering another major header line
        if (recording) {
          if (
            /^(?:[I|V|X]+\.|[A-Z]\.|[\#]{1,4}|\*\*[^*]+\*\*:?)/i.test(line) &&
            !keywords.some(kw => lower.includes(kw.toLowerCase()))
          ) {
            // Check if this new header belongs to another section
            if (line.includes(':') || line.startsWith('#') || line.startsWith('**')) {
              break;
            }
          }
          if (line) captured.push(line);
        }
      }

      return captured.join('\n').replace(/\*+/g, '').trim();
    };

    // Smart semantic extraction across English & Tagalog terms
    const parsedData = {
      learningCompetency: extractSection(['competency', 'kasanayan', 'pamantayan']),
      objectiveKnowledge: extractSection(['knowledge', 'kaalaman', 'layunin', 'objectives']),
      objectiveSkills: extractSection(['skills', 'kasanayan', 'kakayahan']),
      objectiveAttitude: extractSection(['attitude', 'saloobin', 'papahalaga']),
      learnerContext: extractSection(['context', 'kondisyon', 'background', 'revising']),
      preLesson: extractSection(['pre-lesson', 'pagganyak', 'panimula', 'introduction', 'warm-up']),
      directInstruction: extractSection(['direct instruction', 'pagtalakay', 'pagtalakay ng paksa', 'lesson proper', 'presentation', 'activity 1']),
      groupActivity: extractSection(['group activity', 'pangkatang gawain', 'gawain', 'activity 2']),
      applicationSynthesis: extractSection(['application', 'pagsasanay', 'synthesis', 'paglalapat', 'abstraction']),
      concludingActivity: extractSection(['concluding', 'pangwakas', 'evaluation', 'pagtataya', 'assessment']),
      references: extractSection(['references', 'sanggunian', 'mga sanggunian', 'textbook']),
    };

    // Smart Fallback: If nothing matched specific sections, put everything into Direct Instruction
    const hasAnyParsedData = Object.values(parsedData).some(val => val.length > 0);
    if (!hasAnyParsedData) {
      parsedData.directInstruction = rawText.replace(/\*+/g, '').trim();
    }

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
          Paste any raw response block from Gemini. Content will be automatically recognized and assigned to the matching form fields.
        </p>

        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Paste text from Gemini here..."
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
