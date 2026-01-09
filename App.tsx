
import React, { useState, useCallback } from 'react';
import { AppState, ResearchScores, PersonaAnalysis } from './types';
import Quiz from './components/Quiz';
import ResultView from './components/ResultView';
import { analyzeResearchPersona } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.WELCOME);
  const [scores, setScores] = useState<ResearchScores | null>(null);
  const [analysis, setAnalysis] = useState<PersonaAnalysis | null>(null);
  const [selfDescription, setSelfDescription] = useState('');

  const startQuiz = () => setState(AppState.QUIZ);

  const handleQuizComplete = useCallback(async (finalScores: ResearchScores) => {
    setScores(finalScores);
    setState(AppState.ANALYZING);

    try {
      const result = await analyzeResearchPersona(finalScores, selfDescription);
      setAnalysis(result);
      setState(AppState.RESULT);
    } catch (err) {
      console.error(err);
      setState(AppState.WELCOME);
    }
  }, [selfDescription]);

  const reset = () => {
    setScores(null);
    setAnalysis(null);
    setState(AppState.WELCOME);
    setSelfDescription('');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-black selection:text-white">
      <header className="py-10 px-10 flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-black tracking-tighter serif-font uppercase">Research Persona</h1>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-black rounded-full"></div>
            <p className="text-[10px] text-black/30 font-bold uppercase tracking-[0.4em]">Researcher ID Protocol</p>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-8">
        {state === AppState.WELCOME && (
          <div className="w-full max-w-xl space-y-16 animate-in fade-in duration-1000">
            <div className="space-y-6">
              <h2 className="text-6xl font-black text-black leading-[0.9] tracking-tighter serif-font">
                Map your academic taste.<br />
                Draw your research persona.
              </h2>
              <p className="text-lg text-black/40 font-medium leading-relaxed max-w-sm italic">
                完成你的研究人格分析，获取专属Research ID Card。
              </p>
            </div>

            <div className="space-y-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/20 block px-1">Identity Manifest (Optional)</label>
                <textarea 
                  value={selfDescription}
                  onChange={(e) => setSelfDescription(e.target.value)}
                  placeholder="在此输入你的研究兴趣或学术追求，AI 将其融入身份建模..."
                  className="w-full h-28 p-6 rounded-2xl resize-none text-base font-medium border border-slate-100 hover:border-black/10 focus:border-black transition-all outline-none"
                />
              </div>
              <button
                onClick={startQuiz}
                className="w-full py-6 bg-black text-white rounded-xl font-black text-sm uppercase tracking-[0.4em] hover:bg-slate-800 transition-all shadow-xl active:scale-[0.98] relative overflow-hidden group"
              >
                <span className="relative z-10">开始深度测算</span>
                <div className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              </button>
            </div>

            <div className="flex justify-between items-center opacity-10">
              {['MODALITY', 'MODELING', 'POLICY', 'GENESIS'].map(t => (
                <span key={t} className="text-[9px] font-black tracking-[0.6em] mono-font uppercase">{t}</span>
              ))}
            </div>
          </div>
        )}

        {state === AppState.QUIZ && <Quiz onComplete={handleQuizComplete} />}

        {state === AppState.ANALYZING && (
          <div className="text-center space-y-16">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 border border-slate-100 rounded-full"></div>
              <div className="absolute inset-0 border border-black rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-black mono-font animate-pulse">AI</span>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-black serif-font uppercase tracking-widest">建模中...</h2>
              <p className="text-[10px] font-bold text-black/20 uppercase tracking-[0.4em] animate-pulse">
                Synchronizing Intellectual Dimensions
              </p>
            </div>
          </div>
        )}

        {state === AppState.RESULT && analysis && scores && (
          <ResultView analysis={analysis} scores={scores} onReset={reset} />
        )}
      </main>

      <footer className="py-16 px-12 flex justify-between items-center opacity-20 text-[9px] font-black uppercase tracking-[0.5em] mono-font">
        <div>System_Type: G-NNA_v3.2</div>
        <div>© 2024 Lab_Persona</div>
      </footer>
    </div>
  );
};

export default App;
