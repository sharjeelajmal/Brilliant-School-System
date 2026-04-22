"use client";

import { Alexandria } from "next/font/google";

export type AdmissionPrintData = {
  rollNo?: string;
  firstName: string;
  lastName: string;
  gender: string;
  dob: string;
  studentCnic: string;
  religion: string;
  nationality: string;
  previousSchool: string;
  lastClass: string;
  leavingReason: string;
  parentFirstName: string;
  parentLastName: string;
  parentCnic: string;
  mobileNo: string;
  emergencyContact: string;
  whatsappNo: string;
  address: string;
  relation: string;
  occupation: string;
  monthlyIncome: string;
  reference: string;
  joiningDate: string;
  classJoining: string;
  section: string;
  monthlyFee: string;
  feeDate: string;
  transportFee: string;
  admissionFee: string;
  academyFee: string;
  nazraFee: string;
  uniformBooksCharges: string;
  stationaryCharges: string;
  otherCharges: string;
  lateFeeFine: string;
  discount: string;
  totalPayable: string;
  amountPaying: string;
  remainingAmount: string;
};

const alexandria = Alexandria({ subsets: ["latin"], weight: ["300", "500", "700"] });

const valueOrDash = (value?: string) => (value && value.trim() ? value : " ");

/* ─── Field component — Absolute-Only (No Flex, No Calc) ──────────────── */
const F = ({
  label,
  value,
  top,
  left,
  width,
}: {
  label: string;
  value: string;
  top: number;
  left: number;
  width: number;
}) => (
  <div className="absolute" style={{ top: `${top}px`, left: `${left}px`, width: `${width}px`, height: "20px" }}>
    {/* Underline - Dedicated div for stability */}
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

    {/* Value - Offset by typical label width (approx) */}
    <div 
      className="absolute overflow-hidden whitespace-nowrap"
      style={{ 
        bottom: "2px", 
        left: label.includes(":") ? `${label.length * 5.8}px` : "70px", 
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

/* ─── Section divider ──────────────────────────────────────────────── */
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

/* ─── Page header ──────────────────────────────────────────────────── */
function PageHeader({ showFormTitle }: { showFormTitle?: boolean }) {
  return (
    <div className="absolute inset-x-0 top-0 h-[88px] overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[#0A024B]" />
      <div className="absolute inset-x-0 top-0 h-[3px] bg-[#1E40AF]" />
      <div
        className="absolute bottom-0 right-0 w-0 h-0"
        style={{ borderLeft: "140px solid transparent", borderBottom: "88px solid white" }}
      />
      <div
        className="absolute bottom-0 left-0 w-0 h-0"
        style={{ borderRight: "90px solid transparent", borderBottom: "40px solid rgba(30,64,175,0.25)" }}
      />
      <div
        className="absolute"
        style={{
          top: "6px", right: "145px", height: "50px", width: "80px", opacity: 0.2,
          backgroundImage: "radial-gradient(circle, #E0E7FF 1px, transparent 1px)",
          backgroundSize: "8px 8px",
        }}
      />
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

      {showFormTitle && (
        <div
          className="absolute rounded-sm"
          style={{
            bottom: "10px", right: "150px",
            fontFamily: "Alexandria, sans-serif", fontWeight: 700, fontSize: "10px", lineHeight: "12px",
            letterSpacing: "0.08em", color: "#0A024B",
            background: "white", padding: "3px 10px",
          }}
        >
          ADMISSION FORM
        </div>
      )}
    </div>
  );
}

export function AdmissionPrintPreview({ data, className = "" }: { data: AdmissionPrintData; className?: string }) {
  return (
    <div className={`admission-print-root text-black bg-white ${alexandria.className} ${className}`}>

      {/* ══════════ PAGE 1 ══════════ */}
      <div className="admission-print-page relative mx-auto bg-white">
        <div className="admission-print-canvas relative w-[595px] h-[842px] overflow-hidden bg-white">
          <PageHeader showFormTitle />

          {/* ── Personal Information ── */}
          <Div top={108} label="Personal Information:" />
          <F label="First Name:" value={data.firstName} top={150} left={25} width={246} />
          <F label="Last Name:" value={data.lastName} top={150} left={312} width={256} />
          
          <F label="Gender:" value={data.gender} top={186} left={25} width={245} />
          <F label="Date of Birth:" value={data.dob} top={186} left={312} width={261} />
          
          <F label="Birth Certificate No.:" value={data.studentCnic} top={222} left={25} width={244} />
          <F label="Religion:" value={data.religion || "Islam"} top={222} left={312} width={261} />
          
          <F label="Nationality:" value={data.nationality || "Pakistani"} top={258} left={25} width={246} />
          <F label="Previous School Name:" value={data.previousSchool} top={258} left={312} width={258} />
          
          <F label="Last Class Completed:" value={data.lastClass} top={294} left={25} width={241} />
          <F label="Reason of Leaving:" value={data.leavingReason} top={294} left={312} width={259} />

          {/* ── Parents / Guardians ── */}
          <Div top={330} label="Parents / Guardians Information:" />
          <F label="First Name:" value={data.parentFirstName} top={368} left={25} width={246} />
          <F label="Last Name:" value={data.parentLastName} top={368} left={312} width={256} />
          
          <F label="CNIC:" value={data.parentCnic} top={404} left={25} width={245} />
          <F label="Mobile No.:" value={data.mobileNo} top={404} left={312} width={262} />
          
          <F label="Mobile No. 2:" value={data.emergencyContact} top={440} left={25} width={242} />
          <F label="WhatsApp No.:" value={data.whatsappNo} top={440} left={312} width={258} />
          
          <F label="Address:" value={data.address} top={476} left={25} width={546} />
          
          <F label="Relation with Student:" value={data.relation} top={512} left={25} width={245} />
          <F label="Occupation:" value={data.occupation} top={512} left={312} width={261} />
          
          <F label="Monthly Salary:" value={data.monthlyIncome} top={548} left={25} width={245} />
          <F label="Reference:" value={data.reference} top={548} left={312} width={261} />

          {/* ── Enrollment ── */}
          <Div top={584} label="Enrollment:" />
          <F label="Joining Date:" value={data.joiningDate} top={622} left={25} width={243} />
          <F
            label="Class & Section:"
            value={`${valueOrDash(data.classJoining)}${data.section ? ` - ${data.section}` : ""}`}
            top={622}
            left={312}
            width={261}
          />

          {/* ── Fee Structure (Monthly + Annual only) ── */}
          <Div top={658} label="Fee Structure:" />
          <F label="Monthly Fee:" value={data.monthlyFee} top={696} left={25} width={248} />
          <F label="Monthly Fee Date:" value={data.feeDate} top={696} left={312} width={263} />
          <F label="Transport Fee:" value={data.transportFee} top={732} left={25} width={248} />
          <F label="Admission Fee:" value={data.admissionFee} top={732} left={312} width={259} />
        </div>
      </div>

      {/* ══════════ PAGE 2 ══════════ */}
      <div className="admission-print-page relative mx-auto bg-white print:break-before-page">
        <div className="admission-print-canvas relative w-[595px] h-[842px] overflow-hidden bg-white">
          <PageHeader />

          <div
            className="absolute"
            style={{
              top: "104px", left: "25px",
              fontFamily: "Alexandria, sans-serif", fontWeight: 700,
              fontSize: "10px", color: "#0A024B",
            }}
          >
            Fee Structure (Continued):
          </div>

          <F label="Uniform & Books Fee:" value={data.uniformBooksCharges} top={126} left={25} width={259} />
          <F label="Nazra Fee:" value={data.nazraFee} top={126} left={312} width={258} />
          
          <F label="Stationary Charges:" value={data.stationaryCharges} top={162} left={25} width={256} />
          <F label="Other Charges:" value={data.otherCharges} top={162} left={312} width={258} />
          
          <F label="Discount:" value={data.discount} top={198} left={25} width={260} />
          <F label="Late Fee Fine:" value={data.lateFeeFine} top={198} left={312} width={259} />
          
          <F label="Total Amount:" value={data.totalPayable} top={234} left={25} width={257} />
          <F label="Paid Amount:" value={data.amountPaying} top={234} left={312} width={260} />
          
          <F label="Remaining Amount:" value={data.remainingAmount} top={270} left={25} width={258} />

          <Div top={306} label="Required Documents:" />
          <div
            className="absolute"
            style={{
              top: "334px", left: "30px", width: "400px",
              fontFamily: "Alexandria, sans-serif", fontWeight: 300,
              fontSize: "10px", lineHeight: "22px", color: "#3A3A3A",
            }}
          >
            <p>• 4 passport size pictures with white background in uniform.</p>
            <p>• Copy of Parents / Guardians CNIC.</p>
            <p>• Copy of Birth certificate / B-form / CNIC.</p>
          </div>

          <div className="absolute w-[180px] border-b border-black" style={{ top: "740px", left: "40px" }} />
          <div
            className="absolute text-center"
            style={{
              top: "745px", left: "40px", width: "180px",
              fontFamily: "Alexandria, sans-serif", fontWeight: 500,
              fontSize: "9px", color: "#3A3A3A",
            }}
          >
            Parents/Guardians Signature
          </div>

          <div className="absolute w-[180px] border-b border-black" style={{ top: "740px", left: "375px" }} />
          <div
            className="absolute text-center"
            style={{
              top: "745px", left: "375px", width: "180px",
              fontFamily: "Alexandria, sans-serif", fontWeight: 500,
              fontSize: "9px", color: "#3A3A3A",
            }}
          >
            Principal Signature
          </div>

          <div
            className="absolute text-center"
            style={{
              top: "690px",
              left: "375px",
              width: "180px",
              fontFamily: "'Bastliga', cursive",
              fontWeight: 400,
              fontSize: "40px",
              color: "#0A024B",
            }}
          >
            Mehboob Ilahi
          </div>
        </div>
      </div>
    </div>
  );
}
