"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Plus,
    Filter,
    Trash2,
    ChevronDown,
    Eye,
    AlertTriangle
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { AddSupplierForm } from "@/components/forms/AddSupplierForm";
import { SupplierProfile } from "./SupplierProfile";

// --- STAT CARD COMPONENT ---
const StatCard = ({
    label,
    value,
    type,
    delay,
}: {
    label: string;
    value: number;
    type: string;
    delay: number;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        className="relative h-[130px] rounded-[16px] overflow-hidden bg-[#B50104] shadow-xl flex flex-col justify-center px-6 group cursor-default"
    >
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-[#C60205] opacity-60 rounded-full group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute right-12 bottom-[-20px] w-20 h-20 bg-[#C60205] opacity-60 rounded-full" />
        <div className="relative z-10 text-white">
            <h3 className="text-4xl font-black tracking-tighter mb-1">
                {String(value).padStart(2, "0")}
            </h3>
            <p className="text-sm font-medium opacity-90 uppercase tracking-widest">
                {label}
            </p>
        </div>
    </motion.div>
);

// --- MODERN DROPDOWN ---
const Dropdown = ({
    label,
    value,
    options,
    onChange,
}: {
    label: string;
    value: string;
    options: string[];
    onChange: (val: string) => void;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="relative w-full md:w-[200px]">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="h-[50px] bg-white border border-gray-200 rounded-xl px-4 flex items-center justify-between cursor-pointer hover:border-[#B50104] transition-colors group"
            >
                <span className={`text-sm font-bold ${value ? 'text-[#191919]' : 'text-gray-400 group-hover:text-[#B50104]'}`}>
                    {value || label}
                </span>
                <ChevronDown size={16} className="text-gray-400 group-hover:text-[#B50104] transition-colors" />
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-[55px] left-0 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden"
                    >
                        {options.map((opt) => (
                            <div
                                key={opt}
                                onClick={() => {
                                    onChange(opt);
                                    setIsOpen(false);
                                }}
                                className="px-4 py-3 text-sm font-medium hover:bg-red-50 cursor-pointer text-gray-600 hover:text-[#B50104] transition-colors"
                            >
                                {opt}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

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
                <h3 className="text-xl font-black text-[#191919] mb-2">Delete Supplier?</h3>
                <p className="text-sm text-gray-500 font-medium mb-6">
                    This action cannot be undone. Are you sure you want to remove this supplier from the system?
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

// --- MAIN COMPONENT ---
export const VendorList = () => {
    const [viewMode, setViewMode] = useState<'list' | 'profile'>('list');
    const [selectedVendor, setSelectedVendor] = useState<any>(null);

    const [vendors, setVendors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [stats, setStats] = useState({
        total: 0,
        stationary: 0,
        furniture: 0,
        other: 0,
    });

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editData, setEditData] = useState<any>(null);

    // Delete State
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ summary: "true" });
            if (typeFilter) params.append("type", typeFilter);
            if (search) params.append("search", search);

            const res = await fetch(`/api/vendors?${params}`);
            const data = await res.json();
            if (data.success) {
                setVendors(data.data);
                if (data.summary) setStats(data.summary);
            }
        } catch (error) {
            toast.error("Failed to load suppliers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [search, typeFilter]);

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/vendors?id=${deleteId}`, { method: "DELETE" });
            const result = await res.json();
            if (result.success) {
                toast.success("Supplier removed successfully");
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

    // --- RENDER ---
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8 font-['Montserrat'] pb-10"
        >
            <Toaster position="top-center" richColors />

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

            {viewMode === 'profile' && selectedVendor ? (
                <SupplierProfile
                    supplier={selectedVendor}
                    onBack={() => {
                        setViewMode('list');
                        setSelectedVendor(null);
                        fetchData(); // Refresh list on back
                    }}
                    onEdit={() => {
                        setEditData(selectedVendor);
                        setIsFormOpen(true);
                    }}
                />
            ) : (
                <>
                    {/* HEADER */}
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                        <div>
                            <motion.h1
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-3xl md:text-4xl font-black text-[#B50104] tracking-tight"
                            >
                                SUPPLIERS
                            </motion.h1>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: 80 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="h-1.5 bg-[#B50104] rounded-full mt-2"
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    setEditData(null);
                                    setIsFormOpen(true);
                                }}
                                className="px-6 h-[48px] bg-[#B50104] text-white font-bold rounded-xl shadow-lg shadow-red-200 hover:bg-[#900000] flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                            >
                                <Plus size={20} /> Add Supplier
                            </button>

                            {/* Search Bar */}
                            <div className="relative w-full lg:w-[350px] group">
                                <Search
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[#B50104] transition-colors"
                                />
                                <input
                                    type="text"
                                    placeholder="Search Supplier or Contact person"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full h-[48px] bg-white border border-gray-200 rounded-xl pl-11 pr-10 text-sm font-bold text-[#191919] outline-none focus:border-[#B50104] focus:shadow-lg focus:shadow-red-500/10 transition-all placeholder:text-gray-300"
                                />
                            </div>
                        </div>
                    </div>

                    {/* STATS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            label="Total Suppliers"
                            value={stats.total}
                            type="total"
                            delay={0}
                        />
                        <StatCard
                            label="Stationary Suppliers"
                            value={stats.stationary}
                            type="stat"
                            delay={0.1}
                        />
                        <StatCard
                            label="Furniture Suppliers"
                            value={stats.furniture}
                            type="furn"
                            delay={0.2}
                        />
                        <StatCard
                            label="Other Suppliers"
                            value={stats.other}
                            type="other"
                            delay={0.3}
                        />
                    </div>

                    {/* FILTERS */}
                    <div className="flex flex-wrap gap-4 bg-white p-4 rounded-[20px] shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 text-gray-400 text-sm font-bold uppercase tracking-wider px-2">
                            <Filter size={16} /> Filters:
                        </div>
                        <Dropdown
                            label="Supplier Type"
                            value={typeFilter}
                            options={["All", "Stationary", "Furniture", "Maintenance", "Other"]}
                            onChange={(v) => setTypeFilter(v === "All" ? "" : v)}
                        />
                    </div>

                    {/* TABLE */}
                    <div className="bg-white rounded-[24px] shadow-xl border border-gray-100 overflow-hidden min-h-[400px]">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-4 py-5 px-6 bg-gray-50 border-b border-gray-100">
                            <div className="col-span-1 text-[#3C3C3C] font-bold text-xs uppercase tracking-wider">Sr.#</div>
                            <div className="col-span-3 text-[#3C3C3C] font-bold text-xs uppercase tracking-wider">Supplier Name</div>
                            <div className="col-span-2 text-[#3C3C3C] font-bold text-xs uppercase tracking-wider">Contact Person</div>
                            <div className="col-span-2 text-[#3C3C3C] font-bold text-xs uppercase tracking-wider">Supplier Type</div>
                            <div className="col-span-2 text-[#3C3C3C] font-bold text-xs uppercase tracking-wider">Contact No.</div>
                            <div className="col-span-2 text-right text-[#3C3C3C] font-bold text-xs uppercase tracking-wider">Actions</div>
                        </div>

                        {/* Table Body */}
                        <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                            {loading ? (
                                <div className="p-20 text-center text-gray-400 font-bold animate-pulse">Loading Suppliers...</div>
                            ) : vendors.length === 0 ? (
                                <div className="p-20 text-center text-gray-400">No suppliers found.</div>
                            ) : (
                                vendors.map((v, i) => (
                                    <motion.div
                                        key={v._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="grid grid-cols-12 gap-4 items-center py-4 px-6 border-b border-gray-50 hover:bg-red-50/30 transition-colors group cursor-default"
                                    >
                                        <div className="col-span-1 font-bold text-gray-400 text-sm">{(i + 1).toString().padStart(2, '0')}</div>
                                        <div className="col-span-3 font-bold text-[#191919] text-sm group-hover:text-[#B50104] transition-colors">{v.name}</div>
                                        <div className="col-span-2 font-medium text-gray-500 text-xs">{v.contactPerson || '-'}</div>
                                        <div className="col-span-2">
                                            <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wide border border-gray-200">
                                                {v.type}
                                            </span>
                                        </div>
                                        <div className="col-span-2 font-mono text-xs font-bold text-gray-500">{v.contactNo || '-'}</div>
                                        <div className="col-span-2 flex items-center justify-end gap-2 text-right">

                                            {/* Action Buttons */}
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => {
                                                        setSelectedVendor(v);
                                                        setViewMode('profile');
                                                    }}
                                                    className="p-2 hover:bg-blue-50 text-blue-500 rounded-lg transition-colors cursor-pointer"
                                                    title="View Profile"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(v._id)}
                                                    className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors cursor-pointer"
                                                    title="Delete Supplier"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* FORM MODAL - FULL SCREEN */}
            <AnimatePresence>
                {isFormOpen && (
                    <AddSupplierForm
                        onClose={() => setIsFormOpen(false)}
                        onSuccess={(updatedVendor: any) => {
                            setIsFormOpen(false);
                            fetchData();
                            // If we are currently viewing this vendor in profile, update the selectedVendor state
                            if (selectedVendor && updatedVendor && updatedVendor._id === selectedVendor._id) {
                                setSelectedVendor(updatedVendor);
                            }
                        }}
                        initialData={editData}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};
