"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Search, Plus, UserPlus, Users, 
  CheckSquare, FileText, Edit, Eye 
} from 'lucide-react';

// --- Components ---

// 1. Red Stat Card
const StatCard = ({ value, label, index }: { value: string, label: string, index: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="bg-[#B70003] rounded-[16px] p-6 text-white relative overflow-hidden shadow-lg h-[140px] flex flex-col justify-center group"
  >
    <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#C60205] rounded-full opacity-50 group-hover:scale-125 transition-transform duration-500" />
    <h3 className="text-4xl font-black mb-1 relative z-10">{value}</h3>
    <p className="text-sm font-medium opacity-90 relative z-10 tracking-wider">{label}</p>
  </motion.div>
);

// 2. Action Button
const ActionButton = ({ label, icon: Icon }: { label: string, icon: any }) => (
  <button className="flex-1 bg-[#B70003] text-white h-12 rounded-[12px] font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:bg-[#950002] transition-all active:scale-95 whitespace-nowrap px-4">
    <Icon size={18} /> {label}
  </button>
);

// 3. Simple Chart
const SimpleLineChart = ({ title, color1, color2 }: { title: string, color1: string, color2: string }) => {
  return (
    <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-lg h-[320px] flex flex-col relative overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h4 className="font-bold text-[#191919] text-lg">{title}</h4>
        <div className="flex gap-4 text-[10px] font-bold text-gray-400">
           <div className="flex items-center gap-1"><div className={`w-2 h-2 rounded-full`} style={{ background: color1 }} /> Boys</div>
           <div className="flex items-center gap-1"><div className={`w-2 h-2 rounded-full`} style={{ background: color2 }} /> Girls</div>
        </div>
      </div>
      <div className="flex-1 relative border-l border-b border-gray-100 mx-2 mb-4">
         {[0, 20, 40, 60, 80, 100].map((p) => (
           <div key={p} className="absolute w-full border-t border-gray-50" style={{ bottom: `${p}%` }} />
         ))}
         <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
            <motion.path d="M0 100 Q 60 50, 120 80 T 240 40 T 360 60 T 480 20" fill="none" stroke={color1} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2 }} />
            <motion.path d="M0 120 Q 60 90, 120 100 T 240 80 T 360 30 T 480 50" fill="none" stroke={color2} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.5 }} />
         </svg>
      </div>
    </div>
  );
};

interface SectionProps {
  sectionName: string;
  onBack: () => void;
  onSelectStudent: (studentName: string) => void; // YE PROP ZAROORI HAI
}

export const SectionDetails = ({ sectionName, onBack, onSelectStudent }: SectionProps) => {
  const students = [
    { id: '01', name: 'Ali Khan', father: 'Ahmed Khan', att: '90%', perf: '85%' },
    { id: '02', name: 'Sara Ahmed', father: 'Bilal Ahmed', att: '95%', perf: '92%' },
    { id: '03', name: 'Usman Zafar', father: 'Zafar Iqbal', att: '88%', perf: '78%' },
    { id: '04', name: 'Ayesha Malik', father: 'Tariq Malik', att: '92%', perf: '89%' },
    { id: '05', name: 'Hamza Riaz', father: 'Riaz Ud Din', att: '85%', perf: '75%' },
  ];

  return (
    <div className="space-y-8 font-['Montserrat'] animate-in fade-in slide-in-from-right-10 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
         <div className="flex items-center gap-4 self-start">
            <button onClick={onBack} className="p-2 bg-[#B70003] text-white rounded-lg hover:scale-110 transition-transform shadow-md">
                <ArrowLeft size={20} />
            </button>
            <h2 className="text-3xl font-black text-[#B70003] uppercase tracking-tighter">{sectionName}</h2>
         </div>
         <div className="relative w-full md:w-[300px]">
            <input type="text" placeholder="Search student..." className="w-full h-12 border border-gray-200 rounded-xl pl-4 pr-10 outline-none focus:border-[#B70003] transition-all text-sm font-medium bg-white" />
            <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
         </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
         <StatCard value="32" label="Total Students" index={0} />
         <StatCard value="20" label="Total Girls" index={1} />
         <StatCard value="12" label="Total Boys" index={2} />
         <StatCard value="Miss Sarah" label="Class Teacher" index={3} />
      </div>

      {/* Actions */}
      <div>
        <h3 className="text-lg font-bold text-[#191919] mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
           <ActionButton label="Add Student" icon={Plus} />
           <ActionButton label="Replace Teacher" icon={UserPlus} />
           <ActionButton label="Merge Section" icon={Users} />
           <ActionButton label="Mark Attendance" icon={CheckSquare} />
           <ActionButton label="Take Test" icon={FileText} />
        </div>
      </div>

      {/* Charts & Mini Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <SimpleLineChart title="Attendance" color1="#002F9C" color2="#009952" />
         <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-lg">
            <h4 className="font-bold text-[#191919] mb-4">High Performing Students</h4>
            <div className="space-y-3">
               {[1, 2].map(i => (
                 <div key={i} className="flex justify-between items-center text-sm p-2 hover:bg-gray-50 rounded-lg">
                    <span className="font-bold text-gray-400">0{i}</span>
                    <span className="font-bold text-[#191919]">Student Name</span>
                    <span className="text-green-600 font-bold">9{i}%</span>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* --- MAIN STUDENTS LIST (CLICK HERE TO OPEN PROFILE) --- */}
      <div className="bg-white rounded-[24px] shadow-xl border border-gray-100 overflow-hidden">
         <div className="p-6 border-b border-gray-100"><h3 className="text-xl font-bold text-[#191919]">Students List</h3></div>
         
         <div className="grid grid-cols-12 gap-4 py-4 px-6 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <div className="col-span-1">Roll No</div>
            <div className="col-span-2">First Name</div>
            <div className="col-span-2">Last Name</div>
            <div className="col-span-2 text-center">Attendance</div>
            <div className="col-span-2 text-center">Performance</div>
            <div className="col-span-3 text-right">Actions</div>
         </div>

         <div className="max-h-[400px] overflow-y-auto">
            {students.map((s, i) => (
               <motion.div 
                 key={i}
                 // IMPORTANT: Yahan click event laga hua hai
                 onClick={() => onSelectStudent(s.name)} 
                 initial={{ opacity: 0, x: -10 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: 0.5 + (i * 0.05) }}
                 className="grid grid-cols-12 gap-4 py-4 px-6 border-b border-gray-100 hover:bg-gray-50 items-center transition-colors cursor-pointer group"
               >
                  <div className="col-span-1 font-bold text-gray-400">{s.id}</div>
                  <div className="col-span-2 font-bold text-[#191919] group-hover:text-[#B70003] transition-colors">{s.name}</div>
                  <div className="col-span-2 text-gray-500 font-medium">{s.father}</div>
                  <div className="col-span-2 text-center font-bold text-gray-700">{s.att}</div>
                  <div className="col-span-2 text-center font-bold text-gray-700">{s.perf}</div>
                  <div className="col-span-3 flex justify-end gap-3">
                     <button className="text-[#B70003] text-xs font-bold hover:underline">Complain</button>
                     <button className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Edit size={16} /></button>
                     <button className="text-gray-500 hover:bg-gray-100 p-1 rounded"><Eye size={16} /></button>
                  </div>
               </motion.div>
            ))}
         </div>
      </div>

    </div>
  );
};