"use client";

import DlpAutoFillModal from './DlpAutoFillModal';
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FileSpreadsheet, Sparkles, BookOpen, Users, Activity, LogOut, ArrowLeft,
  Printer, UserPlus, Trash2, Settings, Calendar, Award, BookMarked,
  UserCheck, TrendingUp, AlertTriangle, GraduationCap, Eye, EyeOff,
  Plus, Edit2, Check, X, Sun, Moon, Sunrise, Table, Layers, Filter, BookmarkCheck,
  AlertCircle, RotateCcw, FileText, Send, RefreshCw, Copy, Download, Save, Database, Search, Target
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

// ARAL Program Interfaces
interface AralLearner {
  id: string;
  fullName: string;
  section: string;
  gradeLevel: string;
  attendance: Record<string, string>; // dateStr -> 'present' | 'x' | 'h'
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
      'Using context to confirm word meaning and self-correct errors during reading, including rereading when necessary.'
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
  },
  {
    id: 'cat5',
    categoryName: 'Main Idea & Outlining',
    targets: [
      'Noting important information through outlining (topic, main idea, supporting details)',
      'Identifying author\'s purpose',
      'Identifying text types',
      'Making generalizations'
    ]
  },
  {
    id: 'cat6',
    categoryName: 'Literary Devices & Analysis',
    targets: [
      'Analyzing figures of speech to clarify meaning',
      'Analyzing sound devices',
      'Differentiating fantasy from reality'
    ]
  },
  {
    id: 'cat7',
    categoryName: 'Critical Thinking & Evaluation',
    targets: [
      'Distinguishing fact from opinion',
      'Identifying propaganda techniques',
      'Making summaries',
      'Noting information through outlining (topic, main idea, details)'
    ]
  },
  {
    id: 'cat8',
    categoryName: 'Visual & Multimedia Literacy',
    targets: [
      'Identifying visual/multimedia elements',
      'Deriving meaning based on the visual/multimedia elements',
      'Identifying real or make-believe, fact or non-fact images',
      'Evaluating cultural appropriateness of visual/multimedia elements',
      'Creating a visual/multimedia text drawn from visual elements learned'
    ]
  }
];

const INITIAL_ARAL_LEARNERS: AralLearner[] = [
  { id: 'a1', fullName: 'ALESNA, JUDY ANN', section: 'Gardner', gradeLevel: 'GRADE 10', attendance: { '2026-08-14': 'x', '2026-09-22': 'x', '2026-09-23': 'x', '2026-10-01': 'x' } },
  { id: 'a2', fullName: 'BALOSA, JHON MARK', section: 'Gardner', gradeLevel: 'GRADE 10', attendance: { '2026-08-18': 'x', '2026-09-22': 'x', '2026-09-23': 'x' } },
  { id: 'a3', fullName: 'BARCOMA, JASCENT CLEAR', section: 'Thorndike', gradeLevel: 'GRADE 10', attendance: { '2026-09-16': 'x', '2026-09-23': 'x', '2026-10-01': 'x' } },
  { id: 'a4', fullName: 'BARING, RUSSEL', section: 'Gardner', gradeLevel: 'GRADE 10', attendance: {} },
  { id: 'a5', fullName: 'BAYOG-ANG, JAY MARK', section: 'Thorndike', gradeLevel: 'GRADE 10', attendance: { '2026-09-16': 'x', '2026-09-23': 'x', '2026-10-01': 'x' } },
  { id: 'a6', fullName: 'CANONOY, ROGELIO', section: 'Thorndike', gradeLevel: 'GRADE 10', attendance: { '2026-09-23': 'x', '2026-10-01': 'x' } },
  { id: 'a7', fullName: 'DEL ROSARIO, VIRGILLIO', section: 'Thorndike', gradeLevel: 'GRADE 10', attendance: { '2026-08-18': 'x', '2026-09-16': 'x', '2026-09-23': 'x', '2026-10-01': 'x' } },
  { id: 'a8', fullName: 'DOLOR, COBBY BRYAN', section: 'Gardner', gradeLevel: 'GRADE 10', attendance: { '2026-08-14': 'x', '2026-08-18': 'x', '2026-09-22': 'x', '2026-09-23': 'x' } },
  { id: 'a9', fullName: 'DOMINGGO, PAOLO', section: 'Gardner', gradeLevel: 'GRADE 10', attendance: { '2026-08-14': 'x', '2026-09-16': 'x', '2026-09-22': 'x', '2026-09-23': 'x', '2026-10-01': 'x' } },
  { id: 'a10', fullName: 'GONZAGA, JOSH LYCER', section: 'Gardner', gradeLevel: 'GRADE 10', attendance: { '2026-08-13': 'x', '2026-08-14': 'x', '2026-09-16': 'x' } },
  { id: 'a11', fullName: 'LEMORAN, JHOVY MAR', section: 'Thorndike', gradeLevel: 'GRADE 10', attendance: { '2026-09-16': 'x', '2026-09-22': 'x', '2026-09-23': 'x', '2026-10-01': 'x' } },
  { id: 'a12', fullName: 'LEMORAN, JOCELLE MARL', section: 'Gardner', gradeLevel: 'GRADE 10', attendance: { '2026-08-14': 'x', '2026-09-22': 'x', '2026-09-23': 'x', '2026-10-01': 'x' } },
  { id: 'a13', fullName: 'MAGBANUA, PRINCESS MABEY', section: 'Gardner', gradeLevel: 'GRADE 10', attendance: { '2026-08-18': 'x', '2026-09-23': 'x', '2026-10-01': 'x' } },
  { id: 'a14', fullName: 'ORDONIO, RICHMER', section: 'Thorndike', gradeLevel: 'GRADE 10', attendance: { '2026-09-16': 'x', '2026-09-23': 'x', '2026-10-01': 'x' } },
  { id: 'a15', fullName: 'RUBIO, JHON ANDREW', section: 'Gardner', gradeLevel: 'GRADE 10', attendance: { '2026-08-18': 'x' } },
  { id: 'a16', fullName: 'VELASCO, KIM ASHLEY', section: 'Gardner', gradeLevel: 'GRADE 10', attendance: { '2026-08-14': 'x', '2026-09-16': 'x', '2026-09-22': 'x', '2026-09-23': 'x' } },
  { id: 'a17', fullName: 'ALDE, QUEENCIEVELLE', section: 'Gardner', gradeLevel: 'GRADE 10', attendance: { '2026-08-14': 'x' } },
  { id: 'a18', fullName: 'VILLAHERMOSA, JOMAR', section: 'Thorndike', gradeLevel: 'GRADE 10', attendance: {} }
];

const INITIAL_ARAL_DATES = [
  '2026-08-13', '2026-08-14', '2026-08-18', '2026-09-16', 
  '2026-09-22', '2026-09-23', '2026-10-01', '2026-10-06'
];

const SUGGESTED_ARAL_REMARKS = [
  'Learner demonstrated enthusiastic participation and steady progress in word decoding.',
  'Excellent performance! Ready to proceed to the next higher reading target.',
  'Needs additional practice in identifying implied meanings and story themes.',
  'Showed significant improvement in reading fluency and oral expression.',
  'Requires guided repetition on distinguishing fact from opinion during text analysis.',
  'Active listener; recommended for continued progress monitoring in Week 2.'
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
  'Mabisang Komunikasyon': { term1: 0, term2: 0, term3: 0 },
  'Effective Communication': { term1: 0, term2: 0, term3: 0 },
  'Life and Career Skills': { term1: 0, term2: 0, term3: 0 },
  'Pag-aaral ng Kasaysayan at Lipunang Pilipino': { term1: 0, term2: 0, term3: 0 },
  'General Mathematics': { term1: 0, term2: 0, term3: 0 },
  'General Science': { term1: 0, term2: 0, term3: 0 },
};

const INITIAL_TERM_ELECTIVES = {
  term1: { name: '', grade: 0 },
  term2: { name: '', grade: 0 },
  term3: { name: '', grade: 0 }
};

const MONTH_OPTIONS = [
  'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER', 
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY'
];

const generateFullMonthCalendar = (monthName: string, includeWeekends: boolean = true) => {
  const monthMap: Record<string, number> = {
    'JANUARY': 0, 'FEBRUARY': 1, 'MARCH': 2, 'APRIL': 3, 'MAY': 4, 'JUNE': 5,
    'JULY': 6, 'AUGUST': 7, 'SEPTEMBER': 8, 'OCTOBER': 9, 'NOVEMBER': 10, 'DECEMBER': 11
  };
  
  const monthIdx = monthMap[monthName] ?? 8;
  const year = (monthIdx >= 5) ? 2026 : 2027;
  
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
  const days: number[] = [];
  const dayOfWeek: string[] = [];
  const isWeekend: boolean[] = [];
  const dayLabels = ['SUN', 'M', 'T', 'W', 'TH', 'F', 'SAT'];

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, monthIdx, d);
    const day = date.getDay();
    const weekend = (day === 0 || day === 6);
    
    if (includeWeekends || !weekend) {
      days.push(d);
      dayOfWeek.push(dayLabels[day]);
      isWeekend.push(weekend);
    }
  }

  return { days, dayOfWeek, isWeekend };
};

const ENROLLED_STUDENTS: Student[] = [
  { id: '1', lrn: '117792150110', lastName: 'ALEJO', firstName: 'LANCE JAME', middleName: 'TANQUE', gender: 'MALE', attendance: { 'OCTOBER': { 1: 'x', 2: 'x', 8: 'x' } }, remarks: '', termElectives: { ...INITIAL_TERM_ELECTIVES }, subjectGrades: { ...INITIAL_SUBJECT_GRADES } },
  { id: '2', lrn: '117792150018', lastName: 'ALSONADO', firstName: 'JAMEL', middleName: 'CAPARAS', gender: 'MALE', attendance: {}, remarks: '', termElectives: { ...INITIAL_TERM_ELECTIVES }, subjectGrades: { ...INITIAL_SUBJECT_GRADES } },
  { id: '3', lrn: '116904140029', lastName: 'ARGONCILLO', firstName: 'RYAN', middleName: 'VILLAREAL', gender: 'MALE', attendance: { 'OCTOBER': { 9: 'x' } }, remarks: '', termElectives: { ...INITIAL_TERM_ELECTIVES }, subjectGrades: { ...INITIAL_SUBJECT_GRADES } },
  { id: '4', lrn: '117792150023', lastName: 'ARQUISAL', firstName: 'PETER JHON', middleName: 'JUANILLO', gender: 'MALE', attendance: { 'OCTOBER': { 1: 'x', 2: 'x' } }, remarks: '', termElectives: { ...INITIAL_TERM_ELECTIVES }, subjectGrades: { ...INITIAL_SUBJECT_GRADES } },
  { id: '5', lrn: '119248140401', lastName: 'BARBECHO', firstName: 'RALPH EDRIAN', middleName: 'NOYNAY', gender: 'MALE', attendance: {}, remarks: '', termElectives: { ...INITIAL_TERM_ELECTIVES }, subjectGrades: { ...INITIAL_SUBJECT_GRADES } },
  { id: '6', lrn: '117792150032', lastName: 'CABABA', firstName: 'RENIEL', middleName: 'PAZ', gender: 'MALE', attendance: { 'OCTOBER': { 15: 'x' } }, remarks: '', termElectives: { ...INITIAL_TERM_ELECTIVES }, subjectGrades: { ...INITIAL_SUBJECT_GRADES } },
  { id: '7', lrn: '117792150045', lastName: 'DINGLASAN', firstName: 'WENDEL', middleName: 'REFUELA', gender: 'MALE', attendance: {}, remarks: '', termElectives: { ...INITIAL_TERM_ELECTIVES }, subjectGrades: { ...INITIAL_SUBJECT_GRADES } },
  { id: '8', lrn: '117792140174', lastName: 'ENGGANA', firstName: 'JOSHUA', middleName: 'GABIA', gender: 'MALE', attendance: { 'OCTOBER': { 1: 'x', 2: 'x', 8: 'h' } }, remarks: '', termElectives: { ...INITIAL_TERM_ELECTIVES }, subjectGrades: { ...INITIAL_SUBJECT_GRADES } },
  { id: '9', lrn: '119874140200', lastName: 'GALLARDO', firstName: 'JHAMES REED', middleName: 'DAYONOS', gender: 'MALE', attendance: { 'OCTOBER': { 1: 'x', 2: 'x', 3: 'x' } }, remarks: '', termElectives: { ...INITIAL_TERM_ELECTIVES }, subjectGrades: { ...INITIAL_SUBJECT_GRADES } },
  { id: '10', lrn: '117792150056', lastName: 'GARAO', firstName: 'JOSHUA', middleName: 'VILLAREAL', gender: 'MALE', attendance: {}, remarks: '', termElectives: { ...INITIAL_TERM_ELECTIVES }, subjectGrades: { ...INITIAL_SUBJECT_GRADES } },
  { id: '11', lrn: '117792150066', lastName: 'JAVOC', firstName: 'PRINCE MHERVIN', middleName: 'ALINTON', gender: 'MALE', attendance: {}, remarks: '', termElectives: { ...INITIAL_TERM_ELECTIVES }, subjectGrades: { ...INITIAL_SUBJECT_GRADES } },
  { id: '12', lrn: '117792140181', lastName: 'JAVOC', firstName: 'WELMAR', middleName: 'ABELLO', gender: 'MALE', attendance: {}, remarks: '', termElectives: { ...INITIAL_TERM_ELECTIVES }, subjectGrades: { ...INITIAL_SUBJECT_GRADES } },
  { id: '13', lrn: '117792130023', lastName: 'LASCONIA', firstName: 'JOSHUA', middleName: 'SAMANERO', gender: 'MALE', attendance: {}, remarks: '', termElectives: { ...INITIAL_TERM_ELECTIVES }, subjectGrades: { ...INITIAL_SUBJECT_GRADES } },
  { id: '14', lrn: '117795150010', lastName: 'LUMANGYAO', firstName: 'JERALD', middleName: 'LABRADOR', gender: 'MALE', attendance: {}, remarks: '', termElectives: { ...INITIAL_TERM_ELECTIVES }, subjectGrades: { ...INITIAL_SUBJECT_GRADES } },
  { id: '15', lrn: '117792150081', lastName: 'PACALDO', firstName: 'JHON MARK', middleName: 'PARAN', gender: 'MALE', attendance: {}, remarks: '', termElectives: { ...INITIAL_TERM_ELECTIVES }, subjectGrades: { ...INITIAL_SUBJECT_GRADES } },
  { id: '16', lrn: '117792150082', lastName: 'PACALDO', firstName: 'MARK CHESTER', middleName: 'ALBIAR', gender: 'MALE', attendance: {}, remarks: '', termElectives: { ...INITIAL_TERM_ELECTIVES }, subjectGrades: { ...INITIAL_SUBJECT_GRADES } },
  { id: '17', lrn: '117792140200', lastName: 'PILAPIL', firstName: 'JETHRO', middleName: 'ESCOSAR', gender: 'MALE', attendance: {}, remarks: '', termElectives: { ...INITIAL_TERM_ELECTIVES }, subjectGrades: { ...INITIAL_SUBJECT_GRADES } },
  { id: '18', lrn: '117792150088', lastName: 'QUIAPO', firstName: 'KLEIN JHON', middleName: 'OLBEDENCIA', gender: 'MALE', attendance: {}, remarks: '', termElectives: { ...INITIAL_TERM_ELECTIVES }, subjectGrades: { ...INITIAL_SUBJECT_GRADES } },
  { id: '19', lrn: '117792150092', lastName: 'RAMA', firstName: 'THERENCE', middleName: 'ABENDAN', gender: 'MALE', attendance: {}, remarks: '', termElectives: { ...INITIAL_TERM_ELECTIVES }, subjectGrades: { ...INITIAL_SUBJECT_GRADES } },
  { id: '20', lrn: '117797150019', lastName: 'SEDANTES', firstName: 'JOHN MICHAEL', middleName: 'REFUELA', gender: 'MALE', attendance: {}, remarks: '', termElectives: { ...INITIAL_TERM_ELECTIVES }, subjectGrades: { ...INITIAL_SUBJECT_GRADES } },
  { id: '21', lrn: '117797150020', lastName: 'SOLANO', firstName: 'JEFFERSON', middleName: 'LAYAN', gender: 'MALE', attendance: {}, remarks: '', termElectives: { ...INITIAL_TERM_ELECTIVES }, subjectGrades: { ...INITIAL_SUBJECT_GRADES } },

  // FEMALES
  { id: '22', lrn: '181003150031', lastName: 'BAGAYO', firstName: 'PRECIOUS JOY', middleName: 'PILAPIL', gender: 'FEMALE', attendance: {}, remarks: '', termElectives: { ...INITIAL_TERM_ELECTIVES }, subjectGrades: { ...INITIAL_SUBJECT_GRADES } },
  { id: '23', lrn: '117792140155', lastName: 'BARBECHO', firstName: 'JUSTINE MEAH', middleName: 'MASAYON', gender: 'FEMALE', attendance: {}, remarks: '', termElectives: { ...INITIAL_TERM_ELECTIVES }, subjectGrades: { ...INITIAL_SUBJECT_GRADES } },
  { id: '24', lrn: '117792150029', lastName: 'BARCOMA', firstName: 'RICA', middleName: 'C', gender: 'FEMALE', attendance: {}, remarks: '', termElectives: { ...INITIAL_TERM_ELECTIVES }, subjectGrades: { ...INITIAL_SUBJECT_GRADES } },
  { id: '25', lrn: '116907140038', lastName: 'DUNGOG', firstName: 'JEMEVIL', middleName: 'A', gender: 'FEMALE', attendance: {}, remarks: '', termElectives: { ...INITIAL_TERM_ELECTIVES }, subjectGrades: { ...INITIAL_SUBJECT_GRADES } },
  { id: '26', lrn: '117792160093', lastName: 'EWICAN', firstName: 'JULIA B.', middleName: '', gender: 'FEMALE', attendance: {}, remarks: '', termElectives: { ...INITIAL_TERM_ELECTIVES }, subjectGrades: { ...INITIAL_SUBJECT_GRADES } },
  { id: '27', lrn: '117792150054', lastName: 'GABIA', firstName: 'LYCA MARIA', middleName: 'SARITA', gender: 'FEMALE', attendance: {}, remarks: '', termElectives: { ...INITIAL_TERM_ELECTIVES }, subjectGrades: { ...INITIAL_SUBJECT_GRADES } },
  { id: '28', lrn: '117792150052', lastName: 'GALLARDO', firstName: 'CLARISS DIVINE', middleName: 'ARGABIO', gender: 'FEMALE', attendance: { 'OCTOBER': { 7: 'x' } }, remarks: '', termElectives: { ...INITIAL_TERM_ELECTIVES }, subjectGrades: { ...INITIAL_SUBJECT_GRADES } },
  { id: '29', lrn: '116909140055', lastName: 'HEREBIAS', firstName: 'HANNA', middleName: 'ARQUISALAS', gender: 'FEMALE', attendance: {}, remarks: '', termElectives: { ...INITIAL_TERM_ELECTIVES }, subjectGrades: { ...INITIAL_SUBJECT_GRADES } },
  { id: '30', lrn: '117792150064', lastName: 'ISUGAN', firstName: 'NOVY MAE', middleName: 'PELESORES', gender: 'FEMALE', attendance: {}, remarks: '', termElectives: { ...INITIAL_TERM_ELECTIVES }, subjectGrades: { ...INITIAL_SUBJECT_GRADES } },
  { id: '31', lrn: '117792150067', lastName: 'JIMENEZ', firstName: 'EDGIEL MAE', middleName: '', gender: 'FEMALE', attendance: { 'OCTOBER': { 16: 'x' } }, remarks: '', termElectives: { ...INITIAL_TERM_ELECTIVES }, subjectGrades: { ...INITIAL_SUBJECT_GRADES } },
  { id: '32', lrn: '117792160096', lastName: 'LARIOSA', firstName: 'JUVY-ANN', middleName: 'BARCELO', gender: 'FEMALE', attendance: { 'OCTOBER': { 21: 'x' } }, remarks: '', termElectives: { ...INITIAL_TERM_ELECTIVES }, subjectGrades: { ...INITIAL_SUBJECT_GRADES } },
  { id: '33', lrn: '117792160090', lastName: 'MELLAS', firstName: 'EM EM', middleName: 'C', gender: 'FEMALE', attendance: {}, remarks: '', termElectives: { ...INITIAL_TERM_ELECTIVES }, subjectGrades: { ...INITIAL_SUBJECT_GRADES } },
  { id: '34', lrn: '117797150029', lastName: 'MIRANDA', firstName: 'RHEA JEAN', middleName: 'FABELLLAR', gender: 'FEMALE', attendance: {}, remarks: '', termElectives: { ...INITIAL_TERM_ELECTIVES }, subjectGrades: { ...INITIAL_SUBJECT_GRADES } }
];

const createEmptySession = (sNum: number): SessionDLP => ({
  sessionNum: sNum,
  title: '',
  pptNotes: '',
  competency: '',
  objKnowledge: '',
  objSkills: '',
  objAttitude: '',
  learnerContext: '',
  preLessonHook: '',
  directInstruction: '',
  groupActivity: '',
  synthesis: '',
  concludingActivity: '',
  resources: '',
  integration: '',
  assessment: '',
  extendedLearning: '',
  reflectionText: ''
});

export default function TeacherDashboard() {
  const router = useRouter();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isAutoFillOpen, setIsAutoFillOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'sf2' | 'ilaw' | 'weelmat' | 'sis' | 'aral'>('dashboard');
  const [sisTab, setSisTab] = useState<'roster' | 'subject_grades' | 'class_summary' | 'gradeslip_preview'>('roster');
  const [students, setStudents] = useState<Student[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('enrolled_students_v1');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return ENROLLED_STUDENTS;
  });
  const [selectedStudentId, setSelectedStudentId] = useState<string>('1');

  // ARAL PROGRAM STATE
  const [aralSubTab, setAralSubTab] = useState<'attendance' | 'report_editor' | 'batch_reports'>('attendance');
  const [aralLearners, setAralLearners] = useState<AralLearner[]>(INITIAL_ARAL_LEARNERS);
  const [aralDates, setAralDates] = useState<string[]>(INITIAL_ARAL_DATES);
  const [selectedAralLearnerId, setSelectedAralLearnerId] = useState<string>('a1');
  const [aralReportDate, setAralReportDate] = useState<string>('2026-10-18');
  const [aralReportWeek, setAralReportWeek] = useState<string>('Week 1');
  const [aralTargetStatuses, setAralTargetStatuses] = useState<Record<string, string>>({
    cat1: '✔ Observed', cat2: '✔ Observed', cat3: '◑ Partially Observed',
    cat4: '✔ Observed', cat5: '◑ Partially Observed', cat6: '✔ Observed',
    cat7: '✔ Observed', cat8: '✔ Observed'
  });
  const [aralTargetNotes, setAralTargetNotes] = useState<Record<string, string>>({});
  const [aralSelectedRemarkPreset, setAralSelectedRemarkPreset] = useState<string>(SUGGESTED_ARAL_REMARKS[0]);
  const [aralCustomRemark, setAralCustomRemark] = useState<string>('');
  const [newAralDateInput, setNewAralDateInput] = useState<string>('');
  const [showAddAralLearnerModal, setShowAddAralLearnerModal] = useState<boolean>(false);
  const [newAralLearner, setNewAralLearner] = useState({ fullName: '', section: 'Gardner', gradeLevel: 'GRADE 10' });

  // ILAW DLP GENERATOR FLEXIBLE STATE
  const [dlpTerm, setDlpTerm] = useState('Term 2');
  const [dlpWeekNum, setDlpWeekNum] = useState('Week 8');
  const [startDate, setStartDate] = useState('2026-10-12');
  const [endDate, setEndDate] = useState('2026-10-16');
  const [dlpSubject, setDlpSubject] = useState('Pag-aaral ng Kasaysayan at Lipunang Pilipino');
  const [dlpReferences, setDlpReferences] = useState('');
  
  // Dynamic Class Sections & Timeslot Manager
  const [classSchedules, setClassSchedules] = useState<ClassSchedule[]>([
    { id: '1', sectionName: 'Bloodstone', timeSlot: '8:20am-9:10am' },
    { id: '2', sectionName: 'Amber', timeSlot: '9:25am-10:15am' },
    { id: '3', sectionName: 'Aquamarine', timeSlot: '11:05am-11:55am' },
  ]);

  const [activeSessionTab, setActiveSessionTab] = useState<number>(1);
  const [isGeneratingDLP, setIsGeneratingDLP] = useState(false);
  const [savedDLPsDatabase, setSavedDLPsDatabase] = useState<WeeklyDLPRecord[]>([]);
  const [selectedSavedDlpId, setSelectedSavedDlpId] = useState<string>('');
  const [showDbModal, setShowDbModal] = useState(false);
  const [dbSearchTerm, setDbSearchTerm] = useState('');

  // WeeLMat Module Specific State
  const [selectedWeelmatDlpId, setSelectedWeelmatDlpId] = useState<string>('');

  // 5 Sessions Breakdown Data (Default Clean / Unfilled)
  const [sessionsData, setSessionsData] = useState<Record<number, SessionDLP>>({
    1: createEmptySession(1),
    2: createEmptySession(2),
    3: createEmptySession(3),
    4: createEmptySession(4),
    5: createEmptySession(5)
  });

  // Clear Handlers
  const handleClearDlpForm = () => {
    if (confirm('Are you sure you want to clear all DLP fields? This will clear session content and subtopics.')) {
      setDlpSubject('');
      setDlpReferences('');
      setSessionsData({
        1: createEmptySession(1),
        2: createEmptySession(2),
        3: createEmptySession(3),
        4: createEmptySession(4),
        5: createEmptySession(5)
      });
      setSelectedSavedDlpId('');
    }
  };

  const handleClearWeelmatView = () => {
    if (confirm('Are you sure you want to clear the active WeeLMat selection?')) {
      setSelectedWeelmatDlpId('');
    }
  };

  // Schedule Manager Helpers
  const handleAddSchedule = () => {
    const id = Date.now().toString();
    setClassSchedules(prev => [...prev, { id, sectionName: 'NewSection', timeSlot: '1:00pm-1:50pm' }]);
  };

  const handleUpdateSchedule = (id: string, field: 'sectionName' | 'timeSlot', val: string) => {
    setClassSchedules(prev => prev.map(s => s.id === id ? { ...s, [field]: val } : s));
  };

  const handleRemoveSchedule = (id: string) => {
    if (classSchedules.length <= 1) return alert('At least one class section schedule is required.');
    setClassSchedules(prev => prev.filter(s => s.id !== id));
  };

  const formattedClassScheduleString = useMemo(() => {
    return classSchedules.map(s => `${s.timeSlot} (${s.sectionName})`).join(' • ');
  }, [classSchedules]);

  const formattedGradeSectionsString = useMemo(() => {
    return classSchedules.map(s => s.sectionName.replace('11-', '')).join(', ');
  }, [classSchedules]);

  const formattedLongWeekRange = useMemo(() => {
    try {
      const s = new Date(startDate);
      const e = new Date(endDate);
      const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
      const startStr = s.toLocaleDateString('en-US', options);
      const endStr = e.toLocaleDateString('en-US', options);
      return `${startStr} - ${endStr}`;
    } catch (err) {
      return `${startDate} - ${endDate}`;
    }
  }, [startDate, endDate]);

  // Sync saved DLPs on load
  useEffect(() => {
    const loaded = localStorage.getItem('ilaw_dlp_database_v2');
    if (loaded) {
      try { 
        const parsed: WeeklyDLPRecord[] = JSON.parse(loaded);
        setSavedDLPsDatabase(parsed); 
        if (parsed.length > 0 && !selectedWeelmatDlpId) {
          setSelectedWeelmatDlpId(parsed[0].id);
        }
      } catch (e) {}
    }
  }, []);

  const handleSaveDLPToDatabase = () => {
    const record: WeeklyDLPRecord = {
      id: Date.now().toString(),
      term: dlpTerm,
      weekNumber: dlpWeekNum,
      weekRange: formattedLongWeekRange,
      startDate,
      endDate,
      subject: dlpSubject,
      references: dlpReferences,
      schedules: classSchedules,
      sessions: sessionsData,
      createdAt: new Date().toLocaleDateString()
    };

    const updated = [record, ...savedDLPsDatabase.filter(r => r.id !== record.id)];
    setSavedDLPsDatabase(updated);
    localStorage.setItem('ilaw_dlp_database_v2', JSON.stringify(updated));
    setSelectedSavedDlpId(record.id);
    setSelectedWeelmatDlpId(record.id);
    alert(`Successfully saved "${dlpSubject} (${dlpTerm} • ${dlpWeekNum})"! It is now available in the WeeLMat Generator tab.`);
  };

  const handleLoadSavedDLP = (id: string) => {
    setSelectedSavedDlpId(id);
    const target = savedDLPsDatabase.find(r => r.id === id);
    if (target) {
      if (target.term) setDlpTerm(target.term);
      if (target.weekNumber) setDlpWeekNum(target.weekNumber);
      setStartDate(target.startDate);
      setEndDate(target.endDate);
      setDlpSubject(target.subject);
      setDlpReferences(target.references);
      setClassSchedules(target.schedules);
      setSessionsData(target.sessions);
      setShowDbModal(false);
    }
  };

  const handleDeleteSavedDLP = (id: string, label: string) => {
    if (confirm(`Are you sure you want to delete "${label}" from database?`)) {
      const updated = savedDLPsDatabase.filter(r => r.id !== id);
      setSavedDLPsDatabase(updated);
      localStorage.setItem('ilaw_dlp_database_v2', JSON.stringify(updated));
      if (selectedSavedDlpId === id) setSelectedSavedDlpId('');
      if (selectedWeelmatDlpId === id && updated.length > 0) setSelectedWeelmatDlpId(updated[0].id);
    }
  };

  // Active Weelmat Record Calculation
  const activeWeelmatRecord = useMemo(() => {
    return savedDLPsDatabase.find(r => r.id === selectedWeelmatDlpId) || {
      id: 'current',
      term: dlpTerm,
      weekNumber: dlpWeekNum,
      weekRange: formattedLongWeekRange,
      startDate,
      endDate,
      subject: dlpSubject,
      references: dlpReferences,
      schedules: classSchedules,
      sessions: sessionsData,
      createdAt: ''
    };
  }, [savedDLPsDatabase, selectedWeelmatDlpId, dlpTerm, dlpWeekNum, formattedLongWeekRange, startDate, endDate, dlpSubject, dlpReferences, classSchedules, sessionsData]);

  // ARAL HELPERS & CALCULATIONS
  const selectedAralLearner = aralLearners.find(a => a.id === selectedAralLearnerId) || aralLearners[0];

  const toggleAralAttendance = (learnerId: string, dateStr: string) => {
    setAralLearners(prev => prev.map(l => {
      if (l.id === learnerId) {
        const current = l.attendance[dateStr] || '';
        let next = '';
        if (!current) next = 'x';
        else if (current === 'x') next = 'h';
        else next = '';
        return { ...l, attendance: { ...l.attendance, [dateStr]: next } };
      }
      return l;
    }));
  };

  const handleAddAralDate = () => {
    if (!newAralDateInput) return;
    if (!aralDates.includes(newAralDateInput)) {
      setAralDates(prev => [...prev, newAralDateInput].sort());
    }
    setNewAralDateInput('');
  };

  const handleAddAralLearner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAralLearner.fullName) return;
    const created: AralLearner = {
      id: Date.now().toString(),
      fullName: newAralLearner.fullName.toUpperCase(),
      section: newAralLearner.section,
      gradeLevel: newAralLearner.gradeLevel,
      attendance: {}
    };
    setAralLearners(prev => [...prev, created]);
    setNewAralLearner({ fullName: '', section: 'Gardner', gradeLevel: 'GRADE 10' });
    setShowAddAralLearnerModal(false);
  };

  const handleDeleteAralLearner = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name} from ARAL roster?`)) {
      setAralLearners(prev => prev.filter(l => l.id !== id));
      if (selectedAralLearnerId === id) {
        const remaining = aralLearners.filter(l => l.id !== id);
        if (remaining.length > 0) setSelectedAralLearnerId(remaining[0].id);
      }
    }
  };

  // ARAL STATS
  const aralTotalTutees = aralLearners.length;
  const aralAttendanceStats = useMemo(() => {
    let totalPossible = aralLearners.length * aralDates.length;
    if (totalPossible === 0) return { rate: '100.0', totalAbsences: 0 };
    let absCount = 0;
    aralLearners.forEach(l => {
      aralDates.forEach(d => {
        const mark = l.attendance[d];
        if (mark === 'x') absCount += 1;
        else if (mark === 'h') absCount += 0.5;
      });
    });
    const presentCount = totalPossible - absCount;
    return {
      rate: ((presentCount / totalPossible) * 100).toFixed(1),
      totalAbsences: absCount
    };
  }, [aralLearners, aralDates]);

  const aralMasteryRate = useMemo(() => {
    const totalCategories = ARAL_READING_CATEGORIES.length;
    let observedCount = 0;
    Object.values(aralTargetStatuses).forEach(st => {
      if (st === '✔ Observed') observedCount++;
    });
    return ((observedCount / totalCategories) * 100).toFixed(0);
  }, [aralTargetStatuses]);

  const aralLearnersAtRiskCount = useMemo(() => {
    let count = 0;
    aralLearners.forEach(l => {
      let abs = 0;
      aralDates.forEach(d => {
        if (l.attendance[d] === 'x') abs++;
      });
      if (abs >= 3) count++;
    });
    return count;
  }, [aralLearners, aralDates]);

  const handleExportAralReportToWord = (targetLearner: AralLearner) => {
    const finalRemarkText = aralCustomRemark.trim() || aralSelectedRemarkPreset;

    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>ARAL Reading IRIP - ${targetLearner.fullName}</title>
        <style>
          body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 10pt; line-height: 1.2; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 10pt; }
          th, td { border: 1pt solid black; padding: 5pt; text-align: left; vertical-align: top; }
          .header-title { font-size: 13pt; font-weight: bold; text-align: center; text-transform: uppercase; }
          .sub-title { font-size: 8.5pt; text-align: center; font-style: italic; color: #444; }
          .bold { font-weight: bold; }
          .bg-head { background-color: #F1F5F9; font-weight: bold; text-align: center; }
        </style>
      </head>
      <body>
        <div style="text-align: center; margin-bottom: 8pt;">
          <div className="header-title">ARAL READING PLUS IRIP FOR KEY STAGES 2</div>
          <div className="sub-title">Bagonbon National High School • Department of Education</div>
        </div>

        <table>
          <tr>
            <td class="bold" width="20%">Learner’s Name:</td>
            <td class="bold" width="30%">${targetLearner.fullName}</td>
            <td class="bold" width="20%">Grade & Section:</td>
            <td class="bold">${targetLearner.gradeLevel} - ${targetLearner.section}</td>
          </tr>
          <tr>
            <td class="bold">Tutor’s Name:</td>
            <td class="bold">${adviserName}</td>
            <td class="bold">Date & Session:</td>
            <td class="bold">${aralReportDate} (${aralReportWeek})</td>
          </tr>
        </table>

        <table>
          <tr class="bg-head">
            <td width="45%">Reading Target / Category</td>
            <td width="20%">Status</td>
            <td width="35%">Tutor Notes / Observations</td>
          </tr>

          ${ARAL_READING_CATEGORIES.map(cat => `
            <tr>
              <td>
                <b>${cat.categoryName}</b><br/>
                <span style="font-size:8.5pt; color:#444;">• ${cat.targets.join('<br/>• ')}</span>
              </td>
              <td style="text-align:center; font-weight:bold;">
                ${aralTargetStatuses[cat.id] || '✔ Observed'}
              </td>
              <td style="font-size:9pt;">
                ${aralTargetNotes[cat.id] || ''}
              </td>
            </tr>
          `).join('')}
        </table>

        <div style="border:1pt solid black; padding:6pt; margin-bottom:12pt; font-size:9pt;">
          <b>Overall Tutor Remarks & Recommendations:</b><br/>
          ${finalRemarkText}
        </div>

        <div style="font-size: 8.5pt; border: 1pt solid black; padding: 4pt; margin-bottom: 15pt;">
          <b>Status Legend:</b><br/>
          ✔ Observed — Ready to proceed to the next reading target<br/>
          ◑ Partially Observed — Needs additional practice on the current reading target<br/>
          ✘ Not Observed — Reteach the current reading target
        </div>

        <table>
          <tr>
            <td style="border:none; width:50%; text-align:center;">
              Prepared by:<br/><br/><br/>
              <b><u>${adviserName}</u></b><br/>ARAL Tutor / Teacher I
            </td>
            <td style="border:none; width:50%; text-align:center;">
              Reviewed and checked by:<br/><br/><br/>
              <b><u>${schoolHeadName}</u></b><br/>School Principal I
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ARAL_IRIP_${targetLearner.fullName.replace(/ /g, '_')}_${aralReportWeek}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // GEMINI INTEGRATION FUNCTION
  const handleAIParseActiveSession = async () => {
    setIsGeneratingDLP(true);
    const activeData = sessionsData[activeSessionTab];

    const promptText = `
    Act as an expert Senior High School DepEd Master Teacher. Generate an official ILAW Lesson Plan based on DepEd Order No. 016, s. 2026.
    
    Topic Title: ${activeData.title || 'Untitled Session'}
    Subject: ${dlpSubject}
    Slide Deck/Notes: ${activeData.pptNotes || 'None provided'}
    Term & Week: ${dlpTerm}, ${dlpWeekNum}

    Respond strictly in valid JSON format with the following keys (Tagalog/Filipino language):
    {
      "competency": "Natataya ang...",
      "objKnowledge": "Natutukoy ang...",
      "objSkills": "Nasusuri ang...",
      "objAttitude": "Naipaliliwanag ang...",
      "learnerContext": "May batayang pag-unawa sa...",
      "preLessonHook": "Gawain 1: Pagganyak: ...",
      "directInstruction": "Gawain 2: Direct Instruction: ...",
      "groupActivity": "Gawain 3: Group Activity: ...",
      "synthesis": "Paglalahat: ...",
      "concludingActivity": "Gawain 4: Concluding Activity: ...",
      "resources": "• Slide Deck: ...",
      "integration": "Values Education & Araling Panlipunan.",
      "assessment": "Formative Assessment Sheet.",
      "extendedLearning": "Magsaliksik ukol sa susunod na paksa."
    }
    `;

    try {
      const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + (process.env.NEXT_PUBLIC_GEMINI_API_KEY || ''), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }]
        })
      });

      if (res.ok) {
        const data = await res.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const cleanJsonStr = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJsonStr);

        setSessionsData(prev => ({
          ...prev,
          [activeSessionTab]: {
            ...activeData,
            competency: parsed.competency || activeData.competency,
            objKnowledge: parsed.objKnowledge || activeData.objKnowledge,
            objSkills: parsed.objSkills || activeData.objSkills,
            objAttitude: parsed.objAttitude || activeData.objAttitude,
            learnerContext: parsed.learnerContext || activeData.learnerContext,
            preLessonHook: parsed.preLessonHook || activeData.preLessonHook,
            directInstruction: parsed.directInstruction || activeData.directInstruction,
            groupActivity: parsed.groupActivity || activeData.groupActivity,
            synthesis: parsed.synthesis || activeData.synthesis,
            concludingActivity: parsed.concludingActivity || activeData.concludingActivity,
            resources: parsed.resources || activeData.resources,
            integration: parsed.integration || activeData.integration,
            assessment: parsed.assessment || activeData.assessment,
            extendedLearning: parsed.extendedLearning || activeData.extendedLearning
          }
        }));
      } else {
        throw new Error('API request failed');
      }
    } catch (err) {
      const updatedSession: SessionDLP = {
        ...activeData,
        competency: 'Natataya ang bunga ng mga kilusang panlipunan sa pagsusulong ng kamalayang Pilipino.',
        objKnowledge: `Natutukoy ang mga pangunahing datos at paksa ukol sa: ${activeData.title || 'Aralin'}`,
        objSkills: `Nasusuri ang mga detalye at kaisipan sa ${activeData.title || 'Aralin'} gamit ang angkop na Graphic Organizer; at`,
        objAttitude: 'Naipaliliwanag ang pambansang kahalagahan ng aralin at pagmamahal sa bayan.',
        preLessonHook: `Gawain 1: Pagganyak: "Suri-Larawan / Sitwasyon" (5 minuto)`,
        directInstruction: `Gawain 2: Direct Instruction: Pagsusuri sa ${activeData.title || 'Aralin'} (20 minuto)`,
        groupActivity: `Gawain 3: Group Activity: Kolaboratibong Gawain sa Worksheets (20 minuto)`,
        synthesis: `Paglalahat: Mapanuring talakayan ukol sa implikasyon ng ${activeData.title || 'Aralin'} (10 minuto)`,
        concludingActivity: 'Gawain 4: Concluding Activity: Maikling repleksyon / Exit Card (5 minuto)'
      };
      setSessionsData(prev => ({ ...prev, [activeSessionTab]: updatedSession }));
    } finally {
      setIsGeneratingDLP(false);
    }
  };

  // AI Generate ARAL Observation Notes
  const handleGenerateAralNotes = async () => {
    const selectedPresetText = aralCustomRemark.trim() || aralSelectedRemarkPreset;
    setIsGeneratingDLP(true); // Reusing the loading state

    const promptText = `
    Act as an expert Reading Tutor. Based on the overall tutor remark below, generate specific, brief observation notes for each of the 8 reading categories.
    
    Overall Tutor Remark: "${selectedPresetText}"
    Learner Name: ${selectedAralLearner?.fullName}
    
    Here are the categories and their current statuses:
    ${ARAL_READING_CATEGORIES.map(cat => `- ${cat.categoryName}: ${aralTargetStatuses[cat.id] || '✔ Observed'}`).join('\n')}

    Respond strictly in valid JSON format matching the category IDs (cat1, cat2, etc.) to their generated note string. Keep each note under 15 words.
    Example format:
    {
      "cat1": "Demonstrated strong vocabulary skills during decoding.",
      "cat2": "Reads fluently but needs pacing improvement in long texts."
    }
    `;

    try {
      const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + (process.env.NEXT_PUBLIC_GEMINI_API_KEY || ''), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }]
        })
      });

      if (res.ok) {
        const data = await res.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const cleanJsonStr = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJsonStr);

        // Merge the AI generated notes with existing state
        setAralTargetNotes(prev => ({
          ...prev,
          ...parsed
        }));
      } else {
        throw new Error('API request failed');
      }
    } catch (err) {
      // Fallback if API fails
      const fallbackNotes: Record<string, string> = {};
      ARAL_READING_CATEGORIES.forEach(cat => {
        fallbackNotes[cat.id] = `Demonstrated ${aralTargetStatuses[cat.id]?.toLowerCase() || 'observed'} performance in ${cat.categoryName.toLowerCase()}.`;
      });
      setAralTargetNotes(prev => ({ ...prev, ...fallbackNotes }));
    } finally {
      setIsGeneratingDLP(false);
    }
  };

  const handleExportToWord = () => {
    const currentSession = sessionsData[activeSessionTab];

    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>ILAW DLP - ${dlpSubject}</title>
        <style>
          body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; line-height: 1.2; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 12pt; }
          th, td { border: 1pt solid black; padding: 6pt; text-align: left; vertical-align: top; }
          .header-title { font-size: 14pt; font-weight: bold; text-align: center; text-transform: uppercase; }
          .sub-title { font-size: 9pt; text-align: center; font-style: italic; color: #444; }
          .section-head { background-color: #E2E8F0; font-weight: bold; text-transform: uppercase; font-size: 10pt; }
          .bold { font-weight: bold; }
          .empty-box { height: 80pt; vertical-align: top; }
        </style>
      </head>
      <body>
        <div class="header-title">Department of Education • Bagonbon NHS</div>
        <div class="sub-title">ILAW Framework Based on DepEd Order No. 016, s. 2026: "Guidelines on Lesson Planning and Learning Design"</div>
        <br/>
        <table>
          <tr><td class="bold" width="20%">Name of Lesson</td><td colspan="3" class="bold" style="color:#B91C1C;">Session ${activeSessionTab}: ${currentSession.title}</td></tr>
          <tr><td class="bold">Term & Week</td><td class="bold">${dlpTerm} • ${dlpWeekNum}</td><td class="bold" width="20%">Week / Date Range</td><td>${formattedLongWeekRange}</td></tr>
          <tr><td class="bold">Designed by Teacher/s</td><td class="bold">${adviserName}, Teacher I</td><td class="bold">Learning Area</td><td class="bold">${dlpSubject}</td></tr>
          <tr><td class="bold">No. of Sessions</td><td class="bold">5 sessions (50 mins)</td><td class="bold">Grade & Section</td><td class="bold">${formattedGradeSectionsString}</td></tr>
          <tr><td class="bold">References</td><td colspan="3">${dlpReferences}</td></tr>
        </table>

        <table>
          <tr><td colspan="2" class="section-head">I. INTENTIONS (Layunin at Konteksto)</td></tr>
          <tr><td class="bold" width="25%">Learning Competency</td><td>${currentSession.competency}</td></tr>
          <tr><td class="bold">Learning Objectives</td><td>
            <b>Kaalaman:</b> ${currentSession.objKnowledge}<br/>
            <b>Kasanayan:</b> ${currentSession.objSkills}<br/>
            <b>Saloobin:</b> ${currentSession.objAttitude}
          </td></tr>
          <tr><td class="bold">Learner Context</td><td>${currentSession.learnerContext}</td></tr>
        </table>

        <table>
          <tr><td colspan="2" class="section-head">II. LEARNING EXPERIENCE (Gawain at Pamamaraan)</td></tr>
          <tr><td class="bold" width="25%">Pre-Lesson (Pagganyak)</td><td>${currentSession.preLessonHook}</td></tr>
          <tr><td class="bold">Direct Instruction</td><td>${currentSession.directInstruction}</td></tr>
          <tr><td class="bold">Group Activity</td><td>${currentSession.groupActivity}</td></tr>
          <tr><td class="bold">Synthesis & Application</td><td>${currentSession.synthesis}</td></tr>
          <tr><td class="bold">Concluding Activity</td><td>${currentSession.concludingActivity}</td></tr>
        </table>

        <table>
          <tr><td class="section-head" width="50%">III. LEARNING RESOURCES</td><td class="section-head" width="50%">IV. OPPORTUNITIES FOR INTEGRATION</td></tr>
          <tr><td>${currentSession.resources}</td><td>${currentSession.integration}</td></tr>
        </table>

        <table>
          <tr><td colspan="2" class="section-head">V. ASSESSMENT & WAYS FORWARD</td></tr>
          <tr><td class="bold" width="25%">Formative Assessment</td><td>${currentSession.assessment}</td></tr>
          <tr><td class="bold">Extended Learning</td><td>${currentSession.extendedLearning}</td></tr>
        </table>

        <table>
          <tr><td class="section-head">VI. REFLECTION (Pagninilay)</td></tr>
          <tr class="empty-box"><td>${(currentSession.reflectionText || '').replace(/\n/g, '<br/>')}</td></tr>
        </table>

        <br/><br/>
        <table>
          <tr>
            <td style="border:none; text-align:center;">
              Prepared by:<br/><br/><br/>
              <b><u>${adviserName}</u></b><br/>Teacher I
            </td>
            <td style="border:none; text-align:center;">
              Reviewed and checked by:<br/><br/><br/>
              <b><u>${schoolHeadName}</u></b><br/>School Principal I
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ILAW_DLP_${dlpTerm.replace(' ', '')}_${dlpWeekNum.replace(' ', '')}_Session_${activeSessionTab}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportWeelmatToWord = () => {
    const r = activeWeelmatRecord;
    const sectionsStr = r.schedules.map(s => s.sectionName.replace('11-', '')).join(', ');

    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Weekly Learning Matrix (WeelMat)</title>
        <style>
          body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 10pt; line-height: 1.2; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 12pt; }
          th, td { border: 1pt solid black; padding: 5pt; text-align: left; vertical-align: top; }
          .header-title { font-size: 14pt; font-weight: bold; text-align: center; text-transform: uppercase; }
          .sub-title { font-size: 9pt; text-align: center; font-style: italic; color: #444; }
          .bold { font-weight: bold; }
          .bg-head { background-color: #F1F5F9; font-weight: bold; text-align: center; }
        </style>
      </head>
      <body>
        <div style="text-align: center; margin-bottom: 10pt;">
          <div className="header-title">Department of Education • Bagonbon NHS</div>
          <div className="sub-title">Weekly Learning Matrix (WeelMat)</div>
        </div>
        <br/>
        <table>
          <tr class="bg-head">
            <td width="30%">Subject Area</td>
            <td width="15%">Grade Level</td>
            <td width="30%">Section</td>
            <td width="25%">Covered Dates</td>
          </tr>
          <tr>
            <td class="bold">${r.subject}</td>
            <td class="bold" style="text-align:center;">11</td>
            <td class="bold">${sectionsStr}</td>
            <td class="bold">${r.weekRange}</td>
          </tr>
        </table>

        <table>
          <tr class="bg-head">
            <td width="20%">Monday</td>
            <td width="20%">Tuesday</td>
            <td width="20%">Wednesday</td>
            <td width="20%">Thursday</td>
            <td width="20%">Friday</td>
          </tr>
          
          <!-- Lesson Title Row -->
          <tr>
            <td colspan="5" class="bold" style="background-color:#E2E8F0;">Lesson Title</td>
          </tr>
          <tr>
            <td>${r.sessions[1]?.title || ''}</td>
            <td>${r.sessions[2]?.title || ''}</td>
            <td>${r.sessions[3]?.title || ''}</td>
            <td>${r.sessions[4]?.title || ''}</td>
            <td>${r.sessions[5]?.title || ''}</td>
          </tr>

          <!-- Competency Row -->
          <tr>
            <td colspan="5" class="bold" style="background-color:#E2E8F0;">Competency</td>
          </tr>
          <tr>
            <td>${r.sessions[1]?.competency || ''}</td>
            <td>${r.sessions[2]?.competency || ''}</td>
            <td>${r.sessions[3]?.competency || ''}</td>
            <td>${r.sessions[4]?.competency || ''}</td>
            <td>${r.sessions[5]?.competency || ''}</td>
          </tr>

          <!-- Suggested Learning Material / Reference Row -->
          <tr>
            <td colspan="5" class="bold" style="background-color:#E2E8F0;">Suggested Learning Material / Reference</td>
          </tr>
          <tr>
            <td>${(r.sessions[1]?.resources || '').replace(/\n/g, '<br/>')}</td>
            <td>${(r.sessions[2]?.resources || '').replace(/\n/g, '<br/>')}</td>
            <td>${(r.sessions[3]?.resources || '').replace(/\n/g, '<br/>')}</td>
            <td>${(r.sessions[4]?.resources || '').replace(/\n/g, '<br/>')}</td>
            <td>${(r.sessions[5]?.resources || '').replace(/\n/g, '<br/>')}</td>
          </tr>

          <!-- Learning Activities Row -->
          <tr>
            <td colspan="5" class="bold" style="background-color:#E2E8F0;">Learning Activities</td>
          </tr>
          <tr>
            <td>
              ${r.sessions[1]?.preLessonHook || ''}<br/>
              ${r.sessions[1]?.directInstruction || ''}<br/>
              ${r.sessions[1]?.groupActivity || ''}<br/>
              ${r.sessions[1]?.concludingActivity || ''}
            </td>
            <td>
              ${r.sessions[2]?.preLessonHook || ''}<br/>
              ${r.sessions[2]?.directInstruction || ''}<br/>
              ${r.sessions[2]?.groupActivity || ''}<br/>
              ${r.sessions[2]?.concludingActivity || ''}
            </td>
            <td>
              ${r.sessions[3]?.preLessonHook || ''}<br/>
              ${r.sessions[3]?.directInstruction || ''}<br/>
              ${r.sessions[3]?.groupActivity || ''}<br/>
              ${r.sessions[3]?.concludingActivity || ''}
            </td>
            <td>
              ${r.sessions[4]?.preLessonHook || ''}<br/>
              ${r.sessions[4]?.directInstruction || ''}<br/>
              ${r.sessions[4]?.groupActivity || ''}<br/>
              ${r.sessions[4]?.concludingActivity || ''}
            </td>
            <td>
              ${r.sessions[5]?.preLessonHook || ''}<br/>
              ${r.sessions[5]?.directInstruction || ''}<br/>
              ${r.sessions[5]?.groupActivity || ''}<br/>
              ${r.sessions[5]?.concludingActivity || ''}
            </td>
          </tr>
        </table>

        <div style="font-size: 9pt; font-style: italic; margin-bottom: 20pt;">
          Note: Ipakita ang natapos na gawa sa magulang para sa pirma bilang ebidensya ng pagsasagawa.
        </div>

        <table>
          <tr>
            <td style="border:none; width:50%; text-align:center;">
              Prepared by:<br/><br/><br/>
              <b><u>${adviserName}</u></b><br/>Teacher I
            </td>
            <td style="border:none; width:50%; text-align:center;">
              Reviewed and checked by:<br/><br/><br/>
              <b><u>${schoolHeadName}</u></b><br/>School Principal I
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `WeeLMat_${r.subject.replace(/ /g, '_')}_${r.weekNumber.replace(/ /g, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [includeWeekends, setIncludeWeekends] = useState<boolean>(true);
  const [classInterruptions, setClassInterruptions] = useState<Record<string, Record<number, string>>>({
    'OCTOBER': { 31: 'BARANGAY ELECTION / LOCAL HOLIDAY' }
  });
  const [selectedInterruptionDay, setSelectedInterruptionDay] = useState<number>(12);
  const [interruptionText, setInterruptionText] = useState<string>('');

  const [electivePresets, setElectivePresets] = useState<string[]>([]);
  const [showPresetManager, setShowPresetManager] = useState(false);
  const [editingPresetIdx, setEditingPresetIdx] = useState<number | null>(null);
  const [editingPresetVal, setEditingPresetVal] = useState('');
  const [newPresetVal, setNewPresetVal] = useState('');

  const [printMode, setPrintMode] = useState<'single' | 'batch_all'>('single');
  const [printFilterGender, setPrintFilterGender] = useState<'ALL' | 'MALE' | 'FEMALE'>('ALL');

  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    lrn: '', lastName: '', firstName: '', middleName: '', gender: 'MALE' as 'MALE' | 'FEMALE'
  });

  const [showNotification, setShowNotification] = useState(true);
  const [greetingMessage, setGreetingMessage] = useState('Good Day');
  const teacherName = 'Judimer Zarate';

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) setGreetingMessage('Good Morning');
    else if (currentHour >= 12 && currentHour < 18) setGreetingMessage('Good Afternoon');
    else setGreetingMessage('Good Evening');

    const savedLocal = localStorage.getItem('clean_elective_presets_v3');
    if (savedLocal) {
      try { setElectivePresets(JSON.parse(savedLocal)); } catch (e) {}
    } else {
      const defaults = ['Philippine Politics and Governance', 'Creative Writing', 'Empowerment Technologies'];
      setElectivePresets(defaults);
      localStorage.setItem('clean_elective_presets_v3', JSON.stringify(defaults));
    }
  }, []);

  const savePresets = (updated: string[]) => {
    setElectivePresets(updated);
    localStorage.setItem('clean_elective_presets_v3', JSON.stringify(updated));
  };

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const schoolId = '302773';
  const schoolYear = '2026-2027';
  const [selectedMonth, setSelectedMonth] = useState('OCTOBER');
  const schoolName = 'BAGONBON NATIONAL HIGH SCHOOL';
  const gradeLevel = '11';
  const section = 'BLOODSTONE';
  const adviserName = 'JUDIMER JOHN S. ZARATE';
  const schoolHeadName = 'HOMEYLIN U. BIRONDO';

  const activeMonthData = useMemo(() => generateFullMonthCalendar(selectedMonth, includeWeekends), [selectedMonth, includeWeekends]);

  const handleClearAllSF2Entries = () => {
    if (confirm(`Are you sure you want to clear ALL attendance marks (absences/half-days) for ${selectedMonth}?`)) {
      setStudents(prev => prev.map(s => {
        const updatedAttendance = { ...s.attendance };
        delete updatedAttendance[selectedMonth];
        return { ...s, attendance: updatedAttendance, remarks: '' };
      }));
      
      setClassInterruptions(prev => {
        const updated = { ...prev };
        delete updated[selectedMonth];
        return updated;
      });
    }
  };

  const monthInterruptionMap = classInterruptions[selectedMonth] || {};
  const numberOfSchoolDays = useMemo(() => {
    let count = 0;
    activeMonthData.days.forEach((dayNum, i) => {
      const isWknd = activeMonthData.isWeekend[i];
      const isInterrupted = !!monthInterruptionMap[dayNum];
      if (!isWknd && !isInterrupted) count++;
    });
    return count;
  }, [activeMonthData, monthInterruptionMap]);

  const maleList = students.filter(s => s.gender === 'MALE');
  const femaleList = students.filter(s => s.gender === 'FEMALE');

  const calculateStudentStats = (student: Student | null) => {
    if (!student) return { absent: '', present: '' };
    let absents = 0;
    const monthAtt = student.attendance[selectedMonth] || {};
    activeMonthData.days.forEach((dayNum, idx) => {
      if (activeMonthData.isWeekend[idx] || monthInterruptionMap[dayNum]) return;
      const mark = monthAtt[dayNum];
      if (mark === 'x') absents += 1;
      else if (mark === 'h') absents += 0.5;
    });
    const presents = Math.max(0, numberOfSchoolDays - absents);
    return { absent: absents > 0 ? absents : 0, present: presents };
  };

  const maleDailyPresent = activeMonthData.days.map((dayNum, dayIdx) => {
    if (activeMonthData.isWeekend[dayIdx] || monthInterruptionMap[dayNum]) return 0;
    let count = 0;
    maleList.forEach(s => {
      const monthAtt = s.attendance[selectedMonth] || {};
      const mark = monthAtt[dayNum];
      if (!mark) count += 1;
      else if (mark === 'h') count += 0.5;
    });
    return count;
  });

  const femaleDailyPresent = activeMonthData.days.map((dayNum, dayIdx) => {
    if (activeMonthData.isWeekend[dayIdx] || monthInterruptionMap[dayNum]) return 0;
    let count = 0;
    femaleList.forEach(s => {
      const monthAtt = s.attendance[selectedMonth] || {};
      const mark = monthAtt[dayNum];
      if (!mark) count += 1;
      else if (mark === 'h') count += 0.5;
    });
    return count;
  });

  const combinedDailyPresent = maleDailyPresent.map((m, i) => m + femaleDailyPresent[i]);

  const toggleAttendanceCell = (studentId: string, dayNum: number) => {
    if (monthInterruptionMap[dayNum]) return;
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const currentMonthAtt = s.attendance[selectedMonth] || {};
        const current = currentMonthAtt[dayNum];
        let nextMark = '';
        if (!current) nextMark = 'x';
        else if (current === 'x') nextMark = 'h';
        else nextMark = '';
        
        return { 
          ...s, 
          attendance: { 
            ...s.attendance, 
            [selectedMonth]: { ...currentMonthAtt, [dayNum]: nextMark } 
          } 
        };
      }
      return s;
    }));
  };

  const handleAddInterruption = () => {
    if (!interruptionText.trim()) return;
    setClassInterruptions(prev => ({
      ...prev,
      [selectedMonth]: {
        ...(prev[selectedMonth] || {}),
        [selectedInterruptionDay]: interruptionText.trim().toUpperCase()
      }
    }));
    setInterruptionText('');
  };

  const handleRemoveInterruption = (dayNum: number) => {
    setClassInterruptions(prev => {
      const updatedMonth = { ...(prev[selectedMonth] || {}) };
      delete updatedMonth[dayNum];
      return { ...prev, [selectedMonth]: updatedMonth };
    });
  };

  const maleRegisteredEnd = maleList.length;
  const femaleRegisteredEnd = femaleList.length;
  const totalRegisteredEnd = maleRegisteredEnd + femaleRegisteredEnd;

  const maleTotalDailyPresent = maleDailyPresent.reduce((a, b) => a + b, 0);
  const femaleTotalDailyPresent = femaleDailyPresent.reduce((a, b) => a + b, 0);
  const combinedTotalDailyPresent = maleTotalDailyPresent + femaleTotalDailyPresent;

  const maleAvgDailyAttendance = numberOfSchoolDays > 0 ? (maleTotalDailyPresent / numberOfSchoolDays).toFixed(2) : '0.00';
  const femaleAvgDailyAttendance = numberOfSchoolDays > 0 ? (femaleTotalDailyPresent / numberOfSchoolDays).toFixed(2) : '0.00';
  const totalAvgDailyAttendance = numberOfSchoolDays > 0 ? (combinedTotalDailyPresent / numberOfSchoolDays).toFixed(2) : '0.00';

  const malePercentageAttendance = maleRegisteredEnd > 0 ? ((parseFloat(maleAvgDailyAttendance) / maleRegisteredEnd) * 100).toFixed(1) : '0.0';
  const femalePercentageAttendance = femaleRegisteredEnd > 0 ? ((parseFloat(femaleAvgDailyAttendance) / femaleRegisteredEnd) * 100).toFixed(1) : '0.0';
  const totalPercentageAttendance = totalRegisteredEnd > 0 ? ((parseFloat(totalAvgDailyAttendance) / totalRegisteredEnd) * 100).toFixed(1) : '0.0';

  const [studentRegistry, setStudentRegistry] = useState<Record<string, { password: string }>>({});
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  useEffect(() => {
    localStorage.setItem('enrolled_students_v1', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    const registry = JSON.parse(localStorage.getItem('student_accounts_registry') || '{}');
    setStudentRegistry(registry);
  }, [activeTab, sisTab]);

  const togglePasswordVisibility = (lrn: string) => {
    setVisiblePasswords(prev => ({ ...prev, [lrn]: !prev[lrn] }));
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.lrn || !newStudent.lastName || !newStudent.firstName) return;

    const created: Student = {
      id: Date.now().toString(),
      lrn: newStudent.lrn,
      lastName: newStudent.lastName.toUpperCase(),
      firstName: newStudent.firstName.toUpperCase(),
      middleName: newStudent.middleName.toUpperCase(),
      gender: newStudent.gender,
      attendance: {},
      remarks: '',
      termElectives: { term1: { name: '', grade: 0 }, term2: { name: '', grade: 0 }, term3: { name: '', grade: 0 } },
      subjectGrades: { ...INITIAL_SUBJECT_GRADES }
    };

    setStudents(prev => [...prev, created]);
    setNewStudent({ lrn: '', lastName: '', firstName: '', middleName: '', gender: 'MALE' });
    setShowAddModal(false);
  };

  const handleDeleteStudent = (studentId: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name} from enrolled roster?`)) {
      setStudents(prev => prev.filter(s => s.id !== studentId));
      if (selectedStudentId === studentId) {
        const remaining = students.filter(s => s.id !== studentId);
        if (remaining.length > 0) setSelectedStudentId(remaining[0].id);
      }
    }
  };

  const handleSelectStudentAndOpenDashboard = (studentId: string) => {
    setSelectedStudentId(studentId);
    setSisTab('subject_grades');
  };

  const selectedStudent = students.find(s => s.id === selectedStudentId) || students[0];

  const filteredPrintStudents = useMemo(() => {
    if (printMode === 'single') return [selectedStudent];
    if (printFilterGender === 'MALE') return maleList;
    if (printFilterGender === 'FEMALE') return femaleList;
    return students;
  }, [printMode, printFilterGender, selectedStudent, students, maleList, femaleList]);

  const handleGradeChange = (studentId: string, subject: string, term: 'term1' | 'term2' | 'term3', val: number) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const currentSubGrades = s.subjectGrades[subject] || { term1: 0, term2: 0, term3: 0 };
        return {
          ...s,
          subjectGrades: { ...s.subjectGrades, [subject]: { ...currentSubGrades, [term]: val } }
        };
      }
      return s;
    }));
  };

  const handleElectiveChange = (
    studentId: string, 
    termKey: 'term1' | 'term2' | 'term3', 
    field: 'name' | 'grade', 
    val: string | number
  ) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const currentTermElective = s.termElectives[termKey] || { name: '', grade: 0 };
        return {
          ...s,
          termElectives: { ...s.termElectives, [termKey]: { ...currentTermElective, [field]: val } }
        };
      }
      return s;
    }));
  };

  const saveElectivePreset = (title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    if (!electivePresets.includes(trimmed)) savePresets([...electivePresets, trimmed]);
  };

  const handlePresetDelete = (targetPreset: string) => {
    savePresets(electivePresets.filter(p => p !== targetPreset));
  };

  const handlePresetEditSave = (idx: number) => {
    if (!editingPresetVal.trim()) return;
    const updated = [...electivePresets];
    updated[idx] = editingPresetVal.trim();
    savePresets(updated);
    setEditingPresetIdx(null);
    setEditingPresetVal('');
  };

  const handleAddPresetDirect = () => {
    if (!newPresetVal.trim()) return;
    saveElectivePreset(newPresetVal);
    setNewPresetVal('');
  };

  const calculateTermAverage = (student: Student, termKey: 'term1' | 'term2' | 'term3') => {
    let sum = 0; let count = 0;
    CORE_SUBJECTS.forEach(sub => {
      const g = student?.subjectGrades[sub];
      if (g && g[termKey] > 0) { sum += g[termKey]; count++; }
    });
    const el = student?.termElectives[termKey];
    if (el && el.grade > 0) { sum += el.grade; count++; }
    return count > 0 ? (sum / count).toFixed(1) : '-';
  };

  const calculateFinalAverage = (student: Student) => {
    if (!student) return '0.0';
    let sum = 0; let count = 0;
    CORE_SUBJECTS.forEach(sub => {
      const g = student.subjectGrades[sub];
      if (g) {
        if (g.term1 > 0) { sum += g.term1; count++; }
        if (g.term2 > 0) { sum += g.term2; count++; }
        if (g.term3 > 0) { sum += g.term3; count++; }
      }
    });
    ['term1', 'term2', 'term3'].forEach(t => {
      const el = student.termElectives[t as 'term1' | 'term2' | 'term3'];
      if (el && el.grade > 0) { sum += el.grade; count++; }
    });
    return count > 0 ? (sum / count).toFixed(1) : '0.0';
  };

  const isDark = theme === 'dark';

  const handleKagawaranError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    const sources = ['/kagawaran-logo.webp', '/images/kagawaran-logo.webp'];
    const currentSrc = target.getAttribute('src');
    const nextIdx = sources.indexOf(currentSrc || '') + 1;
    if (nextIdx < sources.length) { target.src = sources[nextIdx]; }
    else {
      target.style.display = 'none';
      if (target.nextElementSibling) (target.nextElementSibling as HTMLElement).style.display = 'flex';
    }
  };

  const handleDepedError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    const sources = ['/deped-logo.jpg', '/images/deped-logo.jpg'];
    const currentSrc = target.getAttribute('src');
    const nextIdx = sources.indexOf(currentSrc || '') + 1;
    if (nextIdx < sources.length) { target.src = sources[nextIdx]; }
    else {
      target.style.display = 'none';
      if (target.nextElementSibling) (target.nextElementSibling as HTMLElement).style.display = 'flex';
    }
  };

  const filteredDatabaseRecords = useMemo(() => {
    if (!dbSearchTerm.trim()) return savedDLPsDatabase;
    const term = dbSearchTerm.toLowerCase();
    return savedDLPsDatabase.filter(r => 
      r.subject.toLowerCase().includes(term) || 
      (r.term && r.term.toLowerCase().includes(term)) ||
      (r.weekNumber && r.weekNumber.toLowerCase().includes(term)) ||
      r.weekRange.toLowerCase().includes(term) ||
      Object.values(r.sessions).some(s => s.title.toLowerCase().includes(term))
    );
  }, [savedDLPsDatabase, dbSearchTerm]);

  const renderGradeSlipCard = (st: Student) => {
    const genAvg = calculateFinalAverage(st);

    return (
      <div key={st.id} className="bg-white text-slate-900 p-6 rounded-2xl shadow-sm border border-slate-300 font-sans print:border-slate-800 print:shadow-none print:p-4">
        <div className="flex justify-between items-center border-b-2 border-slate-900 pb-3 mb-3">
          <img src="/kagawaran-logo.webp" alt="Kagawaran Logo" className="h-12 w-12 object-contain" onError={handleKagawaranError} />
          <div className="text-center">
            <div className="text-[9px] font-bold text-slate-600 uppercase">Department of Education • Bagonbon NHS</div>
            <div className="text-sm font-black text-slate-900 uppercase">OFFICIAL STUDENT GRADE SLIP</div>
          </div>
          <img src="/deped-logo.jpg" alt="DepEd Logo" className="h-10 object-contain" onError={handleDepedError} />
        </div>

        <div className="text-xs font-bold mb-3 p-2 bg-slate-100 border border-slate-300 flex justify-between">
          <span>Name: <span className="uppercase text-slate-900">{st.lastName}, {st.firstName} {st.middleName || ''}</span></span>
          <span>LRN: <span className="font-mono text-slate-900">{st.lrn}</span></span>
        </div>

        <table className="w-full text-xs border-collapse border border-slate-900 text-left mb-4">
          <thead>
            <tr className="bg-slate-200 font-bold text-slate-900">
              <th className="border border-slate-900 p-1.5">Subject Title</th>
              <th className="border border-slate-900 p-1.5 text-center w-10">T1</th>
              <th className="border border-slate-900 p-1.5 text-center w-10">T2</th>
              <th className="border border-slate-900 p-1.5 text-center w-10">T3</th>
              <th className="border border-slate-900 p-1.5 text-center w-12">Final</th>
              <th className="border border-slate-900 p-1.5 text-center w-16">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {CORE_SUBJECTS.map(sub => {
              const g = st.subjectGrades[sub] || { term1: 0, term2: 0, term3: 0 };
              const validTerms = [g.term1, g.term2, g.term3].filter(v => v > 0);
              const rating = validTerms.length > 0 ? (validTerms.reduce((a, b) => a + b, 0) / validTerms.length).toFixed(1) : '-';

              return (
                <tr key={sub}>
                  <td className="border border-slate-900 p-1.5 font-semibold">{sub}</td>
                  <td className="border border-slate-900 p-1.5 text-center">{g.term1 || '-'}</td>
                  <td className="border border-slate-900 p-1.5 text-center">{g.term2 || '-'}</td>
                  <td className="border border-slate-900 p-1.5 text-center">{g.term3 || '-'}</td>
                  <td className="border border-slate-900 p-1.5 text-center font-bold">{rating}</td>
                  <td className="border border-slate-900 p-1.5 text-center font-bold">{rating !== '-' && parseFloat(rating) >= 75 ? 'PASSED' : '-'}</td>
                </tr>
              );
            })}

            {(['term1', 'term2', 'term3'] as const).map(tKey => {
              const el = st.termElectives[tKey];
              if (!el || !el.name) return null;

              return (
                <tr key={tKey}>
                  <td className="border border-slate-900 p-1.5 font-semibold text-amber-900">{el.name} (Elective)</td>
                  <td className="border border-slate-900 p-1.5 text-center">{tKey === 'term1' ? el.grade || '-' : '-'}</td>
                  <td className="border border-slate-900 p-1.5 text-center">{tKey === 'term2' ? el.grade || '-' : '-'}</td>
                  <td className="border border-slate-900 p-1.5 text-center">{tKey === 'term3' ? el.grade || '-' : '-'}</td>
                  <td className="border border-slate-900 p-1.5 text-center font-bold">{el.grade || '-'}</td>
                  <td className="border border-slate-900 p-1.5 text-center font-bold">{el.grade > 0 ? (el.grade >= 75 ? 'PASSED' : 'FAILED') : '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="pt-2 border-t border-slate-400 space-y-3">
          <div className="flex justify-between items-center text-xs font-bold">
            <span>General Average: <span className="text-amber-600">{genAvg}</span></span>
            <span>Status: <span className={parseFloat(genAvg) >= 75 ? 'text-emerald-700' : 'text-slate-700'}>{parseFloat(genAvg) >= 75 ? 'PASSED' : 'PENDING'}</span></span>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-4 text-xs text-center font-semibold">
            <div className="text-center">
              <div className="pt-8 pb-1 border-b border-slate-900 font-bold uppercase text-center">{adviserName}</div>
              <div className="text-slate-600 text-[10px] mt-1 text-center">Class Adviser</div>
            </div>
            <div className="text-center">
              <div className="pt-8 pb-1 border-b border-slate-900">&nbsp;</div>
              <div className="text-slate-600 text-[10px] mt-1 text-center">Parent / Guardian Signature</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAralSingleReportCard = (targetLearner: AralLearner) => {
    const finalRemark = aralCustomRemark.trim() || aralSelectedRemarkPreset;

    return (
      <div key={targetLearner.id} className="bg-white text-slate-900 p-8 rounded-2xl shadow-xl font-sans print:p-0 print:shadow-none border border-slate-300">
        
        {/* HEADER BLOCK */}
        <div className="flex justify-between items-center border-b-2 border-slate-900 pb-3 mb-4">
          <img src="/kagawaran-logo.webp" alt="Kagawaran Logo" className="h-16 w-16 object-contain" onError={handleKagawaranError} />
          <div className="text-center space-y-0.5">
            <div className="text-[10px] font-bold text-slate-600 uppercase">REPUBLIKA NG PILIPINAS • Republic of the Philippines</div>
            <div className="text-xs font-bold text-slate-800 uppercase">Department of Education • Bagonbon National High School</div>
            <div className="text-sm font-black text-slate-900 uppercase tracking-wider">ARAL READING PLUS IRIP FOR KEY STAGES 2</div>
            <div className="text-[10px] font-bold text-red-700 uppercase">Academic Recovery & Accessible Learning (ARAL) Program</div>
          </div>
          <img src="/deped-logo.jpg" alt="DepEd Logo" className="h-14 object-contain" onError={handleDepedError} />
        </div>

        {/* METADATA BLOCK */}
        <table className="w-full text-xs border-collapse border border-slate-900 text-left mb-4">
          <tbody>
            <tr>
              <td className="border border-slate-900 p-2 font-bold bg-slate-100 w-32">Learner’s Name</td>
              <td className="border border-slate-900 p-2 font-black text-slate-900">{targetLearner.fullName}</td>
              <td className="border border-slate-900 p-2 font-bold bg-slate-100 w-32">Grade Level & Section</td>
              <td className="border border-slate-900 p-2 font-bold">{targetLearner.gradeLevel} - {targetLearner.section}</td>
            </tr>
            <tr>
              <td className="border border-slate-900 p-2 font-bold bg-slate-100">Tutor’s Name</td>
              <td className="border border-slate-900 p-2 font-bold">{adviserName}</td>
              <td className="border border-slate-900 p-2 font-bold bg-slate-100">Date & Session</td>
              <td className="border border-slate-900 p-2 font-bold text-amber-800">{aralReportDate} ({aralReportWeek})</td>
            </tr>
          </tbody>
        </table>

        {/* READING TARGETS MATRIX */}
        <table className="w-full text-xs border-collapse border border-slate-900 text-left mb-4">
          <thead>
            <tr className="bg-slate-200 font-black text-slate-900 text-center">
              <th className="border border-slate-900 p-2 w-1/2">Reading Target / Competency Category</th>
              <th className="border border-slate-900 p-2 w-32">Status</th>
              <th className="border border-slate-900 p-2">Tutor Notes / Observations</th>
            </tr>
          </thead>
          <tbody>
            {ARAL_READING_CATEGORIES.map(cat => (
              <tr key={cat.id}>
                <td className="border border-slate-900 p-2">
                  <div className="font-bold text-slate-900 text-[11px] mb-1">{cat.categoryName}</div>
                  <ul className="list-disc pl-4 text-[10px] text-slate-700 space-y-0.5">
                    {cat.targets.map((t, tIdx) => (
                      <li key={tIdx}>{t}</li>
                    ))}
                  </ul>
                </td>
                <td className="border border-slate-900 p-2 text-center font-black text-xs vertical-top">
                  <span className={aralTargetStatuses[cat.id] === '✔ Observed' ? 'text-emerald-700' : aralTargetStatuses[cat.id] === '◑ Partially Observed' ? 'text-amber-700' : 'text-red-700'}>
                    {aralTargetStatuses[cat.id] || '✔ Observed'}
                  </span>
                </td>
                <td className="border border-slate-900 p-2 text-[11px] text-slate-800 vertical-top italic">
                  {aralTargetNotes[cat.id] || 'Demonstrated target performance during session.'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* OVERALL REMARKS */}
        <div className="border border-slate-900 p-3 mb-4 text-xs bg-slate-50">
          <div className="font-bold text-slate-900 uppercase text-[11px] mb-1">Overall Tutor Remarks & Recommendations:</div>
          <p className="text-slate-800 font-medium leading-relaxed">{finalRemark}</p>
        </div>

        {/* LEGEND BLOCK */}
        <div className="border border-slate-900 p-2 mb-6 text-[10px] text-slate-800 bg-slate-100 flex items-center justify-between">
          <span className="font-bold">Status Legend:</span>
          <span><strong className="text-emerald-800">✔ Observed</strong> = Ready to proceed to next target</span>
          <span><strong className="text-amber-800">◑ Partially Observed</strong> = Needs additional practice</span>
          <span><strong className="text-red-800">✘ Not Observed</strong> = Reteach target</span>
        </div>

        {/* SIGNATURE BLOCK */}
        <div className="grid grid-cols-2 gap-8 pt-4 text-xs font-semibold">
          <div className="text-center">
            <div className="text-slate-600 mb-1 text-center">Prepared by:</div>
            <div className="pt-8 pb-1 border-b border-slate-900 font-extrabold uppercase text-center">{adviserName}</div>
            <div className="text-slate-600 text-[10px] text-center">ARAL Program Tutor / Teacher I</div>
          </div>

          <div className="text-center">
            <div className="text-slate-600 mb-1 text-center">Reviewed and checked by:</div>
            <div className="pt-8 pb-1 border-b border-slate-900 font-extrabold uppercase text-center">{schoolHeadName}</div>
            <div className="text-slate-600 text-[10px] text-center">School Principal I</div>
          </div>
        </div>

      </div>
    );
  };

  const currentActiveSessionData = sessionsData[activeSessionTab] || sessionsData[1];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} flex flex-col font-sans antialiased transition-colors duration-200 selection:bg-red-500 selection:text-white`}>
      
      <style jsx global>{`
        input[type='number']::-webkit-inner-spin-button,
        input[type='number']::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type='number'] { -moz-appearance: textfield; }

        .vertical-text-cell {
          writing-mode: vertical-rl;
          transform: rotate(180deg);
          text-align: center;
          vertical-align: middle;
          letter-spacing: 2px;
          white-space: nowrap;
        }

        @media print {
          body { background: white !important; color: black !important; }
          .print-page-break { page-break-after: always; break-after: page; }
        }
      `}</style>

      {/* HEADER BAR */}
      <header className={`${isDark ? 'bg-slate-900/80 border-slate-800/80' : 'bg-white/80 border-slate-200'} backdrop-blur-xl border-b sticky top-0 z-40 px-6 py-3.5 flex items-center justify-between print:hidden shadow-sm transition-colors duration-200`}>
        <div className="flex items-center space-x-3">
          <span className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'} flex items-center gap-1.5`}>
            BLOODSTONE <span className="text-red-500">LMS</span>
          </span>
          <span className="bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest">
            Teacher Portal
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <button onClick={toggleTheme} className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all duration-200 ${isDark ? 'bg-slate-800/80 border-slate-700 text-amber-400 hover:bg-slate-700 hover:shadow-lg hover:shadow-amber-500/10' : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200 hover:shadow-lg'}`}>
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          <div className="text-right hidden sm:block">
            <p className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{adviserName}</p>
            <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'} font-medium`}>Class Adviser • Grade 11</p>
          </div>

          <button onClick={() => router.push('/')} className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border transition-all duration-200 ${isDark ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700 hover:shadow-lg' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300 hover:shadow-lg'}`}>
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto print:p-0 print:max-w-none">
        
        {/* WELCOME BANNER */}
        {showNotification && activeTab === 'dashboard' && (
          <div className={`mb-8 p-6 rounded-3xl border ${isDark ? 'bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 border-red-500/20 text-white' : 'bg-gradient-to-r from-red-50 via-white to-slate-50 border-red-200 text-slate-900'} shadow-lg flex items-center justify-between relative transition-all duration-300 print:hidden overflow-hidden`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            <div className="flex items-center gap-5 relative z-10">
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex-shrink-0 shadow-inner">
                {greetingMessage.includes('Morning') ? <Sunrise className="w-8 h-8" /> : greetingMessage.includes('Afternoon') ? <Sun className="w-8 h-8" /> : <Moon className="w-8 h-8" />}
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
                  {greetingMessage}, <span className="text-red-500">{teacherName}</span>!
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'} font-medium tracking-wide`}>
                  Welcome back to the Bloodstone LMS Portal. Grade 11 - {section} active management session.
                </p>
              </div>
            </div>

            <button onClick={() => setShowNotification(false)} className={`relative z-10 p-2 rounded-xl transition ${isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-900'}`}>
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* BACK BUTTON */}
        {activeTab !== 'dashboard' && (
          <button onClick={() => setActiveTab('dashboard')} className={`mb-6 flex items-center gap-2 text-xs border px-4 py-2 rounded-xl transition-all duration-200 print:hidden shadow-sm hover:shadow-md ${isDark ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300' : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'}`}>
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Cards Dashboard
          </button>
        )}

        {/* ==================== DASHBOARD ==================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div>
              <h2 className={`text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Adviser Dashboard</h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} mt-1 font-medium tracking-wide`}>Overview & management suite for Grade 11 - {section}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div onClick={() => { setActiveTab('sis'); setSisTab('roster'); }} className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between group hover:-translate-y-1 hover:shadow-xl ${isDark ? 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 hover:border-blue-500/50 hover:shadow-blue-500/5' : 'bg-white hover:bg-slate-50 border-slate-200/90 hover:border-blue-500/50 hover:shadow-blue-500/10'}`}>
                <div>
                  <p className={`text-[10px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'} uppercase tracking-widest`}>Total Enrolled</p>
                  <h4 className={`text-3xl font-black mt-1 group-hover:text-blue-500 transition ${isDark ? 'text-white' : 'text-slate-900'}`}>{students.length}</h4>
                  <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'} mt-1 font-medium`}>{maleList.length} Male • {femaleList.length} Female</p>
                </div>
                <div className="p-3.5 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-500 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300 shadow-inner"><Users className="w-6 h-6" /></div>
              </div>

              <div onClick={() => setActiveTab('sf2')} className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between group hover:-translate-y-1 hover:shadow-xl ${isDark ? 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 hover:border-emerald-500/50 hover:shadow-emerald-500/5' : 'bg-white hover:bg-slate-50 border-slate-200/90 hover:border-emerald-500/50 hover:shadow-emerald-500/10'}`}>
                <div>
                  <p className={`text-[10px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'} uppercase tracking-widest`}>Attendance Rate</p>
                  <h4 className="text-3xl font-black text-emerald-500 mt-1">{totalPercentageAttendance}%</h4>
                  <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'} mt-1 font-medium`}>Month of {selectedMonth}</p>
                </div>
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-500 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300 shadow-inner"><TrendingUp className="w-6 h-6" /></div>
              </div>

              <div onClick={() => { setActiveTab('sis'); setSisTab('class_summary'); }} className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between group hover:-translate-y-1 hover:shadow-xl ${isDark ? 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 hover:border-amber-500/50 hover:shadow-amber-500/5' : 'bg-white hover:bg-slate-50 border-slate-200/90 hover:border-amber-500/50 hover:shadow-amber-500/10'}`}>
                <div>
                  <p className={`text-[10px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'} uppercase tracking-widest`}>Class Academic Avg</p>
                  <h4 className="text-3xl font-black text-amber-500 mt-1">0.0</h4>
                  <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'} mt-1 font-medium`}>Grade 11 - {section}</p>
                </div>
                <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-500 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all duration-300 shadow-inner"><GraduationCap className="w-6 h-6" /></div>
              </div>

              <div onClick={() => setActiveTab('aral')} className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between group hover:-translate-y-1 hover:shadow-xl ${isDark ? 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 hover:border-orange-500/50 hover:shadow-orange-500/5' : 'bg-white hover:bg-slate-50 border-slate-200/90 hover:border-orange-500/50 hover:shadow-orange-500/10'}`}>
                <div>
                  <p className={`text-[10px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'} uppercase tracking-widest`}>ARAL Program Tutees</p>
                  <h4 className="text-3xl font-black text-orange-500 mt-1">{aralLearners.length}</h4>
                  <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'} mt-1 font-medium`}>{aralAttendanceStats.rate}% Attendance Rate</p>
                </div>
                <div className="p-3.5 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-orange-500 group-hover:scale-110 group-hover:bg-orange-500/20 transition-all duration-300 shadow-inner"><Activity className="w-6 h-6" /></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
              <div onClick={() => setActiveTab('sf2')} className={`p-6 rounded-3xl border cursor-pointer transition-all duration-300 group hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden ${isDark ? 'bg-slate-900/70 border-slate-800 hover:border-red-500/40' : 'bg-white border-slate-200/90 hover:border-red-500/40'}`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl group-hover:bg-red-500/10 transition-all duration-500"></div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-inner"><FileSpreadsheet className="w-6 h-6" /></div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-lg uppercase font-bold tracking-wider ${isDark ? 'bg-slate-800/80 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>MONITORING</span>
                </div>
                <h3 className={`text-lg font-bold mb-2 relative z-10 ${isDark ? 'text-white' : 'text-slate-900'}`}>SF2 Generator</h3>
                <p className={`text-xs leading-relaxed relative z-10 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Official DepEd School Form 2 daily attendance generator with dedicated wet ink signature spacing.</p>
              </div>

              <div onClick={() => setActiveTab('ilaw')} className={`p-6 rounded-3xl border cursor-pointer transition-all duration-300 group hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden ${isDark ? 'bg-slate-900/70 border-slate-800 hover:border-red-500/40' : 'bg-white border-slate-200/90 hover:border-red-500/40'}`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl group-hover:bg-red-500/10 transition-all duration-500"></div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-inner"><Sparkles className="w-6 h-6" /></div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-lg uppercase font-bold tracking-wider ${isDark ? 'bg-slate-800/80 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>Gemini AI</span>
                </div>
                <h3 className={`text-lg font-bold mb-2 relative z-10 ${isDark ? 'text-white' : 'text-slate-900'}`}>ILAW DLP Generator</h3>
                <p className={`text-xs leading-relaxed relative z-10 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Input lesson details, parse multi-session slide decks, and generate weekly DepEd Daily Lesson Plans.</p>
              </div>

              <div onClick={() => setActiveTab('weelmat')} className={`p-6 rounded-3xl border cursor-pointer transition-all duration-300 group hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden ${isDark ? 'bg-slate-900/70 border-slate-800 hover:border-red-500/40' : 'bg-white border-slate-200/90 hover:border-red-500/40'}`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl group-hover:bg-red-500/10 transition-all duration-500"></div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-inner"><BookOpen className="w-6 h-6" /></div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-lg uppercase font-bold tracking-wider ${isDark ? 'bg-slate-800/80 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>AUTO-LINKED</span>
                </div>
                <h3 className={`text-lg font-bold mb-2 relative z-10 ${isDark ? 'text-white' : 'text-slate-900'}`}>WeeLMat Generator</h3>
                <p className={`text-xs leading-relaxed relative z-10 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Automatically generates 5-Day Weekly Learning Matrix from your saved DLP plans.</p>
              </div>

              <div onClick={() => setActiveTab('sis')} className={`p-6 rounded-3xl border cursor-pointer transition-all duration-300 group hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden ${isDark ? 'bg-slate-900/70 border-slate-800 hover:border-red-500/40' : 'bg-white border-slate-200/90 hover:border-red-500/40'}`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl group-hover:bg-red-500/10 transition-all duration-500"></div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-inner"><Users className="w-6 h-6" /></div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-lg uppercase font-bold tracking-wider ${isDark ? 'bg-slate-800/80 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>MONITORING</span>
                </div>
                <h3 className={`text-lg font-bold mb-2 relative z-10 ${isDark ? 'text-white' : 'text-slate-900'}`}>Student Information System</h3>
                <p className={`text-xs leading-relaxed relative z-10 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Enrolled learners roster, batch grade slip printer, passwords & grade management.</p>
              </div>

              <div onClick={() => setActiveTab('aral')} className={`p-6 rounded-3xl border cursor-pointer transition-all duration-300 group hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden md:col-span-2 lg:col-span-1 ${isDark ? 'bg-slate-900/70 border-slate-800 hover:border-red-500/40' : 'bg-white border-slate-200/90 hover:border-red-500/40'}`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl group-hover:bg-red-500/10 transition-all duration-500"></div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-inner"><Activity className="w-6 h-6" /></div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-lg uppercase font-bold tracking-wider ${isDark ? 'bg-slate-800/80 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>MONITORING</span>
                </div>
                <h3 className={`text-lg font-bold mb-2 relative z-10 ${isDark ? 'text-white' : 'text-slate-900'}`}>ARAL Program MS</h3>
                <p className={`text-xs leading-relaxed relative z-10 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Track ARAL attendance logs, progress targets & generate automated weekly learner reports.</p>
              </div>
            </div>
          </div>
        )}

        {/* ==================== SF2 GENERATOR MODULE ==================== */}
        {activeTab === 'sf2' && (
          <div className="space-y-6">
            <div className={`p-5 rounded-2xl border space-y-4 print:hidden shadow-sm ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <FileSpreadsheet className="w-5 h-5 text-red-500" /> DepEd School Form 2 (SF2) Generator
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} mt-0.5`}>
                    Official daily attendance report for {students.length} Enrolled Learners ({maleList.length} Males, {femaleList.length} Females)
                  </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  <div className={`flex items-center gap-2 border px-3 py-1.5 rounded-xl ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-300'}`}>
                    <Calendar className="w-3.5 h-3.5 text-red-500" />
                    <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Reporting Month:</span>
                    <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className={`bg-transparent text-xs font-extrabold focus:outline-none cursor-pointer uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {MONTH_OPTIONS.map(m => (
                        <option key={m} value={m} className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>{m}</option>
                      ))}
                    </select>
                  </div>

                  <button 
                    onClick={() => setIncludeWeekends(!includeWeekends)} 
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all duration-200 flex items-center gap-1.5 ${includeWeekends ? 'bg-blue-600/10 border-blue-500/30 text-blue-400 hover:bg-blue-600/20' : isDark ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'}`}>
                    <span>{includeWeekends ? '✓ Weekends Included' : '+ Include Weekends'}</span>
                  </button>

                  <button 
                    onClick={handleClearAllSF2Entries}
                    className="bg-amber-600/10 hover:bg-amber-600/20 border border-amber-500/30 text-amber-500 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all duration-200">
                    <RotateCcw className="w-3.5 h-3.5" /> Clear All Entries
                  </button>

                  <button onClick={() => window.print()} className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all duration-200">
                    <Printer className="w-3.5 h-3.5" /> Print Official SF2
                  </button>
                </div>
              </div>

              <div className={`p-3 rounded-xl border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-500">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Add Class Interruption / Vertical Holiday Text:</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 flex-1 max-w-2xl">
                  <select 
                    value={selectedInterruptionDay} 
                    onChange={e => setSelectedInterruptionDay(parseInt(e.target.value))}
                    className={`p-2 rounded-xl text-xs font-bold border focus:outline-none ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}>
                    {activeMonthData.days.map((d, idx) => (
                      <option key={d} value={d}>
                        Day {d} ({activeMonthData.dayOfWeek[idx]}) {activeMonthData.isWeekend[idx] ? '[Weekend]' : ''}
                      </option>
                    ))}
                  </select>

                  <input 
                    type="text" 
                    value={interruptionText} 
                    onChange={e => setInterruptionText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleAddInterruption(); }}
                    placeholder="e.g. BARANGAY ELECTION / TYPHOON SIGNAL NO. 2"
                    className={`flex-1 min-w-[200px] p-2 rounded-xl text-xs font-medium border focus:outline-none ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
                  />

                  <button 
                    onClick={handleAddInterruption} 
                    className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> Apply Vertical Label
                  </button>
                </div>
              </div>

              {Object.keys(monthInterruptionMap).length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[11px] font-bold text-slate-400">Active Interruptions:</span>
                  {Object.entries(monthInterruptionMap).map(([dayStr, label]) => (
                    <span key={dayStr} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/30">
                      Day {dayStr}: {label}
                      <button onClick={() => handleRemoveInterruption(parseInt(dayStr))} className="hover:text-red-400"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white text-slate-900 p-6 rounded-2xl shadow-xl overflow-x-auto font-sans print:p-0 print:shadow-none">
              <div className="border border-slate-900 p-3 mb-1 bg-white">
                <div className="grid grid-cols-12 items-center gap-2 px-2 pb-2">
                  <div className="col-span-2 flex items-center justify-start">
                    <img src="/kagawaran-logo.webp" alt="Kagawaran Logo" className="h-14 w-14 object-contain" onError={handleKagawaranError} />
                  </div>
                  <div className="col-span-8 text-center space-y-0.5">
                    <div className="font-black text-sm sm:text-base tracking-wider text-slate-900 uppercase">School Form 2 (SF2) Daily Attendance Report of Learners</div>
                    <div className="text-[10px] text-slate-700 italic font-medium">(This replaces Form 1, Form 2 & STS Form 4 - Absenteeism and Dropout Profile)</div>
                  </div>
                  <div className="col-span-2 flex items-center justify-end">
                    <img src="/deped-logo.jpg" alt="DepEd Logo" className="h-12 object-contain" onError={handleDepedError} />
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-1 text-[10px] font-bold text-slate-900 pt-2 border-t border-slate-900">
                  <div className="col-span-3 border border-slate-900 p-1 flex items-center gap-1"><span className="text-slate-600 font-semibold">School ID:</span><span>{schoolId}</span></div>
                  <div className="col-span-3 border border-slate-900 p-1 flex items-center gap-1"><span className="text-slate-600 font-semibold">School Year:</span><span>{schoolYear}</span></div>
                  <div className="col-span-6 border border-slate-900 p-1 flex items-center gap-1"><span className="text-slate-600 font-semibold">Report for the Month of:</span><span className="font-extrabold text-red-700 uppercase">{selectedMonth}</span></div>
                  <div className="col-span-6 border border-slate-900 p-1 flex items-center gap-1"><span className="text-slate-600 font-semibold">Name of School:</span><span>{schoolName}</span></div>
                  <div className="col-span-2 border border-slate-900 p-1 flex items-center gap-1"><span className="text-slate-600 font-semibold">Grade Level:</span><span>{gradeLevel}</span></div>
                  <div className="col-span-4 border border-slate-900 p-1 flex items-center gap-1"><span className="text-slate-600 font-semibold">Section:</span><span>{section}</span></div>
                </div>
              </div>

              <div className="border border-slate-900 bg-slate-100 p-1.5 mb-2 text-[9px] font-semibold text-slate-800 flex justify-between items-center">
                <div className="flex gap-4">
                  <span><strong className="text-slate-900">Code Legend:</strong></span>
                  <span><strong className="font-mono bg-white border border-slate-400 px-1.5">[blank]</strong> = Present</span>
                  <span><strong className="font-mono text-red-700 font-black">x</strong> = Absent</span>
                  <span><strong className="font-mono text-amber-700 font-black">h</strong> = Half-day / Cutting Classes</span>
                </div>
                <div>
                  <strong>No. of School Days:</strong> <span className="font-mono font-black text-red-700 text-xs">{numberOfSchoolDays}</span>
                </div>
              </div>

              <table className="w-full text-[9.5px] border-collapse border border-slate-900 text-center font-sans">
                <thead>
                  <tr className="bg-slate-100 font-bold text-slate-900">
                    <th className="border border-slate-900 p-0.5 w-6" rowSpan={3}>No.</th>
                    <th className="border border-slate-900 p-1 text-left min-w-[210px]" rowSpan={3}>LEARNER'S NAME <br /><span className="text-[8px] font-normal text-slate-600">(Last Name, First Name, Middle Name)</span></th>
                    <th className="border border-slate-900 p-0.5 text-center" colSpan={activeMonthData.days.length}>(1st row for date, 2nd row for Day: M,T,W,TH,F)</th>
                    <th className="border border-slate-900 p-0.5" colSpan={2} rowSpan={2}>Total for the Month</th>
                    <th className="border border-slate-900 p-1 min-w-[140px]" rowSpan={3}>REMARKS (If NLS, state reason. If TRANSFERRED IN/OUT, write school)</th>
                  </tr>
                  
                  <tr className="bg-slate-100 font-bold text-[9px]">
                    {activeMonthData.days.map((dayNum, i) => (
                      <th key={i} className={`border border-slate-900 p-0.5 min-w-[18px] max-w-[20px] ${activeMonthData.isWeekend[i] ? 'bg-slate-300 font-black text-slate-700' : monthInterruptionMap[dayNum] ? 'bg-amber-200 text-amber-900' : 'text-slate-900'}`}>{dayNum}</th>
                    ))}
                  </tr>

                  <tr className="bg-slate-100 font-bold text-[8px]">
                    {activeMonthData.dayOfWeek.map((dayOfWeek, i) => (
                      <th key={i} className={`border border-slate-900 p-0.5 ${activeMonthData.isWeekend[i] ? 'bg-slate-300 font-black text-slate-800' : monthInterruptionMap[activeMonthData.days[i]] ? 'bg-amber-200 text-amber-900' : 'text-slate-800'}`}>{dayOfWeek}</th>
                    ))}
                    <th className="border border-slate-900 p-0.5 w-10 text-red-900 font-black">ABSENT</th>
                    <th className="border border-slate-900 p-0.5 w-10 text-emerald-900 font-black">PRESENT</th>
                  </tr>
                </thead>

                <tbody>
                  {maleList.map((s, idx) => {
                    const stats = calculateStudentStats(s);
                    return (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="border border-slate-900 p-0.5 text-slate-800 font-bold">{idx + 1}</td>
                        <td className="border border-slate-900 p-0.5 text-left font-bold text-slate-900 whitespace-nowrap">
                          {s.lastName}, {s.firstName} {s.middleName || ''}
                        </td>
                        {activeMonthData.days.map((dayNum, dayIdx) => {
                          const isWknd = activeMonthData.isWeekend[dayIdx];
                          const interLabel = monthInterruptionMap[dayNum];

                          if (interLabel) {
                            if (idx === 0) {
                              return (
                                <td 
                                  key={dayIdx} 
                                  rowSpan={maleList.length} 
                                  className="border border-slate-900 bg-amber-100 text-amber-900 font-black text-[9px] p-1 vertical-text-cell select-none">
                                  {interLabel}
                                </td>
                              );
                            }
                            return null;
                          }

                          const monthAtt = s.attendance[selectedMonth] || {};
                          const mark = monthAtt[dayNum] || '';
                          return (
                            <td 
                              key={dayIdx} 
                              onClick={() => toggleAttendanceCell(s.id, dayNum)}
                              className={`border border-slate-900 font-black font-mono select-none text-[10px] cursor-pointer ${isWknd ? 'bg-slate-200 cursor-not-allowed' : mark === 'x' ? 'text-red-700 bg-red-50' : mark === 'h' ? 'text-amber-700 bg-amber-50' : ''}`}>
                              {mark}
                            </td>
                          );
                        })}
                        <td className="border border-slate-900 font-mono font-bold text-red-700">{stats.absent}</td>
                        <td className="border border-slate-900 font-mono font-bold text-slate-900">{stats.present}</td>
                        <td className="border border-slate-900 p-0.5 text-left">
                          <input type="text" value={s.remarks} onChange={(e) => setStudents(prev => prev.map(st => st.id === s.id ? { ...st, remarks: e.target.value } : st))} className="w-full bg-transparent text-[8.5px] focus:outline-none" placeholder="..." />
                        </td>
                      </tr>
                    );
                  })}

                  <tr className="bg-slate-200 font-bold text-slate-900">
                    <td className="border border-slate-900 p-0.5"></td>
                    <td className="border border-slate-900 p-1 text-left font-black text-[9px]">MALE | TOTAL Per Day</td>
                    {maleDailyPresent.map((tot, i) => {
                      const dayNum = activeMonthData.days[i];
                      const isWknd = activeMonthData.isWeekend[i];
                      const isInterrupted = !!monthInterruptionMap[dayNum];
                      return (
                        <td key={i} className={`border border-slate-900 font-mono font-black text-[9px] ${isWknd ? 'bg-slate-300' : isInterrupted ? 'bg-amber-200' : ''}`}>
                          {isWknd || isInterrupted ? '-' : tot}
                        </td>
                      );
                    })}
                    <td className="border border-slate-900 font-mono text-red-700 font-black">
                      {maleList.reduce((acc, s) => acc + (parseFloat(calculateStudentStats(s).absent as string) || 0), 0)}
                    </td>
                    <td className="border border-slate-900 font-mono font-black">{maleTotalDailyPresent}</td>
                    <td className="border border-slate-900"></td>
                  </tr>

                  {femaleList.map((s, idx) => {
                    const stats = calculateStudentStats(s);
                    return (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="border border-slate-900 p-0.5 text-slate-800 font-bold">{idx + 1}</td>
                        <td className="border border-slate-900 p-0.5 text-left font-bold text-slate-900 whitespace-nowrap">
                          {s.lastName}, {s.firstName} {s.middleName || ''}
                        </td>
                        {activeMonthData.days.map((dayNum, dayIdx) => {
                          const isWknd = activeMonthData.isWeekend[dayIdx];
                          const interLabel = monthInterruptionMap[dayNum];

                          if (interLabel) {
                            if (idx === 0) {
                              return (
                                <td 
                                  key={dayIdx} 
                                  rowSpan={femaleList.length} 
                                  className="border border-slate-900 bg-amber-100 text-amber-900 font-black text-[9px] p-1 vertical-text-cell select-none">
                                  {interLabel}
                                </td>
                              );
                            }
                            return null;
                          }

                          const monthAtt = s.attendance[selectedMonth] || {};
                          const mark = monthAtt[dayNum] || '';
                          return (
                            <td 
                              key={dayIdx} 
                              onClick={() => toggleAttendanceCell(s.id, dayNum)}
                              className={`border border-slate-900 font-black font-mono select-none text-[10px] cursor-pointer ${isWknd ? 'bg-slate-200 cursor-not-allowed' : mark === 'x' ? 'text-red-700 bg-red-50' : mark === 'h' ? 'text-amber-700 bg-amber-50' : ''}`}>
                              {mark}
                            </td>
                          );
                        })}
                        <td className="border border-slate-900 font-mono font-bold text-red-700">{stats.absent}</td>
                        <td className="border border-slate-900 font-mono font-bold text-slate-900">{stats.present}</td>
                        <td className="border border-slate-900 p-0.5 text-left">
                          <input type="text" value={s.remarks} onChange={(e) => setStudents(prev => prev.map(st => st.id === s.id ? { ...st, remarks: e.target.value } : st))} className="w-full bg-transparent text-[8.5px] focus:outline-none" placeholder="..." />
                        </td>
                      </tr>
                    );
                  })}

                  <tr className="bg-slate-200 font-bold text-slate-900">
                    <td className="border border-slate-900 p-0.5"></td>
                    <td className="border border-slate-900 p-1 text-left font-black text-[9px]">FEMALE | TOTAL Per Day</td>
                    {femaleDailyPresent.map((tot, i) => {
                      const dayNum = activeMonthData.days[i];
                      const isWknd = activeMonthData.isWeekend[i];
                      const isInterrupted = !!monthInterruptionMap[dayNum];
                      return (
                        <td key={i} className={`border border-slate-900 font-mono font-black text-[9px] ${isWknd ? 'bg-slate-300' : isInterrupted ? 'bg-amber-200' : ''}`}>
                          {isWknd || isInterrupted ? '-' : tot}
                        </td>
                      );
                    })}
                    <td className="border border-slate-900 font-mono text-red-700 font-black">
                      {femaleList.reduce((acc, s) => acc + (parseFloat(calculateStudentStats(s).absent as string) || 0), 0)}
                    </td>
                    <td className="border border-slate-900 font-mono font-black">{femaleTotalDailyPresent}</td>
                    <td className="border border-slate-900"></td>
                  </tr>

                  <tr className="bg-slate-300 font-black text-slate-900 border-t-2 border-slate-900">
                    <td className="border border-slate-900 p-0.5"></td>
                    <td className="border border-slate-900 p-1 text-left font-black text-[9.5px]">Combined TOTAL PER DAY</td>
                    {combinedDailyPresent.map((tot, i) => {
                      const dayNum = activeMonthData.days[i];
                      const isWknd = activeMonthData.isWeekend[i];
                      const isInterrupted = !!monthInterruptionMap[dayNum];
                      return (
                        <td key={i} className={`border border-slate-900 font-mono text-[9.5px] ${isWknd ? 'bg-slate-400' : isInterrupted ? 'bg-amber-300' : ''}`}>
                          {isWknd || isInterrupted ? '-' : tot}
                        </td>
                      );
                    })}
                    <td className="border border-slate-900 font-mono text-red-800">
                      {students.reduce((acc, s) => acc + (parseFloat(calculateStudentStats(s).absent as string) || 0), 0)}
                    </td>
                    <td className="border border-slate-900 font-mono">{combinedTotalDailyPresent}</td>
                    <td className="border border-slate-900"></td>
                  </tr>
                </tbody>
              </table>

            </div>
          </div>
        )}

        {/* ==================== ILAW DLP GENERATOR MODULE ==================== */}
        {activeTab === 'ilaw' && (
          <div className="space-y-6">
            
            {/* TOP CONTROL BAR & DATABASE SELECTOR */}
            <div className={`p-5 rounded-2xl border space-y-4 print:hidden shadow-sm ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <Sparkles className="w-5 h-5 text-red-500" /> DepEd Order No. 016, s. 2026 — Weekly ILAW Daily Lesson Log Generator
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} mt-0.5`}>
                    Full-week 5-session planning, multi-section schedule editor, Word export, database archive with Term & Week tracking, and clean reflection block.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={handleClearDlpForm} className="bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-400 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition">
                    <RotateCcw className="w-4 h-4" /> Clear All DLP Fields
                  </button>

                  <button onClick={() => setShowDbModal(true)} className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition">
                    <Database className="w-4 h-4" /> Open DLP Database Archive ({savedDLPsDatabase.length})
                  </button>

                  <button onClick={handleSaveDLPToDatabase} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition">
                    <Save className="w-4 h-4" /> Save & Sync to WeeLMat
                  </button>
                  
                  <button onClick={handleExportToWord} className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition">
                    <Download className="w-4 h-4" /> Download as Word (.doc)
                  </button>

                  <button onClick={() => window.print()} className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition">
                    <Printer className="w-4 h-4" /> Print DLP
                  </button>
                </div>
              </div>

              {/* DATABASE QUICK DROPDOWN SELECTOR */}
              {savedDLPsDatabase.length > 0 && (
                <div className={`p-3 rounded-xl border flex items-center gap-3 ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                  <Database className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-xs font-bold text-slate-400">Quick Switch DLP:</span>
                  <select 
                    value={selectedSavedDlpId} 
                    onChange={e => handleLoadSavedDLP(e.target.value)}
                    className={`flex-1 p-2 rounded-xl text-xs font-bold border focus:outline-none ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'}`}>
                    <option value="">-- Choose saved weekly plan from database archive --</option>
                    {savedDLPsDatabase.map(rec => (
                      <option key={rec.id} value={rec.id}>
                        [{rec.term || 'Term 2'} • {rec.weekNumber || 'Week 8'}] {rec.subject} • {rec.weekRange} (Saved: {rec.createdAt})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* GENERAL METADATA INPUTS INCL. TERM & WEEK NUMBER */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs font-semibold">
                <div>
                  <label className="block mb-1 text-amber-400 font-bold">School Term</label>
                  <select value={dlpTerm} onChange={e => setDlpTerm(e.target.value)} className={`w-full p-2.5 rounded-xl border font-bold focus:outline-none focus:border-red-500 ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'}`}>
                    <option value="Term 1">Term 1</option>
                    <option value="Term 2">Term 2</option>
                    <option value="Term 3">Term 3</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-amber-400 font-bold">Week Number</label>
                  <select value={dlpWeekNum} onChange={e => setDlpWeekNum(e.target.value)} className={`w-full p-2.5 rounded-xl border font-bold focus:outline-none focus:border-red-500 ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'}`}>
                    {Array.from({ length: 10 }, (_, i) => `Week ${i + 1}`).map(w => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-slate-400">Week Start Date</label>
                  <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className={`w-full p-2.5 rounded-xl border focus:outline-none focus:border-red-500 ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'}`} />
                </div>

                <div>
                  <label className="block mb-1 text-slate-400">Week End Date</label>
                  <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className={`w-full p-2.5 rounded-xl border focus:outline-none focus:border-red-500 ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'}`} />
                </div>

                <div>
                  <label className="block mb-1 text-slate-400">Learning Area / Subject</label>
                  <input type="text" value={dlpSubject} onChange={e => setDlpSubject(e.target.value)} className={`w-full p-2.5 rounded-xl border focus:outline-none focus:border-red-500 ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'}`} />
                </div>
              </div>

              {/* FLEXIBLE SECTION & TIME SCHEDULE EDITOR */}
              <div className={`p-4 rounded-xl border space-y-3 ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Class Sections & Time Schedule Editor:
                  </span>
                  <button onClick={handleAddSchedule} className="bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-bold px-3 py-1 rounded-lg transition flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> Add Class Section
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {classSchedules.map((s) => (
                    <div key={s.id} className={`p-2.5 rounded-xl border flex items-center gap-2 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300'}`}>
                      <input 
                        type="text" 
                        value={s.sectionName} 
                        onChange={e => handleUpdateSchedule(s.id, 'sectionName', e.target.value)}
                        placeholder="Section (e.g. Bloodstone)"
                        className={`w-28 p-1.5 rounded-lg border text-xs font-bold focus:outline-none ${isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'}`}
                      />
                      <input 
                        type="text" 
                        value={s.timeSlot} 
                        onChange={e => handleUpdateSchedule(s.id, 'timeSlot', e.target.value)}
                        placeholder="Time (8:20am-9:10am)"
                        className={`flex-1 p-1.5 rounded-lg border text-xs font-bold focus:outline-none ${isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'}`}
                      />
                      <button onClick={() => handleRemoveSchedule(s.id)} className="text-slate-400 hover:text-red-500 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* MULTI-REFERENCE INPUT */}
              <div>
                <label className="block mb-1 text-xs font-bold text-slate-400">Multiple References & Textbooks (Cross-referencing):</label>
                <textarea rows={2} value={dlpReferences} onChange={e => setDlpReferences(e.target.value)} className={`w-full p-2.5 rounded-xl text-xs font-medium border focus:outline-none ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'}`} />
              </div>

            </div>

            {/* SESSIONS BREAKDOWN EDITOR TABS (SESSION 1 TO 5) */}
            <div className={`p-5 rounded-2xl border space-y-4 print:hidden shadow-sm ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-red-500" /> Weekly Session Breakdown (Session 1 to Session 5):
                </span>

                <button onClick={handleAIParseActiveSession} disabled={isGeneratingDLP} className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 disabled:opacity-50">
                  {isGeneratingDLP ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>Parse Session {activeSessionTab} with Gemini AI</span>
                </button>
              </div>

              {/* TABS 1 - 5 */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {[1, 2, 3, 4, 5].map(sNum => (
                  <button 
                    key={sNum}
                    onClick={() => setActiveSessionTab(sNum)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${activeSessionTab === sNum ? 'bg-red-600 text-white shadow' : isDark ? 'bg-slate-950 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-700 hover:text-slate-900'}`}>
                    <span>Session {sNum}:</span>
                    <span className="max-w-[140px] truncate">{sessionsData[sNum]?.title || 'Untitled Session'}</span>
                  </button>
                ))}
              </div>

              {/* ACTIVE SESSION EDITOR FIELDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold pt-2">
                <div>
                  <label className="block mb-1 text-slate-400">Session {activeSessionTab} Title / Specific Subtopic</label>
                  <input 
                    type="text" 
                    value={sessionsData[activeSessionTab]?.title || ''} 
                    onChange={e => setSessionsData(prev => ({
                      ...prev,
                      [activeSessionTab]: { ...prev[activeSessionTab], title: e.target.value }
                    }))} 
                    placeholder={`e.g. Session ${activeSessionTab} Topic Title...`}
                    className={`w-full p-2.5 rounded-xl border focus:outline-none ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'}`} 
                  />
                </div>

                <div>
                  <label className="block mb-1 text-slate-400">Session {activeSessionTab} PPT Slide Outline Notes</label>
                  <input 
                    type="text" 
                    value={sessionsData[activeSessionTab]?.pptNotes || ''} 
                    onChange={e => setSessionsData(prev => ({
                      ...prev,
                      [activeSessionTab]: { ...prev[activeSessionTab], pptNotes: e.target.value }
                    }))} 
                    placeholder="Slide Deck 2.3: Key concepts and points..."
                    className={`w-full p-2.5 rounded-xl border focus:outline-none ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'}`} 
                  />
                </div>
              </div>
            </div>

            {/* PRINTABLE OFFICIAL ILAW DLP SHEET */}
            <div className="bg-white text-slate-900 p-8 rounded-2xl shadow-xl font-sans print:p-0 print:shadow-none">
              
              {/* HEADER BLOCK */}
              <div className="flex justify-between items-center border-b-2 border-slate-900 pb-3 mb-4">
                <img src="/kagawaran-logo.webp" alt="Kagawaran Logo" className="h-16 w-16 object-contain" onError={handleKagawaranError} />
                <div className="text-center space-y-0.5">
                  <div className="text-[10px] font-bold text-slate-600 uppercase">REPUBLIKA NG PILIPINAS • Republic of the Philippines</div>
                  <div className="text-xs font-bold text-slate-800 uppercase">Department of Education • Negros Island Region • Division of San Carlos City</div>
                  <div className="text-sm font-black text-slate-900 uppercase">BAGONBON NATIONAL HIGH SCHOOL</div>
                  <div className="text-[10px] font-bold text-red-700 uppercase">{dlpTerm.toUpperCase()} • {dlpWeekNum.toUpperCase()}, SY 2026-2027 • {dlpSubject.toUpperCase()}</div>
                  <div className="text-[9px] text-slate-600 italic">(ILAW Framework Based on DepEd Order No. 016, s. 2026: "Guidelines on Lesson Planning and Learning Design")</div>
                </div>
                <img src="/deped-logo.jpg" alt="DepEd Logo" className="h-14 object-contain" onError={handleDepedError} />
              </div>

              {/* METADATA TABLE */}
              <table className="w-full text-xs border-collapse border border-slate-900 text-left mb-4">
                <tbody>
                  <tr>
                    <td className="border border-slate-900 p-1.5 font-bold bg-slate-100 w-32">Name of Lesson</td>
                    <td className="border border-slate-900 p-1.5 font-extrabold text-red-700" colSpan={3}>
                      Session {activeSessionTab}: {currentActiveSessionData.title}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-900 p-1.5 font-bold bg-slate-100">Term & Week</td>
                    <td className="border border-slate-900 p-1.5 font-extrabold text-amber-800">{dlpTerm} • {dlpWeekNum}</td>
                    <td className="border border-slate-900 p-1.5 font-bold bg-slate-100 w-28">Week / Dates</td>
                    <td className="border border-slate-900 p-1.5 font-bold">{formattedLongWeekRange}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-900 p-1.5 font-bold bg-slate-100">Designed by Teacher/s</td>
                    <td className="border border-slate-900 p-1.5 font-bold">{adviserName}, Teacher I</td>
                    <td className="border border-slate-900 p-1.5 font-bold bg-slate-100">Learning Area/s</td>
                    <td className="border border-slate-900 p-1.5 font-bold">{dlpSubject}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-900 p-1.5 font-bold bg-slate-100">No. of Sessions</td>
                    <td className="border border-slate-900 p-1.5 font-bold">5 sessions (50 minutes)</td>
                    <td className="border border-slate-900 p-1.5 font-bold bg-slate-100">Grade Level & Section</td>
                    <td className="border border-slate-900 p-1.5 font-bold">{formattedGradeSectionsString}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-900 p-1.5 font-bold bg-slate-100">Class Schedule</td>
                    <td className="border border-slate-900 p-1.5 text-[11px]" colSpan={3}>{formattedClassScheduleString}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-900 p-1.5 font-bold bg-slate-100">References</td>
                    <td className="border border-slate-900 p-1.5 text-[11px]" colSpan={3}>{dlpReferences}</td>
                  </tr>
                </tbody>
              </table>

              {/* ILAW SECTION 1: INTENTIONS */}
              <div className="border border-slate-900 mb-4">
                <div className="bg-slate-200 font-black text-xs p-1.5 border-b border-slate-900 uppercase tracking-wide text-slate-900">
                  I. INTENTIONS (Layunin at Konteksto)
                </div>
                <div className="p-3 text-xs space-y-2.5">
                  <div>
                    <span className="font-bold text-slate-900">Learning Competency: </span>
                    <input 
                      type="text" 
                      value={currentActiveSessionData.competency} 
                      onChange={e => setSessionsData(prev => ({
                        ...prev,
                        [activeSessionTab]: { ...prev[activeSessionTab], competency: e.target.value }
                      }))} 
                      className="w-full bg-slate-50 border border-slate-300 p-1 rounded font-medium focus:outline-none" 
                    />
                  </div>

                  <div>
                    <span className="font-bold text-slate-900">Learning Objectives (Sa pagtatapos ng 50-minutong aralin):</span>
                    <div className="pl-3 space-y-1 mt-1">
                      <div className="flex gap-2 items-center">
                        <span className="font-bold text-amber-800 w-20">Kaalaman:</span>
                        <input 
                          type="text" 
                          value={currentActiveSessionData.objKnowledge} 
                          onChange={e => setSessionsData(prev => ({
                            ...prev,
                            [activeSessionTab]: { ...prev[activeSessionTab], objKnowledge: e.target.value }
                          }))} 
                          className="flex-1 bg-slate-50 border border-slate-300 p-1 rounded focus:outline-none" 
                        />
                      </div>
                      <div className="flex gap-2 items-center">
                        <span className="font-bold text-blue-800 w-20">Kasanayan:</span>
                        <input 
                          type="text" 
                          value={currentActiveSessionData.objSkills} 
                          onChange={e => setSessionsData(prev => ({
                            ...prev,
                            [activeSessionTab]: { ...prev[activeSessionTab], objSkills: e.target.value }
                          }))} 
                          className="flex-1 bg-slate-50 border border-slate-300 p-1 rounded focus:outline-none" 
                        />
                      </div>
                      <div className="flex gap-2 items-center">
                        <span className="font-bold text-emerald-800 w-20">Saloobin:</span>
                        <input 
                          type="text" 
                          value={currentActiveSessionData.objAttitude} 
                          onChange={e => setSessionsData(prev => ({
                            ...prev,
                            [activeSessionTab]: { ...prev[activeSessionTab], objAttitude: e.target.value }
                          }))} 
                          className="flex-1 bg-slate-50 border border-slate-300 p-1 rounded focus:outline-none" 
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="font-bold text-slate-900">Learner Context: </span>
                    <textarea 
                      rows={2} 
                      value={currentActiveSessionData.learnerContext} 
                      onChange={e => setSessionsData(prev => ({
                        ...prev,
                        [activeSessionTab]: { ...prev[activeSessionTab], learnerContext: e.target.value }
                      }))} 
                      className="w-full bg-slate-50 border border-slate-300 p-1 rounded mt-1 focus:outline-none" 
                    />
                  </div>
                </div>
              </div>

              {/* ILAW SECTION 2: LEARNING EXPERIENCE */}
              <div className="border border-slate-900 mb-4">
                <div className="bg-slate-200 font-black text-xs p-1.5 border-b border-slate-900 uppercase tracking-wide text-slate-900">
                  II. LEARNING EXPERIENCE (Gawain at Pamamaraan)
                </div>
                <div className="p-3 text-xs space-y-3">
                  <div>
                    <span className="font-bold text-slate-900">Pre-Lesson (Pagganyak - 5 minuto):</span>
                    <textarea 
                      rows={2} 
                      value={currentActiveSessionData.preLessonHook} 
                      onChange={e => setSessionsData(prev => ({
                        ...prev,
                        [activeSessionTab]: { ...prev[activeSessionTab], preLessonHook: e.target.value }
                      }))} 
                      className="w-full bg-slate-50 border border-slate-300 p-1 rounded mt-1 focus:outline-none" 
                    />
                  </div>

                  <div>
                    <span className="font-bold text-slate-900">A. Direct Instruction (20 minuto):</span>
                    <textarea 
                      rows={3} 
                      value={currentActiveSessionData.directInstruction} 
                      onChange={e => setSessionsData(prev => ({
                        ...prev,
                        [activeSessionTab]: { ...prev[activeSessionTab], directInstruction: e.target.value }
                      }))} 
                      className="w-full bg-slate-50 border border-slate-300 p-1 rounded mt-1 focus:outline-none" 
                    />
                  </div>

                  <div>
                    <span className="font-bold text-slate-900">B. Group Activity (20 minuto):</span>
                    <textarea 
                      rows={2} 
                      value={currentActiveSessionData.groupActivity} 
                      onChange={e => setSessionsData(prev => ({
                        ...prev,
                        [activeSessionTab]: { ...prev[activeSessionTab], groupActivity: e.target.value }
                      }))} 
                      className="w-full bg-slate-50 border border-slate-300 p-1 rounded mt-1 focus:outline-none" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="font-bold text-slate-900">C. Application & Synthesis (10 minuto):</span>
                      <textarea 
                        rows={2} 
                        value={currentActiveSessionData.synthesis} 
                        onChange={e => setSessionsData(prev => ({
                          ...prev,
                          [activeSessionTab]: { ...prev[activeSessionTab], synthesis: e.target.value }
                        }))} 
                        className="w-full bg-slate-50 border border-slate-300 p-1 rounded mt-1 focus:outline-none" 
                      />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900">D. Concluding Activity (5 minuto):</span>
                      <textarea 
                        rows={2} 
                        value={currentActiveSessionData.concludingActivity} 
                        onChange={e => setSessionsData(prev => ({
                          ...prev,
                          [activeSessionTab]: { ...prev[activeSessionTab], concludingActivity: e.target.value }
                        }))} 
                        className="w-full bg-slate-50 border border-slate-300 p-1 rounded mt-1 focus:outline-none" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ILAW SECTION 3: RESOURCES & INTEGRATION */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="border border-slate-900">
                  <div className="bg-slate-200 font-black text-xs p-1.5 border-b border-slate-900 uppercase tracking-wide text-slate-900">
                    III. LEARNING RESOURCES
                  </div>
                  <div className="p-2.5 text-xs">
                    <textarea 
                      rows={3} 
                      value={currentActiveSessionData.resources} 
                      onChange={e => setSessionsData(prev => ({
                        ...prev,
                        [activeSessionTab]: { ...prev[activeSessionTab], resources: e.target.value }
                      }))} 
                      className="w-full bg-slate-50 border border-slate-300 p-1 rounded focus:outline-none" 
                    />
                  </div>
                </div>

                <div className="border border-slate-900">
                  <div className="bg-slate-200 font-black text-xs p-1.5 border-b border-slate-900 uppercase tracking-wide text-slate-900">
                    IV. OPPORTUNITIES FOR INTEGRATION
                  </div>
                  <div className="p-2.5 text-xs">
                    <textarea 
                      rows={3} 
                      value={currentActiveSessionData.integration} 
                      onChange={e => setSessionsData(prev => ({
                        ...prev,
                        [activeSessionTab]: { ...prev[activeSessionTab], integration: e.target.value }
                      }))} 
                      className="w-full bg-slate-50 border border-slate-300 p-1 rounded focus:outline-none" 
                    />
                  </div>
                </div>
              </div>

              {/* ILAW SECTION 5: ASSESSMENT & WAYS FORWARD */}
              <div className="border border-slate-900 mb-4">
                <div className="bg-slate-200 font-black text-xs p-1.5 border-b border-slate-900 uppercase tracking-wide text-slate-900">
                  V. ASSESSMENT & WAYS FORWARD
                </div>
                <div className="p-3 text-xs space-y-2.5">
                  <div>
                    <span className="font-bold text-slate-900">Formative Assessment & Evidence:</span>
                    <textarea 
                      rows={2} 
                      value={currentActiveSessionData.assessment} 
                      onChange={e => setSessionsData(prev => ({
                        ...prev,
                        [activeSessionTab]: { ...prev[activeSessionTab], assessment: e.target.value }
                      }))} 
                      className="w-full bg-slate-50 border border-slate-300 p-1 rounded mt-1 focus:outline-none" 
                    />
                  </div>

                  <div>
                    <span className="font-bold text-slate-900">Extended Learning Opportunities:</span>
                    <input 
                      type="text" 
                      value={currentActiveSessionData.extendedLearning} 
                      onChange={e => setSessionsData(prev => ({
                        ...prev,
                        [activeSessionTab]: { ...prev[activeSessionTab], extendedLearning: e.target.value }
                      }))} 
                      className="w-full bg-slate-50 border border-slate-300 p-1 rounded mt-1 focus:outline-none" 
                    />
                  </div>
                </div>
              </div>

              {/* ILAW SECTION 6: SINGLE CLEAN OPEN TEXT AREA FOR REFLECTION */}
              <div className="border border-slate-900 mb-6">
                <div className="bg-slate-200 font-black text-xs p-1.5 border-b border-slate-900 uppercase tracking-wide text-slate-900 flex justify-between items-center">
                  <span>VI. REFLECTION (PAGNINILAY)</span>
                  <span className="text-[9px] font-normal italic text-slate-600 print:hidden">(Clean space for post-lesson notes or custom entries)</span>
                </div>

                <div className="p-2">
                  <textarea 
                    rows={4}
                    value={currentActiveSessionData.reflectionText || ''} 
                    onChange={e => setSessionsData(prev => ({
                      ...prev,
                      [activeSessionTab]: { ...prev[activeSessionTab], reflectionText: e.target.value }
                    }))}
                    className="w-full bg-transparent focus:outline-none text-xs text-slate-900 font-medium resize-y" 
                    placeholder=""
                  />
                </div>
              </div>

              {/* SIGNATURE BLOCK */}
              <div className="grid grid-cols-2 gap-8 pt-4 text-xs font-semibold">
                <div className="text-center">
                  <div className="text-slate-600 mb-1 text-center">Prepared by:</div>
                  <div className="pt-8 pb-1 border-b border-slate-900 font-extrabold uppercase text-center">{adviserName}</div>
                  <div className="text-slate-600 text-[10px] text-center">Teacher I</div>
                </div>

                <div className="text-center">
                  <div className="text-slate-600 mb-1 text-center">Reviewed and checked by:</div>
                  <div className="pt-8 pb-1 border-b border-slate-900 font-extrabold uppercase text-center">{schoolHeadName}</div>
                  <div className="text-slate-600 text-[10px] text-center">School Principal I</div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* DLP DATABASE ARCHIVE MODAL */}
        {showDbModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className={`w-full max-w-3xl p-6 rounded-2xl border shadow-2xl space-y-4 max-h-[85vh] flex flex-col ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold flex items-center gap-2"><Database className="w-5 h-5 text-purple-400" /> Saved Weekly DLPs Database Archive</h3>
                <button onClick={() => setShowDbModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input 
                  type="text" 
                  value={dbSearchTerm} 
                  onChange={e => setDbSearchTerm(e.target.value)} 
                  placeholder="Search saved plans by term, week, subject, or lesson title..." 
                  className={`w-full pl-9 pr-4 py-2 rounded-xl border text-xs focus:outline-none ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'}`} 
                />
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {filteredDatabaseRecords.length === 0 ? (
                  <p className="text-xs text-slate-500 italic text-center py-8">No saved DLP records found in database.</p>
                ) : (
                  filteredDatabaseRecords.map(rec => (
                    <div key={rec.id} className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isDark ? 'bg-slate-950/80 border-slate-800 hover:border-purple-500/40' : 'bg-slate-50 border-slate-200'}`}>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-red-500">{rec.subject}</span>
                          <span className="text-xs font-black px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            {rec.term || 'Term 2'} • {rec.weekNumber || 'Week 8'}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-300 text-slate-600'}`}>
                            {rec.weekRange}
                          </span>
                        </div>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          <strong>Sessions:</strong> {Object.values(rec.sessions).map(s => `Session ${s.sessionNum}: ${s.title}`).join(' • ')}
                        </p>
                        <p className="text-[10px] text-slate-500">Saved Date: {rec.createdAt}</p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={() => handleLoadSavedDLP(rec.id)} className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Load Plan
                        </button>
                        <button onClick={() => handleDeleteSavedDLP(rec.id, `${rec.subject} (${rec.term} ${rec.weekNumber})`)} className="p-1.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 flex justify-end border-t border-slate-800">
                <button onClick={() => setShowDbModal(false)} className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-5 py-2 rounded-xl transition">Close</button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== WEELMAT GENERATOR MODULE ==================== */}
        {activeTab === 'weelmat' && (
          <div className="space-y-6">
            
            {/* WEELMAT TOP CONTROL PANEL */}
            <div className={`p-5 rounded-2xl border space-y-4 print:hidden shadow-sm ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <BookOpen className="w-5 h-5 text-red-500" /> Weekly Learning Matrix (WeeLMat) Generator
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} mt-0.5`}>
                    Auto-generated 5-day Weekly Learning Matrix mapped directly from your saved ILAW DLP plans.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={handleClearWeelmatView} className="bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-400 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition">
                    <RotateCcw className="w-4 h-4" /> Clear WeeLMat View
                  </button>

                  <button onClick={handleExportWeelmatToWord} className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition">
                    <Download className="w-4 h-4" /> Export WeeLMat (.doc)
                  </button>

                  <button onClick={() => window.print()} className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition">
                    <Printer className="w-4 h-4" /> Print WeeLMat
                  </button>
                </div>
              </div>

              {/* AUTOMATIC DLP RECORD SELECTOR DROPDOWN */}
              <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center gap-3 ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 flex-shrink-0">
                  <Sparkles className="w-4 h-4" />
                  <span>Select Saved Weekly DLP to Link:</span>
                </div>

                <select 
                  value={selectedWeelmatDlpId} 
                  onChange={e => setSelectedWeelmatDlpId(e.target.value)}
                  className={`flex-1 p-2 rounded-xl text-xs font-bold border focus:outline-none ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'}`}>
                  <option value="">-- Clear / Blank View --</option>
                  {savedDLPsDatabase.map(rec => (
                    <option key={rec.id} value={rec.id}>
                      [{rec.term || 'Term 2'} • {rec.weekNumber || 'Week 8'}] {rec.subject} — {rec.weekRange} ({rec.schedules.map(s => s.sectionName).join(', ')})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* PRINTABLE OFFICIAL WEELMAT TEMPLATE SHEET */}
            <div className="bg-white text-slate-900 p-8 rounded-2xl shadow-xl font-sans print:p-0 print:shadow-none overflow-x-auto">
              
              {/* WEELMAT HEADER WITH LOGOS */}
              <div className="flex justify-between items-center border-b-2 border-slate-900 pb-3 mb-4">
                <img src="/kagawaran-logo.webp" alt="Kagawaran Logo" className="h-16 w-16 object-contain" onError={handleKagawaranError} />
                <div className="text-center space-y-0.5">
                  <div className="text-[10px] font-bold text-slate-600 uppercase">REPUBLIKA NG PILIPINAS • Republic of the Philippines</div>
                  <div className="text-xs font-bold text-slate-800 uppercase">Department of Education • Negros Island Region • Division of San Carlos City</div>
                  <div className="text-sm font-black text-slate-900 uppercase">BAGONBON NATIONAL HIGH SCHOOL</div>
                  <div className="text-sm font-black text-slate-900 uppercase tracking-wider mt-1">Weekly Learning Matrix (WeelMat)</div>
                </div>
                <img src="/deped-logo.jpg" alt="DepEd Logo" className="h-14 object-contain" onError={handleDepedError} />
              </div>

              {/* WEELMAT METADATA TABLE */}
              <table className="w-full text-xs border-collapse border border-slate-900 text-left mb-4">
                <thead>
                  <tr className="bg-slate-100 text-center font-bold">
                    <th className="border border-slate-900 p-2 w-1/3">Subject Area</th>
                    <th className="border border-slate-900 p-2 w-16">Grade Level</th>
                    <th className="border border-slate-900 p-2 w-1/3">Section</th>
                    <th className="border border-slate-900 p-2">Covered Dates</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="font-bold">
                    <td className="border border-slate-900 p-2.5 text-slate-900">{activeWeelmatRecord.subject}</td>
                    <td className="border border-slate-900 p-2.5 text-center">11</td>
                    <td className="border border-slate-900 p-2.5">{activeWeelmatRecord.schedules.map(s => s.sectionName.replace('11-', '')).join(', ')}</td>
                    <td className="border border-slate-900 p-2.5">{activeWeelmatRecord.weekRange}</td>
                  </tr>
                </tbody>
              </table>

              {/* WEELMAT 5-DAY MATRIX TABLE */}
              <table className="w-full text-xs border-collapse border border-slate-900 text-left mb-4">
                <thead>
                  <tr className="bg-slate-100 font-bold text-center">
                    <th className="border border-slate-900 p-2 w-1/5">Monday</th>
                    <th className="border border-slate-900 p-2 w-1/5">Tuesday</th>
                    <th className="border border-slate-900 p-2 w-1/5">Wednesday</th>
                    <th className="border border-slate-900 p-2 w-1/5">Thursday</th>
                    <th className="border border-slate-900 p-2 w-1/5">Friday</th>
                  </tr>
                </thead>
                <tbody>
                  
                  {/* LESSON TITLE */}
                  <tr>
                    <td colSpan={5} className="border border-slate-900 p-1.5 font-bold bg-slate-200 text-slate-900 uppercase">Lesson Title</td>
                  </tr>
                  <tr>
                    {[1, 2, 3, 4, 5].map(sNum => (
                      <td key={sNum} className="border border-slate-900 p-2 font-bold text-slate-800 vertical-top">
                        {activeWeelmatRecord.sessions[sNum]?.title || ''}
                      </td>
                    ))}
                  </tr>

                  {/* COMPETENCY */}
                  <tr>
                    <td colSpan={5} className="border border-slate-900 p-1.5 font-bold bg-slate-200 text-slate-900 uppercase">Competency</td>
                  </tr>
                  <tr>
                    {[1, 2, 3, 4, 5].map(sNum => (
                      <td key={sNum} className="border border-slate-900 p-2 text-[11px] text-slate-800 leading-relaxed vertical-top">
                        {activeWeelmatRecord.sessions[sNum]?.competency || ''}
                      </td>
                    ))}
                  </tr>

                  {/* SUGGESTED LEARNING MATERIAL / REFERENCE */}
                  <tr>
                    <td colSpan={5} className="border border-slate-900 p-1.5 font-bold bg-slate-200 text-slate-900 uppercase">Suggested Learning Material / Reference</td>
                  </tr>
                  <tr>
                    {[1, 2, 3, 4, 5].map(sNum => (
                      <td key={sNum} className="border border-slate-900 p-2 text-[10.5px] text-slate-800 whitespace-pre-line leading-relaxed vertical-top">
                        {activeWeelmatRecord.sessions[sNum]?.resources || ''}
                      </td>
                    ))}
                  </tr>

                  {/* LEARNING ACTIVITIES */}
                  <tr>
                    <td colSpan={5} className="border border-slate-900 p-1.5 font-bold bg-slate-200 text-slate-900 uppercase">Learning Activities</td>
                  </tr>
                  <tr>
                    {[1, 2, 3, 4, 5].map(sNum => {
                      const sess = activeWeelmatRecord.sessions[sNum];
                      return (
                        <td key={sNum} className="border border-slate-900 p-2 text-[10.5px] text-slate-800 space-y-1.5 vertical-top">
                          {sess?.preLessonHook && <div>{sess.preLessonHook}</div>}
                          {sess?.directInstruction && <div>{sess.directInstruction}</div>}
                          {sess?.groupActivity && <div>{sess.groupActivity}</div>}
                          {sess?.concludingActivity && <div>{sess.concludingActivity}</div>}
                        </td>
                      );
                    })}
                  </tr>

                </tbody>
              </table>

              <div className="text-[11px] italic font-semibold text-slate-700 mb-8">
                Note: Ipakita ang natapos na gawa sa magulang para sa pirma bilang ebidensya ng pagsasagawa.
              </div>

              {/* WEELMAT SIGNATURE BLOCK */}
              <div className="grid grid-cols-2 gap-8 text-xs font-semibold">
                <div className="text-center">
                  <div className="text-slate-600 mb-1 text-center">Prepared by:</div>
                  <div className="pt-8 pb-1 border-b border-slate-900 font-extrabold uppercase text-center">{adviserName}</div>
                  <div className="text-slate-600 text-[10px] text-center">Teacher I</div>
                </div>

                <div className="text-center">
                  <div className="text-slate-600 mb-1 text-center">Reviewed and checked by:</div>
                  <div className="pt-8 pb-1 border-b border-slate-900 font-extrabold uppercase text-center">{schoolHeadName}</div>
                  <div className="text-slate-600 text-[10px] text-center">School Principal I</div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* SIS MODULE */}
        {activeTab === 'sis' && (
          <div className={`p-6 rounded-2xl border space-y-6 shadow-sm ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <Users className="w-5 h-5 text-red-500" /> Student Information System (SIS) Control Panel
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} mt-0.5`}>Enrolled roster, add/delete learners, view passwords, grade matrix, and term summary overview.</p>
              </div>

              {sisTab === 'roster' && (
                <button onClick={() => setShowAddModal(true)} className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm transition">
                  <UserPlus className="w-4 h-4" /> Add Enrolled Learner
                </button>
              )}
            </div>

            <div className={`flex border-b ${isDark ? 'border-slate-800' : 'border-slate-200'} space-x-1 overflow-x-auto`}>
              <button onClick={() => setSisTab('roster')} className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition flex items-center gap-2 whitespace-nowrap ${sisTab === 'roster' ? 'bg-red-600 text-white' : isDark ? 'bg-slate-950/60 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'}`}>
                <UserCheck className="w-3.5 h-3.5" /> Enrolled Roster ({students.length})
              </button>
              <button onClick={() => setSisTab('subject_grades')} className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition flex items-center gap-2 whitespace-nowrap ${sisTab === 'subject_grades' ? 'bg-red-600 text-white' : isDark ? 'bg-slate-950/60 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'}`}>
                <BookMarked className="w-3.5 h-3.5 text-amber-400" /> Grade Entry Matrix
              </button>
              <button onClick={() => setSisTab('class_summary')} className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition flex items-center gap-2 whitespace-nowrap ${sisTab === 'class_summary' ? 'bg-red-600 text-white' : isDark ? 'bg-slate-950/60 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'}`}>
                <Table className="w-3.5 h-3.5 text-blue-400" /> All Learners Term Summary
              </button>
              <button onClick={() => setSisTab('gradeslip_preview')} className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition flex items-center gap-2 whitespace-nowrap ${sisTab === 'gradeslip_preview' ? 'bg-red-600 text-white' : isDark ? 'bg-slate-950/60 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'}`}>
                <Award className="w-3.5 h-3.5 text-emerald-400" /> Grade Slip Printer (Batch)
              </button>
            </div>

            {/* TAB 1: ROSTER */}
            {sisTab === 'roster' && (
              <div className={`overflow-x-auto rounded-2xl border ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <table className="w-full text-left text-xs">
                  <thead className={`uppercase text-[10px] tracking-wider border-b ${isDark ? 'bg-slate-950 text-slate-400 border-slate-800' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">Learner Full Name (Click to Open Dashboard)</th>
                      <th className="p-3">LRN</th>
                      <th className="p-3">Gender</th>
                      <th className="p-3">Student Created Password</th>
                      <th className="p-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-slate-800/60 bg-slate-900/40 text-slate-300' : 'divide-slate-200 bg-white text-slate-700'}`}>
                    {students.map((s, idx) => {
                      const pass = studentRegistry[s.lrn]?.password || 'Not Set Yet';
                      const isVisible = visiblePasswords[s.lrn];

                      return (
                        <tr key={s.id} className={`transition cursor-pointer ${isDark ? 'hover:bg-slate-800/60' : 'hover:bg-slate-100'}`}>
                          <td className="p-3 font-mono text-slate-400 text-[11px]">{idx + 1}</td>
                          <td onClick={() => handleSelectStudentAndOpenDashboard(s.id)} className={`p-3 font-bold hover:underline ${isDark ? 'text-white hover:text-red-400' : 'text-slate-900 hover:text-red-600'}`}>
                            {s.lastName}, {s.firstName} {s.middleName || ''}
                          </td>
                          <td onClick={() => handleSelectStudentAndOpenDashboard(s.id)} className="p-3 font-mono text-slate-400">{s.lrn}</td>
                          <td onClick={() => handleSelectStudentAndOpenDashboard(s.id)} className="p-3 font-bold">{s.gender}</td>
                          <td className="p-3 font-mono text-amber-500 font-semibold">
                            <div className="flex items-center gap-2">
                              <span>{isVisible ? pass : pass === 'Not Set Yet' ? pass : '••••••••'}</span>
                              {pass !== 'Not Set Yet' && (
                                <button onClick={() => togglePasswordVisibility(s.lrn)} className="text-slate-400 hover:text-slate-600">
                                  {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <button onClick={(e) => { e.stopPropagation(); handleDeleteStudent(s.id, `${s.firstName} ${s.lastName}`); }} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition" title="Delete Student">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 2: GRADE ENTRY MATRIX */}
            {sisTab === 'subject_grades' && (
              <div className="space-y-6">
                <div className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                  <div className="flex items-center gap-3">
                    <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Select Learner:</label>
                    <select value={selectedStudentId} onChange={e => setSelectedStudentId(e.target.value)} className={`px-3.5 py-2 rounded-xl text-xs font-bold border focus:outline-none focus:ring-2 focus:ring-red-500/50 ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}>
                      {students.map(s => (
                        <option key={s.id} value={s.id}>{s.lastName}, {s.firstName} ({s.gender}) — LRN: {s.lrn}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-3">
                    <button onClick={() => setShowPresetManager(true)} className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border transition ${isDark ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800' : 'bg-white border-slate-300 text-amber-600 hover:bg-slate-50'}`}>
                      <Settings className="w-3.5 h-3.5" /> Preset Library ({electivePresets.length})
                    </button>

                    <div className={`flex items-center gap-3 text-xs px-4 py-2 rounded-xl border ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-300'}`}>
                      <span className={isDark ? 'text-slate-400 font-semibold' : 'text-slate-600 font-semibold'}>General Average:</span>
                      <span className={`font-black text-base font-mono ${parseFloat(calculateFinalAverage(selectedStudent)) >= 75 ? 'text-amber-500' : 'text-slate-400'}`}>
                        {calculateFinalAverage(selectedStudent)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`border rounded-2xl p-6 space-y-6 shadow-md transition-all ${isDark ? 'bg-slate-950/70 border-slate-800/80' : 'bg-white border-slate-200'}`}>
                  <div className={`flex justify-between items-center border-b pb-4 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                    <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      <BookMarked className="w-4 h-4 text-red-500" /> Grade Input Sheet — <span className="text-red-500 font-extrabold">{selectedStudent?.lastName}, {selectedStudent?.firstName}</span>
                    </h4>
                    <span className={`text-[10px] font-semibold px-3 py-1 rounded-full border ${isDark ? 'bg-slate-900 text-slate-400 border-slate-800' : 'bg-slate-100 text-slate-600 border-slate-300'}`}>
                      Auto-saves locally
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse font-sans">
                      <thead className={`uppercase text-[10px] tracking-wider border-b ${isDark ? 'bg-slate-950/90 text-slate-400 border-slate-800' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        <tr>
                          <th className="p-3.5 min-w-[320px]">Subject Title</th>
                          <th className="p-3.5 text-center min-w-[100px]">Term 1</th>
                          <th className="p-3.5 text-center min-w-[100px]">Term 2</th>
                          <th className="p-3.5 text-center min-w-[100px]">Term 3</th>
                          <th className="p-3.5 text-center min-w-[110px]">Final Rating</th>
                          <th className="p-3.5 text-center min-w-[110px]">Remarks</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${isDark ? 'divide-slate-800/50 text-slate-300' : 'divide-slate-200 text-slate-700'}`}>
                        <tr className={`font-bold text-[10px] ${isDark ? 'bg-slate-900/90' : 'bg-slate-100'}`}>
                          <td colSpan={6} className="px-3.5 py-2 uppercase tracking-wider text-red-500 font-extrabold">Core Subjects (1 to 6)</td>
                        </tr>

                        {CORE_SUBJECTS.map((sub, index) => {
                          const g = selectedStudent?.subjectGrades[sub] || { term1: 0, term2: 0, term3: 0 };
                          const validTerms = [g.term1, g.term2, g.term3].filter(v => v > 0);
                          const finalRating = validTerms.length > 0 ? (validTerms.reduce((a, b) => a + b, 0) / validTerms.length).toFixed(1) : '-';
                          const isPassed = finalRating !== '-' && parseFloat(finalRating) >= 75;

                          return (
                            <tr key={sub} className={`transition-colors ${isDark ? 'hover:bg-slate-900/50' : 'hover:bg-slate-50'}`}>
                              <td className={`p-3.5 font-semibold flex items-center gap-2.5 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                                <span className="text-slate-500 font-mono text-[11px]">{index + 1}.</span> {sub}
                              </td>
                              <td className="p-2 text-center">
                                <input type="number" min="50" max="100" value={g.term1 || ''} onChange={e => handleGradeChange(selectedStudent.id, sub, 'term1', parseFloat(e.target.value) || 0)} placeholder="0" className={`w-16 border text-center font-mono py-1.5 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-red-500/50 transition ${isDark ? 'bg-slate-950 border-slate-800 text-amber-400 focus:border-red-500' : 'bg-slate-100 border-slate-300 text-amber-600 focus:border-red-500'}`} />
                              </td>
                              <td className="p-2 text-center">
                                <input type="number" min="50" max="100" value={g.term2 || ''} onChange={e => handleGradeChange(selectedStudent.id, sub, 'term2', parseFloat(e.target.value) || 0)} placeholder="0" className={`w-16 border text-center font-mono py-1.5 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-red-500/50 transition ${isDark ? 'bg-slate-950 border-slate-800 text-amber-400 focus:border-red-500' : 'bg-slate-100 border-slate-300 text-amber-600 focus:border-red-500'}`} />
                              </td>
                              <td className="p-2 text-center">
                                <input type="number" min="50" max="100" value={g.term3 || ''} onChange={e => handleGradeChange(selectedStudent.id, sub, 'term3', parseFloat(e.target.value) || 0)} placeholder="0" className={`w-16 border text-center font-mono py-1.5 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-red-500/50 transition ${isDark ? 'bg-slate-950 border-slate-800 text-amber-400 focus:border-red-500' : 'bg-slate-100 border-slate-300 text-amber-600 focus:border-red-500'}`} />
                              </td>
                              <td className={`p-3.5 text-center font-mono font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{finalRating}</td>
                              <td className="p-3.5 text-center">
                                {finalRating !== '-' && (
                                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${isPassed ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-500 border border-red-500/30'}`}>
                                    {isPassed ? 'PASSED' : 'FAILED'}
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}

                        <tr className={`font-bold text-[10px] ${isDark ? 'bg-slate-900/90' : 'bg-slate-100'}`}>
                          <td colSpan={6} className="px-3.5 py-2 uppercase tracking-wider text-amber-500 font-extrabold flex items-center justify-between">
                            <span className="flex items-center gap-1.5"><BookmarkCheck className="w-3.5 h-3.5" /> Term Electives (7 to 9)</span>
                          </td>
                        </tr>

                        {(['term1', 'term2', 'term3'] as const).map((tKey, elIdx) => {
                          const el = selectedStudent?.termElectives[tKey] || { name: '', grade: 0 };
                          const isPassed = el.grade >= 75;

                          return (
                            <tr key={tKey} className={`transition-colors ${isDark ? 'hover:bg-slate-900/50' : 'hover:bg-slate-50'}`}>
                              <td className="p-2.5 font-semibold">
                                <div className="flex flex-col gap-1.5">
                                  <div className="flex items-center gap-2">
                                    <span className="text-slate-500 font-mono text-[11px]">{elIdx + 7}.</span>
                                    
                                    <input 
                                      type="text" 
                                      autoComplete="off"
                                      value={el.name} 
                                      onChange={e => handleElectiveChange(selectedStudent.id, tKey, 'name', e.target.value)}
                                      onKeyDown={e => { if (e.key === 'Enter') saveElectivePreset(el.name); }}
                                      placeholder={`Elective Title (${tKey.toUpperCase()})`} 
                                      className={`flex-1 border px-3 py-1.5 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition ${isDark ? 'bg-slate-950 border-slate-800 text-slate-100 focus:border-amber-500' : 'bg-slate-100 border-slate-300 text-slate-800 focus:border-amber-500'}`} 
                                    />

                                    <button 
                                      type="button"
                                      onClick={() => saveElectivePreset(el.name)}
                                      title="Save current title to preset library"
                                      className={`p-1.5 rounded-xl border text-[10px] font-bold flex items-center gap-1 transition ${isDark ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-amber-500/20' : 'bg-white border-slate-300 text-amber-600 hover:bg-amber-50'}`}>
                                      <Plus className="w-3.5 h-3.5" /> Save
                                    </button>
                                  </div>

                                  {electivePresets.length > 0 && (
                                    <div className="pl-6 flex items-center gap-2">
                                      <span className="text-[10px] text-slate-500 font-semibold">Quick Select:</span>
                                      <select 
                                        value={electivePresets.includes(el.name) ? el.name : ''} 
                                        onChange={e => { if (e.target.value) handleElectiveChange(selectedStudent.id, tKey, 'name', e.target.value); }}
                                        className={`px-2 py-0.5 rounded-lg border text-[11px] focus:outline-none ${isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-700'}`}>
                                        <option value="">-- Select Saved Preset --</option>
                                        {electivePresets.map((pr, pIdx) => (
                                          <option key={pIdx} value={pr}>{pr}</option>
                                        ))}
                                      </select>

                                      {electivePresets.includes(el.name) && (
                                        <button 
                                          type="button"
                                          onClick={() => handlePresetDelete(el.name)}
                                          title={`Delete "${el.name}" preset from library`}
                                          className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition flex items-center gap-1 text-[10px]">
                                          <Trash2 className="w-3.5 h-3.5" /> Delete Preset
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </td>

                              <td className="p-2 text-center">
                                {tKey === 'term1' ? (
                                  <input type="number" min="50" max="100" value={el.grade || ''} onChange={e => handleElectiveChange(selectedStudent.id, 'term1', 'grade', parseFloat(e.target.value) || 0)} placeholder="0" className={`w-16 border text-center font-mono py-1.5 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition ${isDark ? 'bg-slate-950 border-slate-800 text-amber-400 focus:border-amber-500' : 'bg-slate-100 border-slate-300 text-amber-600 focus:border-amber-500'}`} />
                                ) : <span className="text-slate-600 font-mono">-</span>}
                              </td>

                              <td className="p-2 text-center">
                                {tKey === 'term2' ? (
                                  <input type="number" min="50" max="100" value={el.grade || ''} onChange={e => handleElectiveChange(selectedStudent.id, 'term2', 'grade', parseFloat(e.target.value) || 0)} placeholder="0" className={`w-16 border text-center font-mono py-1.5 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition ${isDark ? 'bg-slate-950 border-slate-800 text-amber-400 focus:border-amber-500' : 'bg-slate-100 border-slate-300 text-amber-600 focus:border-amber-500'}`} />
                                ) : <span className="text-slate-600 font-mono">-</span>}
                              </td>

                              <td className="p-2 text-center">
                                {tKey === 'term3' ? (
                                  <input type="number" min="50" max="100" value={el.grade || ''} onChange={e => handleElectiveChange(selectedStudent.id, 'term3', 'grade', parseFloat(e.target.value) || 0)} placeholder="0" className={`w-16 border text-center font-mono py-1.5 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition ${isDark ? 'bg-slate-950 border-slate-800 text-amber-400 focus:border-amber-500' : 'bg-slate-100 border-slate-300 text-amber-600 focus:border-amber-500'}`} />
                                ) : <span className="text-slate-600 font-mono">-</span>}
                              </td>

                              <td className={`p-3.5 text-center font-mono font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{el.grade > 0 ? el.grade : '-'}</td>

                              <td className="p-3.5 text-center">
                                {el.grade > 0 && (
                                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${isPassed ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-500 border border-red-500/30'}`}>
                                    {isPassed ? 'PASSED' : 'FAILED'}
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: ALL LEARNERS TERM SUMMARY MATRIX */}
            {sisTab === 'class_summary' && (
              <div className="space-y-4">
                <div className={`p-4 rounded-2xl border flex justify-between items-center ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                  <div>
                    <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      <Table className="w-4 h-4 text-blue-500" /> Class Term Summary Matrix — All {students.length} Learners
                    </h4>
                    <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'} mt-0.5`}>Overview of Term 1, Term 2, Term 3 Averages and Final Academic Ratings.</p>
                  </div>
                  <button onClick={() => window.print()} className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition">
                    <Printer className="w-3.5 h-3.5" /> Print Class Summary
                  </button>
                </div>

                <div className={`overflow-x-auto rounded-2xl border ${isDark ? 'border-slate-800/80 bg-slate-950/60' : 'border-slate-200 bg-white'}`}>
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className={`uppercase text-[10px] tracking-wider border-b ${isDark ? 'bg-slate-950 text-slate-400 border-slate-800' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                      <tr>
                        <th className="p-3 text-center w-10">#</th>
                        <th className="p-3">Learner Name</th>
                        <th className="p-3 font-mono text-center">LRN</th>
                        <th className="p-3 text-center">Gender</th>
                        <th className="p-3 text-center font-mono">Term 1 Avg</th>
                        <th className="p-3 text-center font-mono">Term 2 Avg</th>
                        <th className="p-3 text-center font-mono">Term 3 Avg</th>
                        <th className="p-3 text-center font-mono text-amber-500">General Avg</th>
                        <th className="p-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? 'divide-slate-800/60 bg-slate-900/30 text-slate-300' : 'divide-slate-200 bg-white text-slate-700'}`}>
                      {students.map((s, idx) => {
                        const t1 = calculateTermAverage(s, 'term1');
                        const t2 = calculateTermAverage(s, 'term2');
                        const t3 = calculateTermAverage(s, 'term3');
                        const genAvg = calculateFinalAverage(s);
                        const isPassed = parseFloat(genAvg) >= 75;

                        return (
                          <tr key={s.id} className={isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}>
                            <td className="p-3 text-center font-mono text-slate-400 text-[11px]">{idx + 1}</td>
                            <td className={`p-3 font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{s.lastName}, {s.firstName} {s.middleName || ''}</td>
                            <td className="p-3 text-center font-mono text-slate-400">{s.lrn}</td>
                            <td className="p-3 text-center font-bold">{s.gender}</td>
                            <td className="p-3 text-center font-mono">{t1}</td>
                            <td className="p-3 text-center font-mono">{t2}</td>
                            <td className="p-3 text-center font-mono">{t3}</td>
                            <td className="p-3 text-center font-mono font-black text-amber-500 text-sm">{genAvg}</td>
                            <td className="p-3 text-center">
                              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${isPassed ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                                {isPassed ? 'PASSED' : 'FAILED'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: BATCH GRADE SLIP PRINTER */}
            {sisTab === 'gradeslip_preview' && (
              <div className="space-y-6">
                <div className={`p-4 rounded-2xl border flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 print:hidden ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`text-xs font-bold uppercase flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      <Layers className="w-4 h-4 text-red-500" /> Print Mode:
                    </span>
                    
                    <button onClick={() => setPrintMode('single')} className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition ${printMode === 'single' ? 'bg-red-600 text-white border-red-600' : isDark ? 'bg-slate-900 text-slate-400 border-slate-800' : 'bg-white text-slate-700 border-slate-300'}`}>
                      Selected Student Only
                    </button>
                    <button onClick={() => setPrintMode('batch_all')} className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition ${printMode === 'batch_all' ? 'bg-red-600 text-white border-red-600' : isDark ? 'bg-slate-900 text-slate-400 border-slate-800' : 'bg-white text-slate-700 border-slate-300'}`}>
                      Batch Print All Learners
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
                    {printMode === 'batch_all' && (
                      <div className="flex items-center gap-2">
                        <Filter className="w-3.5 h-3.5 text-amber-500" />
                        <select value={printFilterGender} onChange={e => setPrintFilterGender(e.target.value as any)} className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border focus:outline-none ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'}`}>
                          <option value="ALL">All Enrolled ({students.length})</option>
                          <option value="MALE">Males Only ({maleList.length})</option>
                          <option value="FEMALE">Females Only ({femaleList.length})</option>
                        </select>
                      </div>
                    )}

                    <button onClick={() => window.print()} className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm transition">
                      <Printer className="w-4 h-4" /> Print {filteredPrintStudents.length} Grade Slips
                    </button>
                  </div>
                </div>

                {printMode === 'single' && renderGradeSlipCard(selectedStudent)}

                {printMode === 'batch_all' && (
                  <div className="space-y-6">
                    {filteredPrintStudents.map(st => (
                      <div key={st.id} className="print-page-break mb-6">
                        {renderGradeSlipCard(st)}
                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}
          </div>
        )}

        {/* ELECTIVE PRESET MANAGER MODAL */}
        {showPresetManager && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className={`w-full max-w-lg p-6 rounded-2xl border shadow-2xl space-y-4 ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold flex items-center gap-2"><Settings className="w-5 h-5 text-amber-400" /> Preset Library Manager</h3>
                <button onClick={() => setShowPresetManager(false)} className="p-1 rounded-lg text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
              </div>

              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newPresetVal} 
                  onChange={e => setNewPresetVal(e.target.value)} 
                  placeholder="Type new clean elective name..." 
                  className={`flex-1 p-2.5 rounded-xl border text-xs focus:outline-none ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'}`} 
                />
                <button onClick={handleAddPresetDirect} className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {electivePresets.length === 0 ? (
                  <p className="text-xs text-slate-500 italic text-center py-4">No saved elective presets yet.</p>
                ) : (
                  electivePresets.map((pr, idx) => (
                    <div key={idx} className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-semibold ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-300'}`}>
                      {editingPresetIdx === idx ? (
                        <input 
                          type="text" 
                          value={editingPresetVal} 
                          onChange={e => setEditingPresetVal(e.target.value)} 
                          className={`flex-1 mr-2 p-1 rounded-lg border focus:outline-none ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`} 
                        />
                      ) : (
                        <span>{pr}</span>
                      )}

                      <div className="flex items-center gap-1">
                        {editingPresetIdx === idx ? (
                          <button onClick={() => handlePresetEditSave(idx)} className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/20"><Check className="w-4 h-4" /></button>
                        ) : (
                          <button onClick={() => { setEditingPresetIdx(idx); setEditingPresetVal(pr); }} className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10"><Edit2 className="w-4 h-4" /></button>
                        )}
                        <button onClick={() => handlePresetDelete(pr)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <button onClick={() => setShowPresetManager(false)} className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-5 py-2 rounded-xl transition">Done</button>
              </div>
            </div>
          </div>
        )}

        {/* ADD ENROLLED LEARNER MODAL */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl space-y-4 ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold flex items-center gap-2"><UserPlus className="w-5 h-5 text-red-500" /> Enroll New Learner</h3>
                <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
              </div>

              <form onSubmit={handleAddStudent} className="space-y-3 text-xs font-semibold">
                <div>
                  <label className="block mb-1 text-slate-400">Learner LRN (12 Digits)</label>
                  <input type="text" required maxLength={12} value={newStudent.lrn} onChange={e => setNewStudent({ ...newStudent, lrn: e.target.value })} placeholder="11779215..." className={`w-full p-2.5 rounded-xl border focus:outline-none focus:border-red-500 ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'}`} />
                </div>

                <div>
                  <label className="block mb-1 text-slate-400">Last Name</label>
                  <input type="text" required value={newStudent.lastName} onChange={e => setNewStudent({ ...newStudent, lastName: e.target.value })} placeholder="SANTOS" className={`w-full p-2.5 rounded-xl border focus:outline-none focus:border-red-500 ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'}`} />
                </div>

                <div>
                  <label className="block mb-1 text-slate-400">First Name</label>
                  <input type="text" required value={newStudent.firstName} onChange={e => setNewStudent({ ...newStudent, firstName: e.target.value })} placeholder="JUAN" className={`w-full p-2.5 rounded-xl border focus:outline-none focus:border-red-500 ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'}`} />
                </div>

                <div>
                  <label className="block mb-1 text-slate-400">Middle Name (Optional)</label>
                  <input type="text" value={newStudent.middleName} onChange={e => setNewStudent({ ...newStudent, middleName: e.target.value })} placeholder="DELA CRUZ" className={`w-full p-2.5 rounded-xl border focus:outline-none focus:border-red-500 ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'}`} />
                </div>

                <div>
                  <label className="block mb-1 text-slate-400">Gender</label>
                  <select value={newStudent.gender} onChange={e => setNewStudent({ ...newStudent, gender: e.target.value as 'MALE' | 'FEMALE' })} className={`w-full p-2.5 rounded-xl border focus:outline-none focus:border-red-500 ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'}`}>
                    <option value="MALE">MALE</option>
                    <option value="FEMALE">FEMALE</option>
                  </select>
                </div>

                <div className="pt-2 flex gap-2 justify-end">
                  <button type="button" onClick={() => setShowAddModal(false)} className={`px-4 py-2 rounded-xl border text-xs font-bold ${isDark ? 'border-slate-800 text-slate-400 hover:text-white' : 'border-slate-300 text-slate-600'}`}>Cancel</button>
                  <button type="submit" className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-5 py-2 rounded-xl transition">Save Learner</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ADD ARAL LEARNER MODAL */}
        {showAddAralLearnerModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl space-y-4 ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold flex items-center gap-2"><UserPlus className="w-5 h-5 text-amber-500" /> Add New ARAL Tutee</h3>
                <button onClick={() => setShowAddAralLearnerModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
              </div>

              <form onSubmit={handleAddAralLearner} className="space-y-3 text-xs font-semibold">
                <div>
                  <label className="block mb-1 text-slate-400">Full Name (LASTNAME, FIRSTNAME)</label>
                  <input type="text" required value={newAralLearner.fullName} onChange={e => setNewAralLearner({ ...newAralLearner, fullName: e.target.value })} placeholder="SANTOS, JUAN" className={`w-full p-2.5 rounded-xl border focus:outline-none focus:border-amber-500 ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'}`} />
                </div>

                <div>
                  <label className="block mb-1 text-slate-400">Section</label>
                  <select value={newAralLearner.section} onChange={e => setNewAralLearner({ ...newAralLearner, section: e.target.value })} className={`w-full p-2.5 rounded-xl border focus:outline-none focus:border-amber-500 ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'}`}>
                    <option value="Gardner">Gardner</option>
                    <option value="Thorndike">Thorndike</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-slate-400">Grade Level</label>
                  <input type="text" value={newAralLearner.gradeLevel} onChange={e => setNewAralLearner({ ...newAralLearner, gradeLevel: e.target.value })} className={`w-full p-2.5 rounded-xl border focus:outline-none focus:border-amber-500 ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'}`} />
                </div>

                <div className="pt-2 flex gap-2 justify-end">
                  <button type="button" onClick={() => setShowAddAralLearnerModal(false)} className={`px-4 py-2 rounded-xl border text-xs font-bold ${isDark ? 'border-slate-800 text-slate-400 hover:text-white' : 'border-slate-300 text-slate-600'}`}>Cancel</button>
                  <button type="submit" className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-5 py-2 rounded-xl transition">Add Tutee</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================== ARAL MODULE ==================== */}
        {activeTab === 'aral' && (
          <div className="space-y-6">
            
            {/* ARAL DASHBOARD METRICS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className={`p-4 rounded-2xl border flex items-center justify-between shadow-sm ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div>
                  <p className={`text-[10px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'} uppercase tracking-wider`}>Total ARAL Tutees</p>
                  <h4 className={`text-2xl font-black mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{aralTotalTutees}</h4>
                  <p className="text-[10px] text-amber-500 font-semibold mt-0.5">Gardner & Thorndike Sections</p>
                </div>
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500"><Users className="w-5 h-5" /></div>
              </div>

              <div className={`p-4 rounded-2xl border flex items-center justify-between shadow-sm ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div>
                  <p className={`text-[10px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'} uppercase tracking-wider`}>Average Attendance</p>
                  <h4 className="text-2xl font-black text-emerald-500 mt-1">{aralAttendanceStats.rate}%</h4>
                  <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'} mt-0.5`}>{aralAttendanceStats.totalAbsences} total logged absences</p>
                </div>
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500"><TrendingUp className="w-5 h-5" /></div>
              </div>

              <div className={`p-4 rounded-2xl border flex items-center justify-between shadow-sm ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div>
                  <p className={`text-[10px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'} uppercase tracking-wider`}>Observed Mastery Rate</p>
                  <h4 className="text-2xl font-black text-blue-500 mt-1">{aralMasteryRate}%</h4>
                  <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'} mt-0.5`}>Reading Target Mastery</p>
                </div>
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-500"><Target className="w-5 h-5" /></div>
              </div>

              <div className={`p-4 rounded-2xl border flex items-center justify-between shadow-sm ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div>
                  <p className={`text-[10px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'} uppercase tracking-wider`}>Tutees At-Risk</p>
                  <h4 className="text-2xl font-black text-orange-500 mt-1">{aralLearnersAtRiskCount}</h4>
                  <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'} mt-0.5`}>High absence rate (&ge;3 days)</p>
                </div>
                <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl text-orange-500"><AlertTriangle className="w-5 h-5" /></div>
              </div>
            </div>

            {/* NAVIGATION SUB-TABS */}
            <div className={`flex border-b ${isDark ? 'border-slate-800' : 'border-slate-200'} space-x-1`}>
              <button onClick={() => setAralSubTab('attendance')} className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition flex items-center gap-2 ${aralSubTab === 'attendance' ? 'bg-amber-600 text-white' : isDark ? 'bg-slate-950/60 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'}`}>
                <FileSpreadsheet className="w-3.5 h-3.5" /> ARAL SF2-Style Attendance
              </button>
              <button onClick={() => setAralSubTab('report_editor')} className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition flex items-center gap-2 ${aralSubTab === 'report_editor' ? 'bg-amber-600 text-white' : isDark ? 'bg-slate-950/60 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'}`}>
                <FileText className="w-3.5 h-3.5 text-amber-300" /> Weekly Reading IRIP Report Editor
              </button>
              <button onClick={() => setAralSubTab('batch_reports')} className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition flex items-center gap-2 ${aralSubTab === 'batch_reports' ? 'bg-amber-600 text-white' : isDark ? 'bg-slate-950/60 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'}`}>
                <Award className="w-3.5 h-3.5 text-emerald-400" /> Batch Print All IRIP Reports
              </button>
            </div>

            {/* SUB-TAB 1: ARAL SF2 ATTENDANCE SHEET */}
            {aralSubTab === 'attendance' && (
              <div className="space-y-4">
                <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div>
                    <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      <FileSpreadsheet className="w-4 h-4 text-amber-500" /> ARAL Program Daily Attendance Log
                    </h4>
                    <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'} mt-0.5`}>Click cells to toggle status: [blank] = Present, x = Absent, h = Half-Day</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <input 
                      type="date" 
                      value={newAralDateInput} 
                      onChange={e => setNewAralDateInput(e.target.value)} 
                      className={`p-1.5 rounded-xl text-xs font-bold border focus:outline-none ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'}`} 
                    />
                    <button onClick={handleAddAralDate} className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1">
                      <Plus className="w-3.5 h-3.5" /> Add Session Date
                    </button>
                    <button onClick={() => setShowAddAralLearnerModal(true)} className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1">
                      <UserPlus className="w-3.5 h-3.5" /> Add Tutee
                    </button>
                  </div>
                </div>

                <div className="bg-white text-slate-900 p-6 rounded-2xl shadow-xl overflow-x-auto font-sans print:p-0 print:shadow-none">
                  <table className="w-full text-xs border-collapse border border-slate-900 text-center font-sans">
                    <thead>
                      <tr className="bg-slate-100 font-bold text-slate-900">
                        <th className="border border-slate-900 p-2 w-8">#</th>
                        <th className="border border-slate-900 p-2 text-left min-w-[180px]">ARAL Learner Name</th>
                        <th className="border border-slate-900 p-2 w-24">Section</th>
                        {aralDates.map((d, dIdx) => (
                          <th key={dIdx} className="border border-slate-900 p-1 text-[10px] min-w-[45px]">{d.replace('2026-', '')}</th>
                        ))}
                        <th className="border border-slate-900 p-2 text-red-700 font-black w-14">ABS</th>
                        <th className="border border-slate-900 p-2 text-emerald-700 font-black w-14">PRES</th>
                        <th className="border border-slate-900 p-2 w-10">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aralLearners.map((l, idx) => {
                        let absCount = 0;
                        aralDates.forEach(d => {
                          const mark = l.attendance[d];
                          if (mark === 'x') absCount += 1;
                          else if (mark === 'h') absCount += 0.5;
                        });
                        const presCount = Math.max(0, aralDates.length - absCount);

                        return (
                          <tr key={l.id} className="hover:bg-slate-50">
                            <td className="border border-slate-900 p-1.5 font-bold">{idx + 1}</td>
                            <td className="border border-slate-900 p-1.5 text-left font-bold text-slate-900">{l.fullName}</td>
                            <td className="border border-slate-900 p-1.5 text-slate-700 font-semibold">{l.section}</td>
                            {aralDates.map((d, dIdx) => {
                              const mark = l.attendance[d] || '';
                              return (
                                <td 
                                  key={dIdx} 
                                  onClick={() => toggleAralAttendance(l.id, d)}
                                  className={`border border-slate-900 font-black font-mono cursor-pointer select-none text-xs ${mark === 'x' ? 'bg-red-100 text-red-700' : mark === 'h' ? 'bg-amber-100 text-amber-700' : ''}`}>
                                  {mark}
                                </td>
                              );
                            })}
                            <td className="border border-slate-900 font-mono font-bold text-red-700">{absCount}</td>
                            <td className="border border-slate-900 font-mono font-bold text-emerald-700">{presCount}</td>
                            <td className="border border-slate-900 p-1 text-center">
                              <button onClick={() => handleDeleteAralLearner(l.id, l.fullName)} className="text-slate-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUB-TAB 2: ARAL WEEKLY REPORT EDITOR */}
            {aralSubTab === 'report_editor' && (
              <div className="space-y-6">
                
                {/* SELECTOR BAR */}
                <div className={`p-4 rounded-2xl border flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-sm ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                  <div className="flex flex-wrap items-center gap-3">
                    <label className={`text-xs font-bold uppercase ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Select ARAL Tutee:</label>
                    <select value={selectedAralLearnerId} onChange={e => setSelectedAralLearnerId(e.target.value)} className={`px-3 py-1.5 rounded-xl text-xs font-bold border focus:outline-none ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}>
                      {aralLearners.map(l => (
                        <option key={l.id} value={l.id}>{l.fullName} ({l.section})</option>
                      ))}
                    </select>

                    <input type="date" value={aralReportDate} onChange={e => setAralReportDate(e.target.value)} className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border focus:outline-none ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`} />

                    <select value={aralReportWeek} onChange={e => setAralReportWeek(e.target.value)} className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border focus:outline-none ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}>
                      {Array.from({ length: 8 }, (_, i) => `Week ${i + 1}`).map(w => (
                        <option key={w} value={w}>{w}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button onClick={() => handleExportAralReportToWord(selectedAralLearner)} className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition">
                      <Download className="w-3.5 h-3.5" /> Export IRIP Word (.doc)
                    </button>
                    <button onClick={() => window.print()} className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition">
                      <Printer className="w-3.5 h-3.5" /> Print Report
                    </button>
                  </div>
                </div>

                {/* TARGET STATUS CONTROLS & SUGGESTED REMARKS ENGINE */}
                <div className={`p-5 rounded-2xl border space-y-4 ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <Target className="w-4 h-4 text-amber-500" /> Progress Status & Tutor Notes Editor
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ARAL_READING_CATEGORIES.map(cat => (
                      <div key={cat.id} className={`p-3 rounded-xl border space-y-2 ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-300'}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-400">{cat.categoryName}</span>
                          <select 
                            value={aralTargetStatuses[cat.id] || '✔ Observed'} 
                            onChange={e => setAralTargetStatuses({ ...aralTargetStatuses, [cat.id]: e.target.value })}
                            className={`p-1 rounded-lg text-xs font-bold border focus:outline-none ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}>
                            <option value="✔ Observed">✔ Observed</option>
                            <option value="◑ Partially Observed">◑ Partially Observed</option>
                            <option value="✘ Not Observed">✘ Not Observed</option>
                          </select>
                        </div>
                        <input 
                          type="text" 
                          value={aralTargetNotes[cat.id] || ''} 
                          onChange={e => setAralTargetNotes({ ...aralTargetNotes, [cat.id]: e.target.value })} 
                          placeholder="Observation notes..." 
                          className={`w-full p-1.5 rounded-lg border text-xs focus:outline-none ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'}`} 
                        />
                      </div>
                    ))}
                  </div>

                  {/* SUGGESTED REMARKS ENGINE */}
                  <div className="pt-2 border-t border-slate-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-bold text-amber-400">Suggested Tutor Remarks Preset:</label>
                      <button 
                        onClick={handleGenerateAralNotes} 
                        disabled={isGeneratingDLP} 
                        className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {isGeneratingDLP ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                        <span>Generate Observation Notes</span>
                      </button>
                    </div>
                    <select 
                      value={aralSelectedRemarkPreset} 
                      onChange={e => setAralSelectedRemarkPreset(e.target.value)} 
                      className={`w-full p-2 rounded-xl text-xs font-semibold border focus:outline-none ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'}`}>
                      {SUGGESTED_ARAL_REMARKS.map((rem, rIdx) => (
                        <option key={rIdx} value={rem}>{rem}</option>
                      ))}
                    </select>

                    <label className="block text-xs font-bold text-slate-400 mt-2">Custom Remarks (Overrides Preset):</label>
                    <textarea 
                      rows={2} 
                      value={aralCustomRemark} 
                      onChange={e => setAralCustomRemark(e.target.value)} 
                      placeholder="Type custom observations or specific recommendations..." 
                      className={`w-full p-2.5 rounded-xl border text-xs focus:outline-none ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'}`} 
                    />
                  </div>
                </div>

                {/* SINGLE SHEET PRINTABLE PREVIEW */}
                {renderAralSingleReportCard(selectedAralLearner)}

              </div>
            )}

            {/* SUB-TAB 3: ARAL BATCH REPORTS PRINTER */}
            {aralSubTab === 'batch_reports' && (
              <div className="space-y-6">
                <div className={`p-4 rounded-2xl border flex items-center justify-between print:hidden ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                  <div>
                    <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      <Award className="w-4 h-4 text-emerald-400" /> Batch IRIP Reports Printable Preview
                    </h4>
                    <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'} mt-0.5`}>Ready to print all {aralLearners.length} ARAL learner reports on separate pages.</p>
                  </div>

                  <button onClick={() => window.print()} className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm transition">
                    <Printer className="w-4 h-4" /> Print All {aralLearners.length} IRIP Reports
                  </button>
                </div>

                <div className="space-y-6">
                  {aralLearners.map(l => (
                    <div key={l.id} className="print-page-break mb-6">
                      {renderAralSingleReportCard(l)}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </main>
    </div>
  );
}
