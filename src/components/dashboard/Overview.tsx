"use client";
import React from 'react';
import { StatCard } from './StatCard';
import { Activity } from 'lucide-react';

export const Overview = () => {
  const stats = [
    { label: 'Total Students', value: '190' },
    { label: 'Present Students', value: '167' },
    { label: 'Total Teachers', value: '14' },
    { label: 'Present Teachers', value: '11' },
  ];

  return (
    <div className="space-y-12 font-['Montserrat']">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <div key={i} className="animated-box">
             <StatCard index={i} label={s.label} value={s.value} />
          </div>
        ))}
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* White Graph Box */}
        <div className="animated-box lg:col-span-2 bg-white p-10 rounded-[45px] shadow-xl border border-gray-50 group hover:shadow-2xl transition-all duration-500">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h4 className="text-2xl font-black text-[#191919] tracking-tighter uppercase">Growth Analytics</h4>
              <p className="text-gray-400 text-xs font-medium tracking-widest">Real-time tracking stream</p>
            </div>
            <button className="p-4 bg-[#F9FAFB] hover:bg-black hover:text-white rounded-2xl transition-all cursor-pointer">
              <Activity size={20} />
            </button>
          </div>
          <div className="w-full h-80 bg-gradient-to-b from-gray-50/50 to-transparent rounded-[35px] border-2 border-dashed border-gray-100 flex items-center justify-center">
             <span className="text-gray-300 font-bold italic tracking-widest opacity-50">Visualizing Data...</span>
          </div>
        </div>

        {/* Black Action Box */}
        <div className="animated-box bg-[#191919] p-10 rounded-[45px] shadow-2xl relative overflow-hidden group flex flex-col justify-between">
          <div className="relative z-10">
            <h4 className="text-3xl font-black text-white tracking-tighter mb-4 leading-tight uppercase italic">Instant<br/>Admission</h4>
            <p className="text-gray-500 text-sm font-medium mb-10 leading-relaxed">Securely onboard new students into the database system.</p>
          </div>
          <button className="relative z-10 w-full py-5 bg-[#B70003] text-white font-black text-sm uppercase tracking-[2px] rounded-2xl hover:bg-white hover:text-[#B70003] transition-all cursor-pointer shadow-lg active:scale-95">
              Initialize
          </button>
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#B70003]/20 blur-[40px] group-hover:bg-[#B70003]/30 transition-all duration-700" />
        </div>

      </div>
    </div>
  );
};