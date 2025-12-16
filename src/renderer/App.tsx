import React, { useState, useEffect } from 'react';
import { BootupAnimation } from './components/BootupAnimation';
import { Dashboard } from './pages/Dashboard';
import { SubjectDetail } from './pages/SubjectDetail';
import { Settings } from './pages/Settings';
import { AllSubjects } from './pages/AllSubjects';
import { TimetableEditor } from './pages/TimetableEditor';
import { AnimatePresence } from 'framer-motion';
import { useAppStore } from './store/useAppStore';

const App: React.FC = () => {
    const [hasBooted, setHasBooted] = useState(false);
    const currentView = useAppStore((state) => state.currentView);

    useEffect(() => {
        // Check if we've already shown the bootup animation this session (optional optimization)
        // For now, always show it as requested
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground font-sans antialiased">
            <AnimatePresence mode='wait'>
                {!hasBooted ? (
                    <BootupAnimation key="bootup" onComplete={() => setHasBooted(true)} />
                ) : (
                    currentView === 'dashboard' ? (
                        <Dashboard key="dashboard" />
                    ) : currentView === 'detail' ? (
                        <SubjectDetail key="detail" />
                    ) : currentView === 'all-subjects' ? (
                        <AllSubjects key="all-subjects" />
                    ) : currentView === 'timetable-editor' ? (
                        <TimetableEditor key="timetable-editor" />
                    ) : (
                        <Settings key="settings" />
                    )
                )}
            </AnimatePresence>
        </div>
    );
};

export default App;
