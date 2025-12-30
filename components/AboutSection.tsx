
import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <div className="w-full max-w-4xl pixel-box border-8 p-10 bg-black shadow-[16px_16px_0_#000] animate-in slide-in-from-bottom-8 duration-500">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black pixel-font text-white mb-6 tracking-tight">ABOUT_PIXEL_CLOUD:ESCAPE</h2>
        <div className="pixel-hr w-48 mx-auto opacity-50 my-4"></div>
      </div>

      <div className="space-y-12 mono-font text-2xl md:text-3xl text-slate-300 leading-relaxed uppercase">
        <section className="space-y-4">
          <h3 className="pixel-font text-blue-400 text-xl mb-4 font-black">:: THE_MISSION ::</h3>
          <p className="text-slate-200">
            PIXEL_CLOUD:ESCAPE IS AN INTERACTIVE ESCAPE ROOM DESIGNED TO PREPARE YOU FOR THE <span className="text-white font-bold">CLOUD DIGITAL LEADER</span> CERTIFICATION. 
            YOU MUST NAVIGATE 6 CRITICAL CHAPTERS OF CLOUD ARCHITECTURE, SOLVING QUIZZES AND CHALLENGES TO RESTORE STABILITY TO THE DATA CORE.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <section className="space-y-4">
            <h3 className="pixel-font text-yellow-500 text-xs mb-4 font-black">:: AI_ORACLE ::</h3>
            <p className="text-lg leading-relaxed text-slate-400">
              THIS QUEST IS POWERED BY THE <span className="text-white font-bold underline">GEMINI 3 FLASH API</span>. 
              EVERY QUESTION, FEEDBACK SNIPPET, AND CLUE IS DYNAMICALLY GENERATED TO ENSURE NO TWO RUNS ARE THE SAME. 
              EVEN YOUR AVATAR IS A UNIQUE NEURAL RECONSTRUCTION.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="pixel-font text-green-500 text-xs mb-4 font-black">:: MINI_GAMES ::</h3>
            <ul className="text-lg space-y-3 text-slate-400">
              <li className="flex items-start gap-3">
                <span className="text-white shrink-0">📥</span> 
                <span><b className="text-white">CATCHER:</b> RECOVER STRAY DATA PACKETS BEFORE THEY ARE LOST TO THE VOID.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-white shrink-0">🗂️</span> 
                <span><b className="text-white">SORTER:</b> VALIDATE AND CATEGORIZE SERVICES INTO THEIR PROPER CLOUD MODELS.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-white shrink-0">🛡️</span> 
                <span><b className="text-white">DEFENDER:</b> INTERCEPT MALICIOUS THREATS AND STABILIZE NETWORK INFRASTRUCTURE.</span>
              </li>
            </ul>
          </section>
        </div>

        <section className="bg-slate-900 border-4 border-dashed border-slate-700 p-8">
          <h3 className="pixel-font text-red-400 text-xs mb-8 font-black">:: CREDITS_AND_TECH ::</h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 text-base font-black">
            <div>
              <div className="text-slate-500 mb-2 text-base">ENGINE:</div>
              <div className="text-white">REACT 19 + TAILWIND</div>
            </div>
            <div>
              <div className="text-slate-500 mb-2 text-base">BRAIN:</div>
              <div className="text-white">GEMINI 3 FLASH</div>
            </div>
            <div>
              <div className="text-slate-500 mb-2 text-base">AUTHOR:</div>
              <div className="text-white">DAMIAN SZTANKOWSKI | GDE CLOUD</div>
            </div>
            <div>
              <div className="text-slate-500 mb-2 text-base">VERSION:</div>
              <div className="text-white">1.0.5-PIXEL</div>
            </div>
          </div>
        </section>

        <p className="text-center text-sm italic text-slate-500 mt-8">
          "THE CLOUD IS NOT JUST INFRASTRUCTURE. IT IS AN OPPORTUNITY TO TRANSFORM."
        </p>
      </div>
    </div>
  );
};

export default AboutSection;