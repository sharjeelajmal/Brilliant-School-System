"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, ArrowLeft, Trash2, AlertTriangle } from 'lucide-react'; // Trash2 added
import { toast, Toaster } from 'sonner';

// --- 1. DELETE MODAL (Reusable) ---
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
                <h3 className="text-lg font-black text-[#191919] mb-2">Delete Section?</h3>
                <p className="text-sm text-gray-500 font-medium mb-6">Are you sure? This will permanently delete the section and unassign the teacher.</p>
                
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors cursor-pointer">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="flex-1 py-3 bg-[#B70003] text-white font-bold rounded-xl hover:bg-[#900000] shadow-lg shadow-red-200 transition-colors cursor-pointer">
                        Delete
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

// --- 2. STAT CARD ---
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

// --- 3. SECTION CARD (With Delete) ---
const SectionCard = ({ data, index, onClick, onDelete }: { data: any, index: number, onClick: () => void, onDelete: (id: string) => void }) => (
  <motion.div 
    onClick={onClick}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 + (index * 0.1) }}
    className="bg-white rounded-[12px] border border-gray-200 p-6 mb-4 hover:shadow-lg hover:border-[#B70003] transition-all cursor-pointer group relative"
  >
    <div className="flex justify-between items-start mb-6">
      <h3 className="text-2xl font-bold text-[#3C3C3C] group-hover:text-[#B70003] transition-colors">{data.name}</h3>
      
      {/* Delete Button */}
      <button 
        onClick={(e) => { e.stopPropagation(); onDelete(data._id); }}
        className="text-gray-300 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
        title="Delete Section"
      >
        <Trash2 size={20} />
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
       <div className="hidden md:block absolute top-2 bottom-2 left-[20%] w-[1px] bg-gray-100" />
       <div className="hidden md:block absolute top-2 bottom-2 left-[40%] w-[1px] bg-gray-100" />
       <div className="hidden md:block absolute top-2 bottom-2 left-[60%] w-[1px] bg-gray-100" />
       <div className="hidden md:block absolute top-2 bottom-2 left-[80%] w-[1px] bg-gray-100" />

       <div className="space-y-1">
           <p className="text-sm font-bold text-[#3C3C3C]">Teacher Status</p>
           <p className={`text-sm font-medium truncate ${data.teacherId ? 'text-green-600' : 'text-orange-400'}`}>
               {data.teacherId ? "Assigned" : "Pending"}
           </p>
       </div>
       <div className="space-y-1 pl-4"><p className="text-sm font-bold text-[#3C3C3C]">Attendance</p><p className="text-sm font-medium text-gray-400">-</p></div>
       <div className="space-y-1 pl-4"><p className="text-sm font-bold text-[#3C3C3C]">Progress</p><p className="text-sm font-medium text-gray-400">-</p></div>
       <div className="space-y-1 pl-4"><p className="text-sm font-bold text-[#3C3C3C]">Capacity</p><p className="text-sm font-medium text-gray-400">{data.maxCapacity || '40'}</p></div>
       <div className="space-y-1 pl-4"><p className="text-sm font-bold text-[#3C3C3C]">Status</p><p className="text-sm font-medium text-green-500 font-bold">Active</p></div>
    </div>
  </motion.div>
);

interface DetailsProps {
  classNameStr: string;
  onBack: () => void;
  onSelectSection: (section: string) => void;
  onAddSectionClick: () => void;
}

// --- MAIN COMPONENT ---
export const ClassDetails = ({ classNameStr, onBack, onSelectSection, onAddSectionClick }: DetailsProps) => {
  const [sections, setSections] = useState<any[]>([]);
  const [stats, setStats] = useState({ sections: 0, students: 0, teachers: 0 });
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null); // Delete State

  const fetchAllData = async () => {
      setLoading(true);
      try {
        const secRes = await fetch(`/api/sections?class=${classNameStr}`);
        const secData = await secRes.json();
        
        const teachRes = await fetch(`/api/teacher?class=${classNameStr}`);
        const teachData = await teachRes.json();

        const studRes = await fetch(`/api/students?class=${classNameStr}`);
        const studData = await studRes.json();

        if (secData.success) {
          setSections(secData.data);
          setStats({
            sections: secData.data.length,
            teachers: teachData.success ? teachData.data.length : 0,
            students: studData.success ? studData.data.length : 0
          });
        }
      } catch (err) { toast.error("Error loading data"); } 
      finally { setLoading(false); }
  };

  useEffect(() => { fetchAllData(); }, [classNameStr]);

  // DELETE HANDLER
  const confirmDelete = async () => {
      if (!deleteId) return;
      try {
          const res = await fetch(`/api/sections?id=${deleteId}`, { method: 'DELETE' });
          if (res.ok) {
              toast.success("Section Deleted Successfully!");
              fetchAllData(); // Refresh list
          } else {
              toast.error("Failed to delete section");
          }
      } catch (error) { toast.error("Error deleting section"); }
      finally { setDeleteId(null); }
  };

  return (
    <div className="space-y-8 font-['Montserrat'] animate-in fade-in slide-in-from-right-10 duration-300">
      <Toaster position="top-center" richColors />

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteId && <DeleteModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={confirmDelete} />}
      </AnimatePresence>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
         <div className="flex items-center gap-4 self-start md:self-auto">
            <button onClick={onBack} className="p-2 bg-[#B70003] text-white rounded-lg hover:scale-110 transition-transform shadow-md cursor-pointer">
                <ArrowLeft size={20} />
            </button>
            <h2 className="text-3xl font-black text-[#B70003] uppercase tracking-tighter">{classNameStr}</h2>
         </div>
         
         <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-[300px]">
               <input type="text" placeholder="Search section..." className="w-full h-12 border border-gray-200 rounded-xl pl-4 pr-10 outline-none focus:border-[#B70003] transition-all text-sm font-medium bg-white" />
               <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <button 
                onClick={onAddSectionClick} 
                className="h-12 px-6 bg-[#B70003] text-white font-bold rounded-xl shadow-lg hover:bg-[#950002] transition-all flex items-center gap-2 whitespace-nowrap active:scale-95 cursor-pointer"
            >
               <Plus size={18} /> Add Section
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
         <StatCard value={stats.sections.toString()} label="Total Sections" delay={0} />
         <StatCard value={stats.students.toString()} label="Total Students" delay={0.1} />
         <StatCard value={stats.teachers.toString()} label="Total Teachers" delay={0.2} />
      </div>

      <div className="mt-8">
         {loading ? (
             <div className="text-center p-10 text-gray-400 font-bold animate-pulse">Loading Data...</div>
         ) : sections.length === 0 ? (
             <div className="text-center p-10 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">No sections found. Click "Add Section" to create one.</div>
         ) : (
             sections.map((sec, i) => (
                <SectionCard 
                   key={i} 
                   data={sec} 
                   index={i} 
                   onClick={() => onSelectSection(`${classNameStr} - ${sec.name}`)}
                   onDelete={(id) => setDeleteId(id)} // Pass ID to state
                />
             ))
         )}
      </div>

    </div>
  );
};