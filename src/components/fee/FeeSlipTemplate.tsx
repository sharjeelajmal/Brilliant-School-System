import React from 'react';

export interface FeeSlipData {
    receiptNo: string;
    studentName: string;
    parentName: string;
    month: string;
    totalFee: string;
    paidAmount: string;
    remainingAmount: string;
    remarks: string;
}

interface FeeSlipProps {
    data: FeeSlipData;
}

const Field = ({
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
    <div className="absolute h-[10px]" style={{ top: `${top}px`, left, width: `${width}px` }}>
        <div className="flex items-end w-full h-full border-b border-[#707070] text-[8px] leading-[10px] text-[#3A3A3A] font-['Alexandria',sans-serif]">
            <span className="font-normal mr-1 whitespace-nowrap">{label}</span>
            <span className="font-bold text-black flex-1 text-center truncate">{value}</span>
        </div>
    </div>
);

export const FeeSlipTemplate = ({ data }: FeeSlipProps) => {
    return (
        <div className="hidden print:block fee-slip-print-root">
            <div className="fee-slip-page relative">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="fee-slip-slot">
                        {index === 0 && <div className="fee-slip-card absolute bg-white overflow-hidden">
                            <div className="absolute w-[266px] h-[266px] left-[calc(50%-133px)] top-[calc(50%-112.5px)] opacity-20 z-0 flex items-center justify-center pointer-events-none">
                                <div className="border-[5px] border-[#4651a3] rounded-md px-8 py-2 -rotate-[18deg]">
                                    <span className="text-[80px] leading-[1] font-black tracking-[5px] text-[#4651a3]">PAID</span>
                                </div>
                            </div>

                            <div className="absolute w-[44px] h-[40px] left-[calc(50%-22px)] top-[15px] z-10">
                                <img src="/logo.jpg" alt="School logo" className="w-full h-full object-contain" />
                            </div>

                            <div className="absolute w-[212px] h-[12px] left-[calc(50%-106px)] top-[61px] text-center text-[10px] leading-[12px] font-bold text-[#0A024B] font-['Alexandria',sans-serif]">
                                BRILLIANT SCIENCE SCHOOL & ACADEMY
                            </div>

                            <div className="absolute w-[136px] h-[7px] left-[calc(50%-68px)] top-[76px] text-center text-[6px] leading-[7px] font-light text-[#3A3A3A] font-['Alexandria',sans-serif]">
                                Project of YouTube channel &quot;Student ki Dunya&quot;
                            </div>

                            <div className="absolute w-[234px] left-[calc(50%-117px)] top-[93px] border-[3px] border-[#0A024B]" />
                            <div className="absolute w-[234px] left-[calc(50%-117px)] top-[363px] border-[3px] border-[#0A024B]" />

                            <div className="absolute w-[86px] h-[16px] left-[calc(50%-117px)] top-[104px] text-[13px] leading-[16px] font-bold text-[#0A024B] font-['Alexandria',sans-serif]">
                                FEE RECEIPT
                            </div>

                            <div className="absolute w-[90px] h-[10px] left-[calc(50%-45px+72px)] top-[107px] flex items-end border-b border-[#707070] text-[8px] leading-[10px] text-[#3A3A3A] font-['Alexandria',sans-serif]">
                                <span className="font-light mr-1 whitespace-nowrap">Receipt no.:</span>
                                <span className="text-black font-bold flex-1 text-center truncate">{data.receiptNo}</span>
                            </div>

                            <Field label="Student(s) Name:" value={data.studentName} top={150} left="calc(50% - 214px/2 - 3px)" width={214} />
                            <Field label="Parents Name:" value={data.parentName} top={177} left="calc(50% - 213px/2 - 3.5px)" width={213} />
                            <Field label="For Month:" value={data.month} top={204} left="calc(50% - 216px/2 - 2px)" width={216} />
                            <Field label="Total Fee:" value={data.totalFee} top={231} left="calc(50% - 214px/2 - 3px)" width={214} />
                            <Field label="Paid Amount:" value={data.paidAmount} top={258} left="calc(50% - 218px/2 - 1px)" width={218} />
                            <Field label="Remaining Amount:" value={data.remainingAmount} top={285} left="calc(50% - 217px/2 - 1.5px)" width={217} />
                            <Field label="Remarks:" value={data.remarks} top={312} left="calc(50% - 219px/2 - 0.5px)" width={219} />

                            <div className="absolute w-[88px] h-[16px] left-[calc(50%-44px)] top-[382px] text-center text-[13px] leading-[16px] font-bold text-[#0A024B] font-['Alexandria',sans-serif]">
                                THANK YOU !
                            </div>
                        </div>}
                    </div>
                ))}
            </div>
        </div>
    );
};
