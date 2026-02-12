"use client";
import React from 'react';
import { TeacherHeader } from '@/components/layout/TeacherHeader';
import { ClassDiary } from '@/components/diary/ClassDiary';

export default function TeacherDiaryPage() {
    return (
        <div className="min-h-screen bg-[#FDFDFD] font-['Montserrat'] pb-20 md:pb-0">
            <TeacherHeader title="Class Diary" activePage="diary" />
            <main className="max-w-[1200px] mx-auto p-4 md:p-8 mt-24 md:mt-0">
                <ClassDiary mode="teacher" />
            </main>
        </div>
    );
}
