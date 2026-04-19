import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/renderer/store/useAppStore';
import { AppShell } from '@/renderer/components/AppShell';
import { cn } from '@/renderer/utils/ui';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface TimetableEditorProps {
    theme: 'light' | 'dark';
    onToggleTheme: () => void;
}

export const TimetableEditor: React.FC<TimetableEditorProps> = ({ theme, onToggleTheme }) => {
    const { subjects, timetable, fetchSubjects, fetchTimetable, saveTimetable, setView } = useAppStore();
    const [schedule, setSchedule] = useState<{ day: string; subject_id: string }[]>([]);

    useEffect(() => {
        fetchSubjects();
        fetchTimetable();
    }, [fetchSubjects, fetchTimetable]);

    useEffect(() => {
        if (timetable) {
            setSchedule(timetable);
        }
    }, [timetable]);

    const handleToggle = (day: string, subjectId: string) => {
        const exists = schedule.find(s => s.day === day && s.subject_id === subjectId);
        let newSchedule;
        if (exists) {
            newSchedule = schedule.filter(s => s !== exists);
        } else {
            newSchedule = [...schedule, { day, subject_id: subjectId }];
        }
        setSchedule(newSchedule);
    };

    const handleSave = async () => {
        await saveTimetable(schedule);
        alert('Timetable saved!');
    };

    return (
        <AppShell
            title="Timetable"
            eyebrow="Weekly plan"
            theme={theme}
            onToggleTheme={onToggleTheme}
            onBack={() => setView('dashboard')}
            action={(
                <button onClick={handleSave} className="btn btn-primary">
                    Save Changes
                </button>
            )}
        >
            <motion.div
                className="space-y-6"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
            >
                <section className="panel p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">Schedule</p>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight">Pick the subjects you have each day.</h2>
                    <p className="mt-3 max-w-2xl text-muted-foreground">
                        Today uses this timetable to show only the classes that need a quick attendance update.
                    </p>
                </section>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {DAYS.map(day => (
                    <div key={day} className="panel p-4">
                        <h3 className="mb-4 border-b border-border pb-3 text-xl font-bold">{day}</h3>
                        <div className="space-y-2">
                            {subjects.length > 0 ? subjects.map(subject => {
                                const isSelected = schedule.some(s => s.day === day && s.subject_id === subject.id);
                                return (
                                    <button
                                        type="button"
                                        key={subject.id}
                                        onClick={() => handleToggle(day, subject.id)}
                                        className={cn(
                                            'flex w-full items-center justify-between rounded-md border p-3 text-left text-sm font-semibold transition-colors',
                                            isSelected
                                                ? 'border-primary bg-accent text-accent-foreground'
                                                : 'border-transparent bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                                        )}
                                    >
                                        <span>{subject.name}</span>
                                        {isSelected && <span className="text-lg">Selected</span>}
                                    </button>
                                );
                            }) : (
                                <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground">Add subjects before building a timetable.</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            </motion.div>
        </AppShell>
    );
};
