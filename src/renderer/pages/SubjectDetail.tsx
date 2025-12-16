import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/renderer/store/useAppStore';
import { simulateFuture } from '@/renderer/utils/calculationEngine';

export const SubjectDetail: React.FC = () => {
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

    if (!subject) return (
        <div className="p-8 text-center text-muted-foreground">
            Subject not found. <button onClick={() => setView('dashboard')} className="underline">Go back</button>
        </div>
    );

    return (
        <motion.div
            className="p-8 max-w-4xl mx-auto pb-24"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
        >
            <button
                onClick={() => setView('dashboard')}
                className="mb-8 flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
                ← Back to Dashboard
            </button>

            <div className="flex flex-col md:flex-row gap-8 justify-between items-start mb-12">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">{subject.name}</h1>
                    <p className="text-xl text-muted-foreground">
                        Status: <span className={
                            subject.status === 'safe' ? 'text-green-500' :
                                subject.status === 'warning' ? 'text-yellow-500' : 'text-red-500'
                        }>{subject.status.toUpperCase()}</span>
                    </p>
                </div>

                <div className="text-right">
                    <div className="text-6xl font-bold mb-1">
                        <span className={
                            subject.currentPercent >= subject.min_required_percent ? 'text-green-500' : 'text-red-500'
                        }>{subject.currentPercent}%</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Required: {subject.min_required_percent}%</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Stats */}
                <div className="p-6 bg-card rounded-xl border space-y-4">
                    <h3 className="font-semibold text-lg">Statistics</h3>
                    <div className="flex justify-between border-b pb-2">
                        <span>Total Classes</span>
                        <span className="font-mono">{subject.total_classes}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span>Attended</span>
                        <span className="font-mono text-green-500">{subject.attended_classes}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span>Missed</span>
                        <span className="font-mono text-red-500">{subject.total_classes - subject.attended_classes}</span>
                    </div>
                    <div className="pt-2">
                        {subject.status === 'safe' ? (
                            <p className="text-green-600">You can safely miss <span className="font-bold">{subject.canSkip}</span> more classes.</p>
                        ) : (
                            <p className="text-red-600">You need to attend <span className="font-bold">{subject.classesToRecover}</span> more classes to recover.</p>
                        )}
                    </div>
                </div>

                {/* Simulator */}
                <div className="p-6 bg-card rounded-xl border">
                    <h3 className="font-semibold text-lg mb-4">Future Simulator</h3>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm mb-2 flex justify-between">
                                <span>If I attend next:</span>
                                <span className="font-bold">{attendNext}</span>
                            </label>
                            <input
                                type="range"
                                min="0" max="20"
                                value={attendNext}
                                onChange={(e) => setAttendNext(parseInt(e.target.value))}
                                className="w-full accent-green-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-2 flex justify-between">
                                <span>If I miss next:</span>
                                <span className="font-bold">{missNext}</span>
                            </label>
                            <input
                                type="range"
                                min="0" max="20"
                                value={missNext}
                                onChange={(e) => setMissNext(parseInt(e.target.value))}
                                className="w-full accent-red-500"
                            />
                        </div>

                        <div className="p-4 bg-muted rounded-lg text-center">
                            <p className="text-sm mb-1">Predicted Attendance</p>
                            <p className={`text-3xl font-bold ${predictedPercent >= subject.min_required_percent ? 'text-green-500' : 'text-red-500'
                                }`}>
                                {predictedPercent}%
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={() => updateAttendance(subject.id, 'present')}
                    className="flex-1 py-4 bg-green-500/10 text-green-600 rounded-xl font-bold hover:bg-green-500/20 transition-colors"
                >
                    Mark Present Today
                </button>
                <button
                    onClick={() => updateAttendance(subject.id, 'absent')}
                    className="flex-1 py-4 bg-red-500/10 text-red-600 rounded-xl font-bold hover:bg-red-500/20 transition-colors"
                >
                    Mark Absent Today
                </button>
            </div>
        </motion.div>
    );
};
