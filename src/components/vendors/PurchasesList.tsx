import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Plus, ChevronDown, CheckCircle, ArrowRight, Eye, Trash2, AlertTriangle } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { NewPurchaseModal } from './NewPurchaseModal';
import { PurchaseDetails } from './PurchaseDetails';

// --- STAT CARD ---
const StatCard = ({ label, value, subtext, delay }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.5 }}
        className="relative h-[140px] rounded-[24px] overflow-hidden bg-[#B50104] shadow-xl flex flex-col justify-center px-8 group cursor-default"
    >
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-[#C60205] opacity-60 rounded-full group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute right-12 bottom-[-20px] w-20 h-20 bg-[#C60205] opacity-60 rounded-full" />
        <div className="relative z-10 text-white">
            <h3 className="text-4xl md:text-5xl font-black tracking-tighter mb-1">{value}</h3>
            <p className="text-xs md:text-sm font-bold opacity-90 uppercase tracking-widest">{label}</p>
            {subtext && <p className="text-[10px] opacity-70 font-medium mt-1">{subtext}</p>}
        </div>
    </motion.div>
);

// --- SEARCH & FILTER BAR ---
const FilterBar = ({ search, setSearch, onAdd }: any) => (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
                type="text"
                placeholder="Search Supplier or Purchase ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-[55px] pl-12 pr-4 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-[#191919] outline-none focus:border-[#B50104] focus:shadow-lg transition-all"
            />
        </div>
        <button
            onClick={onAdd}
            className="h-[55px] px-8 bg-[#B50104] text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-[#900000] hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-red-200 cursor-pointer"
        >
            <Plus size={20} /> Add Purchase
        </button>
    </div>
);

// --- DELETE CONFIRMATION MODAL ---
const DeletePopup = ({ isOpen, onClose, onConfirm, isDeleting }: any) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-[24px] shadow-2xl w-full max-w-sm p-6 text-center font-['Montserrat']"
            >
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4 text-[#B50104]">
                    <AlertTriangle size={32} />
                </div>
                <h3 className="text-xl font-black text-[#191919] mb-2">Delete Purchase?</h3>
                <p className="text-sm text-gray-500 font-medium mb-6">
                    This action cannot be undone. Are you sure you want to remove this purchase record? 
                    The supplier's outstanding balance will be adjusted accordingly.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex-1 py-3 bg-[#B50104] text-white font-bold rounded-xl hover:bg-[#900000] shadow-lg shadow-red-200 transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                    >
                        {isDeleting ? "Deleting..." : "Yes, Delete"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export const PurchasesList = () => {
    const [purchases, setPurchases] = useState<any[]>([]);
    const [stats, setStats] = useState<any>({ totalSpent: 0, paidAmount: 0, remainingAmount: 0, unpaidBills: 0 });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedPurchase, setSelectedPurchase] = useState<any>(null);

    // Delete State
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // FETCH DATA
    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch Stats
            const statsRes = await fetch('/api/vendors/purchase?summary=true');
            const statsData = await statsRes.json();
            if (statsData.success) setStats(statsData.stats);

            // Fetch List
            const listRes = await fetch('/api/vendors/purchase');
            const listData = await listRes.json();
            if (listData.success) setPurchases(listData.data);

        } catch (e) {
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation(); // Prevents opening the details modal
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/vendors/purchase?id=${deleteId}`, { method: "DELETE" });
            const result = await res.json();
            if (result.success) {
                toast.success("Purchase deleted successfully");
                fetchData();
            } else {
                toast.error(result.error || "Delete failed");
            }
        } catch {
            toast.error("Delete failed");
        } finally {
            setIsDeleting(false);
            setDeleteId(null);
        }
    };

    // Filter Logic
    const filteredPurchases = purchases.filter(p =>
        p.vendorId?.name?.toLowerCase().includes(search.toLowerCase()) ||
        p._id.slice(-6).includes(search)
    );

    return (
        <div className="space-y-8 pb-20">
            <Toaster richColors position="top-center" />

            {showModal && (
                <NewPurchaseModal
                    onClose={() => setShowModal(false)}
                    onSuccess={() => { setShowModal(false); fetchData(); }}
                />
            )}

            {/* DELETE POPUP */}
            <AnimatePresence>
                {deleteId && (
                    <DeletePopup
                        isOpen={!!deleteId}
                        onClose={() => setDeleteId(null)}
                        onConfirm={confirmDelete}
                        isDeleting={isDeleting}
                    />
                )}
            </AnimatePresence>

            {/* NEW DETAIL MODAL */}
            <AnimatePresence>
                {selectedPurchase && (
                    <PurchaseDetails
                        purchase={selectedPurchase}
                        onClose={() => setSelectedPurchase(null)}
                    />
                )}
            </AnimatePresence>

            {/* STATS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard label="Amount Spent" value={stats.totalSpent.toLocaleString()} delay={0.1} />
                <StatCard label="Paid Amount" value={stats.paidAmount.toLocaleString()} delay={0.2} />
                <StatCard label="Remaining Amount" value={stats.remainingAmount.toLocaleString()} subtext="Outstanding Dues" delay={0.3} />
                <StatCard label="Unpaid Bills" value={stats.unpaidBills} subtext="Pending Clearances" delay={0.4} />
            </div>

            {/* CONTROLS */}
            <FilterBar search={search} setSearch={setSearch} onAdd={() => setShowModal(true)} />

            {/* TABLE */}
            <div className="bg-white border border-gray-100 rounded-[24px] shadow-sm overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-6 gap-4 p-6 border-b border-gray-100 bg-gray-50/50">
                    {['ID', 'Supplier Name', 'Items', 'Total', 'Paid', 'Outstanding'].map((h, i) => (
                        <div key={i} className={`text-[11px] font-black text-gray-400 uppercase tracking-widest ${i > 2 ? 'text-right' : ''}`}>
                            {h}
                        </div>
                    ))}
                </div>

                {/* Rows */}
                <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                    {filteredPurchases.length > 0 ? (
                        filteredPurchases.map((p, i) => (
                            <motion.div
                                key={p._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => setSelectedPurchase(p)} // CLICK TO OPEN DETAILS
                                className="grid grid-cols-6 gap-4 p-6 border-b border-gray-50 hover:bg-red-50/10 transition-colors group items-center cursor-pointer"
                            >
                                <div className="text-xs font-bold text-gray-500">#{p._id.slice(-6).toUpperCase()}</div>

                                <div>
                                    <div className="text-sm font-bold text-[#191919]">{p.vendorId?.name || 'Unknown Vendor'}</div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase">{p.vendorId?.type || 'N/A'}</div>
                                </div>

                                <div className="text-xs font-bold text-gray-600">
                                    {p.items?.length || 0} Items <span className="text-gray-400">({p.items?.[0]?.description.slice(0, 15)}...)</span>
                                </div>

                                <div className="text-sm font-black text-gray-700 text-right">{p.totalAmount?.toLocaleString()}</div>
                                <div className="text-sm font-black text-green-600 text-right">{p.paidAmount?.toLocaleString()}</div>

                                <div className="flex justify-end items-center gap-4">
                                    <div className={`text-sm font-black text-right ${p.balance > 0 ? 'text-[#B50104]' : 'text-gray-300'}`}>
                                        {p.balance > 0 ? p.balance.toLocaleString() : 'Cleared'}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => handleDeleteClick(e, p._id)}
                                            className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500 hover:bg-[#B50104] hover:text-white transition-all shadow-sm"
                                            title="Delete Purchase"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                        <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#B50104] hover:text-white transition-all">
                                            <ArrowRight size={14} />
                                        </button>
                                    </div>
                                </div>

                            </motion.div>
                        ))
                    ) : (
                        <div className="p-20 text-center flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                                <Filter size={24} />
                            </div>
                            <p className="text-gray-400 font-bold text-sm">No purchases found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
