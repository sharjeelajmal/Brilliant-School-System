import React from 'react';
import { TeacherHeader } from '@/components/layout/TeacherHeader';
import { ComplaintManager } from '@/components/complaints/ComplaintManager';
import { TeacherFooter } from '@/components/layout/TeacherFooter';

export default function TeacherComplaintPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] font-['Montserrat'] pb-20 md:pb-0 flex flex-col">
      <TeacherHeader title="Complaints" activePage="complaints" />
      <main className="max-w-[1200px] mx-auto p-4 md:p-8 mt-24 md:mt-0 flex-1 w-full">
        <ComplaintManager mode="teacher" />
      </main>
      <TeacherFooter />
    </div>
  );
}