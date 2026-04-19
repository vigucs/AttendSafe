import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AddSubjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (name: string, total: number, attended: number, minReq: number, semesterTotal: number) => void;
}

export const AddSubjectModal: React.FC<AddSubjectModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [name, setName] = useState('');
    const [total, setTotal] = useState(0);
    const [attended, setAttended] = useState(0);
    const [semesterTotal, setSemesterTotal] = useState(0);
    const [minReq, setMinReq] = useState(75);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && total >= 0 && attended >= 0 && minReq > 0) {
            onAdd(name, total, attended, minReq, semesterTotal || 0);
            onClose();
            setName('');
            setTotal(0);
            setAttended(0);
            setSemesterTotal(0);
            setMinReq(75);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="panel w-full max-w-md overflow-hidden"
                    >
                        <div className="p-6">
                            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">New course</p>
                            <h2 className="mb-5 mt-2 text-2xl font-bold">Add Subject</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="label">Subject Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="field"
                                        placeholder="e.g. Mathematics"
                                        autoFocus
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">Classes Held</label>
                                        <input
                                            type="number"
                                            value={total}
                                            onChange={(e) => setTotal(parseInt(e.target.value) || 0)}
                                            className="field"
                                            min="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Attended</label>
                                        <input
                                            type="number"
                                            value={attended}
                                            onChange={(e) => setAttended(parseInt(e.target.value) || 0)}
                                            className="field"
                                            min="0"
                                            max={total}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="label">Total Classes This Semester</label>
                                    <input
                                        type="number"
                                        value={semesterTotal}
                                        onChange={(e) => setSemesterTotal(parseInt(e.target.value) || 0)}
                                        className="field"
                                        min={total}
                                        placeholder="Optional (e.g. 50)"
                                    />
                                    <p className="mt-1 text-xs text-muted-foreground">Used to estimate how many classes you can miss.</p>
                                </div>

                                <div>
                                    <label className="label">Minimum Required %</label>
                                    <input
                                        type="number"
                                        value={minReq}
                                        onChange={(e) => setMinReq(parseInt(e.target.value) || 0)}
                                        className="field"
                                        min="0"
                                        max="100"
                                    />
                                </div>

                                {attended > total && (
                                    <p className="text-xs text-red-500">Attended classes cannot exceed total classes.</p>
                                )}

                                {semesterTotal > 0 && semesterTotal < total && (
                                    <p className="text-xs text-red-500">Semester total cannot be less than classes held.</p>
                                )}

                                <div className="flex gap-2 justify-end mt-6">
                                    <button type="button" onClick={onClose} className="btn btn-ghost">
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!name || attended > total}
                                        className="btn btn-primary"
                                    >
                                        Add Subject
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
