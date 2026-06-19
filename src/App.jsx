import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, Brain, Target, ClipboardList, BarChart3, Bookmark, StickyNote, Search, Moon, Sun, RotateCcw, Timer, CheckCircle2, XCircle, Star, Trophy, Flame, ShieldCheck, Database, Rocket, Menu, X, Home, GraduationCap } from 'lucide-react';
import data from './data/cpmaiData.json';

const LS = {
  dark: 'cpmaiV2Dark', tab: 'cpmaiV2Tab', answers: 'cpmaiV2Answers', bookmarks: 'cpmaiV2Bookmarks', notes: 'cpmaiV2Notes', examAnswers: 'cpmaiV2ExamAnswers', currentExam: 'cpmaiV2CurrentExam'
};
function loadJSON(key, fallback) { try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; } }
function pct(a,b){ return b ? Math.round((a/b)*100) : 0; }
function mmss(totalSeconds){ const m=Math.floor(totalSeconds/60); const s=totalSeconds%60; return `${m}:${String(s).padStart(2,'0')}`; }

export default function App(){
  const [dark,setDark] = useState(() => localStorage.getItem(LS.dark) === 'true');
  const [tab,setTab] = useState(() => localStorage.getItem(LS.tab) || 'home');
  const [mobileOpen,setMobileOpen] = useState(false);
  const [answers,setAnswers] = useState(() => loadJSON(LS.answers, {}));
  const [examAnswers,setExamAnswers] = useState(() => loadJSON(LS.examAnswers, {}));
  const [bookmarks,setBookmarks] = useState(() => loadJSON(LS.bookmarks, []));
  const [notes,setNotes] = useState(() => localStorage.getItem(LS.notes) || '');
  const [query,setQuery] = useState('');
  const [domain,setDomain] = useState('all');
  const [difficulty,setDifficulty] = useState('all');
  const [mode,setMode] = useState('adaptive');
  const [current,setCurrent] = useState(0);
  const [examId,setExamId] = useState(() => Number(localStorage.getItem(LS.currentExam) || 1));
  const [examCurrent,setExamCurrent] = useState(0);
  const [examStarted,setExamStarted] = useState(false);
  const [examSubmitted,setExamSubmitted] = useState(false);
  const [secondsLeft,setSecondsLeft] = useState(160*60);

  useEffect(()=>{ localStorage.setItem(LS.dark, String(dark)); localStorage.setItem(LS.tab, tab); localStorage.setItem(LS.answers, JSON.stringify(answers)); localStorage.setItem(LS.examAnswers, JSON.stringify(examAnswers)); localStorage.setItem(LS.bookmarks, JSON.stringify(bookmarks)); localStorage.setItem(LS.notes, notes); localStorage.setItem(LS.currentExam, String(examId)); }, [dark,tab,answers,examAnswers,bookmarks,notes,examId]);
  useEffect(()=>{ if(!examStarted || examSubmitted) return; const t=setInterval(()=>setSecondsLeft(s=>Math.max(0,s-1)),1000); return()=>clearInterval(t); }, [examStarted,examSubmitted]);
  useEffect(()=>{ if(secondsLeft===0 && examStarted) setExamSubmitted(true); }, [secondsLeft,examStarted]);

  const questions = data.questions;
  const domains = data.domains;
  const stats = useMemo(()=> domains.map(d=>{
    const qs = questions.filter(q=>q.domain===d.id);
    const done = qs.filter(q=>answers[q.id]);
    const correct = done.filter(q=>answers[q.id]===q.answer);
    const missed = done.length - correct.length;
    return {...d,total:qs.length,done:done.length,correct:correct.length,missed,rate:pct(correct.length,done.length)};
  }), [answers]);
  const weak = [...stats].sort((a,b)=>(a.rate-b.rate)||(a.done-b.done)).slice(0,2);
  const overallDone = Object.keys(answers).length;
  const overallCorrect = questions.filter(q=>answers[q.id]===q.answer).length;
  const overallRate = pct(overallCorrect, overallDone);

  const filtered = useMemo(()=>{
    let pool = questions.filter(q => (domain==='all'||q.domain===domain) && (difficulty==='all'||q.difficulty===difficulty));
    if(query.trim()){
      const s=query.toLowerCase();
      pool=pool.filter(q => `${q.question} ${q.topic} ${q.domainName} ${q.trap} ${q.options.map(o=>o.text).join(' ')}`.toLowerCase().includes(s));
    }
    if(mode==='unanswered') pool=pool.filter(q=>!answers[q.id]);
    if(mode==='missed') pool=pool.filter(q=>answers[q.id] && answers[q.id]!==q.answer);
    if(mode==='bookmarked') pool=pool.filter(q=>bookmarks.includes(q.id));
    if(mode==='adaptive'){
      const weakIds = weak.map(w=>w.id);
      pool=[...pool].sort((a,b)=>{
        const wa=weakIds.includes(a.domain)?0:1, wb=weakIds.includes(b.domain)?0:1;
        const aa=answers[a.id]?1:0, ab=answers[b.id]?1:0;
        return wa-wb || aa-ab || a.id-b.id;
      });
    }
    return pool;
  }, [questions,domain,difficulty,query,mode,answers,bookmarks,weak]);
  const practiceQ = filtered[Math.min(current, Math.max(0, filtered.length-1))];

  const exam = data.mockExams.find(e=>e.id===examId) || data.mockExams[0];
  const examQuestions = exam.questionIds.map(id => questions.find(q=>q.id===id)).filter(Boolean);
  const examQ = examQuestions[examCurrent];
  const examKey = `exam${examId}`;
  const currentExamAnswers = examAnswers[examKey] || {};
  const examAnswered = Object.keys(currentExamAnswers).length;
  const examCorrect = examQuestions.filter(q=>currentExamAnswers[q.id]===q.answer).length;
  const examScore = pct(examCorrect, examQuestions.length);

  function nav(id){ setTab(id); setMobileOpen(false); setCurrent(0); }
  function answerPractice(qid,key){ setAnswers(prev=>({...prev,[qid]:key})); }
  function answerExam(qid,key){ setExamAnswers(prev=>({...prev,[examKey]:{...(prev[examKey]||{}),[qid]:key}})); }
  function toggleBookmark(id){ setBookmarks(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]); }
  function reset(){ if(confirm('Reset all practice answers, exam answers, bookmarks and notes?')){ setAnswers({}); setExamAnswers({}); setBookmarks([]); setNotes(''); } }
  function startExam(id){ setExamId(id); setExamStarted(true); setExamSubmitted(false); setExamCurrent(0); setSecondsLeft(160*60); setExamAnswers(prev=>({...prev,[`exam${id}`]:{}})); }

  const navItems = [['home',Home,'Dashboard'],['guide',BookOpen,'Study Guide'],['practice',Target,'Practice'],['exam',ClipboardList,'Mock Exams'],['flash',Brain,'Flashcards'],['stats',BarChart3,'Stats'],['bookmarks',Bookmark,'Bookmarks'],['notes',StickyNote,'Notes']];
  return <div className={`app ${dark?'dark':''}`}>
    <aside className={`sidebar ${mobileOpen?'open':''}`}>
      <div className="sideBrand"><div className="brandMark">AI</div><div><b>CPMAI Studio</b><span>v2 Premium</span></div><button className="mobileClose" onClick={()=>setMobileOpen(false)}><X size={18}/></button></div>
      <nav>{navItems.map(([id,Icon,label]) => <button key={id} className={tab===id?'active':''} onClick={()=>nav(id)}><Icon size={18}/>{label}</button>)}</nav>
      <div className="sideNote"><ShieldCheck size={18}/><span>4,000 original exam-style questions. No copied PMI questions.</span></div>
    </aside>
    <main className="main">
      <header className="topbar"><button className="hamb" onClick={()=>setMobileOpen(true)}><Menu/></button><div><h1>CPMAI Exam Studio v2 Premium</h1><p>Comprehensive guide • 4,000 original exam-style questions • 10 updated domain-weighted mocks</p></div><div className="topActions"><button onClick={()=>setDark(!dark)}>{dark?<Sun/>:<Moon/>}</button><button onClick={reset}><RotateCcw/></button></div></header>
      <section className="heroCards"><Metric icon={<Trophy/>} title="Practice Score" value={`${overallRate}%`} sub={`${overallDone}/4000 answered`}/><Metric icon={<Flame/>} title="Adaptive Focus" value={weak[0]?.name.split(' ').slice(0,3).join(' ')} sub="Lowest mastery area"/><Metric icon={<ClipboardList/>} title="Mock Format" value="120 Q" sub="160 minutes each"/><Metric icon={<Bookmark/>} title="Bookmarks" value={bookmarks.length} sub="Saved for review"/></section>
      {tab==='home' && <Dashboard domains={domains} stats={stats} nav={nav} weak={weak}/>} 
      {tab==='guide' && <StudyGuide/>}
      {tab==='practice' && <PracticePanel q={practiceQ} list={filtered} current={current} setCurrent={setCurrent} answer={answerPractice} selected={practiceQ?answers[practiceQ.id]:null} toggleBookmark={toggleBookmark} bookmarks={bookmarks} query={query} setQuery={setQuery} domain={domain} setDomain={setDomain} difficulty={difficulty} setDifficulty={setDifficulty} mode={mode} setMode={setMode} domains={domains}/>} 
      {tab==='exam' && <ExamPanel exams={data.mockExams} examId={examId} setExamId={setExamId} startExam={startExam} examStarted={examStarted} examSubmitted={examSubmitted} setExamSubmitted={setExamSubmitted} secondsLeft={secondsLeft} q={examQ} list={examQuestions} current={examCurrent} setCurrent={setExamCurrent} answer={answerExam} selected={examQ?currentExamAnswers[examQ.id]:null} answers={currentExamAnswers} answered={examAnswered} score={examScore} correct={examCorrect} toggleBookmark={toggleBookmark} bookmarks={bookmarks}/>} 
      {tab==='flash' && <Flashcards/>}
      {tab==='stats' && <Stats stats={stats} weak={weak} overallRate={overallRate}/>} 
      {tab==='bookmarks' && <Bookmarks questions={questions} bookmarks={bookmarks} toggleBookmark={toggleBookmark}/>} 
      {tab==='notes' && <Notes notes={notes} setNotes={setNotes}/>} 
    </main>
  </div>;
}

function Metric({icon,title,value,sub}){ return <div className="metric"><div className="metricIcon">{icon}</div><p>{title}</p><h3>{value}</h3><span>{sub}</span></div>; }
function Dashboard({domains,stats,nav,weak}){ return <section className="panel dashboard"><div className="intro"><div><span className="eyebrow">Exam cockpit</span><h2>Train for the judgement patterns, not memorized dumps.</h2><p>This version replaces repetitive templates with a larger scenario bank, stronger distractors, detailed explanations for every option, and updated 120-question mock exams.</p></div><div className="bigNumber"><b>4,000</b><span>questions</span></div></div><div className="quick"><button onClick={()=>nav('guide')}><BookOpen/> Start guide</button><button onClick={()=>nav('practice')}><Target/> Adaptive practice</button><button onClick={()=>nav('exam')}><ClipboardList/> Mock exam</button></div><h3>Recommended focus</h3><div className="focusGrid">{weak.map(w=><div className="focus" key={w.id} style={{borderColor:w.color}}><b>{w.name}</b><span>{w.rate}% score • {w.done}/{w.total} practiced</span></div>)}</div><h3>Official-domain weighted roadmap</h3><div className="roadmap">{stats.map(s=><div className="road" key={s.id}><div><b>{s.name}</b><span>{s.weight}% exam weighting • {s.total} practice questions</span></div><strong>{s.rate}%</strong><div className="bar"><i style={{width:`${Math.max(4,s.rate)}%`,background:s.color}} /></div></div>)}</div></section>; }
function StudyGuide(){ const [open,setOpen]=useState(data.studyGuide.domains[0].id); const dom=data.studyGuide.domains.find(d=>d.id===open); return <section className="guideLayout"><div className="guideMenu">{data.studyGuide.domains.map(d=><button key={d.id} className={open===d.id?'active':''} onClick={()=>setOpen(d.id)} style={{'--accent':d.color}}><span>{d.weight}%</span>{d.name}</button>)}</div><article className="panel guideArticle"><span className="eyebrow">Comprehensive study guide</span><h2 style={{color:dom.color}}>{dom.name}</h2><p className="lead">{dom.overview}</p><div className="sectionGrid">{dom.sections.map(sec=><div className="studySection" key={sec.title}><h3>{sec.title}</h3><ul>{sec.points.map(p=><li key={p}>{p}</li>)}</ul><b>Exam traps</b><div className="chips">{sec.traps.map(t=><span key={t}>{t}</span>)}</div></div>)}</div></article></section>; }
function PracticePanel(props){ return <section className="panel"><QuestionToolbar {...props}/><QuestionCard {...props} showExplanation={true}/></section>; }
function QuestionToolbar({query,setQuery,domain,setDomain,difficulty,setDifficulty,mode,setMode,domains,list}){ return <div className="toolbar"><div className="search"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search 4,000 questions by scenario, topic, trap, domain..."/></div><select value={domain} onChange={e=>setDomain(e.target.value)}><option value="all">All domains</option>{domains.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select><select value={difficulty} onChange={e=>setDifficulty(e.target.value)}><option value="all">All difficulty</option><option>Foundation</option><option>Moderate</option><option>Hard</option><option>Exam Trap</option></select><select value={mode} onChange={e=>setMode(e.target.value)}><option value="adaptive">Adaptive</option><option value="unanswered">Unanswered</option><option value="missed">Missed</option><option value="bookmarked">Bookmarked</option></select><span className="count">{list.length} results</span></div>; }
function QuestionCard({q,list,current,setCurrent,answer,selected,toggleBookmark,bookmarks,showExplanation,examSubmitted}){ if(!q) return <div className="empty">No questions match your filters.</div>; const reveal = (showExplanation && Boolean(selected)) || examSubmitted; return <div className="question"><div className="qTop"><span>Question {current+1} of {list.length} • {q.domainName} • {q.topic} • {q.difficulty}</span><button className="iconBtn" onClick={()=>toggleBookmark(q.id)}><Bookmark className={bookmarks.includes(q.id)?'filled':''}/></button></div><h2>{q.question}</h2><div className="options">{q.options.map(opt=>{ const isSel=selected===opt.key; const isCorrect=opt.key===q.answer; const cls = reveal && isCorrect ? 'correct' : reveal && isSel && !isCorrect ? 'wrong' : isSel ? 'selected' : ''; return <button key={opt.key} className={cls} onClick={()=>answer(q.id,opt.key)}><b>{opt.key}</b><span>{opt.text}</span>{reveal && isCorrect && <CheckCircle2/>}{reveal && isSel && !isCorrect && <XCircle/>}</button>; })}</div>{reveal && selected && <div className="explain"><h3>{selected===q.answer?'Correct':'Review this one'}</h3><p>{q.summary}</p>{q.options.map(opt=><div key={opt.key} className={opt.key===q.answer?'why good':'why'}><b>{opt.key}</b><span>{q.explanations[opt.key]}</span></div>)}</div>}<div className="pager"><button onClick={()=>setCurrent(Math.max(0,current-1))}>Previous</button><button onClick={()=>setCurrent(Math.min(list.length-1,current+1))}>Next</button></div></div>; }
function ExamPanel({exams,examId,setExamId,startExam,examStarted,examSubmitted,setExamSubmitted,secondsLeft,q,list,current,setCurrent,answer,selected,answers,answered,score,correct,toggleBookmark,bookmarks}){ return <section className="panel"><div className="examHead"><div><span className="eyebrow">Updated mock exams</span><h2>10 full domain-weighted mock exams</h2><p className="lead">Each mock exam has 120 questions, 160 minutes, and the same domain balance as the blueprint.</p></div><div className="timer"><Timer/> {mmss(secondsLeft)}</div></div><div className="mockGrid">{exams.map(e=><button key={e.id} className={examId===e.id?'active':''} onClick={()=>setExamId(e.id)}>{e.name}</button>)}</div><div className="examActions"><button onClick={()=>startExam(examId)}><Rocket/> Start / Restart selected mock</button>{examStarted && !examSubmitted && <button onClick={()=>setExamSubmitted(true)}><CheckCircle2/> Submit exam</button>}</div>{examStarted && <div><div className="examProgress"><span>{answered}/{list.length} answered</span><span>{examSubmitted?`Score ${score}% (${correct}/${list.length})`:'Explanations hidden until submit'}</span></div><QuestionCard q={q} list={list} current={current} setCurrent={setCurrent} answer={answer} selected={selected} toggleBookmark={toggleBookmark} bookmarks={bookmarks} showExplanation={false} examSubmitted={examSubmitted}/></div>}</section>; }
function Flashcards(){ const [i,setI]=useState(0); const [flip,setFlip]=useState(false); const card=data.flashcards[i]; const dom=data.domains.find(d=>d.id===card.domain); return <section className="panel center"><span className="eyebrow">Flashcards</span><h2>High-yield recall and exam traps</h2><p className="lead">Card {i+1} of {data.flashcards.length} • {dom.name}</p><button className="flash" style={{background:`linear-gradient(135deg, ${dom.color}, #111827)`}} onClick={()=>setFlip(!flip)}>{flip?card.back:card.front}</button><div className="pager centerPager"><button onClick={()=>{setI(Math.max(0,i-1));setFlip(false);}}>Previous</button><button onClick={()=>setFlip(!flip)}>{flip?'Show front':'Show answer'}</button><button onClick={()=>{setI((i+1)%data.flashcards.length);setFlip(false);}}>Next</button></div></section>; }
function Stats({stats,weak,overallRate}){ return <section className="panel"><span className="eyebrow">Performance analytics</span><h2>Weak-area recommendations</h2><p className="lead">Overall practice score: <b>{overallRate}%</b>. Next focus: <b>{weak.map(w=>w.name).join(' and ')}</b>.</p>{stats.map(s=><div className="stat" key={s.id}><div><b>{s.name}</b><span>{s.done}/{s.total} answered • {s.correct} correct • {s.missed} missed</span></div><strong>{s.rate}%</strong><div className="bar"><i style={{width:`${Math.max(3,s.rate)}%`,background:s.color}} /></div></div>)}</section>; }
function Bookmarks({questions,bookmarks,toggleBookmark}){ const saved=questions.filter(q=>bookmarks.includes(q.id)); return <section className="panel"><span className="eyebrow">Saved review</span><h2>Bookmarked questions</h2>{!saved.length && <p className="lead">No bookmarked questions yet.</p>}{saved.slice(0,500).map(q=><div className="saved" key={q.id}><button className="iconBtn" onClick={()=>toggleBookmark(q.id)}><Bookmark className="filled"/></button><div><b>Q{q.id} • {q.topic}</b><p>{q.question}</p><small>{q.summary}</small></div></div>)}</section>; }
function Notes({notes,setNotes}){ return <section className="panel"><span className="eyebrow">Offline notes</span><h2>Your CPMAI notebook</h2><p className="lead">Saved locally in this browser. Use it for missed-question patterns and exam traps.</p><textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Example: If the answer rushes to model training before problem/data/governance readiness, it is probably a trap..." /></section>; }
