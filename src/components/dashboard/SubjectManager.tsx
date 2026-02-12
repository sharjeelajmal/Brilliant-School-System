"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, X, Save, Book, ArrowRight, LayoutGrid } from 'lucide-react';
import { toast, Toaster } from 'sonner';

const SubjectTag = ({ name, onRemove }: any) => (
  <motion.div 
    layout
    initial={{ opacity: 0, scale: 0.8 }} 
    animate={{ opacity: 1, scale: 1 }} 
    exit={{ opacity: 0, scale: 0.5 }}
    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-[#B50104] rounded-xl font-bold text-sm border border-red-100 group hover:bg-[#B50104] hover:text-white transition-colors"
  >
    <Book size={14} />
    {name}
    <button onClick={onRemove} className="p-1 rounded-full hover:bg-white/20 transition-colors">
      <X size={14} />
    </button>
  </motion.div>
);

const ClassCard = ({ data, onClick, index }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ delay: index * 0.05 }}
    onClick={onClick}
    className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-24 h-24 bg-[#B50104] opacity-5 rounded-bl-[100px] transition-all group-hover:scale-150" />
    
    <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-[#B50104] group-hover:bg-[#B50104] group-hover:text-white transition-colors shadow-sm">
            <LayoutGrid size={24} />
        </div>
        <span className="bg-gray-50 px-3 py-1 rounded-full text-xs font-bold text-gray-500 group-hover:bg-red-50 group-hover:text-[#B50104] transition-colors">
            {data.subjects ? data.subjects.length : 0} Subjects
        </span>
    </div>
    
    <h3 className="text-xl font-black text-[#191919] mb-1 relative z-10">{data.name}</h3>
    <p className="text-sm text-gray-400 font-medium mb-4 relative z-10">Manage curriculum & subjects</p>

    <div className="flex items-center gap-2 text-[#B50104] text-xs font-bold group-hover:underline relative z-10">
        Manage Subjects <ArrowRight size={14} />
    </div>
  </motion.div>
);

export const SubjectManager = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  
  const [subjectInput, setSubjectInput] = useState("");
  const [tempSubjects, setTempSubjects] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // Fetch with timestamp to avoid cache
  const fetchClasses = async () => {
    try {
        const res = await fetch(`/api/classes?t=${new Date().getTime()}`);
        const data = await res.json();
        if(data.success) setClasses(data.data);
    } catch (e) { toast.error("Failed to load classes"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchClasses(); }, []);

  const openManager = (cls: any) => {
      setSelectedClass(cls);
      // Ensure it's an array
      setTempSubjects(Array.isArray(cls.subjects) ? cls.subjects : []);
      setSubjectInput("");
  };

  const addSubject = () => {
      if(!subjectInput.trim()) return;
      if(tempSubjects.includes(subjectInput.trim())) {
          toast.error("Subject already exists!");
          return;
      }
      setTempSubjects([...tempSubjects, subjectInput.trim()]);
      setSubjectInput("");
  };

  const removeSubject = (sub: string) => {
      setTempSubjects(tempSubjects.filter(s => s !== sub));
  };

  const handleSave = async () => {
      setSaving(true);
      try {
          const res = await fetch('/api/classes', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: selectedClass._id, subjects: tempSubjects })
          });
          const json = await res.json();
          
          if(res.ok) {
              toast.success("Subjects Saved Successfully!");
              
              // 🟢 INSTANT UI UPDATE
              const updatedClass = json.data;
              setClasses(prev => prev.map(c => c._id === updatedClass._id ? updatedClass : c));
              
              setSelectedClass(null); 
          } else {
              toast.error(json.error || "Failed to save");
          }
      } catch (e) { toast.error("Error saving subjects"); }
      finally { setSaving(false); }
  };

  return (
    <div className="space-y-8 font-['Montserrat'] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Toaster position="top-center" richColors />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
         <div>
            <h1 className="text-4xl font-black text-[#B50104] uppercase tracking-tighter mb-1">Subjects Manager</h1>
            <p className="text-gray-400 font-bold text-sm">Define subjects for each class to use across the system</p>
         </div>
         <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm text-sm font-bold text-gray-500">
            <BookOpen size={18} className="text-[#B50104]" />
            <span>Total Classes: {classes.length}</span>
         </div>
      </div>

      {/* Grid */}
      {loading ? (
          <div className="p-20 text-center text-gray-400 font-bold animate-pulse">Loading Classes...</div>
      ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {classes.map((cls, i) => (
                  <ClassCard key={cls._id} data={cls} index={i} onClick={() => openManager(cls)} />
              ))}
          </div>
      )}

      {/* MODAL OVERLAY */}
      <AnimatePresence>
          {selectedClass && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-[30px] shadow-2xl w-full max-w-[600px] overflow-hidden"
                  >
                      <div className="bg-[#B50104] p-8 text-white flex justify-between items-center relative overflow-hidden">
                          <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl" />
                          <div className="relative z-10">
                              <h2 className="text-2xl font-black">{selectedClass.name}</h2>
                              <p className="text-white/80 text-sm font-bold">Manage Subjects List</p>
                          </div>
                          <button onClick={() => setSelectedClass(null)} className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors relative z-10">
                              <X size={20} />
                          </button>
                      </div>

                      <div className="p-8">
                          <div className="flex gap-3 mb-6">
                              <div className="flex-1 relative">
                                  <input 
                                    value={subjectInput}
                                    onChange={(e) => setSubjectInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addSubject()}
                                    placeholder="Enter Subject Name (e.g. Mathematics)" 
                                    className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 outline-none focus:border-[#B50104] font-bold text-[#191919]"
                                  />
                                  <BookOpen size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                              </div>
                              <button onClick={addSubject} className="h-12 px-6 bg-[#191919] text-white rounded-xl font-bold hover:bg-black transition-all flex items-center gap-2">
                                  <Plus size={18} /> Add
                              </button>
                          </div>

                          <div className="min-h-[150px] bg-gray-50 rounded-2xl p-4 border border-dashed border-gray-300">
                              {tempSubjects.length === 0 ? (
                                  <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2 mt-4">
                                      <Book size={32} className="opacity-20" />
                                      <p className="text-sm font-bold">No subjects added yet</p>
                                  </div>
                              ) : (
                                  <motion.div className="flex flex-wrap gap-3">
                                      <AnimatePresence>
                                          {tempSubjects.map((sub) => (
                                              <SubjectTag key={sub} name={sub} onRemove={() => removeSubject(sub)} />
                                          ))}
                                      </AnimatePresence>
                                  </motion.div>
                              )}
                          </div>

                          <div className="flex justify-end gap-3 mt-8">
                              <button onClick={() => setSelectedClass(null)} className="px-6 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors">
                                  Cancel
                              </button>
                              <button onClick={handleSave} disabled={saving} className="px-8 py-3 bg-[#B50104] text-white font-bold rounded-xl hover:bg-[#900000] shadow-lg shadow-red-200 transition-all flex items-center gap-2 disabled:opacity-70">
                                  {saving ? "Saving..." : <><Save size={18} /> Save Subjects</>}
                              </button>
                          </div>
                      </div>
                  </motion.div>
              </div>
          )}
      </AnimatePresence>
    </div>
  );
};