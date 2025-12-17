import { create } from 'zustand';
import type { Subject, CollegeRules } from '@/shared/types';
import { executeCalculations, type CalculationResult } from '@/renderer/utils/calculationEngine';

interface SubjectWithStats extends Subject, CalculationResult { }

interface AppState {
    subjects: SubjectWithStats[];
    collegeRules: CollegeRules | null;
    overallAttendance: number;
    isLoading: boolean;

    fetchSubjects: () => Promise<void>;
    addSubject: (subject: Omit<Subject, 'id'>) => Promise<void>;
    updateSubject: (subject: Subject) => Promise<void>;
    deleteSubject: (id: string) => Promise<void>;
    updateAttendance: (subjectId: string, type: 'present' | 'absent') => Promise<void>;

    // Navigation
    currentView: 'dashboard' | 'detail' | 'settings' | 'all-subjects' | 'timetable-editor';
    selectedSubjectId: string | null;
    setView: (view: 'dashboard' | 'detail' | 'settings' | 'all-subjects' | 'timetable-editor', subjectId?: string | null) => void;

    // Rules
    fetchCollegeRules: () => Promise<void>;
    updateCollegeRules: (rules: CollegeRules) => Promise<void>;
    resetData: () => Promise<void>;

    // Timetable
    timetable: { day: string; subject_id: string }[];
    fetchTimetable: () => Promise<void>;
    saveTimetable: (entries: { day: string; subject_id: string }[]) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
    subjects: [],
    collegeRules: null,
    overallAttendance: 100,
    isLoading: true,

    fetchSubjects: async () => {
        console.log('Fetching subjects...');
        set({ isLoading: true });
        try {
            const subjects = await window.electronAPI.getSubjects();
            console.log('Fetched subjects:', subjects);
            // Calculate stats for each subject
            const subjectsWithStats = subjects.map((sub: Subject) => {
                const stats = executeCalculations(
                    sub.attended_classes,
                    sub.total_classes,
                    sub.min_required_percent,
                    sub.semester_total_classes
                );
                return { ...sub, ...stats };
            });

            // Calculate overall attendance
            let totalClasses = 0;
            let totalAttended = 0;
            subjects.forEach((sub: Subject) => {
                totalClasses += sub.total_classes;
                totalAttended += sub.attended_classes;
            });
            const overall = totalClasses === 0 ? 100 : parseFloat(((totalAttended / totalClasses) * 100).toFixed(2));

            set({ subjects: subjectsWithStats, overallAttendance: overall });
        } catch (error) {
            console.error('Failed to fetch subjects', error);
        } finally {
            set({ isLoading: false });
        }
    },

    addSubject: async (subject) => {
        console.log('Adding subject:', subject);
        try {
            await window.electronAPI.addSubject(subject);
            console.log('Subject added successfully, refetching...');
            await get().fetchSubjects();
        } catch (error) {
            console.error('Failed to add subject', error);
        }
    },

    updateSubject: async (subject) => {
        try {
            await window.electronAPI.updateSubject(subject);
            await get().fetchSubjects();
        } catch (error) {
            console.error('Failed to update subject', error);
        }
    },

    deleteSubject: async (id) => {
        try {
            await window.electronAPI.deleteSubject(id);
            await get().fetchSubjects();
        } catch (error) {
            console.error('Failed to delete subject', error);
        }
    },

    updateAttendance: async (subjectId, type) => {
        const subject = get().subjects.find(s => s.id === subjectId);
        if (!subject) return;

        const newAttended = type === 'present' ? subject.attended_classes + 1 : subject.attended_classes;
        const newTotal = subject.total_classes + 1;

        try {
            await window.electronAPI.updateSubject({
                ...subject,
                attended_classes: newAttended,
                total_classes: newTotal
            });

            // Log it
            await window.electronAPI.addLog({
                subject_id: subjectId,
                date: Date.now(),
                status: type === 'present' ? 'attended' : 'missed'
            });

            await get().fetchSubjects();
        } catch (error) {
            console.error('Failed to update attendance', error);
        }
    },

    currentView: 'dashboard',
    selectedSubjectId: null,
    setView: (view, subjectId = null) => set({ currentView: view, selectedSubjectId: subjectId }),

    fetchCollegeRules: async () => {
        try {
            const rules = await window.electronAPI.getCollegeRules();
            set({ collegeRules: rules });
        } catch (error) {
            console.error('Failed to fetch rules', error);
        }
    },

    updateCollegeRules: async (rules) => {
        try {
            await window.electronAPI.saveCollegeRules(rules);
            set({ collegeRules: rules });
            await get().fetchSubjects();
        } catch (error) {
            console.error('Failed to update rules', error);
        }
    },

    resetData: async () => {
        try {
            const subjects = get().subjects;
            for (const sub of subjects) {
                await window.electronAPI.deleteSubject(sub.id);
            }
            await get().fetchSubjects();
        } catch (error) {
            console.error('Failed to reset data', error);
        }
    },

    // Timetable
    timetable: [],
    fetchTimetable: async () => {
        try {
            const timetable = await window.electronAPI.getTimetable();
            set({ timetable });
        } catch (error) {
            console.error('Failed to fetch timetable', error);
        }
    },
    saveTimetable: async (entries) => {
        try {
            await window.electronAPI.saveTimetable(entries);
            set({ timetable: entries });
        } catch (error) {
            console.error('Failed to save timetable', error);
        }
    }
}));
