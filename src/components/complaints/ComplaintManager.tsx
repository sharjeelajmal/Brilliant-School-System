"use client";
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ComplaintList } from './ComplaintList';
import { ComplaintForm } from './ComplaintForm';

export const ComplaintManager = () => {
  const [view, setView] = useState<'list' | 'form'>('list');

  return (
    <AnimatePresence mode="wait">
      {view === 'list' ? (
        <motion.div 
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
        >
            <ComplaintList onAddNew={() => setView('form')} />
        </motion.div>
      ) : (
        <motion.div 
            key="form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
        >
            {/* Back button logic is inside ComplaintForm now, but we pass handler */}
            <div className="mb-4">
                <button 
                    onClick={() => setView('list')} 
                    className="text-gray-500 hover:text-[#B70003] font-bold text-sm flex items-center gap-2 mb-4"
                >
                    ← Back to List
                </button>
                <ComplaintForm onSuccess={() => setView('list')} />
            </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};