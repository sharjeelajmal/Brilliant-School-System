"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, ArrowRight } from 'lucide-react';
import { ClassDetails } from './ClassDetails'; 
import { SectionDetails } from './SectionDetails'; 
import { StudentProfile } from './StudentProfile';

// Red Stat Card
const RedStatCard = ({ value, label, delay }: { value: string, label: string, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ y: -5 }}
    className="relative h-[130px] rounded-[16px] overflow-hidden bg-[#B70003] shadow-xl cursor-pointer group"
  >
    <div className="absolute -right-6 -top-6 w-32 h-32 bg-[#C60205] opacity-60 rounded-full group-hover:scale-110 transition-transform duration-500" />
    <div className="absolute right-10 bottom-[-20px] w-16 h-16 bg-[#C60205] opacity-60 rounded-full" />
    <div className="relative z-10 p-6 flex flex-col justify-center h-full">
      <h3 className="text-5xl font-black text-white tracking-tighter mb-1">{value}</h3>
      <p className="text-white/80 text-sm font-medium tracking-wide">{label}</p>
    </div>
  </motion.div>
);

// Class Row
const ClassRow = ({ data, index, onSelect }: { data: any, index: number, onSelect: () => void }) => (
  <motion.div 
    onClick={onSelect}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.3 + (index * 0.05) }}
    className="grid grid-cols-12 gap-4 items-center py-5 border-b border-gray-100 hover:bg-gray-50 transition-colors group cursor-pointer px-4"
  >
    <div className="col-span-3 font-bold text-[#191919] text-sm md:text-base group-hover:text-[#B70003] transition-colors">{data.name}</div>
    <div className="col-span-2 text-gray-400 font-medium text-sm text-center">{data.sections}</div>
    <div className="col-span-3 text-gray-400 font-medium text-sm text-center">{data.students}</div>
    <div className="col-span-2 text-gray-400 font-medium text-sm text-center">{data.teachers}</div>
    <div className="col-span-2 flex justify-end">
      <div className="flex items-center gap-2 text-[#B70003] text-sm font-bold opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
        View <ArrowRight size={16} />
      </div>
    </div>
  </motion.div>
);

export const ClassesOverview = () => {
  // --- STATES FOR NAVIGATION ---
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  const stats = [
    { value: "13", label: "Total Classes" },
    { value: "24", label: "Total Sections" },
    { value: "16", label: "Total Teachers" },
    { value: "576", label: "Total Students" },
  ];

  const classesData = [
    { name: 'Play group', sections: '03', students: 60, teachers: '03' },
    { name: 'Nursery', sections: '02', students: 32, teachers: '02' },
    { name: 'Prep', sections: '01', students: 19, teachers: '01' },
    { name: '1st Standard', sections: '01', students: 22, teachers: '01' },
    { name: '2nd Standard', sections: '02', students: 54, teachers: '02' },
    { name: '3rd Standard', sections: '01', students: 34, teachers: '01' },
    { name: '4th Standard', sections: '03', students: 78, teachers: '03' },
    { name: '5th Standard', sections: '02', students: 60, teachers: '02' },
  ];

  // --- LOGIC CORRECTION: Sab se deepest level pehle check karo ---

// LEVEL 4: Student Profile (Sab se pehle check hoga!)
  if (selectedStudent) {
    return <StudentProfile studentName={selectedStudent} onBack={() => setSelectedStudent(null)} />;
  }

  // LEVEL 3: Section Details (Agar student nahi, to section dikhao)
  if (selectedSection) {
    return (
      <SectionDetails 
        sectionName={selectedSection} 
        onBack={() => setSelectedSection(null)} 
        // NOTE: Ye prop lazmi pass karna hai, warna error ayega
        onSelectStudent={(name) => setSelectedStudent(name)} 
      />
    );
  }

  // LEVEL 2: Class Details (Agar section nahi, to class dikhao)
  if (selectedClass) {
    return (
      <ClassDetails 
        classNameStr={selectedClass} 
        onBack={() => setSelectedClass(null)} 
        onSelectSection={(sec) => setSelectedSection(sec)} 
      />
    );
  }

  // LEVEL 1: Overview
  return (
    <div className="space-y-8 font-['Montserrat'] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-2">
         <h2 className="text-3xl font-black text-[#B70003] uppercase tracking-tighter self-start md:self-auto">Classes Overview</h2>
         <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-[300px]">
               <input type="text" placeholder="Search class..." className="w-full h-12 border border-gray-200 rounded-xl pl-4 pr-10 outline-none focus:border-[#B70003] transition-all text-sm font-medium bg-white" />
               <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <button className="h-12 px-6 bg-[#B70003] text-white font-bold rounded-xl shadow-lg hover:bg-[#950002] transition-all flex items-center gap-2 whitespace-nowrap active:scale-95">
               <Plus size={18} /> Add Class
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => <RedStatCard key={i} {...stat} delay={i * 0.1} />)}
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-[24px] shadow-xl border border-gray-100 overflow-hidden">
         <div className="grid grid-cols-12 gap-4 py-5 px-4 bg-gray-50/50 border-b border-gray-100">
            <div className="col-span-3 text-[#191919] font-bold text-sm uppercase tracking-wider">Class Name</div>
            <div className="col-span-2 text-[#191919] font-bold text-sm uppercase tracking-wider text-center">Sections</div>
            <div className="col-span-3 text-[#191919] font-bold text-sm uppercase tracking-wider text-center">Total Students</div>
            <div className="col-span-2 text-[#191919] font-bold text-sm uppercase tracking-wider text-center">Teachers</div>
            <div className="col-span-2"></div>
         </div>
         <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
            {classesData.map((cls, i) => (
               <ClassRow key={i} data={cls} index={i} onSelect={() => setSelectedClass(cls.name.toUpperCase())} />
            ))}
         </div>
      </motion.div>
    </div>
  );
};