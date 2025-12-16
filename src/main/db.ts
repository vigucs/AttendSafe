import Database from 'better-sqlite3';
import { app } from 'electron';
import path from 'path';

let db: Database.Database;

export function initDB() {
  const dbPath = path.join(app.getPath('userData'), 'attend-safe.db');
  console.log('Database Path:', dbPath);
  db = new Database(dbPath);

  // Enable WAL mode for better performance
  db.pragma('journal_mode = WAL');

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS subjects (
      id TEXT PRIMARY KEY,
      name TEXT,
      total_classes INTEGER,
      attended_classes INTEGER,
      min_required_percent INTEGER
    );

    CREATE TABLE IF NOT EXISTS attendance_logs (
      id TEXT PRIMARY KEY,
      subject_id TEXT,
      date INTEGER,
      status TEXT,
      FOREIGN KEY(subject_id) REFERENCES subjects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
    
    CREATE TABLE IF NOT EXISTS college_rules (
      id TEXT PRIMARY KEY,
      min_attendance INTEGER,
      grace_percent INTEGER,
      hard_lock INTEGER,
      lab_weight INTEGER
    );

    CREATE TABLE IF NOT EXISTS timetable (
      day TEXT,
      subject_id TEXT,
      PRIMARY KEY (day, subject_id),
      FOREIGN KEY(subject_id) REFERENCES subjects(id) ON DELETE CASCADE
    );
  `);

  return db;
}

export function getDB() {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}
