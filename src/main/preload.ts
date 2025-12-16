import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    // Subjects
    getSubjects: () => ipcRenderer.invoke('get-subjects'),
    addSubject: (subject: any) => ipcRenderer.invoke('add-subject', subject),
    updateSubject: (subject: any) => ipcRenderer.invoke('update-subject', subject),
    deleteSubject: (id: string) => ipcRenderer.invoke('delete-subject', id),

    // Logs
    getLogs: (subjectId: string) => ipcRenderer.invoke('get-logs', subjectId),
    addLog: (log: any) => ipcRenderer.invoke('add-log', log),

    // Settings
    getSettings: () => ipcRenderer.invoke('get-settings'),
    saveSetting: (key: string, value: any) => ipcRenderer.invoke('save-setting', key, value),

    // College Rules
    // College Rules
    getCollegeRules: () => ipcRenderer.invoke('get-college-rules'),
    saveCollegeRules: (rules: any) => ipcRenderer.invoke('save-college-rules', rules),

    // Timetable
    getTimetable: () => ipcRenderer.invoke('get-timetable'),
    saveTimetable: (entries: any[]) => ipcRenderer.invoke('save-timetable', entries),
});
