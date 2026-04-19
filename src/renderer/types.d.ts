import type { AttendanceLog, CollegeRules, Settings, Subject } from '@/shared/types';

export { };

type NewSubject = Omit<Subject, 'id'>;
type NewAttendanceLog = Omit<AttendanceLog, 'id'>;
type TimetableEntry = { day: string; subject_id: string };

declare global {
    interface Window {
        electronAPI: {
            getSubjects: () => Promise<Subject[]>;
            addSubject: (subject: NewSubject) => Promise<Subject>;
            updateSubject: (subject: Subject) => Promise<Subject>;
            deleteSubject: (id: string) => Promise<string>;
            getLogs: (subjectId: string) => Promise<AttendanceLog[]>;
            addLog: (log: NewAttendanceLog) => Promise<AttendanceLog>;
            getSettings: () => Promise<Settings[]>;
            saveSetting: (key: string, value: Settings['value']) => Promise<Settings>;
            getCollegeRules: () => Promise<CollegeRules | null>;
            saveCollegeRules: (rules: CollegeRules) => Promise<CollegeRules>;
            getTimetable: () => Promise<TimetableEntry[]>;
            saveTimetable: (entries: TimetableEntry[]) => Promise<TimetableEntry[]>;
        };
    }
}
