import React, { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  Brain,
  Target,
  ClipboardList,
  BarChart3,
  Bookmark,
  StickyNote,
  Search,
  Moon,
  Sun,
  RotateCcw,
  Timer,
  CheckCircle2,
  XCircle,
  Trophy,
  Flame,
  ShieldCheck,
  Rocket,
  Menu,
  X,
  Home
} from 'lucide-react';
import data from './data/cpmaiData.json';

const LS = {
  dark: 'cpmaiV2Dark',
  tab: 'cpmaiV2Tab',
  answers: 'cpmaiV2Answers',
  bookmarks: 'cpmaiV2Bookmarks',
  notes: 'cpmaiV2Notes',
  examAnswers: 'cpmaiV2ExamAnswers',
  currentExam: 'cpmaiV2CurrentExam'
};

function loadJSON(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function pct(a, b) {
  return b ? Math.round((a / b) * 100) : 0;
}

function mmss(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function App() {
  const [dark, setDark] = useState(() => localStorage.getItem(LS.dark) === 'true');
  const [tab, setTab] = useState(() => localStorage.getItem(LS.tab) || 'home');
  const [mobileOpen, setMobileOpen] = useState(false);

  const [answers, setAnswers] = useState(() => loadJSON(LS.answers, {}));
  const [examAnswers, setExamAnswers] = useState(() => loadJSON(LS.examAnswers, {}));
  const [bookmarks, setBookmarks] = useState(() => loadJSON(LS.bookmarks, []));
  const [notes, setNotes] = useState(() => localStorage.getItem(LS.notes) || '');

  const [query, setQuery] = useState('');
  const [domain, setDomain] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [mode, setMode] = useState('adaptive');

  const [current, setCurrent] = useState(0);
  const [revealedPractice, setRevealedPractice] = useState({});
  const [lockedPracticeQuestionId, setLockedPracticeQuestionId] = useState(null);

  const [examId, setExamId] = useState(() => Number(localStorage.getItem(LS.currentExam) || 1));
  const [examCurrent, setExamCurrent] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(160 * 60);

  const questions = data.questions || [];
  const domains = data.domains || [];

  useEffect(() => {
    localStorage.setItem(LS.dark, String(dark));
    localStorage.setItem(LS.tab, tab);
    localStorage.setItem(LS.answers, JSON.stringify(answers));
    localStorage.setItem(LS.examAnswers, JSON.stringify(examAnswers));
    localStorage.setItem(LS.bookmarks, JSON.stringify(bookmarks));
    localStorage.setItem(LS.notes, notes);
    localStorage.setItem(LS.currentExam, String(examId));
  }, [dark, tab, answers, examAnswers, bookmarks, notes, examId]);

  useEffect(() => {
    if (!examStarted || examSubmitted) return;

    const t = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);

    return () => clearInterval(t);
  }, [examStarted, examSubmitted]);

  useEffect(() => {
    if (secondsLeft === 0 && examStarted) {
      setExamSubmitted(true);
    }
  }, [secondsLeft, examStarted]);

  const stats = useMemo(() => {
    return domains.map((d) => {
      const qs = questions.filter((q) => q.domain === d.id);
      const done = qs.filter((q) => answers[q.id]);
      const correct = done.filter((q) => answers[q.id] === q.answer);
      const missed = done.length - correct.length;

      return {
        ...d,
        total: qs.length,
        done: done.length,
        correct: correct.length,
        missed,
        rate: pct(correct.length, done.length)
      };
    });
  }, [answers, domains, questions]);

  const weak = useMemo(() => {
    return [...stats]
      .sort((a, b) => (a.rate - b.rate) || (a.done - b.done))
      .slice(0, 2);
  }, [stats]);

  const overallDone = Object.keys(answers).length;
  const overallCorrect = questions.filter((q) => answers[q.id] === q.answer).length;
  const overallRate = pct(overallCorrect, overallDone);

  const filtered = useMemo(() => {
    let pool = questions.filter((q) => {
      return (
        (domain === 'all' || q.domain === domain) &&
        (difficulty === 'all' || q.difficulty === difficulty)
      );
    });

    if (query.trim()) {
      const s = query.toLowerCase();

      pool = pool.filter((q) => {
        return `${q.question} ${q.topic} ${q.domainName} ${q.trap} ${q.options
          .map((o) => o.text)
          .join(' ')}`
          .toLowerCase()
          .includes(s);
      });
    }

    if (mode === 'unanswered') {
      pool = pool.filter((q) => !answers[q.id]);
    }

    if (mode === 'missed') {
      pool = pool.filter((q) => answers[q.id] && answers[q.id] !== q.answer);
    }

    if (mode === 'bookmarked') {
      pool = pool.filter((q) => bookmarks.includes(q.id));
    }

    if (mode === 'adaptive') {
      const weakIds = weak.map((w) => w.id);

      pool = [...pool].sort((a, b) => {
        const wa = weakIds.includes(a.domain) ? 0 : 1;
        const wb = weakIds.includes(b.domain) ? 0 : 1;

        /*
          Do not sort by answered/unanswered here.
          That caused the practice question to jump immediately after answering.
        */
        return wa - wb || a.id - b.id;
      });
    }

    return pool;
  }, [questions, domain, difficulty, query, mode, answers, bookmarks, weak]);

  const lockedPracticeQuestion = lockedPracticeQuestionId
    ? questions.find((q) => q.id === lockedPracticeQuestionId)
    : null;

  const practiceQ =
    lockedPracticeQuestion ||
    filtered[Math.min(current, Math.max(0, filtered.length - 1))];

  const exam = data.mockExams.find((e) => e.id === examId) || data.mockExams[0];

  const examQuestions = exam.questionIds
    .map((id) => questions.find((q) => q.id === id))
    .filter(Boolean);

  const examQ = examQuestions[Math.min(examCurrent, Math.max(0, examQuestions.length - 1))];

  const examKey = 'exam' + examId;
  const currentExamAnswers = examAnswers[examKey] || {};
  const examAnswered = Object.keys(currentExamAnswers).length;
  const examCorrect = examQuestions.filter((q) => currentExamAnswers[q.id] === q.answer).length;
  const examScore = pct(examCorrect, examQuestions.length);

  function nav(id) {
    setTab(id);
    setMobileOpen(false);
    setCurrent(0);
    setLockedPracticeQuestionId(null);
  }

  function answerPractice(qid, key) {
    setLockedPracticeQuestionId(qid);

    setAnswers((prev) => ({
      ...prev,
      [qid]: key
    }));

    setRevealedPractice((prev) => ({
      ...prev,
      [qid]: true
    }));
  }

  function movePractice(nextIndex) {
    setLockedPracticeQuestionId(null);

    setCurrent(
      Math.max(
        0,
        Math.min(filtered.length - 1, nextIndex)
      )
    );
  }

  function answerExam(qid, key) {
    setExamAnswers((prev) => ({
      ...prev,
      [examKey]: {
        ...(prev[examKey] || {}),
        [qid]: key
      }
    }));
  }

  function moveExam(nextIndex) {
    setExamCurrent(
      Math.max(
        0,
        Math.min(examQuestions.length - 1, nextIndex)
      )
    );
  }

  function toggleBookmark(id) {
    setBookmarks((prev) => {
      return prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
    });
  }

  function reset() {
    if (confirm('Reset all practice answers, exam answers, bookmarks and notes?')) {
      setAnswers({});
      setExamAnswers({});
      setBookmarks([]);
      setNotes('');
      setRevealedPractice({});
      setLockedPracticeQuestionId(null);
      setCurrent(0);
      setExamCurrent(0);
      setExamStarted(false);
      setExamSubmitted(false);
      setSecondsLeft(160 * 60);
    }
  }

  function startExam(id) {
    setExamId(id);
    setExamStarted(true);
    setExamSubmitted(false);
    setExamCurrent(0);
    setSecondsLeft(160 * 60);

    setExamAnswers((prev) => {
      const updated = { ...prev };
      updated['exam' + id] = {};
      return updated;
    });
  }

  function updateDomain(value) {
    setDomain(value);
    setCurrent(0);
    setLockedPracticeQuestionId(null);
  }

  function updateDifficulty(value) {
    setDifficulty(value);
    setCurrent(0);
    setLockedPracticeQuestionId(null);
  }

  function updateMode(value) {
    setMode(value);
    setCurrent(0);
    setLockedPracticeQuestionId(null);
  }

  function updateQuery(value) {
    setQuery(value);
    setCurrent(0);
    setLockedPracticeQuestionId(null);
  }

  const navItems = [
    ['home', Home, 'Dashboard'],
    ['guide', BookOpen, 'Study Guide'],
    ['practice', Target, 'Practice'],
    ['exam', ClipboardList, 'Mock Exams'],
    ['flash', Brain, 'Flashcards'],
    ['stats', BarChart3, 'Stats'],
    ['bookmarks', Bookmark, 'Bookmarks'],
    ['notes', StickyNote, 'Notes']
  ];

  return (
    <div className={`app ${dark ? 'dark' : ''}`}>
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sideBrand">
          <div className="brandMark">AI</div>
          <div>
            <b>CPMAI Studio</b>
            <span>v2 Premium</span>
          </div>
          <button className="mobileClose" onClick={() => setMobileOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <nav>
          {navItems.map(([id, Icon, label]) => (
            <button
              key={id}
              className={tab === id ? 'active' : ''}
              onClick={() => nav(id)}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

        <div className="sideNote">
          <ShieldCheck size={18} />
          <span>4,000 original exam-style questions. No copied PMI questions.</span>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="hamb" onClick={() => setMobileOpen(true)}>
            <Menu />
          </button>

          <div>
            <h1>CPMAI Exam Studio v2 Premium</h1>
            <p>Comprehensive guide • 4,000 original exam-style questions • 10 updated domain-weighted mocks</p>
          </div>

          <div className="topActions">
            <button onClick={() => setDark(!dark)}>
              {dark ? <Sun /> : <Moon />}
            </button>
            <button onClick={reset}>
              <RotateCcw />
            </button>
          </div>
        </header>

        <section className="heroCards">
          <Metric
            icon={<Trophy />}
            title="Practice Score"
