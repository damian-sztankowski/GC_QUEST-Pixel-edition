
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MOCK_LEADERBOARD } from '../constants';
import Avatar from './Avatar';

const Leaderboard: React.FC = () => {
  const data = MOCK_LEADERBOARD.map(entry => ({
    name: entry.name,
    score: entry.score,
    role: entry.role
  }));

  const COLORS = ['#4285F4', '#EA4335', '#FBBC05', '#34A853'];
  const rolesWithAvatars = JSON.parse(localStorage.getItem('quest_avatars') || '[]');

  return (
    <div className="w-full max-w-4xl pixel-box border-8 p-10 bg-black shadow-[16px_16px_0_#000]">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-5xl font-black pixel-font text-white mb-2 tracking-tighter">HI_SCORE_TABLE</h2>
          <p className="mono-font text-xl text-yellow-500">TOP_FOUNDATIONAL_PLAYERS</p>
        </div>
        <div className="pixel-box bg-slate-900 border-4 px-6 py-2 pixel-font text-xs text-blue-400">
          RANKING: GLOBAL
        </div>
      </div>

      <div className="h-64 mb-12 bg-[#1a1a1a] p-4 border-4 border-white shadow-inner">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#fff" fontSize={10} tick={{fontFamily: 'Press Start 2P'}} />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ backgroundColor: '#000', border: '4px solid #fff', borderRadius: '0', color: '#fff' }}
              itemStyle={{ color: '#fff', fontFamily: 'VT323', fontSize: '1.5rem' }}
              cursor={{fill: 'rgba(255,255,255,0.1)'}}
            />
            <Bar dataKey="score" radius={0}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-4">
        {MOCK_LEADERBOARD.map((entry, idx) => {
          const roleData = rolesWithAvatars.find((r: any) => r.type === entry.role);
          return (
            <div key={idx} className="flex items-center justify-between p-6 bg-[#0c0c0c] border-4 border-white hover:bg-blue-900 transition-colors group">
              <div className="flex items-center space-x-8">
                <span className="text-3xl pixel-font text-white">{idx + 1}.</span>
                <div className="border-2 border-white bg-black p-1">
                  <Avatar role={entry.role} size="sm" animate={false} base64={roleData?.avatarBase64} />
                </div>
                <div>
                  <div className="pixel-font text-white text-lg group-hover:text-yellow-500">{entry.name}</div>
                  <div className="pixel-font text-[8px] text-slate-500 mt-1 uppercase">{entry.role}</div>
                </div>
              </div>
              <div className="text-right pixel-font">
                <div className="text-2xl text-white group-hover:scale-110 transition-transform">{entry.score.toString().padStart(6, '0')}</div>
                <div className="text-[10px] text-slate-500 mt-1">TIME: {entry.time}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Leaderboard;
