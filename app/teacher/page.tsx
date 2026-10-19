'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FileSpreadsheet, Sparkles, BookOpen, Users, Activity, LogOut, ArrowLeft,
  Printer, UserPlus, Trash2, Settings, Calendar, Award, BookMarked,
  UserCheck, TrendingUp, AlertTriangle, GraduationCap, Eye, EyeOff,
  Plus, Edit2, Check, X, Sun, Moon, Sunrise, Table, Layers, Filter, BookmarkCheck,
  AlertCircle, RotateCcw, FileText, RefreshCw, Download, Save, Database, Search, Target
} from 'lucide-react';

interface TermElective { name: string; grade: number; }
interface SubjectGrade { term1: number; term2: number; term3: number; }

interface Student {
  id: string; lrn: string; lastName: string; firstName: string; middleName?: string;
  gender: 'MALE' | 'FEMALE'; attendance: Record<string, Record<number, string>>; remarks: string;
  termElectives: { term1: TermElective; term2: TermElective; term3: TermElective; };
  subjectGrades: Record<string, SubjectGrade>;
}

interface ClassSchedule {
  id: string;
  sectionName: string;
  timeSlot: string;
}

interface SessionDLP {
  sessionNum: number;
  title: string;
  pptNotes: string;
  competency: string;
  objKnowledge: string;
  objSkills: string;
  objAttitude: string;
  learnerContext: string;
  preLessonHook: string;
  directInstruction: string;
  groupActivity: string;
  synthesis: string;
  concludingActivity: string;
  resources: string;
  integration: string;
  assessment: string;
  extendedLearning: string;
  reflectionText?: string;
}

interface WeeklyDLPRecord {
  id: string;
  term: string;
  weekNumber: string;
  weekRange: string;
  startDate: string;
  endDate: string;
  subject: string;
  references: string;
  schedules: ClassSchedule[];
  sessions: Record<number, SessionDLP>;
  createdAt: string;
}

interface AralLearner {
  id: string;
  fullName: string;
  section: string;
  gradeLevel: string;
  attendance: Record<string, string>;
}

interface ReadingTargetCategory {
  id: string;
  categoryName: string;
  targets: string[];
}

const ARAL_READING_CATEGORIES: ReadingTargetCategory[] = [
  {
    id: 'cat1',
    categoryName: 'Vocabulary & Context Clues',
    targets: [
      'Using context clues to understand unfamiliar words',
      'Using structural analysis (prefix, suffix, root)',
      'Identifying literal and implied meanings of words',
      'Using general references (print/online)'
    ]
  },
  {
    id: 'cat2',
    categoryName: 'Fluency & Pacing',
    targets: [
      'Self-assessing fluency',
      'Reading aloud with proper pacing and expression',
      'Using non-verbal cues to enhance fluency',
      'Using context to confirm word meaning and self-correct errors during reading.'
    ]
  },
  {
    id: 'cat3',
    categoryName: 'Story Elements & Structure',
    targets: [
      'Noting important story elements (characters, setting, conflict, resolution)',
      'Identifying author\'s/speaker\'s point of view',
      'Sequencing events',
      'Identifying plot type',
      'Summarizing story events'
    ]
  },
  {
    id: 'cat4',
    categoryName: 'Inference & Prediction',
    targets: [
      'Making inferences',
      'Making predictions',
      'Drawing conclusions',
      'Identifying the theme'
    ]
  }
];

const INITIAL_ARAL_LEARNERS: AralLearner[] = [
  { id: 'a1', fullName: 'ALESNA, JUDY ANN', section: 'Gardner', gradeLevel: 'GRADE 10', attendance: { '2026-08-14': 'x', '2026-09-22': 'x', '2026-09-23': 'x', '2026-10-01': 'x' } },
  { id: 'a2', fullName: 'BALOSA, JHON MARK', section: 'Gardner', gradeLevel: 'GRADE 10', attendance: { '2026-08-18': 'x', '2026-09-22': 'x', '2026-09-23': 'x' } },
  { id: 'a3', fullName: 'BARCOMA, JASCENT CLEAR', section: 'Thorndike', gradeLevel: 'GRADE 10', attendance: { '2026-09-16': 'x', '2026-09-23': 'x', '2026-10-01': 'x' } },
  { id: 'a4', fullName: 'BARING, RUSSEL', section: 'Gardner', gradeLevel: 'GRADE 10', attendance: {} },
  { id: 'a5', fullName: 'BAYOG-ANG, JAY MARK', section: 'Thorndike', gradeLevel: 'GRADE 10', attendance: { '2026-09-16': 'x', '2026-09-23': 'x', '2026-10-01': 'x' } }
];

const INITIAL_ARAL_DATES = [
  '2026-08-13', '2026-08-14', '2026-08-18', '2026-09-16', 
  '2026-09-22', '2026-09-23', '2026-10-01', '2026-10-06'
];

const CORE_SUBJECTS = [
  'Mabisang Komunikasyon',
  'Effective Communication',
  'Life and Career Skills',
  'Pag-aaral ng Kasaysayan at Lipunang Pilipino',
  'General Mathematics',
  'General Science'
];

const INITIAL_SUBJECT_GRADES: Record<string, SubjectGrade> = {
  'Mabisang Komunikasyon': { term1: 88, term2: 90, term3: 0 },
  'Effective Communication': { term1: 85, term2: 87, term3: 0 },
  'Life and Career Skills': { term1: 91, term2: 92, term3: 0 },
  'Pag-aaral ng Kasaysayan at Lipunang Pilipino': { term1: 89, term2: 91, term3: 0 },
  'General Mathematics': { term1: 84, term2: 86, term3: 0 },
  'General Science': { term1: 87, term2: 89, term3: 0 }
};

const INITIAL_TERM_ELECTIVES = {
  term1: { name: 'Journalism', grade: 90 },
  term2: { name: 'Robotics', grade: 92 },
  term3: { name: '', grade: 0 }
};

const ENROLLED_STUDENTS: Student[] = [
  { id: '1', lrn: '117792150110', lastName: 'ALEJO', firstName: 'LANCE JAME', middleName: 'TANQUE', gender: 'MALE', attendance: { 'OCTOBER': { 1: 'x', 2: 'x', 8: 'x' } }, remarks: '', termElectives: { ...INITIAL_TERM_ELECTIVES }, subjectGrades: { ...INITIAL_SUBJECT_GRADES } },
  { id: '2', lrn: '117792150018', lastName: 'ALSONADO', firstName: 'JAMEL', middleName: 'CAPARAS', gender: 'MALE', attendance: {}, remarks: '', termElectives: { ...INITIAL_TERM_ELECTIVES }, subjectGrades: { ...INITIAL_SUBJECT_GRADES } },
  { id: '3', lrn: '116904140029', lastName: 'ARGONCILLO', firstName: 'RYAN', middleName: 'VILLAREAL', gender: 'MALE', attendance: { 'OCTOBER': { 9: 'x' } }, remarks: '', termElectives: { ...INITIAL_TERM_ELECTIVES }, subjectGrades: { ...INITIAL_SUBJECT_GRADES } },
  { id: '4', lrn: '117792150023', lastName: 'ARQUISAL', firstName: 'PETER JHON', middleName: 'JUANILLO', gender: 'MALE', attendance: { 'OCTOBER': { 1: 'x', 2: 'x' } }, remarks: '', termElectives: { ...INITIAL_TERM_ELECTIVES }, subjectGrades: { ...INITIAL_SUBJECT_GRADES } },
  { id: '5', lrn: '119248140401', lastName: 'BARBECHO', firstName: 'RALPH EDRIAN', middleName: 'NOYNAY', gender: 'MALE', attendance: {}, remarks: '', termElectives: { ...INITIAL_TERM_ELECTIVES }, subjectGrades: { ...INITIAL_SUBJECT_GRADES } },
  { id: '22', lrn: '181003150031', lastName: 'BAGAYO', firstName: 'PRECIOUS JOY', middleName: 'PILAPIL', gender: 'FEMALE', attendance: {}, remarks: '', termElectives: { ...INITIAL_TERM_ELECTIVES }, subjectGrades: { ...INITIAL_SUBJECT_GRADES } },
  { id: '23', lrn: '117792140155', lastName: 'BARBECHO', firstName: 'JUSTINE MEAH', middleName: 'MASAYON', gender: 'FEMALE', attendance: {}, remarks: '', termElectives: { ...INITIAL_TERM_ELECTIVES }, subjectGrades: { ...INITIAL_SUBJECT_GRADES } }
];

const createEmptySession = (sNum: number): SessionDLP => ({
  sessionNum: sNum, title: '', pptNotes: '', competency: '', objKnowledge: '', objSkills: '',
  objAttitude: '', learnerContext: '', preLessonHook: '', directInstruction: '', groupActivity: '',
  synthesis: '', concludingActivity: '', resources: '', integration: '', assessment: '', extendedLearning: '', reflectionText: ''
});

export default function TeacherDashboard() {
  const router = useRouter();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'sf2' | 'ilaw' | 'weelmat' | 'sis' | 'aral'>('dashboard');
  const [students, setStudents] = useState<Student[]>(ENROLLED_STUDENTS);

  const [aralLearners, setAralLearners] = useState<AralLearner[]>(INITIAL_ARAL_LEARNERS);

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} flex flex-col font-sans antialiased`}>
      <header className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border-b px-6 py-4 flex items-center justify-between`}>
        <div className="flex items-center space-x-3">
          <span className="text-xl font-black tracking-tight flex items-center gap-1.5">
            BLOODSTONE <span className="text-red-500">LMS</span>
          </span>
          <span className="bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
            Teacher Portal
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className="text-xs font-bold px-3 py-1.5 border rounded-xl">
            Toggle Theme
          </button>
        </div>
      </header>

      {/* TABS HEADER */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-2 flex items-center gap-2 overflow-x-auto">
        <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 rounded-lg text-xs font-bold transition ${activeTab === 'dashboard' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}>
          Dashboard
        </button>
        <button onClick={() => setActiveTab('sf2')} className={`px-4 py-2 rounded-lg text-xs font-bold transition ${activeTab === 'sf2' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}>
          DepEd SF2 Report
        </button>
        <button onClick={() => setActiveTab('ilaw')} className={`px-4 py-2 rounded-lg text-xs font-bold transition ${activeTab === 'ilaw' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}>
          ILAW DLP Generator
        </button>
        <button onClick={() => setActiveTab('aral')} className={`px-4 py-2 rounded-lg text-xs font-bold transition ${activeTab === 'aral' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}>
          ARAL Program MS
        </button>
      </div>

      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-2xl font-black mb-2">Teacher Dashboard</h2>
            <p className="text-xs text-slate-400 mb-6">Class Management Suite • Grade 11 Bloodstone</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div onClick={() => setActiveTab('sf2')} className="p-5 rounded-2xl border bg-slate-900 border-slate-800 cursor-pointer hover:border-red-500/50 transition">
                <h3 className="font-bold text-base mb-1">SF2 Generator</h3>
                <p className="text-xs text-slate-400">DepEd School Form 2 Attendance Tracker</p>
              </div>
              <div onClick={() => setActiveTab('ilaw')} className="p-5 rounded-2xl border bg-slate-900 border-slate-800 cursor-pointer hover:border-red-500/50 transition">
                <h3 className="font-bold text-base mb-1">ILAW DLP Generator</h3>
                <p className="text-xs text-slate-400">DepEd Order No. 016, s. 2026 Daily Lesson Log</p>
              </div>
              <div onClick={() => setActiveTab('aral')} className="p-5 rounded-2xl border bg-slate-900 border-slate-800 cursor-pointer hover:border-red-500/50 transition">
                <h3 className="font-bold text-base mb-1">ARAL Program MS</h3>
                <p className="text-xs text-slate-400">Weekly IRIP Reading & Attendance Monitoring</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sf2' && (
  <div>
    {/* SF2 OFFICIAL FOOTER SECTION */}
            <div className="mt-4 pt-2 border-t-2 border-black grid grid-cols-12 gap-2 text-[9px] leading-tight font-sans text-black">
              
              {/* Left: Guidelines & Formulas */}
              <div className="col-span-5 pr-2 border-r border-slate-400">
                <p className="font-bold underline mb-1">GUIDELINES:</p>
                <ol className="list-decimal pl-3 space-y-0.5 text-[8px]">
                  <li>The attendance shall be accomplished daily. Refer to codes: <b>blank</b> - Present, <b>x</b> - Absent, <b>/</b> - Tardy.</li>
                  <li>Dates shall be written in the preceding columns beside Learner's Name.</li>
                  <li>
                    <b>Formulas:</b>
                    <br />a. <i>% Enrolment</i> = (End of Month Enrolment / 1st Friday Enrolment) × 100
                    <br />b. <i>Average Daily Attendance</i> = Total Daily Attendance / No. of Days of Classes
                    <br />c. <i>% Attendance for Month</i> = (Average Daily Attendance / End of Month Enrolment) × 100
                  </li>
                  <li>Adviser will extend necessary intervention including home visitation for learners with 5 consecutive days of absences.</li>
                </ol>
              </div>

              {/* Middle: Reasons/Causes for NLS */}
              <div className="col-span-3 px-1 border-r border-slate-400 text-[8px]">
                <p className="font-bold underline mb-1">REASONS/CAUSES FOR NLS:</p>
                <p className="font-semibold">a. Domestic-Related Factors</p>
                <p className="pl-2">a.1 Had to take care of siblings / early marriage / family problems</p>
                <p className="font-semibold mt-0.5">b. Individual-Related Factors</p>
                <p className="pl-2">b.1 Illness / Overage / Drug Abuse / Poor academic performance</p>
                <p className="font-semibold mt-0.5">c. Geographic & Financial Factors</p>
                <p className="pl-2">c.1 Distance home to school / Calamities / Child labor</p>
              </div>

              {/* Right: Summary for Month Table & Signatures */}
              <div className="col-span-4 pl-1">
                <table className="w-full border-collapse border border-black text-[8px] text-center mb-2">
                  <thead>
                    <tr className="bg-slate-100 font-bold border-b border-black">
                      <th className="border border-black px-1 text-left">Summary for the Month</th>
                      <th className="border border-black px-1 w-6">M</th>
                      <th className="border border-black px-1 w-6">F</th>
                      <th className="border border-black px-1 w-8">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-black px-1 text-left font-medium">Registered Learners (End of Month)</td>
                      <td className="border border-black">21</td>
                      <td className="border border-black">13</td>
                      <td className="border border-black font-bold">34</td>
                    </tr>
                    <tr>
                      <td className="border border-black px-1 text-left">Average Daily Attendance</td>
                      <td className="border border-black">17.6</td>
                      <td className="border border-black">12.8</td>
                      <td className="border border-black font-bold">30.4</td>
                    </tr>
                    <tr>
                      <td className="border border-black px-1 text-left">% Attendance for the Month</td>
                      <td className="border border-black">84.0%</td>
                      <td className="border border-black">98.1%</td>
                      <td className="border border-black font-bold">89.4%</td>
                    </tr>
                    <tr className="bg-red-50 text-red-900 font-semibold">
                      <td className="border border-black px-1 text-left">5 Consecutive Days Absences</td>
                      <td className="border border-black">1</td>
                      <td className="border border-black">0</td>
                      <td className="border border-black font-bold">1</td>
                    </tr>
                    <tr>
                      <td className="border border-black px-1 text-left">Transferred Out / In</td>
                      <td className="border border-black">0 / 0</td>
                      <td className="border border-black">0 / 1</td>
                      <td className="border border-black font-bold">0 / 1</td>
                    </tr>
                  </tbody>
                </table>

                {/* Certification & Signatures */}
                <div className="mt-3 text-[8px] space-y-3">
                  <div>
                    <p className="italic mb-2">I certify that this is a true and correct report.</p>
                    <p className="font-bold underline text-[9px] uppercase">JUDIMER JOHN S. ZARATE</p>
                    <p className="text-[7px] text-slate-600">(Signature of Adviser over Printed Name)</p>
                  </div>

                  <div>
                    <p className="italic mb-1">Attested by:</p>
                    <p className="font-bold underline text-[9px] uppercase">HOMEYLIN U. BIRONDO</p>
                    <p className="text-[7px] text-slate-600">(Signature of School Head over Printed Name)</p>
                  </div>
                </div>
              </div>

            </div>
          <div className="bg-white text-black p-8 rounded-xl shadow-2xl max-w-5xl mx-auto font-sans">
            {/* Header */}
            <div className="text-center border-b-2 border-black pb-2 mb-4">
              <h1 className="font-bold text-lg uppercase tracking-wide">SCHOOL FORM 2 (SF2) DAILY ATTENDANCE REPORT OF LEARNERS</h1>
              <p className="text-[10px] text-slate-600">(This replaces Form 1, Form 2 & STS Form 4 - Absenteeism and Dropout Profile)</p>
              <div className="flex justify-between items-center text-xs mt-3 font-semibold">
                <div>School ID: <span className="font-bold underline">302773</span></div>
                <div>School Year: <span className="font-bold underline">2026-2027</span></div>
                <div>Report for the Month of: <span className="font-bold underline">OCTOBER</span></div>
                <div>Grade Level: <span className="font-bold underline">11</span></div>
                <div>Section: <span className="font-bold underline">BLOODSTONE</span></div>
              </div>
            </div>

            {/* Attendance Table */}
            <table className="w-full border-collapse border border-black text-[9px] text-center mb-4">
              <thead>
                <tr className="bg-slate-100 font-bold border-b border-black">
                  <th className="border border-black p-1 w-6">#</th>
                  <th className="border border-black p-1 text-left">LEARNER'S NAME</th>
                  <th className="border border-black p-1 w-8">1</th>
                  <th className="border border-black p-1 w-8">2</th>
                  <th className="border border-black p-1 w-8">3</th>
                  <th className="border border-black p-1 w-8">4</th>
                  <th className="border border-black p-1 w-8">5</th>
                  <th className="border border-black p-1 w-12 bg-slate-200">ABSENT</th>
                  <th className="border border-black p-1 w-12 bg-slate-200">PRESENT</th>
                </tr>
              </thead>
              <tbody>
                {students.map((st, i) => (
                  <tr key={st.id} className="border-b border-black">
                    <td className="border border-black p-1 font-mono">{i + 1}</td>
                    <td className="border border-black p-1 text-left font-bold">{st.lastName}, {st.firstName}</td>
                    <td className="border border-black p-1 text-red-600 font-bold">{st.attendance?.['OCTOBER']?.[1] || ''}</td>
                    <td className="border border-black p-1 text-red-600 font-bold">{st.attendance?.['OCTOBER']?.[2] || ''}</td>
                    <td className="border border-black p-1"></td>
                    <td className="border border-black p-1"></td>
                    <td className="border border-black p-1"></td>
                    <td className="border border-black p-1 bg-slate-50 font-bold text-red-600">
                      {Object.keys(st.attendance?.['OCTOBER'] || {}).length}
                    </td>
                    <td className="border border-black p-1 bg-slate-50 font-bold text-green-700">
                      {20 - Object.keys(st.attendance?.['OCTOBER'] || {}).length}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* SF2 OFFICIAL FOOTER SECTION */}
            <div className="mt-4 pt-2 border-t-2 border-black grid grid-cols-12 gap-2 text-[9px] leading-tight font-sans">
              
              {/* Left: Guidelines & Formulas */}
              <div className="col-span-5 pr-2 border-r border-slate-400">
                <p className="font-bold underline mb-1">GUIDELINES:</p>
                <ol className="list-decimal pl-3 space-y-0.5 text-[8px]">
                  <li>The attendance shall be accomplished daily. Refer to codes: <b>blank</b> - Present, <b>x</b> - Absent, <b>/</b> - Tardy.</li>
                  <li>Dates shall be written in the preceding columns beside Learner's Name.</li>
                  <li>
                    <b>Formulas:</b>
                    <br />a. <i>% Enrolment</i> = (End of Month Enrolment / 1st Friday Enrolment) × 100
                    <br />b. <i>Average Daily Attendance</i> = Total Daily Attendance / No. of Days of Classes
                    <br />c. <i>% Attendance for Month</i> = (Average Daily Attendance / End of Month Enrolment) × 100
                  </li>
                  <li>Adviser will extend necessary intervention including home visitation for learners with 5 consecutive days of absences.</li>
                </ol>
              </div>

              {/* Middle: Reasons/Causes for NLS */}
              <div className="col-span-3 px-1 border-r border-slate-400 text-[8px]">
                <p className="font-bold underline mb-1">REASONS/CAUSES FOR NLS:</p>
                <p className="font-semibold">a. Domestic-Related Factors</p>
                <p className="pl-2">a.1 Had to take care of siblings / early marriage / family problems</p>
                <p className="font-semibold mt-0.5">b. Individual-Related Factors</p>
                <p className="pl-2">b.1 Illness / Overage / Drug Abuse / Poor academic performance</p>
                <p className="font-semibold mt-0.5">c. Geographic & Financial Factors</p>
                <p className="pl-2">c.1 Distance home to school / Calamities / Child labor</p>
              </div>

              {/* Right: Summary for Month Table & Signatures */}
              <div className="col-span-4 pl-1">
                <table className="w-full border-collapse border border-black text-[8px] text-center mb-2">
                  <thead>
                    <tr className="bg-slate-100 font-bold border-b border-black">
                      <th className="border border-black px-1 text-left">Summary for the Month</th>
                      <th className="border border-black px-1 w-6">M</th>
                      <th className="border border-black px-1 w-6">F</th>
                      <th className="border border-black px-1 w-8">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-black px-1 text-left font-medium">Registered Learners (End of Month)</td>
                      <td className="border border-black">21</td>
                      <td className="border border-black">13</td>
                      <td className="border border-black font-bold">34</td>
                    </tr>
                    <tr>
                      <td className="border border-black px-1 text-left">Average Daily Attendance</td>
                      <td className="border border-black">17.6</td>
                      <td className="border border-black">12.8</td>
                      <td className="border border-black font-bold">30.4</td>
                    </tr>
                    <tr>
                      <td className="border border-black px-1 text-left">% Attendance for the Month</td>
                      <td className="border border-black">84.0%</td>
                      <td className="border border-black">98.1%</td>
                      <td className="border border-black font-bold">89.4%</td>
                    </tr>
                    <tr className="bg-red-50 text-red-900 font-semibold">
                      <td className="border border-black px-1 text-left">5 Consecutive Days Absences</td>
                      <td className="border border-black">1</td>
                      <td className="border border-black">0</td>
                      <td className="border border-black font-bold">1</td>
                    </tr>
                    <tr>
                      <td className="border border-black px-1 text-left">Transferred Out / In</td>
                      <td className="border border-black">0 / 0</td>
                      <td className="border border-black">0 / 1</td>
                      <td className="border border-black font-bold">0 / 1</td>
                    </tr>
                  </tbody>
                </table>

                {/* Certification & Signatures */}
                <div className="mt-3 text-[8px] space-y-3">
                  <div>
                    <p className="italic mb-2">I certify that this is a true and correct report.</p>
                    <p className="font-bold underline text-[9px] uppercase">JUDIMER JOHN S. ZARATE</p>
                    <p className="text-[7px] text-slate-600">(Signature of Adviser over Printed Name)</p>
                  </div>

                  <div>
                    <p className="italic mb-1">Attested by:</p>
                    <p className="font-bold underline text-[9px] uppercase">HOMEYLIN U. BIRONDO</p>
                    <p className="text-[7px] text-slate-600">(Signature of School Head over Printed Name)</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {activeTab === 'ilaw' && (
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-xl font-bold mb-2">ILAW DLP Generator</h3>
            <p className="text-xs text-slate-400 mb-4">DepEd Order No. 016, s. 2026 Compliant Daily Lesson Plan</p>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
              [ILAW Module Active - Form Ready for Session Entries]
            </div>
          </div>
        )}

        {activeTab === 'aral' && (
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-xl font-bold mb-2">ARAL Program Monitoring</h3>
            <p className="text-xs text-slate-400 mb-4">Academic Recovery and Accessible Learning (Reading & Intervention)</p>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
              [ARAL Module Active - Learner Attendance & IRIP Progress Tracker Ready]
            </div>
          </div>
        )}
      </main>
    </div>
  );
}