import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as SQLite from 'expo-sqlite';
import * as schema from './schema';

let _db: ReturnType<typeof drizzle> | null = null;
let _sqlite: SQLite.SQLiteDatabase | null = null;

export function getDb() {
  if (!_db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return _db;
}

/**
 * Open (or create) the encrypted SQLite database and apply all DDL.
 * Must be called once during app startup, after the PIN is verified.
 *
 * @param encryptionKey  256-bit hex key (64 lowercase hex chars) derived from
 *                       the user's PIN via PBKDF2. Always required — there is
 *                       no plaintext fallback. Use initDatabaseUnencrypted()
 *                       in tests that do not require encryption.
 */
export async function initDatabase(encryptionKey: string): Promise<void> {
  // Guard: key must be exactly 64 lowercase hex characters (256-bit raw key).
  // This fails fast rather than silently opening an unencrypted or mis-keyed DB.
  if (!/^[0-9a-f]{64}$/.test(encryptionKey)) {
    throw new Error('initDatabase: encryptionKey must be exactly 64 lowercase hex characters');
  }

  const sqlite = await SQLite.openDatabaseAsync('finance_bag.db');

  _sqlite = sqlite;
  _db = drizzle(sqlite, { schema });

  // SQLCipher key must be the very first PRAGMA on a newly-opened connection.
  // The "x'...'" notation passes the key as raw bytes, not as a passphrase —
  // this is required by SPEC-SEC-001 §6.2 and avoids SQLCipher's internal KDF
  // running a second PBKDF2 derivation on the already-derived key.
  await sqlite.execAsync(`PRAGMA key = "x'${encryptionKey}'";`);

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

  await runMigrations(sqlite);

  await sqlite.execAsync(`
    INSERT OR IGNORE INTO users (id) VALUES (1);
    INSERT OR IGNORE INTO emergency_fund (id) VALUES (1);
  `);
}

async function runMigrations(sqlite: SQLite.SQLiteDatabase): Promise<void> {
  const row = await sqlite.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const version = row?.user_version ?? 0;

  if (version < 1) {
    // Migration 1: add FK constraint (REFERENCES goals ON DELETE CASCADE) to goal_contributions.
    // SQLite requires recreating the table to add FK constraints to an existing table.
    await sqlite.execAsync(`
      CREATE TABLE IF NOT EXISTS goal_contributions_new (
        id TEXT PRIMARY KEY,
        goal_id TEXT NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        deleted_at TEXT
      );
      INSERT OR IGNORE INTO goal_contributions_new SELECT * FROM goal_contributions;
      DROP TABLE IF EXISTS goal_contributions;
      ALTER TABLE goal_contributions_new RENAME TO goal_contributions;
      CREATE INDEX IF NOT EXISTS gc_goal_idx ON goal_contributions(goal_id);
    `);
    await sqlite.execAsync('PRAGMA user_version = 1;');
  }
}

/**
 * Re-encrypt the open database with a new key (SQLCipher PRAGMA rekey).
 * Must be called while the DB is open and the current session is authenticated.
 * Uses raw-key notation ("x'hex'") consistent with initDatabase().
 */
export async function rekeyDatabase(newKey: string): Promise<void> {
  if (!_sqlite) throw new Error('Database not initialized. Call initDatabase() first.');
  if (!/^[0-9a-f]{64}$/.test(newKey)) {
    throw new Error('rekeyDatabase: newKey must be exactly 64 lowercase hex characters');
  }
  await _sqlite.execAsync(`PRAGMA rekey = "x'${newKey}'";`);
}

/** Close the database and clear the singleton — used in tests and PIN reset flows. */
export async function closeDatabase(): Promise<void> {
  if (_sqlite) {
    await _sqlite.closeAsync();
  }
  _sqlite = null;
  _db = null;
}

/**
 * Open an unencrypted database for automated tests only.
 * MUST NOT be called in production code paths — there is no encryption key.
 * @internal
 */
export async function initDatabaseUnencrypted(): Promise<void> {
  const sqlite = await SQLite.openDatabaseAsync(':memory:');
  _sqlite = sqlite;
  _db = drizzle(sqlite, { schema });
}
