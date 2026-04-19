import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/renderer/store/useAppStore';
import { AppShell } from '@/renderer/components/AppShell';

interface SettingsProps {
    theme: 'light' | 'dark';
    onToggleTheme: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ theme, onToggleTheme }) => {
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
            id: 'default',
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
        <AppShell title="Settings" eyebrow="Preferences" theme={theme} onToggleTheme={onToggleTheme} onBack={() => setView('dashboard')}>
            <motion.div
                className="mx-auto max-w-3xl space-y-6"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
            >
                <section className="panel p-6">
                    <h2 className="text-xl font-bold">Attendance rule</h2>
                    <p className="mt-2 text-sm text-muted-foreground">Use the requirement your college follows most often.</p>
                    <div className="space-y-4">
                        <div>
                            <label className="label mt-5">Minimum Attendance Requirement (%)</label>
                            <div className="flex flex-wrap items-center gap-3">
                                <input
                                    type="number"
                                    value={minAtt}
                                    onChange={(e) => setMinAtt(parseInt(e.target.value) || 0)}
                                    className="field w-28"
                                    min="0" max="100"
                                />
                                <button onClick={handleSaveRules} className="btn btn-primary">
                                    Save Rule
                                </button>
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                                New subjects can still use their own requirement.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="panel p-6">
                    <h2 className="text-xl font-bold text-rose-700 dark:text-rose-300">Data</h2>
                    <p className="mt-2 text-sm text-muted-foreground">Clear saved subjects and attendance logs from this computer.</p>
                    <div>
                        <button
                            onClick={handleReset}
                            className="mt-5 rounded-md border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-bold text-rose-700 transition-colors hover:bg-rose-100 dark:border-rose-500/25 dark:bg-rose-500/12 dark:text-rose-200 dark:hover:bg-rose-500/20"
                        >
                            Reset All Data
                        </button>
                        <p className="mt-2 text-xs text-muted-foreground">
                            This will delete all subjects and attendance logs permanently.
                        </p>
                    </div>
                </section>

                <section className="border-t border-border pt-6 text-center text-muted-foreground">
                    <p className="text-sm">AttendSafe v1.0.0</p>
                    <p className="mt-1 text-xs">Built for daily attendance decisions.</p>
                </section>
            </motion.div>
        </AppShell>
    );
};
