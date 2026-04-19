import { contextBridge, ipcRenderer } from 'electron';
import type { AttendanceLog, CollegeRules, Settings, Subject } from '@/shared/types';

type NewSubject = Omit<Subject, 'id'>;
type NewAttendanceLog = Omit<AttendanceLog, 'id'>;

contextBridge.exposeInMainWorld('electronAPI', {
    // Subjects
    getSubjects: () => ipcRenderer.invoke('get-subjects'),
    addSubject: (subject: NewSubject) => ipcRenderer.invoke('add-subject', subject),
    updateSubject: (subject: Subject) => ipcRenderer.invoke('update-subject', subject),
    deleteSubject: (id: string) => ipcRenderer.invoke('delete-subject', id),

    // Logs
    getLogs: (subjectId: string) => ipcRenderer.invoke('get-logs', subjectId),
    addLog: (log: NewAttendanceLog) => ipcRenderer.invoke('add-log', log),

    // Settings
    getSettings: () => ipcRenderer.invoke('get-settings'),
    saveSetting: (key: string, value: Settings['value']) => ipcRenderer.invoke('save-setting', key, value),

    // College Rules
    getCollegeRules: () => ipcRenderer.invoke('get-college-rules'),
    saveCollegeRules: (rules: CollegeRules) => ipcRenderer.invoke('save-college-rules', rules),

    // Timetable
    getTimetable: () => ipcRenderer.invoke('get-timetable'),
    saveTimetable: (entries: { day: string; subject_id: string }[]) => ipcRenderer.invoke('save-timetable', entries),
});
