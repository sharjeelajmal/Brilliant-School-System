"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { CustomDropdown } from '@/components/ui/CustomDropdown';

// --- STEP INDICATOR ---
const StepIndicator = ({ currentStep, steps }: { currentStep: number, steps: string[] }) => (
    <div className="flex justify-between mb-8 relative w-full px-4">
        <div className="absolute top-[15px] left-0 w-full h-1 bg-gray-100 -z-10 rounded-full" />
        <div
            className="absolute top-[15px] left-0 h-1 bg-[#B50104] -z-10 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />
        {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border-2 bg-white ${currentStep > i + 1 ? 'border-[#B50104] text-[#B50104]' : currentStep === i + 1 ? 'border-[#B50104] text-[#B50104] scale-110 shadow-lg shadow-red-100' : 'border-gray-200 text-gray-300'}`}>
                    {currentStep > i + 1 ? <Check size={14} /> : i + 1}
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-widest ${currentStep === i + 1 ? 'text-[#B50104]' : 'text-gray-300'}`}>{step}</span>
            </div>
        ))}
    </div>
);

// --- REUSABLE INPUT ---
const InputField = ({ label, name, value, onChange, placeholder, type = "text" }: any) => (
    <div className="mb-4">
        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 block">{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full h-[50px] bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm font-bold text-[#191919] outline-none focus:border-[#B50104] focus:ring-1 focus:ring-[#B50104]/20 transition-all placeholder:text-gray-300"
        />
    </div>
);

// --- STEPS ---
const StepBasic = ({ data, handleChange, handleDropdownChange }: any) => (
    <div className="space-y-4">
        <div className="mb-6 border-b border-gray-100 pb-2">
            <h3 className="text-sm font-black text-[#B50104] uppercase tracking-widest">Basic Information</h3>
        </div>
        <InputField label="Supplier Name" name="name" value={data.name} onChange={handleChange} placeholder="e.g. Al-Fatah Stationers" />

        <div className="mb-4">
            <CustomDropdown
                label="Supplier Type"
                name="type"
                options={["Stationary", "Furniture", "Maintenance", "Other"]}
                value={data.type}
                onChange={handleDropdownChange}
            />
        </div>

        <InputField label="Contact Number" name="contactNo" value={data.contactNo} onChange={handleChange} placeholder="0300-1234567" />
    </div>
);

const StepContact = ({ data, handleChange }: any) => (
    <div className="space-y-4">
        <div className="mb-6 border-b border-gray-100 pb-2">
            <h3 className="text-sm font-black text-[#B50104] uppercase tracking-widest">Contact Information</h3>
        </div>
        <InputField label="Contact Person Name" name="contactPerson" value={data.contactPerson} onChange={handleChange} placeholder="e.g. Mr. Ahmed" />
        <InputField label="Mobile No." name="mobileNo" value={data.mobileNo} onChange={handleChange} placeholder="0300-1234567" />
        <InputField label="Emergency Contact No." name="emergencyContact" value={data.emergencyContact} onChange={handleChange} placeholder="042-1234567" />

        <div className="mb-4">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Address</label>
            <textarea
                name="address"
                value={data.address}
                onChange={handleChange}
                placeholder="Full address..."
                className="w-full h-[100px] bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-bold text-[#191919] outline-none focus:border-[#B50104] transition-all resize-none placeholder:text-gray-300"
            />
        </div>
    </div>
);

const StepBusiness = ({ data, handleChange }: any) => (
    <div className="space-y-4">
        <div className="mb-6 border-b border-gray-100 pb-2">
            <h3 className="text-sm font-black text-[#B50104] uppercase tracking-widest">Business Details</h3>
        </div>
        <InputField label="Items Supply" name="itemsSupply" value={data.itemsSupply} onChange={handleChange} placeholder="e.g. Pens, Papers, Markers" />
        {/* Outstanding Amount is usually handled via finance module or initial balance, keeping it here as per user request */}
        {/* If user wants it hidden or read-only later, we can adjust. For now keeping simplistic. */}
    </div>
);

const StepBank = ({ data, handleChange }: any) => (
    <div className="space-y-4">
        <div className="mb-6 border-b border-gray-100 pb-2">
            <h3 className="text-sm font-black text-[#B50104] uppercase tracking-widest">Bank/Wallet Details</h3>
        </div>
        <InputField label="Bank / Wallet Name" name="bankName" value={data.bankName} onChange={handleChange} placeholder="e.g. Meezan Bank / JazzCash" />
        <InputField label="Account Number" name="accountNo" value={data.accountNo} onChange={handleChange} placeholder="XXXX-XXXXXXX-X" />
        <InputField label="Account Title" name="accountTitle" value={data.accountTitle} onChange={handleChange} placeholder="e.g. Al-Fatah Traders" />
    </div>
);

// --- MAIN FORM ---
export const AddSupplierForm = ({ onClose, onSuccess, initialData }: any) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const steps = ["Basic", "Contact", "Business", "Bank"];

    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        type: initialData?.type || 'Stationary',
        contactNo: initialData?.contactNo || '',
        contactPerson: initialData?.contactPerson || '',
        mobileNo: initialData?.mobileNo || '',
        emergencyContact: initialData?.emergencyContact || '',
        address: initialData?.address || '',
        itemsSupply: initialData?.itemsSupply || '',
        outstandingAmount: initialData?.outstandingAmount || 0,
        bankName: initialData?.bankName || '',
        accountTitle: initialData?.accountTitle || '',
        accountNo: initialData?.accountNo || ''
    });

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDropdownChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const method = initialData ? 'PUT' : 'POST';
            const body = initialData ? { ...formData, _id: initialData._id } : formData;

            const res = await fetch('/api/vendors', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();

            if (data.success) {
                toast.success(initialData ? "Supplier updated!" : "Supplier added!");
                onSuccess(data.data);
            } else {
                toast.error(data.error || "Operation failed");
            }
        } catch {
            toast.error("Network error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <Toaster position="top-center" richColors />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[24px] shadow-2xl w-full max-w-2xl overflow-hidden font-['Montserrat'] flex flex-col max-h-[90vh]"
            >
                {/* HEADER */}
                <div className="h-[70px] border-b border-gray-100 flex items-center justify-between px-6 bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-black text-[#191919] uppercase tracking-tighter">
                            {initialData ? "Edit Supplier" : "Add Supplier"}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-400 hover:text-red-500 shadow-sm transition-colors border border-gray-100"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* BODY */}
                <div className="flex-1 overflow-y-auto py-8 px-8">
                    <StepIndicator currentStep={step} steps={steps} />

                    <div className="mt-4 min-h-[300px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                {step === 1 && <StepBasic data={formData} handleChange={handleChange} handleDropdownChange={handleDropdownChange} />}
                                {step === 2 && <StepContact data={formData} handleChange={handleChange} />}
                                {step === 3 && <StepBusiness data={formData} handleChange={handleChange} />}
                                {step === 4 && <StepBank data={formData} handleChange={handleChange} />}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="h-[80px] border-t border-gray-100 px-8 flex items-center justify-end bg-gray-50/50 gap-3">
                    {step > 1 && (
                        <button
                            onClick={() => setStep(s => s - 1)}
                            className="h-[45px] px-6 rounded-xl bg-white border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
                        >
                            <ChevronLeft size={16} /> Back
                        </button>
                    )}

                    {step < 4 ? (
                        <button
                            onClick={() => setStep(s => s + 1)}
                            className="h-[45px] px-8 rounded-xl bg-[#191919] text-white font-bold shadow-lg hover:bg-black transition-colors flex items-center gap-2 text-sm"
                        >
                            Next <ChevronRight size={16} />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="h-[45px] px-8 rounded-xl bg-[#B50104] text-white font-bold shadow-lg shadow-red-200 hover:bg-[#900000] transition-colors flex items-center gap-2 disabled:opacity-50 text-sm"
                        >
                            {loading ? "Saving..." : "Confirm & Save"} <Save size={16} />
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
