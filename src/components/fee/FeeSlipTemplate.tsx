import React from 'react';

interface FeeSlipProps {
    data: {
        receiptNo: string;
        studentName: string;
        parentName: string;
        month: string;
        totalFee: string;
        paidAmount: string;
        remainingAmount: string;
        remarks: string;
    };
}

export const FeeSlipTemplate = ({ data }: FeeSlipProps) => {
    // Helper for rendering fields
    const Field = ({ label, value, top, left, width }: { label: string, value: string, top: string, left: string, width: string }) => (
        <div className="absolute flex flex-col justify-end" style={{ top, left, width, height: '10px' }}>
            <div className="flex items-end w-full border-b border-[#3A3A3A] pb-[1px]">
                <span className="font-['Alexandria'] font-normal text-[8px] text-[#3A3A3A] mr-1 whitespace-nowrap">{label}</span>
                <span className="font-['Alexandria'] font-bold text-[8px] text-black flex-1 text-center truncate">{value}</span>
            </div>
        </div>
    );

    return (
        <div className="hidden print:block font-['Alexandria'] bg-white text-black w-[298px] h-[421px] relative overflow-hidden mx-auto print:mx-0">
            {/* Fee Slip Container - Position relative to page (e.g., top-left) handled by wrapper */}

            {/* Paid Stamp */}
            <div className="absolute w-[266px] h-[266px] left-[calc(50%-266px/2)] top-[calc(50%-266px/2+20.5px)] opacity-20 z-0 flex items-center justify-center pointer-events-none">
                <div className="border-4 border-blue-800 rounded-lg p-4 rotate-[-15deg]">
                    <span className="text-6xl font-black text-blue-800 uppercase opacity-50">PAID</span>
                </div>
            </div>

            {/* Logo Placeholder */}
            <div className="absolute w-[44px] h-[40px] left-[calc(50%-44px/2)] top-[15px] z-10 flex items-center justify-center">
                <img src="/logo.jpg" alt="Logo" className="w-[30px] h-[30px] object-contain" />
            </div>

            {/* School Name */}
            <div className="absolute w-[212px] h-[12px] left-[calc(50%-212px/2)] top-[61px] font-['Alexandria'] font-bold text-[10px] leading-[12px] text-[#0A024B] text-center whitespace-nowrap">
                BRILLIANT SCIENCE SCHOOL & ACADEMY
            </div>

            {/* Youtube Project Text */}
            <div className="absolute w-[136px] h-[7px] left-[calc(50%-136px/2)] top-[76px] font-['Alexandria'] font-light text-[6px] leading-[7px] text-[#3A3A3A] text-center">
                Project of YouTube channel "Student ki Dunya"
            </div>

            {/* Separator Line 1 */}
            <div className="absolute w-[234px] h-0 left-[calc(50%-234px/2)] top-[93px] border-[3px] border-[#0A024B]"></div>

            {/* FEE RECEIPT Title */}
            <div className="absolute w-[86px] h-[16px] left-[calc(50%-86px/2-74px)] top-[104px] font-['Alexandria'] font-bold text-[13px] leading-[16px] text-[#0A024B]">
                FEE RECEIPT
            </div>

            {/* Receipt No */}
            <div className="absolute w-[90px] h-[10px] left-[calc(50%-90px/2+72px)] top-[107px] flex items-end border-b border-[#3A3A3A]">
                <span className="font-['Alexandria'] font-light text-[8px] leading-[10px] text-[#3A3A3A] mr-1">Receipt no.:</span>
                <span className="font-['Alexandria'] font-bold text-[8px] text-black flex-1 text-center">{data.receiptNo}</span>
            </div>

            {/* --- FIELDS --- */}

            <Field label="Student(s) Name:" value={data.studentName} top="150px" left="calc(50% - 214px/2 - 3px)" width="214px" />

            <Field label="Parents Name:" value={data.parentName} top="177px" left="calc(50% - 213px/2 - 3.5px)" width="213px" />

            <Field label="For Month:" value={data.month} top="204px" left="calc(50% - 216px/2 - 2px)" width="216px" />

            <Field label="Total Fee:" value={data.totalFee} top="231px" left="calc(50% - 214px/2 - 3px)" width="214px" />

            <Field label="Paid Amount:" value={data.paidAmount} top="258px" left="calc(50% - 218px/2 - 1px)" width="218px" />

            <Field label="Remaining Amount:" value={data.remainingAmount} top="285px" left="calc(50% - 217px/2 - 1.5px)" width="217px" />

            <Field label="Remarks:" value={data.remarks} top="312px" left="calc(50% - 219px/2 - 0.5px)" width="219px" />

            {/* Separator Line 2 */}
            <div className="absolute w-[234px] h-0 left-[calc(50%-234px/2)] top-[363px] border-[3px] border-[#0A024B]"></div>

            {/* THANK YOU */}
            <div className="absolute w-[88px] h-[16px] left-[calc(50%-88px/2)] top-[382px] font-['Alexandria'] font-bold text-[13px] leading-[16px] text-[#0A024B] text-center">
                THANK YOU !
            </div>

        </div>
    );
};
