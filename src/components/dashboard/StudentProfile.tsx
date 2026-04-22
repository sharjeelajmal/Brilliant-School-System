"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft, Printer, Edit, Save, X, Phone, MapPin,
    User, GraduationCap, Briefcase, DollarSign, CreditCard,
    Calendar, Star, FileText, School, MessageCircle, Wallet, Receipt // Added
} from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import { CustomDropdown } from '@/components/ui/CustomDropdown';
import { FeeSubmission } from './FeeSubmission';
import { StudentAcademicSummary } from './StudentAcademicSummary';

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
const InfoRow = ({ label, value, name, isEditing, onChange, icon: Icon, placeholder, type = "text", options = [], align = 'left' }: any) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-100 last:border-0 group gap-1 sm:gap-0">
        <div className="flex items-center gap-3">
            {Icon && <div className="p-1.5 rounded-lg bg-gray-50 text-gray-400 group-hover:text-[#B50104] group-hover:bg-red-50 transition-colors"><Icon size={14} /></div>}
            <span className="text-gray-500 font-medium text-xs md:text-sm">{label}</span>
        </div>
        {isEditing ? (
            type === "date" ? (
                <div className="w-full sm:w-[60%]"><CustomDatePicker label="" name={name} value={value} onChange={onChange} disableFuture={false} align={align} /></div>
            ) : type === "select" ? (
                <div className="w-full sm:w-[60%]"><CustomDropdown label="" name={name} value={value} options={options} onChange={onChange} /></div>
            ) : (
                <input
                    type="text"
                    name={name}
                    value={value || ''}
                    onChange={(e) => onChange(name, e.target.value)}
                    placeholder={placeholder}
                    className="text-left sm:text-right font-bold text-[#191919] text-xs md:text-sm border-b-2 border-red-100 focus:border-[#B50104] outline-none bg-transparent w-full sm:w-[60%] transition-all px-1 py-1 sm:py-0"
                />
            )
        ) : (
            <span className="font-bold text-[#191919] text-xs md:text-sm text-left sm:text-right pl-0 sm:pl-4">
                {(value !== undefined && value !== null && value !== '') ? value : '-'}
            </span>
        )}
    </div>
);

// --- MAIN COMPONENT ---
interface ProfileProps {
    studentId: string;
    onBack: () => void;
}

export const StudentProfile = ({ studentId, onBack }: ProfileProps) => {
    const [data, setData] = useState<any>(null);
    const [formData, setFormData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    // New States for Fee
    const [showFeeForm, setShowFeeForm] = useState(false);
    const [fees, setFees] = useState([]);

    // Classes and Sections for Edit
    const [classes, setClasses] = useState<string[]>([]);
    const [sections, setSections] = useState<string[]>([]);

    const fetchFees = async () => {
        try {
            const res = await fetch(`/api/fees?studentId=${studentId}`);
            const json = await res.json();
            if (json.success) setFees(json.data);
        } catch (e) { console.error(e); }
    };

    useEffect(() => { if (studentId) fetchFees(); }, [studentId]);

    // Fetch Data
    const fetchData = async () => {
        try {
            const res = await fetch(`/api/students?id=${studentId}`);
            const json = await res.json();
            if (json.success) {
                setData(json.data);
                setFormData(json.data);
            }
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { if (studentId) fetchData(); }, [studentId]);

    const handleChange = (name: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    // Fetch Classes and Sections
    useEffect(() => {
        if (isEditing) {
            fetch('/api/classes').then(r => r.json()).then(data => {
                if(data.success) setClasses(data.data.map((c: any) => c.name));
            }).catch(console.error);
        }
    }, [isEditing]);

    useEffect(() => {
        if (isEditing && formData?.classJoining) {
            fetch(`/api/sections?class=${encodeURIComponent(formData.classJoining)}`).then(r => r.json()).then(data => {
                if(data.success) setSections(data.data.map((s: any) => s.name));
            }).catch(console.error);
        } else {
            setSections([]);
        }
    }, [isEditing, formData?.classJoining]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/students', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const json = await res.json();
            if (json.success) {
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
        if (gender === 'male' || gender === 'boy') return <img src="/Boy.png" className="w-full h-full object-cover" alt="Boy" />;
        if (gender === 'female' || gender === 'girl') return <img src="/Girl.png" className="w-full h-full object-cover" alt="Girl" />;
        return <User size={48} />;
    };

    if (loading) return <div className="flex h-[60vh] items-center justify-center"><div className="w-10 h-10 border-4 border-gray-200 border-t-[#B50104] rounded-full animate-spin" /></div>;
    if (!data) return <div className="p-20 text-center font-bold text-red-500">Student Not Found</div>;

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
                        <h2 className="text-lg md:text-xl font-black text-[#191919] leading-none truncate">Student Profile</h2>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mt-1">
                            <div className="flex items-center gap-2">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Sr No: </p>
                                {isEditing ? (
                                    <input
                                        value={formData.rollNo}
                                        onChange={(e) => handleChange("rollNo", e.target.value)}
                                        className="bg-gray-100 rounded px-1 text-xs font-bold w-20 border border-gray-200 outline-none focus:border-red-500"
                                    />
                                ) : (
                                    <p className="text-[10px] items-center font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">#{data.rollNo || "Pending"}</p>
                                )}
                            </div>
                            
                            {!isEditing && data.classRollNo && (
                                <>
                                    <div className="hidden sm:block w-px h-4 bg-gray-200"></div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Roll No: </p>
                                        <p className="text-[10px] items-center font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">#{data.classRollNo}</p>
                                    </div>
                                </>
                            )}
                        </div>
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

            {/* --- HERO BANNER (Modern & Animated) --- */}
            <div className="relative rounded-[30px] overflow-hidden bg-gradient-to-br from-[#B50104] via-[#900000] to-black text-white shadow-2xl group">
                {/* Background Effects */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:opacity-10 transition-opacity duration-700" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-black opacity-20 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay" />

                <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center md:items-end gap-8 md:gap-12">
                    {/* Avatar */}
                    <div className="relative group shrink-0">
                        <div className="w-[140px] h-[140px] md:w-[160px] md:h-[160px] rounded-full p-1.5 bg-white/20 backdrop-blur-md shadow-2xl border border-white/10">
                            <div className="w-full h-full rounded-full bg-white border-4 border-white/80 overflow-hidden relative shadow-inner">
                                {getAvatar()}
                            </div>
                        </div>
                        <div className="absolute bottom-4 right-4 w-6 h-6 md:w-8 md:h-8 bg-[#009952] border-4 border-[#850002] rounded-full shadow-lg animate-pulse" title="Active Student" />
                    </div>

                    {/* Name & Basic Info */}
                    <div className="text-center md:text-left flex-1 space-y-4 w-full">
                        {isEditing ? (
                            <div className="flex flex-col md:flex-row gap-4 w-full">
                                <input name="firstName" value={formData.firstName} onChange={(e) => handleChange("firstName", e.target.value)} className="text-3xl md:text-5xl font-black bg-black/20 rounded-xl px-4 py-2 text-white placeholder-white/40 outline-none border border-white/10 focus:border-white/40 w-full transition-all" placeholder="First Name" />
                                <input name="lastName" value={formData.lastName} onChange={(e) => handleChange("lastName", e.target.value)} className="text-3xl md:text-5xl font-black bg-black/20 rounded-xl px-4 py-2 text-white placeholder-white/40 outline-none border border-white/10 focus:border-white/40 w-full transition-all" placeholder="Last Name" />
                            </div>
                        ) : (
                            <div>
                                <h1 className="text-4xl md:text-6xl font-black tracking-tighter drop-shadow-lg">{data.firstName} <span className="opacity-80 font-bold">{data.lastName}</span></h1>
                                <p className="text-white/60 font-bold text-sm tracking-[0.2em] uppercase mt-1">Student Profile</p>
                            </div>
                        )}

                        <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 text-xs md:text-sm font-bold text-white/90">
                            <span className="px-4 py-2 bg-white/10 rounded-xl border border-white/10 flex items-center gap-2 backdrop-blur-md hover:bg-white/20 transition-colors">
                                <School size={16} className="text-yellow-400" />
                                {isEditing ? 
                                    <select name="classJoining" value={formData.classJoining} onChange={(e) => handleChange("classJoining", e.target.value)} className="bg-white/20 outline-none w-28 text-white focus:bg-white/30 rounded px-1 transition-colors appearance-none cursor-pointer">
                                        <option value="" className="text-black">Select Class</option>
                                        {classes.map(c => <option key={c} value={c} className="text-black">{c}</option>)}
                                    </select>
                                : (data.classJoining || 'No Class')}
                            </span>
                            <span className="px-4 py-2 bg-white/10 rounded-xl border border-white/10 flex items-center gap-2 backdrop-blur-md hover:bg-white/20 transition-colors">
                                <Star size={16} className="text-yellow-400" />
                                Section:
                                {isEditing ? 
                                    <select name="section" value={formData.section} onChange={(e) => handleChange("section", e.target.value)} className="bg-white/20 outline-none w-20 text-white focus:bg-white/30 rounded px-1 transition-colors appearance-none cursor-pointer">
                                        <option value="" className="text-black">Sec</option>
                                        {sections.map(s => <option key={s} value={s} className="text-black">{s}</option>)}
                                    </select>
                                : (data.section || 'A')}
                            </span>
                            {/* Address Edit */}
                            <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-md hover:bg-white/20 transition-colors">
                                <MapPin size={16} className="text-red-300" />
                                {isEditing ?
                                    <input name="address" value={formData.address} onChange={(e) => handleChange("address", e.target.value)} className="bg-transparent outline-none text-white w-32 md:w-48 placeholder-white/50" placeholder="Address" />
                                    : (formData.address || 'No Address')}
                            </span>

                            {/* Joining Date Display - NEW REQUIREMENT */}
                            <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-md hover:bg-white/20 transition-colors">
                                <Calendar size={16} className="text-blue-300" />
                                <span className="opacity-70">Joined:</span>
                                {data.joiningDate || "N/A"}
                            </span>
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
                        <InfoRow label="Gender" name="gender" value={formData.gender} isEditing={isEditing} onChange={handleChange} icon={User} type="select" options={['Boy', 'Girl']} />
                        <InfoRow label="Date of Birth" name="dob" value={formData.dob} isEditing={isEditing} onChange={handleChange} icon={Calendar} type="date" />
                        <InfoRow label="B-Form / CNIC" name="studentCnic" value={formData.studentCnic} isEditing={isEditing} onChange={handleChange} icon={CreditCard} />
                        <InfoRow label="Nationality" name="nationality" value={formData.nationality} isEditing={isEditing} onChange={handleChange} icon={MapPin} />
                        <InfoRow label="Religion" name="religion" value={formData.religion} isEditing={isEditing} onChange={handleChange} icon={User} />
                    </div>
                </motion.div>

                {/* Card 2: Guardian Info */}
                <motion.div variants={itemVariants} className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                    <h3 className="text-lg font-black text-[#191919] mb-6 flex items-center gap-2 pb-3 border-b border-gray-50">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform"><User size={16} /></div>
                        Guardian Info
                    </h3>
                    <div className="space-y-1">
                        {isEditing ? (
                            <div className="flex flex-col gap-2 py-2 border-b border-gray-100">
                                <span className="text-gray-500 font-medium text-xs">Guardian Name</span>
                                <div className="flex gap-2">
                                    <input placeholder="First Name" value={formData.parentFirstName} onChange={(e) => handleChange("parentFirstName", e.target.value)} className="border-b border-gray-300 w-1/2 text-sm font-bold text-[#191919]" />
                                    <input placeholder="Last Name" value={formData.parentLastName} onChange={(e) => handleChange("parentLastName", e.target.value)} className="border-b border-gray-300 w-1/2 text-sm font-bold text-[#191919]" />
                                </div>
                            </div>
                        ) : (
                            <InfoRow label="Guardian Name" value={`${formData.parentFirstName} ${formData.parentLastName}`} icon={User} isEditing={false} />
                        )}

                        <InfoRow label="Relation" name="relation" value={formData.relation} isEditing={isEditing} onChange={handleChange} icon={User} />
                        <InfoRow label="Occupation" name="occupation" value={formData.occupation} isEditing={isEditing} onChange={handleChange} icon={Briefcase} />
                        <InfoRow label="Guardian CNIC" name="parentCnic" value={formData.parentCnic} isEditing={isEditing} onChange={handleChange} icon={CreditCard} />
                        <InfoRow label="Emergency No" name="emergencyContact" value={formData.emergencyContact} isEditing={isEditing} onChange={handleChange} icon={Phone} />
                    </div>
                </motion.div>

                {/* Card 3: Academic History */}
                <motion.div variants={itemVariants} className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                    <h3 className="text-lg font-black text-[#191919] mb-6 flex items-center gap-2 pb-3 border-b border-gray-50">
                        <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600 group-hover:scale-110 transition-transform"><GraduationCap size={16} /></div>
                        Academic History
                    </h3>
                    <div className="space-y-1">
                        <InfoRow label="Previous School" name="previousSchool" value={formData.previousSchool} isEditing={isEditing} onChange={handleChange} icon={School} />
                        <InfoRow label="Last Class" name="lastClass" value={formData.lastClass} isEditing={isEditing} onChange={handleChange} icon={GraduationCap} />
                        <InfoRow label="Leaving Reason" name="leavingReason" value={formData.leavingReason} isEditing={isEditing} onChange={handleChange} icon={FileText} />
                        <InfoRow label="Admission Date" name="joiningDate" value={data.joiningDate} isEditing={isEditing} onChange={handleChange} icon={Calendar} type="date" align="right" />
                    </div>
                </motion.div>

                {/* Card 4: Fee Structure (Full Width) */}
                <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-3 bg-gradient-to-r from-gray-50 to-white p-6 rounded-[24px] border border-gray-200 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                    <h3 className="text-lg font-black text-[#191919] mb-6 flex items-center gap-2 pb-3 border-b border-gray-200">
                        <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform"><DollarSign size={16} /></div>
                        Fee Structure & Financials
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-4">
                        <div className="space-y-1">
                            <InfoRow label="Monthly Fee" name="monthlyFee" value={formData.monthlyFee} isEditing={isEditing} onChange={handleChange} icon={DollarSign} />
                            <InfoRow label="Admission Fee" name="admissionFee" value={formData.admissionFee} isEditing={isEditing} onChange={handleChange} icon={DollarSign} />
                        </div>
                        <div className="space-y-1">
                            <InfoRow label="Transport Fee" name="transportFee" value={formData.transportFee ?? formData.annualFee ?? 0} isEditing={isEditing} onChange={handleChange} icon={DollarSign} />
                            {/* Academy Fee Removed */}
                        </div>
                        <div className="space-y-1">
                            <InfoRow label="Uniform & Books Fee" name="uniformBooksCharges" value={formData.uniformBooksCharges ?? 0} isEditing={isEditing} onChange={handleChange} icon={DollarSign} />
                            <InfoRow label="Other Charges" name="otherCharges" value={formData.otherCharges ?? 0} isEditing={isEditing} onChange={handleChange} icon={DollarSign} />
                        </div>
                        {/* Highlighted Total */}
                        <div className="flex flex-col justify-center items-center bg-green-50 rounded-xl p-2 border border-green-100">
                            <span className="text-xs font-bold text-green-700 uppercase">Total Payable</span>
                            <span className="text-2xl font-black text-green-800">{formData.totalPayable}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Remarks Section - Editable */}
                <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-3 bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                    <h3 className="text-lg font-black text-[#191919] mb-4 flex items-center gap-2 pb-3 border-b border-gray-50">
                        <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600 group-hover:scale-110 transition-transform"><FileText size={16} /></div>
                        Remarks
                    </h3>
                    {isEditing ? (
                        <textarea
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 outline-none focus:border-[#B50104] transition-all font-medium text-gray-700"
                            rows={3}
                            placeholder="Add remarks here..."
                            value={formData.studentRemarks || ''}
                            onChange={(e) => handleChange('studentRemarks', e.target.value)}
                        />
                    ) : (
                        <div className="bg-yellow-50/50 p-4 rounded-xl border border-yellow-100/50">
                            <p className="text-gray-700 italic font-medium">{data.studentRemarks || "No remarks added yet."}</p>
                        </div>
                    )}
                </motion.div>

            </motion.div>

            {/* --- NEW EXPERT LEVEL ACADEMIC SUMMARY --- */}
            <motion.div variants={itemVariants} initial="hidden" animate="visible">
                <StudentAcademicSummary 
                    studentId={studentId} 
                    studentName={`${data.firstName} ${data.lastName}`} 
                    parentName={`${data.parentFirstName} ${data.parentLastName}`} 
                />
            </motion.div>

            {/* Fee Submission Modal */}
            {showFeeForm && data && (
                <FeeSubmission
                    parent={{
                        parentFirstName: data.parentFirstName,
                        parentLastName: data.parentLastName,
                        cnic: data.parentCnic,
                        children: [{
                            studentId: data._id,
                            name: `${data.firstName} ${data.lastName}`,
                            class: data.classJoining,
                            photo: data.photoUrl,
                            monthlyFee: data.monthlyFee,
                            transportFee: data.transportFee
                        }]
                    }}
                    onClose={() => setShowFeeForm(false)}
                    onSuccess={() => {
                        fetchFees();
                        fetchData(); // Refresh student data too
                    }}
                />
            )}
        </motion.div>
    );
};