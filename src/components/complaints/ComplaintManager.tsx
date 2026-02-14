"use client";
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ComplaintList } from './ComplaintList';
import { ComplaintForm } from './ComplaintForm';

export const ComplaintManager = ({ mode = 'admin' }: { mode?: 'admin' | 'teacher' }) => {
  const [view, setView] = useState<'list' | 'form'>(mode === 'teacher' ? 'form' : 'list');

  return (
    <AnimatePresence mode="wait">
      {view === 'list' && mode === 'admin' ? (
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
          {/* Back button logic: Only show if mode is ADMIN */}
          <div className="mb-4">
            {mode === 'admin' && (
              <button
                onClick={() => setView('list')}
                className="text-gray-500 hover:text-[#B70003] font-bold text-sm flex items-center gap-2 mb-4"
              >
                ← Back to List
              </button>
            )}
            {/* Consistently pass onSuccess handler, but for teacher it might just reset form or show toast */}
            <ComplaintForm onSuccess={() => mode === 'admin' ? setView('list') : window.location.reload()} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};