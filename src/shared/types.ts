export interface Subject {
    id: string;
    name: string;
    total_classes: number; // Classes held so far
    attended_classes: number;
    min_required_percent: number;
    semester_total_classes?: number; // Total classes in the entire semester
}

export interface AttendanceLog {
    id: string;
    subject_id: string;
    date: number; // Timestamp
    status: 'attended' | 'missed';
}

export interface Settings {
    key: string;
    value: string;
}

export interface CollegeRules {
    id: string; // 'default'
    min_attendance: number;
    grace_percent: number;
    hard_lock: number; // 0 or 1
    lab_weight: number;
}
