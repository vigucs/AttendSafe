import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/renderer/store/useAppStore';

export const Settings: React.FC = () => {
    const { setView, collegeRules, fetchCollegeRules, updateCollegeRules, resetData } = useAppStore();

    const [minAtt, setMinAtt] = useState(75);

    useEffect(() => {
        fetchCollegeRules();
    }, [fetchCollegeRules]);

    useEffect(() => {
        if (collegeRules) {
            setMinAtt(collegeRules.min_attendance);
        }
    }, [collegeRules]);

    const handleSaveRules = () => {
        updateCollegeRules({
            id: 'default', // Single row
            min_attendance: minAtt,
            grace_percent: 0,
            hard_lock: 0,
            lab_weight: 0
        });
    };

    const handleReset = async () => {
        if (confirm('Are you sure you want to delete ALL subjects and data? This cannot be undone.')) {
            await resetData();
            alert('Data cleared.');
        }
    };

    return (
        <motion.div
            className="p-8 max-w-2xl mx-auto pb-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
        >
            <button
                onClick={() => setView('dashboard')}
                className="mb-8 flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
                ← Back to Dashboard
            </button>

            <h1 className="text-4xl font-bold tracking-tight mb-8">Settings</h1>

            <div className="space-y-8">
                {/* College Rules */}
                <section className="p-6 bg-card rounded-xl border">
                    <h2 className="text-xl font-semibold mb-4">College Rules</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Global Minimum Attendance Requirement (%)</label>
                            <div className="flex gap-4 items-center">
                                <input
                                    type="number"
                                    value={minAtt}
                                    onChange={(e) => setMinAtt(parseInt(e.target.value) || 0)}
                                    className="w-24 px-3 py-2 rounded-md bg-muted border-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                    min="0" max="100"
                                />
                                <button
                                    onClick={handleSaveRules}
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                                >
                                    Save Rule
                                </button>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                Note: This sets the default for the college. Subjects can have individual overrides (future feature).
                            </p>
                        </div>
                    </div>
                </section>

                {/* Data Management */}
                <section className="p-6 bg-card rounded-xl border">
                    <h2 className="text-xl font-semibold mb-4 text-red-500">Danger Zone</h2>
                    <div>
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 bg-red-500/10 text-red-600 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors border border-red-500/20"
                        >
                            Reset All Data
                        </button>
                        <p className="text-xs text-muted-foreground mt-2">
                            This will delete all subjects and attendance logs permanently.
                        </p>
                    </div>
                </section>

                {/* About */}
                <section className="pt-8 border-t text-center text-muted-foreground">
                    <p className="text-sm">AttendSafe v1.0.0</p>
                    <p className="text-xs mt-1">Designed for students, by students.</p>
                </section>
            </div>
        </motion.div>
    );
};
