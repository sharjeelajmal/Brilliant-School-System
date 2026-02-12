"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, ChevronDown, Check, X, Save,
    FileText, Edit3, Trash2, AlertTriangle, RefreshCw,
    Search, Clock, GraduationCap, Plus, ChevronLeft, ChevronRight
} from 'lucide-react';
import { toast, Toaster } from 'sonner';

// ========== CUSTOM CALENDAR ==========
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const CustomCalendar = ({ value, onChange }: { value: string; onChange: (date: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<any>(null);
    const selected = value ? new Date(value) : new Date();
    const [viewMonth, setViewMonth] = useState(selected.getMonth());
    const [viewYear, setViewYear] = useState(selected.getFullYear());

    useEffect(() => {
        const handleClickOutside = (e: any) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    const handleSelect = (day: number) => {
        const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        onChange(dateStr);
        setIsOpen(false);
    };

    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    };

    const formatDisplay = () => {
        if (!value) return 'Select Date';
        const d = new Date(value);
        return `${d.getDate()} ${MONTH_NAMES[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`;
    };

    return (
        <div className="relative" ref={ref}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between h-[50px] bg-white border rounded-xl px-4 cursor-pointer transition-all hover:shadow-sm gap-3 ${isOpen ? 'border-[#B50104] ring-1 ring-[#B50104]/20' : 'border-gray-200 hover:border-gray-300'}`}
            >
                <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-md ${value ? 'bg-red-50 text-[#B50104]' : 'bg-gray-100 text-gray-400'}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                    </div>
                    <span className={`text-sm font-bold ${value ? 'text-[#191919]' : 'text-gray-400'}`}>{formatDisplay()}</span>
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-[56px] left-0 w-[320px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden p-4"
                    >
                        {/* Month/Year Nav */}
                        <div className="flex items-center justify-between mb-4">
                            <button onClick={prevMonth} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 cursor-pointer transition-colors active:scale-90">
                                <ChevronLeft size={18} />
                            </button>
                            <h4 className="font-black text-sm text-[#191919] tracking-tight">
                                {MONTH_NAMES[viewMonth]} {viewYear}
                            </h4>
                            <button onClick={nextMonth} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 cursor-pointer transition-colors active:scale-90">
                                <ChevronRight size={18} />
                            </button>
                        </div>

                        {/* Weekday Headers */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {WEEKDAYS.map(d => (
                                <div key={d} className="text-center text-[10px] font-black text-gray-400 uppercase tracking-wider py-1">{d}</div>
                            ))}
                        </div>

                        {/* Days Grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {days.map((day, i) => {
                                if (day === null) return <div key={`empty-${i}`} />;
                                const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                const isSelected = dateStr === value;
                                const isToday = dateStr === todayStr;
                                return (
                                    <button
                                        key={day}
                                        onClick={() => handleSelect(day)}
                                        className={`w-full aspect-square rounded-xl text-sm font-bold flex items-center justify-center cursor-pointer transition-all active:scale-90 
                                            ${isSelected
                                                ? 'bg-[#B50104] text-white shadow-lg shadow-red-200'
                                                : isToday
                                                    ? 'bg-red-50 text-[#B50104] border border-[#B50104]/30'
                                                    : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        {day}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Today Button */}
                        <button
                            onClick={() => { onChange(todayStr); setViewMonth(today.getMonth()); setViewYear(today.getFullYear()); setIsOpen(false); }}
                            className="w-full mt-3 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl text-xs font-bold text-gray-500 hover:text-[#B50104] transition-colors cursor-pointer"
                        >
                            Today
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ========== STAT CARD (Same as Student List) ==========
const RedStatCard = ({ label, value, delay }: { label: string; value: number; delay: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.5 }}
        className="relative h-[130px] rounded-[16px] overflow-hidden bg-[#B50104] shadow-xl flex flex-col justify-center px-6 group cursor-default"
    >
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-[#C60205] opacity-60 rounded-full group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute right-12 bottom-[-20px] w-20 h-20 bg-[#C60205] opacity-60 rounded-full" />
        <div className="relative z-10 text-white">
            <h3 className="text-5xl font-black tracking-tighter mb-1">{value}</h3>
            <p className="text-sm font-medium opacity-90 uppercase tracking-widest">{label}</p>
        </div>
    </motion.div>
);

// ========== MODERN DROPDOWN ==========
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
                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute top-[56px] left-0 w-full bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                        <div className="max-h-[200px] overflow-y-auto custom-scrollbar p-1">
                            {value && (
                                <div onClick={() => { onChange(''); setIsOpen(false); }} className="flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg cursor-pointer mb-1">
                                    <X size={14} /> Clear Selection
                                </div>
                            )}
                            {options.map((opt: string) => (
                                <div key={opt} onClick={() => { onChange(opt); setIsOpen(false); }} className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg cursor-pointer transition-colors mb-0.5 ${value === opt ? 'bg-[#B50104] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
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

// ========== DELETE MODAL ==========
const DeleteModal = ({ isOpen, onClose, onConfirm }: any) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-[24px] shadow-2xl w-full max-w-[320px] p-6 text-center font-['Montserrat']">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#B50104]"><AlertTriangle size={32} /></div>
                <h3 className="text-lg font-black text-[#191919] mb-2">Delete Diary?</h3>
                <p className="text-sm text-gray-500 font-medium mb-6">Are you sure? This will permanently remove this diary entry.</p>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors cursor-pointer">Cancel</button>
                    <button onClick={onConfirm} className="flex-1 py-3 bg-[#B50104] text-white font-bold rounded-xl hover:bg-[#900000] shadow-lg shadow-red-200 transition-colors cursor-pointer">Delete</button>
                </div>
            </motion.div>
        </div>
    );
};

// =========================================================
// === MAIN COMPONENT ===
// =========================================================
interface ClassDiaryProps {
    mode: 'admin' | 'teacher';
}

export const ClassDiary = ({ mode }: ClassDiaryProps) => {
    const today = new Date().toISOString().split('T')[0];

    // State
    const [date, setDate] = useState(today);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [classes, setClasses] = useState<string[]>([]);
    const [sections, setSections] = useState<string[]>([]);
    const [subjects, setSubjects] = useState<string[]>([]);
    const [teacherName, setTeacherName] = useState('');

    const [entries, setEntries] = useState<any[]>([]);
    const [existingDiary, setExistingDiary] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showForm, setShowForm] = useState(false); // NEW: form visibility toggle
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // Summary stats
    const [summary, setSummary] = useState({ totalEntries: 0, classesCovered: 0, subjectsCovered: 0, pendingClasses: 0 });

    // All diaries for table view
    const [allDiaries, setAllDiaries] = useState<any[]>([]);

    // Fetch classes
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await fetch('/api/classes');
                const data = await res.json();
                if (data.data) setClasses(data.data.map((c: any) => c.name));
            } catch { }
        };
        fetchClasses();
    }, []);

    // Fetch sections when class changes
    useEffect(() => {
        if (!selectedClass) { setSections([]); setSubjects([]); return; }
        const fetchSections = async () => {
            try {
                const res = await fetch('/api/sections');
                const data = await res.json();
                if (data.data) {
                    const filtered = data.data.filter((s: any) => s.className === selectedClass).map((s: any) => s.name);
                    setSections(filtered);
                }
                const cRes = await fetch('/api/classes');
                const cData = await cRes.json();
                if (cData.data) {
                    const cls = cData.data.find((c: any) => c.name === selectedClass);
                    if (cls && cls.subjects) {
                        setSubjects(cls.subjects);
                        if (!existingDiary) {
                            setEntries(cls.subjects.map((s: string) => ({ subjectName: s, homework: '', classwork: '', notes: '' })));
                        }
                    }
                }
            } catch { }
        };
        fetchSections();
    }, [selectedClass]);

    // Fetch existing diary
    const fetchDiary = useCallback(async () => {
        if (!date || !selectedClass || !selectedSection) return;
        setLoading(true);
        try {
            const params = new URLSearchParams({ date, className: selectedClass, section: selectedSection });
            const res = await fetch(`/api/diary?${params}`);
            const data = await res.json();
            if (data.success && data.data.length > 0) {
                const diary = data.data[0];
                setExistingDiary(diary);
                setEntries(diary.entries);
                setTeacherName(diary.teacherName || '');
                setIsEditing(false);
            } else {
                setExistingDiary(null);
                setIsEditing(true);
                if (subjects.length > 0) {
                    setEntries(subjects.map((s: string) => ({ subjectName: s, homework: '', classwork: '', notes: '' })));
                }
            }
        } catch {
            toast.error("Diary load karne mein masla hua");
        } finally {
            setLoading(false);
        }
    }, [date, selectedClass, selectedSection, subjects]);

    useEffect(() => {
        if (showForm) fetchDiary();
    }, [fetchDiary, showForm]);

    // Fetch summary stats
    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const params = new URLSearchParams({ summary: 'true', date });
                const res = await fetch(`/api/diary?${params}`);
                const data = await res.json();
                if (data.success && data.summary) setSummary(data.summary);
            } catch { }
        };
        fetchSummary();
    }, [date]);

    // Fetch all diaries for a date
    const fetchAllDiaries = useCallback(async () => {
        try {
            const params = new URLSearchParams({ date });
            const res = await fetch(`/api/diary?${params}`);
            const data = await res.json();
            if (data.success) setAllDiaries(data.data);
        } catch { }
    }, [date]);

    useEffect(() => { fetchAllDiaries(); }, [fetchAllDiaries]);

    // Handle entry change
    const updateEntry = (index: number, field: string, value: string) => {
        setEntries(prev => prev.map((e, i) => i === index ? { ...e, [field]: value } : e));
    };

    // NEW DIARY — reset and open form
    const handleNewDiary = () => {
        setSelectedClass('');
        setSelectedSection('');
        setTeacherName('');
        setExistingDiary(null);
        setEntries([]);
        setIsEditing(true);
        setShowForm(true);
    };

    // Save diary
    const handleSave = async () => {
        if (!date || !selectedClass || !selectedSection) {
            toast.error("Date, Class aur Section select karein");
            return;
        }
        if (!teacherName.trim()) {
            toast.error("Teacher name daalein");
            return;
        }
        setSaving(true);
        try {
            const body = {
                date,
                className: selectedClass,
                section: selectedSection,
                teacherName,
                entries,
                ...(existingDiary && { id: existingDiary._id })
            };
            const method = existingDiary ? 'PUT' : 'POST';
            const res = await fetch('/api/diary', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            const data = await res.json();
            if (data.success) {
                toast.success(data.message || "Diary saved!");
                setExistingDiary(data.data);
                setIsEditing(false);
                fetchAllDiaries();
            } else {
                toast.error(data.error || "Save failed");
            }
        } catch {
            toast.error("Diary save karne mein masla hua");
        } finally {
            setSaving(false);
        }
    };

    // Delete diary
    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            const res = await fetch(`/api/diary?id=${deleteId}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                toast.success("Diary deleted!");
                setAllDiaries(prev => prev.filter(d => d._id !== deleteId));
                if (existingDiary?._id === deleteId) {
                    setExistingDiary(null);
                    setIsEditing(true);
                    setEntries(subjects.map(s => ({ subjectName: s, homework: '', classwork: '', notes: '' })));
                }
            } else { toast.error(data.error || "Delete failed"); }
        } catch { toast.error("Delete mein masla hua"); }
        finally { setDeleteId(null); }
    };

    // View a specific diary from table
    const viewDiary = (diary: any) => {
        setSelectedClass(diary.className);
        setSelectedSection(diary.section);
        setShowForm(true);
    };

    const filtersReady = selectedClass && selectedSection && date;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 font-['Montserrat'] pb-10">
            <Toaster position="top-center" richColors />

            {/* DELETE MODAL */}
            <AnimatePresence>
                {deleteId && <DeleteModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={confirmDelete} />}
            </AnimatePresence>

            {/* === HEADER === */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-4xl font-black text-[#B50104] uppercase tracking-tighter mb-1">
                        Class Diary
                    </motion.h1>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-gray-400 font-bold text-sm">
                        {mode === 'admin' ? 'Overview of all class diary entries' : 'Submit daily diary for your class'}
                    </motion.p>
                </div>

                {/* Top Actions */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-3">
                    <button
                        onClick={handleNewDiary}
                        className="h-[50px] px-8 bg-[#B50104] text-white font-bold rounded-xl shadow-lg hover:bg-[#900000] hover:shadow-xl transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
                    >
                        <Plus size={20} /> New Diary
                    </button>
                </motion.div>
            </div>

            {/* === STAT CARDS === */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <RedStatCard label="Total Entries" value={summary.totalEntries} delay={0} />
                <RedStatCard label="Classes Covered" value={summary.classesCovered} delay={0.1} />
                <RedStatCard label="Subjects Covered" value={summary.subjectsCovered} delay={0.2} />
                <RedStatCard label="Pending Classes" value={summary.pendingClasses} delay={0.3} />
            </div>

            {/* === FILTERS ROW (Calendar + Date Filter) === */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <CustomCalendar value={date} onChange={setDate} />
                {showForm && (
                    <>
                        <ModernDropdown label="Select Class" value={selectedClass} options={classes} onChange={(v: string) => { setSelectedClass(v); setSelectedSection(''); }} icon={BookOpen} />
                        <ModernDropdown label="Select Section" value={selectedSection} options={sections} onChange={setSelectedSection} icon={GraduationCap} />
                    </>
                )}
                {!showForm && (
                    <>
                        <div className="flex items-center gap-2 h-[50px] bg-gray-50 border border-gray-100 rounded-xl px-4 text-sm font-bold text-gray-400">
                            <BookOpen size={16} /> <span>Click "New Diary" to start</span>
                        </div>
                        <div className="flex items-center gap-2 h-[50px] bg-gray-50 border border-gray-100 rounded-xl px-4 text-sm font-bold text-gray-400">
                            <FileText size={16} /> <span>{allDiaries.length} entries today</span>
                        </div>
                    </>
                )}
            </motion.div>

            {/* === DIARY FORM (only when showForm is true & filters ready) === */}
            <AnimatePresence>
                {showForm && filtersReady && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -20, height: 0 }}
                        transition={{ duration: 0.4 }}
                        className="bg-white rounded-[24px] shadow-xl border border-gray-100 overflow-hidden"
                    >
                        {/* Form Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-[#B50104]"><BookOpen size={20} /></div>
                                <div>
                                    <h3 className="font-black text-[#191919] text-base">{selectedClass} - {selectedSection}</h3>
                                    <p className="text-xs text-gray-400 font-bold">
                                        {new Date(date).toLocaleDateString('en-PK', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* Teacher Name Input */}
                                <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 h-[40px]">
                                    <GraduationCap size={14} className="text-gray-400" />
                                    <input
                                        type="text"
                                        value={teacherName}
                                        onChange={(e) => setTeacherName(e.target.value)}
                                        placeholder="Teacher name..."
                                        disabled={!isEditing}
                                        className="bg-transparent outline-none text-xs font-bold text-[#191919] w-[130px] placeholder:text-gray-300 disabled:text-gray-500"
                                    />
                                </div>

                                {existingDiary && !isEditing && (
                                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer">
                                        <Edit3 size={14} /> Edit
                                    </button>
                                )}
                                {existingDiary && (
                                    <button onClick={() => setDeleteId(existingDiary._id)} className="flex items-center gap-1.5 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors cursor-pointer">
                                        <Trash2 size={14} /> Delete
                                    </button>
                                )}
                                <button onClick={() => setShowForm(false)} className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Mobile Teacher Field */}
                        <div className="md:hidden px-6 pt-4">
                            <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 h-[45px]">
                                <GraduationCap size={14} className="text-gray-400" />
                                <input type="text" value={teacherName} onChange={(e) => setTeacherName(e.target.value)} placeholder="Teacher name..." disabled={!isEditing} className="bg-transparent outline-none text-sm font-bold text-[#191919] flex-1 placeholder:text-gray-300 disabled:text-gray-500" />
                            </div>
                        </div>

                        {/* Loading */}
                        {loading ? (
                            <div className="p-12 text-center">
                                <RefreshCw size={24} className="text-gray-300 animate-spin mx-auto mb-3" />
                                <p className="text-sm font-bold text-gray-300">Loading diary...</p>
                            </div>
                        ) : (
                            <>
                                {/* Subject Entries */}
                                <div className="divide-y divide-gray-50">
                                    {entries.map((entry, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
                                            className="px-6 py-5 hover:bg-gray-50/30 transition-colors group"
                                        >
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-8 h-8 rounded-lg bg-[#B50104] flex items-center justify-center text-white font-black text-xs shadow-sm">
                                                    {String(index + 1).padStart(2, '0')}
                                                </div>
                                                <h4 className="font-black text-[#191919] text-sm uppercase tracking-wider">{entry.subjectName}</h4>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-11">
                                                {['homework', 'classwork', 'notes'].map((field) => (
                                                    <div key={field}>
                                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">{field}</label>
                                                        {isEditing ? (
                                                            <textarea
                                                                value={entry[field]}
                                                                onChange={(e) => updateEntry(index, field, e.target.value)}
                                                                placeholder={`Enter ${field}...`}
                                                                className="w-full h-[80px] border border-gray-200 rounded-xl p-3 text-sm font-medium text-[#191919] outline-none focus:border-[#B50104] focus:ring-1 focus:ring-[#B50104]/20 transition-all resize-none bg-gray-50/50 focus:bg-white placeholder:text-gray-300"
                                                            />
                                                        ) : (
                                                            <div className="min-h-[40px] bg-gray-50 rounded-xl p-3 text-sm text-gray-600 font-medium border border-gray-100">
                                                                {entry[field] || <span className="text-gray-300 italic">No {field}</span>}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Empty State */}
                                {entries.length === 0 && !loading && (
                                    <div className="p-16 text-center">
                                        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
                                            <BookOpen size={28} className="text-gray-300" />
                                        </div>
                                        <p className="text-sm font-bold text-gray-300">No subjects found for this class</p>
                                        <p className="text-xs text-gray-300 mt-1">Please add subjects to this class first</p>
                                    </div>
                                )}

                                {/* Submit Footer */}
                                {isEditing && entries.length > 0 && (
                                    <div className="px-6 py-5 border-t border-gray-50 bg-gray-50/30 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs text-gray-400 font-bold">
                                            <Clock size={14} />
                                            <span>{existingDiary ? 'Last Updated: ' + new Date(existingDiary.updatedAt).toLocaleString() : 'New Entry'}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {existingDiary && (
                                                <button onClick={() => { setEntries(existingDiary.entries); setIsEditing(false); }} className="px-6 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors cursor-pointer text-sm">
                                                    Cancel
                                                </button>
                                            )}
                                            <button onClick={handleSave} disabled={saving} className="px-8 py-3 bg-[#B50104] text-white font-bold rounded-xl hover:bg-[#900000] shadow-lg shadow-red-200 transition-all cursor-pointer text-sm flex items-center gap-2 active:scale-95 disabled:opacity-50">
                                                <Save size={16} />
                                                {saving ? 'Saving...' : existingDiary ? 'Update Diary' : 'Submit Diary'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* === EMPTY STATE (No form open) === */}
            {showForm && !filtersReady && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-16 text-center">
                    <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
                        <BookOpen size={36} className="text-gray-200" />
                    </div>
                    <p className="text-lg font-black text-gray-200">Select Class & Section</p>
                    <p className="text-sm text-gray-300 font-medium mt-1">Select class and section from above to create or view diary</p>
                </motion.div>
            )}

            {/* === ALL DIARIES TABLE === */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-[24px] shadow-xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <h3 className="font-black text-[#191919] text-base uppercase tracking-tighter">
                        Diary Entries — {new Date(date).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </h3>
                    <button onClick={fetchAllDiaries} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:text-[#B50104] hover:bg-red-50 transition-colors cursor-pointer active:scale-90">
                        <RefreshCw size={14} />
                    </button>
                </div>

                {allDiaries.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[700px]">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider">#</th>
                                        <th className="text-left px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider">Class</th>
                                        <th className="text-left px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider">Section</th>
                                        <th className="text-left px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider">Teacher</th>
                                        <th className="text-left px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider">Subjects</th>
                                        <th className="text-right px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allDiaries.map((diary, i) => (
                                        <motion.tr key={diary._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-6 py-4 text-sm font-black text-gray-300">{String(i + 1).padStart(2, '0')}</td>
                                            <td className="px-6 py-4"><span className="bg-red-50 text-[#B50104] px-3 py-1 rounded-lg text-xs font-bold">{diary.className}</span></td>
                                            <td className="px-6 py-4 text-sm font-bold text-[#191919]">{diary.section}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500 font-medium">{diary.teacherName || '-'}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-gray-600">{diary.entries?.length || 0} subjects</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => viewDiary(diary)} className="bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer" title="View Diary">
                                                        <Search size={14} />
                                                    </button>
                                                    <button onClick={() => setDeleteId(diary._id)} className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition-colors cursor-pointer" title="Delete">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-50 bg-gray-50/50">
                            <p className="text-xs font-bold text-gray-400">Total <span className="text-[#191919]">{allDiaries.length}</span> diary entries</p>
                        </div>
                    </>
                ) : (
                    <div className="p-16 text-center">
                        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
                            <BookOpen size={28} className="text-gray-300" />
                        </div>
                        <p className="text-sm font-bold text-gray-300">No diary entries for this date</p>
                        <p className="text-xs text-gray-300 mt-1">Click "New Diary" to create one</p>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};
