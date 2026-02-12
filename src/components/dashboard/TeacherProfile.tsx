"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft, Printer, Edit, Save, X, Phone, MapPin,
    User, GraduationCap, Briefcase, DollarSign, CreditCard,
    Calendar, Star
} from 'lucide-react';
import { toast, Toaster } from 'sonner';

// --- ANIMATION VARIANTS ---
const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

// --- MODERN INFO ROW ---
const InfoRow = ({ label, value, name, isEditing, onChange, icon: Icon, placeholder }: any) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-100 last:border-0 group gap-1 sm:gap-0">
        <div className="flex items-center gap-3">
            {Icon && <div className="p-1.5 rounded-lg bg-gray-50 text-gray-400 group-hover:text-[#B50104] group-hover:bg-red-50 transition-colors"><Icon size={14} /></div>}
            <span className="text-gray-500 font-medium text-xs md:text-sm">{label}</span>
        </div>
        {isEditing ? (
            <input
                type="text"
                name={name}
                value={value || ''}
                onChange={onChange}
                placeholder={placeholder}
                className="text-left sm:text-right font-bold text-[#191919] text-xs md:text-sm border-b-2 border-red-100 focus:border-[#B50104] outline-none bg-transparent w-full sm:w-[60%] transition-all px-1 py-1 sm:py-0"
            />
        ) : (
            <span className="font-bold text-[#191919] text-xs md:text-sm text-left sm:text-right truncate pl-0 sm:pl-4">{value && value !== '0' ? value : '-'}</span>
        )}
    </div>
);

// --- MAIN COMPONENT ---
export const TeacherProfile = ({ teacherId, onBack }: { teacherId: string, onBack: () => void }) => {
    const [data, setData] = useState<any>(null);
    const [formData, setFormData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    // Fetch Data
    const fetchData = async () => {
        try {
            const res = await fetch(`/api/teacher?id=${teacherId}`);
            const json = await res.json();
            if (json.success) {
                setData(json.data);
                setFormData(json.data);
            }
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { if (teacherId) fetchData(); }, [teacherId]);

    const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/teacher', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const json = await res.json();
            if (res.ok) {
                toast.success("Profile Updated Successfully!");
                setData(json.data);
                setIsEditing(false);
            } else {
                toast.error(json.error || "Failed to update");
            }
        } catch (e) { toast.error("Network Error"); }
        finally { setSaving(false); }
    };

    const handleCancel = () => {
        setFormData(data);
        setIsEditing(false);
    };

    const getAvatar = () => {
        if (data.photoUrl) return <img src={data.photoUrl} className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500" />;
        const gender = data.gender ? data.gender.toLowerCase() : '';
        if (gender === 'male' || gender === 'boy') return <img src="/male.png" className="w-full h-full object-cover" alt="Male" />;
        if (gender === 'female' || gender === 'girl') return <img src="/female.png" className="w-full h-full object-cover" alt="Female" />;
        return <User size={48} />;
    };

    if (loading) return <div className="flex h-[60vh] items-center justify-center"><div className="w-10 h-10 border-4 border-gray-200 border-t-[#B50104] rounded-full animate-spin" /></div>;
    if (!data) return <div className="p-20 text-center font-bold text-red-500">Teacher Not Found</div>;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="space-y-6 font-['Montserrat'] pb-10"
        >
            <Toaster position="top-center" richColors />

            {/* --- TOP BAR (Responsive) --- */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-[20px] shadow-sm border border-gray-100 sticky top-4 z-40 backdrop-blur-md bg-white/90 gap-4 sm:gap-0">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <button onClick={onBack} className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-gray-50 text-[#191919] rounded-xl hover:bg-[#B50104] hover:text-white transition-all shadow-sm active:scale-95 cursor-pointer">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="overflow-hidden">
                        <h2 className="text-lg md:text-xl font-black text-[#191919] leading-none truncate">Teacher Profile</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID: {data._id.slice(-6)}</p>
                    </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto justify-end">
                    <button onClick={() => window.print()} className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 text-xs transition-colors cursor-pointer">
                        <Printer size={16} /> Print
                    </button>

                    {isEditing ? (
                        <div className="flex gap-2 w-full sm:w-auto">
                            <button onClick={handleCancel} className="flex-1 sm:flex-none px-4 py-2.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 text-xs transition-colors cursor-pointer">Cancel</button>
                            <button onClick={handleSave} disabled={saving} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-[#B50104] text-white font-bold rounded-xl hover:bg-[#900000] text-xs shadow-lg shadow-red-200 transition-all active:scale-95 disabled:opacity-70 cursor-pointer">
                                {saving ? "Saving..." : <><Save size={16} /> Save Changes</>}
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-[#B50104] text-white font-bold rounded-xl hover:bg-[#900000] text-xs shadow-lg shadow-red-200 transition-all active:scale-95 cursor-pointer">
                            <Edit size={16} /> Edit Profile
                        </button>
                    )}
                </div>
            </div>

            {/* --- HERO BANNER (Theme Matched) --- */}
            <div className="relative rounded-[30px] overflow-hidden bg-[#B50104] text-white shadow-2xl">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white opacity-10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-black opacity-10 blur-[80px] rounded-full -translate-x-1/2 translate-y-1/2" />

                <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
                    {/* Avatar */}
                    <div className="relative group">
                        <div className="w-[120px] h-[120px] md:w-[140px] md:h-[140px] rounded-full p-1 bg-white/20 backdrop-blur-sm">
                            <div className="w-full h-full rounded-full bg-white border-4 border-white/50 overflow-hidden relative shadow-2xl">
                                {getAvatar()}
                            </div>
                        </div>
                        <div className="absolute bottom-2 right-2 w-6 h-6 md:w-8 md:h-8 bg-green-500 border-4 border-[#B50104] rounded-full shadow-sm" title="Active" />
                    </div>

                    {/* Name & Basic Info */}
                    <div className="text-center md:text-left flex-1 space-y-3 w-full">
                        {isEditing ? (
                            <div className="flex flex-col md:flex-row gap-3 w-full">
                                <input name="firstName" value={formData.firstName} onChange={handleChange} className="text-2xl md:text-4xl font-black bg-black/20 rounded-lg px-4 py-2 text-white placeholder-white/50 outline-none border border-transparent focus:border-white/40 w-full" placeholder="First Name" />
                                <input name="lastName" value={formData.lastName} onChange={handleChange} className="text-2xl md:text-4xl font-black bg-black/20 rounded-lg px-4 py-2 text-white placeholder-white/50 outline-none border border-transparent focus:border-white/40 w-full" placeholder="Last Name" />
                            </div>
                        ) : (
                            <h1 className="text-3xl md:text-5xl font-black tracking-tight">{data.firstName} <span className="opacity-80">{data.lastName}</span></h1>
                        )}

                        <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 text-xs md:text-sm font-bold text-white/90">
                            <span className="px-3 py-1 bg-black/20 rounded-full border border-white/10 flex items-center gap-2 backdrop-blur-sm">
                                <Briefcase size={14} className="text-yellow-300" />
                                {isEditing ? <input name="designation" value={formData.designation} onChange={handleChange} className="bg-transparent outline-none w-24 text-white" /> : (data.designation || 'Teacher')}
                            </span>
                            {/* Address Edit */}
                            <span className="flex items-center gap-1 bg-black/20 px-3 py-1 rounded-full">
                                <MapPin size={14} />
                                {isEditing ?
                                    <input name="address" value={formData.address} onChange={handleChange} className="bg-transparent outline-none text-white w-32 md:w-48 placeholder-white/50" placeholder="Address" />
                                    : (formData.address || 'No Address')}
                            </span>

                            {/* Phone Edit */}
                            <span className="flex items-center gap-1 bg-black/20 px-3 py-1 rounded-full">
                                <Phone size={14} />
                                {isEditing ?
                                    <input name="mobileNo" value={formData.mobileNo} onChange={handleChange} className="bg-transparent outline-none text-white w-24 md:w-32 placeholder-white/50" placeholder="Mobile No" />
                                    : (formData.mobileNo || 'No Phone')}
                            </span>
                        </div>
                    </div>

                    {/* Stats Mini Cards */}
                    <div className="flex gap-3 w-full md:w-auto justify-center md:justify-start">
                        <div className="bg-black/20 backdrop-blur-md p-3 md:p-4 rounded-2xl border border-white/10 text-center min-w-[90px] flex-1 md:flex-none">
                            <p className="text-[10px] text-white/70 uppercase font-bold mb-1">Experience</p>
                            {/* FIX: Showing actual Experience or 0 */}
                            <p className="text-xl md:text-2xl font-black text-white">{data.totalExperience || '0'} <span className="text-xs font-medium opacity-70">Yrs</span></p>
                        </div>
                        <div className="bg-black/20 backdrop-blur-md p-3 md:p-4 rounded-2xl border border-white/10 text-center min-w-[90px] flex-1 md:flex-none">
                            <p className="text-[10px] text-white/70 uppercase font-bold mb-1">Status</p>
                            <p className="text-lg md:text-xl font-bold text-green-300">Active</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- INFO GRIDS --- */}
            <motion.div
                variants={containerVariants} initial="hidden" animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >

                {/* Card 1: Personal Details */}
                <motion.div variants={itemVariants} className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                    <h3 className="text-lg font-black text-[#191919] mb-6 flex items-center gap-2 pb-3 border-b border-gray-50">
                        <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-[#B50104] group-hover:scale-110 transition-transform"><User size={16} /></div>
                        Personal Info
                    </h3>
                    <div className="space-y-1">
                        <InfoRow label="Gender" name="gender" value={formData.gender} isEditing={isEditing} onChange={handleChange} icon={User} />
                        <InfoRow label="Date of Birth" name="dob" value={formData.dob} isEditing={isEditing} onChange={handleChange} icon={Calendar} />
                        <InfoRow label="CNIC" name="cnic" value={formData.cnic} isEditing={isEditing} onChange={handleChange} icon={CreditCard} />
                        <InfoRow label="Marital Status" name="maritalStatus" value={formData.maritalStatus} isEditing={isEditing} onChange={handleChange} icon={User} />
                        <InfoRow label="Emergency Contact" name="emergencyContact" value={formData.emergencyContact} isEditing={isEditing} onChange={handleChange} icon={Phone} />
                    </div>
                </motion.div>

                {/* Card 2: Professional Info */}
                <motion.div variants={itemVariants} className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                    <h3 className="text-lg font-black text-[#191919] mb-6 flex items-center gap-2 pb-3 border-b border-gray-50">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform"><Briefcase size={16} /></div>
                        Professional
                    </h3>
                    <div className="space-y-1">
                        <InfoRow label="Joining Date" name="joiningDate" value={formData.joiningDate} isEditing={isEditing} onChange={handleChange} icon={Calendar} />
                        <InfoRow label="Assigned Class" name="assignedClass" value={formData.assignedClass} isEditing={isEditing} onChange={handleChange} icon={Briefcase} />
                        <InfoRow label="Assigned Section" name="assignedSection" value={formData.assignedSection} isEditing={isEditing} onChange={handleChange} icon={Star} />
                        <InfoRow label="School Timing" name="schoolInTime" value={`${formData.schoolInTime} - ${formData.schoolOutTime}`} isEditing={isEditing} onChange={handleChange} icon={Calendar} />

                        {/* FIX: Experience Logic - Shows '2 Years' when viewing, '2' when editing */}
                        <InfoRow
                            label="Experience (Yrs)"
                            name="totalExperience"
                            value={isEditing ? formData.totalExperience : (formData.totalExperience ? `${formData.totalExperience} Years` : '-')}
                            isEditing={isEditing}
                            onChange={handleChange}
                            icon={Star}
                        />
                    </div>
                </motion.div>

                {/* Card 3: Qualification */}
                <motion.div variants={itemVariants} className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                    <h3 className="text-lg font-black text-[#191919] mb-6 flex items-center gap-2 pb-3 border-b border-gray-50">
                        <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600 group-hover:scale-110 transition-transform"><GraduationCap size={16} /></div>
                        Qualification
                    </h3>
                    <div className="space-y-1">
                        <InfoRow label="Latest Degree" name="degree" value={formData.degree} isEditing={isEditing} onChange={handleChange} icon={GraduationCap} />
                        <InfoRow label="Major Subject" name="majorSubject" value={formData.majorSubject} isEditing={isEditing} onChange={handleChange} icon={Briefcase} />
                        <InfoRow label="Institute" name="institute" value={formData.institute} isEditing={isEditing} onChange={handleChange} icon={MapPin} />
                        <InfoRow label="Completion Year" name="completionYear" value={formData.completionYear} isEditing={isEditing} onChange={handleChange} icon={Calendar} />
                    </div>
                </motion.div>

                {/* Card 4: Financials (Full Width) */}
                <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-3 bg-gradient-to-r from-gray-50 to-white p-6 rounded-[24px] border border-gray-200 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                    <h3 className="text-lg font-black text-[#191919] mb-6 flex items-center gap-2 pb-3 border-b border-gray-200">
                        <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform"><DollarSign size={16} /></div>
                        Financial & Banking
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-4">
                        <div className="space-y-1">
                            <InfoRow label="Monthly Salary" name="monthlySalary" value={formData.monthlySalary} isEditing={isEditing} onChange={handleChange} icon={DollarSign} />
                            <InfoRow label="Allowances" name="allowance" value={formData.allowance} isEditing={isEditing} onChange={handleChange} icon={DollarSign} />
                        </div>
                        <div className="space-y-1">
                            <InfoRow label="Bank Name" name="bankName" value={formData.bankName} isEditing={isEditing} onChange={handleChange} icon={CreditCard} />
                            <InfoRow label="Account Title" name="accountTitle" value={formData.accountTitle} isEditing={isEditing} onChange={handleChange} icon={User} />
                        </div>
                        <div className="space-y-1">
                            <InfoRow label="Account Number" name="accountNo" value={formData.accountNo} isEditing={isEditing} onChange={handleChange} icon={CreditCard} />
                            <InfoRow label="Payment Method" name="paymentMethod" value={formData.paymentMethod} isEditing={isEditing} onChange={handleChange} icon={DollarSign} />
                        </div>
                    </div>
                </motion.div>

            </motion.div>
        </motion.div>
    );
};