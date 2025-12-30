import React, { useState, useEffect } from 'react';
import { CloudRole, Level, Question, DifficultyLevel } from '../types';
import { generateQuestion, getGeminiFeedback, generateHint } from '../services/geminiService';
import { LEVELS, DIFFICULTY_SETTINGS } from '../constants';
import Avatar from './Avatar';
import { soundService } from '../services/soundService';
import { notificationService } from '../services/notificationService';
import PuzzleStage from './PuzzleStage';
import ChapterMap from './ChapterMap';

interface GameSessionUIProps {
  role: CloudRole;
  difficulty: DifficultyLevel;
  playerName: string;
  onGameEnd: (score: number) => void;
  initialLevelIdx?: number;
}

const QUESTIONS_PER_LEVEL = 10;
const HINT_COST = 25;
const SKIP_COST = 150;
const BASE_MAX_TIME = 1200;

const GameSessionUI: React.FC<GameSessionUIProps> = ({ role, difficulty, playerName, onGameEnd, initialLevelIdx = 0 }) => {
  const diffSetting = DIFFICULTY_SETTINGS[difficulty];
  const maxTime = Math.floor(BASE_MAX_TIME * diffSetting.timeMultiplier);
  
  const [currentLevelIdx, setCurrentLevelIdx] = useState(initialLevelIdx);
  const [currentQuestionInLevel, setCurrentQuestionInLevel] = useState(1);
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(maxTime); 
  const [isAnswering, setIsAnswering] = useState(false);
  const [mode, setMode] = useState<'QUESTION' | 'PUZZLE' | 'MAP'>('QUESTION');

  const level = LEVELS[currentLevelIdx];

  useEffect(() => {
    if (mode === 'QUESTION') {
      soundService.setBGMSpeed(false);
      loadNewQuestion();
    } else if (mode === 'PUZZLE') {
      soundService.setBGMSpeed(true);
      notificationService.notify('PUZZLE_PHASE', `INITIATING_${level.puzzleType}_PROTOCOLS`, 'ACHIEVEMENT');
    }
  }, [currentLevelIdx, currentQuestionInLevel, mode]);

  useEffect(() => {
    if (timeLeft <= 0) {
      soundService.playIncorrect();
      notificationService.notify('STABILITY_CRITICAL', 'NODE_OFFLINE_ZERO_POWER', 'ERROR');
      onGameEnd(score);
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, score, onGameEnd]);

  const loadNewQuestion = async () => {
    setLoading(true);
    setFeedback(null);
    setHint(null);
    setSelectedOption(null);
    try {
      const q = await generateQuestion(role, level);
      setQuestion(q);
    } catch (err) {
      console.error(err);
      notificationService.notify('COMM_FAILURE', 'DATA_STREAM_INTERRUPTED', 'ERROR');
      setQuestion({
        text: "EMERGENCY FALLBACK: Which computing model offers the most infrastructure control?",
        options: ["IaaS", "PaaS", "SaaS", "Serverless"],
        correctIndex: 0,
        explanation: "Infrastructure as a Service (IaaS) provides maximum control over virtual machines and network resources."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestHint = async () => {
    if (score < HINT_COST || hint || isHintLoading || selectedOption !== null) return;
    
    soundService.playClick();
    setIsHintLoading(true);
    setScore(prev => prev - HINT_COST);
    
    try {
      const clue = await generateHint(question?.text || '', level.topic);
      setHint(clue);
      soundService.playPowerUp();
      notificationService.notify('HINT_ACQUIRED', `-${HINT_COST}_CREDITS_SPENT`, 'INFO');
    } catch (err) {
      setHint("SYSTEM_ERROR: CLUE_FILE_CORRUPTED.");
      notificationService.notify('HINT_ERROR', 'ENCRYPTION_OVER_RIDE_FAILED', 'ERROR');
    } finally {
      setIsHintLoading(false);
    }
  };

  const handleSkipQuestion = () => {
    if (score < SKIP_COST || selectedOption !== null) return;
    
    soundService.playSkip();
    setScore(prev => prev - SKIP_COST);
    notificationService.notify('NODE_BYPASSED', `-${SKIP_COST}_CREDITS_SPENT`, 'ERROR');
    nextStep();
  };

  const handleAnswer = async (index: number) => {
    if (selectedOption !== null || isAnswering) return;
    
    setSelectedOption(index);
    setIsAnswering(true);
    const correct = index === question?.correctIndex;
    
    if (correct) {
      const reward = Math.floor(100 * diffSetting.scoreMultiplier);
      const timeBonus = diffSetting.timeBonus || 0;
      setScore(prev => prev + reward);
      setTimeLeft(prev => Math.min(maxTime, prev + timeBonus));
      soundService.playCorrect();
      notificationService.notify('CORRECT', `+${reward}_CREDITS | +${timeBonus}S_STABILITY`, 'SUCCESS');
    } else {
      soundService.playIncorrect();
      notificationService.notify('BREACH', 'SYSTEM_STABILITY_DECREASED', 'ERROR');
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
      setMode('PUZZLE');
    }
  };

  const handlePuzzleComplete = (bonus: number) => {
    setMode('QUESTION');
    const adjustedBonus = Math.floor(bonus * diffSetting.scoreMultiplier);
    const finalScore = score + adjustedBonus;
    setScore(finalScore);
    notificationService.notify('CHAPTER_SYNCED', `LEVEL_BONUS:_${adjustedBonus}`, 'SUCCESS');
    
    if (currentLevelIdx < LEVELS.length - 1) {
      setCurrentLevelIdx(prev => prev + 1);
      setCurrentQuestionInLevel(1);
    } else {
      onGameEnd(finalScore + Math.floor(timeLeft * 2 * diffSetting.scoreMultiplier));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const timePercentage = (timeLeft / maxTime) * 100;
  const stageProgressPercentage = (currentQuestionInLevel / QUESTIONS_PER_LEVEL) * 100;

  return (
    <div className="flex-1 w-full max-w-7xl flex flex-col px-4 pb-8 space-y-4">
      {/* Top Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        {/* Nickname Box */}
        <div className="pixel-box p-3 flex items-center space-x-4 bg-[#111] border-2">
          <div className="shrink-0 border-2 border-slate-700 bg-black p-0.5 shadow-[2px_2px_0_#000]">
            <Avatar role={role} size="sm" animate={false} />
          </div>
          <div className="pixel-font leading-none flex flex-col justify-between h-full py-0.5 overflow-hidden">
            <div>
              <div className="text-[6px] text-yellow-500 uppercase font-black mb-1">USER_NICKNAME</div>
              <div className="text-[10px] text-white font-bold tracking-tight uppercase break-all">{playerName}</div>
            </div>
            <div className="border-t border-slate-800 pt-2 mt-1">
              <div className="text-[6px] text-slate-400 uppercase font-black mb-1">DIFFICULTY</div>
              <div className="text-[9px] text-blue-400 font-bold truncate">{diffSetting.label}</div>
            </div>
          </div>
        </div>
        
        {/* Progress Box */}
        <button 
          onClick={() => setMode(mode === 'MAP' ? 'QUESTION' : 'MAP')}
          className={`pixel-box p-3 pixel-font transition-all text-left border-2 ${mode === 'MAP' ? 'bg-blue-900 border-white' : 'bg-[#111] hover:bg-slate-800'}`}
        >
          <div className="flex flex-col leading-none mb-1">
            <div className="text-[8px] text-slate-400 mb-1 uppercase font-black">CH_{currentLevelIdx + 1}</div>
            <div className="text-[10px] text-white flex justify-between font-bold">
              <span>PROG:</span> 
              <span>{currentQuestionInLevel}/{QUESTIONS_PER_LEVEL}</span>
            </div>
          </div>
          <div className="pixel-progress-container h-2 border-[2px] mt-1">
            <div className="pixel-progress-bar bg-blue-500" style={{ width: `${stageProgressPercentage}%` }} />
          </div>
        </button>

        {/* Stability Box */}
        <div className="pixel-box p-3 pixel-font bg-[#200] border-red-500 border-2 leading-none flex flex-col items-center justify-center">
          <div className="w-full flex justify-between items-center mb-2 px-1">
            <div className="text-[8px] text-red-300 uppercase font-black">STABILITY</div>
            <div className="text-[10px] text-white font-bold tracking-widest">{formatTime(timeLeft)}</div>
          </div>
          <div className="w-full px-1">
            <div className="pixel-progress-container h-3 border-[2px] w-full">
              <div 
                className={`pixel-progress-bar ${timeLeft < (maxTime * 0.2) ? 'bg-red-500' : 'bg-green-500'}`} 
                style={{ width: `${timePercentage}%` }} 
              />
            </div>
          </div>
        </div>

        {/* Credits Box */}
        <div className="pixel-box p-3 pixel-font bg-[#002] border-blue-500 border-2 leading-none flex flex-col items-center justify-center">
          <div className="w-full text-left mb-1 px-1">
            <div className="text-[8px] text-blue-300 uppercase font-black">CREDITS</div>
          </div>
          <div className="text-2xl text-white font-bold tracking-widest">{score.toString().padStart(6, '0')}</div>
        </div>
      </div>

      {/* Main Game Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {loading && mode === 'QUESTION' ? (
          <div className="flex flex-col items-center justify-center h-full pixel-font text-center bg-black/50 border-8 border-white">
            <div className="w-16 h-16 border-8 border-white border-t-blue-500 animate-spin mb-6 shadow-[8px_8px_0_#000]"></div>
            <p className="text-lg animate-pulse text-white uppercase font-black">Syncing_Chapter_Nodes...</p>
          </div>
        ) : mode === 'MAP' ? (
          <div className="animate-in zoom-in duration-300 flex-1 overflow-y-auto">
             <div className="pixel-box border-8 p-8 bg-black h-full">
                <h2 className="text-4xl pixel-font text-white mb-8 text-center font-black">CLOUD_MAP</h2>
                <ChapterMap currentLevelIdx={currentLevelIdx} />
                <div className="mt-12 flex justify-center">
                   <button 
                     onClick={() => setMode('QUESTION')}
                     className="pixel-button bg-blue-600 text-white px-12 py-4 pixel-font text-xs font-black shadow-[6px_6px_0_#000]"
                   >
                     RESUME_QUEST
                   </button>
                </div>
             </div>
          </div>
        ) : mode === 'PUZZLE' ? (
          <div className="animate-in zoom-in duration-300 flex-1 flex flex-col">
            <PuzzleStage levelId={level.id} difficulty={difficulty} onComplete={handlePuzzleComplete} />
          </div>
        ) : (
          <div className="pixel-box border-8 p-0 overflow-hidden bg-[#0c0c0c] flex flex-col flex-1 shadow-[12px_12px_0_#000]">
            <div className="bg-white text-black p-3 md:p-4 pixel-font flex justify-between items-center border-b-4 border-black shrink-0">
              <div className="flex items-center space-x-3">
                 <span className="w-3 h-3 bg-blue-500 border-2 border-black blinking"></span>
                 <span className="text-sm uppercase font-black tracking-tight">{level.title.toUpperCase()}</span>
              </div>
              <span className="text-[10px] bg-black text-white px-3 py-1 border-2 border-black font-black uppercase">
                 SECTION {currentLevelIdx + 1}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col space-y-6">
              <div className="shrink-0">
                 <div className="p-8 md:p-12 border-4 border-white bg-[#111] text-lg leading-relaxed text-white mono-font flex flex-col space-y-4 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                    <div className="flex items-start space-x-6">
                      <span className="text-blue-500 shrink-0 select-none animate-pulse text-3xl md:text-4xl">>>></span>
                      <p className="text-white uppercase font-black text-xl md:text-3xl tracking-tight leading-tight">{question?.text}</p>
                    </div>
                    
                    {hint && (
                      <div className="border-t-2 border-dashed border-purple-500/50 pt-4 mt-2 animate-in slide-in-from-top-2 duration-300">
                        <div className="pixel-font text-[8px] text-purple-400 mb-2 font-black uppercase">ANALYZER_HINT:</div>
                        <p className="text-purple-300 text-sm md:text-xl uppercase italic font-bold">"{hint}"</p>
                      </div>
                    )}
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                {question?.options.map((opt, idx) => {
                  let btnClass = "pixel-button p-6 md:p-8 pixel-font text-left flex items-start space-x-6 border-4 transition-all duration-75 h-full ";
                  
                  if (selectedOption === null) {
                    btnClass += "text-white bg-[#222] border-white hover:bg-[#333] hover:scale-[1.01] shadow-[4px_4px_0_#000]";
                  } else if (idx === question.correctIndex) {
                    btnClass += "bg-green-800 border-green-400 text-white scale-[1.02] z-10 shadow-[6px_6px_0_#000]";
                  } else if (idx === selectedOption) {
                    btnClass += "bg-red-800 border-red-400 text-white shadow-[4px_4px_0_#000]";
                  } else {
                    btnClass += "bg-black opacity-30 text-slate-600 grayscale border-slate-800 shadow-none";
                  }

                  return (
                    <button 
                      key={idx}
                      disabled={selectedOption !== null}
                      onClick={(e) => { e.stopPropagation(); handleAnswer(idx); }}
                      className={btnClass}
                    >
                      <span className="shrink-0 text-base md:text-lg text-yellow-500 font-black">[{String.fromCharCode(65 + idx)}]</span>
                      <span className="text-xs md:text-sm leading-snug uppercase font-black">{opt}</span>
                    </button>
                  );
                })}
              </div>

              <div className="shrink-0 pt-4">
                {feedback ? (
                  <div className={`p-8 border-4 flex flex-col space-y-6 bg-black shadow-[8px_8px_0_#000] animate-in slide-in-from-bottom-4 duration-300 ${
                    selectedOption === question?.correctIndex ? 'border-green-500' : 'border-red-500'
                  }`}>
                    <div className="pixel-font">
                      <div className={`text-[10px] mb-3 font-black uppercase ${selectedOption === question?.correctIndex ? 'text-green-400' : 'text-red-400'}`}>
                         [ ANALYZER_FEEDBACK ]
                      </div>
                      <div className="text-sm md:text-base text-white leading-relaxed uppercase font-black">
                        {feedback}
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button 
                        onClick={(e) => { e.stopPropagation(); nextStep(); }}
                        className="pixel-button bg-yellow-500 text-black px-12 py-4 pixel-font text-[12px] font-black uppercase shadow-[6px_6px_0_#000] hover:scale-105 active:scale-95"
                      >
                        {currentQuestionInLevel < QUESTIONS_PER_LEVEL ? "CONTINUE_QUEST" : "FINALIZE_CHAPTER"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center py-4 px-2 border-t-2 border-white/10">
                    <div className="flex space-x-6">
                        <button 
                          onClick={handleRequestHint}
                          disabled={score < HINT_COST || !!hint || isHintLoading || selectedOption !== null}
                          className={`pixel-button px-8 py-3 text-[10px] pixel-font font-black transition-all border-2 shadow-[4px_4px_0_#000] ${
                            (score < HINT_COST && !hint) || selectedOption !== null 
                            ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed grayscale' 
                            : 'bg-purple-700 text-white hover:bg-purple-600 border-white'
                          }`}
                        >
                          {hint ? 'HINT_ACTIVE' : `HINT (-${HINT_COST})`}
                        </button>
                        <button 
                          onClick={handleSkipQuestion}
                          disabled={score < SKIP_COST || selectedOption !== null}
                          className={`pixel-button px-8 py-3 text-[10px] pixel-font font-black transition-all border-2 shadow-[4px_4px_0_#000] ${
                            (score < SKIP_COST) || selectedOption !== null 
                            ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed grayscale' 
                            : 'bg-red-700 text-white hover:bg-red-600 border-white'
                          }`}
                        >
                          SKIP (-${SKIP_COST})
                        </button>
                    </div>
                    
                    <div className="hidden md:block text-[10px] text-slate-500 pixel-font uppercase font-bold animate-pulse">
                      STATUS: MONITORING_USER_INPUT...
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameSessionUI;
