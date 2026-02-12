"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Phone, MapPin, Briefcase, User, Users,
    CreditCard, Edit, Save, X, MessageCircle, Wallet, Receipt
} from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { FeeSubmission } from './FeeSubmission';

// --- EDITABLE ROW COMPONENT ---
const InfoRow = ({ label, value, name, isEditing, onChange, icon: Icon }: any) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 h-[45px] group">
        <div className="flex items-center gap-3">
            {Icon && <div className="p-1.5 rounded-lg bg-gray-50 text-gray-400 group-hover:text-[#B50104] transition-colors"><Icon size={16} /></div>}
            <span className="text-gray-500 font-medium text-xs md:text-sm">{label}</span>
        </div>
        {isEditing ? (
            <input
                name={name}
                value={value || ''}
                onChange={onChange}
                className="text-right font-bold text-[#191919] text-xs md:text-sm border-b-2 border-[#B50104] outline-none bg-transparent w-[60%]"
            />
        ) : (
            <span className="font-bold text-[#191919] text-xs md:text-sm text-right truncate pl-4">{value || '-'}</span>
        )}
    </div>
);

// --- CHILD CARD COMPONENT ---
const ChildCard = ({ child, onClick }: any) => (
    <div onClick={() => onClick(child.studentId)} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer flex items-center gap-4 group relative overflow-hidden">
        <div className="absolute right-0 top-0 w-16 h-16 bg-[#B50104] opacity-5 rounded-bl-full transition-transform group-hover:scale-150" />
        <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden border-2 border-white shadow-md">
            {child.photo ? <img src={child.photo} className="w-full h-full object-cover" /> : <User className="w-full h-full p-2 text-gray-400" />}
        </div>
        <div>
            <h4 className="font-bold text-[#191919] text-sm group-hover:text-[#B50104] transition-colors">{child.name}</h4>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Class: {child.class} | Fee: {child.monthlyFee}/-</p>
        </div>
    </div>
);

// --- MAIN COMPONENT ---
export const ParentProfile = ({ parent, onBack, onViewStudent }: any) => {
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showFeeForm, setShowFeeForm] = useState(false);

    // Initialize Form Data
    const [formData, setFormData] = useState({
        ...parent,
        parentFirstName: parent.parentFirstName || parent.fatherName.split(' ')[0],
        parentLastName: parent.parentLastName || parent.fatherName.split(' ').slice(1).join(' ')
    });

    const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // SAVE TO DATABASE
    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/parents', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    originalCnic: parent.cnic,
                    updatedData: formData
                })
            });
            if (res.ok) {
                toast.success("Parent Info Updated Successfully!");
                setIsEditing(false);
            } else {
                toast.error("Failed to update");
            }
        } catch (e) { toast.error("Error saving"); }
        finally { setSaving(false); }
    };

    const handleWhatsApp = () => {
        if (!formData.mobileNo) return toast.error("No mobile number found");
        let number = formData.mobileNo.replace(/[^0-9]/g, '');
        if (number.startsWith('03')) number = '92' + number.substring(1);
        window.open(`https://wa.me/${number}?text=Assalam-o-Alaikum, Dear Parent.`, '_blank');
    };


    const [fees, setFees] = useState([]);

    // FETCH FEES
    const fetchFees = async () => {
        try {
            const res = await fetch(`/api/fees?parentCnic=${parent.cnic}`);
            const data = await res.json();
            if (data.success) {
                setFees(data.data);
            }
        } catch (error) {
            console.error("Error fetching fees:", error);
        }
    };

    useEffect(() => {
        fetchFees();
    }, [parent.cnic]);

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 font-['Montserrat'] pb-10">
            <Toaster position="top-center" richColors />

            {/* FEE SUBMISSION MODAL */}
            <AnimatePresence>
                {showFeeForm && <FeeSubmission parent={parent} onClose={() => setShowFeeForm(false)} onSuccess={fetchFees} />}
            </AnimatePresence>

            {/* ... (Header, Hero, Info Row - Unchanged) ... */}

            {/* ... (SKIPPING UNCHANGED PARTS FOR BREVITY check next chunk for render implementation) ... */}

            {/* Header */}
            <div className="flex justify-between items-center bg-white p-4 rounded-[20px] shadow-sm border border-gray-100 sticky top-4 z-40 backdrop-blur-md bg-white/90">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="w-10 h-10 flex items-center justify-center bg-gray-50 text-[#191919] rounded-xl hover:bg-[#B50104] hover:text-white transition-all shadow-sm active:scale-95 cursor-pointer">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-xl font-black text-[#191919]">Parent Profile</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">CNIC: {parent.cnic}</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    {isEditing ? (
                        <>
                            <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-100 text-gray-600 font-bold rounded-xl text-xs hover:bg-gray-200 cursor-pointer">Cancel</button>
                            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-[#B50104] text-white font-bold rounded-xl text-xs hover:bg-[#900000] shadow-lg disabled:opacity-70 cursor-pointer">
                                {saving ? "Saving..." : <><Save size={16} /> Save</>}
                            </button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 font-bold rounded-xl text-xs hover:bg-blue-100 cursor-pointer">
                            <Edit size={16} /> Edit
                        </button>
                    )}
                </div>
            </div>

            {/* Hero Banner */}
            <div className="relative rounded-[30px] overflow-hidden bg-[#B50104] text-white shadow-2xl p-8 flex flex-col md:flex-row items-center gap-8">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white opacity-10 blur-[100px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-black opacity-10 blur-[80px] rounded-full" />

                {/* Avatar */}
                <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#B50104] to-orange-500 p-1 relative z-10">
                    <div className="w-full h-full rounded-full bg-[#191919] flex items-center justify-center border-4 border-white/20 text-4xl font-black text-white">
                        {formData.parentFirstName?.charAt(0)}
                    </div>
                </div>

                <div className="text-center md:text-left flex-1 w-full relative z-10">
                    {isEditing ? (
                        <div className="flex flex-col md:flex-row gap-4 mb-2 justify-center md:justify-start">
                            <input name="parentFirstName" value={formData.parentFirstName} onChange={handleChange} className="bg-black/20 text-2xl font-bold rounded-lg px-3 py-1 outline-none text-white w-full md:w-auto border border-transparent focus:border-white/30" placeholder="First Name" />
                            <input name="parentLastName" value={formData.parentLastName} onChange={handleChange} className="bg-black/20 text-2xl font-bold rounded-lg px-3 py-1 outline-none text-white w-full md:w-auto border border-transparent focus:border-white/30" placeholder="Last Name" />
                        </div>
                    ) : (
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight">{formData.parentFirstName} {formData.parentLastName}</h1>
                    )}

                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3 text-sm font-medium text-white/80">
                        <span className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full"><Phone size={14} className="text-green-400" /> {formData.mobileNo}</span>
                        <span className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full"><MapPin size={14} className="text-blue-400" /> {formData.address}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6 justify-center md:justify-start">
                        <button onClick={handleWhatsApp} className="flex items-center gap-2 px-5 py-2.5 bg-[#009952] hover:bg-green-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-green-900/30 transition-all active:scale-95 cursor-pointer">
                            <MessageCircle size={16} /> WhatsApp
                        </button>
                        <button onClick={() => setShowFeeForm(true)} className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#B50104] hover:bg-gray-100 text-xs font-bold rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer">
                            <Wallet size={16} /> Submit Fee
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Col: Info & Children */}
                <div className="md:col-span-2 space-y-6">

                    {/* Personal Info */}
                    <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
                        <h3 className="text-lg font-black text-[#191919] mb-4 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-[#B50104]"><User size={16} /></div>
                            Personal Details
                        </h3>
                        <InfoRow label="CNIC Number" name="cnic" value={formData.cnic} isEditing={isEditing} onChange={handleChange} icon={CreditCard} />
                        <InfoRow label="Occupation" name="occupation" value={formData.occupation} isEditing={isEditing} onChange={handleChange} icon={Briefcase} />
                        <InfoRow label="Mobile Contact" name="mobileNo" value={formData.mobileNo} isEditing={isEditing} onChange={handleChange} icon={Phone} />
                        <InfoRow label="Home Address" name="address" value={formData.address} isEditing={isEditing} onChange={handleChange} icon={MapPin} />
                    </div>

                    {/* Children List */}
                    <div className="bg-gray-50 p-6 rounded-[24px] border border-gray-200">
                        <h3 className="text-lg font-black text-[#191919] mb-4 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><Users size={16} /></div>
                            Children ({parent.children.length})
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {parent.children.map((child: any) => (
                                <ChildCard key={child.studentId} child={child} onClick={onViewStudent} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Col: Fee History (Refined) */}
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 h-full flex flex-col">
                        <h3 className="text-lg font-black text-[#191919] mb-4 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600"><Receipt size={16} /></div>
                            Recent Payments
                        </h3>

                        {/* Dynamic Fee Data */}
                        <div className="space-y-4 flex-1 overflow-y-auto max-h-[400px] custom-scrollbar pr-2">
                            {fees.length > 0 ? fees.map((fee: any, i: number) => (
                                <div key={i} className="flex justify-between items-center pb-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-default">
                                    <div>
                                        <p className="font-bold text-sm text-[#191919]">{fee.studentName}'s Fee</p>
                                        <div className="flex gap-2">
                                            <p className="text-[10px] text-gray-400 font-bold">{new Date(fee.date).toLocaleDateString()}</p>
                                            <p className="text-[10px] text-gray-500 font-bold bg-gray-100 px-1.5 rounded">{fee.month}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-sm text-[#191919]">Rs {fee.amount.toLocaleString()}</p>
                                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${fee.status === 'Paid' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                            {fee.status}
                                        </span>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-10 text-gray-400 font-bold text-xs">
                                    No Payment History
                                </div>
                            )}
                        </div>

                        <button className="w-full mt-6 py-3 bg-gray-50 text-gray-500 font-bold text-xs rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                            View Full History
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};