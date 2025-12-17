import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/renderer/store/useAppStore';
import { SubjectCard } from '@/renderer/components/SubjectCard';
import { CanSkipModal } from '@/renderer/components/CanSkipModal';
import { AddSubjectModal } from '@/renderer/components/AddSubjectModal';
import type { Subject } from '@/shared/types';
import type { CalculationResult } from '@/renderer/utils/calculationEngine';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const Dashboard: React.FC = () => {
    const { subjects, overallAttendance, timetable, fetchSubjects, fetchTimetable, addSubject, updateAttendance, setView } = useAppStore();
    const [skipModalSubject, setSkipModalSubject] = useState<(Subject & CalculationResult) | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        fetchSubjects();
        fetchTimetable();
    }, [fetchSubjects, fetchTimetable]);

    const today = DAYS[new Date().getDay()];

    // Filter subjects for today
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
        <motion.div
            className="p-8 max-w-7xl mx-auto pb-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <header className="flex justify-between items-center mb-8">
                <div>
                    <div className="flex items-baseline gap-3">
                        <h1 className="text-4xl font-bold tracking-tight mb-2">AttendSafe</h1>
                        <span className="text-sm px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">v1.0</span>
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
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2"
                    >
                        <span>+</span> Add Subject
                    </button>
                </div>
            </header>

            {/* Navigation / Quick Actions */}
            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => setView('all-subjects')}
                    className="flex-1 p-4 bg-card border rounded-xl hover:bg-accent/50 transition-colors text-left"
                >
                    <h3 className="font-semibold">📚 All Subjects</h3>
                    <p className="text-sm text-muted-foreground">View and manage all your courses</p>
                </button>
                <button
                    onClick={() => setView('timetable-editor')}
                    className="flex-1 p-4 bg-card border rounded-xl hover:bg-accent/50 transition-colors text-left"
                >
                    <h3 className="font-semibold">📅 Edit Timetable</h3>
                    <p className="text-sm text-muted-foreground">Setup your weekly schedule</p>
                </button>
            </div>

            <section className="mb-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <span className="text-primary">Today's Schedule</span>
                    <span className="text-muted-foreground text-lg font-normal">({today})</span>
                </h2>

                {todaysSubjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <div className="p-12 text-center border-2 border-dashed rounded-xl bg-muted/10">
                        <h3 className="text-xl font-medium mb-2">No classes today! 🎉</h3>
                        <p className="text-muted-foreground mb-4">Enjoy your free time or use this time to study.</p>
                        <button
                            onClick={() => setView('timetable-editor')}
                            className="text-primary hover:underline"
                        >
                            Is this wrong? Edit your timetable
                        </button>
                    </div>
                )}
            </section>

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
        </motion.div>
    );
};
