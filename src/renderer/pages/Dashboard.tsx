import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/renderer/store/useAppStore';
import { SubjectCard } from '@/renderer/components/SubjectCard';
import { CanSkipModal } from '@/renderer/components/CanSkipModal';
import { AddSubjectModal } from '@/renderer/components/AddSubjectModal';
import { AppShell } from '@/renderer/components/AppShell';
import { getAttendanceTone, getToneClasses } from '@/renderer/utils/ui';
import type { Subject } from '@/shared/types';
import type { CalculationResult } from '@/renderer/utils/calculationEngine';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface DashboardProps {
    theme: 'light' | 'dark';
    onToggleTheme: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ theme, onToggleTheme }) => {
    const { subjects, overallAttendance, timetable, fetchSubjects, fetchTimetable, addSubject, updateAttendance, setView } = useAppStore();
    const [skipModalSubject, setSkipModalSubject] = useState<(Subject & CalculationResult) | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        fetchSubjects();
        fetchTimetable();
    }, [fetchSubjects, fetchTimetable]);

    const today = DAYS[new Date().getDay()];
    const overallTone = getToneClasses(getAttendanceTone(overallAttendance));

    const todaysSubjects = subjects.filter(subject =>
        timetable && timetable.some(entry => entry.day === today && entry.subject_id === subject.id)
    );

    const handleSubjectClick = (id: string) => {
        setView('detail', id);
    };

    const handleCanSkipClick = (id: string) => {
        const sub = subjects.find(s => s.id === id);
        if (sub) {
            setSkipModalSubject(sub);
        }
    };

    const handleAddSubject = (name: string, total: number, attended: number, minReq: number, semesterTotal: number) => {
        addSubject({
            name,
            total_classes: total,
            attended_classes: attended,
            min_required_percent: minReq,
            semester_total_classes: semesterTotal
        });
    };

    return (
        <AppShell
            title="Today"
            eyebrow="Student planner"
            theme={theme}
            onToggleTheme={onToggleTheme}
            action={(
                <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
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
                <section className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
                    <div className="panel overflow-hidden p-6">
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">{today}'s schedule</p>
                                <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
                                    {todaysSubjects.length > 0 ? 'Your attendance plan is ready.' : 'No classes are planned today.'}
                                </h2>
                                <p className="mt-3 max-w-xl text-muted-foreground">
                                    {todaysSubjects.length > 0
                                        ? 'Mark each class as it happens and keep your safe-to-skip count honest.'
                                        : 'Add subjects to your timetable so Today can show what needs attention.'}
                                </p>
                            </div>
                            <div className="rounded-lg bg-accent px-4 py-3 text-accent-foreground">
                                <p className="text-sm font-semibold">Today</p>
                                <p className="text-2xl font-bold">{todaysSubjects.length} classes</p>
                            </div>
                        </div>
                    </div>

                    <div className="panel p-6">
                        <p className="text-sm font-semibold text-muted-foreground">Overall attendance</p>
                        <p className={`mt-3 text-5xl font-bold ${overallTone.text}`}>{overallAttendance}%</p>
                        <p className="mt-3 text-sm text-muted-foreground">
                            {overallAttendance >= 75 ? 'You are above the common 75% target.' : 'Review low subjects before skipping.'}
                        </p>
                    </div>
                </section>

                <section className="grid gap-3 sm:grid-cols-2">
                    <button className="panel p-5 text-left transition-colors hover:bg-accent" onClick={() => setView('all-subjects')}>
                        <p className="text-lg font-bold">All subjects</p>
                        <p className="mt-1 text-sm text-muted-foreground">Review every course and update attendance quickly.</p>
                    </button>
                    <button className="panel p-5 text-left transition-colors hover:bg-accent" onClick={() => setView('timetable-editor')}>
                        <p className="text-lg font-bold">Weekly timetable</p>
                        <p className="mt-1 text-sm text-muted-foreground">Choose which subjects happen on each day.</p>
                    </button>
                </section>

                <section>
                    <div className="mb-4 flex items-end justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold">Today's classes</h2>
                            <p className="text-sm text-muted-foreground">Use quick actions when a class ends.</p>
                        </div>
                    </div>
                {todaysSubjects.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <AnimatePresence>
                            {todaysSubjects.map((subject) => (
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
                    </div>
                ) : (
                    <div className="panel border-dashed p-8 text-center">
                        <h3 className="text-xl font-bold">No classes today</h3>
                        <p className="mx-auto mt-2 max-w-md text-muted-foreground">If this looks wrong, update your weekly timetable and Today will stay in sync.</p>
                        <button
                            onClick={() => setView('timetable-editor')}
                            className="btn btn-primary mt-5"
                        >
                            Edit timetable
                        </button>
                    </div>
                )}
                </section>
            </motion.div>

            <CanSkipModal
                isOpen={!!skipModalSubject}
                onClose={() => setSkipModalSubject(null)}
                subject={skipModalSubject}
            />

            <AddSubjectModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddSubject}
            />
        </AppShell>
    );
};
