import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BootupAnimationProps {
    onComplete: () => void;
}

export const BootupAnimation: React.FC<BootupAnimationProps> = ({ onComplete }) => {
    const [showSubtext, setShowSubtext] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 1800);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="relative flex flex-col items-center">
                <motion.div
                    className="mb-5 flex h-16 w-16 items-center justify-center rounded-lg bg-primary text-xl font-bold text-primary-foreground shadow-soft"
                    initial={{ opacity: 0, y: 12, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                >
                    AS
                </motion.div>
                <motion.h1
                    className="text-5xl font-bold tracking-tight sm:text-6xl"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    onAnimationComplete={() => setShowSubtext(true)}
                >
                    AttendSafe
                </motion.h1>
            </div>

            <AnimatePresence>
                {showSubtext && (
                    <motion.p
                        className="mt-4 px-6 text-center text-lg text-muted-foreground"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Know what to attend next.
                    </motion.p>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
