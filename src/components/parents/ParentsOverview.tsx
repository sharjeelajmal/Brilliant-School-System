"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, MessageCircle, Users, UserCheck, UserX, AlertTriangle } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { ParentProfile } from '@/components/dashboard/ParentProfile'; // Import Profile
import { StudentProfile } from '@/components/dashboard/StudentProfile'; // To view child

// Stats Card Component
const StatCard = ({ label, value, icon: Icon, color, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow"
  >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${color}`}>
          <Icon size={24} />
      </div>
      <div>
          <h3 className="text-3xl font-black text-[#191919]">{value}</h3>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
      </div>
  </motion.div>
);

export const ParentsOverview = () => {
  const [parents, setParents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Navigation States
  const [selectedParent, setSelectedParent] = useState<any>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Fetch Data
  useEffect(() => {
      const fetchData = async () => {
          try {
              const res = await fetch('/api/parents');
              const data = await res.json();
              if(data.success) setParents(data.data);
          } catch(e) { toast.error("Failed to load parents"); }
          finally { setLoading(false); }
      };
      fetchData();
  }, []);

  // Filter
  const filteredParents = parents.filter(p => 
      p.fatherName.toLowerCase().includes(search.toLowerCase()) || 
      p.mobileNo.includes(search) ||
      p.cnic?.includes(search)
  );

  const handleContact = (p: any) => {
      window.open(`https://wa.me/${p.mobileNo.replace(/[^0-9]/g, '')}`, '_blank');
  };

  // --- RENDER LOGIC ---
  if(selectedStudentId) return <StudentProfile studentId={selectedStudentId} onBack={() => setSelectedStudentId(null)} />;
  if(selectedParent) return <ParentProfile parent={selectedParent} onBack={() => setSelectedParent(null)} onViewStudent={(id: string) => setSelectedStudentId(id)} />;

  return (
    <div className="space-y-8 font-['Montserrat'] animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <Toaster position="top-center" richColors />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
         <div>
            <h1 className="text-4xl font-black text-[#B50104] uppercase tracking-tighter mb-1">Parents / Guardians</h1>
            <p className="text-gray-400 font-bold text-sm">Manage parent profiles & connections</p>
         </div>
         <div className="relative w-full md:w-[300px]">
            <input 
                value={search} onChange={(e) => setSearch(e.target.value)}
                type="text" placeholder="Search by Name, CNIC..." 
                className="w-full h-12 bg-white border border-gray-200 rounded-xl pl-12 pr-4 outline-none focus:border-[#B50104] font-medium text-sm shadow-sm"
            />
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
         </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Total Parents" value={parents.length} icon={Users} color="bg-[#B50104]" delay={0} />
          <StatCard label="Active Parents" value={parents.filter(p => p.status === 'Active').length} icon={UserCheck} color="bg-[#009952]" delay={0.1} />
          <StatCard label="Inactive" value={parents.filter(p => p.status !== 'Active').length} icon={UserX} color="bg-gray-400" delay={0.2} />
          <StatCard label="Missing CNIC" value={parents.filter(p => !p.cnic).length} icon={AlertTriangle} color="bg-yellow-500" delay={0.3} />
      </div>

      {/* Table */}
      <div className="bg-white rounded-[24px] shadow-xl border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 py-5 px-6 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <div className="col-span-1">Sr.#</div>
              <div className="col-span-3">Parent Name</div>
              <div className="col-span-3">Contact Info</div>
              <div className="col-span-2 text-center">Children</div>
              <div className="col-span-3 text-right">Actions</div>
          </div>

          <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
              {loading ? <div className="p-10 text-center text-gray-400 font-bold">Loading...</div> :
               filteredParents.length === 0 ? <div className="p-10 text-center text-gray-400">No Parents Found</div> :
               filteredParents.map((p, i) => (
                  <motion.div 
                    key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                    className="grid grid-cols-12 gap-4 items-center py-4 px-6 border-b border-gray-50 hover:bg-red-50/10 transition-colors group"
                  >
                      <div className="col-span-1 font-bold text-gray-400">#{i + 1}</div>
                      <div className="col-span-3">
                          <p className="font-bold text-[#191919]">{p.fatherName}</p>
                          <p className="text-[10px] text-gray-400 font-bold">CNIC: {p.cnic || 'N/A'}</p>
                      </div>
                      <div className="col-span-3">
                          <p className="font-bold text-gray-600 text-xs">{p.mobileNo}</p>
                          <p className="text-[10px] text-gray-400 truncate">{p.address || 'No Address'}</p>
                      </div>
                      <div className="col-span-2 text-center">
                          <span className="bg-red-100 text-[#B50104] px-2 py-1 rounded text-xs font-bold">{p.children.length}</span>
                      </div>
                      <div className="col-span-3 flex justify-end gap-2 opacity-80 group-hover:opacity-100">
                          <button onClick={() => setSelectedParent(p)} className="text-[#0073BB] text-xs font-bold hover:underline flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg"><Eye size={14} /> Profile</button>
                          <button onClick={() => handleContact(p)} className="text-green-600 text-xs font-bold hover:underline flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-lg"><MessageCircle size={14} /> WhatsApp</button>
                      </div>
                  </motion.div>
               ))
              }
          </div>
      </div>
    </div>
  );
};