"use client";
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { TeacherStats } from './TeacherStats';
import { TeacherFilters } from './TeacherFilters';
import { TeachersTable } from './TeachersTable';
// Import New Profile
import { TeacherProfile } from '@/components/dashboard/TeacherProfile';

export const TeachersOverview = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // STATE FOR PROFILE
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);

  // Filters & Stats State
  const [search, setSearch] = useState('');
  const [gender, setGender] = useState('');
  const [subject, setSubject] = useState('');
  const [subjectsList, setSubjectsList] = useState<string[]>([]);
  const [stats, setStats] = useState({ total: 0, male: 0, female: 0, best: "N/A" });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/teacher');
        const data = await res.json();

        if (data.success) {
          // 🟢 YE LINE MISSING THI, ISAY ADD KIYA HA
          const allTeachers = data.data;

          setTeachers(allTeachers);
          setFiltered(allTeachers);

          const maleCount = allTeachers.filter((t: any) => t.gender === 'Male' || t.gender === 'Boy').length;
          const femaleCount = allTeachers.filter((t: any) => t.gender === 'Female' || t.gender === 'Girl').length;

          // Best Teacher Logic (Copy banakar sort kiya taake error na aye)
          const mostExp = [...allTeachers].sort((a: any, b: any) => parseInt(b.totalExperience || 0) - parseInt(a.totalExperience || 0))[0];

          setStats({
            total: allTeachers.length,
            male: maleCount,
            female: femaleCount,
            best: mostExp
              ? `${mostExp.firstName} ${mostExp.totalExperience ? `(${mostExp.totalExperience} Years)` : ''}`
              : "N/A"
          });

          const uniqueSubjects = Array.from(new Set(allTeachers.map((t: any) => t.subjectsTaught).filter(Boolean))) as string[];
          setSubjectsList(uniqueSubjects);
        }
      } catch (err) { toast.error("Failed to load teachers"); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  useEffect(() => {

    let temp = [...teachers];
    if (search) temp = temp.filter(t => (t.firstName + ' ' + t.lastName).toLowerCase().includes(search.toLowerCase()) || (t.mobileNo && t.mobileNo.includes(search)));
    if (gender) temp = temp.filter(t => t.gender === gender);
    if (subject) temp = temp.filter(t => t.subjectsTaught === subject);
    setFiltered(temp);
  }, [search, gender, subject, teachers]);

  const handleContact = (t: any) => {
    if (!t.mobileNo) { toast.error("No mobile number found!"); return; }
    let number = t.mobileNo.replace(/[^0-9]/g, '');
    if (number.startsWith('03')) number = '92' + number.substring(1);
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(`Assalam-o-Alaikum Sir/Ma'am ${t.firstName}, from Admin.`)}`, '_blank');
  };

  const handleFire = async (id: string, name: string) => {
    try {
      const res = await fetch(`/api/teacher?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success(`${name} removed successfully`);
        setTeachers(prev => prev.filter(t => t._id !== id));
      } else toast.error(data.error || 'Failed to remove teacher');
    } catch { toast.error('Error removing teacher'); }
  };

  // --- SHOW PROFILE IF ID IS SET ---
  if (selectedTeacherId) {
    return <TeacherProfile teacherId={selectedTeacherId} onBack={() => setSelectedTeacherId(null)} />;
  }

  return (
    <div className="space-y-8 font-['Montserrat'] animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <Toaster position="top-center" richColors />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-[#B50104] uppercase tracking-tighter mb-1">Teachers</h1>
          <p className="text-gray-400 font-bold text-sm">Manage faculty and staff records</p>
        </div>
        <button onClick={() => onNavigate('teacher-hiring')} className="h-[50px] px-8 bg-[#B50104] text-white font-bold rounded-xl shadow-lg hover:bg-[#900000] hover:shadow-xl transition-all flex items-center gap-2 active:scale-95 cursor-pointer">
          <Plus size={20} /> Add Teacher
        </button>
      </div>

      <TeacherStats stats={stats} />

      <TeacherFilters
        search={search} setSearch={setSearch}
        gender={gender} setGender={setGender}
        subject={subject} setSubject={setSubject}
        subjectsList={subjectsList}
      />

      <TeachersTable
        teachers={filtered}
        loading={loading}
        onProfile={(id: string) => setSelectedTeacherId(id)}
        onContact={handleContact}
        onFire={handleFire}
      />
    </div>
  );
};