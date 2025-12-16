import React from 'react';
import { motion } from 'framer-motion';
import type { Subject } from '@/shared/types';
import type { CalculationResult } from '@/renderer/utils/calculationEngine';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind class merging
export function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

interface SubjectCardProps {
    subject: Subject & CalculationResult;
    onQuickAttend: (id: string) => void;
    onQuickMiss: (id: string) => void;
    onClick: (id: string) => void;
    onCanSkip?: (id: string) => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({
    subject,
    onQuickAttend,
    onQuickMiss,
    onClick,
    onCanSkip
}) => {
    const statusColors = {
        safe: 'text-green-500 bg-green-500/10',
        warning: 'text-yellow-500 bg-yellow-500/10',
        critical: 'text-red-500 bg-red-500/10',
    };

    const statusColor = statusColors[subject.status];

    return (
        <motion.div
            layout
            className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow cursor-pointer relative group"
            onClick={() => onClick(subject.id)}
            whileHover={{ y: -2 }}
        >
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold truncate pr-4">{subject.name}</h3>
                <span className={cn("text-xs px-2 py-1 rounded-full font-medium uppercase tracking-wide", statusColor)}>
                    {subject.status}
                </span>
            </div>

            <div className="mb-4">
                <div className="flex items-baseline gap-2">
                    <span className={cn("text-4xl font-bold",
                        subject.status === 'safe' ? 'text-green-500' :
                            subject.status === 'warning' ? 'text-yellow-500' : 'text-red-500'
                    )}>
                        {subject.currentPercent}%
                    </span>
                    <span className="text-sm text-muted-foreground">
                        / {subject.min_required_percent}% Req
                    </span>
                </div>

                <p className="text-sm text-muted-foreground mt-1">
                    {subject.status === 'safe'
                        ? `Safe to miss: ${Math.max(0, subject.canSkip)} classes`
                        : `Recover: Attend next ${subject.classesToRecover}`}
                </p>
            </div>

            <button
                className="w-full mb-4 px-3 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg shadow-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                onClick={(e) => {
                    e.stopPropagation();
                    onCanSkip?.(subject.id);
                }}
            >
                <span>⚡ Can I Skip Today?</span>
            </button>

            <div className="flex gap-2 opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                <button
                    className="flex-1 px-3 py-1.5 text-xs font-medium bg-green-500/10 text-green-600 rounded hover:bg-green-500/20 transition-colors"
                    onClick={() => onQuickAttend(subject.id)}
                >
                    + Present
                </button>
                <button
                    className="flex-1 px-3 py-1.5 text-xs font-medium bg-red-500/10 text-red-600 rounded hover:bg-red-500/20 transition-colors"
                    onClick={() => onQuickMiss(subject.id)}
                >
                    + Missed
                </button>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted rounded-b-xl overflow-hidden">
                <motion.div
                    className={cn("h-full",
                        subject.status === 'safe' ? 'bg-green-500' :
                            subject.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(subject.currentPercent, 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
            </div>
        </motion.div>
    );
};
