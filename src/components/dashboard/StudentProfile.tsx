"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Printer, Edit, Trash2, Phone, MapPin, CreditCard, User } from 'lucide-react';

interface ProfileProps {
  studentId: string; // Changed from studentName to studentId
  onBack: () => void;
}

export const StudentProfile = ({ studentId, onBack }: ProfileProps) => {
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // --- FETCH STUDENT DATA ---
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await fetch(`/api/students?id=${studentId}`);
        const data = await res.json();
        if (data.success) {
          setStudent(data.data);
        }
      } catch (err) {
        console.error("Error fetching profile");
      } finally {
        setLoading(false);
      }
    };
    
    if (studentId) fetchStudent();
  }, [studentId]);

  if (loading) return <div className="p-10 text-center font-bold text-gray-400">Loading Profile...</div>;
  if (!student) return <div className="p-10 text-center font-bold text-red-500">Student Not Found</div>;

  return (
    <div className="space-y-8 font-['Montserrat'] animate-in fade-in slide-in-from-right-10 duration-500">
      
      {/* Header & Actions */}
      <div className="flex justify-between items-center">
         <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 bg-[#B70003] text-white rounded-lg hover:scale-110 transition-transform shadow-md cursor-pointer">
                <ArrowLeft size={20} />
            </button>
            <h2 className="text-3xl font-black text-[#B70003] uppercase tracking-tighter">Student Profile</h2>
         </div>
         <div className="flex gap-3">
             <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-gray-100 font-bold rounded-lg hover:bg-gray-200 transition-colors text-sm">
                 <Printer size={16} /> Print
             </button>
             <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 font-bold rounded-lg hover:bg-blue-100 transition-colors text-sm">
                 <Edit size={16} /> Edit
             </button>
         </div>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-[24px] shadow-xl border border-gray-100 overflow-hidden">
          
          {/* Top Banner / Basic Info */}
          <div className="bg-[#B70003] p-8 text-white flex items-center gap-8 relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
              
              {/* Photo */}
             <div className="w-32 h-32 bg-white rounded-full border-4 border-white/30 flex items-center justify-center text-[#B70003] font-bold overflow-hidden shadow-lg relative z-10">
                  {student.photoUrl ? (
                      // Agar photo upload hui hai to wo dikhayein (Real app ma yahan <img src={student.photoUrl} /> hoga)
                      <span className="text-xs">Photo</span> 
                  ) : (
                      // Agar photo nahi hai, to Gender check karein
                     student.gender === 'Boy' ? (
        <img src="/Boy.png" alt="Boy Avatar" className="w-full h-full object-cover" />
    ) : student.gender === 'Girl' ? (
        <img src="/Girl.png" alt="Girl Avatar" className="w-full h-full object-cover" />
    ) : (
        <User size={48} />
    )
)}
              </div>

              {/* Name & Roll No */}
              <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-1">
                      <h1 className="text-4xl font-black tracking-tight">{student.firstName} {student.lastName}</h1>
                   <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
  Roll No: {student.rollNo || "Pending"}
</span>
                  </div>
                  <p className="opacity-90 font-medium text-lg flex items-center gap-2">
                      {student.classJoining} <span className="w-1.5 h-1.5 bg-white rounded-full"></span> Section {student.section}
                  </p>
              </div>
          </div>

          {/* Details Grid */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
              
              {/* Column 1: Personal & Guardian */}
              <div className="space-y-8">
                  
                  {/* Personal Info */}
                  <div>
                      <h3 className="text-[#B70003] font-bold uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Personal Information</h3>
                      <div className="space-y-3 text-sm">
                          <div className="flex justify-between"><span className="text-gray-400 font-medium">Date of Birth</span> <span className="font-bold text-[#191919]">{student.dob}</span></div>
                          <div className="flex justify-between"><span className="text-gray-400 font-medium">Gender</span> <span className="font-bold text-[#191919]">{student.gender}</span></div>
                          <div className="flex justify-between"><span className="text-gray-400 font-medium">B-Form / CNIC</span> <span className="font-bold text-[#191919]">{student.studentCnic || '-'}</span></div>
                          <div className="flex justify-between"><span className="text-gray-400 font-medium">Nationality</span> <span className="font-bold text-[#191919]">{student.nationality}</span></div>
                          <div className="flex justify-between"><span className="text-gray-400 font-medium">Religion</span> <span className="font-bold text-[#191919]">{student.religion}</span></div>
                      </div>
                  </div>

                  {/* Guardian Info */}
                  <div>
                      <h3 className="text-[#B70003] font-bold uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Guardian Details</h3>
                      <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 space-y-3 text-sm">
                          <div className="flex justify-between"><span className="text-gray-400 font-medium">Guardian Name</span> <span className="font-bold text-[#191919]">{student.parentFirstName} {student.parentLastName}</span></div>
                          <div className="flex justify-between"><span className="text-gray-400 font-medium">Relation</span> <span className="font-bold text-[#191919]">{student.relation}</span></div>
                          <div className="flex justify-between"><span className="text-gray-400 font-medium">Occupation</span> <span className="font-bold text-[#191919]">{student.occupation}</span></div>
                          <div className="flex justify-between"><span className="text-gray-400 font-medium">CNIC</span> <span className="font-bold text-[#191919]">{student.parentCnic}</span></div>
                          
                          <div className="pt-3 mt-3 border-t border-gray-200">
                             <div className="flex items-center gap-3 mb-2">
                                <Phone size={16} className="text-[#B70003]" />
                                <span className="font-bold text-[#191919]">{student.mobileNo}</span>
                             </div>
                             <div className="flex items-start gap-3">
                                <MapPin size={16} className="text-[#B70003] mt-1" />
                                <span className="font-bold text-[#191919] leading-tight">{student.address}</span>
                             </div>
                          </div>
                      </div>
                  </div>

              </div>

              {/* Column 2: Fees & Academic */}
              <div className="space-y-8">
                  
                  {/* Fee Structure */}
                  <div>
                      <h3 className="text-[#B70003] font-bold uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Fee Structure</h3>
                      <div className="grid grid-cols-2 gap-4">
                          <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-center">
                              <p className="text-xs font-bold text-green-700 uppercase mb-1">Monthly Fee</p>
                              <p className="text-2xl font-black text-green-800">{student.monthlyFee}</p>
                          </div>
                          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                              <p className="text-xs font-bold text-blue-700 uppercase mb-1">Admission Fee</p>
                              <p className="text-2xl font-black text-blue-800">{student.admissionFee}</p>
                          </div>
                      </div>
                      
                      <div className="mt-4 space-y-3 text-sm">
                          <div className="flex justify-between"><span className="text-gray-400 font-medium">Annual Charges</span> <span className="font-bold text-[#191919]">{student.annualFee}</span></div>
                          <div className="flex justify-between"><span className="text-gray-400 font-medium">Other Charges</span> <span className="font-bold text-[#191919]">{student.otherCharges}</span></div>
                          <div className="flex justify-between pt-2 border-t border-gray-100"><span className="text-[#B70003] font-bold">Total Payable</span> <span className="font-black text-[#191919]">{student.totalPayable} PKR</span></div>
                      </div>
                  </div>

                  {/* Previous Academic */}
                  <div>
                      <h3 className="text-[#B70003] font-bold uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Academic History</h3>
                      <div className="space-y-3 text-sm">
                          <div className="flex justify-between"><span className="text-gray-400 font-medium">Previous School</span> <span className="font-bold text-[#191919]">{student.previousSchool || 'N/A'}</span></div>
                          <div className="flex justify-between"><span className="text-gray-400 font-medium">Last Class</span> <span className="font-bold text-[#191919]">{student.lastClass || 'N/A'}</span></div>
                          <div className="flex justify-between"><span className="text-gray-400 font-medium">Leaving Reason</span> <span className="font-bold text-[#191919]">{student.leavingReason || '-'}</span></div>
                          <div className="flex justify-between"><span className="text-gray-400 font-medium">Admission Date</span> <span className="font-bold text-[#191919]">{student.joiningDate}</span></div>
                      </div>
                  </div>

                  {/* Remarks */}
                  {student.studentRemarks && (
                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-sm">
                        <span className="font-bold text-yellow-800 block mb-1">Remarks:</span>
                        <p className="text-gray-700 italic">"{student.studentRemarks}"</p>
                    </div>
                  )}

              </div>
          </div>

      </div>
    </div>
  );
};