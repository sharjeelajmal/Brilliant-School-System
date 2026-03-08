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
  annualFee: string;
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

/* ─── Field component ──────────────────────────────────────────────── */
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
  left: string;
  width: number;
}) => (
  <div className="absolute" style={{ top: `${top}px`, left, width: `${width}px` }}>
    <div className="flex items-end w-full border-b border-[#5A5A5A] pb-[1px]">
      <span
        className="whitespace-nowrap"
        style={{ fontFamily: "Alexandria, sans-serif", fontWeight: 500, fontSize: "11px", lineHeight: "14px", color: "#3A3A3A" }}
      >
        {label}
      </span>
      <span
        className="flex-1 text-left truncate pl-[3px]"
        style={{ fontFamily: "Alexandria, sans-serif", fontWeight: 400, fontSize: "11px", lineHeight: "14px", color: "#2E2E2E" }}
      >
        {valueOrDash(value)}
      </span>
    </div>
  </div>
);

/* ─── Section divider ──────────────────────────────────────────────── */
const Div = ({ top, label }: { top: number; label: string }) => (
  <>
    <div
      className="absolute left-[25px] right-[25px] h-[1px] bg-gradient-to-r from-[#0A024B] via-[#3B5EA6] to-transparent"
      style={{ top: `${top}px` }}
    />
    <div
      className="absolute"
      style={{
        top: `${top + 14}px`,
        left: "25px",
        fontFamily: "Alexandria, sans-serif",
        fontWeight: 700,
        fontSize: "10px",
        lineHeight: "12px",
        color: "#0A024B",
      }}
    >
      {label}
    </div>
  </>
);

/* ─── Page header ──────────────────────────────────────────────────── */
function PageHeader({ showFormTitle }: { showFormTitle?: boolean }) {
  return (
    <div className="absolute inset-x-0 top-0 h-[88px] overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[#0A024B]" />
      <div className="absolute inset-x-0 top-0 h-[3px] bg-[#1E40AF]" />
      {/* Diagonal cut bottom-right */}
      <div
        className="absolute bottom-0 right-0 w-0 h-0"
        style={{ borderLeft: "140px solid transparent", borderBottom: "88px solid white" }}
      />
      {/* Depth overlay bottom-left */}
      <div
        className="absolute bottom-0 left-0 w-0 h-0"
        style={{ borderRight: "90px solid transparent", borderBottom: "40px solid rgba(30,64,175,0.25)" }}
      />
      {/* Dot grid */}
      <div
        className="absolute"
        style={{
          top: "6px", right: "145px", height: "50px", width: "80px", opacity: 0.2,
          backgroundImage: "radial-gradient(circle, #E0E7FF 1px, transparent 1px)",
          backgroundSize: "8px 8px",
        }}
      />
      {/* Gold accent */}
      <div className="absolute rounded-full" style={{ left: "100px", bottom: "14px", height: "2px", width: "100px", background: "#F59E0B", opacity: 0.8 }} />
      <div className="absolute rounded-full" style={{ top: "12px", left: "90px", height: "6px", width: "6px", background: "#F59E0B", opacity: 0.7 }} />

      {/* School name */}
      <div className="absolute text-white" style={{ top: "18px", left: "98px", fontFamily: "Alexandria, sans-serif", fontWeight: 700, fontSize: "13px", lineHeight: "16px" }}>
        BRILLIANT SCIENCE SCHOOL &amp; ACADEMY
      </div>
      <div className="absolute" style={{ top: "37px", left: "98px", fontFamily: "Alexandria, sans-serif", fontWeight: 300, fontSize: "7px", lineHeight: "9px", color: "#B0C4E8" }}>
        Project of YouTube channel &quot;Student ki Dunya&quot;
      </div>
      <div className="absolute" style={{ top: "49px", left: "98px", fontFamily: "Alexandria, sans-serif", fontWeight: 300, fontSize: "7px", lineHeight: "9px", color: "#B0C4E8" }}>
        +92 322 4525320 &nbsp;|&nbsp; Maryam Park, Attari Saroba, Lahore
      </div>

      {/* Logo */}
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

/* ══════════════════════════════════════════════════════════════════════
   LAYOUT (all in px, no helpers — clear and auditable)

   Page 1 (842px total, 88px header reserved):
   ┌ Personal Info divider  : 108
   │  field rows (×5, gap 36): 150, 186, 222, 258, 294
   ├ Parents divider        : 330
   │  field rows (×6, gap 36): 368, 404, 440, 476, 512, 548
   ├ Enrollment divider     : 584
   │  field row  (×1)       : 622
   └ Fee Structure divider  : 658
      field rows (×2, gap 36): 696, 732

   Page 2 (842px total, 88px header reserved):
   ┌ "Fee (cont.)" label    : 104
   │  field rows (×5, gap 36): 126, 162, 198, 234, 270
   ├ Required Docs divider  : 306
   │  doc list              : 334
   └ Signatures             : 742 / 750
      "Ahsan"               : 666
   ══════════════════════════════════════════════════════════════════════ */

export function AdmissionPrintPreview({ data, className = "" }: { data: AdmissionPrintData; className?: string }) {
  return (
    <div className={`admission-print-root text-black bg-white ${alexandria.className} ${className}`}>

      {/* ══════════ PAGE 1 ══════════ */}
      <div className="admission-print-page relative mx-auto bg-white">
        <div className="admission-print-canvas relative w-[595px] h-[842px] overflow-hidden bg-white">
          <PageHeader showFormTitle />

          {/* ── Personal Information ── */}
          <Div top={108} label="Personal Information:" />
          <F label="First Name:" value={data.firstName} top={150} left="calc(50% - 246px/2 - 149.5px)" width={246} />
          <F label="Last Name:" value={data.lastName} top={150} left="calc(50% - 256px/2 + 142.5px)" width={256} />
          <F label="Gender:" value={data.gender} top={186} left="calc(50% - 245px/2 - 150px)" width={245} />
          <F label="Date of Birth:" value={data.dob} top={186} left="calc(50% - 261px/2 + 145px)" width={261} />
          <F label="Birth Certificate No.:" value={data.studentCnic} top={222} left="calc(50% - 244px/2 - 150.5px)" width={244} />
          <F label="Religion:" value={data.religion || "Islam"} top={222} left="calc(50% - 261px/2 + 145px)" width={261} />
          <F label="Nationality:" value={data.nationality || "Pakistani"} top={258} left="calc(50% - 246px/2 - 149.5px)" width={246} />
          <F label="Previous School Name:" value={data.previousSchool} top={258} left="calc(50% - 258px/2 + 143.5px)" width={258} />
          <F label="Last Class Completed:" value={data.lastClass} top={294} left="calc(50% - 241px/2 - 152px)" width={241} />
          <F label="Reason of Leaving:" value={data.leavingReason} top={294} left="calc(50% - 259px/2 + 144px)" width={259} />

          {/* ── Parents / Guardians ── */}
          <Div top={330} label="Parents / Guardians Information:" />
          <F label="First Name:" value={data.parentFirstName} top={368} left="calc(50% - 246px/2 - 149.5px)" width={246} />
          <F label="Last Name:" value={data.parentLastName} top={368} left="calc(50% - 256px/2 + 142.5px)" width={256} />
          <F label="CNIC:" value={data.parentCnic} top={404} left="calc(50% - 245px/2 - 150px)" width={245} />
          <F label="Mobile No.:" value={data.mobileNo} top={404} left="calc(50% - 262px/2 + 145.5px)" width={262} />
          <F label="Mobile No. 2:" value={data.emergencyContact} top={440} left="calc(50% - 242px/2 - 151.5px)" width={242} />
          <F label="WhatsApp No.:" value={data.whatsappNo} top={440} left="calc(50% - 258px/2 + 143.5px)" width={258} />
          <F label="Address:" value={data.address} top={476} left="calc(50% - 546px/2 + 0.5px)" width={546} />
          <F label="Relation with Student:" value={data.relation} top={512} left="calc(50% - 245px/2 - 150px)" width={245} />
          <F label="Occupation:" value={data.occupation} top={512} left="calc(50% - 261px/2 + 145px)" width={261} />
          <F label="Monthly Salary:" value={data.monthlyIncome} top={548} left="calc(50% - 245px/2 - 150px)" width={245} />
          <F label="Reference:" value={data.reference} top={548} left="calc(50% - 261px/2 + 145px)" width={261} />

          {/* ── Enrollment ── */}
          <Div top={584} label="Enrollment:" />
          <F label="Joining Date:" value={data.joiningDate} top={622} left="calc(50% - 243px/2 - 151px)" width={243} />
          <F
            label="Class & Section:"
            value={`${valueOrDash(data.classJoining)}${data.section ? ` - ${data.section}` : ""}`}
            top={622}
            left="calc(50% - 261px/2 + 145px)"
            width={261}
          />

          {/* ── Fee Structure (Monthly + Annual only) ── */}
          <Div top={658} label="Fee Structure:" />
          <F label="Monthly Fee:" value={data.monthlyFee} top={696} left="calc(50% - 248px/2 - 148.5px)" width={248} />
          <F label="Monthly Fee Date:" value={data.feeDate} top={696} left="calc(50% - 263px/2 + 146px)" width={263} />
          <F label="Annual Fee:" value={data.annualFee} top={732} left="calc(50% - 248px/2 - 148.5px)" width={248} />
          <F label="Admission Fee:" value={data.admissionFee} top={732} left="calc(50% - 259px/2 + 144px)" width={259} />
        </div>
      </div>

      {/* ══════════ PAGE 2 ══════════ */}
      <div className="admission-print-page relative mx-auto bg-white print:break-before-page">
        <div className="admission-print-canvas relative w-[595px] h-[842px] overflow-hidden bg-white">
          <PageHeader />

          {/* Fee continuation label */}
          <div
            className="absolute"
            style={{
              top: "104px", left: "25px",
              fontFamily: "Alexandria, sans-serif", fontWeight: 700,
              fontSize: "10px", lineHeight: "12px", color: "#0A024B",
            }}
          >
            Fee Structure (Continued):
          </div>

          {/* Row 0: Academy + Nazra */}
          <F label="Academy Fee:" value={data.academyFee} top={126} left="calc(50% - 259px/2 - 143px)" width={259} />
          <F label="Nazra Fee:" value={data.nazraFee} top={126} left="calc(50% - 258px/2 + 143.5px)" width={258} />
          {/* Row 1: Uniform + Stationary */}
          <F label="Uniform & Books Charges:" value={data.uniformBooksCharges} top={162} left="calc(50% - 256px/2 - 144.5px)" width={256} />
          <F label="Stationary Charges:" value={data.stationaryCharges} top={162} left="calc(50% - 258px/2 + 143.5px)" width={258} />
          {/* Row 2: Other + Discount */}
          <F label="Other Charges:" value={data.otherCharges} top={198} left="calc(50% - 260px/2 - 142.5px)" width={260} />
          <F label="Discount:" value={data.discount} top={198} left="calc(50% - 259px/2 + 144px)" width={259} />
          {/* Row 3: Late Fee + Total */}
          <F label="Late Fee Fine:" value={data.lateFeeFine} top={234} left="calc(50% - 257px/2 - 144px)" width={257} />
          <F label="Total Amount:" value={data.totalPayable} top={234} left="calc(50% - 260px/2 + 144.5px)" width={260} />
          {/* Row 4: Paid + Remaining */}
          <F label="Paid Amount:" value={data.amountPaying} top={270} left="calc(50% - 258px/2 - 143.5px)" width={258} />
          <F label="Remaining Amount:" value={data.remainingAmount} top={270} left="calc(50% - 262px/2 + 145.5px)" width={262} />

          {/* ── Required Documents ── */}
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

          {/* ── Signature Lines ── */}
          {/* Parents */}
          <div className="absolute w-[195px] border border-black" style={{ top: "742px", left: "40px" }} />
          <div
            className="absolute text-center"
            style={{
              top: "750px", left: "40px", width: "195px",
              fontFamily: "Alexandria, sans-serif", fontWeight: 500,
              fontSize: "10px", lineHeight: "12px", color: "#3A3A3A",
            }}
          >
            Parents/Guardians Signature
          </div>

          {/* Principal */}
          <div className="absolute w-[195px] border border-black" style={{ top: "742px", left: "360px" }} />
          <div
            className="absolute text-center"
            style={{
              top: "750px", left: "360px", width: "195px",
              fontFamily: "Alexandria, sans-serif", fontWeight: 500,
              fontSize: "10px", lineHeight: "12px", color: "#3A3A3A",
            }}
          >
            Principal Signature
          </div>

          {/* "Ahsan" — Bastliga local font, above Principal line */}
          <div
            className="absolute text-center"
            style={{
              top: "666px",
              left: "360px",
              width: "195px",
              fontFamily: "'Bastliga', cursive",
              fontWeight: 400,
              fontSize: "64px",
              lineHeight: "100%",
              letterSpacing: "0",
              color: "#0A024B",
            }}
          >
            Ahsan
          </div>
        </div>
      </div>
    </div>
  );
}
