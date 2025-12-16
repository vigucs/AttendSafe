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
        }, 2500); // slightly longer to enjoy animation

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50 text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="relative">
                <motion.h1
                    className="text-6xl font-bold tracking-tighter"
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
                        className="mt-4 text-xl text-muted-foreground font-light"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Know your attendance. Stay stress-free.
                    </motion.p>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
