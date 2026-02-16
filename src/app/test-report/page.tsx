"use client";
import React from 'react';
import { TeacherHeader } from '@/components/layout/TeacherHeader';
import { TestReportContent } from '@/components/test-report/TestReportContent';
import { TeacherFooter } from '@/components/layout/TeacherFooter';

export default function TestReportPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] font-['Montserrat'] pb-20 md:pb-0 flex flex-col">
      <TeacherHeader title="Class Test Report" activePage="test-report" />
      <main className="max-w-[1200px] mx-auto p-4 md:p-8 mt-24 md:mt-0 flex-1 w-full">
        <TestReportContent />
      </main>
      <TeacherFooter />
    </div>
  );
}