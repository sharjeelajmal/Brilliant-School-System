"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Printer, Check, X, Clock } from 'lucide-react';

// --- Info Row Component ---
const InfoRow = ({ label, value }: { label: string, value: string }) => (
  <div className="flex flex-col">
    <span className="text-[12px] font-bold text-[#191919] uppercase tracking-wide">{label}</span>
    <span className="text-[14px] font-medium text-gray-500 border-b border-gray-100 pb-1 mt-1">{value}</span>
  </div>
);

// --- Section Header ---
const SectionTitle = ({ title }: { title: string }) => (
  <h3 className="text-xl font-black text-[#191919] border-b border-gray-100 pb-2 mb-6 mt-8 uppercase tracking-tighter">
    {title}
  </h3>
);

// --- Simple Line Chart (Reused logic with different colors) ---
const ProfileChart = ({ title, color, dataPoints }: { title: string, color: string, dataPoints: string }) => (
  <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-lg h-[300px] flex flex-col relative overflow-hidden">
    <h4 className="font-bold text-[#191919] text-lg mb-6">{title}</h4>
    <div className="flex-1 relative border-l border-b border-gray-100 mx-2 mb-2">
       <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
          <motion.path 
            d={dataPoints} 
            fill="none" 
            stroke={color} 
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
       </svg>
    </div>
  </div>
);

interface StudentProps {
  studentName: string;
  onBack: () => void;
}

export const StudentProfile = ({ studentName, onBack }: StudentProps) => {
  
  return (
    <div className="space-y-8 font-['Montserrat'] animate-in fade-in slide-in-from-right-10 duration-500 pb-10">
      
      {/* --- Header --- */}
      <div className="bg-white p-6 rounded-[24px] shadow-xl border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
         <div className="flex items-center gap-6 w-full md:w-auto">
            <button onClick={onBack} className="p-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-[#B70003] hover:text-white transition-all shadow-sm">
                <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gray-200 border-4 border-white shadow-lg overflow-hidden">
                    <img src={`https://ui-avatars.com/api/?name=${studentName}&background=random`} alt="Student" className="w-full h-full object-cover" />
                </div>
                <div>
                    <h2 className="text-3xl font-black text-[#191919] tracking-tighter uppercase">{studentName}</h2>
                    <p className="text-gray-400 font-bold text-sm">Roll no. # 01</p>
                </div>
            </div>
         </div>
         <button className="px-8 py-3 bg-[#B70003] text-white font-bold rounded-xl shadow-lg hover:bg-[#950002] transition-all flex items-center gap-2">
            Print Profile <Printer size={18} />
         </button>
      </div>

      {/* --- Stats Bar --- */}
      <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100 grid grid-cols-2 md:grid-cols-5 gap-4 text-center divide-x divide-gray-100">
          <div><p className="text-xs text-gray-400 font-bold uppercase">Fee Status</p><p className="text-green-600 font-black text-lg">Paid</p></div>
          <div><p className="text-xs text-gray-400 font-bold uppercase">Complaints</p><p className="text-[#B70003] font-black text-lg">02</p></div>
          <div><p className="text-xs text-gray-400 font-bold uppercase">Teacher</p><p className="text-[#191919] font-black text-lg">Miss Sarah</p></div>
          <div><p className="text-xs text-gray-400 font-bold uppercase">Attendance</p><p className="text-[#191919] font-black text-lg">88%</p></div>
          <div><p className="text-xs text-gray-400 font-bold uppercase">Performance</p><p className="text-[#191919] font-black text-lg">A+</p></div>
      </div>

      {/* --- Information Sections --- */}
      <div className="bg-white p-8 rounded-[24px] shadow-xl border border-gray-100">
          
          {/* Personal Info */}
          <SectionTitle title="Personal Information" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-12">
              <InfoRow label="First Name" value="Ali" />
              <InfoRow label="Last Name" value="Khan" />
              <InfoRow label="Gender" value="Male" />
              <InfoRow label="Date of Birth" value="12/05/2018 (7 yrs old)" />
              <InfoRow label="Birth Cert No." value="34201-1234567-1" />
              <InfoRow label="Religion" value="Islam" />
              <InfoRow label="Nationality" value="Pakistani" />
              <InfoRow label="Prev. School" value="The Educators" />
              <InfoRow label="Last Class" value="Prep" />
          </div>

          {/* Parents Info */}
          <SectionTitle title="Parents / Guardian Information" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-12">
              <InfoRow label="Father Name" value="Ahmed Khan" />
              <InfoRow label="CNIC" value="34201-9876543-1" />
              <InfoRow label="Mobile No." value="0300-1234567" />
              <InfoRow label="WhatsApp No." value="0300-1234567" />
              <InfoRow label="Address" value="House 12, Street 4, Lahore" />
              <InfoRow label="Emergency Contact" value="0321-7654321" />
              <InfoRow label="Occupation" value="Businessman" />
              <InfoRow label="Monthly Income" value="150,000 PKR" />
          </div>

          {/* Enrollment */}
          <SectionTitle title="Enrollment" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-12">
              <InfoRow label="Joining Date" value="15/08/2023" />
              <InfoRow label="Class" value="Play Group" />
              <InfoRow label="Section" value="A" />
          </div>

          {/* Fee Structure */}
          <SectionTitle title="Fee Structure" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-y-6 gap-x-12">
              <InfoRow label="Monthly Fee" value="5,000 PKR" />
              <InfoRow label="Fee Date" value="10th of Month" />
              <InfoRow label="Annual Fee" value="20,000 PKR" />
              <InfoRow label="Admission Fee" value="10,000 PKR" />
              <InfoRow label="Uniform Charges" value="5,000 PKR" />
              <InfoRow label="Total Payable" value="40,000 PKR" />
              <InfoRow label="Discount" value="0 PKR" />
              <InfoRow label="Paid Amount" value="40,000 PKR" />
          </div>
      </div>

      {/* --- Charts & History --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Attendance Section */}
          <div className="space-y-6">
              <ProfileChart title="Attendance" color="#002F9C" dataPoints="M0 80 Q 60 40, 120 60 T 240 30 T 360 50 T 480 20" />
              
              <div className="bg-white p-6 rounded-[24px] shadow-lg border border-gray-100">
                  <h4 className="font-bold text-[#191919] mb-4 uppercase text-sm">Recent Attendance</h4>
                  <div className="space-y-3">
                      {[1,2,3,4,5].map(i => (
                          <div key={i} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2 last:border-none">
                              <span className="text-gray-400 font-medium">1{i}/02/2026</span>
                              <span className={`font-bold flex items-center gap-2 ${i===3 ? 'text-red-600' : 'text-green-600'}`}>
                                  {i===3 ? <><X size={14} /> Absent</> : <><Check size={14} /> Present</>}
                              </span>
                          </div>
                      ))}
                  </div>
              </div>
          </div>

          {/* Performance Section */}
          <div className="space-y-6">
              <ProfileChart title="Performance" color="#009952" dataPoints="M0 100 Q 60 80, 120 90 T 240 60 T 360 40 T 480 10" />
              
              <div className="bg-white p-6 rounded-[24px] shadow-lg border border-gray-100">
                  <h4 className="font-bold text-[#191919] mb-4 uppercase text-sm">Recent Tests</h4>
                  <div className="space-y-3">
                      <div className="grid grid-cols-4 text-xs font-bold text-gray-400 mb-2">
                          <span>Date</span><span>Subject</span><span>% Age</span><span className="text-right">Status</span>
                      </div>
                      {[
                          { date: '10/02', sub: 'Maths', pct: '89%', status: 'Pass', color: 'green' },
                          { date: '12/02', sub: 'Urdu', pct: '45%', status: 'Fail', color: 'red' },
                          { date: '15/02', sub: 'Eng', pct: '92%', status: 'Pass', color: 'green' },
                      ].map((t, i) => (
                          <div key={i} className="grid grid-cols-4 text-sm font-medium border-b border-gray-50 pb-2 last:border-none items-center">
                              <span className="text-gray-500">{t.date}</span>
                              <span className="text-[#191919]">{t.sub}</span>
                              <span className="text-gray-600">{t.pct}</span>
                              <span className={`text-right font-bold text-${t.color}-600`}>{t.status}</span>
                          </div>
                      ))}
                  </div>
              </div>
          </div>

      </div>

    </div>
  );
};