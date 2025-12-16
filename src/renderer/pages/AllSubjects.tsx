import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/renderer/store/useAppStore';
import { SubjectCard } from '@/renderer/components/SubjectCard';
import { AddSubjectModal } from '@/renderer/components/AddSubjectModal';
import { CanSkipModal } from '@/renderer/components/CanSkipModal';
import type { Subject } from '@/shared/types';
import type { CalculationResult } from '@/renderer/utils/calculationEngine';

export const AllSubjects: React.FC = () => {
    const { subjects, overallAttendance, fetchSubjects, addSubject, updateAttendance, setView } = useAppStore();
    const [isModalOpen, setModalOpen] = useState(false);
    const [skipModalSubject, setSkipModalSubject] = useState<(Subject & CalculationResult) | null>(null);

    useEffect(() => {
        fetchSubjects();
    }, [fetchSubjects]);

    const handleAddSubject = (name: string, total: number, attended: number, minReq: number) => {
        addSubject({
            name,
            total_classes: total,
            attended_classes: attended,
            min_required_percent: minReq
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
        <motion.div
            className="p-8 max-w-7xl mx-auto pb-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <header className="flex justify-between items-center mb-12">
                <div>
                    <div className="flex items-baseline gap-3">
                        <button
                            onClick={() => setView('dashboard')}
                            className="text-sm px-3 py-1 bg-secondary rounded-md"
                        >← Back</button>
                        <h1 className="text-4xl font-bold tracking-tight mb-2">All Subjects</h1>
                    </div>
                    <p className="text-muted-foreground">
                        {overallAttendance >= 75 ? "“You’re doing okay”" : "“Keep an eye on attendance”"}
                    </p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => setView('settings')}
                        className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                    >
                        Settings
                    </button>
                </div>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Overall Stats Card */}
                <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Overall Attendance</h3>
                        <p className="text-sm text-muted-foreground">Average across all subjects</p>
                    </div>
                    <div className="mt-4">
                        <p className={`text-5xl font-bold ${overallAttendance >= 75 ? 'text-green-500' : 'text-yellow-500'}`}>
                            {overallAttendance}%
                        </p>
                    </div>
                </div>

                {/* Subject Cards */}
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

                {/* Add Subject Button (Empty State or Last Card) */}
                <button
                    onClick={() => setModalOpen(true)}
                    className="p-6 rounded-xl border-2 border-dashed border-muted hover:border-primary/50 hover:bg-muted/50 transition-all flex flex-col items-center justify-center text-muted-foreground gap-2 min-h-[200px]"
                >
                    <span className="text-4xl font-light">+</span>
                    <span className="font-medium">Add Subject</span>
                </button>
            </section>

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
        </motion.div>
    );
};
