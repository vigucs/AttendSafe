import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/renderer/store/useAppStore';
import { simulateFuture } from '@/renderer/utils/calculationEngine';
import { AppShell } from '@/renderer/components/AppShell';
import { cn, getToneClasses } from '@/renderer/utils/ui';

interface SubjectDetailProps {
    theme: 'light' | 'dark';
    onToggleTheme: () => void;
}

export const SubjectDetail: React.FC<SubjectDetailProps> = ({ theme, onToggleTheme }) => {
    const { subjects, selectedSubjectId, setView, updateAttendance } = useAppStore();
    const subject = subjects.find(s => s.id === selectedSubjectId);

    // Future Simulator State
    const [attendNext, setAttendNext] = useState(0);
    const [missNext, setMissNext] = useState(0);
    const [predictedPercent, setPredictedPercent] = useState(0);

    useEffect(() => {
        if (subject) {
            setPredictedPercent(subject.currentPercent);
        }
    }, [subject]);

    useEffect(() => {
        if (subject) {
            const pred = simulateFuture(
                subject.attended_classes,
                subject.total_classes,
                attendNext,
                missNext
            );
            setPredictedPercent(pred);
        }
    }, [attendNext, missNext, subject]);

    if (!subject) {
        return (
            <AppShell title="Subject" theme={theme} onToggleTheme={onToggleTheme} onBack={() => setView('dashboard')}>
                <div className="panel p-8 text-center">
                    <h2 className="text-xl font-bold">Subject not found</h2>
                    <p className="mt-2 text-muted-foreground">Go back and choose a saved subject.</p>
                    <button onClick={() => setView('dashboard')} className="btn btn-primary mt-5">Back to Today</button>
                </div>
            </AppShell>
        );
    }

    const tone = getToneClasses(subject.status);
    const missed = subject.total_classes - subject.attended_classes;

    return (
        <AppShell
            title={subject.name}
            eyebrow="Subject detail"
            theme={theme}
            onToggleTheme={onToggleTheme}
            onBack={() => setView('dashboard')}
        >
            <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.35 }}
            >
                <section className="panel overflow-hidden p-6">
                    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div>
                            <span className={cn("rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide ring-1", tone.soft)}>
                                {subject.status}
                            </span>
                            <h2 className="mt-4 text-4xl font-bold tracking-tight">{subject.name}</h2>
                            <p className="mt-2 text-muted-foreground">Required attendance is {subject.min_required_percent}%.</p>
                        </div>
                        <div className="md:text-right">
                            <p className={cn("text-6xl font-bold tracking-tight", tone.text)}>{subject.currentPercent}%</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {subject.attended_classes} attended, {Math.max(0, missed)} missed
                            </p>
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="panel p-6">
                        <h3 className="text-lg font-bold">Class count</h3>
                        <div className="mt-5 space-y-3">
                            {[
                                ['Total classes', subject.total_classes],
                                ['Attended', subject.attended_classes],
                                ['Missed', Math.max(0, missed)],
                                ['Semester estimate', subject.semester_total_classes || 'Not set'],
                            ].map(([label, value]) => (
                                <div className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0" key={label}>
                                    <span className="text-sm text-muted-foreground">{label}</span>
                                    <span className="font-bold">{value}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-5 rounded-lg bg-muted p-4 text-sm">
                            {subject.status === 'safe'
                                ? `You can miss ${subject.canSkip} more classes and stay above your goal.`
                                : `Attend the next ${subject.classesToRecover} classes to recover.`}
                        </div>
                    </div>

                    <div className="panel p-6">
                        <h3 className="text-lg font-bold">Future simulator</h3>

                    <div className="space-y-6">
                        <div>
                            <label className="mb-2 flex justify-between text-sm">
                                <span>If I attend next:</span>
                                <span className="font-bold">{attendNext}</span>
                            </label>
                            <input
                                type="range"
                                min="0" max="20"
                                value={attendNext}
                                onChange={(e) => setAttendNext(parseInt(e.target.value))}
                                className="w-full accent-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 flex justify-between text-sm">
                                <span>If I miss next:</span>
                                <span className="font-bold">{missNext}</span>
                            </label>
                            <input
                                type="range"
                                min="0" max="20"
                                value={missNext}
                                onChange={(e) => setMissNext(parseInt(e.target.value))}
                                className="w-full accent-rose-500"
                            />
                        </div>

                        <div className="rounded-lg bg-muted p-4 text-center">
                            <p className="text-sm mb-1">Predicted Attendance</p>
                            <p className={`text-3xl font-bold ${predictedPercent >= subject.min_required_percent ? 'text-emerald-600 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-300'
                                }`}>
                                {predictedPercent}%
                            </p>
                        </div>
                    </div>
                </div>
                </section>

            <div className="grid gap-3 sm:grid-cols-2">
                <button
                    onClick={() => updateAttendance(subject.id, 'present')}
                    className="rounded-lg bg-emerald-50 px-4 py-4 font-bold text-emerald-700 transition-colors hover:bg-emerald-100 dark:bg-emerald-500/12 dark:text-emerald-200 dark:hover:bg-emerald-500/20"
                >
                    Mark Present Today
                </button>
                <button
                    onClick={() => updateAttendance(subject.id, 'absent')}
                    className="rounded-lg bg-rose-50 px-4 py-4 font-bold text-rose-700 transition-colors hover:bg-rose-100 dark:bg-rose-500/12 dark:text-rose-200 dark:hover:bg-rose-500/20"
                >
                    Mark Absent Today
                </button>
            </div>
            </motion.div>
        </AppShell>
    );
};
