export { };

declare global {
    interface Window {
        electronAPI: {
            getSubjects: () => Promise<any>;
            addSubject: (subject: any) => Promise<any>;
            updateSubject: (subject: any) => Promise<any>;
            deleteSubject: (id: string) => Promise<any>;
            getLogs: (subjectId: string) => Promise<any>;
            addLog: (log: any) => Promise<any>;
            getSettings: () => Promise<any>;
            saveSetting: (key: string, value: any) => Promise<any>;
            getCollegeRules: () => Promise<any>;
            saveCollegeRules: (rules: any) => Promise<any>;
            getTimetable: () => Promise<any>;
            saveTimetable: (entries: any[]) => Promise<any>;
        };
    }
}
