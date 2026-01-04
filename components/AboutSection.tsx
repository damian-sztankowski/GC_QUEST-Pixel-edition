
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
            PIXEL_CLOUD:ESCAPE IS AN INTERACTIVE ESCAPE ROOM BUILT TO PREPARE YOU FOR THE <span className="text-white font-bold">GOOGLE CLOUD DIGITAL LEADER</span> EXAM. 
            NAVIGATE 6 MISSION-CRITICAL CHAPTERS, SOLVING <span className="text-yellow-500 font-bold">180+ UNIQUE CHALLENGES</span> ACROSS THREE DIFFICULTY TIERS TO RESTORE THE DATA CORE.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <section className="space-y-4">
            <h3 className="pixel-font text-yellow-500 text-xs mb-4 font-black">:: LOCAL_ORACLE_V2 ::</h3>
            <p className="text-lg leading-relaxed text-slate-400">
              OUR CHALLENGE ENGINE USES A COMPREHENSIVE STATIC DATABASE TAILORED TO JUNIORS, ARCHITECTS, AND LEGENDS. 
              QUESTIONS ARE SCOPED TO THE OFFICIAL CDL DOMAINS: TRANSFORMATION, DATA, AI, INFRASTRUCTURE, SECURITY, AND OPERATIONS.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="pixel-font text-green-500 text-xs mb-4 font-black">:: MINI_GAMES ::</h3>
            <ul className="text-lg space-y-3 text-slate-400">
              <li className="flex items-start gap-3">
                <span className="text-white shrink-0">🗂️</span> 
                <span><b className="text-white">TRIAGE:</b> SORT FALLING SECURITY TASKS INTO PROVIDER VS CUSTOMER.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-white shrink-0">🗄️</span> 
                <span><b className="text-white">SILO:</b> ROUTE NETWORK DATAGRAMS TO SPANNER, BIGQUERY, OR STORAGE.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-white shrink-0">👾</span> 
                <span><b className="text-white">SHOOTER:</b> BLAST LEGACY ENEMIES WITH MODERN COMPUTE WEAPONS.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-white shrink-0">🧱</span> 
                <span><b className="text-white">STACKER:</b> BUILD THE HIERARCHY FROM ORG TO PROJECT.</span>
              </li>
            </ul>
          </section>
        </div>

        <section className="bg-slate-900 border-4 border-dashed border-slate-700 p-8">
          <h3 className="pixel-font text-red-400 text-xs mb-8 font-black">:: SYSTEM_SPECIFICATIONS ::</h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 text-base font-black">
            <div>
              <div className="text-slate-500 mb-2 text-base">DATABASE:</div>
              <div className="text-white text-xl">180+ CDL CHALLENGES</div>
            </div>
            <div>
              <div className="text-slate-500 mb-2 text-base">LEVELS:</div>
              <div className="text-white text-xl">6 UNIQUE CHAPTERS</div>
            </div>
            <div>
              <div className="text-slate-500 mb-2 text-base">DIFFICULTY:</div>
              <div className="text-white text-xl">JUNIOR / ARCHITECT / LEGEND</div>
            </div>
            <div>
              <div className="text-slate-500 mb-2 text-base">VERSION:</div>
              <div className="text-white text-xl">2.1.0-EXPANDED_CORE</div>
            </div>
          </div>
        </section>

        <p className="text-center text-lg italic text-slate-500 mt-8">
          "THE BIT-STREAM FLOWS UNINTERRUPTED. SECURE YOUR PROJECT, LEADER."
        </p>
      </div>
    </div>
  );
};

export default AboutSection;
