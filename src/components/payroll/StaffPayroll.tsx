"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDown, Check, X, Save, Search, RefreshCw,
    CreditCard, Users, AlertTriangle,
    Eye, Banknote, FileText, GraduationCap,
    Minus, Plus, ArrowLeft, Receipt, CircleDot
} from 'lucide-react';
import { toast, Toaster } from 'sonner';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// ========== RED STAT CARD ==========
const RedStatCard = ({ label, value, prefix, delay }: { label: string; value: number; prefix?: string; delay: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.5 }}
        className="relative h-[130px] rounded-[16px] overflow-hidden bg-[#B50104] shadow-xl flex flex-col justify-center px-6 group cursor-default"
    >
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-[#C60205] opacity-60 rounded-full group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute right-12 bottom-[-20px] w-20 h-20 bg-[#C60205] opacity-60 rounded-full" />
        <div className="relative z-10 text-white">
            <h3 className="text-4xl font-black tracking-tighter mb-1">
                {prefix && <span className="text-2xl opacity-70 mr-0.5">{prefix}</span>}
                {typeof value === 'number' ? value.toLocaleString() : value}
            </h3>
            <p className="text-sm font-medium opacity-90 uppercase tracking-widest">{label}</p>
        </div>
    </motion.div>
);

// ========== MODERN DROPDOWN ==========
const ModernDropdown = ({ label, value, options, onChange, icon: Icon }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<any>(null);
    useEffect(() => {
        const h = (e: any) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
        document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h);
    }, []);
    return (
        <div className="relative w-full" ref={ref}>
            <div onClick={() => setIsOpen(!isOpen)} className={`flex items-center justify-between h-[50px] bg-white border rounded-xl px-4 cursor-pointer transition-all hover:shadow-sm ${isOpen || value ? 'border-[#B50104] ring-1 ring-[#B50104]/20' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`p-1.5 rounded-md ${value ? 'bg-red-50 text-[#B50104]' : 'bg-gray-100 text-gray-400'}`}><Icon size={16} /></div>
                    <span className={`text-sm font-bold truncate ${value ? 'text-[#191919]' : 'text-gray-400'}`}>{value || label}</span>
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute top-[56px] left-0 w-full bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                        <div className="max-h-[200px] overflow-y-auto custom-scrollbar p-1">
                            {value && <div onClick={() => { onChange(''); setIsOpen(false); }} className="flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg cursor-pointer mb-1"><X size={14} /> Clear</div>}
                            {options.map((opt: string) => (
                                <div key={opt} onClick={() => { onChange(opt); setIsOpen(false); }} className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg cursor-pointer transition-colors mb-0.5 ${value === opt ? 'bg-[#B50104] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                                    {opt}{value === opt && <Check size={14} />}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ========== STATUS BADGE ==========
const StatusBadge = ({ status }: { status: string }) => {
    const styles: any = {
        'Paid': 'bg-emerald-50 text-emerald-600 border-emerald-100',
        'Unpaid': 'bg-red-50 text-red-600 border-red-100',
        'Partial Paid': 'bg-amber-50 text-amber-600 border-amber-100',
    };
    return <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${styles[status] || 'bg-gray-50 text-gray-500 border-gray-100'}`}>{status}</span>;
};

// ============================================================
// === SALARY DETAIL PAGE (Opens when clicking Pay/View) ===
// ============================================================
const SalaryDetailPage = ({ payroll, onBack, onRefresh }: { payroll: any; onBack: () => void; onRefresh: () => void }) => {
    const [paying, setPaying] = useState(false);
    const [saving, setSaving] = useState(false);

    // Editable deductions
    const [lateFine, setLateFine] = useState(payroll.lateFine || 0);
    const [absentFine, setAbsentFine] = useState(payroll.absentFine || 0);
    const [leavingFine, setLeavingFine] = useState(payroll.leavingFine || 0);
    const [securityDeposit, setSecurityDeposit] = useState(payroll.otherDeduction || 0);
    const [givenAmount, setGivenAmount] = useState(payroll.givenAmount || 0);
    const [notes, setNotes] = useState(payroll.notes || '');

    const totalEarnings = (payroll.baseSalary || 0) + (payroll.allowance || 0);
    const totalDeductions = lateFine + absentFine + leavingFine + securityDeposit;
    const netSalary = totalEarnings - totalDeductions;

    const handlePay = async () => {
        if (givenAmount <= 0) { toast.error("Amount daalein"); return; }
        setSaving(true);
        try {
            const res = await fetch('/api/payroll', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    teacherId: payroll.teacherId,
                    month: payroll.month,
                    year: payroll.year,
                    givenAmount,
                    lateFine, absentFine, leavingFine,
                    otherDeduction: securityDeposit,
                    notes,
                    paymentDate: new Date().toISOString().split('T')[0],
                }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success(data.message || "Salary paid!");
                onRefresh();
                onBack();
            } else toast.error(data.error || "Failed");
        } catch { toast.error("Payment error"); }
        finally { setSaving(false); }
    };

    const InfoItem = ({ label, value }: any) => (
        <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
            <span className="text-sm font-bold text-gray-500">{label}</span>
            <span className="text-sm font-black text-[#191919]">{typeof value === 'number' ? value.toLocaleString() + ' PKR' : value}</span>
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-6 font-['Montserrat'] pb-10">
            {/* Back + Title */}
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <button onClick={onBack} className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-[#B50104] transition-colors cursor-pointer active:scale-90">
                            <ArrowLeft size={18} />
                        </button>
                        <h2 className="text-2xl font-black text-[#191919] uppercase tracking-tighter">Salary Payroll</h2>
                    </div>
                    <StatusBadge status={payroll.status} />
                </div>

                {/* Teacher Info */}
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#B50104] rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg shadow-red-200">
                        {payroll.teacherName?.charAt(0) || 'T'}
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-[#191919]">{payroll.teacherName}</h3>
                        <p className="text-xs font-bold text-gray-400">ID: {payroll.teacherId?.slice(-8) || '—'} • {payroll.className ? `${payroll.className} - ${payroll.section}` : 'No class assigned'}</p>
                    </div>
                </div>
            </div>

            {/* Salary Overview + Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
                {/* Salary Overview */}
                <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-lg font-black text-[#191919] uppercase tracking-tighter">Salary Overview</h3>
                        <StatusBadge status={payroll.status} />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Salary Date</p>
                            <p className="text-sm font-black text-[#191919]">{payroll.paymentDate || 'DD/MM/YYYY'}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Salary Month</p>
                            <p className="text-sm font-black text-[#191919]">{payroll.month}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Salary</p>
                            <p className="text-sm font-black text-[#191919]">{totalEarnings.toLocaleString()} PKR</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Deductions</p>
                            <p className="text-sm font-black text-red-600">{totalDeductions.toLocaleString()} PKR</p>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-black text-[#191919] uppercase tracking-tighter mb-5">Quick Actions</h3>
                    <div className="space-y-3">
                        {payroll.status !== 'Paid' ? (
                            <button onClick={() => setPaying(true)} className="w-full py-4 bg-[#B50104] text-white font-bold rounded-xl shadow-lg shadow-red-200 hover:bg-[#900000] transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 text-sm">
                                <CreditCard size={18} /> Pay Salary
                            </button>
                        ) : (
                            <button disabled className="w-full py-4 bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 cursor-default flex items-center justify-center gap-2 text-sm opacity-80">
                                <Check size={18} /> Already Paid
                            </button>
                        )}
                        <button onClick={() => window.print()} className="w-full py-4 bg-white text-[#B50104] font-bold rounded-xl border-2 border-[#B50104] hover:bg-red-50 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 text-sm">
                            <Receipt size={18} /> Receipt
                        </button>
                    </div>
                </div>
            </div>

            {/* Earnings + Deductions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Earnings */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-black text-[#191919] uppercase tracking-tighter mb-4">Earnings</h3>
                    <div>
                        <InfoItem label="Basic Salary" value={payroll.baseSalary || 0} />
                        <InfoItem label="Allowance" value={payroll.allowance || 0} />
                        <InfoItem label="Increment" value={0} />
                        <InfoItem label="Bonus" value={0} />
                    </div>
                    <div className="flex items-center justify-between pt-4 mt-2 border-t-2 border-gray-200">
                        <span className="text-sm font-black text-[#191919]">Total Earning</span>
                        <span className="text-lg font-black text-emerald-600">{totalEarnings.toLocaleString()} PKR</span>
                    </div>
                </motion.div>

                {/* Deductions */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-black text-[#191919] uppercase tracking-tighter mb-4">Deductions</h3>
                    <div>
                        <InfoItem label="Absents" value={absentFine} />
                        <InfoItem label="Leaving Early" value={leavingFine} />
                        <InfoItem label="Late Arrival" value={lateFine} />
                        <InfoItem label="Salary Deposit" value={securityDeposit} />
                    </div>
                    <div className="flex items-center justify-between pt-4 mt-2 border-t-2 border-gray-200">
                        <span className="text-sm font-black text-[#191919]">Total Deduction</span>
                        <span className="text-lg font-black text-red-600">{totalDeductions.toLocaleString()} PKR</span>
                    </div>
                </motion.div>
            </div>

            {/* Net Salary */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[#191919] rounded-[24px] p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">Net Salary</p>
                        <p className="text-4xl font-black tracking-tighter">{netSalary.toLocaleString()} PKR</p>
                    </div>
                    {payroll.status === 'Paid' && (
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">Paid Amount</p>
                            <p className="text-2xl font-black text-emerald-400">{payroll.givenAmount?.toLocaleString()} PKR</p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* === PAY SALARY INLINE FORM === */}
            <AnimatePresence>
                {paying && payroll.status !== 'Paid' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-white rounded-[24px] shadow-xl border-2 border-[#B50104]/20 p-6 space-y-5">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-black text-[#B50104] uppercase tracking-tighter">Process Payment</h3>
                            <button onClick={() => setPaying(false)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 cursor-pointer"><X size={16} /></button>
                        </div>

                        {/* Adjust Deductions */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Late Fine', val: lateFine, set: setLateFine },
                                { label: 'Absent Fine', val: absentFine, set: setAbsentFine },
                                { label: 'Leaving Fine', val: leavingFine, set: setLeavingFine },
                                { label: 'Other', val: securityDeposit, set: setSecurityDeposit },
                            ].map(({ label, val, set }) => (
                                <div key={label}>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">{label}</label>
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => set(Math.max(0, val - 100))} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 cursor-pointer active:scale-90"><Minus size={12} /></button>
                                        <input type="number" value={val} onChange={(e) => set(Number(e.target.value) || 0)} className="flex-1 text-center text-sm font-bold text-[#191919] border border-gray-200 rounded-lg py-2 outline-none focus:border-[#B50104]" />
                                        <button onClick={() => set(val + 100)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-green-50 hover:text-green-500 cursor-pointer active:scale-90"><Plus size={12} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Amount to Pay</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">PKR</span>
                                <input type="number" value={givenAmount} onChange={(e) => setGivenAmount(Number(e.target.value) || 0)} className="w-full h-[55px] border border-gray-200 rounded-xl pl-14 pr-4 text-lg font-black text-[#191919] outline-none focus:border-[#B50104] focus:ring-1 focus:ring-[#B50104]/20 transition-all" />
                            </div>
                            <div className="flex gap-2 mt-2">
                                <button onClick={() => setGivenAmount(netSalary)} className="px-3 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-lg hover:bg-emerald-100 cursor-pointer">Full Amount</button>
                                <button onClick={() => setGivenAmount(Math.round(netSalary / 2))} className="px-3 py-1.5 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-lg hover:bg-amber-100 cursor-pointer">Half</button>
                            </div>
                        </div>

                        {/* Notes */}
                        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any remarks..." className="w-full h-[60px] border border-gray-200 rounded-xl p-3 text-sm font-medium text-[#191919] outline-none focus:border-[#B50104] resize-none placeholder:text-gray-300" />

                        {/* Pay Button */}
                        <button onClick={handlePay} disabled={saving || givenAmount <= 0} className="w-full py-4 bg-[#B50104] text-white font-bold rounded-xl hover:bg-[#900000] shadow-lg shadow-red-200 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50">
                            <Save size={18} /> {saving ? 'Processing...' : 'Confirm & Pay Now'}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// =========================================================
// === MAIN COMPONENT ===
// =========================================================
export const StaffPayroll = () => {
    const currentMonth = MONTHS[new Date().getMonth()];
    const currentYear = new Date().getFullYear();

    const [month, setMonth] = useState(currentMonth);
    const [year, setYear] = useState(currentYear);
    const [status, setStatus] = useState('');
    const [search, setSearch] = useState('');
    const [payrolls, setPayrolls] = useState<any[]>([]);
    const [summary, setSummary] = useState({ totalSalary: 0, givenSalary: 0, remainingSalary: 0, teachersUnpaid: 0 });
    const [loading, setLoading] = useState(true);

    // Detail page state
    const [selectedPayroll, setSelectedPayroll] = useState<any>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                summary: 'true', month, year: String(year), generate: 'true',
                ...(status && { status }), ...(search && { search }),
            });
            const res = await fetch(`/api/payroll?${params}`);
            const data = await res.json();
            if (data.success) {
                setPayrolls(data.data || []);
                if (data.summary) setSummary(data.summary);
            }
        } catch { toast.error("Data load failed"); }
        finally { setLoading(false); }
    }, [month, year, status, search]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const yearOptions = Array.from({ length: 5 }, (_, i) => String(currentYear - 2 + i));

    // === IF DETAIL PAGE IS OPEN ===
    if (selectedPayroll) {
        return <SalaryDetailPage payroll={selectedPayroll} onBack={() => setSelectedPayroll(null)} onRefresh={fetchData} />;
    }

    // === MAIN LIST VIEW ===
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 font-['Montserrat'] pb-10">
            <Toaster position="top-center" richColors />

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-4xl font-black text-[#B50104] uppercase tracking-tighter mb-1">Staff Payroll</motion.h1>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-gray-400 font-bold text-sm">Manage teacher salaries and payments</motion.p>
                </div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="relative w-full md:w-[280px]">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search Teacher..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-[50px] bg-white border border-gray-200 rounded-xl pl-11 pr-4 text-sm font-bold text-[#191919] outline-none focus:border-[#B50104] focus:ring-1 focus:ring-[#B50104]/20 transition-all placeholder:text-gray-300" />
                </motion.div>
            </div>

            {/* STAT CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <RedStatCard label="Total Salary" value={summary.totalSalary} prefix="₨" delay={0} />
                <RedStatCard label="Given Salary" value={summary.givenSalary} prefix="₨" delay={0.1} />
                <RedStatCard label="Remaining Salary" value={summary.remainingSalary} prefix="₨" delay={0.2} />
                <RedStatCard label="Teachers Unpaid" value={summary.teachersUnpaid} delay={0.3} />
            </div>

            {/* MM/YYYY + FILTERS */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <div className="mb-4">
                    <h2 className="text-3xl font-black text-[#191919] tracking-tighter">{month.toUpperCase()}/{year}</h2>
                </div>
                <div className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <ModernDropdown label="Status" value={status} options={['All', 'Paid', 'Unpaid', 'Partial Paid']} onChange={(v: string) => setStatus(v === 'All' ? '' : v)} icon={FileText} />
                    <ModernDropdown label="Select Month" value={month} options={MONTHS} onChange={setMonth} icon={CreditCard} />
                    <ModernDropdown label="Select Year" value={String(year)} options={yearOptions} onChange={(v: string) => setYear(Number(v))} icon={CreditCard} />
                    <button onClick={fetchData} className="h-[50px] bg-[#B50104] text-white font-bold rounded-xl shadow-lg hover:bg-[#900000] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95">
                        <RefreshCw size={16} /> Refresh
                    </button>
                </div>
            </motion.div>

            {/* TABLE */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-[24px] shadow-xl border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-16 text-center"><RefreshCw size={28} className="text-gray-300 animate-spin mx-auto mb-3" /><p className="text-sm font-bold text-gray-300">Loading payroll data...</p></div>
                ) : payrolls.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/50">
                                    <th className="text-left px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider">Sr no.#</th>
                                    <th className="text-left px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider">Teacher Name</th>
                                    <th className="text-left px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider">Class & Section</th>
                                    <th className="text-left px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider">Total Salary</th>
                                    <th className="text-left px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider">Deductions</th>
                                    <th className="text-left px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="text-right px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {payrolls.map((p, i) => (
                                    <motion.tr key={p._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4 text-sm font-black text-gray-300">{String(i + 1).padStart(2, '0')}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-[#B50104] rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0">{p.teacherName?.charAt(0) || 'T'}</div>
                                                <span className="text-sm font-bold text-[#191919]">{p.teacherName || 'Name Here'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 font-medium">{p.className ? `${p.className} - ${p.section}` : '-'}</td>
                                        <td className="px-6 py-4 text-sm font-black text-[#191919]">{p.totalSalary?.toLocaleString()} PKR</td>
                                        <td className="px-6 py-4 text-sm font-bold text-red-500">{p.totalDeductions?.toLocaleString()} PKR</td>
                                        <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => setSelectedPayroll(p)} className={`flex items-center gap-1.5 text-xs font-bold cursor-pointer transition-colors ${p.status === 'Paid' ? 'text-blue-500 hover:text-blue-700' : 'text-[#B50104] hover:text-[#900000]'}`}>
                                                {p.status === 'Paid' ? <><Eye size={14} /> View Receipt →</> : <><CreditCard size={14} /> Pay Salary →</>}
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-16 text-center">
                        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4"><Users size={28} className="text-gray-300" /></div>
                        <p className="text-sm font-bold text-gray-300">No payroll records found</p>
                    </div>
                )}
                {payrolls.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-50 bg-gray-50/50 flex items-center justify-between">
                        <p className="text-xs font-bold text-gray-400">Showing <span className="text-[#191919]">{payrolls.length}</span> teachers</p>
                        <p className="text-xs font-bold text-gray-400">{month} {year}</p>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};
