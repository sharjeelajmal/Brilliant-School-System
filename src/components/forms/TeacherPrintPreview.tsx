"use client";

import { Alexandria } from "next/font/google";

export type TeacherPrintData = {
    firstName: string;
    lastName: string;
    gender: string;
    dob: string;
    cnic: string;
    mobileNo: string;
    emergencyContact: string;
    maritalStatus: string;
    address: string;
    // Qualification
    degree: string;
    majorSubject: string;
    institute: string;
    completionYear: string;
    cgpa: string;
    lastInstitute: string;
    lastDesignation: string;
    subjectsTaught: string;
    classLevels: string;
    jobStartDate: string;
    jobEndDate: string;
    reasonLeaving: string;
    // Enrollment
    joiningDate: string;
    designation: string;
    subjectsAssigned: string;
    assignedClass: string;
    assignedSection: string;
    schoolInTime: string;
    schoolOutTime: string;
    // Payroll
    monthlySalary: string;
    allowance: string;
    securityDeposit: string;
    paymentMethod: string;
};

const alexandria = Alexandria({ subsets: ["latin"], weight: ["300", "500", "700"] });
const valueOrDash = (v?: string) => (v && v.trim() ? v : " ");

/* ─── Field ─────────────────────────────────────────────────────────── */
const F = ({ label, value, top, left, width }: { label: string; value: string; top: number; left: string; width: number }) => (
    <div className="absolute" style={{ top: `${top}px`, left, width: `${width}px` }}>
        <div className="flex items-end w-full border-b border-[#5A5A5A] pb-[1px]">
            <span style={{ fontFamily: "Alexandria,sans-serif", fontWeight: 500, fontSize: "11px", lineHeight: "14px", color: "#3A3A3A", whiteSpace: "nowrap" }}>
                {label}
            </span>
            <span className="flex-1 text-left truncate pl-[3px]" style={{ fontFamily: "Alexandria,sans-serif", fontWeight: 400, fontSize: "11px", lineHeight: "14px", color: "#2E2E2E" }}>
                {valueOrDash(value)}
            </span>
        </div>
    </div>
);

/* ─── Section divider ────────────────────────────────────────────────── */
const Div = ({ top, label }: { top: number; label: string }) => (
    <>
        <div className="absolute left-[25px] right-[25px] h-[1px] bg-gradient-to-r from-[#0A024B] via-[#3B5EA6] to-transparent" style={{ top: `${top}px` }} />
        <div className="absolute" style={{ top: `${top + 14}px`, left: "25px", fontFamily: "Alexandria,sans-serif", fontWeight: 700, fontSize: "10px", lineHeight: "12px", color: "#0A024B" }}>
            {label}
        </div>
    </>
);

/* ─── Shared Header ──────────────────────────────────────────────────── */
function PageHeader({ showTitle }: { showTitle?: boolean }) {
    return (
        <div className="absolute inset-x-0 top-0 h-[88px] overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-[#0A024B]" />
            <div className="absolute inset-x-0 top-0 h-[3px] bg-[#1E40AF]" />
            <div className="absolute bottom-0 right-0 w-0 h-0" style={{ borderLeft: "140px solid transparent", borderBottom: "88px solid white" }} />
            <div className="absolute bottom-0 left-0 w-0 h-0" style={{ borderRight: "90px solid transparent", borderBottom: "40px solid rgba(30,64,175,0.25)" }} />
            <div className="absolute" style={{ top: "6px", right: "145px", height: "50px", width: "80px", opacity: 0.2, backgroundImage: "radial-gradient(circle,#E0E7FF 1px,transparent 1px)", backgroundSize: "8px 8px" }} />
            <div className="absolute rounded-full" style={{ left: "100px", bottom: "14px", height: "2px", width: "100px", background: "#F59E0B", opacity: 0.8 }} />
            <div className="absolute rounded-full" style={{ top: "12px", left: "90px", height: "6px", width: "6px", background: "#F59E0B", opacity: 0.7 }} />
            <div className="absolute text-white" style={{ top: "18px", left: "98px", fontFamily: "Alexandria,sans-serif", fontWeight: 700, fontSize: "13px", lineHeight: "16px" }}>
                BRILLIANT SCIENCE SCHOOL &amp; ACADEMY
            </div>
            <div className="absolute" style={{ top: "37px", left: "98px", fontFamily: "Alexandria,sans-serif", fontWeight: 300, fontSize: "7px", lineHeight: "9px", color: "#B0C4E8" }}>
                Project of YouTube channel &quot;Student ki Dunya&quot;
            </div>
            <div className="absolute" style={{ top: "49px", left: "98px", fontFamily: "Alexandria,sans-serif", fontWeight: 300, fontSize: "7px", lineHeight: "9px", color: "#B0C4E8" }}>
                +92 322 4525320 &nbsp;|&nbsp; Maryam Park, Attari Saroba, Lahore
            </div>
            <div className="absolute flex items-center justify-center rounded overflow-hidden bg-white" style={{ top: "12px", left: "16px", width: "66px", height: "64px" }}>
                <img src="/logo.jpg" alt="School logo" className="w-full h-full object-contain" />
            </div>
            {showTitle && (
                <div className="absolute rounded-sm" style={{ bottom: "10px", right: "150px", fontFamily: "Alexandria,sans-serif", fontWeight: 700, fontSize: "10px", letterSpacing: "0.08em", color: "#0A024B", background: "white", padding: "3px 10px" }}>
                    TEACHER HIRING FORM
                </div>
            )}
        </div>
    );
}

/* ══════════════════ LAYOUT (px values, GAP = 36) ══════════════════════
   PAGE 1
   Personal div   : 108  → rows: 148, 184, 220, 256, 292  (5 rows)
   Qualif div     : 326  → rows: 366, 402, 438, 474, 510, 546  (6 rows)
   Enrollment div : 580  → rows: 620, 656, 692  (3 rows)
   Signatures     : 756
   ═══════════════════════════════════════════════════════════════════ */

export function TeacherPrintPreview({ data, className = "" }: { data: TeacherPrintData; className?: string }) {
    return (
        <div className={`teacher-print-root text-black bg-white ${alexandria.className} ${className}`}>
            {/* ══════ PAGE 1 ══════ */}
            <div className="teacher-print-page relative mx-auto bg-white">
                <div className="teacher-print-canvas relative w-[595px] h-[842px] overflow-hidden bg-white">
                    <PageHeader showTitle />

                    {/* ── Personal Information ── */}
                    <Div top={108} label="Personal Information:" />
                    <F label="First Name:" value={data.firstName} top={148} left="calc(50% - 246px/2 - 149.5px)" width={246} />
                    <F label="Last Name:" value={data.lastName} top={148} left="calc(50% - 256px/2 + 142.5px)" width={256} />
                    <F label="Gender:" value={data.gender} top={184} left="calc(50% - 245px/2 - 150px)" width={245} />
                    <F label="Date of Birth:" value={data.dob} top={184} left="calc(50% - 261px/2 + 145px)" width={261} />
                    <F label="CNIC:" value={data.cnic} top={220} left="calc(50% - 245px/2 - 150px)" width={245} />
                    <F label="Mobile No. 1:" value={data.mobileNo} top={220} left="calc(50% - 261px/2 + 145px)" width={261} />
                    <F label="Mobile No. 2:" value={data.emergencyContact} top={256} left="calc(50% - 245px/2 - 150px)" width={245} />
                    <F label="Marital Status:" value={data.maritalStatus} top={256} left="calc(50% - 261px/2 + 145px)" width={261} />
                    <F label="Address:" value={data.address} top={292} left="calc(50% - 546px/2 + 0.5px)" width={546} />

                    {/* ── Qualification & Experience ── */}
                    <Div top={326} label="Qualification &amp; Experience:" />
                    <F label="Qualification:" value={data.degree} top={366} left="calc(50% - 246px/2 - 149.5px)" width={246} />
                    <F label="Major Subjects:" value={data.majorSubject} top={366} left="calc(50% - 256px/2 + 142.5px)" width={256} />
                    <F label="Institute:" value={data.institute} top={402} left="calc(50% - 246px/2 - 149.5px)" width={246} />
                    <F label="Year of Completion:" value={data.completionYear} top={402} left="calc(50% - 256px/2 + 142.5px)" width={256} />
                    <F label="Grade/CGPA:" value={data.cgpa} top={438} left="calc(50% - 245px/2 - 150px)" width={245} />
                    <F label="School Name:" value={data.lastInstitute} top={438} left="calc(50% - 261px/2 + 145px)" width={261} />
                    <F label="Designation:" value={data.lastDesignation} top={474} left="calc(50% - 245px/2 - 150px)" width={245} />
                    <F label="Subjects Taught:" value={data.subjectsTaught} top={474} left="calc(50% - 261px/2 + 145px)" width={261} />
                    <F label="Class Levels:" value={data.classLevels} top={510} left="calc(50% - 245px/2 - 150px)" width={245} />
                    <F label="Starting Date:" value={data.jobStartDate} top={510} left="calc(50% - 261px/2 + 145px)" width={261} />
                    <F label="Ending Date:" value={data.jobEndDate} top={546} left="calc(50% - 245px/2 - 150px)" width={245} />
                    <F label="Leaving Reason:" value={data.reasonLeaving} top={546} left="calc(50% - 261px/2 + 145px)" width={261} />

                    {/* ── Enrollment ── */}
                    <Div top={580} label="Enrollment:" />
                    <F label="Joining Date:" value={data.joiningDate} top={620} left="calc(50% - 246px/2 - 149.5px)" width={246} />
                    <F label="Subjects Assigned:" value={data.subjectsAssigned} top={620} left="calc(50% - 256px/2 + 142.5px)" width={256} />
                    <F label="Assigned Class:" value={data.assignedClass} top={656} left="calc(50% - 245px/2 - 150px)" width={245} />
                    <F label="Assigned Section:" value={data.assignedSection} top={656} left="calc(50% - 261px/2 + 145px)" width={261} />
                    <F label="School In Time:" value={data.schoolInTime} top={692} left="calc(50% - 245px/2 - 150px)" width={245} />
                    <F label="School Out Time:" value={data.schoolOutTime} top={692} left="calc(50% - 261px/2 + 145px)" width={261} />

                    {/* ── Signature Lines ── */}
                    <div className="absolute w-[195px] border border-black" style={{ top: "790px", left: "40px" }} />
                    <div className="absolute text-center" style={{ top: "798px", left: "40px", width: "195px", fontFamily: "Alexandria,sans-serif", fontWeight: 500, fontSize: "10px", lineHeight: "12px", color: "#3A3A3A" }}>
                        Teacher Signature
                    </div>

                    <div className="absolute w-[195px] border border-black" style={{ top: "790px", left: "360px" }} />
                    <div className="absolute text-center" style={{ top: "798px", left: "360px", width: "195px", fontFamily: "Alexandria,sans-serif", fontWeight: 500, fontSize: "10px", lineHeight: "12px", color: "#3A3A3A" }}>
                        Principal Signature
                    </div>

                    {/* "Ahsan" above Principal line — moved below last field (692px+gap) */}
                    <div className="absolute text-center" style={{ top: "712px", left: "360px", width: "195px", fontFamily: "'Bastliga', cursive", fontWeight: 400, fontSize: "64px", lineHeight: "100%", letterSpacing: "0", color: "#0A024B" }}>
                        Ahsan
                    </div>
                </div>
            </div>
        </div>
    );
}
