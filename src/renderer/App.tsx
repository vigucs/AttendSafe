import React, { useEffect, useState } from 'react';
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
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        const savedTheme = localStorage.getItem('attend-safe-theme');
        return savedTheme === 'dark' ? 'dark' : 'light';
    });
    const currentView = useAppStore((state) => state.currentView);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        localStorage.setItem('attend-safe-theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme((current) => current === 'light' ? 'dark' : 'light');

    return (
        <div className="min-h-screen bg-background text-foreground font-sans antialiased">
            <AnimatePresence mode='wait'>
                {!hasBooted ? (
                    <BootupAnimation key="bootup" onComplete={() => setHasBooted(true)} />
                ) : (
                    currentView === 'dashboard' ? (
                        <Dashboard key="dashboard" theme={theme} onToggleTheme={toggleTheme} />
                    ) : currentView === 'detail' ? (
                        <SubjectDetail key="detail" theme={theme} onToggleTheme={toggleTheme} />
                    ) : currentView === 'all-subjects' ? (
                        <AllSubjects key="all-subjects" theme={theme} onToggleTheme={toggleTheme} />
                    ) : currentView === 'timetable-editor' ? (
                        <TimetableEditor key="timetable-editor" theme={theme} onToggleTheme={toggleTheme} />
                    ) : (
                        <Settings key="settings" theme={theme} onToggleTheme={toggleTheme} />
                    )
                )}
            </AnimatePresence>
        </div>
    );
};

export default App;
