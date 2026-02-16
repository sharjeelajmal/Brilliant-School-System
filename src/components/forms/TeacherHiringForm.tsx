"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, CheckCircle, Printer } from 'lucide-react';
import { StepPersonal } from './teacher-steps/StepPersonal';
import { StepQualification } from './teacher-steps/StepQualification';
import { StepEnrollment } from './teacher-steps/StepEnrollment';
import { StepPayroll } from './teacher-steps/StepPayroll';
import { toast, Toaster } from 'sonner';

// --- MODERN GRADIENT PRINT TEMPLATE (Teacher Version) ---
const PrintableTemplate = ({ data }: { data: any }) => {
    // Helper for rendering fields with underlines
    const Field = ({ label, value, top, left, width }: { label: string, value: string, top: string, left: string, width: string }) => (
        <div className="absolute flex flex-col justify-end" style={{ top, left, width, height: '12px' }}>
            <div className="flex items-end w-full border-b border-[#3A3A3A] pb-[1px]">
                <span className="font-['Alexandria'] font-medium text-[10px] text-[#3A3A3A] mr-1 whitespace-nowrap">{label}</span>
                <span className="font-['Alexandria'] font-bold text-[10px] text-black flex-1 text-center truncate">{value}</span>
            </div>
        </div>
    );

    return (
        <div className="hidden print:block font-['Alexandria'] bg-white text-black w-[595px] h-[842px] mx-auto relative overflow-hidden">

            {/* --- HEADER --- */}
            {/* Group 961 - Header Container */}
            <div className="absolute w-[595px] h-[127px] left-[calc(50%-595px/2)] top-0 transform scale-x-[-1] z-0">
                {/* Vector 1 */}
                <div className="absolute left-0 right-0 top-0 bottom-[84.92%] bg-gradient-to-r from-[#032841] via-[#01578C] to-[#006091] transform scale-x-[-1]"></div>
                {/* Vector 2 */}
                <div className="absolute left-0 right-0 top-0 bottom-[86.18%] bg-gradient-to-r from-[#071E3A] via-[#124770] to-[#012F55] transform scale-x-[-1]"></div>
                {/* Vector 3 */}
                <div className="absolute left-[52.24%] right-0 top-0 bottom-[89.94%] bg-gradient-to-r from-[#011B36] via-[#072C4C] to-[#033861] transform scale-x-[-1]"></div>
            </div>

            {/* Logo Placeholder */}
            <div className="absolute w-[74px] h-[66px] left-[22px] top-[23px] z-10 flex items-center justify-center bg-white rounded-full shadow-sm p-1">
                <img src="/logo.jpg" alt="Logo" className="w-[50px] h-[50px] object-contain" />
            </div>

            {/* School Name */}
            <div className="absolute w-[424px] h-[24px] left-[calc(50%-424px/2-60.5px)] top-[40px] font-['Alexandria'] font-bold text-[20px] leading-[24px] text-[#0A024B] z-10">
                BRILLIANT SCIENCE SCHOOL & ACADEMY
            </div>

            {/* Contact Info */}
            <div className="absolute w-[66px] h-[10px] left-[calc(50%-66px/2-239.5px)] top-[127px] font-['Alexandria'] font-light text-[8px] leading-[10px] text-[#3A3A3A]">
                +92 322 4525320
            </div>
            <div className="absolute w-[257px] h-[10px] left-[calc(50%-257px/2-144px)] top-[139px] font-['Alexandria'] font-light text-[8px] leading-[10px] text-[#3A3A3A]">
                Maryam park Mangal bazar wali gali attari saroba sofiabad Lahore.
            </div>
            <div className="absolute w-[136px] h-[7px] left-[calc(50%-136px/2+202.5px)] top-[141px] font-['Alexandria'] font-light text-[6px] leading-[7px] text-[#3A3A3A]">
                Project of YouTube channel "Student ki Dunya"
            </div>

            {/* Blue Line Seperator */}
            <div className="absolute w-[545px] h-0 left-[calc(50%-545px/2)] top-[161px] border-[3px] border-[#0A024B]"></div>

            {/* Title */}
            <div className="absolute w-[187px] h-[24px] left-[calc(50%-187px/2+179px)] top-[171px] font-['Alexandria'] font-bold text-[20px] leading-[24px] text-[#0A024B] uppercase">
                HIRING FORM
            </div>


            {/* --- SECTIONS --- */}

            {/* 1. Personal Information */}
            <div className="absolute w-[112px] h-[12px] left-[calc(50%-112px/2-216.5px)] top-[215px] font-['Alexandria'] font-bold text-[10px] leading-[12px] text-[#0A024B]">
                Personal Information:
            </div>

            <Field label="First Name:" value={data.firstName} top="247px" left="calc(50% - 246px/2 - 149.5px)" width="246px" />
            <Field label="Last Name:" value={data.lastName} top="247px" left="calc(50% - 256px/2 + 142.5px)" width="256px" />

            <Field label="CNIC No:" value={data.cnic} top="274px" left="calc(50% - 245px/2 - 150px)" width="245px" />
            <Field label="Date of Birth:" value={data.dob} top="274px" left="calc(50% - 261px/2 + 145px)" width="261px" />

            <Field label="Mobile No:" value={data.mobileNo} top="301px" left="calc(50% - 244px/2 - 150.5px)" width="244px" />
            <Field label="Emergency Contact:" value={data.emergencyContact} top="301px" left="calc(50% - 261px/2 + 145px)" width="261px" />

            <Field label="Gender:" value={data.gender} top="328px" left="calc(50% - 246px/2 - 149.5px)" width="246px" />
            <Field label="Marital Status:" value={data.maritalStatus} top="328px" left="calc(50% - 258px/2 + 143.5px)" width="258px" />

            <Field label="Address:" value={data.address} top="355px" left="calc(50% - 510px/2 + 0px)" width="510px" />

            {/* Separator Line */}
            <div className="absolute w-[545px] h-0 left-[calc(50%-545px/2)] top-[387px] border border-[#3A3A3A]"></div>


            {/* 2. Qualification */}
            <div className="absolute w-[162px] h-[12px] left-[calc(50%-162px/2-191.5px)] top-[407px] font-['Alexandria'] font-bold text-[10px] leading-[12px] text-[#0A024B]">
                Qualification Details:
            </div>

            <Field label="Degree:" value={data.degree} top="439px" left="calc(50% - 246px/2 - 149.5px)" width="246px" />
            <Field label="Major Subject:" value={data.majorSubject} top="439px" left="calc(50% - 256px/2 + 142.5px)" width="256px" />

            <Field label="Institute:" value={data.institute} top="466px" left="calc(50% - 245px/2 - 150px)" width="245px" />
            <Field label="Experience:" value={`${data.totalExperience || 0} Years`} top="466px" left="calc(50% - 262px/2 + 145.5px)" width="262px" />


            {/* Separator Line */}
            <div className="absolute w-[545px] h-0 left-[calc(50%-545px/2)] top-[498px] border border-[#3A3A3A]"></div>


            {/* 3. Enrollment Info */}
            <div className="absolute w-[162px] h-[12px] left-[calc(50%-162px/2-191.5px)] top-[518px] font-['Alexandria'] font-bold text-[10px] leading-[12px] text-[#0A024B]">
                Enrollment Details:
            </div>

            <Field label="Designation:" value={data.designation} top="550px" left="calc(50% - 246px/2 - 149.5px)" width="246px" />
            <Field label="Joining Date:" value={data.joiningDate} top="550px" left="calc(50% - 256px/2 + 142.5px)" width="256px" />

            <Field label="Assigned Class:" value={`${data.assignedClass || 'N/A'} - ${data.assignedSection || 'N/A'}`} top="577px" left="calc(50% - 245px/2 - 150px)" width="245px" />
            <Field label="Subjects:" value={data.subjectsAssigned} top="577px" left="calc(50% - 262px/2 + 145.5px)" width="262px" />

            {/* Separator Line */}
            <div className="absolute w-[545px] h-0 left-[calc(50%-545px/2)] top-[609px] border border-[#3A3A3A]"></div>


            {/* 4. Compensation */}
            <div className="absolute w-[162px] h-[12px] left-[calc(50%-162px/2-191.5px)] top-[629px] font-['Alexandria'] font-bold text-[10px] leading-[12px] text-[#0A024B]">
                Compensation Package:
            </div>

            <Field label="Basic Monthly Salary:" value={`${data.monthlySalary} PKR`} top="661px" left="calc(50% - 248px/2 - 148.5px)" width="248px" />
            <Field label="Allowances:" value={`${data.allowance} PKR`} top="661px" left="calc(50% - 263px/2 + 146px)" width="263px" />

            <Field label="Security Deposit:" value={`${data.securityDeposit || 0} PKR`} top="688px" left="calc(50% - 248px/2 - 148.5px)" width="248px" />


            {/* Signatures */}
            <div className="absolute w-[100px] h-0 left-[60px] top-[780px] border border-[#3A3A3A]"></div>
            <div className="absolute w-[100px] left-[60px] top-[785px] text-[8px] font-bold text-center">Principal Signature</div>

            <div className="absolute w-[100px] h-0 right-[60px] top-[780px] border border-[#3A3A3A]"></div>
            <div className="absolute w-[100px] right-[60px] top-[785px] text-[8px] font-bold text-center">Teacher Signature</div>

        </div>
    );
};

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