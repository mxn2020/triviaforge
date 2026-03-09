import { useState, useCallback } from 'react';
import { useAction, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

interface Q { question: string; options: string[]; correctIndex: number; explanation: string; }
interface Quiz { topic: string; numQuestions: number; difficulty: string; questions: Q[]; }

function QuizPage() {
  const [topic, setTopic] = useState(''); const [num, setNum] = useState(10); const [diff, setDiff] = useState('mixed');
  const [loading, setLoading] = useState(false); const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({}); const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const generate = useAction(api.ai.generateQuiz); const save = useMutation(api.functions.saveQuiz);

  const handleGenerate = useCallback(async () => {
    if (!topic.trim()) return; setLoading(true); setAnswers({}); setRevealed(new Set());
    try {
      const r = await generate({ topic: topic.trim(), numQuestions: num, difficulty: diff }); setQuiz(r); await save(r);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, [topic, num, diff, generate, save]);

  const selectAnswer = (qi: number, oi: number) => {
    if (revealed.has(qi)) return;
    setAnswers(a => ({ ...a, [qi]: oi }));
    setRevealed(r => new Set(r).add(qi));
  };

  const score = quiz ? Object.entries(answers).filter(([qi, oi]) => quiz.questions[Number(qi)]?.correctIndex === oi).length : 0;

  return (
    <div className="mc"><div className="pg">
      <h1 className="title">Forge Your <span className="a">Trivia</span></h1>
      <p className="sub">Enter any topic and get an instant pub quiz with answers and explanations.</p>
      <input className="inp" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. 90s Hip Hop, Ancient Rome, Space Exploration..." />
      <div className="chips">
        {['mixed', 'easy', 'medium', 'hard'].map(d => (<button key={d} className={`chip ${diff === d ? 'sel' : ''}`} onClick={() => setDiff(d)}>{d}</button>))}
        {[5, 10, 15, 20].map(n => (<button key={n} className={`chip ${num === n ? 'sel' : ''}`} onClick={() => setNum(n)}>{n}Q</button>))}
      </div>
      <button className="btn" disabled={!topic.trim() || loading} onClick={handleGenerate}>{loading ? '⏳ Forging...' : '🎲 Generate Quiz'}</button>
      {loading && <div className="ld"><span /><span /><span /></div>}
      {quiz && !loading && <>
        {Object.keys(answers).length === quiz.questions.length && <div className="score">{score}/{quiz.questions.length} Correct!</div>}
        {quiz.questions.map((q, i) => (
          <div key={i} className="qcard">
            <div className="qn">Question {i + 1} of {quiz.questions.length}</div>
            <div className="qt">{q.question}</div>
            <div className="opts">{q.options.map((o, j) => (
              <button key={j} className={`opt ${revealed.has(i) ? (j === q.correctIndex ? 'correct' : answers[i] === j ? 'wrong' : '') : answers[i] === j ? 'selected' : ''}`} onClick={() => selectAnswer(i, j)}>{o}</button>
            ))}</div>
            {revealed.has(i) && <div className="expl">💡 {q.explanation}</div>}
          </div>
        ))}
      </>}
    </div></div>
  );
}

function App() {
  return (<BrowserRouter><div className="app">
    <header className="hdr"><a href="/"><span style={{ fontSize: '1.5rem' }}>🎲</span><div><h1>TriviaForge</h1></div></a></header>
    <Routes><Route path="/" element={<QuizPage />} /></Routes>
    <footer className="ftr">© {new Date().getFullYear()} TriviaForge — An AVS Media App.</footer>
  </div></BrowserRouter>);
}
export default App;
