import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, CheckCircle, ChevronDown, CreditCard, DollarSign,
    FileText, User, X, Receipt, Wallet, ArrowRight, AlertTriangle, Edit3
} from 'lucide-react';
import { toast } from 'sonner';
import { CustomDatePicker } from '../ui/CustomDatePicker';

// --- CUSTOM SELECT COMPONENT ---
const CustomSelect = ({ label, value, options, onChange, placeholder }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="relative w-full">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full h-[55px] bg-white border ${isOpen ? 'border-[#B50104]' : 'border-gray-200'} rounded-[16px] px-5 flex items-center justify-between cursor-pointer hover:border-[#B50104] transition-all shadow-sm hover:shadow-md`}
            >
                <span className={`text-sm font-bold ${value ? 'text-[#191919]' : 'text-gray-400'}`}>
                    {value || placeholder}
                </span>
                <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#B50104]' : ''}`} />
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-[65px] left-0 w-full bg-white border border-gray-100 shadow-2xl rounded-[16px] z-50 overflow-hidden"
                    >
                        {options.map((opt: string) => (
                            <div key={opt} onClick={() => { onChange(opt); setIsOpen(false); }} className="px-5 py-3 hover:bg-red-50 cursor-pointer text-sm font-bold text-gray-600 hover:text-[#B50104] transition-colors flex items-center justify-between group">
                                {opt}
                                {value === opt && <CheckCircle size={14} className="text-[#B50104]" />}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- EDITABLE AMOUNT ROW ---
const EditableAmountRow = ({
    label,
    amount,
    onChange,
    icon: Icon,
    bgColor = 'bg-gray-50',
    textColor = 'text-[#191919]',
    borderColor = 'border-gray-200',
    highlight = false,
}: {
    label: string;
    amount: number;
    onChange: (val: number) => void;
    icon: any;
    bgColor?: string;
    textColor?: string;
    borderColor?: string;
    highlight?: boolean;
}) => {
    const [editing, setEditing] = useState(false);
    const [raw, setRaw] = useState(String(amount));

    useEffect(() => {
        if (!editing) setRaw(String(amount));
    }, [amount, editing]);

    const commit = () => {
        const parsed = parseInt(raw);
        onChange(isNaN(parsed) || parsed < 0 ? 0 : parsed);
        setEditing(false);
    };

    return (
        <div className={`flex justify-between items-center p-4 ${bgColor} rounded-2xl border ${borderColor} transition-colors group/item`}>
            <div className="flex items-center gap-3">
                <div className={`p-2 bg-white rounded-lg transition-colors shadow-sm ${highlight ? 'text-[#B50104]' : 'text-gray-400 group-hover/item:text-[#B50104]'}`}>
                    <Icon size={18} />
                </div>
                <span className="text-sm font-bold text-gray-600">{label}</span>
            </div>
            {editing ? (
                <div className="flex items-center gap-2">
                    <input
                        autoFocus
                        type="number"
                        value={raw}
                        onChange={(e) => setRaw(e.target.value)}
                        onBlur={commit}
                        onKeyDown={(e) => e.key === 'Enter' && commit()}
                        className="w-28 text-right border-b-2 border-[#B50104] outline-none text-lg font-black text-[#191919] bg-transparent"
                    />
                    <span className="text-xs text-gray-400 font-bold">PKR</span>
                </div>
            ) : (
                <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-2 group/edit cursor-pointer"
                    title="Click to edit"
                >
                    <span className={`text-lg font-black ${textColor}`}>{amount.toLocaleString()} PKR</span>
                    <Edit3 size={13} className="text-gray-300 group-hover/edit:text-[#B50104] transition-colors" />
                </button>
            )}
        </div>
    );
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const monthMap: { [key: string]: number } = {
    'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
    'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
};

export const FeeSubmission = ({ parent, defaultMonth, defaultYear, onClose, onSuccess }: any) => {
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [feeType, setFeeType] = useState('Monthly Fee & Transport Fee');
    const [month, setMonth] = useState(defaultMonth || '');
    const [year, setYear] = useState<number>(defaultYear || new Date().getFullYear());
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [amountPaying, setAmountPaying] = useState('');
    const [calculating, setCalculating] = useState(false);
    const [isLate, setIsLate] = useState(false);
    const [loading, setLoading] = useState(false);

    // Editable breakdown amounts
    const [monthlyFeeAmount, setMonthlyFeeAmount] = useState(0);
    const [transportFeeAmount, setTransportFeeAmount] = useState(0);
    const [lateFineAmount, setLateFineAmount] = useState(500);
    const [previousDues, setPreviousDues] = useState(0);

    // Paid history
    const [paidHistory, setPaidHistory] = useState<any[]>([]);

    // Auto-set first child
    useEffect(() => {
        if (parent?.children?.length > 0) setSelectedStudent(parent.children[0]);
    }, [parent]);

    // Sync fees when student or feeType changes
    useEffect(() => {
        if (!selectedStudent) {
            setMonthlyFeeAmount(0);
            setTransportFeeAmount(0);
            return;
        }
        
        if (feeType === 'Monthly Fee & Transport Fee') {
            setMonthlyFeeAmount(parseInt(selectedStudent.monthlyFee) || 0);
            setTransportFeeAmount(parseInt(selectedStudent.transportFee) || 0);
        } else {
            const amount =
                feeType === 'Transport Fee' ? (parseInt(selectedStudent.transportFee) || 0) :
                feeType === 'Admission Fee' ? (parseInt(selectedStudent.admissionFee) || 0) :
                feeType === 'Exam Fee' ? (parseInt(selectedStudent.examFee) || 0) :
                feeType === 'Uniform and Books Fee' ? (parseInt(selectedStudent.uniformBooksCharges) || 0) : 0;
            setMonthlyFeeAmount(amount);
            setTransportFeeAmount(0);
        }
    }, [selectedStudent, feeType]);

    // Calculate Dues on Student / Date Change
    const calculateDues = useCallback(async () => {
        if (!selectedStudent) return;
        setCalculating(true);
        try {
            const [studentRes, feesRes] = await Promise.all([
                fetch(`/api/students?id=${selectedStudent.studentId}`),
                fetch(`/api/fees?studentId=${selectedStudent.studentId}`)
            ]);
            const studentData = await studentRes.json();
            const feesData = await feesRes.json();
            if (!studentData.success || !feesData.success) return;

            const paidFees = feesData.data || [];
            setPaidHistory(paidFees);

            // --- KEY FIX: If NO fee history exists for this student,
            // default to CURRENT month (not joining date month).
            // This prevents showing months of dues when software is newly purchased.
            if (paidFees.length === 0) {
                const now = new Date();
                setMonth(MONTHS[now.getMonth()]);
                setYear(now.getFullYear());
                setIsLate(now.getDate() > 10);
                setPreviousDues(0);
                return;
            }

            let targetMonth = month;
            let targetYear = year;
            const joiningDate = new Date(studentData.data.joiningDate || new Date().toISOString().split('T')[0]);
            const currentDate = new Date();

            if (defaultMonth && defaultYear) {
                targetMonth = defaultMonth;
                targetYear = defaultYear;
                setMonth(defaultMonth);
                setYear(defaultYear);
            } else {
                // Has fee history — find the next unpaid month from joining date
                const paidMonths = new Set(paidFees.map((f: any) => `${f.month} ${f.year}`));

                let checkDate = new Date(joiningDate);
                checkDate.setDate(1);

                while (true) {
                    const mName = checkDate.toLocaleString('default', { month: 'long' });
                    const yVal = checkDate.getFullYear();
                    // If this month is not paid, use it
                    if (!paidMonths.has(`${mName} ${yVal}`)) {
                        targetMonth = mName;
                        targetYear = yVal;
                        break;
                    }
                    if (checkDate > currentDate) { targetMonth = mName; targetYear = yVal; break; }
                    checkDate.setMonth(checkDate.getMonth() + 1);
                }

                setMonth(targetMonth);
                setYear(targetYear);
            }

            // Late fee logic
            const targetDateObj = new Date(targetYear, monthMap[targetMonth as keyof typeof monthMap] ?? 0, 1);
            const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            let late = false;
            if (targetDateObj < currentMonthStart) {
                late = true;
            } else if (targetDateObj.getTime() === currentMonthStart.getTime()) {
                late = new Date(date).getDate() > 10;
            }
            setIsLate(late);

            // Previous dues: Calculate by actual amounts (Expected Dues vs Paid Amount)
            const paidMonthlyAmount = paidFees
                .filter((f: any) => f.feeType === 'Monthly Fee')
                .reduce((sum: number, f: any) => sum + (f.amount || 0), 0);

            const joiningMonth = joiningDate.getMonth();
            const joiningYr = joiningDate.getFullYear();
            const currentMonthIdx = currentDate.getMonth();
            const currentYearIdx = currentDate.getFullYear();

            // Calculate elapsed months excluding the current month being paid
            const totalMonthsElapsed = Math.max(0, (currentYearIdx - joiningYr) * 12 + (currentMonthIdx - joiningMonth));
            const studentFee = parseInt(studentData.data.monthlyFee) || 0;

            // If they haven't paid the expected sum for past months, it becomes previous dues
            const expectedPaidSoFar = totalMonthsElapsed * studentFee;
            const actualPreviousDues = Math.max(0, expectedPaidSoFar - paidMonthlyAmount);

            setPreviousDues(actualPreviousDues);

        } catch (e) { console.error(e); }
        finally { setCalculating(false); }
    }, [selectedStudent, date]);

    useEffect(() => { calculateDues(); }, [calculateDues]);

    // Real-time calculations
    const netPayable = feeType === 'Monthly Fee & Transport Fee' 
        ? (monthlyFeeAmount + transportFeeAmount + (isLate ? lateFineAmount : 0) + previousDues)
        : monthlyFeeAmount;
    const paying = parseInt(amountPaying) || 0;
    const totalOutstanding = Math.max(0, netPayable - paying);

    const handleDateChange = (_name: string, value: string) => setDate(value);

    const handleSubmit = async () => {
        if (!amountPaying) return toast.error("Please enter amount paying");
        const parsedAmount = parseInt(amountPaying);
        if (isNaN(parsedAmount) || parsedAmount <= 0) return toast.error("Please enter a valid amount");
        if (calculating) return toast.error("Please wait... calculating fees");

        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            // --- CASE A: Combined Monthly Fee Collection ---
            if (feeType === 'Monthly Fee & Transport Fee') {
                let remainingPaying = parsedAmount;
                
                // 1. Monthly Fee Portion (includes Late Fine + Previous Dues)
                const monthlyPortion = monthlyFeeAmount + (isLate ? lateFineAmount : 0) + previousDues;
                const payingToMonthly = Math.min(remainingPaying, monthlyPortion);
                remainingPaying -= payingToMonthly;

                // 2. Transport Fee Portion
                const payingToTransport = Math.min(remainingPaying, transportFeeAmount);
                remainingPaying -= payingToTransport;

                const mainRes = await fetch('/api/fees', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        studentId: selectedStudent.studentId,
                        parentCnic: parent.cnic,
                        feeType: 'Monthly Fee',
                        amount: payingToMonthly,
                        month,
                        year,
                        status: payingToMonthly >= monthlyPortion ? 'Paid' : 'Partial Paid',
                        lateFine: isLate ? lateFineAmount : 0
                    })
                });
                const payload = await mainRes.json();

                if (mainRes.ok && payload?.success) {
                    // Submit Transport Fee if any portion allocated
                    if (payingToTransport > 0 || (transportFeeAmount > 0 && parsedAmount >= netPayable)) {
                        await fetch('/api/fees', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                studentId: selectedStudent.studentId,
                                parentCnic: parent.cnic,
                                feeType: 'Transport Fee',
                                amount: payingToTransport,
                                month,
                                year,
                                status: payingToTransport >= transportFeeAmount ? 'Paid' : 'Partial Paid',
                                lateFine: 0
                            })
                        });
                    }

                    const remainingAmount = Math.max(netPayable - parsedAmount, 0);
                    const receiptNo = String(payload?.data?._id || '').slice(-6).toUpperCase() || 'N/A';
                    const receiptData = {
                        receiptNo,
                        studentName: selectedStudent?.name || 'N/A',
                        parentName: `${parent?.parentFirstName || ''} ${parent?.parentLastName || ''}`.trim() || 'N/A',
                        month: `${month} ${year}`,
                        monthlyFee: `${monthlyFeeAmount.toLocaleString()} PKR`,
                        transportFee: `${transportFeeAmount.toLocaleString()} PKR`,
                        totalFee: `${netPayable.toLocaleString()} PKR`,
                        paidAmount: `${parsedAmount.toLocaleString()} PKR`,
                        remainingAmount: `${remainingAmount.toLocaleString()} PKR`,
                        remarks: remainingAmount > 0 ? 'Partial Payment' : (isLate ? 'Late Fine Included' : 'Full Payment Received')
                    };
                    toast.success("Fees Submitted Successfully!");
                    if (onSuccess) onSuccess(receiptData);
                    onClose();
                } else {
                    toast.error(payload?.error || "Submission Failed");
                }
            } 
            // --- CASE B: Single Fee Type Collection ---
            else {
                const res = await fetch('/api/fees', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        studentId: selectedStudent.studentId,
                        parentCnic: parent.cnic,
                        feeType,
                        amount: parsedAmount,
                        month,
                        year,
                        status: parsedAmount >= monthlyFeeAmount ? 'Paid' : 'Partial Paid',
                        lateFine: 0
                    })
                });
                const payload = await res.json();

                if (res.ok && payload?.success) {
                    const remainingAmount = Math.max(monthlyFeeAmount - parsedAmount, 0);
                    const receiptNo = String(payload?.data?._id || '').slice(-6).toUpperCase() || 'N/A';
                    const receiptData = {
                        receiptNo,
                        studentName: selectedStudent?.name || 'N/A',
                        parentName: `${parent?.parentFirstName || ''} ${parent?.parentLastName || ''}`.trim() || 'N/A',
                        month: `${month} ${year}`,
                        monthlyFee: feeType === 'Monthly Fee & Transport Fee' ? `${monthlyFeeAmount.toLocaleString()} PKR` : '0 PKR',
                        transportFee: feeType === 'Transport Fee' ? `${parsedAmount.toLocaleString()} PKR` : '0 PKR',
                        totalFee: `${monthlyFeeAmount.toLocaleString()} PKR`,
                        paidAmount: `${parsedAmount.toLocaleString()} PKR`,
                        remainingAmount: `${remainingAmount.toLocaleString()} PKR`,
                        remarks: remainingAmount > 0 ? 'Partial Payment' : 'Full Payment Received'
                    };
                    toast.success(`${feeType} Submitted!`);
                    if (onSuccess) onSuccess(receiptData);
                    onClose();
                } else {
                    toast.error(payload?.error || "Submission Failed");
                }
            }
        } catch (e) { toast.error("Network Error"); }
        finally { setLoading(false); }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                className="bg-[#F8F9FB] w-full max-w-6xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-white/50"
            >

                {/* Header */}
                <div className="px-10 py-6 border-b border-gray-200 flex justify-between items-center bg-white/80 backdrop-blur-xl sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#B50104] to-[#ff4b4e] flex items-center justify-center text-white shadow-lg shadow-red-500/30">
                            <Receipt size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-[#191919] tracking-tight">Fee Submission</h2>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Secure Payment Gateway</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-[#B50104] hover:text-white transition-all shadow-sm hover:rotate-90 hover:shadow-lg cursor-pointer">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8 lg:p-10 overflow-y-auto custom-scrollbar space-y-10">

                    {/* 1. Top Section: Filters & Info */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* Left: Filters */}
                        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="md:col-span-2">
                                <label className="text-xs font-black text-gray-400 uppercase ml-2 mb-2 block">Fee Type</label>
                                <CustomSelect
                                    placeholder="Select Fee Type"
                                    value={feeType}
                                    onChange={setFeeType}
                                    options={['Monthly Fee & Transport Fee', /*'Transport Fee',*/ 'Admission Fee', 'Exam Fee', 'Uniform and Books Fee', 'Other']}
                                />
                            </div>
                            <div>
                                <CustomDatePicker
                                    label="Payment Date"
                                    name="date"
                                    value={date}
                                    onChange={handleDateChange}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-black text-gray-400 uppercase ml-2 mb-2 block">For Month</label>
                                <div className="w-full h-[55px] bg-red-50 border border-red-100 rounded-[16px] px-5 flex items-center justify-between text-[#B50104] font-bold">
                                    {calculating ? "Calculating..." : `${month} ${year}` || "All Paid"}
                                    {isLate && <span className="text-[10px] bg-red-100 px-2 py-0.5 rounded-full ml-2">LATE FEE</span>}
                                </div>
                            </div>
                        </div>

                        {/* Right: Parent Info Card */}
                        <div className="lg:col-span-4 bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl font-black text-[#B50104] border-4 border-white shadow-md">
                                {parent.parentFirstName?.charAt(0)}
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Parent Name</p>
                                <h3 className="text-xl font-black text-[#191919]">{parent.parentFirstName} {parent.parentLastName}</h3>
                                <p className="text-xs font-bold text-[#B50104] bg-red-50 px-2 py-0.5 rounded-md inline-block mt-1">CNIC: {parent.cnic}</p>
                            </div>
                        </div>
                    </div>

                    {/* 2. Student Selection */}
                    <div>
                        <h3 className="text-xl font-black text-[#191919] mb-5 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm">1</div>
                            Select Student
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {parent.children.map((child: any) => (
                                <div
                                    key={child.studentId}
                                    onClick={() => setSelectedStudent(child)}
                                    className={`relative p-5 rounded-[24px] border-2 cursor-pointer transition-all duration-300 flex items-center gap-4 overflow-hidden group ${selectedStudent?.studentId === child.studentId ? 'border-[#B50104] bg-white shadow-xl scale-[1.02]' : 'border-transparent bg-white hover:border-red-100 shadow-sm'}`}
                                >
                                    {selectedStudent?.studentId === child.studentId && <div className="absolute top-0 right-0 w-16 h-16 bg-[#B50104] opacity-10 rounded-bl-full" />}
                                    <div className={`w-14 h-14 rounded-2xl overflow-hidden shadow-md transition-colors ${selectedStudent?.studentId === child.studentId ? 'ring-2 ring-[#B50104] ring-offset-2' : ''}`}>
                                        {child.photo ? <img src={child.photo} className="w-full h-full object-cover" /> : <User className="p-3 w-full h-full text-gray-400 bg-gray-100" />}
                                    </div>
                                    <div>
                                        <h4 className={`font-black text-lg transition-colors ${selectedStudent?.studentId === child.studentId ? 'text-[#B50104]' : 'text-[#191919]'}`}>{child.name}</h4>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">Class {child.class}</p>
                                        <p className="text-xs text-gray-400 font-bold mt-0.5">Monthly: {(parseInt(child.monthlyFee) || 0).toLocaleString()} PKR</p>
                                    </div>
                                    {selectedStudent?.studentId === child.studentId && (
                                        <div className="absolute bottom-4 right-4 text-[#B50104]">
                                            <CheckCircle size={20} className="fill-[#B50104] text-white" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 3. Fee Breakdown + Payment */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* Left: Editable Breakdown or Paid Receipt */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                            className="lg:col-span-8 bg-white p-0 rounded-[30px] shadow-xl border border-gray-100 relative overflow-hidden flex flex-col md:flex-row group"
                        >
                            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#B50104] via-red-500 to-orange-500" />

                            {(() => {
                                // Find if current feeType + Month + Year is paid
                                let currentStatus = null;
                                let paidAmountHistory = 0;
                                let receiptFeeId = '';
                                
                                if (feeType === 'Monthly Fee & Transport Fee') {
                                    const monthlyFeesForMonth = paidHistory.filter(f => f.feeType === 'Monthly Fee' && f.month === month && f.year === year);
                                    if (monthlyFeesForMonth.length > 0) {
                                        paidAmountHistory = monthlyFeesForMonth.reduce((sum, f) => sum + (f.amount || 0), 0);
                                        currentStatus = paidAmountHistory >= monthlyFeeAmount ? 'Paid' : 'Partial Paid';
                                        receiptFeeId = monthlyFeesForMonth[0]._id;
                                    }
                                } else {
                                    // For Admission, Exam, Academy, Other: checking by year instead of exact month 
                                    // (because they are usually annual/one-time)
                                    let other;
                                    if (feeType === 'Admission Fee' || feeType === 'Other' || feeType === 'Uniform and Books Fee') {
                                        // Once per lifetime/year, just check if it exists in history
                                        other = paidHistory.find(f => f.feeType === feeType);
                                    } else {
                                        // For Exam fee, check if it exists in the current year
                                        other = paidHistory.find(f => f.feeType === feeType && f.year === year);
                                    }
                                    
                                    if (other) {
                                        currentStatus = other.status;
                                        paidAmountHistory = other.amount || 0;
                                        receiptFeeId = other._id;
                                    }
                                }

                                if (currentStatus === 'Paid') {
                                    return (
                                        <div className="p-8 flex-1 flex flex-col items-center justify-center text-center">
                                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-4">
                                                <CheckCircle size={40} className="text-green-500" />
                                            </div>
                                            <h3 className="text-3xl font-black text-[#191919] mb-2 tracking-tight">Fee Already Paid</h3>
                                            <p className="text-gray-500 font-medium mb-8">This {feeType} for {month} {year} has been fully paid.</p>
                                            <button
                                                onClick={() => {
                                                    const amountToPrint = feeType === 'Monthly Fee & Transport Fee' ? netPayable : monthlyFeeAmount;
                                                    onSuccess({
                                                        receiptNo: String(receiptFeeId || '').slice(-6).toUpperCase() || 'N/A',
                                                        studentName: selectedStudent?.name || 'N/A',
                                                        parentName: `${parent?.parentFirstName || ''} ${parent?.parentLastName || ''}`.trim() || 'N/A',
                                                        month: `${month} ${year}`,
                                                        monthlyFee: feeType === 'Monthly Fee & Transport Fee' ? `${monthlyFeeAmount.toLocaleString()} PKR` : '0 PKR',
                                                        transportFee: feeType === 'Monthly Fee & Transport Fee' ? `${transportFeeAmount.toLocaleString()} PKR` : '0 PKR',
                                                        totalFee: `${amountToPrint.toLocaleString()} PKR`,
                                                        paidAmount: `${amountToPrint.toLocaleString()} PKR`,
                                                        remainingAmount: `0 PKR`,
                                                        remarks: 'Full Payment Received'
                                                    });
                                                    onClose();
                                                }}
                                                className="px-8 py-4 bg-[#B50104] text-white rounded-xl shadow-lg shadow-red-500/30 hover:scale-105 active:scale-95 transition-all font-bold flex items-center gap-3"
                                            >
                                                <Receipt size={20} /> Download Receipt
                                            </button>
                                        </div>
                                    );
                                }

                                return (
                                    <>
                                        <div className="p-8 flex-1">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-2xl font-black text-[#191919] mb-2 flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-[#191919] text-white flex items-center justify-center text-sm shadow-lg shadow-black/20">2</div>
                                                    Fee Breakdown
                                                </h3>
                                                {currentStatus === 'Partial Paid' && (
                                                    <button
                                                        onClick={() => {
                                                            const amountToPrint = feeType === 'Monthly Fee & Transport Fee' ? netPayable : monthlyFeeAmount;
                                                            onSuccess({
                                                                receiptNo: String(receiptFeeId || '').slice(-6).toUpperCase() || 'N/A',
                                                                studentName: selectedStudent?.name || 'N/A',
                                                                parentName: `${parent?.parentFirstName || ''} ${parent?.parentLastName || ''}`.trim() || 'N/A',
                                                                month: `${month} ${year}`,
                                                                monthlyFee: feeType === 'Monthly Fee & Transport Fee' ? `${monthlyFeeAmount.toLocaleString()} PKR` : '0 PKR',
                                                                transportFee: feeType === 'Monthly Fee & Transport Fee' ? `${transportFeeAmount.toLocaleString()} PKR` : '0 PKR',
                                                                totalFee: `${amountToPrint.toLocaleString()} PKR`,
                                                                paidAmount: `${paidAmountHistory.toLocaleString()} PKR`,
                                                                remainingAmount: `${(amountToPrint - paidAmountHistory).toLocaleString()} PKR`,
                                                                remarks: 'Partial Payment Receipt'
                                                            });
                                                            onClose();
                                                        }}
                                                        className="px-4 py-2 bg-orange-50 text-orange-600 rounded-lg border border-orange-200 text-xs font-bold shadow-sm hover:bg-orange-100 flex items-center gap-2"
                                                    >
                                                        <Receipt size={14} /> Pending Half Receipt
                                                    </button>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-400 font-bold mb-6 ml-14 flex items-center gap-1">
                                                <Edit3 size={11} /> Click any amount to edit it
                                            </p>

                                            <div className="space-y-4">
                                                {feeType === 'Monthly Fee & Transport Fee' ? (
                                                    <>
                                                        {/* Monthly Fee Amount */}
                                                        <EditableAmountRow
                                                            label={`Monthly Fee (${month} ${year})`}
                                                            amount={monthlyFeeAmount}
                                                            onChange={setMonthlyFeeAmount}
                                                            icon={FileText}
                                                            bgColor="bg-gray-50"
                                                            borderColor="border-transparent hover:border-gray-200"
                                                        />

                                                        {/* Transport Fee Amount */}
                                                        <EditableAmountRow
                                                            label="Transport Fee"
                                                            amount={transportFeeAmount}
                                                            onChange={setTransportFeeAmount}
                                                            icon={Calendar}
                                                            bgColor="bg-blue-50/30"
                                                            textColor={transportFeeAmount > 0 ? 'text-blue-600' : 'text-gray-400'}
                                                            borderColor="border-transparent hover:border-blue-100"
                                                        />

                                                        {/* Late Fine */}
                                                        <EditableAmountRow
                                                            label={`Late Fine ${isLate ? '' : '(Not Applied)'}`}
                                                            amount={isLate ? lateFineAmount : 0}
                                                            onChange={(v) => { setLateFineAmount(v); }}
                                                            icon={AlertTriangle}
                                                            bgColor={isLate ? 'bg-red-50/60' : 'bg-gray-50/50'}
                                                            textColor={isLate ? 'text-red-500' : 'text-gray-400'}
                                                            borderColor={isLate ? 'border-red-100' : 'border-transparent'}
                                                            highlight={isLate}
                                                        />

                                                        {/* Previous Dues */}
                                                        <EditableAmountRow
                                                            label="Previous Dues"
                                                            amount={previousDues}
                                                            onChange={setPreviousDues}
                                                            icon={Wallet}
                                                            bgColor="bg-orange-50/50"
                                                            textColor="text-orange-500"
                                                            borderColor="border-transparent hover:border-orange-100"
                                                        />
                                                    </>
                                                ) : (
                                                    <EditableAmountRow
                                                        label={`${feeType}${feeType === 'Monthly Fee & Transport Fee' ? ` (${month} ${year})` : ''}`}
                                                        amount={monthlyFeeAmount}
                                                        onChange={setMonthlyFeeAmount}
                                                        icon={FileText}
                                                        bgColor="bg-gray-50"
                                                        borderColor="border-transparent hover:border-gray-200"
                                                    />
                                                )}

                                                <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                                                {/* Net Payable — Real-time */}
                                                <div className="flex justify-between items-end px-2">
                                                    <span className="text-xl font-black text-gray-400 uppercase tracking-widest">Net Payable</span>
                                                    <div className="text-right">
                                                        <span className="text-4xl font-black text-[#B50104] drop-shadow-sm">{netPayable.toLocaleString()}</span>
                                                        <span className="text-xs text-gray-400 font-bold ml-1">PKR</span>
                                                        {currentStatus === 'Partial Paid' && (
                                                            <div className="text-xs text-orange-500 font-bold mt-1">(Already Paid: {paidAmountHistory} PKR)</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Payment Actions Side */}
                                        <div className="bg-gray-50 p-8 w-full md:w-[320px] border-l border-gray-100 flex flex-col justify-center space-y-6">
                                            <div>
                                                <label className="text-xs font-black text-gray-400 uppercase ml-1 mb-2 block">Amount Paying Now</label>
                                                <div className="relative group/input">
                                                    <input
                                                        type="number"
                                                        value={amountPaying}
                                                        onChange={(e) => setAmountPaying(e.target.value)}
                                                        className="w-full bg-white border-2 border-gray-200 focus:border-[#B50104] rounded-2xl py-4 pl-4 pr-12 text-center text-3xl font-black text-[#191919] outline-none shadow-sm transition-all group-hover/input:shadow-md"
                                                        placeholder="0"
                                                    />
                                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">PKR</span>
                                                </div>
                                                {/* Quick fill button */}
                                                {netPayable > 0 && (
                                                    <button
                                                        onClick={() => setAmountPaying(String(netPayable - paidAmountHistory > 0 ? netPayable - paidAmountHistory : 0))}
                                                        className="mt-2 w-full text-xs font-bold text-[#B50104] hover:underline cursor-pointer text-center"
                                                    >
                                                        Pay Remaining ({netPayable - paidAmountHistory > 0 ? (netPayable - paidAmountHistory).toLocaleString() : 0} PKR)
                                                    </button>
                                                )}
                                            </div>
                                            <button
                                                onClick={handleSubmit}
                                                disabled={loading}
                                                className="w-full py-5 bg-gradient-to-r from-[#B50104] to-[#950002] text-white font-bold rounded-2xl shadow-xl shadow-red-500/30 hover:shadow-red-500/50 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 flex items-center justify-center gap-3 group/btn relative overflow-hidden"
                                            >
                                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 rounded-2xl" />
                                                <span className="relative z-10">{loading ? "Processing..." : "Confirm Payment"}</span>
                                                {!loading && <ArrowRight size={20} className="relative z-10 group-hover/btn:translate-x-1 transition-transform" />}
                                            </button>
                                        </div>
                                    </>
                                );
                            })()}
                        </motion.div>

                        {/* Right: Real-time Outstanding Card */}
                        <div className="lg:col-span-4 space-y-5">
                            <div className="bg-[#191919] p-6 rounded-[30px] shadow-xl relative overflow-hidden text-white group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-bl-full transition-transform group-hover:scale-150 duration-700" />
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Outstanding</p>
                                            <h3 className="text-3xl font-black transition-all duration-300">
                                                {totalOutstanding.toLocaleString()} <span className="text-sm text-gray-500">PKR</span>
                                            </h3>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                            <Wallet className="text-white" size={20} />
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-gray-500 font-bold">Net Payable − Amount Paying</p>
                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 bg-white/5 px-3 py-2 rounded-xl w-fit mt-4">
                                        <span className={`w-2 h-2 rounded-full ${totalOutstanding > 0 ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`} />
                                        {totalOutstanding > 0 ? 'Pending Balance' : 'Fully Settled'}
                                    </div>
                                </div>
                            </div>

                            {/* Secure Transaction Info */}
                            <div className="bg-blue-50 p-6 rounded-[30px] border border-blue-100 text-blue-800">
                                <div className="flex items-start gap-4">
                                    <CheckCircle className="shrink-0 mt-1" size={20} />
                                    <div>
                                        <h4 className="font-bold text-sm mb-1">Secure Transaction</h4>
                                        <p className="text-xs opacity-80 leading-relaxed">All fee submissions are recorded securely. Receipts can be generated after submission. You can edit any amount above if needed.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </motion.div>
        </motion.div>
    );
};
