import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/renderer/store/useAppStore';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const TimetableEditor: React.FC = () => {
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
        <motion.div
            className="p-8 max-w-7xl mx-auto pb-24"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setView('dashboard')}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        ← Back
                    </button>
                    <h1 className="text-3xl font-bold">Edit Timetable</h1>
                </div>
                <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-lg shadow-sm hover:bg-primary/90 transition-colors"
                >
                    Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {DAYS.map(day => (
                    <div key={day} className="bg-card border rounded-xl p-4 shadow-sm">
                        <h3 className="text-xl font-bold mb-4 border-b pb-2">{day}</h3>
                        <div className="space-y-2">
                            {subjects.map(subject => {
                                const isSelected = schedule.some(s => s.day === day && s.subject_id === subject.id);
                                return (
                                    <div
                                        key={subject.id}
                                        onClick={() => handleToggle(day, subject.id)}
                                        className={`
                                            p-3 rounded-lg border cursor-pointer flex items-center justify-between transition-all
                                            ${isSelected
                                                ? 'bg-primary/10 border-primary text-primary font-medium shadow-sm'
                                                : 'bg-muted/50 border-transparent hover:bg-muted text-muted-foreground'}
                                        `}
                                    >
                                        <span>{subject.name}</span>
                                        {isSelected && <span className="text-lg">✓</span>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};
