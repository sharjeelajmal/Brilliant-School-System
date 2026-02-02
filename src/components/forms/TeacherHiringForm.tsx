"use client";
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, ArrowRight, ArrowLeft, Trash2, Save, Printer } from 'lucide-react';
import { toast, Toaster } from 'sonner';

// Custom UI Components (reuse existing ones)
import { CustomInput } from '@/components/ui/CustomInput';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import { CustomDropdown } from '@/components/ui/CustomDropdown';

export default function TeacherHiringForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    // Step 1: Personal Information
    firstName: '', lastName: '', gender: '', dob: '',
    cnic: '', mobileNo: '', emergencyContact: '',
    address: '', maritalStatus: '', remarks: '',
    photoUrl: '',
    
    // Future Steps Placeholders
    qualification: '', experience: '', 
    joiningDate: '', designation: '', 
    basicSalary: '', allowances: ''
  });
  
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const steps = [
    { id: 1, title: 'Personal Information' },
    { id: 2, title: 'Qualifications & Experience' },
    { id: 3, title: 'Enrollment' },
    { id: 4, title: 'Salary Structure' },
  ];

  // Helper: Calculate Age
  const calculateAge = (dobString: string) => {
    if (!dobString) return "00 Years Old";
    const today = new Date();
    const birthDate = new Date(dobString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} Years Old`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCustomChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
      setFormData({ ...formData, photoUrl: file.name });
    }
  };

  const handleRemovePhoto = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setPhotoPreview(null);
    setFormData({ ...formData, photoUrl: '' });
    if (fileInputRef.current) fileInputRef.current.value = ""; 
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        toast.success("Teacher Record Saved!");
        setPhotoPreview(null);
        setCurrentStep(1);
        setFormData({
            firstName: '', lastName: '', gender: '', dob: '', cnic: '', mobileNo: '', emergencyContact: '', address: '', maritalStatus: '', remarks: '', photoUrl: '',
            qualification: '', experience: '', joiningDate: '', designation: '', basicSalary: '', allowances: ''
        });
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to save.");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full min-h-[700px] bg-white rounded-[30px] shadow-2xl overflow-hidden font-['Montserrat'] border border-gray-100">
      <Toaster position="top-center" richColors />
      
      {/* Sidebar */}
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
                    {step.id !== 4 && (
                        <div className="absolute top-10 w-[2px] h-10 border-l-2 border-dotted border-white/30 left-1/2 -translate-x-1/2" />
                    )}
                 </div>
                 <span className={`text-white text-sm font-medium transition-all ${currentStep === step.id ? 'opacity-100' : 'opacity-50'}`}>
                    {step.title}
                 </span>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 p-12 bg-white relative overflow-y-auto">
        <header className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
          <h1 className="text-3xl font-black text-[#191919] uppercase tracking-tighter">Teacher Hiring Form</h1>
          <p className="text-[#B70003] font-bold text-sm uppercase tracking-widest">{steps[currentStep-1].title}</p>
        </header>

        <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full pb-10">
            
            {/* --- STEP 1: PERSONAL INFORMATION --- */}
            {currentStep === 1 && (
              <div className="space-y-6">
                 
                 {/* Top Section: Inputs + Photo */}
                 <div className="flex gap-8">
                    {/* Left Side: Inputs */}
                    <div className="flex-1 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <CustomInput label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
                            <CustomInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
                        </div>
                        <div className="grid grid-cols-2 gap-6 items-start">
                            <CustomDropdown label="Gender" name="gender" value={formData.gender} onChange={handleCustomChange} options={["Male", "Female"]} />
                            <div className="relative">
                                <CustomDatePicker label="Date of Birth" name="dob" value={formData.dob} onChange={handleCustomChange} />
                                <span className="absolute right-2 -bottom-5 text-[10px] font-bold text-gray-400">{calculateAge(formData.dob)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Upload Photo (Square Box) */}
                    <div 
                       onClick={() => !photoPreview && fileInputRef.current?.click()}
                       className={`w-[160px] h-[160px] mt-2 bg-white border-2 border-dashed ${photoPreview ? 'border-solid border-[#B70003]' : 'border-gray-300'} rounded-2xl flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-[#B70003] hover:text-[#B70003] transition-all group overflow-hidden relative shadow-sm`}
                    >
                       <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                       
                       {photoPreview ? (
                         <>
                           <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={handleRemovePhoto} className="p-2 bg-white text-red-600 rounded-full shadow-lg hover:scale-110 transition-transform"><Trash2 size={18} /></button>
                           </div>
                         </>
                       ) : (
                         <>
                           <div className="p-3 bg-gray-50 rounded-full mb-2 group-hover:bg-red-50 transition-colors"><Upload size={24} /></div>
                           <span className="text-[10px] font-bold uppercase tracking-wide text-center">Upload Photo</span>
                         </>
                       )}
                    </div>
                 </div>

                 {/* Middle Section: Contacts */}
                 <div className="grid grid-cols-3 gap-6">
                    <CustomInput label="CNIC / B-Form No." name="cnic" value={formData.cnic} onChange={handleChange} type="cnic" />
                    <CustomInput label="Mobile No." name="mobileNo" value={formData.mobileNo} onChange={handleChange} type="number" />
                    <CustomInput label="Emergency Contact No." name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} type="number" />
                 </div>

                 {/* Bottom Section: Address & Remarks */}
                 <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2">
                        <CustomInput label="Address" name="address" value={formData.address} onChange={handleChange} />
                    </div>
                    <CustomDropdown label="Marital Status" name="maritalStatus" value={formData.maritalStatus} onChange={handleCustomChange} options={["Single", "Married"]} />
                 </div>

                 <div className="w-full">
                    <CustomInput label="Remarks" name="remarks" value={formData.remarks} onChange={handleChange} />
                 </div>

                 <div className="flex justify-end pt-6 mt-4">
                   <button onClick={nextStep} className="px-12 py-4 bg-[#B70003] text-white font-bold rounded-xl shadow-xl hover:bg-[#950002] transition-all flex items-center gap-2 cursor-pointer">
                     Next <ArrowRight size={18} />
                   </button>
                 </div>
              </div>
            )}
             
            {/* Placeholders for Step 2, 3, 4 */}
            {currentStep > 1 && (
               <div className="flex flex-col items-center justify-center h-[400px] text-gray-300">
                  <p className="text-2xl font-black italic opacity-50">Step {currentStep}: Design Pending...</p>
                  <div className="flex gap-4 mt-8">
                     <button onClick={prevStep} className="px-10 py-3 border-2 border-[#B70003] text-[#B70003] font-bold rounded-xl">Previous</button>
                     {currentStep === 4 && (
                         <button onClick={handleSubmit} className="px-10 py-3 bg-[#B70003] text-white font-bold rounded-xl">Save Record</button>
                     )}
                  </div>
               </div>
            )}

        </motion.div>
      </div>
    </div>
  );
}