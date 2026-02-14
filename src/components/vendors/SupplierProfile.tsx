"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Phone, MapPin, Briefcase, CreditCard, Wallet, Plus, MoreHorizontal, Edit, CheckCircle, Clock } from 'lucide-react';
import { NewPurchaseModal } from './NewPurchaseModal';

// --- SEPARATE SECTION COMPONENT ---
const Section = ({ title, children, delay }: { title: string, children: React.ReactNode, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4 }}
        className="bg-white rounded-[20px] p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-default"
    >
        <div className="flex justify-between items-start mb-6">
            <h3 className="text-lg font-black text-[#191919]">{title}</h3>
            <button className="text-gray-300 hover:text-gray-500 transition-colors cursor-pointer">
                <MoreHorizontal size={20} />
            </button>
        </div>
        <div className="space-y-6">
            {children}
        </div>
    </motion.div>
);

// --- ROW ITEM COMPONENT ---
const InfoItem = ({ label, value, icon: Icon }: { label: string, value: string | number | undefined, icon?: any }) => (
    <div className="flex flex-col gap-1 group cursor-pointer">
        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 group-hover:text-[#B50104] transition-colors">
            {Icon && <Icon size={12} />} {label}
        </label>
        <p className="text-sm font-bold text-[#191919] truncate border-b border-transparent group-hover:border-gray-100 pb-1 transition-all">
            {value || '-'}
        </p>
    </div>
);

export const SupplierProfile = ({ supplier, onBack, onEdit }: { supplier: any, onBack: () => void, onEdit: () => void }) => {
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [purchases, setPurchases] = useState<any[]>([]);

    // Fetch Purchases
    const fetchPurchases = async () => {
        try {
            const res = await fetch(`/api/vendors/purchase?vendorId=${supplier._id}`);
            const data = await res.json();
            if (data.success) {
                setPurchases(data.data);
            }
        } catch (error) { console.error("Failed to load purchases"); }
    };

    useEffect(() => {
        if (supplier._id) fetchPurchases();
    }, [supplier._id]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="space-y-8 font-['Montserrat'] pb-12"
        >
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 sticky top-0 z-40 backdrop-blur-xl bg-white/90">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#B50104] hover:text-white transition-all shadow-sm hover:shadow-red-200 active:scale-95 cursor-pointer"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-[#191919] tracking-tight">Supplier Profile</h1>
                        <p className="text-xs font-bold text-gray-400 tracking-wide uppercase">Manage supplier details & history</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={onEdit}
                        className="px-6 h-[45px] bg-white border border-gray-200 text-[#191919] font-bold rounded-xl hover:bg-gray-50 flex items-center gap-2 transition-all active:scale-95 cursor-pointer shadow-sm"
                    >
                        <Edit size={18} /> Edit Profile
                    </button>
                    <button
                        onClick={() => setShowPurchaseModal(true)}
                        className="px-6 h-[45px] bg-[#B50104] text-white font-bold rounded-xl shadow-lg shadow-red-200 hover:bg-[#900000] flex items-center gap-2 transition-all active:scale-95 cursor-pointer">
                        <Plus size={18} /> New Purchase
                    </button>
                </div>
            </div>

            {/* MODALS */}
            {showPurchaseModal && (
                <NewPurchaseModal
                    vendorId={supplier._id}
                    onClose={() => setShowPurchaseModal(false)}
                    onSuccess={() => {
                        setShowPurchaseModal(false);
                        // Ideally trigger a refresh here. Since we are in a parent component, 
                        // we might need to rely on the parent to refresh or just reload for now
                        window.location.reload();
                    }}
                />
            )}

            {/* HERO BANNER */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[30px] p-8 md:p-12 shadow-md border border-gray-100 relative overflow-hidden group cursor-default"
            >
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-red-50 rounded-full blur-[80px] opacity-60 -z-10 group-hover:scale-110 transition-transform duration-700" />

                <h2 className="text-4xl md:text-5xl font-black text-[#191919] mb-2 tracking-tight">{supplier.name}</h2>
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-500 uppercase tracking-wider">
                        ID: {supplier._id?.slice(-6).toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${supplier.outstandingAmount > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                        {supplier.outstandingAmount > 0 ? `Outstanding: ${supplier.outstandingAmount.toLocaleString()}` : 'Clear Balance'}
                    </span>
                </div>
            </motion.div>

            {/* DETAILS GRID */}
            <div className="space-y-6">

                {/* 1. Basic Info */}
                <Section title="Basic Information" delay={0.1}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <InfoItem label="Supplier Name" value={supplier.name} icon={User} />
                        <InfoItem label="Supplier Type" value={supplier.type} icon={Briefcase} />
                        <InfoItem label="Contact No." value={supplier.contactNo} icon={Phone} />
                    </div>
                </Section>

                {/* 2. Contact Info */}
                <Section title="Contact Information" delay={0.2}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <InfoItem label="Contact Person" value={supplier.contactPerson} icon={User} />
                        <InfoItem label="Mobile No." value={supplier.mobileNo} icon={Phone} />
                        <InfoItem label="Emergency Contact No." value={supplier.emergencyContactNo || supplier.emergencyContact} icon={Phone} />
                    </div>
                    <div className="mt-8 pt-6 border-t border-gray-50">
                        <InfoItem label="Address" value={supplier.address} icon={MapPin} />
                    </div>
                </Section>

                {/* 3. Business Details */}
                <Section title="Business Details" delay={0.3}>
                    <div className="grid grid-cols-1 gap-8">
                        <InfoItem label="Items Supply" value={supplier.itemsSupply} icon={Briefcase} />
                    </div>
                </Section>

                {/* 4. Payment Information */}
                <Section title="Payment Information" delay={0.4}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <InfoItem label="Bank/Wallet Name" value={supplier.bankName} icon={Wallet} />
                        <InfoItem label="Account Number" value={supplier.accountNo} icon={CreditCard} />
                        <InfoItem label="Account Title" value={supplier.accountTitle} icon={User} />
                    </div>
                </Section>

                {/* 5. Purchase History */}
                <Section title="Purchase History" delay={0.5}>
                    <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                        <div className="grid grid-cols-6 gap-4 p-4 border-b border-gray-200 bg-gray-100/50">
                            {['Date', 'Items', 'Total', 'Paid', 'Balance', 'Status'].map((h, i) => (
                                <div key={i} className={`text-[10px] font-black text-gray-500 uppercase tracking-widest ${i > 1 ? 'text-right' : ''}`}>
                                    {h}
                                </div>
                            ))}
                        </div>

                        {purchases.length > 0 ? (
                            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                {purchases.map((p: any, i: number) => (
                                    <div key={i} className="grid grid-cols-6 gap-4 p-4 border-b border-gray-100 hover:bg-white transition-colors">
                                        <div className="text-xs font-bold text-gray-600 flex items-center gap-2">
                                            <Clock size={12} className="text-gray-400" /> {p.date}
                                        </div>
                                        <div className="text-xs font-bold text-[#191919] truncate">
                                            {p.items?.length || 0} Items ({p.items?.[0]?.description}...)
                                        </div>
                                        <div className="text-xs font-black text-gray-600 text-right">
                                            {p.totalAmount?.toLocaleString()}
                                        </div>
                                        <div className="text-xs font-black text-green-600 text-right">
                                            {p.paidAmount?.toLocaleString()}
                                        </div>
                                        <div className="text-xs font-black text-red-600 text-right">
                                            {p.balance?.toLocaleString()}
                                        </div>
                                        <div className="flex justify-end">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${p.balance > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                                {p.balance > 0 ? 'Pending' : 'Cleared'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-400 text-xs font-bold uppercase tracking-wider animate-pulse">
                                No recent purchases found
                            </div>
                        )}
                    </div>
                </Section>

            </div>
        </motion.div >
    );
};
