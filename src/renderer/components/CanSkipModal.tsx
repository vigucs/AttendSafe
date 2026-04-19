import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Subject } from '@/shared/types';
import type { CalculationResult } from '@/renderer/utils/calculationEngine';
import { cn } from '@/renderer/utils/ui';

interface CanSkipModalProps {
    isOpen: boolean;
    onClose: () => void;
    subject: (Subject & CalculationResult) | null;
}

export const CanSkipModal: React.FC<CanSkipModalProps> = ({ isOpen, onClose, subject }) => {
    if (!subject) return null;

    const canSkip = subject.canSkip;
    const isSafe = canSkip > 0;

    const totalIfMissed = subject.total_classes + 1;
    const droppedPercent = ((subject.attended_classes / totalIfMissed) * 100).toFixed(2);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" onClick={onClose}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="panel w-full max-w-sm overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={cn('p-6 text-center', isSafe ? 'bg-emerald-50 dark:bg-emerald-500/10' : 'bg-rose-50 dark:bg-rose-500/10')}>
                            <h2 className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">Can I skip today?</h2>
                            <h3 className="mb-6 text-2xl font-bold">{subject.name}</h3>

                            <div className="relative inline-block">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring" }}
                                    className={cn(
                                        'mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-lg text-3xl font-bold shadow-soft',
                                        isSafe ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                                    )}
                                >
                                    {isSafe ? 'YES' : 'NO'}
                                </motion.div>
                            </div>

                            <div className="space-y-2">
                                {isSafe ? (
                                    <>
                                        <p className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">You can skip</p>
                                        <p className="text-3xl font-bold">{canSkip} more</p>
                                        <p className="text-sm text-muted-foreground">classes before dropping below {subject.min_required_percent}%</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-lg font-semibold text-rose-700 dark:text-rose-300">Attend this one</p>
                                        <p className="text-sm">Skipping will drop you to</p>
                                        <p className="my-1 text-3xl font-bold text-rose-700 dark:text-rose-300">{droppedPercent}%</p>
                                        <p className="text-sm text-muted-foreground">Minimum required: {subject.min_required_percent}%</p>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-center border-t border-border bg-card p-4">
                            <button
                                onClick={onClose}
                                className="btn btn-secondary"
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
