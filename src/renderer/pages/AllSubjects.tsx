import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/renderer/store/useAppStore';
import { SubjectCard } from '@/renderer/components/SubjectCard';
import { AddSubjectModal } from '@/renderer/components/AddSubjectModal';
import { CanSkipModal } from '@/renderer/components/CanSkipModal';
import { AppShell } from '@/renderer/components/AppShell';
import { getAttendanceTone, getToneClasses } from '@/renderer/utils/ui';
import type { Subject } from '@/shared/types';
import type { CalculationResult } from '@/renderer/utils/calculationEngine';

interface AllSubjectsProps {
    theme: 'light' | 'dark';
    onToggleTheme: () => void;
}

export const AllSubjects: React.FC<AllSubjectsProps> = ({ theme, onToggleTheme }) => {
    const { subjects, overallAttendance, fetchSubjects, addSubject, updateAttendance, setView } = useAppStore();
    const [isModalOpen, setModalOpen] = useState(false);
    const [skipModalSubject, setSkipModalSubject] = useState<(Subject & CalculationResult) | null>(null);
    const overallTone = getToneClasses(getAttendanceTone(overallAttendance));

    useEffect(() => {
        fetchSubjects();
    }, [fetchSubjects]);

    const handleAddSubject = (name: string, total: number, attended: number, minReq: number, semesterTotal: number) => {
        addSubject({
            name,
            total_classes: total,
            attended_classes: attended,
            min_required_percent: minReq,
            semester_total_classes: semesterTotal
        });
    };

    const handleSubjectClick = (id: string) => {
        setView('detail', id);
    };

    const handleCanSkipClick = (id: string) => {
        const sub = subjects.find(s => s.id === id);
        if (sub) {
            setSkipModalSubject(sub);
        }
    };

    return (
        <AppShell
            title="Subjects"
            eyebrow="Course list"
            theme={theme}
            onToggleTheme={onToggleTheme}
            action={(
                <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
                    Add Subject
                </button>
            )}
        >
            <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
            >
                <section className="grid gap-4 md:grid-cols-3">
                    <div className="panel p-6 md:col-span-2">
                        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">Overview</p>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight">Track every subject in one place.</h2>
                        <p className="mt-3 max-w-2xl text-muted-foreground">
                            Keep the list current so your dashboard, timetable, and skip guidance stay accurate.
                        </p>
                    </div>
                    <div className="panel p-6">
                        <p className="text-sm font-semibold text-muted-foreground">Overall attendance</p>
                        <p className={`mt-3 text-5xl font-bold ${overallTone.text}`}>
                            {overallAttendance}%
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">{subjects.length} subjects saved</p>
                    </div>
                </section>

            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence>
                    {subjects.map((subject) => (
                        <SubjectCard
                            key={subject.id}
                            subject={subject}
                            onQuickAttend={() => updateAttendance(subject.id, 'present')}
                            onQuickMiss={() => updateAttendance(subject.id, 'absent')}
                            onClick={handleSubjectClick}
                            onCanSkip={handleCanSkipClick}
                        />
                    ))}
                </AnimatePresence>

                <button
                    onClick={() => setModalOpen(true)}
                    className="panel min-h-[220px] border-dashed p-6 text-left text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                    <span className="block text-4xl font-light">+</span>
                    <span className="mt-4 block text-lg font-bold">Add Subject</span>
                    <span className="mt-2 block text-sm">Add class counts, required attendance, and semester estimate.</span>
                </button>
            </section>
            </motion.div>

            <AddSubjectModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onAdd={handleAddSubject}
            />

            <CanSkipModal
                isOpen={!!skipModalSubject}
                onClose={() => setSkipModalSubject(null)}
                subject={skipModalSubject}
            />
        </AppShell>
    );
};
