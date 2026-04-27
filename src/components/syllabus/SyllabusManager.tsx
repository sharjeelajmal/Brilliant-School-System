"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, BookOpen, Calendar, List, Pencil, Trash2, X, Check, 
  ChevronDown, Filter, Loader2, Book
} from 'lucide-react';
import { toast, Toaster } from 'sonner';

// Reusing design elements from StudentsOverview
const ModernDropdown = ({ label, value, options, onChange, icon: Icon }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<any>(null);

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (ref.current && !ref.current.contains(event.target)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative w-full" ref={ref}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between h-[50px] bg-white border rounded-xl px-4 cursor-pointer transition-all hover:shadow-sm ${isOpen || value ? 'border-[#B50104] ring-1 ring-[#B50104]/20' : 'border-gray-200 hover:border-gray-300'}`}
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`p-1.5 rounded-md ${value ? 'bg-red-50 text-[#B50104]' : 'bg-gray-100 text-gray-400'}`}>
                        <Icon size={16} />
                    </div>
                    <span className={`text-sm font-bold truncate ${value ? 'text-[#191919]' : 'text-gray-400'}`}>
                        {value || label}
                    </span>
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-[56px] left-0 w-full bg-white rounded-xl shadow-xl border border-gray-100 z-[9999] overflow-hidden"
                    >
                        <div className="max-h-[200px] overflow-y-auto custom-scrollbar p-1">
                            {options.map((opt: string) => (
                                <div
                                    key={opt}
                                    onClick={() => { onChange(opt); setIsOpen(false); }}
                                    className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg cursor-pointer transition-colors mb-0.5 ${value === opt ? 'bg-[#B50104] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    {opt}
                                    {value === opt && <Check size={14} />}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const SyllabusManager = ({ role = 'admin' }: { role?: string }) => {
    const [selectedClass, setSelectedClass] = useState('Class 1');
    const [selectedRound, setSelectedRound] = useState('1st Round');
    const [syllabusData, setSyllabusData] = useState<any[]>([]);
    const [classList, setClassList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewingEntry, setViewingEntry] = useState<any>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [editingEntry, setEditingEntry] = useState<any>(null);

    // Form state
    const [formData, setFormData] = useState({
        subject: '',
        months: '',
        topics: ''
    });

    const rounds = ['1st Round', '2nd Round', 'Final Round'];

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/syllabus?className=${selectedClass}&round=${selectedRound}`);
            const data = await res.json();
            if (data.success) {
                setSyllabusData(data.data);
            }

            const classRes = await fetch('/api/classes');
            const classData = await classRes.json();
            if (classData.success) {
                setClassList(classData.data);
            }
        } catch (error) {
            toast.error("Failed to fetch syllabus data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedClass, selectedRound]);

    const handleAddOrUpdate = async () => {
        if (!formData.subject || !formData.months || !formData.topics) {
            toast.error("Please fill all fields");
            return;
        }

        const payload = {
            className: selectedClass,
            round: selectedRound,
            subject: formData.subject,
            months: formData.months.split(',').map(m => m.trim()),
            topics: formData.topics.split('\n').filter(t => t.trim() !== '')
        };

        try {
            const res = await fetch('/api/syllabus', {
                method: editingEntry ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingEntry ? { ...payload, _id: editingEntry._id } : payload)
            });
            const data = await res.json();
            if (data.success) {
                toast.success(editingEntry ? "Syllabus updated!" : "Syllabus added!");
                setIsModalOpen(false);
                setEditingEntry(null);
                setFormData({ subject: '', months: '', topics: '' });
                fetchData();
            } else {
                toast.error(data.error || "Action failed");
            }
        } catch (error) {
            toast.error("Network error");
        }
    };

    const handleDelete = async () => {
        if (!deletingId) return;
        try {
            const res = await fetch(`/api/syllabus?id=${deletingId}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                toast.success("Entry deleted");
                setDeletingId(null);
                fetchData();
            } else {
                toast.error(data.error || "Delete failed");
            }
        } catch (error) {
            toast.error("Network error");
        }
    };

    const openEditModal = (entry: any) => {
        setEditingEntry(entry);
        setFormData({
            subject: entry.subject,
            months: entry.months.join(', '),
            topics: entry.topics.join('\n')
        });
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8 font-['Montserrat'] animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <Toaster position="top-center" richColors />

            {/* HEADER & FILTERS */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-6">
                <div>
                    <h1 className="text-2xl md:text-4xl font-black text-[#B50104] uppercase tracking-tighter mb-1">Syllabus</h1>
                    <p className="text-gray-400 font-bold text-xs md:text-sm">Manage academic curriculum and rounds</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                    <div className="w-full sm:w-64">
                        <ModernDropdown 
                            label="Select Class" 
                            value={selectedClass} 
                            options={classList.map(c => c.name)} 
                            onChange={setSelectedClass} 
                            icon={Filter} 
                        />
                    </div>
                    {role === 'admin' && (
                        <button 
                            onClick={() => { setEditingEntry(null); setFormData({ subject: '', months: '', topics: '' }); setIsModalOpen(true); }}
                            className="w-full sm:w-auto h-[50px] px-8 bg-[#B50104] text-white font-bold rounded-xl shadow-lg hover:bg-[#900000] hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 whitespace-nowrap cursor-pointer"
                        >
                            <Plus size={20} /> Add Syllabus
                        </button>
                    )}
                </div>
            </div>

            {/* ROUND TABS */}
            <div className="flex p-1.5 bg-gray-100/80 rounded-2xl w-full max-w-lg mx-auto">
                {rounds.map((round) => (
                    <button
                        key={round}
                        onClick={() => setSelectedRound(round)}
                        className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all relative ${selectedRound === round ? 'text-white' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        {selectedRound === round && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-[#B50104] rounded-xl shadow-md"
                                transition={{ type: "spring", duration: 0.5 }}
                            />
                        )}
                        <span className="relative z-10">{round}</span>
                    </button>
                ))}
            </div>

            {/* CONTENT GRID */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
                    <Loader2 size={40} className="animate-spin text-[#B50104]" />
                    <p className="font-bold">Fetching Syllabus...</p>
                </div>
            ) : syllabusData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400 border-2 border-dashed border-gray-100 rounded-[32px]">
                    <BookOpen size={60} strokeWidth={1} className="mb-4 opacity-20" />
                    <p className="font-bold text-lg italic">No syllabus found for this round.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {syllabusData.map((item, idx) => (
                            <motion.div
                                key={item._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
                            >
                                {/* Decorative Background Icon */}
                                <Book className="absolute -right-4 -bottom-4 w-24 h-24 text-gray-50 opacity-50 group-hover:text-red-50 group-hover:scale-110 transition-all" />

                                <div className="flex justify-between items-start relative z-10">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="p-2 bg-red-50 text-[#B50104] rounded-lg">
                                                <BookOpen size={18} />
                                            </div>
                                            <h3 className="text-xl font-black text-[#191919] truncate">{item.subject}</h3>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {item.months.map((month: string) => (
                                                <span key={month} className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-gray-200">
                                                    {month}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    {role === 'admin' && (
                                        <div className="flex gap-1 relative z-20">
                                            <button 
                                                onClick={() => openEditModal(item)}
                                                className="p-1.5 md:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                            >
                                                <Pencil size={14} className="md:w-4 md:h-4" />
                                            </button>
                                            <button 
                                                onClick={() => setDeletingId(item._id)}
                                                className="p-1.5 md:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                            >
                                                <Trash2 size={14} className="md:w-4 md:h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2 relative z-10">
                                    <h4 className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-1">Topics Coverd</h4>
                                    <ul className="space-y-1">
                                        {item.topics.slice(0, 2).map((topic: string, i: number) => (
                                            <li key={i} className="flex items-start gap-1.5 text-[11px] md:text-sm text-gray-600 font-medium leading-tight truncate">
                                                <div className="mt-1.5 w-1 h-1 rounded-full bg-[#B50104] flex-shrink-0" />
                                                <span className="truncate">{topic}</span>
                                            </li>
                                        ))}
                                        {item.topics.length > 2 && (
                                            <li className="text-[10px] text-[#B50104] font-black italic">+{item.topics.length - 2} more topics...</li>
                                        )}
                                    </ul>
                                </div>

                                <button 
                                    onClick={() => setViewingEntry(item)}
                                    className="w-full mt-4 py-2.5 bg-gray-50 text-gray-400 hover:text-[#B50104] hover:bg-red-50 text-[10px] md:text-xs font-black uppercase tracking-widest rounded-xl transition-all border border-gray-100 hover:border-red-100 flex items-center justify-center gap-2 cursor-pointer group"
                                >
                                    <List size={14} /> View Full Syllabus
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* ADD/EDIT MODAL */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-[32px] w-full max-w-[420px] overflow-hidden relative z-10 shadow-2xl border border-white/20"
                        >
                            <div className="max-h-[85vh] overflow-y-auto custom-scrollbar overflow-x-visible">
                                <div className="relative overflow-hidden">
                                {/* Premium Gradient Header */}
                                <div className="bg-gradient-to-br from-[#B50104] to-[#900000] p-6 text-white relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-[100px] -mr-10 -mt-10 blur-2xl" />
                                    <div className="flex justify-between items-center relative z-10">
                                        <div>
                                            <h2 className="text-xl font-black uppercase tracking-tighter">
                                                {editingEntry ? 'Edit' : 'Add'} Syllabus
                                            </h2>
                                            <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">{selectedClass} — {selectedRound}</p>
                                        </div>
                                        <button 
                                            onClick={() => setIsModalOpen(false)} 
                                            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6 space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Subject Name</label>
                                        <ModernDropdown 
                                            label="Select Subject"
                                            value={formData.subject}
                                            options={classList.find(c => c.name === selectedClass)?.subjects || []}
                                            onChange={(val: string) => setFormData({ ...formData, subject: val })}
                                            icon={Book}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Months (Comma separated)</label>
                                        <input 
                                            type="text" 
                                            value={formData.months}
                                            onChange={(e) => setFormData({ ...formData, months: e.target.value })}
                                            placeholder="e.g. April, May"
                                            className="w-full h-[55px] bg-gray-50 border border-gray-200 rounded-2xl px-5 outline-none focus:border-[#B50104] focus:ring-4 focus:ring-red-500/5 transition-all font-bold text-[#191919]"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Topics (One per line)</label>
                                        <textarea 
                                            rows={4}
                                            value={formData.topics}
                                            onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
                                            placeholder="Algebra Basics&#10;Geometry Introduction&#10;Data Handling"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-5 outline-none focus:border-[#B50104] focus:ring-4 focus:ring-red-500/5 transition-all font-bold text-[#191919] resize-none"
                                        />
                                    </div>

                                    <button 
                                        onClick={handleAddOrUpdate}
                                        className="w-full h-[55px] bg-[#B50104] text-white font-black rounded-2xl shadow-lg shadow-red-200 hover:shadow-xl hover:bg-[#900000] transition-all flex items-center justify-center gap-2 active:scale-95 mt-2 cursor-pointer"
                                    >
                                        <SaveIcon size={20} /> {editingEntry ? 'Update' : 'Save'} Entry
                                    </button>
                                </div>
                                <div className="h-4" /> {/* Bottom Spacing */}
                            </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* VIEW DETAIL MODAL */}
            <AnimatePresence>
                {viewingEntry && (
                    <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setViewingEntry(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-[32px] w-full max-w-[400px] overflow-hidden relative z-10 shadow-2xl"
                        >
                            <div className="bg-[#B50104] p-6 text-white">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="text-xl font-black uppercase tracking-tighter">{viewingEntry.subject}</h3>
                                    <button onClick={() => setViewingEntry(null)} className="p-2 hover:bg-white/20 rounded-full transition-colors cursor-pointer"><X size={20} /></button>
                                </div>
                                <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">{selectedClass} — {selectedRound}</p>
                            </div>
                            <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 border-b pb-1">Covered Months</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {viewingEntry.months.map((m: string) => (
                                                <span key={m} className="px-3 py-1 bg-red-50 text-[#B50104] rounded-full text-[10px] font-black uppercase tracking-widest">{m}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 border-b pb-1">Topics To Cover</h4>
                                        <ul className="space-y-3">
                                            {viewingEntry.topics.map((t: string, i: number) => (
                                                <li key={i} className="flex items-start gap-3 text-sm text-gray-600 font-bold leading-tight">
                                                    <div className="mt-1 w-2 h-2 rounded-full bg-[#B50104] flex-shrink-0" />
                                                    <span>{t}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 bg-gray-50 border-t border-gray-100">
                                <button onClick={() => setViewingEntry(null)} className="w-full py-3 bg-[#191919] text-white font-black rounded-xl text-xs uppercase tracking-widest hover:bg-black transition-all cursor-pointer">Close Viewer</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* DELETE CONFIRMATION MODAL */}
            <AnimatePresence>
                {deletingId && (
                    <div className="fixed inset-0 z-[10002] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setDeletingId(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-[28px] w-full max-w-[350px] p-6 relative z-10 shadow-2xl text-center"
                        >
                            <div className="w-16 h-16 bg-red-50 text-[#B50104] rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 size={32} />
                            </div>
                            <h3 className="text-xl font-black text-[#191919] mb-2">Delete Entry?</h3>
                            <p className="text-gray-500 text-sm font-medium mb-6 leading-relaxed">Are you sure you want to remove this syllabus entry? This action cannot be undone.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setDeletingId(null)} className="flex-1 py-3 bg-gray-100 text-gray-500 font-bold rounded-xl hover:bg-gray-200 transition-colors cursor-pointer">Cancel</button>
                                <button onClick={handleDelete} className="flex-1 py-3 bg-[#B50104] text-white font-bold rounded-xl hover:bg-[#900000] shadow-lg shadow-red-200 transition-all cursor-pointer">Delete Now</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const SaveIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v13a2 2 0 0 1-2 2z" />
        <polyline points="17 21 17 13 7 13 7 21" />
        <polyline points="7 3 7 8 15 8" />
    </svg>
);
