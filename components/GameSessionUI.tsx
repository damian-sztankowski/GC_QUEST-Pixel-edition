
import React, { useState, useEffect } from 'react';
import { CloudRole, Level, Question, GameState } from '../types';
import { generateQuestion, getGeminiFeedback } from '../services/geminiService';
import { LEVELS } from '../constants';
import Avatar from './Avatar';
import { soundService } from '../services/soundService';
import PuzzleStage from './PuzzleStage';

interface GameSessionUIProps {
  role: CloudRole;
  onGameEnd: (score: number) => void;
}

const QUESTIONS_PER_LEVEL = 10;

const GameSessionUI: React.FC<GameSessionUIProps> = ({ role, onGameEnd }) => {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [currentQuestionInLevel, setCurrentQuestionInLevel] = useState(1);
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1200); 
  const [isAnswering, setIsAnswering] = useState(false);
  const [mode, setMode] = useState<'QUESTION' | 'PUZZLE'>('QUESTION');

  const level = LEVELS[currentLevelIdx];
  const maxTime = 1200;

  useEffect(() => {
    if (mode === 'QUESTION') {
      loadNewQuestion();
    }
  }, [currentLevelIdx, currentQuestionInLevel, mode]);

  useEffect(() => {
    if (timeLeft <= 0) {
      soundService.playIncorrect();
      onGameEnd(score);
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, score, onGameEnd]);

  const loadNewQuestion = async () => {
    setLoading(true);
    setFeedback(null);
    setSelectedOption(null);
    try {
      const q = await generateQuestion(role, level);
      setQuestion(q);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (index: number) => {
    if (selectedOption !== null || isAnswering) return;
    
    setSelectedOption(index);
    setIsAnswering(true);
    const correct = index === question?.correctIndex;
    
    if (correct) {
      setScore(prev => prev + 100);
      soundService.playCorrect();
    } else {
      soundService.playIncorrect();
    }

    try {
      const fb = await getGeminiFeedback(role, question?.text || '', question?.options[index] || '', correct);
      setFeedback(fb);
    } catch (err) {
      setFeedback(correct ? "CRITICAL_HIT! DATA_FLOW_STABILIZED." : "SYSTEM_BREACH! ACCESS_DENIED.");
    } finally {
      setIsAnswering(false);
    }
  };

  const nextStep = () => {
    soundService.playClick();
    if (currentQuestionInLevel < QUESTIONS_PER_LEVEL) {
      setCurrentQuestionInLevel(prev => prev + 1);
    } else {
      // Trigger Puzzle Mode instead of direct next chapter
      setMode('PUZZLE');
    }
  };

  const handlePuzzleComplete = (bonus: number) => {
    setScore(s => s + bonus);
    setMode('QUESTION');
    if (currentLevelIdx < LEVELS.length - 1) {
      setCurrentLevelIdx(prev => prev + 1);
      setCurrentQuestionInLevel(1);
    } else {
      onGameEnd(score + bonus + Math.floor(timeLeft * 2));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const timePercentage = (timeLeft / maxTime) * 100;
  const stageProgressPercentage = (currentQuestionInLevel / QUESTIONS_PER_LEVEL) * 100;

  if (loading && mode === 'QUESTION') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] pixel-font">
        <div className="w-20 h-20 border-8 border-white border-t-blue-500 animate-spin mb-10 shadow-[8px_8px_0_#000]"></div>
        <p className="text-xl animate-pulse text-white uppercase">Syncing_Chapter_Data...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl space-y-10 animate-in fade-in duration-500 pb-12">
      {/* HUD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="pixel-box p-4 flex items-center space-x-4 bg-[#111]">
          <Avatar role={role} size="sm" animate={false} />
          <div className="pixel-font">
            <div className="text-[10px] text-slate-400 font-black">PLAYER</div>
            <div className="text-sm text-blue-400">CDL_QUESTER</div>
          </div>
        </div>
        
        <div className="pixel-box p-4 pixel-font bg-[#111]">
          <div className="flex justify-between items-center mb-2">
            <div className="text-[10px] text-slate-400 font-black">CHAPTER_{currentLevelIdx + 1}</div>
            <div className="text-[10px] text-white">{currentQuestionInLevel}/{QUESTIONS_PER_LEVEL}</div>
          </div>
          <div className="pixel-progress-container h-4 border-2">
            <div className="pixel-progress-bar bg-blue-500" style={{ width: `${stageProgressPercentage}%` }} />
          </div>
        </div>

        <div className="pixel-box p-4 pixel-font bg-[#200] border-red-500 col-span-1">
          <div className="flex justify-between items-center mb-2">
            <div className="text-[10px] text-red-300 font-black">STABILITY</div>
            <div className="text-[10px] text-white">{formatTime(timeLeft)}</div>
          </div>
          <div className="pixel-progress-container border-2">
            <div 
              className={`pixel-progress-bar ${timeLeft < 240 ? 'bg-red-500' : 'bg-green-500'}`} 
              style={{ width: `${timePercentage}%` }} 
            />
          </div>
        </div>

        <div className="pixel-box p-4 pixel-font bg-[#002] border-blue-500">
          <div className="text-[10px] text-blue-300 font-black">HI-SCORE</div>
          <div className="text-sm text-white">{score.toString().padStart(6, '0')}</div>
        </div>
      </div>

      {mode === 'PUZZLE' ? (
        <div className="animate-in zoom-in duration-300">
          <PuzzleStage levelId={level.id} onComplete={handlePuzzleComplete} />
        </div>
      ) : (
        <div className="pixel-box border-8 p-0 overflow-hidden bg-[#0c0c0c] shadow-[0_16px_0_#000]">
          {/* Stage Banner */}
          <div className="bg-white text-black p-5 pixel-font flex justify-between items-center border-b-4 border-black">
            <div className="flex items-center space-x-4">
               <span className="w-4 h-4 bg-blue-500 border-2 border-black blinking"></span>
               <span className="text-sm uppercase font-black">{level.title}</span>
            </div>
            <span className="text-[10px] bg-black text-white px-3 py-1 border-2 border-black max-w-[50%] truncate font-black">
               {level.topic.toUpperCase()}
            </span>
          </div>

          <div className="p-10 space-y-10">
            {/* Question Area */}
            <div className="relative">
               <div className="absolute -top-3 left-6 px-3 bg-black text-white pixel-font text-[10px] z-10 border-2 border-white font-black">
                  SYS_QUEST_{currentQuestionInLevel}
               </div>
               <div className="p-8 border-4 border-white bg-[#111] text-2xl leading-relaxed text-white mono-font flex items-start space-x-6 min-h-[140px]">
                  <span className="text-blue-500 shrink-0 select-none animate-pulse">>>></span>
                  <p className="text-white uppercase">{question?.text}</p>
               </div>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {question?.options.map((opt, idx) => {
                let btnClass = "pixel-button p-8 pixel-font text-left flex items-start space-x-6 ";
                
                if (selectedOption === null) {
                  btnClass += "text-white";
                } else if (idx === question.correctIndex) {
                  btnClass += "bg-green-800 border-green-400 text-white scale-[1.05] z-10 shadow-[12px_12px_0_#000]";
                } else if (idx === selectedOption) {
                  btnClass += "bg-red-800 border-red-400 text-white";
                } else {
                  btnClass += "bg-black opacity-30 text-slate-600 grayscale";
                }

                return (
                  <button 
                    key={idx}
                    disabled={selectedOption !== null}
                    onClick={(e) => { e.stopPropagation(); handleAnswer(idx); }}
                    className={btnClass}
                  >
                    <span className="shrink-0 text-sm text-yellow-500 font-black">[{String.fromCharCode(65 + idx)}]</span>
                    <span className="text-sm leading-6 uppercase font-black">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Feedback Area */}
            <div className="min-h-[120px]">
              {feedback && (
                <div className={`p-8 border-4 flex items-center space-x-8 animate-in slide-in-from-bottom-4 duration-300 bg-black shadow-[8px_8px_0_#000] ${
                  selectedOption === question?.correctIndex ? 'border-green-500' : 'border-red-500'
                }`}>
                  <div className="text-5xl animate-pixel-float shrink-0 select-none">
                     {selectedOption === question?.correctIndex ? '😎' : '👾'}
                  </div>
                  <div className="pixel-font flex-1">
                    <div className={`text-[10px] mb-3 font-black ${selectedOption === question?.correctIndex ? 'text-green-400' : 'text-red-400'}`}>
                       AI_INSTRUCTOR_RESPONSE:
                    </div>
                    <div className="text-xs text-white leading-6 uppercase font-black">
                      {feedback}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Footer */}
            {selectedOption !== null && !isAnswering && (
              <div className="flex justify-center pt-6 pb-4">
                <button 
                  onClick={(e) => { e.stopPropagation(); nextStep(); }}
                  className="pixel-button bg-yellow-500 text-black px-16 py-6 pixel-font text-sm hover:scale-110 active:scale-95 transition-all shadow-[8px_8px_0_#000] font-black"
                >
                  {currentQuestionInLevel < QUESTIONS_PER_LEVEL ? "CONTINUE_IN_CHAPTER" : "HACK_CHAPTER_EXIT"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameSessionUI;
