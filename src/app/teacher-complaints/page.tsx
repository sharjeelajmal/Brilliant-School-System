"use client";
import React from 'react';
import { TeacherHeader } from '@/components/layout/TeacherHeader';
import { ComplaintManager } from '@/components/complaints/ComplaintManager';

export default function TeacherComplaintPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] font-['Montserrat'] pb-20 md:pb-0">
      <TeacherHeader title="Complaints" activePage="complaints" />
      <main className="max-w-[1200px] mx-auto p-4 md:p-8 mt-24 md:mt-0">
        <ComplaintManager mode="teacher" />
      </main>
    </div>
  );
}