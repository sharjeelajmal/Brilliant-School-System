"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Calendar, Filter, MessageCircle, Eye, ChevronDown, ChevronLeft, ChevronRight, X, Check, Trash2, AlertTriangle, BookOpen, User } from 'lucide-react';
import { toast } from 'sonner';
import { ComplaintViewModal } from './ComplaintViewModal';

interface ListProps {
    onAddNew: () => void;
}

// --- 1. ADVANCED CALENDAR COMPONENT ---
const AdvancedDatePicker = ({ value, onChange }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<'days' | 'months' | 'years'>('days');
    const [currentDate, setCurrentDate] = useState(new Date());
    const ref = useRef<any>(null);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const years = Array.from({ length: 41 }, (_, i) => 1990 + i);

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (ref.current && !ref.current.contains(event.target)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const handleDateClick = (day: number) => {
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        onChange(dateStr);
        setIsOpen(false);
    };

    const handleMonthSelect = (index: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(index);
        setCurrentDate(newDate);
        setView('days');
    };

    const handleYearSelect = (year: number) => {
        const newDate = new Date(currentDate);
        newDate.setFullYear(year);
        setCurrentDate(newDate);
        setView('months');
    };

    return (
        <div className="relative w-full" ref={ref}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between h-[50px] bg-white border rounded-xl px-4 cursor-pointer transition-all hover:shadow-sm ${isOpen || value ? 'border-[#B70003] ring-1 ring-[#B70003]/20' : 'border-gray-200 hover:border-gray-300'}`}
            >
                <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-md ${value ? 'bg-red-50 text-[#B70003]' : 'bg-gray-100 text-gray-400'}`}>
                        <Calendar size={16} />
                    </div>
                    <span className={`text-sm font-bold ${value ? 'text-[#191919]' : 'text-gray-400'}`}>
                        {value ? value : "Filter Date"}
                    </span>
                </div>
                {value ? (
                    <div onClick={(e) => { e.stopPropagation(); onChange(''); }} className="hover:bg-red-50 p-1 rounded-full text-gray-400 hover:text-red-500 cursor-pointer">
                        <X size={14} />
                    </div>
                ) : (
                    <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                )}
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-[56px] left-0 w-full md:w-[300px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden p-4"
                    >
                        <div className="flex justify-between items-center mb-4">
                            {view === 'days' && (
                                <>
                                    <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="p-1 hover:bg-gray-100 rounded-full cursor-pointer"><ChevronLeft size={18} /></button>
                                    <div className="flex gap-1">
                                        <span onClick={() => setView('months')} className="text-sm font-black text-[#191919] hover:bg-gray-100 px-2 py-1 rounded cursor-pointer">{months[currentDate.getMonth()]}</span>
                                        <span onClick={() => setView('years')} className="text-sm font-black text-[#191919] hover:bg-gray-100 px-2 py-1 rounded cursor-pointer">{currentDate.getFullYear()}</span>
                                    </div>
                                    <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="p-1 hover:bg-gray-100 rounded-full cursor-pointer"><ChevronRight size={18} /></button>
                                </>
                            )}
                            {view !== 'days' && (
                                <button onClick={() => setView('days')} className="text-xs font-bold text-gray-500 hover:text-[#B70003] flex items-center gap-1 cursor-pointer">
                                    <ChevronLeft size={14} /> Back
                                </button>
                            )}
                        </div>

                        {view === 'days' && (
                            <>
                                <div className="grid grid-cols-7 text-center mb-2">
                                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <span key={d} className="text-[10px] font-bold text-gray-400 uppercase">{d}</span>)}
                                </div>
                                <div className="grid grid-cols-7 gap-1 place-items-center">
                                    {Array.from({ length: getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth()) }).map((_, i) => <div key={`e-${i}`} />)}
                                    {Array.from({ length: getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth()) }).map((_, i) => {
                                        const day = i + 1;
                                        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                        const isSelected = value === dateStr;
                                        return (
                                            <div key={day} onClick={() => handleDateClick(day)} className={`h-8 w-8 flex items-center justify-center text-xs font-bold rounded-full cursor-pointer transition-all ${isSelected ? 'bg-[#B70003] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>{day}</div>
                                        );
                                    })}
                                </div>
                            </>
                        )}

                        {view === 'months' && (
                            <div className="grid grid-cols-3 gap-2">
                                {months.map((m, i) => (
                                    <div key={m} onClick={() => handleMonthSelect(i)} className={`p-2 text-center text-sm font-bold rounded-lg cursor-pointer hover:bg-red-50 hover:text-[#B70003] ${currentDate.getMonth() === i ? 'bg-[#B70003] text-white hover:bg-[#B70003] hover:text-white' : 'text-gray-600'}`}>{m}</div>
                                ))}
                            </div>
                        )}

                        {view === 'years' && (
                            <div className="grid grid-cols-4 gap-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                                {years.map((y) => (
                                    <div key={y} onClick={() => handleYearSelect(y)} className={`p-2 text-center text-sm font-bold rounded-lg cursor-pointer hover:bg-red-50 hover:text-[#B70003] ${currentDate.getFullYear() === y ? 'bg-[#B70003] text-white hover:bg-[#B70003] hover:text-white' : 'text-gray-600'}`}>{y}</div>
                                ))}
                            </div>
                        )}

                        <div onClick={() => { onChange(''); setIsOpen(false); }} className="mt-3 pt-2 border-t border-gray-100 text-center text-xs font-bold text-red-500 cursor-pointer hover:underline">
                            Clear Date
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- 2. DELETE MODAL ---
const DeleteModal = ({ isOpen, onClose, onConfirm }: any) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-[24px] shadow-2xl w-full max-w-[320px] p-6 text-center font-['Montserrat']"
            >
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#B70003]">
                    <AlertTriangle size={32} />
                </div>
                <h3 className="text-lg font-black text-[#191919] mb-2">Delete Complaint?</h3>
                <p className="text-sm text-gray-500 font-medium mb-6">Are you sure you want to delete this record? This action cannot be undone.</p>

                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors cursor-pointer">Cancel</button>
                    <button onClick={onConfirm} className="flex-1 py-3 bg-[#B70003] text-white font-bold rounded-xl hover:bg-[#900000] shadow-lg shadow-red-200 transition-colors cursor-pointer">Delete</button>
                </div>
            </motion.div>
        </div>
    );
};

// --- 3. MODERN DROPDOWN ---
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
                className={`flex items-center justify-between h-[50px] bg-white border rounded-xl px-4 cursor-pointer transition-all hover:shadow-sm ${isOpen || value ? 'border-[#B70003] ring-1 ring-[#B70003]/20' : 'border-gray-200 hover:border-gray-300'}`}
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`p-1.5 rounded-md ${value ? 'bg-red-50 text-[#B70003]' : 'bg-gray-100 text-gray-400'}`}>
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
                        className="absolute top-[56px] left-0 w-full bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden"
                    >
                        <div className="max-h-[200px] overflow-y-auto custom-scrollbar p-1">
                            {options.map((opt: string) => (
                                <div
                                    key={opt}
                                    onClick={() => { onChange(opt); setIsOpen(false); }}
                                    className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg cursor-pointer transition-colors mb-0.5 ${value === opt ? 'bg-[#B70003] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
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

// --- MAIN COMPONENT ---
export const ComplaintList = ({ onAddNew }: ListProps) => {
    const [complaints, setComplaints] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [classes, setClasses] = useState<string[]>([]);
    const [sections, setSections] = useState<string[]>([]);
    const [viewData, setViewData] = useState<any>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => { fetch('/api/classes').then(res => res.json()).then(data => { if (data.data) setClasses(data.data.map((c: any) => c.name)); }); }, []);
    useEffect(() => { if (!selectedClass) { setSections([]); return; } fetch(`/api/sections?class=${selectedClass}`).then(res => res.json()).then(data => { if (data.success) setSections(data.data.map((s: any) => s.name)); }); }, [selectedClass]);

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (selectedClass) params.append('class', selectedClass);
            if (selectedSection) params.append('section', selectedSection);
            if (dateFilter) params.append('date', dateFilter);
            const res = await fetch(`/api/complaints?${params.toString()}`);
            const data = await res.json();
            if (data.success) setComplaints(data.data);
        } catch (err) { toast.error("Failed to load"); }
        finally { setLoading(false); }
    };

    useEffect(() => { const timer = setTimeout(() => fetchComplaints(), 500); return () => clearTimeout(timer); }, [search, selectedClass, selectedSection, dateFilter]);

    const requestDelete = (id: string) => setDeleteId(id);
    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            const res = await fetch(`/api/complaints?id=${deleteId}`, { method: 'DELETE' });
            if (res.ok) { toast.success("Deleted!"); fetchComplaints(); } else { toast.error("Failed"); }
        } catch (error) { toast.error("Error"); } finally { setDeleteId(null); }
    };

    const handleWhatsApp = (item: any) => {
        if (!item.parentMobile) { toast.error("Number missing!"); return; }
        let number = item.parentMobile.replace(/[^0-9]/g, '');
        if (number.startsWith('03')) number = '92' + number.substring(1);
        window.open(`https://wa.me/${number}?text=${encodeURIComponent(`Complaint for ${item.studentName}: ${item.title}`)}`, '_blank');
    };

    return (
        <div className="space-y-6 font-['Montserrat'] animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AnimatePresence>{viewData && <ComplaintViewModal isOpen={!!viewData} onClose={() => setViewData(null)} data={viewData} />}</AnimatePresence>
            <AnimatePresence>{deleteId && <DeleteModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={confirmDelete} />}</AnimatePresence>

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-2">
                <div>
                    <h2 className="text-3xl font-black text-[#191919] uppercase tracking-tighter mb-2">Student Complaints</h2>
                    <motion.div initial={{ width: 0 }} animate={{ width: 80 }} transition={{ duration: 0.5 }} className="h-1 bg-[#B70003] rounded-full" />
                </div>
                <button onClick={onAddNew} className="h-[50px] px-8 bg-[#B70003] text-white font-bold rounded-xl shadow-lg hover:bg-[#950002] hover:shadow-xl transition-all flex items-center gap-2 active:scale-95 cursor-pointer">
                    <Plus size={20} /> Add Complaint
                </button>
            </div>

            {/* FILTERS */}
            <div className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                <AdvancedDatePicker value={dateFilter} onChange={setDateFilter} />
                <ModernDropdown label="All Classes" value={selectedClass} options={classes} onChange={(val: string) => { setSelectedClass(val); setSelectedSection(''); }} icon={Filter} />
                <ModernDropdown label="All Sections" value={selectedSection} options={sections} onChange={setSelectedSection} icon={Filter} />
                <div className="relative w-full">
                    <input type="text" placeholder="Search student..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-[50px] border border-gray-200 rounded-xl pl-12 pr-4 outline-none focus:border-[#B70003] focus:ring-1 focus:ring-[#B70003]/20 transition-all text-sm font-bold bg-gray-50/50 focus:bg-white text-[#191919] placeholder:text-gray-400" />
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            {/* DATA LIST (RESPONSIVE TABLE/CARDS) */}
            <div className="bg-white rounded-[24px] shadow-xl border border-gray-100 overflow-hidden min-h-[400px]">

                {/* DESKTOP HEADER (Hidden on Mobile) */}
                <div className="hidden md:grid grid-cols-12 gap-4 py-4 px-6 bg-gray-50/80 border-b border-gray-100">
                    <div className="col-span-1 text-gray-500 font-bold text-xs uppercase tracking-wider">Sr no.</div>
                    <div className="col-span-2 text-gray-500 font-bold text-xs uppercase tracking-wider">Date</div>
                    <div className="col-span-2 text-gray-500 font-bold text-xs uppercase tracking-wider">Full Name</div>
                    <div className="col-span-2 text-gray-500 font-bold text-xs uppercase tracking-wider">Class</div>
                    <div className="col-span-3 text-gray-500 font-bold text-xs uppercase tracking-wider">Title</div>
                    <div className="col-span-2"></div>
                </div>

                <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <div className="p-10 text-center text-gray-400 font-bold animate-pulse">Loading Records...</div>
                    ) : complaints.length === 0 ? (
                        <div className="p-10 text-center text-gray-400">No complaints found.</div>
                    ) : (
                        complaints.map((item, i) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                className="border-b border-gray-100 hover:bg-red-50/30 transition-colors group cursor-pointer"
                            >
                                {/* --- MOBILE VIEW (Card Layout) --- */}
                                <div className="md:hidden p-5 flex flex-col gap-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-1 rounded">#{String(item.rollNo).padStart(2, '0')}</span>
                                            <h4 className="font-bold text-[#191919]">{item.studentName}</h4>
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded flex items-center gap-1">
                                            <Calendar size={10} /> {item.date}
                                        </span>
                                    </div>

                                    <div className="flex gap-2 text-xs font-medium text-gray-500">
                                        <span className="flex items-center gap-1"><BookOpen size={12} /> {item.className} - {item.section}</span>
                                    </div>

                                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <p className="text-xs font-bold text-[#B70003] mb-1 line-clamp-1 uppercase">{item.title}</p>
                                        <p className="text-xs text-gray-600 line-clamp-2">{item.description}</p>
                                    </div>

                                    <div className="flex justify-end gap-2 mt-1">
                                        <button onClick={(e) => { e.stopPropagation(); setViewData(item); }} className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1"><Eye size={14} /> View</button>
                                        <button onClick={(e) => { e.stopPropagation(); handleWhatsApp(item); }} className="flex-1 bg-green-50 text-green-600 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1"><MessageCircle size={14} /> WhatsApp</button>
                                        <button onClick={(e) => { e.stopPropagation(); requestDelete(item._id); }} className="p-2 bg-red-50 text-red-600 rounded-lg"><Trash2 size={16} /></button>
                                    </div>
                                </div>

                                {/* --- DESKTOP VIEW (Grid Layout) --- */}
                                <div className="hidden md:grid grid-cols-12 gap-4 items-center py-4 px-6">
                                    <div className="col-span-1 font-bold text-gray-400 text-sm">#{String(item.rollNo || "00").padStart(2, '0')}</div>
                                    <div className="col-span-2 font-medium text-gray-500 text-sm flex items-center gap-2"><Calendar size={12} /> {item.date}</div>
                                    <div className="col-span-2 font-bold text-[#191919] text-sm group-hover:text-[#B70003] transition-colors">{item.studentName}</div>
                                    <div className="col-span-2"><span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-bold border border-gray-200">{item.className} - {item.section}</span></div>
                                    <div className="col-span-3 font-medium text-[#191919] text-sm truncate pr-4">{item.title}</div>
                                    <div className="col-span-2 flex justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => setViewData(item)} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer" title="View"><Eye size={16} /></button>
                                        <button onClick={() => handleWhatsApp(item)} className="p-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors cursor-pointer" title="Send WhatsApp"><MessageCircle size={16} /></button>
                                        <button onClick={() => requestDelete(item._id)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer" title="Delete"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};