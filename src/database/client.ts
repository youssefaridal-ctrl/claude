import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from './schema';

let _db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!_db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return _db;
}

export async function initDatabase(): Promise<void> {
  const sqlite = SQLite.openDatabaseSync('finance_bag.db');
  _db = drizzle(sqlite, { schema });

  await sqlite.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL DEFAULT '',
      language TEXT NOT NULL DEFAULT 'fr',
      currency TEXT NOT NULL DEFAULT 'MAD',
      salary REAL NOT NULL DEFAULT 0,
      salary_payment_day INTEGER NOT NULL DEFAULT 1,
      onboarding_completed INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS income_sources (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      amount REAL NOT NULL,
      type TEXT NOT NULL DEFAULT 'fixed',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      deleted_at TEXT
    );

    CREATE TABLE IF NOT EXISTS budget_categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      percentage REAL NOT NULL DEFAULT 0,
      amount REAL NOT NULL DEFAULT 0,
      color TEXT NOT NULL DEFAULT '#6366F1',
      icon TEXT NOT NULL DEFAULT '💰',
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      deleted_at TEXT
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      category_id TEXT NOT NULL,
      date TEXT NOT NULL,
      month TEXT NOT NULL,
      type TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      deleted_at TEXT
    );

    CREATE INDEX IF NOT EXISTS tx_month_idx ON transactions(month);
    CREATE INDEX IF NOT EXISTS tx_category_idx ON transactions(category_id);
    CREATE INDEX IF NOT EXISTS tx_month_category_idx ON transactions(month, category_id);

    CREATE TABLE IF NOT EXISTS credits (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'other',
      total_amount REAL NOT NULL DEFAULT 0,
      remaining_amount REAL NOT NULL DEFAULT 0,
      monthly_payment REAL NOT NULL DEFAULT 0,
      interest_rate REAL NOT NULL DEFAULT 0,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      bank TEXT NOT NULL DEFAULT '',
      color TEXT NOT NULL DEFAULT '#6366F1',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      deleted_at TEXT
    );

    CREATE TABLE IF NOT EXISTS emergency_fund (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      current_amount REAL NOT NULL DEFAULT 0,
      target_amount REAL NOT NULL DEFAULT 0,
      monthly_contribution REAL NOT NULL DEFAULT 0,
      target_type TEXT NOT NULL DEFAULT '6_months',
      monthly_expenses REAL NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS emergency_transactions (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL,
      note TEXT NOT NULL DEFAULT '',
      deleted_at TEXT
    );

    CREATE TABLE IF NOT EXISTS goals (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      type TEXT NOT NULL DEFAULT 'other',
      target_amount REAL NOT NULL DEFAULT 0,
      current_amount REAL NOT NULL DEFAULT 0,
      target_date TEXT NOT NULL,
      priority TEXT NOT NULL DEFAULT 'medium',
      color TEXT NOT NULL DEFAULT '#6366F1',
      icon TEXT NOT NULL DEFAULT '🎯',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      deleted_at TEXT
    );

    CREATE TABLE IF NOT EXISTS goal_contributions (
      id TEXT PRIMARY KEY,
      goal_id TEXT NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL,
      deleted_at TEXT
    );

    CREATE INDEX IF NOT EXISTS gc_goal_idx ON goal_contributions(goal_id);
  `);

  // Seed singleton user row if not present
  await sqlite.execAsync(`
    INSERT OR IGNORE INTO users (id) VALUES (1);
    INSERT OR IGNORE INTO emergency_fund (id) VALUES (1);
  `);
}
