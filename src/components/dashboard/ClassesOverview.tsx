"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, ArrowRight } from 'lucide-react';
import { ClassDetails } from './ClassDetails'; 
import { SectionDetails } from './SectionDetails'; 
import { StudentProfile } from './StudentProfile';
import { AddClass } from './AddClass';
import { AddSection } from './AddSection';

// Red Stat Card
const RedStatCard = ({ value, label, delay }: { value: string | number, label: string, delay: number }) => (
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

// Class Row (Ab data props real honge)
const ClassRow = ({ data, index, onSelect }: { data: any, index: number, onSelect: () => void }) => (
  <motion.div 
    onClick={onSelect}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.3 + (index * 0.05) }}
    className="grid grid-cols-12 gap-4 items-center py-5 border-b border-gray-100 hover:bg-gray-50 transition-colors group cursor-pointer px-4"
  >
    <div className="col-span-3 font-bold text-[#191919] text-sm md:text-base group-hover:text-[#B70003] transition-colors">{data.name}</div>
    {/* REAL DATA DISPLAY */}
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
  // Navigation States
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [isAddingClass, setIsAddingClass] = useState(false);
  const [isAddingSection, setIsAddingSection] = useState(false);

  // Data & Search States
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(''); // Search State
  
  // Aggregate Counts
  const [totalStats, setTotalStats] = useState({
    classes: 0,
    sections: 0,
    teachers: 0,
    students: 0
  });

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/classes'); // Ab ye enriched data layega
        const data = await res.json();
        
        if (data.data) {
          const fetchedClasses = data.data;
          setClasses(fetchedClasses);

          // Calculate Totals based on fetched classes
          const totalSections = fetchedClasses.reduce((acc: number, curr: any) => acc + (curr.sections || 0), 0);
          const totalTeachers = fetchedClasses.reduce((acc: number, curr: any) => acc + (curr.teachers || 0), 0);
          const totalStudents = fetchedClasses.reduce((acc: number, curr: any) => acc + (curr.students || 0), 0);

          setTotalStats({
            classes: fetchedClasses.length,
            sections: totalSections,
            teachers: totalTeachers,
            students: totalStudents
          });
        }
      } catch (error) {
        console.error("Failed to load classes");
      } finally {
        setLoading(false);
      }
    };

    if (!isAddingClass && !isAddingSection) {
        fetchData();
    }
  }, [isAddingClass, isAddingSection]);

  // SEARCH FILTER LOGIC
  const filteredClasses = classes.filter(cls => 
    cls.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // STATS ARRAY
  const stats = [
    { value: totalStats.classes, label: "Total Classes" },
    { value: totalStats.sections, label: "Total Sections" },
    { value: totalStats.teachers, label: "Total Teachers" },
    { value: totalStats.students, label: "Total Students" },
  ];

  // --- RENDER ---
  if (isAddingClass) return <AddClass onBack={() => setIsAddingClass(false)} />;
  if (isAddingSection && selectedClass) return <AddSection classNameStr={selectedClass} onBack={() => setIsAddingSection(false)} />;
 if (selectedStudent) return <StudentProfile studentId={selectedStudent} onBack={() => setSelectedStudent(null)} />;
  if (selectedSection) return <SectionDetails sectionName={selectedSection} onBack={() => setSelectedSection(null)} onSelectStudent={(name) => setSelectedStudent(name)} />;
  
  if (selectedClass) return (
      <ClassDetails 
        classNameStr={selectedClass} 
        onBack={() => setSelectedClass(null)} 
        onSelectSection={(sec) => setSelectedSection(sec)} 
        onAddSectionClick={() => setIsAddingSection(true)} 
      />
  );

  return (
    <div className="space-y-8 font-['Montserrat'] animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-2">
         <h2 className="text-3xl font-black text-[#B70003] uppercase tracking-tighter self-start md:self-auto">Classes Overview</h2>
         <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-[300px]">
               {/* Search Input Connected */}
               <input 
                 type="text" 
                 placeholder="Search class..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full h-12 border border-gray-200 rounded-xl pl-4 pr-10 outline-none focus:border-[#B70003] transition-all text-sm font-medium bg-white" 
               />
               <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <button 
                onClick={() => setIsAddingClass(true)} 
                className="h-12 px-6 bg-[#B70003] text-white font-bold rounded-xl shadow-lg hover:bg-[#950002] transition-all flex items-center gap-2 whitespace-nowrap active:scale-95 cursor-pointer"
            >
               <Plus size={18} /> Add Class
            </button>
         </div>
      </div>

      {/* Stats Cards (Dynamic) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => <RedStatCard key={i} {...stat} delay={i * 0.1} />)}
      </div>

      {/* Classes List Table */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-[24px] shadow-xl border border-gray-100 overflow-hidden">
         <div className="grid grid-cols-12 gap-4 py-5 px-4 bg-gray-50/50 border-b border-gray-100">
            <div className="col-span-3 text-[#191919] font-bold text-sm uppercase tracking-wider">Class Name</div>
            <div className="col-span-2 text-[#191919] font-bold text-sm uppercase tracking-wider text-center">Sections</div>
            <div className="col-span-3 text-[#191919] font-bold text-sm uppercase tracking-wider text-center">Total Students</div>
            <div className="col-span-2 text-[#191919] font-bold text-sm uppercase tracking-wider text-center">Teachers</div>
            <div className="col-span-2"></div>
         </div>
         
         <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
            {loading ? (
                <div className="p-10 text-center text-gray-400 font-bold">Loading Data...</div>
            ) : filteredClasses.length === 0 ? (
                <div className="p-10 text-center text-gray-400">No classes found matching "{searchQuery}".</div>
            ) : (
                filteredClasses.map((cls, i) => (
                   <ClassRow 
                        key={i} 
                        data={cls} // Ab is data mein counts hain
                        index={i} 
                        onSelect={() => setSelectedClass(cls.name)} 
                   />
                ))
            )}
         </div>
      </motion.div>
    </div>
  );
};