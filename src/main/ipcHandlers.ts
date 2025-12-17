import { ipcMain } from 'electron';
import { getDB } from './db';
import { randomUUID } from 'crypto';

export function registerHandlers() {
    const db = getDB();

    // Subjects
    ipcMain.handle('get-subjects', () => {
        return db.prepare('SELECT * FROM subjects').all();
    });

    ipcMain.handle('add-subject', (_, subject) => {
        const id = randomUUID();
        const stmt = db.prepare('INSERT INTO subjects (id, name, total_classes, attended_classes, min_required_percent, semester_total_classes) VALUES (?, ?, ?, ?, ?, ?)');
        stmt.run(id, subject.name, subject.total_classes, subject.attended_classes, subject.min_required_percent, subject.semester_total_classes || 0);
        return { ...subject, id };
    });

    ipcMain.handle('update-subject', (_, subject) => {
        const stmt = db.prepare('UPDATE subjects SET name = ?, total_classes = ?, attended_classes = ?, min_required_percent = ?, semester_total_classes = ? WHERE id = ?');
        stmt.run(subject.name, subject.total_classes, subject.attended_classes, subject.min_required_percent, subject.semester_total_classes || 0, subject.id);
        return subject;
    });

    ipcMain.handle('delete-subject', (_, id) => {
        db.prepare('DELETE FROM subjects WHERE id = ?').run(id);
        return id;
    });

    // Logs
    ipcMain.handle('get-logs', (_, subjectId) => {
        return db.prepare('SELECT * FROM attendance_logs WHERE subject_id = ? ORDER BY date DESC').all(subjectId);
    });

    ipcMain.handle('add-log', (_, log) => {
        const id = randomUUID();
        const stmt = db.prepare('INSERT INTO attendance_logs (id, subject_id, date, status) VALUES (?, ?, ?, ?)');
        stmt.run(id, log.subject_id, log.date, log.status);
        return { ...log, id };
    });

    // Settings
    ipcMain.handle('get-settings', () => {
        return db.prepare('SELECT * FROM settings').all();
    });

    ipcMain.handle('save-setting', (_, key, value) => {
        const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
        stmt.run(key, value);
        return { key, value };
    });

    // College Rules
    ipcMain.handle('get-college-rules', () => {
        return db.prepare('SELECT * FROM college_rules WHERE id = ?').get('default');
    });

    ipcMain.handle('save-college-rules', (_, rules) => {
        const stmt = db.prepare('INSERT OR REPLACE INTO college_rules (id, min_attendance, grace_percent, hard_lock, lab_weight) VALUES (?, ?, ?, ?, ?)');
        stmt.run('default', rules.min_attendance, rules.grace_percent, rules.hard_lock, rules.lab_weight);
        return rules;
    });

    // Timetable
    ipcMain.handle('get-timetable', () => {
        return db.prepare('SELECT * FROM timetable').all();
    });

    ipcMain.handle('save-timetable', (_, entries) => {
        const insert = db.prepare('INSERT OR REPLACE INTO timetable (day, subject_id) VALUES (?, ?)');
        const deleteAll = db.prepare('DELETE FROM timetable');

        const transaction = db.transaction((entries) => {
            deleteAll.run();
            for (const entry of entries) {
                insert.run(entry.day, entry.subject_id);
            }
        });

        transaction(entries);
        return entries;
    });
}
