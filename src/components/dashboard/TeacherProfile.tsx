"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Printer,
  Edit,
  Save,
  X,
  Phone,
  MapPin,
  User,
  GraduationCap,
  Briefcase,
  DollarSign,
  CreditCard,
} from "lucide-react";
import { toast, Toaster } from "sonner";

// --- EDITABLE ROW COMPONENT ---
const InfoRow = ({ label, value, name, isEditing, onChange }: any) => (
  <div className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0 h-[35px]">
    <span className="text-gray-400 font-medium text-xs md:text-sm whitespace-nowrap">
      {label}
    </span>
    {isEditing ? (
      <input
        type="text"
        name={name}
        value={value || ""}
        onChange={onChange}
        className="text-right font-bold text-[#191919] text-xs md:text-sm border-b border-[#B50104] outline-none bg-transparent w-[60%]"
      />
    ) : (
      <span className="font-bold text-[#191919] text-xs md:text-sm text-right truncate pl-4">
        {value || "-"}
      </span>
    )}
  </div>
);

export const TeacherProfile = ({
  teacherId,
  onBack,
}: {
  teacherId: string;
  onBack: () => void;
}) => {
  const [data, setData] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null); // State for Editing
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
        setFormData(json.data); // Initialize form data
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (teacherId) fetchData();
  }, [teacherId]);

  // Handle Input Change
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save Changes
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/teacher", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();

      if (res.ok) {
        toast.success("Profile Updated Successfully!");
        setData(json.data); // Update main view
        setIsEditing(false);
      } else {
        toast.error(json.error || "Failed to update");
      }
    } catch (e) {
      toast.error("Network Error");
    } finally {
      setSaving(false);
    }
  };

  // --- AVATAR LOGIC ---
  const getAvatar = () => {
    if (data.photoUrl)
      return <img src={data.photoUrl} className="w-full h-full object-cover" />;

    const gender = data.gender ? data.gender.toLowerCase() : "";
    if (gender === "male" || gender === "boy")
      return (
        <img
          src="/male.png"
          className="w-full h-full object-cover"
          alt="Male"
        />
      );
    if (gender === "female" || gender === "girl")
      return (
        <img
          src="/female.png"
          className="w-full h-full object-cover"
          alt="Female"
        />
      );

    return <User size={48} />;
  };

  if (loading)
    return (
      <div className="p-20 text-center font-bold text-gray-400 animate-pulse">
        Loading Profile...
      </div>
    );
  if (!data)
    return (
      <div className="p-20 text-center font-bold text-red-500">
        Teacher Not Found
      </div>
    );

  return (
    <div className="space-y-6 font-['Montserrat'] animate-in fade-in slide-in-from-right-10 duration-500">
      <Toaster position="top-center" richColors />

      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 bg-[#B50104] text-white rounded-lg hover:scale-110 transition-transform shadow-md cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-3xl font-black text-[#B50104] uppercase tracking-tighter">
            Teacher Profile
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 font-bold rounded-lg hover:bg-gray-200 text-sm cursor-pointer"
          >
            <Printer size={16} /> Print
          </button>

          {/* Edit / Save Buttons */}
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 text-sm cursor-pointer"
              >
                <X size={16} /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 text-sm shadow-lg shadow-green-200 cursor-pointer"
              >
                {saving ? (
                  "Saving..."
                ) : (
                  <>
                    <Save size={16} /> Save Changes
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 font-bold rounded-lg hover:bg-blue-100 text-sm cursor-pointer"
            >
              <Edit size={16} /> Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-[24px] shadow-xl border border-gray-100 overflow-hidden">
        {/* Banner */}
        <div className="bg-[#B50104] p-8 text-white flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl" />

          {/* Dynamic Avatar */}
          <div className="w-32 h-32 bg-white rounded-full border-4 border-white/30 flex items-center justify-center text-[#B50104] font-bold overflow-hidden shadow-lg relative z-10 shrink-0">
            {getAvatar()}
          </div>

          <div className="relative z-10 text-center md:text-left w-full">
            {isEditing ? (
              <div className="flex flex-col gap-2 max-w-[300px]">
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="text-3xl font-black bg-white/20 rounded px-2 text-white placeholder-white/50 outline-none"
                  placeholder="First Name"
                />
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="text-3xl font-black bg-white/20 rounded px-2 text-white placeholder-white/50 outline-none"
                  placeholder="Last Name"
                />
              </div>
            ) : (
              <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-1">
                {data.firstName} {data.lastName}
              </h1>
            )}

            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {data.designation || "Teacher"}
            </span>

            <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-4 text-sm opacity-90 font-medium">
              <span className="flex items-center gap-1">
                <Phone size={14} /> {data.mobileNo}
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={14} /> {data.address}
              </span>
            </div>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 1. Personal & Job Info */}
          <div className="space-y-6">
            <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
              <h3 className="text-[#B50104] font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                <User size={18} /> Personal Details
              </h3>
              <div className="space-y-1">
                <InfoRow
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  isEditing={isEditing}
                  onChange={handleChange}
                />
                <InfoRow
                  label="Date of Birth"
                  name="dob"
                  value={formData.dob}
                  isEditing={isEditing}
                  onChange={handleChange}
                />
                <InfoRow
                  label="CNIC"
                  name="cnic"
                  value={formData.cnic}
                  isEditing={isEditing}
                  onChange={handleChange}
                />
                <InfoRow
                  label="Marital Status"
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  isEditing={isEditing}
                  onChange={handleChange}
                />
                <InfoRow
                  label="Emergency Contact"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  isEditing={isEditing}
                  onChange={handleChange}
                />
                <InfoRow
                  label="Address"
                  name="address"
                  value={formData.address}
                  isEditing={isEditing}
                  onChange={handleChange}
                />
                <InfoRow
                  label="Mobile No"
                  name="mobileNo"
                  value={formData.mobileNo}
                  isEditing={isEditing}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
              <h3 className="text-blue-700 font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                <Briefcase size={18} /> Job & Enrollment
              </h3>
              <div className="space-y-1">
                <InfoRow
                  label="Joining Date"
                  name="joiningDate"
                  value={formData.joiningDate}
                  isEditing={isEditing}
                  onChange={handleChange}
                />
                <InfoRow
                  label="Designation"
                  name="designation"
                  value={formData.designation}
                  isEditing={isEditing}
                  onChange={handleChange}
                />
                <InfoRow
                  label="Assigned Class"
                  name="assignedClass"
                  value={formData.assignedClass}
                  isEditing={isEditing}
                  onChange={handleChange}
                />
                <InfoRow
                  label="Assigned Section"
                  name="assignedSection"
                  value={formData.assignedSection}
                  isEditing={isEditing}
                  onChange={handleChange}
                />
                <InfoRow
                  label="In Time"
                  name="schoolInTime"
                  value={formData.schoolInTime}
                  isEditing={isEditing}
                  onChange={handleChange}
                />
                <InfoRow
                  label="Out Time"
                  name="schoolOutTime"
                  value={formData.schoolOutTime}
                  isEditing={isEditing}
                  onChange={handleChange}
                />
                <InfoRow label="Experience" value={data.totalExperience ? `${data.totalExperience} Years` : 'Fresh / Not Added'} />
              </div>
            </div>
          </div>

          {/* 2. Qualification, Payroll & Bank */}
          <div className="space-y-6">
            <div className="bg-green-50/50 p-5 rounded-2xl border border-green-100">
              <h3 className="text-green-700 font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                <DollarSign size={18} /> Payroll Info
              </h3>
              <div className="space-y-1">
                <InfoRow
                  label="Monthly Salary"
                  name="monthlySalary"
                  value={formData.monthlySalary}
                  isEditing={isEditing}
                  onChange={handleChange}
                />
                <InfoRow
                  label="Allowances"
                  name="allowance"
                  value={formData.allowance}
                  isEditing={isEditing}
                  onChange={handleChange}
                />
                <InfoRow
                  label="Salary Date"
                  name="salaryDate"
                  value={formData.salaryDate}
                  isEditing={isEditing}
                  onChange={handleChange}
                />
                <InfoRow
                  label="Security Deposit"
                  name="securityDeposit"
                  value={formData.securityDeposit}
                  isEditing={isEditing}
                  onChange={handleChange}
                />
                <InfoRow
                  label="Increment"
                  name="salaryIncrement"
                  value={formData.salaryIncrement}
                  isEditing={isEditing}
                  onChange={handleChange}
                />
                <div className="pt-2 border-t border-green-200 mt-2">
                  <InfoRow
                    label="Payment Method"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    isEditing={isEditing}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="bg-yellow-50/50 p-5 rounded-2xl border border-yellow-100">
              <h3 className="text-yellow-700 font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                <GraduationCap size={18} /> Qualification
              </h3>
              <div className="space-y-1">
                <InfoRow
                  label="Degree"
                  name="degree"
                  value={formData.degree}
                  isEditing={isEditing}
                  onChange={handleChange}
                />
                <InfoRow
                  label="Major Subject"
                  name="majorSubject"
                  value={formData.majorSubject}
                  isEditing={isEditing}
                  onChange={handleChange}
                />
                <InfoRow
                  label="Institute"
                  name="institute"
                  value={formData.institute}
                  isEditing={isEditing}
                  onChange={handleChange}
                />
                <InfoRow
                  label="Completion Year"
                  name="completionYear"
                  value={formData.completionYear}
                  isEditing={isEditing}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="bg-purple-50/50 p-5 rounded-2xl border border-purple-100">
              <h3 className="text-purple-700 font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                <CreditCard size={18} /> Bank Details
              </h3>
              <div className="space-y-1">
                <InfoRow
                  label="Bank Name"
                  name="bankName"
                  value={formData.bankName}
                  isEditing={isEditing}
                  onChange={handleChange}
                />
                <InfoRow
                  label="Account Title"
                  name="accountTitle"
                  value={formData.accountTitle}
                  isEditing={isEditing}
                  onChange={handleChange}
                />
                <InfoRow
                  label="Account No"
                  name="accountNo"
                  value={formData.accountNo}
                  isEditing={isEditing}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
