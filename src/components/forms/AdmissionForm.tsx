"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, ArrowRight, ArrowLeft, Trash2, Printer, Save, GraduationCap, Download } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// UI Components
import { CustomInput } from '@/components/ui/CustomInput';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import { CustomDropdown } from '@/components/ui/CustomDropdown';

export default function AdmissionForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const invoiceRef = useRef<HTMLDivElement>(null); // Ref for PDF Generation
  
  const [formData, setFormData] = useState({
    // Step 1
    firstName: '', lastName: '', gender: '', dob: '',
    studentCnic: '', religion: '', nationality: 'Pakistani',
    previousSchool: '', lastClass: '', leavingReason: '', studentRemarks: '',
    photoUrl: '',
    // Step 2
    parentFirstName: '', parentLastName: '', parentCnic: '',
    mobileNo: '', emergencyContact: '', whatsappNo: '',
    address: '', relation: '', occupation: '', monthlyIncome: '',
    reference: '', parentRemarks: '',
    // Step 3
    joiningDate: '', classJoining: '', section: '',
    // Step 4
    monthlyFee: '', feeDate: '', annualFee: '',
    admissionFee: '', academyFee: '', nazraFee: '',
    uniformBooksCharges: '', stationaryCharges: '', otherCharges: '',
    discount: '', lateFeeFine: '', 
    totalPayable: '', amountPaying: '', remainingAmount: ''
  });
  
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const steps = [
    { id: 1, title: 'Student Information' },
    { id: 2, title: 'Parents/Guardian Information' },
    { id: 3, title: 'Enrollment' },
    { id: 4, title: 'Fee Structure' },
  ];

  // Auto Calculation
  useEffect(() => {
    const total = 
      (Number(formData.monthlyFee) || 0) +
      (Number(formData.annualFee) || 0) +
      (Number(formData.admissionFee) || 0) +
      (Number(formData.academyFee) || 0) +
      (Number(formData.nazraFee) || 0) +
      (Number(formData.uniformBooksCharges) || 0) +
      (Number(formData.stationaryCharges) || 0) +
      (Number(formData.otherCharges) || 0) - 
      (Number(formData.discount) || 0);

    const remaining = total - (Number(formData.amountPaying) || 0);

    setFormData(prev => ({
        ...prev,
        totalPayable: total > 0 ? total.toString() : '',
        remainingAmount: remaining > 0 ? remaining.toString() : ''
    }));
  }, [
    formData.monthlyFee, formData.annualFee, formData.admissionFee, 
    formData.academyFee, formData.nazraFee, formData.uniformBooksCharges, 
    formData.stationaryCharges, formData.otherCharges, formData.discount, 
    formData.amountPaying
  ]);

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
  
  // PRINT FUNCTION (Browser Print)
  const handlePrint = () => {
    window.print();
  };

  // PDF GENERATION FUNCTION
  const generatePDF = async () => {
    if (!invoiceRef.current) return;
    
    try {
      // Temporarily show the invoice section on screen for capture if hidden
      invoiceRef.current.style.display = 'block'; 
      
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2, // High resolution
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      // Hide it back if needed (controlled by CSS usually)
      // invoiceRef.current.style.display = 'none'; // Depends on your CSS strategy

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_${formData.firstName}_${formData.lastName}.pdf`);
      
      toast.success("Invoice PDF Downloaded!");
    } catch (error) {
      console.error("PDF Error:", error);
      toast.error("Failed to generate PDF.");
    }
  };

  // SAVE + DOWNLOAD FUNCTION
  const handleSubmit = async () => {
    setLoading(true);
    try {
      // 1. Save to Database
      const res = await fetch('/api/admission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        toast.success("Student Saved Successfully!");
        
        // 2. Generate PDF automatically after save
        await generatePDF();

        // 3. Reset Form (Optional)
        // setPhotoPreview(null);
        // setCurrentStep(1);
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
    {/* --- NORMAL FORM (Screen View) --- */}
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
                        <div className="col-span-1"><CustomDatePicker label="Date of Birth" name="dob" value={formData.dob} onChange={handleCustomChange} /></div>
                        <CustomInput label="Birth Certificate No." name="studentCnic" value={formData.studentCnic} onChange={handleChange} type="cnic" />
                        <CustomInput label="Religion" name="religion" value={formData.religion} onChange={handleChange} type="text" />
                        <div className="col-span-2"><CustomInput label="Nationality" name="nationality" value={formData.nationality} onChange={handleChange} type="text" /></div>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-50">
                     <CustomInput label="Previous School Name" name="previousSchool" value={formData.previousSchool} onChange={handleChange} type="text" />
                     <CustomInput label="Last Class Completed" name="lastClass" value={formData.lastClass} onChange={handleChange} type="text" />
                     <div className="col-span-2"><CustomInput label="Reason for Leaving" name="leavingReason" value={formData.leavingReason} onChange={handleChange} type="text" /></div>
                     <div className="col-span-2"><CustomInput label="Remarks" name="studentRemarks" value={formData.studentRemarks} onChange={handleChange} /></div>
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
                  <div className="grid grid-cols-3 gap-6">
                     <CustomInput label="Mobile No." name="mobileNo" value={formData.mobileNo} onChange={handleChange} type="number" />
                     <CustomInput label="Emergency Contact No." name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} type="number" />
                     <CustomInput label="WhatsApp No." name="whatsappNo" value={formData.whatsappNo} onChange={handleChange} type="number" />
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                     <div className="col-span-2"><CustomInput label="Address" name="address" value={formData.address} onChange={handleChange} /></div>
                     <div className="col-span-1"><CustomInput label="Relation with Student" name="relation" value={formData.relation} onChange={handleChange} type="text" /></div>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                     <CustomInput label="Occupation" name="occupation" value={formData.occupation} onChange={handleChange} type="text" />
                     <CustomInput label="Monthly Income" name="monthlyIncome" value={formData.monthlyIncome} onChange={handleChange} type="number" />
                     <CustomInput label="Reference" name="reference" value={formData.reference} onChange={handleChange} />
                  </div>
                  <div className="w-full"><CustomInput label="Remarks" name="parentRemarks" value={formData.parentRemarks} onChange={handleChange} /></div>
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
                     <CustomDatePicker label="Joining Date" name="joiningDate" value={formData.joiningDate} onChange={handleCustomChange} />
                     <CustomInput label="Class Joining" name="classJoining" value={formData.classJoining} onChange={handleChange} />
                     <CustomDropdown label="Section" name="section" value={formData.section} onChange={handleCustomChange} options={["A", "B", "C", "D", "E"]} />
                  </div>
                  <div className="flex justify-between pt-6 border-t border-gray-50 mt-[300px]">
                     <button onClick={prevStep} className="px-10 py-4 border-2 border-[#B70003] text-[#B70003] font-bold rounded-xl hover:bg-red-50 transition-all flex items-center gap-2 cursor-pointer"><ArrowLeft size={18} /> Previous</button>
                     <button onClick={nextStep} className="px-12 py-4 bg-[#B70003] text-white font-bold rounded-xl shadow-xl hover:bg-[#950002] transition-all flex items-center gap-2 cursor-pointer">Next <ArrowRight size={18} /></button>
                  </div>
               </div>
            )}

            {/* Step 4 */}
            {currentStep === 4 && (
              <div className="space-y-6">
                 <div className="grid grid-cols-3 gap-6">
                    <CustomInput label="Monthly Fee" name="monthlyFee" value={formData.monthlyFee} onChange={handleChange} type="number" suffix="PKR" />
                    <CustomDatePicker label="Fee Date" name="feeDate" value={formData.feeDate} onChange={handleCustomChange} />
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
                    <CustomInput label="Discount" name="discount" value={formData.discount} onChange={handleChange} type="number" suffix="PKR" />
                    <CustomInput label="Late Fee Fine" name="lateFeeFine" value={formData.lateFeeFine} onChange={handleChange} type="number" suffix="PKR per day" />
                 </div>
                 <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-100">
                    <div className="pointer-events-none opacity-80">
                       <CustomInput label="Total Payable" name="totalPayable" value={formData.totalPayable} onChange={handleChange} type="number" suffix="PKR" />
                    </div>
                    <CustomInput label="Amount Paying" name="amountPaying" value={formData.amountPaying} onChange={handleChange} type="number" suffix="PKR" />
                    <div className="pointer-events-none opacity-80">
                       <CustomInput label="Remaining Amount" name="remainingAmount" value={formData.remainingAmount} onChange={handleChange} type="number" suffix="PKR" />
                    </div>
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
    </div>

    {/* --- EXPERT LEVEL INVOICE DESIGN (HIDDEN ON SCREEN, SHOWS ON PRINT/PDF) --- */}
    <div ref={invoiceRef} className="hidden print:block fixed top-0 left-0 w-full h-full bg-white z-[9999] p-0 font-['Montserrat']">
        <div className="w-[210mm] mx-auto h-full relative">
            
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                <GraduationCap size={400} className="text-[#B70003]" />
            </div>

            {/* Top Bar */}
            <div className="w-full h-4 bg-[#B70003] mb-8"></div>

            {/* Header */}
            <div className="flex justify-between items-start px-12 mb-12">
                <div className="flex items-center gap-5">
                    <div className="w-20 h-20 bg-[#191919] text-white rounded-2xl flex items-center justify-center shadow-lg">
                        <GraduationCap size={45} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-[#191919] tracking-tighter uppercase leading-none">EduSmart</h1>
                        <p className="text-[#B70003] font-bold tracking-[0.3em] text-xs uppercase mt-2">School System</p>
                        <p className="text-gray-400 text-xs mt-2 font-medium">123 Education Street, Knowledge City</p>
                        <p className="text-gray-400 text-xs font-medium">+92 300 1234567 | info@edusmart.com</p>
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-5xl font-black text-gray-100 uppercase tracking-tighter">Invoice</h2>
                    <p className="text-[#B70003] font-bold text-lg -mt-4">#{Math.floor(Math.random() * 100000)}</p>
                    <div className="mt-4 space-y-1">
                        <p className="text-xs font-bold text-gray-400 uppercase">Date Issued</p>
                        <p className="text-sm font-bold text-[#191919]">{new Date().toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            {/* Bill To & Details Section */}
            <div className="flex gap-10 px-12 mb-12">
                <div className="flex-1 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <p className="text-xs font-bold text-[#B70003] uppercase tracking-widest mb-4">Student Details</p>
                    <div className="space-y-1">
                        <h3 className="text-2xl font-black text-[#191919]">{formData.firstName} {formData.lastName}</h3>
                        <p className="text-sm text-gray-500 font-medium">Class: <span className="text-[#191919] font-bold">{formData.classJoining} - {formData.section}</span></p>
                        <p className="text-sm text-gray-500 font-medium">CNIC: {formData.studentCnic || 'N/A'}</p>
                        <p className="text-sm text-gray-500 font-medium">Parent: {formData.parentFirstName}</p>
                    </div>
                </div>
                <div className="flex-1 bg-[#191919] p-6 rounded-2xl text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Payment Summary</p>
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-gray-400 text-xs">Total Payable</p>
                                <p className="text-3xl font-black text-[#B70003]">PKR {formData.totalPayable}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-gray-400 text-xs">Due Date</p>
                                <p className="text-lg font-bold">{formData.feeDate || 'Immediate'}</p>
                            </div>
                        </div>
                    </div>
                    {/* Decorative Circle */}
                    <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
                </div>
            </div>

            {/* Table */}
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
                        {Number(formData.discount) > 0 && (
                            <tr className="border-b border-gray-100 bg-green-50/50">
                                <td className="py-4 font-medium text-green-700 pl-2">Discount Applied</td>
                                <td className="py-4 text-right font-bold text-green-700 pr-2">-{formData.discount}</td>
                            </tr>
                        )}
                        {Number(formData.lateFeeFine) > 0 && (
                            <tr className="border-b border-gray-100 bg-red-50/50">
                                <td className="py-4 font-medium text-red-700 pl-2">Late Fee Fine</td>
                                <td className="py-4 text-right font-bold text-red-700 pr-2">+{formData.lateFeeFine}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Final Calculation */}
            <div className="px-12 mb-20 flex justify-end">
                <div className="w-1/2 border-t-2 border-gray-100 pt-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-500 text-sm font-medium">Subtotal</span>
                        <span className="font-bold text-[#191919]">{Number(formData.totalPayable) + Number(formData.discount)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-500 text-sm font-medium">Amount Paid</span>
                        <span className="font-bold text-[#191919]">{formData.amountPaying || 0}</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t-2 border-[#191919]">
                        <span className="text-lg font-black uppercase text-[#191919]">Total Due</span>
                        <span className="text-2xl font-black text-[#B70003]">PKR {formData.remainingAmount}</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 w-full bg-[#191919] text-white px-12 py-6">
                <div className="flex justify-between items-center">
                    <div className="text-[10px] text-gray-400 space-y-1">
                        <p>Terms & Conditions Apply</p>
                        <p>This is a computer generated invoice and requires no signature.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-[#B70003] uppercase">Authorized By</p>
                            <p className="text-sm font-bold">Admin Department</p>
                        </div>
                        <div className="h-10 w-px bg-gray-700"></div>
                        <GraduationCap size={24} className="text-gray-600" />
                    </div>
                </div>
            </div>
        </div>
    </div>
    </>
  );
}