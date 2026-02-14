"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, CheckCircle, Printer } from 'lucide-react';
import { StepPersonal } from './teacher-steps/StepPersonal';
import { StepQualification } from './teacher-steps/StepQualification';
import { StepEnrollment } from './teacher-steps/StepEnrollment';
import { StepPayroll } from './teacher-steps/StepPayroll';
import { toast, Toaster } from 'sonner';

// --- MODERN PRINTABLE TEMPLATE ---
const PrintableTemplate = ({ data }: { data: any }) => (
    <div className="hidden print:block font-sans p-8 bg-white text-black max-w-[210mm] mx-auto">

        {/* Header */}
        <div className="flex justify-between items-start border-b-4 border-[#B70003] pb-6 mb-8">
            <div>
                <h1 className="text-4xl font-extrabold uppercase tracking-tight text-[#B70003]">EduSmart</h1>
                <p className="text-lg font-semibold tracking-widest text-gray-600 uppercase mt-1">Staff Enrollment Profile</p>
            </div>
            <div className="text-right">
                <div className="w-32 h-40 bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-xs font-bold text-gray-400">
                    PASSPORT PHOTO
                </div>
            </div>
        </div>

        {/* Section 1: Personal Details */}
        <div className="mb-8">
            <h3 className="bg-gray-100 text-[#191919] font-bold uppercase text-sm py-2 px-4 mb-4 border-l-4 border-[#B70003]">01. Personal Information</h3>
            <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-sm px-4">
                <div className="flex border-b border-dotted border-gray-300 pb-1"><span className="w-32 text-gray-500 font-medium">Full Name:</span> <span className="font-bold">{data.firstName} {data.lastName}</span></div>
                <div className="flex border-b border-dotted border-gray-300 pb-1"><span className="w-32 text-gray-500 font-medium">CNIC No:</span> <span className="font-bold">{data.cnic}</span></div>
                <div className="flex border-b border-dotted border-gray-300 pb-1"><span className="w-32 text-gray-500 font-medium">Contact:</span> <span className="font-bold">{data.mobileNo}</span></div>
                <div className="flex border-b border-dotted border-gray-300 pb-1"><span className="w-32 text-gray-500 font-medium">Emergency:</span> <span className="font-bold">{data.emergencyContact}</span></div>
                <div className="flex border-b border-dotted border-gray-300 pb-1"><span className="w-32 text-gray-500 font-medium">Gender:</span> <span className="font-bold">{data.gender}</span></div>
                <div className="flex border-b border-dotted border-gray-300 pb-1"><span className="w-32 text-gray-500 font-medium">Marital Status:</span> <span className="font-bold">{data.maritalStatus}</span></div>
                <div className="col-span-2 flex border-b border-dotted border-gray-300 pb-1"><span className="w-32 text-gray-500 font-medium shrink-0">Address:</span> <span className="font-bold">{data.address}</span></div>
            </div>
        </div>

        {/* Section 2: Job Assignment */}
        <div className="mb-8">
            <h3 className="bg-gray-100 text-[#191919] font-bold uppercase text-sm py-2 px-4 mb-4 border-l-4 border-[#B70003]">02. Job Assignment</h3>
            <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-sm px-4">
                <div className="flex border-b border-dotted border-gray-300 pb-1"><span className="w-32 text-gray-500 font-medium">Designation:</span> <span className="font-bold">{data.designation}</span></div>
                <div className="flex border-b border-dotted border-gray-300 pb-1"><span className="w-32 text-gray-500 font-medium">Joining Date:</span> <span className="font-bold">{data.joiningDate}</span></div>
                <div className="flex border-b border-dotted border-gray-300 pb-1"><span className="w-32 text-gray-500 font-medium">Assigned Class:</span> <span className="font-bold">{data.assignedClass || 'N/A'}</span></div>
                <div className="flex border-b border-dotted border-gray-300 pb-1"><span className="w-32 text-gray-500 font-medium">Section:</span> <span className="font-bold">{data.assignedSection || 'N/A'}</span></div>
                <div className="flex border-b border-dotted border-gray-300 pb-1"><span className="w-32 text-gray-500 font-medium">Subject:</span> <span className="font-bold">{data.subjectsAssigned}</span></div>
                <div className="flex border-b border-dotted border-gray-300 pb-1"><span className="w-32 text-gray-500 font-medium">Shift:</span> <span className="font-bold">{data.schoolInTime} - {data.schoolOutTime}</span></div>
            </div>
        </div>

        {/* Section 3: Payroll */}
        <div className="mb-12">
            <h3 className="bg-gray-100 text-[#191919] font-bold uppercase text-sm py-2 px-4 mb-4 border-l-4 border-[#B70003]">03. Compensation Package</h3>
            <div className="grid grid-cols-3 gap-6 px-4">
                <div className="border border-gray-200 p-4 rounded-lg bg-gray-50">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Basic Salary</p>
                    <p className="text-xl font-black">{data.monthlySalary} <span className="text-xs font-medium">PKR</span></p>
                </div>
                <div className="border border-gray-200 p-4 rounded-lg bg-gray-50">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Total Allowances</p>
                    <p className="text-xl font-black">{data.allowance} <span className="text-xs font-medium">PKR</span></p>
                </div>
                <div className="border border-gray-200 p-4 rounded-lg bg-gray-50">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Security Deposit</p>
                    <p className="text-xl font-black">{data.securityDeposit} <span className="text-xs font-medium">PKR</span></p>
                </div>
            </div>
        </div>

        {/* Footer Signatures */}
        <div className="flex justify-between items-end mt-20 pt-8 border-t-2 border-gray-100">
            <div className="text-center">
                <p className="text-xs font-bold uppercase mb-12">Authorized By</p>
                <div className="w-48 border-t border-black"></div>
                <p className="text-[10px] font-bold text-gray-500 mt-2">Principal Signature</p>
            </div>
            <div className="text-center">
                <p className="text-xs font-bold uppercase mb-12">Employee Acceptance</p>
                <div className="w-48 border-t border-black"></div>
                <p className="text-[10px] font-bold text-gray-500 mt-2">Teacher Signature</p>
            </div>
        </div>

        <div className="fixed bottom-8 left-0 w-full text-center text-[10px] text-gray-400">
            Generated by EduSmart School System • {new Date().toLocaleDateString()}
        </div>
    </div>
);

const StepIndicator = ({ currentStep, steps }: { currentStep: number, steps: string[] }) => (
    <div className="flex justify-between mb-8 relative print:hidden">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10 rounded-full" />
        <div
            className="absolute top-1/2 left-0 h-1 bg-[#B70003] -z-10 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />
        {steps.map((step, i) => (
            <div key={i} className={`flex flex-col items-center gap-2 bg-white px-2`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border-2 ${currentStep > i + 1 ? 'bg-[#B70003] border-[#B70003] text-white' : currentStep === i + 1 ? 'bg-white border-[#B70003] text-[#B70003] scale-110 shadow-lg' : 'bg-gray-100 border-gray-100 text-gray-400'}`}>
                    {currentStep > i + 1 ? <CheckCircle size={14} /> : i + 1}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${currentStep === i + 1 ? 'text-[#B70003]' : 'text-gray-300'}`}>{step}</span>
            </div>
        ))}
    </div>
);

export default function TeacherHiringForm() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', gender: '', dob: '', cnic: '', mobileNo: '',
        emergencyContact: '', address: '', maritalStatus: '', remarks: '', photoUrl: '',
        degree: '', majorSubject: '', institute: '', completionYear: '', cgpa: '',
        totalExperience: '', lastInstitute: '', lastDesignation: '', subjectsTaught: '',
        classLevels: '', jobStartDate: '', jobEndDate: '', reasonLeaving: '',
        joiningDate: '', designation: '', assignedClass: '', assignedSection: '',
        subjectsAssigned: '', schoolInTime: '', schoolOutTime: '',
        monthlySalary: '', salaryDate: '', allowance: '', leavingFine: '', lateFine: '',
        absentFine: '', securityDeposit: '', salaryIncrement: '', paymentMethod: 'Cash',
        bankName: '', accountTitle: '', accountNo: ''
    });

    const steps = ["Personal", "Qualification", "Enrollment", "Payroll"];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCustomChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleNext = () => { if (step < 4) setStep(step + 1); };
    const handleBack = () => { if (step > 1) setStep(step - 1); };

    const handlePrint = () => { window.print(); };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/teacher', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) {
                toast.success("Teacher Hired & Saved Successfully!");
                setTimeout(() => window.location.reload(), 1500);
            } else {
                toast.error(data.error || "Save Failed");
            }
        } catch (error) {
            toast.error("Network Error: Could not save data.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <PrintableTemplate data={formData} />

            <div className="bg-white p-8 rounded-[24px] shadow-xl border border-gray-100 max-w-[1000px] mx-auto min-h-[600px] flex flex-col font-['Montserrat'] print:hidden">
                <Toaster position="top-center" richColors />

                <div className="mb-8">
                    <h2 className="text-3xl font-black text-[#191919] uppercase tracking-tighter mb-2">Teacher Hiring</h2>
                    <p className="text-gray-400 text-sm font-medium">Complete the onboarding process to register a new teacher.</p>
                </div>

                <StepIndicator currentStep={step} steps={steps} />

                <div className="flex-1 mt-4">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {step === 1 && <StepPersonal formData={formData} handleChange={handleChange} handleCustomChange={handleCustomChange} />}
                            {step === 2 && <StepQualification formData={formData} handleChange={handleChange} handleCustomChange={handleCustomChange} />}
                            {step === 3 && <StepEnrollment formData={formData} handleChange={handleChange} handleCustomChange={handleCustomChange} />}
                            {step === 4 && <StepPayroll formData={formData} handleChange={handleChange} handleCustomChange={handleCustomChange} />}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="flex justify-end gap-4 mt-12 pt-6 border-t border-gray-50">
                    {step > 1 && (
                        <button onClick={handleBack} className="px-8 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-all cursor-pointer">
                            Back
                        </button>
                    )}

                    {step < 4 ? (
                        <button onClick={handleNext} className="px-10 py-3 bg-[#191919] text-white font-bold rounded-xl shadow-lg hover:bg-black transition-all cursor-pointer">
                            Next Step
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={handlePrint}
                                className="px-8 py-3 bg-gray-100 text-[#191919] font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2 cursor-pointer border border-gray-200"
                            >
                                Print <Printer size={18} />
                            </button>

                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-10 py-3 bg-[#B70003] text-white font-bold rounded-xl shadow-lg hover:bg-[#950002] transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                            >
                                {loading ? "Saving..." : "Confirm Hiring"} <Save size={18} />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}