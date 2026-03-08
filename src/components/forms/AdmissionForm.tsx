"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Trash2, Save, CheckCircle } from "lucide-react";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";

import { CustomInput } from "@/components/ui/CustomInput";
import { CustomDatePicker } from "@/components/ui/CustomDatePicker";
import { CustomDropdown } from "@/components/ui/CustomDropdown";
import { SmartPhoneInput } from "@/components/ui/SmartPhoneInput";

const StepIndicator = ({ currentStep, steps }: { currentStep: number; steps: string[] }) => (
  <div className="flex justify-between mb-8 relative print:hidden">
    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10 rounded-full" />
    <div
      className="absolute top-1/2 left-0 h-1 bg-[#B70003] -z-10 rounded-full transition-all duration-500"
      style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
    />
    {steps.map((step, i) => (
      <div key={i} className="flex flex-col items-center gap-2 bg-white px-2">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border-2 ${
            currentStep > i + 1
              ? "bg-[#B70003] border-[#B70003] text-white"
              : currentStep === i + 1
                ? "bg-white border-[#B70003] text-[#B70003] scale-110 shadow-lg"
                : "bg-gray-100 border-gray-100 text-gray-400"
          }`}
        >
          {currentStep > i + 1 ? <CheckCircle size={14} /> : i + 1}
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-wider ${currentStep === i + 1 ? "text-[#B70003]" : "text-gray-300"}`}>
          {step}
        </span>
      </div>
    ))}
  </div>
);

export default function AdmissionForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [classes, setClasses] = useState<string[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    rollNo: "",
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    studentCnic: "",
    religion: "",
    nationality: "Pakistani",
    previousSchool: "",
    lastClass: "",
    leavingReason: "",
    studentRemarks: "",
    photoUrl: "",
    parentFirstName: "",
    parentLastName: "",
    parentCnic: "",
    mobileNo: "",
    emergencyContact: "",
    whatsappNo: "",
    address: "",
    relation: "",
    occupation: "",
    monthlyIncome: "",
    reference: "",
    parentRemarks: "",
    joiningDate: "",
    classJoining: "",
    section: "",
    monthlyFee: "",
    feeDate: "",
    annualFee: "",
    admissionFee: "",
    academyFee: "",
    nazraFee: "",
    uniformBooksCharges: "",
    stationaryCharges: "",
    otherCharges: "",
    lateFeeFine: "",
    discount: "",
    totalPayable: "",
    amountPaying: "",
    remainingAmount: "",
  });

  const stepTitles = ["Student Info", "Parents Info", "Enrollment", "Fee Info"];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cls = params.get("class");
    const sec = params.get("section");
    if (cls && sec) {
      setFormData((prev) => ({ ...prev, classJoining: cls, section: sec }));
      setCurrentStep(3);
    }
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch("/api/classes");
        const data: { data?: Array<{ name: string }> } = await res.json();
        if (data.data) {
          setClasses(data.data.map((c) => c.name));
        }
      } catch {
        console.error("Error loading classes");
      }
    };

    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchSections = async () => {
      if (!formData.classJoining) {
        setSections([]);
        return;
      }

      try {
        const res = await fetch(`/api/sections?class=${formData.classJoining}`);
        const data: { success?: boolean; data?: Array<{ name: string }> } = await res.json();
        if (data.success) {
          setSections((data.data || []).map((s) => s.name));
        }
      } catch {
        console.error("Error loading sections");
      }
    };

    fetchSections();
  }, [formData.classJoining]);

  useEffect(() => {
    const val = (str: string) => parseFloat(str) || 0;

    const totalFees =
      val(formData.monthlyFee) +
      val(formData.admissionFee) +
      val(formData.annualFee) +
      val(formData.academyFee) +
      val(formData.nazraFee) +
      val(formData.uniformBooksCharges) +
      val(formData.stationaryCharges) +
      val(formData.otherCharges);

    const payable = totalFees - val(formData.discount);
    const remaining = payable - val(formData.amountPaying);

    setFormData((prev) => {
      const newPayable = payable > 0 ? payable.toString() : "0";
      const newRemaining = remaining > 0 ? remaining.toString() : "0";

      if (prev.totalPayable !== newPayable || prev.remainingAmount !== newRemaining) {
        return {
          ...prev,
          totalPayable: newPayable,
          remainingAmount: newRemaining,
        };
      }

      return prev;
    });
  }, [
    formData.monthlyFee,
    formData.admissionFee,
    formData.annualFee,
    formData.academyFee,
    formData.nazraFee,
    formData.uniformBooksCharges,
    formData.stationaryCharges,
    formData.otherCharges,
    formData.discount,
    formData.amountPaying,
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
    setFormData({ ...formData, photoUrl: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/admission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        const previewData = { ...formData, rollNo: data.data.rollNo };
        toast.success(`Student Registered! Roll No: ${data.data.rollNo}`);
        setFormData(previewData);
        window.sessionStorage.setItem("admission-preview-data", JSON.stringify(previewData));
        router.push("/admission-preview");
      } else {
        toast.error(data.error || "Registration Failed.");
      }
    } catch {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-[24px] shadow-xl border border-gray-100 max-w-[1000px] mx-auto min-h-[600px] flex flex-col font-['Montserrat'] print:hidden">
      <Toaster position="top-center" richColors />

      <div className="mb-8">
        <h2 className="text-3xl font-black text-[#191919] uppercase tracking-tighter mb-2">Student Admission</h2>
        <p className="text-gray-400 text-sm font-medium">New student enrollment form.</p>
      </div>

      <StepIndicator currentStep={currentStep} steps={stepTitles} />

      <div className="flex-1 mt-4">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="flex gap-8">
                <div
                  onClick={() => !photoPreview && fileInputRef.current?.click()}
                  className={`w-[180px] h-[180px] bg-gray-50 border-2 border-dashed ${
                    photoPreview ? "border-solid border-[#B70003]" : "border-gray-300"
                  } rounded-2xl flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-[#B70003] hover:text-[#B70003] transition-all group order-last overflow-hidden relative`}
                >
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                  {photoPreview ? (
                    <>
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={handleRemovePhoto} className="p-3 bg-white text-red-600 rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-3 bg-white rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                        <Upload size={24} />
                      </div>
                      <span className="text-xs font-bold uppercase">Upload Photo</span>
                    </>
                  )}
                </div>

                <div className="flex-1 grid grid-cols-2 gap-6">
                  <CustomInput label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} type="text" />
                  <CustomInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} type="text" />
                  <div className="col-span-1">
                    <CustomDropdown label="Gender" name="gender" value={formData.gender} onChange={handleCustomChange} options={["Boy", "Girl"]} />
                  </div>
                  <div className="col-span-1">
                    <CustomDatePicker label="Date of Birth" name="dob" value={formData.dob} onChange={handleCustomChange} disableFuture={true} />
                  </div>
                  <CustomInput label="Birth Certificate / B-Form" name="studentCnic" value={formData.studentCnic} onChange={handleChange} type="number" />
                  <CustomInput label="Religion" name="religion" value={formData.religion} onChange={handleChange} type="text" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 pt-6 mt-2 border-t border-gray-50">
                <CustomInput label="Nationality" name="nationality" value={formData.nationality} onChange={handleChange} type="text" />
                <CustomInput label="Previous School" name="previousSchool" value={formData.previousSchool} onChange={handleChange} type="text" />
                <CustomInput label="Last Class" name="lastClass" value={formData.lastClass} onChange={handleChange} type="alphanumeric" />
                <CustomInput label="Reason for Leaving" name="leavingReason" value={formData.leavingReason} onChange={handleChange} type="text" />
                <div className="col-span-2">
                  <CustomInput label="Remarks" name="studentRemarks" value={formData.studentRemarks} onChange={handleChange} type="alphanumeric" />
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-6">
                  <CustomInput label="Guardian First Name" name="parentFirstName" value={formData.parentFirstName} onChange={handleChange} type="text" />
                  <CustomInput label="Guardian Last Name" name="parentLastName" value={formData.parentLastName} onChange={handleChange} type="text" />
                  <CustomInput label="Guardian CNIC" name="parentCnic" value={formData.parentCnic} onChange={handleChange} type="number" />
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <CustomInput label="Mobile No." name="mobileNo" value={formData.mobileNo} onChange={handleChange} type="number" />
                  <CustomInput label="Emergency Contact" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} type="number" />
                  <SmartPhoneInput
                    label="WhatsApp No."
                    name="whatsappNo"
                    value={formData.whatsappNo}
                    onChange={handleCustomChange}
                    mobileValue={formData.mobileNo}
                    emergencyValue={formData.emergencyContact}
                  />
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-2">
                    <CustomInput label="Address" name="address" value={formData.address} onChange={handleChange} type="alphanumeric" />
                  </div>
                  <CustomInput label="Relation" name="relation" value={formData.relation} onChange={handleChange} type="text" />
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <CustomInput label="Occupation" name="occupation" value={formData.occupation} onChange={handleChange} type="text" />
                  <CustomInput label="Monthly Income" name="monthlyIncome" value={formData.monthlyIncome} onChange={handleChange} type="number" suffix="PKR" />
                  <CustomInput label="Reference" name="reference" value={formData.reference} onChange={handleChange} type="text" />
                </div>

                <div className="w-full mt-6">
                  <CustomInput label="Guardian Remarks" name="parentRemarks" value={formData.parentRemarks} onChange={handleChange} type="text" />
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="space-y-8">
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-6">
                  <p className="text-sm text-blue-800 font-medium">Please select the Class first, then available Sections will be loaded automatically.</p>
                </div>
                <div className="grid grid-cols-2 gap-8 items-start">
                  <CustomDatePicker label="Joining Date" name="joiningDate" value={formData.joiningDate} onChange={handleCustomChange} disableFuture={false} />
                  <CustomDropdown label="Class Joining" name="classJoining" value={formData.classJoining} onChange={handleCustomChange} options={classes} />
                  <CustomDropdown
                    label="Section"
                    name="section"
                    value={formData.section}
                    onChange={handleCustomChange}
                    options={sections}
                    disabled={!formData.classJoining}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-6 [&>*:nth-child(2)]:mt-4">
                  <CustomInput label="Monthly Fee" name="monthlyFee" value={formData.monthlyFee} onChange={handleChange} type="number" suffix="PKR" />
                  <CustomDatePicker label="Fee Start Date" name="feeDate" value={formData.feeDate} onChange={handleCustomChange} disableFuture={false} />
                  <CustomInput label="Annual Fee" name="annualFee" value={formData.annualFee} onChange={handleChange} type="number" suffix="PKR" />
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <CustomInput label="Admission Fee" name="admissionFee" value={formData.admissionFee} onChange={handleChange} type="number" suffix="PKR" />
                  <CustomInput label="Academy Fee" name="academyFee" value={formData.academyFee} onChange={handleChange} type="number" suffix="PKR" />
                  <CustomInput label="Nazra Fee" name="nazraFee" value={formData.nazraFee} onChange={handleChange} type="number" suffix="PKR" />
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <CustomInput label="Uniform/Books Charges" name="uniformBooksCharges" value={formData.uniformBooksCharges} onChange={handleChange} type="number" suffix="PKR" />
                  <CustomInput label="Stationary Charges" name="stationaryCharges" value={formData.stationaryCharges} onChange={handleChange} type="number" suffix="PKR" />
                  <CustomInput label="Other Charges" name="otherCharges" value={formData.otherCharges} onChange={handleChange} type="number" suffix="PKR" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <CustomInput label="Late Fee Fine" name="lateFeeFine" value={formData.lateFeeFine} onChange={handleChange} type="number" suffix="PKR/Day" />
                </div>

                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mt-6">
                  <h4 className="font-bold text-[#B70003] uppercase text-sm mb-4 border-b border-gray-200 pb-2">Payment Details</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <CustomInput label="Discount Amount" name="discount" value={formData.discount} onChange={handleChange} type="number" suffix="PKR" />
                    <CustomInput label="Total Payable" name="totalPayable" value={formData.totalPayable} onChange={handleChange} type="number" suffix="PKR" />
                    <CustomInput label="Amount Paying Now" name="amountPaying" value={formData.amountPaying} onChange={handleChange} type="number" suffix="PKR" />
                    <CustomInput label="Remaining Balance" name="remainingAmount" value={formData.remainingAmount} onChange={handleChange} type="number" suffix="PKR" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-end gap-4 mt-12 pt-6 border-t border-gray-50">
        {currentStep > 1 && (
          <button onClick={prevStep} className="px-8 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-all cursor-pointer">
            Back
          </button>
        )}

        {currentStep < 4 ? (
          <button onClick={nextStep} className="px-10 py-3 bg-[#191919] text-white font-bold rounded-xl shadow-lg hover:bg-black transition-all cursor-pointer">
            Next Step
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-10 py-3 bg-[#B70003] text-white font-bold rounded-xl shadow-lg hover:bg-[#950002] transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Saving..." : "Save"} <Save size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
