import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

export function getAttendanceTone(percent: number, required = 75) {
    if (percent < required) return 'critical';
    if (percent < required + 5) return 'warning';
    return 'safe';
}

export function getToneClasses(status: 'safe' | 'warning' | 'critical') {
    const tones = {
        safe: {
            text: 'text-emerald-700 dark:text-emerald-300',
            soft: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/12 dark:text-emerald-200 dark:ring-emerald-500/25',
            bar: 'bg-emerald-500',
        },
        warning: {
            text: 'text-amber-700 dark:text-amber-300',
            soft: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/12 dark:text-amber-200 dark:ring-amber-500/25',
            bar: 'bg-amber-500',
        },
        critical: {
            text: 'text-rose-700 dark:text-rose-300',
            soft: 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/12 dark:text-rose-200 dark:ring-rose-500/25',
            bar: 'bg-rose-500',
        },
    };

    return tones[status];
}
