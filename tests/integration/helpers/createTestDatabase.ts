import Database from 'better-sqlite3'
import { runMigrations } from '../../../electron/data/database/migrations'

export function createTestDatabase(): Database.Database {
  const db = new Database(':memory:')
  db.pragma('foreign_keys = ON')
  runMigrations(db)
  return db
}
