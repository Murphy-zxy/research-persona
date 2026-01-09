
import React, { useState } from 'react';
import { QUESTIONS } from '../constants';
import { ResearchScores } from '../types';

interface Props {
  onComplete: (scores: ResearchScores) => void;
}

const Quiz: React.FC<Props> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentRatings, setCurrentRatings] = useState<Record<string, number>>({ 'a': 3, 'b': 3, 'c': 3 });
  const [accumulatedScores, setAccumulatedScores] = useState<ResearchScores>({
    theory: 0, breadth: 0, risk: 0, collaboration: 0, exploration: 0, labType: 0, modelFocus: 0, policyFocus: 0
  });

  const handleNext = () => {
    const q = QUESTIONS[currentIndex];
    const keys = Object.keys(accumulatedScores) as (keyof ResearchScores)[];
    const nextScores = { ...accumulatedScores };

    ['a', 'b', 'c'].forEach(id => {
      const rating = currentRatings[id];
      const multiplier = rating - 3;
      const weights = q.options.find(o => o.id === id)!.weights;
      keys.forEach(k => {
        nextScores[k] += weights[k] * multiplier;
      });
    });

    if (currentIndex < QUESTIONS.length - 1) {
      setAccumulatedScores(nextScores);
      setCurrentIndex(currentIndex + 1);
      setCurrentRatings({ 'a': 3, 'b': 3, 'c': 3 });
    } else {
      onComplete(nextScores);
    }
  };

  const currentQuestion = QUESTIONS[currentIndex];
  const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;

  return (
    <div className="max-w-3xl w-full mx-auto p-8 md:p-14 bg-white border border-black/10 rounded-[2.5rem] shadow-2xl relative overflow-hidden transition-all">
      <div className="mb-16">
        <div className="flex justify-between items-end mb-4">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] mono-font text-black/30">
            SEQUENCE_METER: {currentIndex + 1} / {QUESTIONS.length}
          </span>
          <span className="text-[10px] mono-font font-bold text-black/60">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-slate-50 h-[1px]">
          <div 
            className="bg-black h-full transition-all duration-700 ease-in-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <h2 className="text-3xl md:text-4xl font-black text-black mb-16 leading-tight tracking-tighter serif-font">
        {currentQuestion.text}
      </h2>

      <div className="space-y-14 mb-20">
        {currentQuestion.options.map((option) => (
          <div key={option.id} className="space-y-5">
            <p className="text-[11px] font-black text-black/60 uppercase tracking-widest px-1">
              {option.text}
            </p>
            <div className="flex justify-between items-center gap-1.5 md:gap-3">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  onClick={() => setCurrentRatings(prev => ({ ...prev, [option.id]: val }))}
                  className={`flex-grow h-14 rounded-xl border-2 transition-all flex items-center justify-center font-bold text-[10px] mono-font ${
                    currentRatings[option.id] === val 
                    ? 'bg-black border-black text-white shadow-xl scale-[1.05] z-10' 
                    : 'bg-white border-slate-50 text-black/20 hover:border-black/10'
                  }`}
                >
                  <span className="hidden md:inline">{val === 3 ? 'NEUTRAL' : val === 5 ? 'STRONG' : val === 1 ? 'WEAK' : val}</span>
                  <span className="md:hidden">{val}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-10">
        <button
          onClick={handleNext}
          className="w-full py-6 bg-black rounded-xl text-white font-black uppercase tracking-[0.6em] text-[11px] hover:bg-slate-800 transition-all active:scale-[0.98] group flex items-center justify-center gap-4 shadow-xl"
        >
          {currentIndex < QUESTIONS.length - 1 ? 'Execute Next Phase' : 'Compile Final Identity'}
          <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Quiz;
