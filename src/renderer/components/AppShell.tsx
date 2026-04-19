import React from 'react';
import { useAppStore } from '@/renderer/store/useAppStore';

interface AppShellProps {
    children: React.ReactNode;
    title: string;
    eyebrow?: string;
    action?: React.ReactNode;
    onBack?: () => void;
    theme: 'light' | 'dark';
    onToggleTheme: () => void;
}

export const AppShell: React.FC<AppShellProps> = ({
    children,
    title,
    eyebrow,
    action,
    onBack,
    theme,
    onToggleTheme,
}) => {
    const { currentView, setView } = useAppStore();

    const navItems = [
        { label: 'Today', view: 'dashboard' as const },
        { label: 'Subjects', view: 'all-subjects' as const },
        { label: 'Timetable', view: 'timetable-editor' as const },
        { label: 'Settings', view: 'settings' as const },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
                <header className="sticky top-0 z-30 -mx-4 mb-6 border-b border-border/80 bg-background/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                    <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex min-w-0 items-center gap-3">
                            {onBack && (
                                <button className="btn btn-secondary shrink-0" onClick={onBack}>
                                    Back
                                </button>
                            )}
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary text-base font-bold text-primary-foreground shadow-soft">
                                AS
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                    {eyebrow ?? 'AttendSafe'}
                                </p>
                                <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <nav className="flex flex-wrap rounded-lg border border-border bg-card p-1 shadow-soft">
                                {navItems.map((item) => (
                                    <button
                                        key={item.view}
                                        onClick={() => setView(item.view)}
                                        className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${currentView === item.view
                                            ? 'bg-primary text-primary-foreground'
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                            }`}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </nav>
                            <button className="btn btn-secondary" onClick={onToggleTheme}>
                                {theme === 'light' ? 'Dark' : 'Light'}
                            </button>
                            {action}
                        </div>
                    </div>
                </header>

                <main className="flex-1 pb-10">{children}</main>
            </div>
        </div>
    );
};
