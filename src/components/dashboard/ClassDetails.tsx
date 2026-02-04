"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, ArrowLeft, MoreVertical } from 'lucide-react';

// ... (StatCard Same as Before) ...
const StatCard = ({ value, label, delay }: { value: string, label: string, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="relative h-[130px] rounded-[16px] overflow-hidden bg-[#B70003] shadow-xl group cursor-default"
  >
    <div className="absolute -right-6 -top-6 w-32 h-32 bg-[#C60205] opacity-60 rounded-full group-hover:scale-110 transition-transform duration-500" />
    <div className="absolute right-10 bottom-[-20px] w-16 h-16 bg-[#C60205] opacity-60 rounded-full" />
    <div className="relative z-10 p-6 flex flex-col justify-center h-full">
      <h3 className="text-5xl font-black text-white tracking-tighter mb-1">{value}</h3>
      <p className="text-white/80 text-sm font-medium tracking-wide">{label}</p>
    </div>
  </motion.div>
);

// Updated Section Card: Added onClick Prop
const SectionCard = ({ data, index, onClick }: { data: any, index: number, onClick: () => void }) => (
  <motion.div 
    onClick={onClick} // CLICK HANDLER ADDED
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 + (index * 0.1) }}
    className="bg-white rounded-[12px] border border-gray-200 p-6 mb-4 hover:shadow-lg hover:border-[#B70003] transition-all cursor-pointer group"
  >
    <div className="flex justify-between items-start mb-6">
      <h3 className="text-2xl font-bold text-[#3C3C3C] group-hover:text-[#B70003] transition-colors">{data.name}</h3>
      <button className="text-gray-400 hover:text-[#B70003] transition-colors"><MoreVertical size={20} /></button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
       {/* ... Columns Same as Before ... */}
       <div className="hidden md:block absolute top-2 bottom-2 left-[20%] w-[1px] bg-gray-100" />
       <div className="hidden md:block absolute top-2 bottom-2 left-[40%] w-[1px] bg-gray-100" />
       <div className="hidden md:block absolute top-2 bottom-2 left-[60%] w-[1px] bg-gray-100" />
       <div className="hidden md:block absolute top-2 bottom-2 left-[80%] w-[1px] bg-gray-100" />

       <div className="space-y-1"><p className="text-sm font-bold text-[#3C3C3C]">Teacher</p><p className="text-sm font-medium text-gray-400">{data.teacher}</p></div>
       <div className="space-y-1 pl-4"><p className="text-sm font-bold text-[#3C3C3C]">Attendance</p><p className="text-sm font-medium text-gray-400">{data.attendance}</p></div>
       <div className="space-y-1 pl-4"><p className="text-sm font-bold text-[#3C3C3C]">Progress</p><p className="text-sm font-medium text-gray-400">{data.progress}</p></div>
       <div className="space-y-1 pl-4"><p className="text-sm font-bold text-[#3C3C3C]">Section capacity</p><p className="text-sm font-medium text-gray-400">{data.capacity}</p></div>
       <div className="space-y-1 pl-4"><p className="text-sm font-bold text-[#3C3C3C]">Best student</p><p className="text-sm font-medium text-gray-400">{data.bestStudent}</p></div>
    </div>
  </motion.div>
);

interface DetailsProps {
  classNameStr: string;
  onBack: () => void;
  onSelectSection: (section: string) => void; // New Prop
}

export const ClassDetails = ({ classNameStr, onBack, onSelectSection }: DetailsProps) => {
  const sections = [
    { name: "Section A", teacher: "Miss Sarah", attendance: "76%", progress: "88%", capacity: "100% completed", bestStudent: "Ali Khan" },
    { name: "Section B", teacher: "Miss Hira", attendance: "89%", progress: "90%", capacity: "98% completed", bestStudent: "Fatima Noor" },
    { name: "Section C", teacher: "Miss Anum", attendance: "76%", progress: "87%", capacity: "78% completed", bestStudent: "Zain Ahmed" },
  ];

  return (
    <div className="space-y-8 font-['Montserrat'] animate-in fade-in slide-in-from-right-10 duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
         <div className="flex items-center gap-4 self-start md:self-auto">
            <button onClick={onBack} className="p-2 bg-[#B70003] text-white rounded-lg hover:scale-110 transition-transform">
                <ArrowLeft size={20} />
            </button>
            <h2 className="text-3xl font-black text-[#B70003] uppercase tracking-tighter">{classNameStr}</h2>
         </div>
         {/* ... Search & Add Btn Same ... */}
         <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-[300px]">
               <input type="text" placeholder="Search section..." className="w-full h-12 border border-gray-200 rounded-xl pl-4 pr-10 outline-none focus:border-[#B70003] transition-all text-sm font-medium bg-white" />
               <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <button className="h-12 px-6 bg-[#B70003] text-white font-bold rounded-xl shadow-lg hover:bg-[#950002] transition-all flex items-center gap-2 whitespace-nowrap active:scale-95">
               <Plus size={18} /> Add Section
            </button>
         </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
         <StatCard value="03" label="Total Sections" delay={0} />
         <StatCard value="60" label="Total Students" delay={0.1} />
         <StatCard value="03" label="Total Teachers" delay={0.2} />
      </div>

      {/* Sections List */}
      <div className="mt-8">
         {sections.map((sec, i) => (
            <SectionCard 
               key={i} 
               data={sec} 
               index={i} 
               onClick={() => onSelectSection(`${classNameStr} - ${sec.name}`)} // PASS CLICK
            />
         ))}
      </div>

    </div>
  );
};