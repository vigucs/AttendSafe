import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Subject } from '@/shared/types';
import type { CalculationResult } from '@/renderer/utils/calculationEngine';

interface CanSkipModalProps {
    isOpen: boolean;
    onClose: () => void;
    subject: (Subject & CalculationResult) | null;
}

export const CanSkipModal: React.FC<CanSkipModalProps> = ({ isOpen, onClose, subject }) => {
    if (!subject) return null;

    const canSkip = subject.canSkip;
    const isSafe = canSkip > 0;

    // Calculate new percent if missed
    // formula: (attended) / (total + 1) * 100
    const totalIfMissed = subject.total_classes + 1;
    const droppedPercent = ((subject.attended_classes / totalIfMissed) * 100).toFixed(2);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="bg-card text-card-foreground border-2 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={`p-6 text-center ${isSafe ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                            <h2 className="text-sm font-medium uppercase tracking-widest opacity-70 mb-2">Can I skip today?</h2>
                            <h3 className="text-2xl font-bold mb-6">{subject.name}</h3>

                            <div className="relative inline-block">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring" }}
                                    className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-lg
                        ${isSafe ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}
                    `}
                                >
                                    {isSafe ? 'YES' : 'NO'}
                                </motion.div>
                            </div>

                            <div className="space-y-2">
                                {isSafe ? (
                                    <>
                                        <p className="text-lg font-medium text-green-500">You can safely skip</p>
                                        <p className="text-3xl font-bold">{canSkip} more</p>
                                        <p className="text-sm opacity-70">classes before dropping below {subject.min_required_percent}%</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-lg font-medium text-red-500">Do NOT skip!</p>
                                        <p className="text-sm">Skipping will drop you to</p>
                                        <p className="text-3xl font-bold text-red-500 my-1">{droppedPercent}%</p>
                                        <p className="text-sm opacity-70">Minimum required: {subject.min_required_percent}%</p>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="p-4 bg-card border-t flex justify-center">
                            <button
                                onClick={onClose}
                                className="px-8 py-2 rounded-full bg-secondary text-secondary-foreground font-medium hover:opacity-90 transition-opacity"
                            >
                                Got it
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
