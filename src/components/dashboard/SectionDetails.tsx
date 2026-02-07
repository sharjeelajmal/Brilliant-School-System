"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Search, Plus, UserPlus, Users, 
  CheckSquare, FileText, Edit, Eye 
} from 'lucide-react';

// 1. Stat Card
const StatCard = ({ value, label, index }: { value: string | number, label: string, index: number }) => (
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

// 3. Simple Chart (Static for now as attendance data is not in DB)
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
         {/* Placeholder Graph */}
         <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
            <motion.path d="M0 100 Q 60 50, 120 80 T 240 40 T 360 60 T 480 20" fill="none" stroke={color1} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2 }} />
            <motion.path d="M0 120 Q 60 90, 120 100 T 240 80 T 360 30 T 480 50" fill="none" stroke={color2} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.5 }} />
         </svg>
      </div>
    </div>
  );
};

interface SectionProps {
  sectionName: string; // Comes as "Class - Section" (e.g. "Play Group - A")
  onBack: () => void;
  onSelectStudent: (studentName: string) => void;
}

export const SectionDetails = ({ sectionName, onBack, onSelectStudent }: SectionProps) => {
  // Data States
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [teacherName, setTeacherName] = useState("Not Assigned");
  const [stats, setStats] = useState({ total: 0, boys: 0, girls: 0 });
  const [searchQuery, setSearchQuery] = useState("");

  // Parse Class and Section Name
  // Expecting format: "ClassName - SectionName"
  const [className, sectionOnly] = sectionName.includes(' - ') 
    ? sectionName.split(' - ') 
    : [sectionName, ""];

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Students
        const sRes = await fetch(`/api/students?class=${className}&section=${sectionOnly}`);
        const sData = await sRes.json();
        
        // 2. Fetch Teacher
        const tRes = await fetch(`/api/teacher?class=${className}&section=${sectionOnly}`);
        const tData = await tRes.json();

        if (sData.success) {
          const studentList = sData.data;
          setStudents(studentList);
          
          // Calculate Stats
       const boys = studentList.filter((s: any) => s.gender === 'Boy').length;
  const girls = studentList.filter((s: any) => s.gender === 'Girl').length;
  
  setStats({ total: studentList.length, boys, girls });
}

        if (tData.success && tData.data.length > 0) {
          setTeacherName(`${tData.data[0].firstName} ${tData.data[0].lastName}`);
        } else {
          setTeacherName("Not Assigned");
        }

      } catch (err) {
        console.error("Error fetching section details");
      } finally {
        setLoading(false);
      }
    };

    if (className && sectionOnly) {
      fetchData();
    }
  }, [className, sectionOnly]);

  // Filter Students
  const filteredStudents = students.filter(s => 
    (s.firstName + ' ' + s.lastName).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 font-['Montserrat'] animate-in fade-in slide-in-from-right-10 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
         <div className="flex items-center gap-4 self-start">
            <button onClick={onBack} className="p-2 bg-[#B70003] text-white rounded-lg hover:scale-110 transition-transform shadow-md cursor-pointer">
                <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-3xl font-black text-[#B70003] uppercase tracking-tighter">{sectionOnly ? `Section ${sectionOnly}` : sectionName}</h2>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{className}</p>
            </div>
         </div>
         <div className="relative w-full md:w-[300px]">
            <input 
              type="text" 
              placeholder="Search student..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 border border-gray-200 rounded-xl pl-4 pr-10 outline-none focus:border-[#B70003] transition-all text-sm font-medium bg-white" 
            />
            <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
         </div>
      </div>

      {/* Stats - Real Time */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
         <StatCard value={stats.total} label="Total Students" index={0} />
         <StatCard value={stats.girls} label="Total Girls" index={1} />
         <StatCard value={stats.boys} label="Total Boys" index={2} />
         <StatCard value={teacherName} label="Class Teacher" index={3} />
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
         <SimpleLineChart title="Attendance Trend" color1="#002F9C" color2="#009952" />
         <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-lg">
            <h4 className="font-bold text-[#191919] mb-4">Top Performers</h4>
            <div className="space-y-3">
               {/* Dummy Top Performers for now (Need Exam Module for Real) */}
               {[1, 2, 3].map(i => (
                 <div key={i} className="flex justify-between items-center text-sm p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#B70003] text-white flex items-center justify-center font-bold text-xs">0{i}</div>
                      <span className="font-bold text-[#191919]">Student Name</span>
                    </div>
                    <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded">9{5-i}%</span>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* --- MAIN STUDENTS LIST (REAL TIME) --- */}
      <div className="bg-white rounded-[24px] shadow-xl border border-gray-100 overflow-hidden">
         <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-xl font-bold text-[#191919]">Students List</h3>
            <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">{filteredStudents.length} Records</span>
         </div>
         
         <div className="grid grid-cols-12 gap-4 py-4 px-6 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <div className="col-span-2">Roll No</div>
            <div className="col-span-3">Full Name</div>
            <div className="col-span-2">Father Name</div>
            <div className="col-span-2 text-center">Gender</div>
            <div className="col-span-3 text-right">Actions</div>
         </div>

         <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {loading ? (
                <div className="p-10 text-center text-gray-400 font-bold">Loading Students...</div>
            ) : filteredStudents.length === 0 ? (
                <div className="p-10 text-center text-gray-400">No students found in this section.</div>
            ) : (
                filteredStudents.map((s, i) => (
                   <motion.div 
                     key={s._id}
onClick={() => onSelectStudent(s._id)}
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: i * 0.05 }}
                     className="grid grid-cols-12 gap-4 py-4 px-6 border-b border-gray-100 hover:bg-red-50 items-center transition-colors cursor-pointer group"
                   >
                      <div className="col-span-2 font-bold text-gray-400">#{100 + i}</div>
                      <div className="col-span-3 font-bold text-[#191919] group-hover:text-[#B70003] transition-colors">{s.firstName} {s.lastName}</div>
                      <div className="col-span-2 text-gray-500 font-medium">{s.parentFirstName || '-'}</div>
                      <div className="col-span-2 text-center font-bold text-gray-700">{s.gender}</div>
                      <div className="col-span-3 flex justify-end gap-3">
                         <button className="text-[#B70003] text-xs font-bold hover:underline">Profile</button>
                         <button className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Edit size={16} /></button>
                         <button className="text-gray-500 hover:bg-gray-100 p-1 rounded"><Eye size={16} /></button>
                      </div>
                   </motion.div>
                ))
            )}
         </div>
      </div>

    </div>
  );
};