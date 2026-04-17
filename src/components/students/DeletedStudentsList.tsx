"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, UserX, Calendar, BookOpen, Pencil, Loader2 } from 'lucide-react';
import { toast, Toaster } from 'sonner';

// --- STAT CARD ---
const StatCard = ({ label, value, delay }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.5 }}
        className="relative h-[130px] rounded-[20px] overflow-hidden bg-[#B50104] shadow-xl flex flex-col justify-center px-7 group cursor-default"
    >
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-[#C60205] opacity-50 rounded-full group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute right-12 bottom-[-20px] w-20 h-20 bg-[#C60205] opacity-50 rounded-full" />
        <div className="relative z-10 text-white">
            <h3 className="text-5xl font-black tracking-tighter mb-1">{value}</h3>
            <p className="text-xs font-bold opacity-90 uppercase tracking-widest">{label}</p>
        </div>
    </motion.div>
);

// --- FORMAT DATE ---
const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    try {
        return new Date(dateStr).toLocaleDateString('en-PK', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    } catch { return dateStr; }
};

// --- EDITABLE SR NO FOR DELETED STUDENTS ---
const EditableDeletedSrNo = ({ student, onSaved }: { student: any; onSaved: (id: string, newSrNo: number) => void }) => {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(String(student.srNo ?? ''));
    const [saving, setSaving] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editing) inputRef.current?.focus();
    }, [editing]);

    const handleSave = async () => {
        const newSrNo = Number(value);
        if (!value.trim() || isNaN(newSrNo) || newSrNo <= 0) {
            toast.error('Please enter a valid Sr No');
            setValue(String(student.srNo ?? ''));
            setEditing(false);
            return;
        }
        if (newSrNo === student.srNo) { setEditing(false); return; }

        setSaving(true);
        try {
            const res = await fetch('/api/students/deleted', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ _id: student._id, srNo: newSrNo }),
            });
            const data = await res.json();
            if (res.status === 409 && data.conflict) {
                toast.error(`Sr No ${newSrNo} is already assigned to "${data.studentName}". Please try another number.`);
                setValue(String(student.srNo ?? ''));
            } else if (data.success) {
                toast.success(`Sr No updated to ${newSrNo} successfully`);
                onSaved(student._id, newSrNo);
            } else {
                toast.error(data.error || 'Update failed');
                setValue(String(student.srNo ?? ''));
            }
        } catch {
            toast.error('Network error');
            setValue(String(student.srNo ?? ''));
        } finally {
            setSaving(false);
            setEditing(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSave();
        if (e.key === 'Escape') { setValue(String(student.srNo ?? '')); setEditing(false); }
    };

    if (saving) {
        return (
            <div className="w-10 h-10 rounded-full bg-[#B50104] flex items-center justify-center shadow-md shadow-red-200">
                <Loader2 size={16} className="text-white animate-spin" />
            </div>
        );
    }

    if (editing) {
        return (
            <input
                ref={inputRef}
                type="number"
                value={value}
                onChange={e => setValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className="w-10 h-10 rounded-full border-2 border-[#B50104] text-[#B50104] font-black text-xs outline-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
        );
    }

    return (
        <div
            onClick={() => setEditing(true)}
            title="Click to edit Sr No"
            className="w-10 h-10 rounded-full bg-[#B50104] flex items-center justify-center text-white font-black text-xs shadow-md shadow-red-200 cursor-pointer relative group/dsr hover:bg-[#900000] transition-colors"
        >
            <span className="group-hover/dsr:opacity-0 transition-opacity">{student.srNo ?? '—'}</span>
            <Pencil size={12} className="absolute opacity-0 group-hover/dsr:opacity-100 transition-opacity" />
        </div>
    );
};


export const DeletedStudentsList = () => {
    const [students, setStudents] = useState<any[]>([]);
    const [filtered, setFiltered] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const handleSrNoSaved = (id: string, newSrNo: number) => {
        const update = (list: any[]) => list.map(s => s._id === id ? { ...s, srNo: newSrNo } : s);
        setStudents(prev => update(prev));
        setFiltered(prev => update(prev));
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/students/deleted');
            const data = await res.json();
            if (data.success) {
                setStudents(data.data);
                setFiltered(data.data);
            }
        } catch { toast.error('Failed to load deleted students'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    // Search filter
    useEffect(() => {
        if (!search.trim()) { setFiltered(students); return; }
        const q = search.toLowerCase();
        setFiltered(students.filter(s =>
            `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
            s.fatherName?.toLowerCase().includes(q) ||
            s.srNo?.toString().includes(q) ||
            s.admissionClass?.toLowerCase().includes(q) ||
            s.reason?.toLowerCase().includes(q)
        ));
    }, [search, students]);

    // Stats
    const totalDeleted = students.length;
    const classes = new Set(students.map(s => s.admissionClass)).size;
    const thisMonth = students.filter(s => {
        if (!s.endingDate) return false;
        const d = new Date(s.endingDate);
        const now = new Date();
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    return (
        <div className="space-y-8 pb-20 font-['Montserrat']">
            <Toaster richColors position="top-center" />

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard label="Total Deleted Students" value={totalDeleted} delay={0.1} />
                <StatCard label="Deleted This Month" value={thisMonth} delay={0.2} />
            </div>

            {/* SEARCH BAR */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, Sr No, class or reason..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-[52px] pl-12 pr-4 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-[#191919] outline-none focus:border-[#B50104] focus:ring-1 focus:ring-[#B50104]/20 transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-[#B50104] font-bold text-sm px-5 rounded-2xl">
                    <UserX size={16} />
                    <span>{filtered.length} Record{filtered.length !== 1 ? 's' : ''}</span>
                </div>
            </div>

            {/* TABLE */}
            <div className="bg-white border border-gray-100 rounded-[24px] shadow-sm overflow-hidden">
                {/* Header */}
                <div className="grid gap-3 p-5 border-b border-gray-100 bg-gray-50/60"
                    style={{ gridTemplateColumns: '60px 1fr 1fr 80px 120px 110px 110px 110px 110px' }}>
                    {['Sr No', 'Name', 'Father Name', 'DOB', 'Adm. Class → End Class', 'Admission Date', 'Deletion Date', 'Reason', 'Gender'].map((h, i) => (
                        <div key={i} className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{h}</div>
                    ))}
                </div>

                {/* Rows */}
                <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <div className="p-20 text-center text-gray-400 font-bold animate-pulse">Loading Records...</div>
                    ) : filtered.length === 0 ? (
                        <div className="p-20 flex flex-col items-center gap-4 text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                                <UserX size={36} />
                            </div>
                            <p className="text-gray-400 font-bold text-sm">No deleted student records found</p>
                        </div>
                    ) : (
                        filtered.map((s, i) => (
                            <motion.div
                                key={s._id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.04 }}
                                className="grid gap-3 p-5 border-b border-gray-50 hover:bg-red-50/20 transition-colors items-center"
                                style={{ gridTemplateColumns: '60px 1fr 1fr 80px 120px 110px 110px 110px 110px' }}
                            >
                                {/* Sr No */}
                                <EditableDeletedSrNo student={s} onSaved={handleSrNoSaved} />

                                {/* Name */}
                                <div>
                                    <div className="text-sm font-black text-[#191919]">{s.firstName} {s.lastName}</div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase">{s.section ? `Sec: ${s.section}` : ''}</div>
                                </div>

                                {/* Father Name */}
                                <div className="text-sm font-bold text-gray-600">{s.fatherName || '—'}</div>

                                {/* DOB */}
                                <div className="text-xs font-bold text-gray-500">{formatDate(s.dob)}</div>

                                {/* Classes */}
                                <div className="flex items-center gap-1 text-xs font-bold">
                                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-lg">{s.admissionClass || '—'}</span>
                                    <span className="text-gray-300">→</span>
                                    <span className="bg-red-50 text-[#B50104] px-2 py-1 rounded-lg">{s.endingClass || '—'}</span>
                                </div>

                                {/* Admission Date */}
                                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                                    <BookOpen size={12} className="text-gray-300" />
                                    {formatDate(s.admissionDate)}
                                </div>

                                {/* Deletion Date */}
                                <div className="flex items-center gap-1.5 text-xs font-bold text-[#B50104]">
                                    <Calendar size={12} />
                                    {formatDate(s.endingDate)}
                                </div>

                                {/* Reason */}
                                <div className="text-xs font-bold text-gray-500 truncate" title={s.reason}>
                                    <span className="bg-orange-50 text-orange-600 px-2 py-1 rounded-lg line-clamp-1">
                                        {s.reason || '—'}
                                    </span>
                                </div>

                                {/* Gender */}
                                <div>
                                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${s.gender === 'Boy' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-600'}`}>
                                        {s.gender || '—'}
                                    </span>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
