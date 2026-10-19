'use client';

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

export default function TeacherDashboard() {
  const router = useRouter();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'sf2' | 'ilaw' | 'weelmat' | 'sis' | 'aral'>('dashboard');
  const [sisTab, setSisTab] = useState<'roster' | 'subject_grades' | 'class_summary' | 'gradeslip_preview'>('roster');
  const [students, setStudents] = useState<Student[]>(ENROLLED_STUDENTS);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('1');

  const [includeWeekends, setIncludeWeekends] = useState<boolean>(true);
  const [classInterruptions, setClassInterruptions] = useState<Record<string, Record<number, string>>>({
    'OCTOBER': { 31: 'BARANGAY ELECTION / LOCAL HOLIDAY' }
  });
  const [selectedInterruptionDay, setSelectedInterruptionDay] = useState<number>(12);
  const [interruptionText, setInterruptionText] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState('OCTOBER');

  const schoolId = '302773';
  const schoolYear = '2026-2027';
  const schoolName = 'BAGONBON NATIONAL HIGH SCHOOL';
  const gradeLevel = '11';
  const section = 'BLOODSTONE';
  const adviserName = 'JUDIMER JOHN S. ZARATE';
  const schoolHeadName = 'HOMEYLIN U. BIRONDO';

  const activeMonthData = useMemo(() => generateFullMonthCalendar(selectedMonth, includeWeekends), [selectedMonth, includeWeekends]);

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

  const maleRegisteredEnd = maleList.length;
  const femaleRegisteredEnd = femaleList.length;
  const totalRegisteredEnd = maleRegisteredEnd + femaleRegisteredEnd;

  const maleTotalDailyPresent = maleDailyPresent.reduce((a, b) => a + b, 0);
  const femaleTotalDailyPresent = femaleDailyPresent.reduce((a, b) => a + b, 0);
  const combinedTotalDailyPresent = maleTotalDailyPresent + femaleTotalDailyPresent;

  const maleAvgDailyAttendance = numberOfSchoolDays > 0 ? (maleTotalDailyPresent / numberOfSchoolDays).toFixed(1) : '0.0';
  const femaleAvgDailyAttendance = numberOfSchoolDays > 0 ? (femaleTotalDailyPresent / numberOfSchoolDays).toFixed(1) : '0.0';
  const totalAvgDailyAttendance = numberOfSchoolDays > 0 ? (combinedTotalDailyPresent / numberOfSchoolDays).toFixed(1) : '0.0';

  const malePercentageAttendance = maleRegisteredEnd > 0 ? ((parseFloat(maleAvgDailyAttendance) / maleRegisteredEnd) * 100).toFixed(1) : '0.0';
  const femalePercentageAttendance = femaleRegisteredEnd > 0 ? ((parseFloat(femaleAvgDailyAttendance) / femaleRegisteredEnd) * 100).toFixed(1) : '0.0';
  const totalPercentageAttendance = totalRegisteredEnd > 0 ? ((parseFloat(totalAvgDailyAttendance) / totalRegisteredEnd) * 100).toFixed(1) : '0.0';

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} flex flex-col font-sans antialiased`}>
      <header className="bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center print:hidden">
        <h1 className="text-xl font-black text-white">BLOODSTONE <span className="text-red-500">LMS</span></h1>
        <button onClick={() => setTheme(isDark ? 'light' : 'dark')} className="text-xs bg-slate-800 px-3 py-1.5 rounded-lg text-amber-400">Toggle Theme</button>
      </header>

      <main className="p-6 max-w-7xl mx-auto w-full print:p-0 print:max-w-none">
        {/* SF2 ATTENDANCE VIEW */}
        <div className="bg-white text-slate-900 p-6 rounded-2xl shadow-xl overflow-x-auto">
          
          {/* TOP HEADER */}
          <div className="text-center mb-4">
            <h2 className="font-black text-base uppercase">School Form 2 (SF2) Daily Attendance Report of Learners</h2>
            <div className="text-[10px] text-slate-600">Department of Education • Bagonbon National High School</div>
          </div>

          <table className="w-full text-[9.5px] border-collapse border border-slate-900 text-center font-sans">
            <thead>
              <tr className="bg-slate-100 font-bold text-slate-900">
                <th className="border border-slate-900 p-0.5 w-6" rowSpan={2}>No.</th>
                <th className="border border-slate-900 p-1 text-left min-w-[210px]" rowSpan={2}>LEARNER'S NAME</th>
                <th className="border border-slate-900 p-0.5 text-center" colSpan={activeMonthData.days.length}>Dates</th>
                <th className="border border-slate-900 p-0.5 w-10 text-red-900">ABSENT</th>
                <th className="border border-slate-900 p-0.5 w-10 text-emerald-900">PRESENT</th>
              </tr>
              <tr className="bg-slate-100 font-bold text-[9px]">
                {activeMonthData.days.map((dayNum, i) => (
                  <th key={i} className="border border-slate-900 p-0.5 min-w-[18px]">{dayNum}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {maleList.map((s, idx) => {
                const stats = calculateStudentStats(s);
                return (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="border border-slate-900 p-0.5 font-bold">{idx + 1}</td>
                    <td className="border border-slate-900 p-0.5 text-left font-bold">{s.lastName}, {s.firstName}</td>
                    {activeMonthData.days.map((dayNum, dayIdx) => {
                      const mark = (s.attendance[selectedMonth] || {})[dayNum] || '';
                      return (
                        <td key={dayIdx} onClick={() => toggleAttendanceCell(s.id, dayNum)} className="border border-slate-900 font-mono font-black cursor-pointer">
                          {mark}
                        </td>
                      );
                    })}
                    <td className="border border-slate-900 font-mono text-red-700 font-bold">{stats.absent}</td>
                    <td className="border border-slate-900 font-mono font-bold">{stats.present}</td>
                  </tr>
                );
              })}

              <tr className="bg-slate-200 font-bold text-slate-900">
                <td className="border border-slate-900"></td>
                <td className="border border-slate-900 p-1 text-left font-black">MALE | TOTAL Per Day</td>
                {maleDailyPresent.map((tot, i) => (
                  <td key={i} className="border border-slate-900 font-mono font-black">{tot}</td>
                ))}
                <td className="border border-slate-900 font-mono text-red-700 font-black">{maleList.reduce((acc, s) => acc + (parseFloat(calculateStudentStats(s).absent as string) || 0), 0)}</td>
                <td className="border border-slate-900 font-mono font-black">{maleTotalDailyPresent}</td>
              </tr>

              {femaleList.map((s, idx) => {
                const stats = calculateStudentStats(s);
                return (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="border border-slate-900 p-0.5 font-bold">{idx + 1}</td>
                    <td className="border border-slate-900 p-0.5 text-left font-bold">{s.lastName}, {s.firstName}</td>
                    {activeMonthData.days.map((dayNum, dayIdx) => {
                      const mark = (s.attendance[selectedMonth] || {})[dayNum] || '';
                      return (
                        <td key={dayIdx} onClick={() => toggleAttendanceCell(s.id, dayNum)} className="border border-slate-900 font-mono font-black cursor-pointer">
                          {mark}
                        </td>
                      );
                    })}
                    <td className="border border-slate-900 font-mono text-red-700 font-bold">{stats.absent}</td>
                    <td className="border border-slate-900 font-mono font-bold">{stats.present}</td>
                  </tr>
                );
              })}

              <tr className="bg-slate-200 font-bold text-slate-900">
                <td className="border border-slate-900"></td>
                <td className="border border-slate-900 p-1 text-left font-black">FEMALE | TOTAL Per Day</td>
                {femaleDailyPresent.map((tot, i) => (
                  <td key={i} className="border border-slate-900 font-mono font-black">{tot}</td>
                ))}
                <td className="border border-slate-900 font-mono text-red-700 font-black">{femaleList.reduce((acc, s) => acc + (parseFloat(calculateStudentStats(s).absent as string) || 0), 0)}</td>
                <td className="border border-slate-900 font-mono font-black">{femaleTotalDailyPresent}</td>
              </tr>

              <tr className="bg-slate-300 font-black text-slate-900 border-t-2 border-slate-900">
                <td className="border border-slate-900"></td>
                <td className="border border-slate-900 p-1 text-left font-black">Combined TOTAL PER DAY</td>
                {combinedDailyPresent.map((tot, i) => (
                  <td key={i} className="border border-slate-900 font-mono">{tot}</td>
                ))}
                <td className="border border-slate-900 font-mono text-red-800">{students.reduce((acc, s) => acc + (parseFloat(calculateStudentStats(s).absent as string) || 0), 0)}</td>
                <td className="border border-slate-900 font-mono">{combinedTotalDailyPresent}</td>
              </tr>
            </tbody>
          </table>

          {/* DYNAMIC OFFICIAL SF2 SUMMARY TABLE & CERTIFICATION SIGNATURE BLOCK */}
          <div className="mt-4 border-2 border-black text-[10px] text-black font-sans leading-tight bg-white p-2 w-full clear-both">
            <div className="grid grid-cols-12 border-b border-black pb-2 gap-2">
              
              {/* GUIDELINES COLUMN */}
              <div className="col-span-4 pr-2 border-r border-black space-y-1 text-[8.5px]">
                <p className="font-bold underline">GUIDELINES:</p>
                <p>1. The attendance shall be accomplished daily. Refer to the codes for checking learners' attendance.</p>
                <p>2. Dates shall be written in the preceding columns beside Learner's Name.</p>
                <p>3. To compute the following:</p>
                <div className="pl-1 space-y-0.5">
                  <p>a. <span className="font-semibold">Percentage of Enrolment</span> = (Registered Learners at End of Month / Enrolment as of 1st Friday) x 100</p>
                  <p>b. <span className="font-semibold">Average Daily Attendance (ADA)</span> = Total Daily Attendance / Number of School Days in Month</p>
                  <p>c. <span className="font-semibold">Percentage of Attendance</span> = (Average Daily Attendance / Registered Learners at End of Month) x 100</p>
                </div>
                <p>4. Every end of the month, class adviser submits this form to principal for recording into SF4.</p>
              </div>

              {/* CODES FOR CHECKING ATTENDANCE */}
              <div className="col-span-4 px-2 border-r border-black space-y-1 text-[8.5px]">
                <p className="font-bold underline">1. CODES FOR CHECKING ATTENDANCE</p>
                <p><span className="font-bold">[blank]</span> - Present | <span className="font-bold">(x)</span> - Absent | <span className="font-bold">h</span> - Half-day</p>
                
                <p className="font-bold underline pt-1">2. REASONS/CAUSES FOR NLS</p>
                <div className="grid grid-cols-2 text-[8px] gap-x-1">
                  <div>
                    <p className="font-semibold">a. Domestic Factors</p>
                    <p>a.1. Sibling care</p>
                    <p>a.2. Early marriage</p>
                    <p>a.3. Parents' attitude</p>
                  </div>
                  <div>
                    <p className="font-semibold">b. Individual Factors</p>
                    <p>b.1. Illness</p>
                    <p>b.2. Overage</p>
                    <p>b.3. Financial/Work</p>
                  </div>
                </div>
              </div>

              {/* DYNAMIC SUMMARY TABLE */}
              <div className="col-span-4 pl-2">
                <div className="flex justify-between items-center mb-1 font-bold text-[9px]">
                  <span>Summary for Month</span>
                  <span>No. of Days of Classes: {numberOfSchoolDays}</span>
                </div>
                
                <table className="w-full text-center border-collapse border border-black text-[8px]">
                  <thead>
                    <tr className="bg-gray-100 border-b border-black font-bold">
                      <th className="border-r border-black p-0.5 text-left pl-1">{selectedMonth}</th>
                      <th className="border-r border-black w-6">M</th>
                      <th className="border-r border-black w-6">F</th>
                      <th className="w-8">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-black">
                      <td className="border-r border-black text-left pl-1">Enrolment 1st Friday</td>
                      <td className="border-r border-black">{maleRegisteredEnd}</td>
                      <td className="border-r border-black">{femaleRegisteredEnd}</td>
                      <td className="font-bold">{totalRegisteredEnd}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="border-r border-black text-left pl-1">Registered (End of Month)</td>
                      <td className="border-r border-black">{maleRegisteredEnd}</td>
                      <td className="border-r border-black">{femaleRegisteredEnd}</td>
                      <td className="font-bold">{totalRegisteredEnd}</td>
                    </tr>
                    <tr className="border-b border-black font-semibold">
                      <td className="border-r border-black text-left pl-1">Avg Daily Attendance (ADA)</td>
                      <td className="border-r border-black">{maleAvgDailyAttendance}</td>
                      <td className="border-r border-black">{femaleAvgDailyAttendance}</td>
                      <td className="font-bold">{totalAvgDailyAttendance}</td>
                    </tr>
                    <tr className="border-b border-black font-semibold">
                      <td className="border-r border-black text-left pl-1">% of Attendance</td>
                      <td className="border-r border-black">{malePercentageAttendance}%</td>
                      <td className="border-r border-black">{femalePercentageAttendance}%</td>
                      <td className="font-bold">{totalPercentageAttendance}%</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="border-r border-black text-left pl-1">5+ Consecutive Absences</td>
                      <td className="border-r border-black">0</td>
                      <td className="border-r border-black">0</td>
                      <td className="font-bold">0</td>
                    </tr>
                    <tr>
                      <td className="border-r border-black text-left pl-1">Transferred In</td>
                      <td className="border-r border-black">0</td>
                      <td className="border-r border-black">0</td>
                      <td className="font-bold">0</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* SIGNATURE SIGN-OFF BLOCK */}
            <div className="grid grid-cols-2 pt-2 text-center gap-6">
              <div>
                <p className="text-left text-[8px] italic mb-3">I certify that this is a true and correct report.</p>
                <div className="border-b border-black font-bold uppercase text-[10px] pb-0.5">
                  {adviserName}
                </div>
                <p className="text-[8px] text-gray-700 mt-0.5">(Signature of Adviser over Printed Name)</p>
              </div>

              <div>
                <p className="text-left text-[8px] italic mb-3">Attested by:</p>
                <div className="border-b border-black font-bold uppercase text-[10px] pb-0.5">
                  {schoolHeadName}
                </div>
                <p className="text-[8px] text-gray-700 mt-0.5">(Signature of School Head over Printed Name)</p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
