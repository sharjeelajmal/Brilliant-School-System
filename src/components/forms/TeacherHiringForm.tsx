"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, CheckCircle, Eye } from 'lucide-react';
import { StepPersonal } from './teacher-steps/StepPersonal';
import { StepQualification } from './teacher-steps/StepQualification';
import { StepEnrollment } from './teacher-steps/StepEnrollment';
import { StepPayroll } from './teacher-steps/StepPayroll';
import { toast, Toaster } from 'sonner';


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
    const router = useRouter();
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

    const handleSavePreview = () => {
        window.sessionStorage.setItem('teacher-preview-data', JSON.stringify(formData));
        router.push('/teacher-preview');
    };

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
            <div className="bg-white p-8 rounded-[24px] shadow-xl border border-gray-100 max-w-[1000px] mx-auto min-h-[600px] flex flex-col font-['Montserrat']">
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
                                onClick={handleSavePreview}
                                className="px-8 py-3 bg-[#0A024B] text-white font-bold rounded-xl hover:bg-[#081b3c] transition-all flex items-center gap-2 cursor-pointer"
                            >
                                Save &amp; Preview <Eye size={18} />
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