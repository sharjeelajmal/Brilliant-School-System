"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Calendar, ChevronDown, CheckCircle, Eye, Wallet,
    MessageCircle, Users,
    Filter, RefreshCw, X
} from 'lucide-react';
import { toast, Toaster } from 'sonner';

// --- STAT CARD (Same as Student List Page) ---
const RedStatCard = ({ label, value, delay }: { label: string, value: string, delay: number }) => (
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

// --- MONTHS LIST ---
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

// --- CUSTOM DROPDOWN ---
const Dropdown = ({ label, value, options, onChange, icon: Icon }: any) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="w-full h-[48px] bg-white border border-gray-200 rounded-xl px-4 flex items-center justify-between cursor-pointer hover:border-[#B50104] transition-all shadow-sm hover:shadow-md text-sm font-bold text-gray-600 group"
            >
                <div className="flex items-center gap-2">
                    {Icon && <Icon size={16} className="text-gray-400 group-hover:text-[#B50104] transition-colors" />}
                    <span className={value ? 'text-[#191919]' : 'text-gray-400'}>{value || label}</span>
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${open ? 'rotate-180 text-[#B50104]' : ''}`} />
            </button>
            <AnimatePresence>
                {open && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-[54px] left-0 w-full bg-white border border-gray-100 shadow-2xl rounded-xl z-50 overflow-hidden max-h-[250px] overflow-y-auto custom-scrollbar"
                        >
                            {options.map((opt: string) => (
                                <div
                                    key={opt}
                                    onClick={() => { onChange(opt); setOpen(false); }}
                                    className="px-4 py-3 hover:bg-red-50 cursor-pointer text-sm font-bold text-gray-600 hover:text-[#B50104] transition-colors flex items-center justify-between"
                                >
                                    {opt}
                                    {value === opt && <CheckCircle size={14} className="text-[#B50104]" />}
                                </div>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- STATUS BADGE ---
const StatusBadge = ({ status }: { status: string }) => {
    const styles: any = {
        'Paid': 'bg-green-50 text-green-600 border-green-100',
        'Unpaid': 'bg-red-50 text-red-600 border-red-100',
        'Partial Paid': 'bg-orange-50 text-orange-600 border-orange-100',
    };
    return (
        <span className={`px-3 py-1 rounded-lg text-[11px] font-extrabold uppercase tracking-wider border ${styles[status] || 'bg-gray-50 text-gray-500 border-gray-100'}`}>
            {status}
        </span>
    );
};

// === MAIN COMPONENT ===
// Import FeeSlipTemplate
import { FeeSlipTemplate } from './FeeSlipTemplate';
import { FeeSubmission } from '@/components/dashboard/FeeSubmission';
import type { FeeSlipData } from './FeeSlipTemplate';

// === MAIN COMPONENT ===
export const MonthlyFeeCollection = () => {
    const now = new Date();
    const [month, setMonth] = useState(MONTHS[now.getMonth()]);
    const [year, setYear] = useState(now.getFullYear());
    const [status, setStatus] = useState('All');
    const [search, setSearch] = useState('');
    const [students, setStudents] = useState<any[]>([]);
    const [summary, setSummary] = useState<any>({ totalFee: 0, collectedFee: 0, remainingFee: 0, studentsUnpaid: 0 });
    const [loading, setLoading] = useState(true);

    // Fee Modal State
    const [showFeeModal, setShowFeeModal] = useState(false);
    const [selectedParent, setSelectedParent] = useState<any>(null);

    // Print State
    const [printData, setPrintData] = useState<FeeSlipData | null>(null);

    // Fetch Data
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                summary: 'true',
                month,
                year: String(year),
                ...(status !== 'All' && { status }),
                ...(search && { search })
            });
            const res = await fetch(`/api/fees?${params}`);
            const data = await res.json();
            if (data.success) {
                setStudents(data.data);
                setSummary(data.summary);
            }
        } catch (error) {
            toast.error("Fee data load karne mein masla hua");
        } finally {
            setLoading(false);
        }
    }, [month, year, status, search]);

    useEffect(() => {
        const debounce = setTimeout(fetchData, 300);
        return () => clearTimeout(debounce);
    }, [fetchData]);

    useEffect(() => {
        if (!printData) return;
        const timer = setTimeout(() => window.print(), 100);
        return () => clearTimeout(timer);
    }, [printData]);

    useEffect(() => {
        const clearPrintState = () => setPrintData(null);
        window.addEventListener('afterprint', clearPrintState);
        return () => window.removeEventListener('afterprint', clearPrintState);
    }, []);

    // Handlers
    const handleWhatsApp = (student: any) => {
        let number = (student.whatsappNo || student.mobileNo || '').replace(/[^0-9]/g, '');
        if (!number) return toast.error("No contact number found");
        if (number.startsWith('03')) number = '92' + number.substring(1);
        window.open(`https://wa.me/${number}?text=Assalam-o-Alaikum, Dear Parent. Your child ${student.studentName}'s fee for ${month} ${year} is pending. Please submit at the earliest. JazakAllah.`, '_blank');
    };

    const handlePrint = (student: any) => {
        const monthlyFee = student.totalFee || 0;
        const transportFee = student.transportFee || 0;
        const netExpected = monthlyFee + transportFee;
        const paidAmount = student.paidAmount || 0;
        const remainingAmount = netExpected - paidAmount;

        setPrintData({
            receiptNo: (student.feeId || 'N/A').slice(-6).toUpperCase(),
            studentName: student.studentName,
            parentName: student.parentName,
            month: `${month} ${year}`,
            monthlyFee: `${monthlyFee.toLocaleString()} PKR`,
            transportFee: `${transportFee.toLocaleString()} PKR`,
            totalFee: `${netExpected.toLocaleString()} PKR`,
            paidAmount: `${paidAmount.toLocaleString()} PKR`,
            remainingAmount: `${remainingAmount > 0 ? remainingAmount.toLocaleString() : '0'} PKR`,
            remarks: remainingAmount > 0 ? 'Partial Payment' : 'Full Payment Received'
        });
    };

    const handleCollectFee = async (student: any) => {
        const hasCnic = !!student.parentCnic;
        const hasPhone = !!(student.whatsappNo || student.mobileNo);

        if (!hasCnic && !hasPhone) {
            return toast.error("No parent CNIC or phone number found for this student");
        }

        const toastId = toast.loading("Loading Parent Details...");
        try {
            const res = await fetch(`/api/parents`);
            const data = await res.json();

            if (data.success) {
                let found = null;

                if (hasCnic) {
                    // Primary: match by CNIC
                    found = data.data.find((p: any) => p.cnic === student.parentCnic);
                }

                if (!found && hasPhone) {
                    // Fallback: match by WhatsApp number, then mobile number
                    found = data.data.find((p: any) =>
                        (student.whatsappNo && p.whatsappNo === student.whatsappNo) ||
                        (student.mobileNo && p.mobileNo === student.mobileNo)
                    );
                }

                if (found) {
                    setSelectedParent(found);
                    setShowFeeModal(true);
                    toast.dismiss(toastId);
                    return;
                }
            }
            toast.error("Parent details not found in system", { id: toastId });

        } catch (e) {
            toast.error("Network Error: Failed to load parents", { id: toastId });
        }
    };



    const monthIdx = MONTHS.indexOf(month);
    const mmYyyy = `${String(monthIdx + 1).padStart(2, '0')}/${year}`;
    const years = Array.from({ length: 5 }, (_, i) => String(now.getFullYear() - 2 + i));

    return (
        <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 font-['Montserrat'] pb-10 print:hidden">
                <Toaster position="top-center" richColors />

                {/* Fee Modal */}
                <AnimatePresence>
                    {showFeeModal && selectedParent && (
                        <FeeSubmission
                            parent={selectedParent}
                            defaultMonth={month}
                            defaultYear={year}
                            onClose={() => setShowFeeModal(false)}
                            onSuccess={(receiptData: FeeSlipData) => {
                                fetchData();
                                setShowFeeModal(false);
                                if (receiptData) setPrintData(receiptData);
                            }}
                        />
                    )}
                </AnimatePresence>

                {/* === TITLE SECTION === */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div>
                        <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-3xl md:text-4xl font-black text-[#B50104] tracking-tight">MONTHLY FEE COLLECTION</motion.h1>
                        <motion.div initial={{ width: 0 }} animate={{ width: 80 }} transition={{ duration: 0.6, delay: 0.2 }} className="h-1.5 bg-[#B50104] rounded-full mt-2" />
                    </div>
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="relative w-full lg:w-[350px]">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text" placeholder="Search Parent or Student..." value={search} onChange={(e) => setSearch(e.target.value)}
                            className="w-full h-[48px] bg-white border border-gray-200 rounded-xl pl-11 pr-10 text-sm font-bold text-[#191919] outline-none focus:border-[#B50104] focus:shadow-lg focus:shadow-red-500/10 transition-all placeholder:text-gray-300"
                        />
                        {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#B50104] cursor-pointer"><X size={16} /></button>}
                    </motion.div>
                </div>

                {/* === STAT CARDS === */}
                <div className="grid grid-cols-2 gap-6">
                    <RedStatCard label="Total Fee" value={summary.totalFee?.toLocaleString() || '0'} delay={0} />
                    <RedStatCard label="Collected Fee" value={summary.collectedFee?.toLocaleString() || '0'} delay={0.1} />
                    <RedStatCard label="Remaining Fee" value={summary.remainingFee?.toLocaleString() || '0'} delay={0.2} />
                    <RedStatCard label="Students Unpaid" value={String(summary.studentsUnpaid || '0')} delay={0.3} />
                </div>

                {/* === FILTERS & CONTROLS === */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white p-4 rounded-[24px] shadow-sm border border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                    <Dropdown label="Status" value={status} options={['All', 'Paid', 'Unpaid', 'Partial Paid']} onChange={setStatus} icon={Filter} />
                    <Dropdown label="Select Month" value={month} options={MONTHS} onChange={setMonth} icon={Calendar} />
                    <Dropdown label="Select Year" value={String(year)} options={years} onChange={(v: string) => setYear(parseInt(v))} icon={Calendar} />
                    <div className="flex h-[48px] bg-red-50 border border-red-100 rounded-xl px-4 items-center justify-between text-[#B50104] font-bold text-sm">
                        <div className="flex items-center gap-2"><Users size={16} /> <span>{summary.totalStudents || 0} Students</span></div>
                        <button onClick={fetchData} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/50 transition-colors cursor-pointer"><RefreshCw size={14} className={loading ? 'animate-spin' : ''} /></button>
                    </div>
                </motion.div>

                {/* === MODERN DATA TABLE === */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white rounded-[24px] shadow-xl border border-gray-100 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#B50104] to-[#FF4B4E]" />

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1000px]">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="text-left px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Sr No</th>
                                    <th className="text-left px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Student Details</th>
                                    <th className="text-left px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Fee Info</th>
                                    <th className="text-left px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="text-right px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest pr-10">Quick Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={i}><td colSpan={5} className="px-6 py-6"><div className="h-10 bg-gray-50 rounded-xl animate-pulse" /></td></tr>
                                    ))
                                ) : students.length > 0 ? (
                                    students.map((student: any, index: number) => (
                                        <motion.tr
                                            key={student.studentId}
                                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                                            className="group hover:bg-red-50/10 transition-all duration-300"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xs font-black text-gray-500 group-hover:bg-[#B50104] group-hover:text-white transition-colors shadow-sm">
                                                    {String(student.rollNo || '—').padStart(2, '0')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div>
                                                    <h4 className="text-sm font-bold text-[#191919] group-hover:text-[#B50104] transition-colors">{student.studentName}</h4>
                                                    <p className="text-[11px] font-medium text-gray-400 mt-0.5">{student.parentName || 'No Parent Info'}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div>
                                                    <h4 className="text-sm font-black text-[#191919]">{((student.totalFee || 0) + (student.transportFee || 0)).toLocaleString()} <span className="text-[10px] text-gray-400 font-bold">PKR</span></h4>
                                                    <p className="text-[11px] font-medium text-gray-400 mt-0.5 flex items-center gap-1">
                                                        {student.totalFee.toLocaleString()} + {student.transportFee.toLocaleString()}(T)
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <StatusBadge status={student.status} />
                                            </td>
                                            <td className="px-6 py-5">
                                            <div className="flex items-center justify-end gap-3">
                                                    {/* Collect: always visible now */}
                                                    <button onClick={() => handleCollectFee(student)} className="flex items-center gap-2 px-4 py-2 bg-[#B50104] text-white rounded-lg shadow-md shadow-red-500/20 hover:shadow-red-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer text-xs font-bold">
                                                        <Wallet size={14} /> Collect
                                                    </button>
                                                    <button onClick={() => handleWhatsApp(student)} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-green-500 hover:border-green-200 hover:bg-green-50 transition-all cursor-pointer shadow-sm active:scale-90">
                                                        <MessageCircle size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-20 text-center">
                                            <div className="flex flex-col items-center opacity-50">
                                                <Users size={48} className="text-gray-300 mb-4" />
                                                <p className="text-gray-400 font-bold">No Records Found</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </motion.div>

            {/* Print Template (Hidden until print) */}
            {printData && <FeeSlipTemplate data={printData} />}
        </>
    );
};
