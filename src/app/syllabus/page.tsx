"use client";
import React, { useEffect, useState } from 'react';
import { TeacherHeader } from '@/components/layout/TeacherHeader';
import { SyllabusManager } from '@/components/syllabus/SyllabusManager';
import { TeacherFooter } from '@/components/layout/TeacherFooter';

export default function SyllabusPage() {
  const [role, setRole] = useState('teacher');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setRole(user.role || 'teacher');
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-['Montserrat'] pb-20 md:pb-0 flex flex-col">
      <TeacherHeader title="Syllabus Management" activePage="syllabus" />
      <main className="max-w-[1200px] mx-auto p-4 md:p-8 mt-24 md:mt-0 flex-1 w-full">
        <SyllabusManager role={role} />
      </main>
      <TeacherFooter />
    </div>
  );
}
