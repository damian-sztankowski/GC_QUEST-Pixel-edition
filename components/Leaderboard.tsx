
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { leaderboardService } from '../services/leaderboardService';
import Avatar from './Avatar';

const Leaderboard: React.FC = () => {
  const scores = useMemo(() => leaderboardService.getScores(), []);
  
  const chartData = useMemo(() => scores.map(entry => ({
    name: entry.name,
    score: entry.score,
    role: entry.role
  })), [scores]);

  const COLORS = ['#4285F4', '#EA4335', '#FBBC05', '#34A853'];
  const rolesWithAvatars = JSON.parse(localStorage.getItem('quest_avatars') || '[]');

  return (
    <div className="w-full max-w-4xl pixel-box border-8 p-6 md:p-10 bg-black shadow-[16px_16px_0_#000] flex flex-col max-h-[85vh]">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-10 gap-4 shrink-0">
        <div className="text-center md:text-left">
          <h2 className="text-3xl md:text-5xl font-black pixel-font text-white mb-2 tracking-tighter">HI_SCORE_TABLE</h2>
          <p className="mono-font text-lg md:text-xl text-yellow-500 uppercase">LOCAL_NODE_RANKINGS</p>
        </div>
        <div className="pixel-box bg-slate-900 border-4 px-4 py-1.5 pixel-font text-[8px] md:text-xs text-blue-400">
          RANKING: PERSISTENT
        </div>
      </div>

      <div className="h-40 md:h-56 mb-6 md:mb-10 bg-[#1a1a1a] p-3 border-4 border-white shadow-inner shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis 
              dataKey="name" 
              stroke="#fff" 
              fontSize={8} 
              tick={{fontFamily: 'Press Start 2P'}} 
              interval={0}
            />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ backgroundColor: '#000', border: '4px solid #fff', borderRadius: '0', color: '#fff' }}
              itemStyle={{ color: '#fff', fontFamily: 'VT323', fontSize: '1.2rem' }}
              cursor={{fill: 'rgba(255,255,255,0.1)'}}
            />
            <Bar dataKey="score" radius={0}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 min-h-0 border-t-2 border-dashed border-blue-500/30 pt-4">
        {scores.length === 0 ? (
          <div className="text-center py-12 pixel-font text-slate-500 text-sm uppercase">
            NO_DATA_AVAILABLE_ON_THIS_NODE
          </div>
        ) : scores.map((entry, idx) => {
          const roleData = rolesWithAvatars.find((r: any) => r.type === entry.role);
          return (
            <div key={idx} className="flex items-center justify-between p-3 md:p-5 bg-[#0c0c0c] border-4 border-white hover:bg-blue-900/40 transition-colors group">
              <div className="flex items-center space-x-4 md:space-x-8">
                <span className="text-xl md:text-3xl pixel-font text-white w-8 md:w-12">{idx + 1}.</span>
                <div className="border-2 border-white bg-black p-0.5">
                  <Avatar role={entry.role} size="sm" animate={false} base64={roleData?.avatarBase64} />
                </div>
                <div className="min-w-0">
                  <div className="pixel-font text-white text-[10px] md:text-lg group-hover:text-yellow-500 uppercase truncate max-w-[120px] md:max-w-none">{entry.name}</div>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="pixel-font text-[6px] md:text-[8px] text-slate-500 uppercase truncate">{entry.role}</div>
                    {entry.difficulty && (
                      <span className="text-[5px] md:text-[6px] pixel-font bg-white/10 text-white px-1 py-0.5 border border-white/20">
                        {entry.difficulty}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right pixel-font">
                <div className="text-sm md:text-2xl text-white group-hover:scale-110 transition-transform font-black tracking-widest">{entry.score.toString().padStart(6, '0')}</div>
                <div className="text-[6px] md:text-[8px] text-slate-500 mt-1 uppercase">DATE: {entry.date ? new Date(entry.date).toLocaleDateString() : '1.01.2024'}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-between items-center shrink-0 border-t-2 border-white/10 pt-4">
        <div className="text-[7px] pixel-font text-slate-600 uppercase font-black">
          {scores.length} RECORDS_FOUND
        </div>
        <button 
          onClick={() => { if(confirm('RESET_DATA_STORE?')) { leaderboardService.clearScores(); window.location.reload(); } }}
          className="pixel-button bg-red-950/30 text-red-500 px-4 py-1.5 pixel-font text-[7px] hover:bg-red-900 border-red-500/50 opacity-60 hover:opacity-100"
        >
          WIPE_CACHE
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;