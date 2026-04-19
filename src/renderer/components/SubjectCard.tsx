import React from 'react';
import { motion } from 'framer-motion';
import type { Subject } from '@/shared/types';
import type { CalculationResult } from '@/renderer/utils/calculationEngine';
import { cn, getToneClasses } from '@/renderer/utils/ui';

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
    const tone = getToneClasses(subject.status);
    const missed = subject.total_classes - subject.attended_classes;

    return (
        <motion.div
            layout
            className="panel group relative cursor-pointer overflow-hidden p-5 transition-transform hover:-translate-y-0.5"
            onClick={() => onClick(subject.id)}
        >
            <div className="mb-5 flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h3 className="truncate text-lg font-bold">{subject.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {subject.attended_classes} attended of {subject.total_classes}
                    </p>
                </div>
                <span className={cn("rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide ring-1", tone.soft)}>
                    {subject.status}
                </span>
            </div>

            <div className="mb-5">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <p className={cn("text-4xl font-bold tracking-tight", tone.text)}>{subject.currentPercent}%</p>
                        <p className="mt-1 text-sm text-muted-foreground">Goal {subject.min_required_percent}%</p>
                    </div>
                    <div className="rounded-lg bg-muted px-3 py-2 text-right">
                        <p className="text-xs text-muted-foreground">Missed</p>
                        <p className="text-lg font-bold">{Math.max(0, missed)}</p>
                    </div>
                </div>

                <p className="mt-4 text-sm font-medium text-foreground">
                    {subject.status === 'safe'
                        ? `You can miss ${Math.max(0, subject.canSkip)} more classes.`
                        : `Attend the next ${subject.classesToRecover} classes to recover.`}
                </p>
            </div>

            <button
                className="btn btn-secondary mb-3 w-full"
                onClick={(e) => {
                    e.stopPropagation();
                    onCanSkip?.(subject.id);
                }}
            >
                Can I skip today?
            </button>

            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                    className="flex-1 rounded-md bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-100 dark:bg-emerald-500/12 dark:text-emerald-200 dark:hover:bg-emerald-500/20"
                    onClick={() => onQuickAttend(subject.id)}
                >
                    Present
                </button>
                <button
                    className="flex-1 rounded-md bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 transition-colors hover:bg-rose-100 dark:bg-rose-500/12 dark:text-rose-200 dark:hover:bg-rose-500/20"
                    onClick={() => onQuickMiss(subject.id)}
                >
                    Missed
                </button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden bg-muted">
                <motion.div
                    className={cn("h-full", tone.bar)}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(subject.currentPercent, 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
            </div>
        </motion.div>
    );
};
