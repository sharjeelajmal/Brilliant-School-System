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

/* ─── Field (Absolute Coordinates Only) ────────────────────────────── */
const F = ({ label, value, top, left, width }: { label: string; value: string; top: number; left: number; width: number }) => (
    <div className="absolute" style={{ top: `${top}px`, left: `${left}px`, width: `${width}px`, height: "20px" }}>
        {/* Underline */}
        <div className="absolute bottom-0 left-0 right-0 h-[0.5px] bg-[#5A5A5A]" />
        
        {/* Label */}
        <div 
            className="absolute left-0 whitespace-nowrap"
            style={{ 
                bottom: "2px", 
                fontFamily: "Alexandria, sans-serif", 
                fontWeight: 500, 
                fontSize: "10px", 
                color: "#3A3A3A" 
            }}
        >
            {label}
        </div>

        {/* Value */}
        <div 
            className="absolute overflow-hidden whitespace-nowrap"
            style={{ 
                bottom: "2px", 
                left: label.includes(":") ? `${label.length * 6}px` : "80px", 
                right: "0",
                fontFamily: "Alexandria, sans-serif", 
                fontWeight: 400, 
                fontSize: "11px", 
                color: "#2E2E2E",
                paddingLeft: "4px"
            }}
        >
            {valueOrDash(value)}
        </div>
    </div>
);

/* ─── Section divider ────────────────────────────────────────────────── */
const Div = ({ top, label }: { top: number; label: string }) => (
    <div className="absolute inset-x-[25px]" style={{ top: `${top}px` }}>
        <div className="w-full h-[1px] bg-gradient-to-r from-[#0A024B] to-transparent" />
        <div
            style={{
                marginTop: "12px",
                fontFamily: "Alexandria, sans-serif",
                fontWeight: 700,
                fontSize: "10px",
                color: "#0A024B",
            }}
        >
            {label}
        </div>
    </div>
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
            <div className="absolute text-white" style={{ top: "18px", left: "98px", fontFamily: "Alexandria, sans-serif", fontWeight: 700, fontSize: "13px", lineHeight: "16px" }}>
                SKILL GRACE SCHOOL SYSTEM
            </div>
            <div className="absolute" style={{ top: "37px", left: "98px", fontFamily: "Alexandria, sans-serif", fontWeight: 300, fontSize: "7px", lineHeight: "9px", color: "#B0C4E8" }}>
                Project of YouTube channel &quot;Student ki Dunya&quot;
            </div>
            <div className="absolute" style={{ top: "49px", left: "98px", fontFamily: "Alexandria, sans-serif", fontWeight: 300, fontSize: "7px", lineHeight: "9px", color: "#B0C4E8" }}>
                03436730055 | 03710725593 | 03066534855 &nbsp;|&nbsp; 57.5L Besty C-plot Division Sahiwal
            </div>
            <div className="absolute flex items-center justify-center rounded overflow-hidden bg-white" style={{ top: "12px", left: "16px", width: "66px", height: "64px" }}>
                <img src="/logo.jpg" alt="School logo" className="w-full h-full object-contain" />
            </div>
            {showTitle && (
                <div className="absolute rounded-sm" style={{ bottom: "10px", right: "150px", fontFamily: "Alexandria, sans-serif", fontWeight: 700, fontSize: "10px", letterSpacing: "0.08em", color: "#0A024B", background: "white", padding: "3px 10px" }}>
                    TEACHER HIRING FORM
                </div>
            )}
        </div>
    );
}

export function TeacherPrintPreview({ data, className = "" }: { data: TeacherPrintData; className?: string }) {
    return (
        <div className={`teacher-print-root text-black bg-white ${alexandria.className} ${className}`}>
            {/* ══════ PAGE 1 ══════ */}
            <div className="teacher-print-page relative mx-auto bg-white">
                <div className="teacher-print-canvas relative w-[595px] h-[842px] overflow-hidden bg-white">
                    <PageHeader showTitle />

                    {/* ── Personal Information ── */}
                    <Div top={108} label="Personal Information:" />
                    <F label="First Name:" value={data.firstName} top={148} left={25} width={246} />
                    <F label="Last Name:" value={data.lastName} top={148} left={312} width={256} />
                    
                    <F label="Gender:" value={data.gender} top={184} left={25} width={245} />
                    <F label="Date of Birth:" value={data.dob} top={184} left={312} width={261} />
                    
                    <F label="CNIC:" value={data.cnic} top={220} left={25} width={245} />
                    <F label="Mobile No. 1:" value={data.mobileNo} top={220} left={312} width={261} />
                    
                    <F label="Mobile No. 2:" value={data.emergencyContact} top={256} left={25} width={245} />
                    <F label="Marital Status:" value={data.maritalStatus} top={256} left={312} width={261} />
                    
                    <F label="Address:" value={data.address} top={292} left={25} width={546} />

                    {/* ── Qualification & Experience ── */}
                    <Div top={326} label="Qualification & Experience:" />
                    <F label="Qualification:" value={data.degree} top={366} left={25} width={246} />
                    <F label="Major Subjects:" value={data.majorSubject} top={366} left={312} width={256} />
                    
                    <F label="Institute:" value={data.institute} top={402} left={25} width={246} />
                    <F label="Year of Completion:" value={data.completionYear} top={402} left={312} width={256} />
                    
                    <F label="Grade/CGPA:" value={data.cgpa} top={438} left={25} width={245} />
                    <F label="School Name:" value={data.lastInstitute} top={438} left={312} width={261} />
                    
                    <F label="Designation:" value={data.lastDesignation} top={474} left={25} width={245} />
                    <F label="Subjects Taught:" value={data.subjectsTaught} top={474} left={312} width={261} />
                    
                    <F label="Class Levels:" value={data.classLevels} top={510} left={25} width={245} />
                    <F label="Starting Date:" value={data.jobStartDate} top={510} left={312} width={261} />
                    
                    <F label="Ending Date:" value={data.jobEndDate} top={546} left={25} width={245} />
                    <F label="Leaving Reason:" value={data.reasonLeaving} top={546} left={312} width={261} />

                    {/* ── Enrollment ── */}
                    <Div top={580} label="Enrollment:" />
                    <F label="Joining Date:" value={data.joiningDate} top={620} left={25} width={246} />
                    <F label="Subjects Assigned:" value={data.subjectsAssigned} top={620} left={312} width={256} />
                    
                    <F label="Assigned Class:" value={data.assignedClass} top={656} left={25} width={245} />
                    <F label="Assigned Section:" value={data.assignedSection} top={656} left={312} width={261} />
                    
                    <F label="School In Time:" value={data.schoolInTime} top={692} left={25} width={245} />
                    <F label="School Out Time:" value={data.schoolOutTime} top={692} left={312} width={261} />

                    {/* ── Signature Lines ── */}
                    <div className="absolute w-[180px] border-b border-black" style={{ top: "790px", left: "40px" }} />
                    <div className="absolute text-center" style={{ top: "795px", left: "40px", width: "180px", fontFamily: "Alexandria, sans-serif", fontWeight: 500, fontSize: "9px", color: "#3A3A3A" }}>
                        Teacher Signature
                    </div>

                    <div className="absolute w-[180px] border-b border-black" style={{ top: "790px", left: "375px" }} />
                    <div className="absolute text-center" style={{ top: "795px", left: "375px", width: "180px", fontFamily: "Alexandria, sans-serif", fontWeight: 500, fontSize: "9px", color: "#3A3A3A" }}>
                        Principal Signature
                    </div>

                    <div className="absolute text-center" style={{ top: "710px", left: "375px", width: "180px", fontFamily: "'Bastliga', cursive", fontWeight: 400, fontSize: "40px", color: "#0A024B" }}>
                        Mehboob Ilahi
                    </div>
                </div>
            </div>
        </div>
    );
}
