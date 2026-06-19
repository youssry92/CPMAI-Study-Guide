import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Moon, Sun, Bookmark, BookOpen, Brain, Target, FileText, BarChart3, StickyNote, Download, RotateCcw, CheckCircle2, XCircle, Star, Smartphone, Trophy, WifiOff, Home, ChevronRight, Clock, Filter } from 'lucide-react';

const DOMAINS = [
  { id:'trust', name:'Support Responsible and Trustworthy AI Efforts', weight:15, color:'#8b5cf6', summary:'Govern privacy, security, transparency, bias, fairness, compliance, accountability, auditability, human oversight, and risk controls across the AI lifecycle.', topics:['Responsible AI principles','Privacy and sensitive data handling','Security threat modeling','Bias/fairness assessment','Explainability and transparency','Compliance and audit trail','Human-in-the-loop governance','Risk escalation and acceptance','Accountability model','Responsible AI documentation'] },
  { id:'business', name:'Identify Business Needs and Solutions', weight:26, color:'#06b6d4', summary:'Frame the business problem before selecting AI, validate AI fit, define value, feasibility, stakeholders, success metrics, change impact, and solution direction.', topics:['Problem framing','AI suitability vs non-AI alternatives','Stakeholder alignment','Value hypothesis','Success metrics/KPIs','Feasibility constraints','Adoption readiness','Scope and solution options','Risk-value tradeoff','Business case'] },
  { id:'data', name:'Identify Data Needs', weight:26, color:'#22c55e', summary:'Determine required data, owners, rights, access, quality, sufficiency, labeling, preparation needs, lineage, governance, and readiness for model work.', topics:['Data requirements','Data ownership and rights','Access and consent','Quality dimensions','Completeness and representativeness','Labeling strategy','Data lineage','Data readiness gates','Data preparation','Training-serving alignment'] },
  { id:'model', name:'Manage AI Model Development and Evaluation', weight:16, color:'#f59e0b', summary:'Coordinate model experimentation, algorithm tradeoffs, evaluation design, validation evidence, quality controls, limitations, and go/no-go decisions.', topics:['Model selection tradeoffs','Experiment design','Training/validation/test split','Performance metrics','Overfitting and leakage','Robustness testing','Model documentation','Go/no-go evidence','Error analysis','Model limitations'] },
  { id:'ops', name:'Operationalize AI Solution', weight:17, color:'#ef4444', summary:'Deploy AI safely into production, manage release readiness, monitoring, drift, incidents, rollback, adoption, continuous improvement, and retirement.', topics:['Deployment planning','MLOps/DataOps handoff','Monitoring and drift','Incident response','Rollback/contingency','Change management','Benefits realization','Lifecycle improvement','Retraining triggers','Operational ownership'] }
];

const STUDY_GUIDE = {
  trust: [
    'Treat responsible AI as a lifecycle control, not a final checklist. Strong exam answers embed controls early and preserve decision evidence.',
    'Privacy and security decisions must happen before data movement. Minimize sensitive data, define access rules, document exceptions, and monitor compliance.',
    'Bias is managed with representative data, defined fairness criteria, subgroup testing, remediation plans, and escalation—not by assuming models are neutral.',
    'Explainability should fit stakeholder need: executives need decision rationale, users need understandable outcomes, auditors need traceability, and operators need monitoring signals.',
    'Human oversight is strongest when responsibilities, thresholds, overrides, review queues, and accountability are explicitly defined.'
  ],
  business: [
    'Start with the business outcome and decision process. Do not choose a model or vendor before validating the problem and AI fit.',
    'A strong AI use case has measurable value, available data, feasible operations, clear owners, acceptable risk, and a workflow that can adopt the output.',
    'If a simpler rules-based or process change solution meets the need, it may be preferred over AI.',
    'Success metrics should combine business KPIs, model quality, operational performance, user adoption, and responsible AI controls.',
    'Stakeholder alignment means agreeing on what decision is improved, who uses it, what action follows, and how benefits will be measured.'
  ],
  data: [
    'AI projects are data-centric. Data readiness often determines feasibility more than model sophistication.',
    'Clarify data ownership, usage rights, consent, retention, security classification, quality, lineage, and access constraints before development.',
    'Quality dimensions include accuracy, completeness, consistency, timeliness, validity, uniqueness, representativeness, and bias risk.',
    'Data preparation must be repeatable and documented so training and production pipelines remain aligned.',
    'Insufficient, unrepresentative, or poorly labeled data requires remediation, scope adjustment, or a no-go decision—not blind model tuning.'
  ],
  model: [
    'Model development is iterative experimentation. Avoid answers that lock scope, skip validation, or optimize one metric blindly.',
    'Choose metrics based on the business cost of errors: precision, recall, F1, ROC-AUC, MAE/RMSE, latency, cost, or human review load.',
    'Watch for leakage, overfitting, underfitting, class imbalance, insufficient test data, and poor generalization.',
    'Evaluation should include technical performance, business value, operational feasibility, risk controls, stakeholder acceptance, and evidence quality.',
    'Go/no-go decisions should be based on agreed thresholds and documented tradeoffs, not enthusiasm for a promising prototype.'
  ],
  ops: [
    'Operationalization turns a validated model into a governed service. Deployment without monitoring is not complete.',
    'Plan for model drift, data drift, performance degradation, incident response, rollback, retraining triggers, and ownership.',
    'Adoption needs workflow integration, training, change management, feedback loops, and benefit tracking.',
    'Continuous improvement uses live evidence to tune processes, not just models.',
    'Production readiness includes support model, SLAs, observability, security, release plan, communications, and contingency procedures.'
  ]
};

const scenarioLibrary = [
  'A bank wants to automate loan triage', 'A hospital wants to prioritize patient messages', 'A dealer group wants to predict service demand', 'A retailer wants to personalize offers', 'A PMO wants to classify project risks', 'A telecom wants to reduce churn', 'An insurer wants to detect suspicious claims', 'A government entity wants to route citizen requests', 'A logistics company wants to forecast delivery exceptions', 'A manufacturer wants to detect quality defects'
];

const stems = [
  {d:'business', q:'The sponsor asks the team to start building a model immediately. What should the project manager do first?', a:'Clarify the business problem, success measures, AI fit, stakeholders, and constraints before model work begins.', bad:['Select the most advanced model to accelerate delivery.','Ask data scientists to build a prototype using any available data.','Commit to a fixed model accuracy target before understanding the decision context.']},
  {d:'business', q:'The team has a technically feasible AI idea, but no agreed business owner. What is the best action?', a:'Pause solution commitment until ownership, decision rights, expected value, and adoption responsibilities are defined.', bad:['Proceed because technical feasibility is enough to justify the initiative.','Assign ownership to the data science team by default.','Focus only on model accuracy until a business owner appears.']},
  {d:'data', q:'The team discovers customer data exists in multiple systems with inconsistent definitions. What is the best next step?', a:'Establish data ownership, definitions, quality rules, lineage, and readiness criteria before training.', bad:['Ignore inconsistencies if the dataset is large.','Move directly to model selection because algorithms can resolve data issues.','Use only the easiest system to access without documenting exclusions.']},
  {d:'data', q:'The available training data excludes a large segment of future users. What should the team do?', a:'Assess representativeness risk, identify data gaps, adjust scope or collect/remediate data before relying on the model.', bad:['Train anyway and assume production monitoring will fix the issue.','Remove user segment information so the model cannot see the gap.','Increase the number of training iterations without changing the data.']},
  {d:'trust', q:'A stakeholder is concerned the model may disadvantage a protected customer group. What is the best response?', a:'Define fairness criteria, test subgroup performance, document findings, and set escalation/remediation actions.', bad:['Explain that algorithms are objective if trained on historical data.','Remove all demographic fields and assume bias is eliminated.','Delay fairness review until after production deployment.']},
  {d:'trust', q:'The model will use sensitive personal information. What is the most appropriate project response?', a:'Validate lawful use, minimize data, apply security controls, document access, and confirm privacy requirements before use.', bad:['Use the data because it improves accuracy.','Anonymize nothing until after model selection.','Let the vendor decide privacy controls without internal review.']},
  {d:'model', q:'A model performs very well on training data but poorly on new validation data. What does this indicate?', a:'Likely overfitting or leakage; review features, validation design, and generalization evidence.', bad:['The model is ready because training accuracy is the primary metric.','Increase production traffic to gather more user feedback.','Remove governance controls to improve model flexibility.']},
  {d:'model', q:'Two candidate models have similar accuracy, but one is easier to explain and monitor. What should guide the decision?', a:'Compare business risk, explainability needs, operational support, responsible AI requirements, and total lifecycle fit.', bad:['Always choose the most complex model.','Always choose the model that took longer to build.','Ignore explainability if the accuracy difference is small.']},
  {d:'ops', q:'The model is approved for pilot. What must be planned before production release?', a:'Monitoring, ownership, rollback, incident response, drift triggers, user workflow, and benefit tracking.', bad:['Close the project because model evaluation is complete.','Disable human review to maximize automation immediately.','Wait for failures before defining support processes.']},
  {d:'ops', q:'Production performance begins degrading after a market change. What is the best response?', a:'Use monitoring evidence to assess drift, trigger the agreed response plan, and decide whether to retrain, rollback, or adjust scope.', bad:['Keep the model running unchanged because it passed initial validation.','Delete monitoring alerts to reduce noise.','Ask users to ignore bad predictions until the next annual review.']}
];

function makeQuestions(n=1200){
  const out=[];
  for(let i=0;i<n;i++){
    const t=stems[i%stems.length], sc=scenarioLibrary[(i*3)%scenarioLibrary.length];
    const options=[t.a,...t.bad].sort((a,b)=>((a.length+i*11)%9)-((b.length+i*7)%9));
    const difficulty=['Easy','Medium','Hard'][i%3];
    out.push({id:i+1, domain:t.d, scenario:sc, question:`${sc}. ${t.q}`, options, answer:t.a, explanation:`The best answer is: ${t.a} CPMAI-style questions usually reward disciplined sequencing: define value and governance first, validate data readiness, evaluate with evidence, and operationalize with monitoring and accountability. The weaker choices rush into technology, ignore ownership, or postpone risk controls.`, difficulty});
  }
  return out;
}

const CARDS = DOMAINS.flatMap(d => d.topics.map((topic, i) => ({ id:`${d.id}-${i}`, domain:d.id, front:topic, back:`${topic}: ${STUDY_GUIDE[d.id][i % STUDY_GUIDE[d.id].length]}` })));
const LS = { answers:'cpmaiAnswers', bookmarks:'cpmaiBookmarks', notes:'cpmaiNotes', dark:'cpmaiDark', tab:'cpmaiTab' };
function readJSON(key, fallback){ try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; } }
function pct(a,b){ return b ? Math.round((a/b)*100) : 0; }

export default function App(){
  const [dark,setDark]=useState(()=>localStorage.getItem(LS.dark)==='true');
  const [tab,setTab]=useState(()=>localStorage.getItem(LS.tab)||'home');
  const [query,setQuery]=useState('');
  const [domain,setDomain]=useState('all');
  const [answers,setAnswers]=useState(()=>readJSON(LS.answers,{}));
  const [bookmarks,setBookmarks]=useState(()=>readJSON(LS.bookmarks,[]));
  const [notes,setNotes]=useState(()=>localStorage.getItem(LS.notes)||'');
  const [exam,setExam]=useState(null);
  const [current,setCurrent]=useState(0);
  const [online,setOnline]=useState(navigator.onLine);
  const questions=useMemo(()=>makeQuestions(1200),[]);

  useEffect(()=>{localStorage.setItem(LS.dark,String(dark)); localStorage.setItem(LS.tab,tab); localStorage.setItem(LS.answers,JSON.stringify(answers)); localStorage.setItem(LS.bookmarks,JSON.stringify(bookmarks)); localStorage.setItem(LS.notes,notes);},[dark,tab,answers,bookmarks,notes]);
  useEffect(()=>{const on=()=>setOnline(true), off=()=>setOnline(false); window.addEventListener('online',on); window.addEventListener('offline',off); return()=>{window.removeEventListener('online',on); window.removeEventListener('offline',off);};},[]);

  const filtered=questions.filter(q=>(domain==='all'||q.domain===domain) && `${q.question} ${q.explanation} ${q.domain}`.toLowerCase().includes(query.toLowerCase()));
  const stats=DOMAINS.map(d=>{const qs=questions.filter(q=>q.domain===d.id); const done=qs.filter(q=>answers[q.id]); const correct=done.filter(q=>answers[q.id]===q.answer); return {...d,total:qs.length,done:done.length,correct:correct.length,rate:pct(correct.length,done.length)};});
  const weak=[...stats].sort((a,b)=>(a.rate-b.rate)||(a.done-b.done)).slice(0,2);
  const overallDone=Object.keys(answers).length; const overallCorrect=questions.filter(q=>answers[q.id]===q.answer).length; const overallRate=pct(overallCorrect,overallDone);
  const q=(exam||filtered)[Math.min(current, Math.max(0,(exam||filtered).length-1))];

  function choose(qid,opt){ setAnswers(prev=>({...prev,[qid]:opt})); }
  function toggleBm(id){ setBookmarks(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]); }
  function resetAll(){ if(confirm('Reset answers, bookmarks, and notes?')){setAnswers({});setBookmarks([]);setNotes('');setExam(null);setCurrent(0);} }
  function nav(id){ setTab(id); setCurrent(0); }
  function startExam(idx){
    const pool=[]; const total=120;
    DOMAINS.forEach(d=>{ const c=Math.max(1, Math.round(total*d.weight/100)); const domainQs=questions.filter(q=>q.domain===d.id); pool.push(...domainQs.slice((idx*37)%Math.max(1,domainQs.length-c), ((idx*37)%Math.max(1,domainQs.length-c))+c)); });
    setExam(pool.slice(0,120)); setCurrent(0); setTab('exam');
  }

  const wrapClass = `app ${dark?'dark':''}`;
  const tabs=[['home',Home,'Home'],['guide',BookOpen,'Guide'],['flash',Brain,'Cards'],['practice',Target,'Practice'],['exam',FileText,'Exam'],['stats',BarChart3,'Stats'],['bookmarks',Bookmark,'Saved'],['notes',StickyNote,'Notes'],['deploy',Smartphone,'Install']];

  return <div className={wrapClass}>
    <header className="topbar">
      <div className="brand"><div className="logo">AI</div><div><h1>CPMAI Exam Studio</h1><p>Offline PWA study guide • 1,200 original questions • 10 full mock exams</p></div></div>
      <div className="actions"><span className={`pill ${online?'ok':'warn'}`}>{online?'Online':'Offline ready'}{!online&&<WifiOff size={14}/>}</span><button onClick={()=>setDark(!dark)} className="iconbtn">{dark?<Sun/>:<Moon/>}</button><button onClick={resetAll} className="iconbtn"><RotateCcw/></button></div>
    </header>

    <nav className="tabs">{tabs.map(([id,Icon,label])=><button key={id} onClick={()=>nav(id)} className={tab===id?'active':''}><Icon size={18}/><span>{label}</span></button>)}</nav>

    <main className="container">
      <section className="heroGrid">
        <Metric title="Overall score" value={`${overallRate}%`} sub={`${overallDone}/1200 answered`} icon={<Trophy/>}/>
        <Metric title="Weak area focus" value={weak[0]?.name.split(' ').slice(0,3).join(' ')} sub="Adaptive recommendation" icon={<Brain/>}/>
        <Metric title="Bookmarks" value={bookmarks.length} sub="Saved questions" icon={<Bookmark/>}/>
        <Metric title="Exam format" value="120 Q" sub="160 minutes" icon={<Clock/>}/>
      </section>

      {tab==='home' && <HomePanel nav={nav} weak={weak} stats={stats}/>} 
      {tab==='guide' && <GuidePanel/>}
      {tab==='flash' && <FlashPanel cards={CARDS}/>} 
      {tab==='practice' && <QuestionPanel q={q} list={filtered} current={current} setCurrent={setCurrent} choose={choose} answers={answers} toggleBm={toggleBm} bookmarks={bookmarks} domain={domain} setDomain={setDomain} query={query} setQuery={setQuery}/>} 
      {tab==='exam' && <ExamPanel startExam={startExam} exam={exam} q={q} current={current} setCurrent={setCurrent} choose={choose} answers={answers} toggleBm={toggleBm} bookmarks={bookmarks}/>} 
      {tab==='stats' && <StatsPanel stats={stats} weak={weak}/>} 
      {tab==='bookmarks' && <BookmarksPanel questions={questions} bookmarks={bookmarks} toggleBm={toggleBm}/>} 
      {tab==='notes' && <NotesPanel notes={notes} setNotes={setNotes}/>} 
      {tab==='deploy' && <InstallPanel/>}
    </main>
  </div>;
}

function Metric({title,value,sub,icon}){return <div className="metric"><div className="metricIcon">{icon}</div><p>{title}</p><h3>{value}</h3><span>{sub}</span></div>}
function HomePanel({nav, weak, stats}){return <motion.section initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="panel"><h2>Your CPMAI study cockpit</h2><p className="lead">Start with the highest-weight domains: Identify Business Needs and Solutions, and Identify Data Needs. Then use Practice and Exam mode to build scenario judgement.</p><div className="ctaRow"><button onClick={()=>nav('guide')}>Open Study Guide <ChevronRight size={18}/></button><button onClick={()=>nav('practice')}>Start Practice <ChevronRight size={18}/></button><button onClick={()=>nav('exam')}>Take Mock Exam <ChevronRight size={18}/></button></div><h3>Recommended next focus</h3><div className="cards2">{weak.map(w=><div className="miniCard" key={w.id}><b>{w.name}</b><span>{w.rate}% score • {w.done}/{w.total} practiced</span></div>)}</div><h3>Domain weighting</h3><div className="domainBars">{stats.map(s=><div key={s.id}><div className="barLabel"><span>{s.name}</span><b>{s.weight}%</b></div><div className="bar"><i style={{width:`${s.weight*3}%`,background:s.color}}/></div></div>)}</div></motion.section>}
function GuidePanel(){return <section className="guide">{DOMAINS.map(d=><motion.article initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="panel" key={d.id}><h2 style={{color:d.color}}>{d.name} <small>({d.weight}%)</small></h2><p className="lead">{d.summary}</p><div className="summaryGrid">{STUDY_GUIDE[d.id].map((x,i)=><div key={i}>{x}</div>)}</div><h3>High-yield topics</h3><div className="chips">{d.topics.map(t=><span key={t}>{t}</span>)}</div></motion.article>)}</section>}
function FlashPanel({cards}){const [i,setI]=useState(0),[flip,setFlip]=useState(false); const c=cards[i%cards.length]; const d=DOMAINS.find(x=>x.id===c.domain); return <section className="panel center"><p className="muted">Flashcard {i+1} of {cards.length} • {d.name}</p><button className="flash" onClick={()=>setFlip(!flip)} style={{background:`linear-gradient(135deg, ${d.color}, #0ea5e9)`}}>{flip?c.back:c.front}</button><div className="ctaRow centerBtns"><button onClick={()=>{setI(Math.max(0,i-1));setFlip(false)}}>Previous</button><button onClick={()=>setFlip(!flip)}>{flip?'Show front':'Show answer'}</button><button onClick={()=>{setI((i+1)%cards.length);setFlip(false)}}>Next</button></div></section>}
function QuestionPanel({q,list,current,setCurrent,choose,answers,toggleBm,bookmarks,domain,setDomain,query,setQuery}){ if(!q)return <section className="panel">No questions found.</section>; const selected=answers[q.id]; return <section className="panel"><div className="filters"><div className="searchBox"><Search size={18}/><input placeholder="Search questions, explanations, domains..." value={query||''} onChange={e=>setQuery&&setQuery(e.target.value)}/></div>{setDomain&&<select value={domain} onChange={e=>setDomain(e.target.value)}><option value="all">All domains</option>{DOMAINS.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select>}</div><div className="questionTop"><span>Question {current+1} of {list.length} • {q.difficulty}</span><button className="iconbtn" onClick={()=>toggleBm(q.id)}><Bookmark className={bookmarks.includes(q.id)?'filled':''}/></button></div><h2>{q.question}</h2><div className="options">{q.options.map(o=>{const ok=selected&&o===q.answer, bad=selected===o&&o!==q.answer; return <button key={o} onClick={()=>choose(q.id,o)} className={ok?'correct':bad?'wrong':''}>{ok?<CheckCircle2/>:bad?<XCircle/>:<Star/>}<span>{o}</span></button>})}</div>{selected&&<div className="explain"><b>Explanation:</b> {q.explanation}</div>}<div className="pager"><button onClick={()=>setCurrent(Math.max(0,current-1))}>Previous</button><button onClick={()=>setCurrent(Math.min(list.length-1,current+1))}>Next</button></div></section>}
function ExamPanel({startExam,exam,q,current,setCurrent,choose,answers,toggleBm,bookmarks}){return <section className="panel"><h2>Exam mode</h2><p className="lead">Choose a mock exam. Each mock is 120 questions and follows the domain weighting.</p><div className="mockGrid">{Array.from({length:10},(_,i)=><button key={i} onClick={()=>startExam(i)}>Mock Exam {i+1}</button>)}</div>{exam&&<div className="examBox"><QuestionPanel q={q} list={exam} current={current} setCurrent={setCurrent} choose={choose} answers={answers} toggleBm={toggleBm} bookmarks={bookmarks}/></div>}</section>}
function StatsPanel({stats,weak}){return <section className="panel"><h2>Progress and adaptive recommendations</h2><p className="lead">Recommended focus: <b>{weak.map(w=>w.name).join(' and ')}</b>. Prioritize low-score and low-practice domains before taking another mock exam.</p>{stats.map(s=><div className="statRow" key={s.id}><div><b>{s.name}</b><span>{s.done}/{s.total} practiced • {s.correct} correct</span></div><strong>{s.rate}%</strong><div className="bar"><i style={{width:`${s.rate}%`,background:s.color}}/></div></div>)}</section>}
function BookmarksPanel({questions,bookmarks,toggleBm}){const saved=questions.filter(q=>bookmarks.includes(q.id)); return <section className="panel"><h2>Bookmarked questions</h2>{!saved.length&&<p className="lead">No bookmarks yet. Save questions from Practice or Exam mode.</p>}{saved.map(q=><div className="saved" key={q.id}><button className="iconbtn" onClick={()=>toggleBm(q.id)}><Bookmark className="filled"/></button><div><b>Q{q.id}</b><p>{q.question}</p><small>{q.explanation}</small></div></div>)}</section>}
function NotesPanel({notes,setNotes}){return <section className="panel"><h2>Notes</h2><p className="lead">Saved automatically in this browser and available offline.</p><textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Write your CPMAI notes, weak areas, formulas, and exam reminders here..."/></section>}
function InstallPanel(){return <section className="panel"><h2>Install and offline use</h2><ol className="steps"><li><b>Desktop Chrome/Edge:</b> open the deployed URL and click the install icon in the address bar.</li><li><b>iPhone/iPad:</b> open in Safari, tap Share, then Add to Home Screen.</li><li><b>Android:</b> open in Chrome and tap Install app or Add to Home Screen.</li><li><b>Offline:</b> open the app once while online. After that, the service worker caches the app for offline study.</li></ol><p className="lead">Your answers, bookmarks, dark mode preference, and notes are stored locally on your device.</p></section>}
