"use client";
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, ArrowRight, ArrowLeft, Trash2, Printer, Save, GraduationCap } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// UI Components
import { CustomInput } from '@/components/ui/CustomInput';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import { CustomDropdown } from '@/components/ui/CustomDropdown';
import { MultiInput } from '@/components/ui/MultiInput'; // NEW IMPORT

export default function AdmissionForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState({
    // Step 1
    firstName: '', lastName: '', gender: '', dob: '',
    studentCnic: '', religion: '', nationality: 'Pakistani',
    previousSchool: '', lastClass: '', leavingReason: '', studentRemarks: '',
    photoUrl: '',
    // Step 2
    parentFirstName: '', parentLastName: '', parentCnic: '',
    mobileNo: '', emergencyContact: '', whatsappNo: '', // These will now store comma separated strings
    address: '', relation: '', occupation: '', monthlyIncome: '',
    reference: '', parentRemarks: '',
    // Step 3
    joiningDate: '', classJoining: '', section: '',
    // Step 4 (REDUCED FIELDS)
    monthlyFee: '', feeDate: '', annualFee: '',
    admissionFee: '', academyFee: '', nazraFee: '',
    uniformBooksCharges: '', stationaryCharges: '', otherCharges: '',
    lateFeeFine: ''
    // Removed: discount, totalPayable, amountPaying, remainingAmount
  });
  
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const steps = [
    { id: 1, title: 'Student Information' },
    { id: 2, title: 'Parents/Guardian Information' },
    { id: 3, title: 'Enrollment' },
    { id: 4, title: 'Fee Structure' },
  ];

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
  
  const handlePrint = () => {
    window.print();
  };

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
      pdf.save(`Invoice_${formData.firstName}.pdf`);
      toast.success("Invoice PDF Downloaded!");
    } catch (error) {
      console.error("PDF Error:", error);
      toast.error("Failed to generate PDF.");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success("Student Saved Successfully!");
        await generatePDF();
      } else {
        toast.error("Registration Failed.");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="flex w-full min-h-[700px] bg-white rounded-[30px] shadow-2xl overflow-hidden font-['Montserrat'] border border-gray-100 print:hidden">
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
                    {step.id !== 4 && (<div className="absolute top-10 w-[2px] h-10 border-l-2 border-dotted border-white/30 left-1/2 -translate-x-1/2" />)}
                 </div>
                 <span className={`text-white text-sm font-medium transition-all ${currentStep === step.id ? 'opacity-100' : 'opacity-50'}`}>{step.title}</span>
               </div>
             ))}
           </div>
        </div>
      </div>

      <div className="flex-1 p-12 bg-white relative overflow-y-auto">
        <header className="flex justify-between items-center mb-10 border-b border-gray-100 pb-4">
          <h1 className="text-3xl font-black text-[#191919] uppercase tracking-tighter">Admission Form</h1>
          <p className="text-[#B70003] font-bold text-sm uppercase tracking-widest">{steps[currentStep-1].title}</p>
        </header>

        <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full pb-10">
            
            {/* Step 1 */}
            {currentStep === 1 && (
               <div className="space-y-8">
                  <div className="flex gap-8">
                     <div onClick={() => !photoPreview && fileInputRef.current?.click()} className={`w-[180px] h-[180px] bg-gray-50 border-2 border-dashed ${photoPreview ? 'border-solid border-[#B70003]' : 'border-gray-300'} rounded-2xl flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-[#B70003] hover:text-[#B70003] transition-all group order-last overflow-hidden relative`}>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                        {photoPreview ? <><img src={photoPreview} alt="Preview" className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={handleRemovePhoto} className="p-3 bg-white text-red-600 rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer"><Trash2 size={20} /></button></div></> : <><div className="p-3 bg-white rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform"><Upload size={24} /></div><span className="text-xs font-bold uppercase">Upload Photo</span></>}
                     </div>
                     <div className="flex-1 grid grid-cols-2 gap-6">
                        <CustomInput label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} type="text" />
                        <CustomInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} type="text" />
                        <div className="col-span-1"><CustomDropdown label="Gender" name="gender" value={formData.gender} onChange={handleCustomChange} options={["Male", "Female"]} /></div>
                        {/* Disable Future only for DOB */}
                        <div className="col-span-1"><CustomDatePicker label="Date of Birth" name="dob" value={formData.dob} onChange={handleCustomChange} disableFuture={true} /></div>
                        <CustomInput label="Birth Certificate No." name="studentCnic" value={formData.studentCnic} onChange={handleChange} type="cnic" />
                        <CustomInput label="Religion" name="religion" value={formData.religion} onChange={handleChange} type="text" />
                        <div className="col-span-2"><CustomInput label="Nationality" name="nationality" value={formData.nationality} onChange={handleChange} type="text" /></div>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-50">
                     <CustomInput label="Previous School Name" name="previousSchool" value={formData.previousSchool} onChange={handleChange} type="text" />
                     {/* Alphanumeric type used */}
                     <CustomInput label="Last Class Completed" name="lastClass" value={formData.lastClass} onChange={handleChange} type="alphanumeric" />
                     <div className="col-span-2"><CustomInput label="Reason for Leaving" name="leavingReason" value={formData.leavingReason} onChange={handleChange} type="text" /></div>
                     <div className="col-span-2"><CustomInput label="Remarks" name="studentRemarks" value={formData.studentRemarks} onChange={handleChange} type="alphanumeric" /></div>
                  </div>
                  <div className="flex justify-end pt-6"><button onClick={nextStep} className="px-12 py-4 bg-[#B70003] text-white font-bold rounded-xl shadow-xl hover:bg-[#950002] transition-all flex items-center gap-2 cursor-pointer">Next <ArrowRight size={18} /></button></div>
               </div>
            )}

            {/* Step 2 */}
            {currentStep === 2 && (
               <div className="space-y-8">
                  <div className="grid grid-cols-3 gap-6">
                     <CustomInput label="First Name" name="parentFirstName" value={formData.parentFirstName} onChange={handleChange} type="text" />
                     <CustomInput label="Last Name" name="parentLastName" value={formData.parentLastName} onChange={handleChange} type="text" />
                     <CustomInput label="CNIC" name="parentCnic" value={formData.parentCnic} onChange={handleChange} type="cnic" />
                  </div>
                  {/* MultiInput used for Phones */}
                  <div className="grid grid-cols-3 gap-6">
                     <MultiInput label="Mobile No." name="mobileNo" value={formData.mobileNo} onChange={handleCustomChange} type="number" />
                     <MultiInput label="Emergency Contact No." name="emergencyContact" value={formData.emergencyContact} onChange={handleCustomChange} type="number" />
                     <MultiInput label="WhatsApp No." name="whatsappNo" value={formData.whatsappNo} onChange={handleCustomChange} type="number" />
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                     {/* Address allows everything (alphanumeric) */}
                     <div className="col-span-2"><CustomInput label="Address" name="address" value={formData.address} onChange={handleChange} type="alphanumeric" /></div>
                     <div className="col-span-1"><CustomInput label="Relation with Student" name="relation" value={formData.relation} onChange={handleChange} type="text" /></div>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                     <CustomInput label="Occupation" name="occupation" value={formData.occupation} onChange={handleChange} type="text" />
                     <CustomInput label="Monthly Income" name="monthlyIncome" value={formData.monthlyIncome} onChange={handleChange} type="number" />
                     <CustomInput label="Reference" name="reference" value={formData.reference} onChange={handleChange} />
                  </div>
                  <div className="w-full"><CustomInput label="Remarks" name="parentRemarks" value={formData.parentRemarks} onChange={handleChange} type="alphanumeric" /></div>
                  <div className="flex justify-between pt-6 border-t border-gray-50 mt-4">
                     <button onClick={prevStep} className="px-10 py-4 border-2 border-[#B70003] text-[#B70003] font-bold rounded-xl hover:bg-red-50 transition-all flex items-center gap-2 cursor-pointer"><ArrowLeft size={18} /> Previous</button>
                     <button onClick={nextStep} className="px-12 py-4 bg-[#B70003] text-white font-bold rounded-xl shadow-xl hover:bg-[#950002] transition-all flex items-center gap-2 cursor-pointer">Next <ArrowRight size={18} /></button>
                  </div>
               </div>
            )}

            {/* Step 3 */}
            {currentStep === 3 && (
               <div className="space-y-8">
                  <div className="grid grid-cols-3 gap-6">
                     <CustomDatePicker label="Joining Date" name="joiningDate" value={formData.joiningDate} onChange={handleCustomChange} disableFuture={false} />
                     <CustomInput label="Class Joining" name="classJoining" value={formData.classJoining} onChange={handleChange} type="alphanumeric" />
                     <CustomDropdown label="Section" name="section" value={formData.section} onChange={handleCustomChange} options={["A", "B", "C", "D", "E"]} />
                  </div>
                  <div className="flex justify-between pt-6 border-t border-gray-50 mt-[300px]">
                     <button onClick={prevStep} className="px-10 py-4 border-2 border-[#B70003] text-[#B70003] font-bold rounded-xl hover:bg-red-50 transition-all flex items-center gap-2 cursor-pointer"><ArrowLeft size={18} /> Previous</button>
                     <button onClick={nextStep} className="px-12 py-4 bg-[#B70003] text-white font-bold rounded-xl shadow-xl hover:bg-[#950002] transition-all flex items-center gap-2 cursor-pointer">Next <ArrowRight size={18} /></button>
                  </div>
               </div>
            )}

            {/* Step 4 (Fields Removed as Requested) */}
            {currentStep === 4 && (
              <div className="space-y-6">
                 <div className="grid grid-cols-3 gap-6">
                    <CustomInput label="Monthly Fee" name="monthlyFee" value={formData.monthlyFee} onChange={handleChange} type="number" suffix="PKR" />
                    <CustomDatePicker label="Fee Date" name="feeDate" value={formData.feeDate} onChange={handleCustomChange} disableFuture={false} />
                    <CustomInput label="Annual Fee" name="annualFee" value={formData.annualFee} onChange={handleChange} type="number" suffix="PKR" />
                 </div>
                 <div className="grid grid-cols-3 gap-6">
                    <CustomInput label="Admission Fee" name="admissionFee" value={formData.admissionFee} onChange={handleChange} type="number" suffix="PKR" />
                    <CustomInput label="Academy Fee" name="academyFee" value={formData.academyFee} onChange={handleChange} type="number" suffix="PKR" />
                    <CustomInput label="Nazra Fee" name="nazraFee" value={formData.nazraFee} onChange={handleChange} type="number" suffix="PKR" />
                 </div>
                 <div className="grid grid-cols-3 gap-6">
                    <CustomInput label="Uniform & Books Charges" name="uniformBooksCharges" value={formData.uniformBooksCharges} onChange={handleChange} type="number" suffix="PKR" />
                    <CustomInput label="Stationary Charges" name="stationaryCharges" value={formData.stationaryCharges} onChange={handleChange} type="number" suffix="PKR" />
                    <CustomInput label="Other Charges" name="otherCharges" value={formData.otherCharges} onChange={handleChange} type="number" suffix="PKR" />
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <CustomInput label="Late Fee Fine" name="lateFeeFine" value={formData.lateFeeFine} onChange={handleChange} type="number" suffix="PKR per day" />
                 </div>
                 
                 {/* Buttons */}
                 <div className="flex justify-between items-center pt-8 mt-4">
                   <button onClick={prevStep} className="px-10 py-4 border-2 border-[#B70003] text-[#B70003] font-bold rounded-xl hover:bg-red-50 transition-all flex items-center gap-2 cursor-pointer">
                     <ArrowLeft size={18} /> Previous
                   </button>
                   <div className="flex gap-4">
                     <button onClick={handlePrint} className="px-10 py-4 bg-[#191919] text-white font-bold rounded-xl shadow-lg hover:bg-black transition-all flex items-center gap-2 cursor-pointer">
                       Print <Printer size={18} />
                     </button>
                     <button onClick={handleSubmit} disabled={loading} className="px-12 py-4 bg-[#B70003] text-white font-bold rounded-xl shadow-lg hover:bg-[#950002] transition-all flex items-center gap-2 cursor-pointer">
                       {loading ? 'Saving...' : 'Save & Download'} <Save size={18} />
                     </button>
                   </div>
                 </div>
              </div>
            )}
        </motion.div>
      </div>

      {/* Modern Invoice (Simplified since Totals removed) */}
      <div ref={invoiceRef} className="hidden print:block fixed top-0 left-0 w-full h-full bg-white z-[9999] p-0 font-['Montserrat']">
          <div className="w-[210mm] mx-auto h-full relative">
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none"><GraduationCap size={400} className="text-[#B70003]" /></div>
              <div className="w-full h-4 bg-[#B70003] mb-8"></div>
              <div className="flex justify-between items-start px-12 mb-12">
                  <div className="flex items-center gap-5">
                      <div className="w-20 h-20 bg-[#191919] text-white rounded-2xl flex items-center justify-center shadow-lg"><GraduationCap size={45} /></div>
                      <div>
                          <h1 className="text-4xl font-black text-[#191919] tracking-tighter uppercase leading-none">EduSmart</h1>
                          <p className="text-[#B70003] font-bold tracking-[0.3em] text-xs uppercase mt-2">School System</p>
                      </div>
                  </div>
                  <div className="text-right">
                      <h2 className="text-5xl font-black text-gray-100 uppercase tracking-tighter">Invoice</h2>
                      <p className="text-[#B70003] font-bold text-lg -mt-4">#{Math.floor(Math.random() * 100000)}</p>
                      <p className="text-sm font-bold text-[#191919] mt-2">{new Date().toLocaleDateString()}</p>
                  </div>
              </div>
              <div className="px-12 mb-10">
                  <table className="w-full">
                      <thead>
                          <tr className="border-b-2 border-black">
                              <th className="py-4 text-left text-xs font-black uppercase tracking-widest text-[#191919] w-1/2">Description</th>
                              <th className="py-4 text-right text-xs font-black uppercase tracking-widest text-[#191919]">Amount</th>
                          </tr>
                      </thead>
                      <tbody className="text-sm">
                          {[
                              { label: 'Monthly Tuition Fee', val: formData.monthlyFee },
                              { label: 'Admission Fee', val: formData.admissionFee },
                              { label: 'Annual Charges', val: formData.annualFee },
                              { label: 'Academy Fee', val: formData.academyFee },
                              { label: 'Uniform & Books', val: formData.uniformBooksCharges },
                              { label: 'Stationary', val: formData.stationaryCharges },
                              { label: 'Other Charges', val: formData.otherCharges },
                          ].map((item, i) => Number(item.val) > 0 && (
                              <tr key={i} className="border-b border-gray-100 last:border-none">
                                  <td className="py-4 font-medium text-gray-600">{item.label}</td>
                                  <td className="py-4 text-right font-bold text-[#191919]">{item.val}</td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      </div>
    </div>
    </>
  );
}