import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Trash2, Save, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { CustomDropdown } from '@/components/ui/CustomDropdown';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';

export const NewPurchaseModal = ({ vendorId, onClose, onSuccess }: { vendorId?: string, onClose: () => void, onSuccess: () => void }) => {
    const [loading, setLoading] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState(vendorId || '');
    const [vendors, setVendors] = useState<any[]>([]);

    // Fetch Vendors if not provided
    React.useEffect(() => {
        if (!vendorId) {
            fetch('/api/vendors').then(res => res.json()).then(data => {
                if (data.success) setVendors(data.data);
            });
        }
    }, [vendorId]);

    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [items, setItems] = useState([{ description: '', quantity: 1, rate: 0, total: 0 }]);
    const [paidAmount, setPaidAmount] = useState<number>(0);
    const [notes, setNotes] = useState('');

    // Calculations
    const totalAmount = items.reduce((sum, item) => sum + (item.total || 0), 0);
    const balance = totalAmount - paidAmount;

    // Handlers
    const handleItemChange = (index: number, field: string, value: any) => {
        const newItems: any = [...items];
        newItems[index][field] = value;

        // Auto-calculate total
        if (field === 'quantity' || field === 'rate') {
            newItems[index].total = (newItems[index].quantity || 0) * (newItems[index].rate || 0);
        }
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { description: '', quantity: 1, rate: 0, total: 0 }]);
    };

    const removeItem = (index: number) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async () => {
        if (!selectedVendor) return toast.error("Please select a vendor");
        if (items.some(i => !i.description || i.total <= 0)) return toast.error("Please fill all item details correctly");

        setLoading(true);
        try {
            const res = await fetch('/api/vendors/purchase', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    vendorId: selectedVendor,
                    items,
                    totalAmount,
                    paidAmount,
                    date,
                    notes
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Purchase recorded successfully!");
                onSuccess();
            } else {
                toast.error(data.error || "Failed to save purchase");
            }
        } catch (error) {
            toast.error("Network error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white w-full max-w-3xl rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="px-8 py-6 bg-gradient-to-r from-[#B50104] to-[#950002] flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                            <ShoppingCart size={20} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black tracking-tight">New Purchase</h2>
                            <p className="text-xs font-medium opacity-80 uppercase tracking-wider">Record supply transaction</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer">
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">

                    {/* Row 1: Vendor & Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-50">
                        {/* Select Vendor */}
                        {!vendorId && (
                            <CustomDropdown
                                label="Select Vendor"
                                name="vendor"
                                options={vendors.map((v: any) => v.name)}
                                value={vendors.find(v => v._id === selectedVendor)?.name || ''}
                                onChange={(_, val) => {
                                    const v = vendors.find(ven => ven.name === val);
                                    if (v) setSelectedVendor(v._id);
                                }}
                            />
                        )}

                        {/* Date */}
                        <CustomDatePicker
                            label="Purchase Date"
                            name="date"
                            value={date}
                            onChange={(_, val) => setDate(val)}
                        />
                    </div>

                    {/* Row 2: Paying Now */}
                    <div className="relative z-40">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Paying Now (PKR)</label>
                        <input
                            type="number"
                            value={paidAmount}
                            onChange={(e) => setPaidAmount(Number(e.target.value))}
                            className="w-full h-[55px] px-4 bg-gray-50 border border-gray-100 rounded-xl font-bold text-[#191919] outline-none focus:border-[#B50104] transition-colors placeholder:text-gray-300"
                            placeholder="0"
                        />
                    </div>

                    {/* Items */}
                    <div>
                        <div className="flex justify-between items-end mb-4">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Items List</label>
                            <button onClick={addItem} className="text-xs font-bold text-[#B50104] hover:underline flex items-center gap-1 cursor-pointer">
                                <Plus size={14} /> Add Row
                            </button>
                        </div>

                        <div className="space-y-3">
                            {items.map((item, i) => (
                                <div key={i} className="flex gap-3 items-start animate-in fade-in slide-in-from-bottom-2">
                                    <div className="flex-1">
                                        <input
                                            placeholder="Item Description"
                                            value={item.description}
                                            onChange={(e) => handleItemChange(i, 'description', e.target.value)}
                                            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-medium text-sm outline-none focus:border-[#B50104]"
                                        />
                                    </div>
                                    <div className="w-20">
                                        <input
                                            type="number" placeholder="Qty"
                                            value={item.quantity}
                                            onChange={(e) => handleItemChange(i, 'quantity', Number(e.target.value))}
                                            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-medium text-sm outline-none focus:border-[#B50104] text-center"
                                        />
                                    </div>
                                    <div className="w-24">
                                        <input
                                            type="number" placeholder="Rate"
                                            value={item.rate}
                                            onChange={(e) => handleItemChange(i, 'rate', Number(e.target.value))}
                                            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-medium text-sm outline-none focus:border-[#B50104] text-center"
                                        />
                                    </div>
                                    <div className="w-28 pt-3 text-right font-black text-[#191919]">
                                        {item.total.toLocaleString()}
                                    </div>
                                    <button onClick={() => removeItem(i)} className="p-3 text-gray-300 hover:text-[#B50104] transition-colors cursor-pointer">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-gray-50 p-6 rounded-2xl flex flex-col items-end gap-2">
                        <div className="flex justify-between w-full md:w-1/2">
                            <span className="text-sm font-bold text-gray-500">Total Bill</span>
                            <span className="text-lg font-black text-[#191919]">{totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between w-full md:w-1/2">
                            <span className="text-sm font-bold text-gray-500">Paid Amount</span>
                            <span className="text-lg font-bold text-green-600">-{paidAmount.toLocaleString()}</span>
                        </div>
                        <div className="w-full md:w-1/2 h-px bg-gray-200 my-2" />
                        <div className="flex justify-between w-full md:w-1/2">
                            <span className="text-base font-black text-gray-600">Balance</span>
                            <span className="text-2xl font-black text-[#B50104]">{balance.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-6 border-t border-gray-100 flex justify-end">
                        <button
                            disabled={loading}
                            onClick={handleSubmit}
                            className="h-[55px] px-8 bg-[#B50104] text-white rounded-xl font-bold flex items-center gap-2 hover:bg-[#900000] hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save size={20} />
                            {loading ? "Saving..." : "Save Purchase"}
                        </button>
                    </div>

                </div>
            </motion.div>
        </div>
    );
};
