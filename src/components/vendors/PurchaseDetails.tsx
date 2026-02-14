import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Briefcase, FileText, DollarSign, CheckCircle, AlertTriangle } from 'lucide-react';

interface PurchaseDetailsProps {
    purchase: any;
    onClose: () => void;
}

const DetailRow = ({ label, value, icon: Icon, delay }: any) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay }}
        className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100"
    >
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#B50104] shadow-sm">
            <Icon size={18} />
        </div>
        <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
            <p className="text-sm font-bold text-[#191919]">{value}</p>
        </div>
    </motion.div>
);

export const PurchaseDetails = ({ purchase, onClose }: PurchaseDetailsProps) => {
    if (!purchase) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white w-full max-w-4xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* HERO HEADER */}
                <div className="relative h-48 bg-[#B50104] overflow-hidden flex flex-col justify-end p-8">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/20 rounded-full -translate-x-1/3 translate-y-1/3 blur-3xl" />

                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-all backdrop-blur-sm"
                    >
                        <X size={20} />
                    </button>

                    <div className="relative z-10 text-white">
                        <div className="flex items-center gap-3 mb-2 opacity-80">
                            <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                                Purchase ID: #{purchase._id.slice(-6).toUpperCase()}
                            </span>
                            <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md flex items-center gap-1">
                                <Calendar size={10} /> {purchase.date}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter shadow-black drop-shadow-lg">
                            {purchase.vendorId?.name || "Unknown Supplier"}
                        </h1>
                    </div>
                </div>

                {/* CONTENT BODY */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-white">

                    {/* INFO GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <DetailRow label="Supplier Type" value={purchase.vendorId?.type || 'N/A'} icon={Briefcase} delay={0.1} />
                        <DetailRow label="Items Count" value={purchase.items?.length || 0} icon={FileText} delay={0.2} />
                        <DetailRow label="Notes" value={purchase.notes || 'No notes added'} icon={FileText} delay={0.3} />
                    </div>

                    {/* ITEMS TABLE */}
                    <div className="mb-8">
                        <h3 className="text-lg font-black text-[#191919] mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-[#B50104] rounded-full" />
                            Items Purchased
                        </h3>
                        <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">#</th>
                                        <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</th>
                                        <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Qty</th>
                                        <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Rate</th>
                                        <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {purchase.items?.map((item: any, i: number) => (
                                        <motion.tr
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 + (i * 0.05) }}
                                            className="hover:bg-red-50/30 transition-colors"
                                        >
                                            <td className="p-4 text-xs font-bold text-gray-400">{i + 1}</td>
                                            <td className="p-4 text-sm font-bold text-gray-700">{item.description}</td>
                                            <td className="p-4 text-sm font-medium text-gray-600 text-center">{item.quantity}</td>
                                            <td className="p-4 text-sm font-medium text-gray-600 text-center">{item.rate?.toLocaleString()}</td>
                                            <td className="p-4 text-sm font-black text-[#191919] text-right">{item.total?.toLocaleString()}</td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* BILL SUMMARY - CARD STYLE */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-[#191919] text-white rounded-[24px] p-8 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                            <div>
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Total Bill</p>
                                <p className="text-3xl font-black">{purchase.totalAmount?.toLocaleString()} <span className="text-xs font-medium opacity-50">PKR</span></p>
                            </div>

                            <div className="md:border-l md:border-white/10 md:pl-8">
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Paid Amount</p>
                                <p className="text-3xl font-black text-green-400">{purchase.paidAmount?.toLocaleString()} <span className="text-xs font-medium opacity-50 text-white">PKR</span></p>
                            </div>

                            <div className="md:border-l md:border-white/10 md:pl-8">
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Outstanding Balance</p>
                                <div className="flex items-center gap-3">
                                    <p className={`text-3xl font-black ${purchase.balance > 0 ? 'text-[#ff4d4d]' : 'text-gray-400'}`}>
                                        {purchase.balance > 0 ? purchase.balance.toLocaleString() : 'Cleared'}
                                        {purchase.balance > 0 && <span className="text-xs font-medium opacity-50 text-white">PKR</span>}
                                    </p>
                                    {purchase.balance === 0 && <CheckCircle className="text-green-500" size={24} />}
                                    {purchase.balance > 0 && <AlertTriangle className="text-[#ff4d4d]" size={24} />}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </motion.div>
        </div>
    );
};
