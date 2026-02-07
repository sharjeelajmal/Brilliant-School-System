"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Search, Plus, UserPlus, Users, 
  CheckSquare, FileText, Edit, Eye, Trash2, AlertTriangle, Printer,
  X, Check, ArrowRight // Added Missing Icons
} from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { useRouter } from 'next/navigation';

// --- IMPORT EXISTING PROFILE COMPONENT ---
import { StudentProfile } from '@/components/dashboard/StudentProfile';

// --- 1. DELETE MODAL ---
const DeleteModal = ({ isOpen, onClose, onConfirm }: any) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-[24px] shadow-2xl w-full max-w-[320px] p-6 text-center font-['Montserrat']"
            >
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#B70003]">
                    <AlertTriangle size={32} />
                </div>
                <h3 className="text-lg font-black text-[#191919] mb-2">Delete Student?</h3>
                <p className="text-sm text-gray-500 font-medium mb-6">Are you sure? This action will permanently remove the student record.</p>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors cursor-pointer">Cancel</button>
                    <button onClick={onConfirm} className="flex-1 py-3 bg-[#B70003] text-white font-bold rounded-xl hover:bg-[#900000] shadow-lg shadow-red-200 transition-colors cursor-pointer">Delete</button>
                </div>
            </motion.div>
        </div>
    );
};

// --- 2. REUSABLE MODAL WRAPPER ---
const ModalWrapper = ({ isOpen, onClose, title, children }: any) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[24px] shadow-2xl w-full max-w-[400px] p-6 font-['Montserrat'] relative"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-[#191919] uppercase">{title}</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full"><X size={20} /></button>
                </div>
                {children}
            </motion.div>
        </div>
    );
};

// --- 3. REPLACE TEACHER MODAL ---
const ReplaceTeacherModal = ({ isOpen, onClose, currentTeacher, onConfirm }: any) => {
    const [teachers, setTeachers] = useState<any[]>([]);
    const [selectedTeacher, setSelectedTeacher] = useState('');

    useEffect(() => {
        if(isOpen) {
            fetch('/api/teacher').then(res => res.json()).then(data => {
                if(data.success) setTeachers(data.data);
            });
        }
    }, [isOpen]);

    return (
        <ModalWrapper isOpen={isOpen} onClose={onClose} title="Replace Teacher">
            <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase">Current Teacher</p>
                    <p className="text-lg font-bold text-[#B70003]">{currentTeacher}</p>
                </div>
                
                <div className="space-y-2">
                    <label className="text-sm font-bold text-[#191919]">Select New Teacher</label>
                    <div className="max-h-[200px] overflow-y-auto custom-scrollbar border border-gray-200 rounded-xl">
                        {teachers.map((t: any) => (
                            <div 
                                key={t._id} 
                                onClick={() => setSelectedTeacher(t._id)}
                                className={`p-3 flex justify-between items-center cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-0 ${selectedTeacher === t._id ? 'bg-blue-50' : ''}`}
                            >
                                <div>
                                    <p className="font-bold text-sm text-[#191919]">{t.firstName} {t.lastName}</p>
                                    <p className="text-[10px] text-gray-400">{t.assignedClass ? `Busy: ${t.assignedClass}` : 'Available'}</p>
                                </div>
                                {selectedTeacher === t._id && <Check size={16} className="text-[#B70003]" />}
                            </div>
                        ))}
                    </div>
                </div>

                <button 
                    onClick={() => onConfirm(selectedTeacher)}
                    disabled={!selectedTeacher}
                    className="w-full py-3 bg-[#B70003] text-white font-bold rounded-xl shadow-lg hover:bg-[#900000] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    Confirm Replacement <ArrowRight size={18} />
                </button>
            </div>
        </ModalWrapper>
    );
};

// --- 4. MERGE SECTION MODAL ---
const MergeSectionModal = ({ isOpen, onClose, currentSection, className, onConfirm }: any) => {
    const [sections, setSections] = useState<any[]>([]);
    const [targetSection, setTargetSection] = useState('');

    useEffect(() => {
        if(isOpen) {
            fetch(`/api/sections?class=${className}`).then(res => res.json()).then(data => {
                if(data.success) setSections(data.data.filter((s:any) => s.name !== currentSection));
            });
        }
    }, [isOpen, className, currentSection]);

    return (
        <ModalWrapper isOpen={isOpen} onClose={onClose} title="Merge Section">
            <div className="space-y-6 text-center">
                <div className="flex items-center justify-center gap-4">
                    <div className="bg-red-50 px-4 py-2 rounded-lg border border-red-100 font-bold text-[#B70003]">{currentSection}</div>
                    <ArrowRight size={20} className="text-gray-400" />
                    <div className={`px-4 py-2 rounded-lg border font-bold ${targetSection ? 'bg-green-50 border-green-100 text-green-700' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                        {targetSection ? sections.find(s => s._id === targetSection)?.name : "?"}
                    </div>
                </div>

                <div className="text-left space-y-2">
                    <label className="text-sm font-bold text-[#191919]">Select Target Section</label>
                    <p className="text-xs text-gray-400">All students from {currentSection} will be moved here.</p>
                    <div className="grid grid-cols-2 gap-3">
                        {sections.map((s: any) => (
                            <div 
                                key={s._id} 
                                onClick={() => setTargetSection(s._id)}
                                className={`p-3 rounded-xl border-2 cursor-pointer transition-all text-center font-bold ${targetSection === s._id ? 'border-[#B70003] text-[#B70003] bg-red-50' : 'border-gray-100 text-gray-600 hover:border-gray-300'}`}
                            >
                                Section {s.name}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-yellow-50 p-3 rounded-lg flex items-start gap-3 text-left">
                    <AlertTriangle size={20} className="text-yellow-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-yellow-800 font-medium">Warning: This action will delete Section {currentSection} permanently after moving students.</p>
                </div>

                <button 
                    onClick={() => onConfirm(targetSection)}
                    disabled={!targetSection}
                    className="w-full py-3 bg-[#B70003] text-white font-bold rounded-xl shadow-lg hover:bg-[#900000] transition-all disabled:opacity-50"
                >
                    Merge Sections
                </button>
            </div>
        </ModalWrapper>
    );
};

// 5. Stat Card
const StatCard = ({ value, label, index }: { value: string | number, label: string, index: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
    className="bg-[#B70003] rounded-[16px] p-6 text-white relative overflow-hidden shadow-lg h-[140px] flex flex-col justify-center group"
  >
    <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#C60205] rounded-full opacity-50 group-hover:scale-125 transition-transform duration-500" />
    <h3 className="text-4xl font-black mb-1 relative z-10">{value}</h3>
    <p className="text-sm font-medium opacity-90 relative z-10 tracking-wider">{label}</p>
  </motion.div>
);

// 6. Action Button
const ActionButton = ({ label, icon: Icon, onClick }: { label: string, icon: any, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="flex-1 bg-[#B70003] text-white h-12 rounded-[12px] font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:bg-[#950002] transition-all active:scale-95 whitespace-nowrap px-4 cursor-pointer"
  >
    <Icon size={18} /> {label}
  </button>
);

// --- 7. NEW MODERN GENDER VISUAL (FIXED) ---
const ModernGenderVisual = ({ boys, girls }: { boys: number, girls: number }) => {
  const total = boys + girls || 1;
  const boysPct = Math.round((boys / total) * 100);
  const girlsPct = Math.round((girls / total) * 100);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ 
        opacity: 1, 
        y: 0, 
        transition: { delay: i * 0.1, duration: 0.5, type: "spring" as const } // FIXED HERE
    })
  };

  const avatarVariants = {
    hidden: { scale: 0 },
    visible: { scale: 1, transition: { type: "spring" as const, stiffness: 200, damping: 10, delay: 0.3 } } // FIXED HERE
  };

  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-lg h-[320px] overflow-hidden relative p-6 flex flex-col">
        <h4 className="font-bold text-[#191919] text-lg mb-4">Gender Demographics</h4>
        
        <div className="flex-1 flex gap-4">
            {/* Boys Card */}
            <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible" className="flex-1 bg-blue-50 rounded-2xl p-4 flex flex-col items-center justify-between relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-blue-100/50 to-transparent opacity-50" />
                 <motion.div variants={avatarVariants} className="w-20 h-20 rounded-full bg-white border-4 border-blue-200 overflow-hidden shadow-md relative z-10">
                    <img src="/Boy.png" alt="Boy" className="w-full h-full object-cover" />
                 </motion.div>
                 <div className="text-center relative z-10">
                     <h3 className="text-4xl font-black text-blue-700 tracking-tighter">{boys}</h3>
                     <p className="text-sm font-bold text-blue-500 uppercase tracking-wider">Boys</p>
                 </div>
                 <div className="w-full bg-blue-200 h-3 rounded-full overflow-hidden relative z-10">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${boysPct}%` }} transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }} className="h-full bg-blue-600 rounded-full relative">
                        <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] font-bold text-white leading-none">{boysPct}%</span>
                    </motion.div>
                 </div>
            </motion.div>

            {/* Girls Card */}
            <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible" className="flex-1 bg-red-50 rounded-2xl p-4 flex flex-col items-center justify-between relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-red-100/50 to-transparent opacity-50" />
                 <motion.div variants={avatarVariants} className="w-20 h-20 rounded-full bg-white border-4 border-red-200 overflow-hidden shadow-md relative z-10">
                    <img src="/Girl.png" alt="Girl" className="w-full h-full object-cover" />
                 </motion.div>
                 <div className="text-center relative z-10">
                     <h3 className="text-4xl font-black text-[#B70003] tracking-tighter">{girls}</h3>
                     <p className="text-sm font-bold text-red-500 uppercase tracking-wider">Girls</p>
                 </div>
                 <div className="w-full bg-red-200 h-3 rounded-full overflow-hidden relative z-10">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${girlsPct}%` }} transition={{ duration: 1.5, ease: "easeOut", delay: 0.6 }} className="h-full bg-[#B70003] rounded-full relative">
                        <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] font-bold text-white leading-none">{girlsPct}%</span>
                    </motion.div>
                 </div>
            </motion.div>
        </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export const SectionDetails = ({ sectionName, onBack, onSelectStudent }: any) => {
  const router = useRouter(); 
  
  // Data States
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [teacherName, setTeacherName] = useState("Not Assigned");
  const [stats, setStats] = useState({ total: 0, boys: 0, girls: 0 });
  const [topPerformers, setTopPerformers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // NEW STATES
  const [currentSectionId, setCurrentSectionId] = useState(""); 
  const [isReplaceOpen, setIsReplaceOpen] = useState(false);
  const [isMergeOpen, setIsMergeOpen] = useState(false);
  
  // SHARED PROFILE STATE
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const [className, sectionOnly] = sectionName.includes(' - ') ? sectionName.split(' - ') : [sectionName, ""];

  // --- FETCH DATA ---
  const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Section ID
        const secRes = await fetch(`/api/sections?class=${className}`);
        const secData = await secRes.json();
        if(secData.success) {
            const thisSection = secData.data.find((s:any) => s.name === sectionOnly);
            if(thisSection) setCurrentSectionId(thisSection._id);
        }

        // Fetch Students
        const sRes = await fetch(`/api/students?class=${className}&section=${sectionOnly}`);
        const sData = await sRes.json();
        
        // Fetch Teacher
        const tRes = await fetch(`/api/teacher?class=${className}&section=${sectionOnly}`);
        const tData = await tRes.json();

        if (sData.success) {
          const studentList = sData.data;
          setStudents(studentList);
          
          setStats({ 
              total: studentList.length, 
              boys: studentList.filter((s: any) => s.gender === 'Boy').length, 
              girls: studentList.filter((s: any) => s.gender === 'Girl').length 
          });

          // Top Performers Logic
          const sorted = [...studentList].sort((a, b) => (b.avgPerformance || 0) - (a.avgPerformance || 0));
          setTopPerformers(sorted.slice(0, 3));
        }

        if (tData.success && tData.data.length > 0) {
          setTeacherName(`${tData.data[0].firstName} ${tData.data[0].lastName}`);
        }

      } catch (err) { console.error("Error fetching data"); } 
      finally { setLoading(false); }
  };

  useEffect(() => { if (className && sectionOnly) fetchData(); }, [className, sectionOnly]);

  const confirmDelete = async () => {
      if (!deleteId) return;
      try {
          const res = await fetch(`/api/students?id=${deleteId}`, { method: 'DELETE' });
          if (res.ok) { toast.success("Deleted!"); fetchData(); } 
          else { toast.error("Failed"); }
      } catch (error) { toast.error("Error"); }
      finally { setDeleteId(null); }
  };

  // --- HANDLERS ---
  const handleReplaceTeacher = async (newTeacherId: string) => {
      try {
          const res = await fetch('/api/sections', {
              method: 'PUT',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({ sectionId: currentSectionId, newTeacherId })
          });
          const data = await res.json();
          if(res.ok) {
              toast.success("Teacher Replaced!");
              setIsReplaceOpen(false);
              fetchData();
          } else {
              toast.error(data.error || "Failed");
          }
      } catch(e) { toast.error("Error"); }
  };

  const handleMergeSection = async (targetSectionId: string) => {
      try {
          const res = await fetch('/api/sections/merge', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({ sourceSectionId: currentSectionId, targetSectionId })
          });
          if(res.ok) {
              toast.success("Sections Merged!");
              setIsMergeOpen(false);
              onBack();
          } else {
              toast.error("Failed to merge");
          }
      } catch(e) { toast.error("Error"); }
  };

  const filteredStudents = students.filter(s => 
    (s.firstName + ' ' + s.lastName).toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- SHOW PROFILE IF SELECTED ---
  if (selectedStudentId) {
      return <StudentProfile studentId={selectedStudentId} onBack={() => setSelectedStudentId(null)} />;
  }

  return (
    <div className="space-y-8 font-['Montserrat'] animate-in fade-in slide-in-from-right-10 duration-500">
      <Toaster position="top-center" richColors />
      
      {/* MODALS */}
      <AnimatePresence>
          {deleteId && <DeleteModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={confirmDelete} />}
          {isReplaceOpen && <ReplaceTeacherModal isOpen={isReplaceOpen} onClose={() => setIsReplaceOpen(false)} currentTeacher={teacherName} onConfirm={handleReplaceTeacher} />}
          {isMergeOpen && <MergeSectionModal isOpen={isMergeOpen} onClose={() => setIsMergeOpen(false)} currentSection={sectionOnly} className={className} onConfirm={handleMergeSection} />}
      </AnimatePresence>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
         <div className="flex items-center gap-4 self-start">
            <button onClick={onBack} className="p-2 bg-[#B70003] text-white rounded-lg hover:scale-110 transition-transform shadow-md cursor-pointer"><ArrowLeft size={20} /></button>
            <div>
              <h2 className="text-3xl font-black text-[#B70003] uppercase tracking-tighter">{sectionOnly ? `Section ${sectionOnly}` : sectionName}</h2>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{className}</p>
            </div>
         </div>
         <div className="relative w-full md:w-[300px]">
            <input type="text" placeholder="Search student..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-12 border border-gray-200 rounded-xl pl-4 pr-10 outline-none focus:border-[#B70003] transition-all text-sm font-medium bg-white" />
            <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
         </div>
      </div>

      {/* Stats */}
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
           <ActionButton label="Add Student" icon={Plus} onClick={() => router.push('/dashboard?tab=forms')} />
           <ActionButton label="Mark Attendance" icon={CheckSquare} onClick={() => router.push('/dashboard?tab=attendance')} />
           <ActionButton label="Take Test" icon={FileText} onClick={() => router.push('/dashboard?tab=test-report')} />
           
           {/* UPDATED BUTTONS */}
           <ActionButton label="Replace Teacher" icon={UserPlus} onClick={() => setIsReplaceOpen(true)} />
           <ActionButton label="Merge Section" icon={Users} onClick={() => setIsMergeOpen(true)} />
        </div>
      </div>

      {/* Charts & Top Performers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         
         {/* --- 1. NEW MODERN GENDER VISUAL --- */}
         <ModernGenderVisual boys={stats.boys} girls={stats.girls} />

         {/* --- 2. TOP PERFORMERS --- */}
         <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-lg h-[320px] overflow-hidden flex flex-col">
            <h4 className="font-bold text-[#191919] mb-4">Top Performers (By Marks)</h4>
            <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1">
               {topPerformers.length === 0 ? (
                   <div className="text-center text-gray-400 text-sm mt-10">No exam data yet.</div>
               ) : (
                   topPerformers.map((s, i) => (
                     <div key={s._id} className="flex justify-between items-center text-sm p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100 transition-all cursor-pointer" onClick={() => setSelectedStudentId(s._id)}>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-md ${i === 0 ? 'bg-[#FFD700]' : i === 1 ? 'bg-[#C0C0C0]' : 'bg-[#CD7F32]'}`}>
                              {i + 1}
                          </div>
                          <div>
                              <p className="font-bold text-[#191919]">{s.firstName} {s.lastName}</p>
                              <p className="text-[10px] text-gray-400">Roll No: {s.rollNo}</p>
                          </div>
                        </div>
                        <div className="text-right">
                            <span className="text-[#009952] font-black block">{Math.round(s.avgPerformance || 0)}%</span>
                            <span className="text-[9px] text-gray-400">Avg Marks</span>
                        </div>
                     </div>
                   ))
               )}
            </div>
         </div>
      </div>

      {/* Students List */}
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
            {loading ? <div className="p-10 text-center font-bold text-gray-400">Loading...</div> : 
             filteredStudents.length === 0 ? <div className="p-10 text-center text-gray-400">No students found.</div> :
             filteredStudents.map((s, i) => (
                <motion.div 
                    key={s._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedStudentId(s._id)}
                    className="grid grid-cols-12 gap-4 py-4 px-6 border-b border-gray-100 hover:bg-red-50 items-center transition-colors cursor-pointer group"
                >
                    <div className="col-span-2 font-bold text-gray-400">#{s.rollNo}</div>
                    <div className="col-span-3 font-bold text-[#191919] group-hover:text-[#B70003]">{s.firstName} {s.lastName}</div>
                    <div className="col-span-2 text-gray-500 font-medium">{s.parentFirstName || '-'}</div>
                    <div className="col-span-2 text-center font-bold text-gray-700">{s.gender}</div>
                    <div className="col-span-3 flex justify-end gap-3">
                        <button className="text-[#B70003] text-xs font-bold hover:underline">Profile</button>
                        <button onClick={(e) => { e.stopPropagation(); setDeleteId(s._id); }} className="text-red-500 hover:bg-red-100 p-1.5 rounded-full"><Trash2 size={16} /></button>
                    </div>
                </motion.div>
            ))}
         </div>
      </div>
    </div>
  );
};