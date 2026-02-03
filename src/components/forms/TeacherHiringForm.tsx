"use client";
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Printer, Save, Upload, Trash2, GraduationCap } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// UI Components
import { CustomInput } from '@/components/ui/CustomInput';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import { CustomDropdown } from '@/components/ui/CustomDropdown';
import { MultiInput } from '@/components/ui/MultiInput';

// Modular Steps
import { StepEnrollment } from './teacher-steps/StepEnrollment';
import { StepQualification } from './teacher-steps/StepQualification';
import { StepPayroll } from './teacher-steps/StepPayroll'; // New Import

export default function TeacherHiringForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState({
    // Step 1: Personal
    firstName: '', lastName: '', gender: '', dob: '', cnic: '', mobileNo: '', emergencyContact: '', address: '', maritalStatus: '', remarks: '', photoUrl: '',
    
    // Step 2: Qualification
    degree: '', majorSubject: '', institute: '', completionYear: '', cgpa: '', totalExperience: '', lastInstitute: '', lastDesignation: '', subjectsTaught: '', classLevels: '', jobStartDate: '', jobEndDate: '', reasonLeaving: '',
    
    // Step 3: Enrollment
    joiningDate: '', subjectsAssigned: '', classSection: '', schoolInTime: '', schoolOutTime: '',
    
    // Step 4: Payroll Structure (NEW FIELDS)
    monthlySalary: '', salaryDate: '', allowance: '',
    leavingFine: '', lateFine: '', absentFine: '',
    securityDeposit: '', increment: '', paymentMethod: '',
    bankName: '', accountTitle: '', accountNo: ''
  });
  
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const steps = [
    { id: 1, title: 'Personal Information' },
    { id: 2, title: 'Qualifications & Experience' },
    { id: 3, title: 'Enrollment' },
    { id: 4, title: 'Payroll Structure' },
  ];

  // --- Handlers ---
  const calculateAge = (dobString: string) => {
    if (!dobString) return "00 Years Old";
    const today = new Date();
    const birthDate = new Date(dobString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return `${age} Years Old`;
  };

  const calculateJobDuration = (start: string, end: string) => {
    if (!start || !end) return "00 Years experience";
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (startDate > endDate) return "Invalid Dates";
    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
    if (months < 0) { years--; months += 12; }
    if (years === 0 && months === 0) return "Less than a month";
    return `${years > 0 ? `${years} Year(s) ` : ''}${months > 0 ? `${months} Month(s)` : ''} experience`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleCustomChange = (name: string, value: string) => setFormData({ ...formData, [name]: value });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
      setFormData({ ...formData, photoUrl: file.name });
    }
  };

  const handleRemovePhoto = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setPhotoPreview(null); 
    setFormData({ ...formData, photoUrl: '' });
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  const handlePrint = () => window.print();

  const generatePDF = async () => {
    if (!invoiceRef.current) return;
    try {
      invoiceRef.current.style.display = 'block'; 
      const canvas = await html2canvas(invoiceRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Hiring_Form_${formData.firstName}.pdf`);
      toast.success("Teacher Form Downloaded!");
    } catch (error) {
      toast.error("Failed to generate PDF.");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success("Teacher Hired Successfully!");
        await generatePDF();
      } else {
        toast.error("Failed to save.");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const yearsList = Array.from({ length: 40 }, (_, i) => (new Date().getFullYear() - i).toString());

  // --- Render Steps Logic ---
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
             <div className="flex gap-8">
                <div className="flex-1 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <CustomInput label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
                        <CustomInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
                    </div>
                    <div className="grid grid-cols-2 gap-6 items-start">
                        <CustomDropdown label="Gender" name="gender" value={formData.gender} onChange={handleCustomChange} options={["Male", "Female"]} />
                        <div className="relative">
                            <CustomDatePicker label="Date of Birth" name="dob" value={formData.dob} onChange={handleCustomChange} disableFuture={true} />
                            <span className="absolute right-2 -bottom-5 text-[10px] font-bold text-gray-400">{calculateAge(formData.dob)}</span>
                        </div>
                    </div>
                </div>
                <div onClick={() => !photoPreview && fileInputRef.current?.click()} className={`w-[160px] h-[160px] mt-2 bg-white border-2 border-dashed ${photoPreview ? 'border-solid border-[#B70003]' : 'border-gray-300'} rounded-2xl flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-[#B70003] hover:text-[#B70003] transition-all group overflow-hidden relative shadow-sm`}>
                   <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                   {photoPreview ? <><img src={photoPreview} alt="Preview" className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={handleRemovePhoto} className="p-2 bg-white text-red-600 rounded-full shadow-lg hover:scale-110 transition-transform"><Trash2 size={18} /></button></div></> : <><div className="p-3 bg-gray-50 rounded-full mb-2 group-hover:bg-red-50 transition-colors"><Upload size={24} /></div><span className="text-[10px] font-bold uppercase tracking-wide text-center">Upload Photo</span></>}
                </div>
             </div>
             <div className="grid grid-cols-3 gap-6">
                <CustomInput label="CNIC" name="cnic" value={formData.cnic} onChange={handleChange} type="cnic" />
                <MultiInput label="Mobile No." name="mobileNo" value={formData.mobileNo} onChange={handleCustomChange} type="number" />
                <MultiInput label="Emergency Contact" name="emergencyContact" value={formData.emergencyContact} onChange={handleCustomChange} type="number" />
             </div>
             <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2"><CustomInput label="Address" name="address" value={formData.address} onChange={handleChange} type="alphanumeric" /></div>
                <CustomDropdown label="Marital Status" name="maritalStatus" value={formData.maritalStatus} onChange={handleCustomChange} options={["Single", "Married"]} />
             </div>
             <div className="w-full"><CustomInput label="Remarks" name="remarks" value={formData.remarks} onChange={handleChange} type="alphanumeric" /></div>
          </div>
        );
      case 2:
        return <StepQualification formData={formData} handleChange={handleChange} handleCustomChange={handleCustomChange} yearsList={yearsList} calculateJobDuration={calculateJobDuration} />;
      case 3:
        return <StepEnrollment formData={formData} handleChange={handleChange} handleCustomChange={handleCustomChange} />;
      case 4:
        return <StepPayroll formData={formData} handleChange={handleChange} handleCustomChange={handleCustomChange} />;
      default: return null;
    }
  };

  return (
    <>
    <div className="flex w-full min-h-[700px] bg-white rounded-[30px] shadow-2xl overflow-hidden font-['Montserrat'] border border-gray-100 print:hidden">
      <Toaster position="top-center" richColors />
      <div className="w-[300px] bg-[#B70003] p-10 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10 pt-10"> 
           <div className="space-y-8 mt-4">
             {steps.map((step) => (
               <div key={step.id} className="relative pl-0 group cursor-pointer flex items-center" onClick={() => setCurrentStep(step.id)}>
                 <div className="relative flex flex-col items-center mr-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 z-10 transition-all ${currentStep === step.id ? 'bg-white text-[#B70003] border-white' : 'border-white text-white'}`}>
                        {step.id}
                    </div>
                    {step.id !== 4 && (<div className="absolute top-10 w-[2px] h-10 border-l-2 border-dotted border-white/30 left-1/2 -translate-x-1/2" />)}
                 </div>
                 <span className={`text-white text-sm font-medium transition-all ${currentStep === step.id ? 'opacity-100' : 'opacity-50'}`}>{step.title}</span>
               </div>
             ))}
           </div>
        </div>
      </div>

      <div className="flex-1 p-12 bg-white relative overflow-y-auto">
        <header className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
          <h1 className="text-3xl font-black text-[#191919] uppercase tracking-tighter">Teacher Hiring</h1>
          <p className="text-[#B70003] font-bold text-sm uppercase tracking-widest">{steps[currentStep-1].title}</p>
        </header>

        <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full pb-10">
            {renderStepContent()}
            
            <div className="flex justify-between items-center pt-8 mt-4 border-t border-gray-50">
               {currentStep > 1 && (
                   <button onClick={prevStep} className="px-10 py-4 border-2 border-[#B70003] text-[#B70003] font-bold rounded-xl hover:bg-red-50 transition-all flex items-center gap-2 cursor-pointer">
                     <ArrowLeft size={18} /> Previous
                   </button>
               )}
               
               <div className="flex gap-4 ml-auto">
                 {currentStep === 4 && (
                     <button className="px-10 py-4 bg-[#191919] text-white font-bold rounded-xl shadow-lg hover:bg-black transition-all flex items-center gap-2 cursor-pointer" onClick={handlePrint}>
                        Print <Printer size={18} />
                     </button>
                 )}
                 <button onClick={currentStep === 4 ? handleSubmit : nextStep} disabled={loading} className="px-12 py-4 bg-[#B70003] text-white font-bold rounded-xl shadow-lg hover:bg-[#950002] transition-all flex items-center gap-2 cursor-pointer">
                   {currentStep === 4 ? (loading ? 'Saving...' : <>Hire Teacher <Save size={18} /></>) : (<>Next <ArrowRight size={18} /></>)}
                 </button>
               </div>
            </div>
        </motion.div>
      </div>
    </div>

    {/* PRINT LAYOUT (Hidden on Screen) */}
    <div ref={invoiceRef} className="hidden print:block fixed top-0 left-0 w-full h-full bg-white z-[9999] p-0 font-['Montserrat']">
        <div className="w-[210mm] mx-auto h-full relative p-12">
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none"><GraduationCap size={400} className="text-[#B70003]" /></div>
              <div className="w-full h-4 bg-[#B70003] mb-8"></div>
              <div className="flex justify-between items-start mb-12">
                  <div className="flex items-center gap-5">
                      <div className="w-20 h-20 bg-[#191919] text-white rounded-2xl flex items-center justify-center shadow-lg"><GraduationCap size={45} /></div>
                      <div>
                          <h1 className="text-4xl font-black text-[#191919] tracking-tighter uppercase leading-none">EduSmart</h1>
                          <p className="text-[#B70003] font-bold tracking-[0.3em] text-xs uppercase mt-2">Teacher Contract</p>
                      </div>
                  </div>
                  <div className="text-right">
                      <h2 className="text-5xl font-black text-gray-100 uppercase tracking-tighter">Hiring</h2>
                      <p className="text-[#B70003] font-bold text-lg -mt-4">Confirmed</p>
                      <p className="text-sm font-bold text-[#191919] mt-2">{new Date().toLocaleDateString()}</p>
                  </div>
              </div>
              <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-bold uppercase border-b-2 border-black mb-4">Candidate Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                        <p><strong>CNIC:</strong> {formData.cnic}</p>
                        <p><strong>Mobile:</strong> {formData.mobileNo}</p>
                        <p><strong>Address:</strong> {formData.address}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold uppercase border-b-2 border-black mb-4">Qualification</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <p><strong>Degree:</strong> {formData.degree}</p>
                        <p><strong>Institute:</strong> {formData.institute}</p>
                        <p><strong>Total Experience:</strong> {formData.totalExperience}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold uppercase border-b-2 border-black mb-4">Job Offer</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <p><strong>Designation:</strong> {formData.designation}</p>
                        <p><strong>Joining Date:</strong> {formData.joiningDate}</p>
                        <p><strong>Monthly Salary:</strong> PKR {formData.monthlySalary}</p>
                        <p><strong>Salary Date:</strong> {formData.salaryDate} of every month</p>
                    </div>
                  </div>
              </div>
          </div>
    </div>
    </>
  );
}