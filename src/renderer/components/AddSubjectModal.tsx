import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AddSubjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (name: string, total: number, attended: number, minReq: number) => void;
}

export const AddSubjectModal: React.FC<AddSubjectModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [name, setName] = useState('');
    const [total, setTotal] = useState(0);
    const [attended, setAttended] = useState(0);
    const [minReq, setMinReq] = useState(75);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && total >= 0 && attended >= 0 && minReq > 0) {
            onAdd(name, total, attended, minReq);
            onClose();
            // Reset
            setName('');
            setTotal(0);
            setAttended(0);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-background border rounded-xl shadow-lg w-full max-w-md overflow-hidden"
                    >
                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-4">Add Subject</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Subject Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-3 py-2 rounded-md bg-muted border-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                        placeholder="e.g. Mathematics"
                                        autoFocus
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Classes Held So Far</label>
                                        <input
                                            type="number"
                                            value={total}
                                            onChange={(e) => setTotal(parseInt(e.target.value) || 0)}
                                            className="w-full px-3 py-2 rounded-md bg-muted border-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                            min="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Attended</label>
                                        <input
                                            type="number"
                                            value={attended}
                                            onChange={(e) => setAttended(parseInt(e.target.value) || 0)}
                                            className="w-full px-3 py-2 rounded-md bg-muted border-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                            min="0"
                                            max={total}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Min Required %</label>
                                    <input
                                        type="number"
                                        value={minReq}
                                        onChange={(e) => setMinReq(parseInt(e.target.value) || 0)}
                                        className="w-full px-3 py-2 rounded-md bg-muted border-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                        min="0"
                                        max="100"
                                    />
                                </div>

                                {attended > total && (
                                    <p className="text-xs text-red-500">Attended classes cannot exceed total classes.</p>
                                )}

                                <div className="flex gap-2 justify-end mt-6">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-md transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!name || attended > total}
                                        className="px-4 py-2 text-sm font-medium bg-foreground text-background rounded-md hover:bg-foreground/90 transition-colors disabled:opacity-50"
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
