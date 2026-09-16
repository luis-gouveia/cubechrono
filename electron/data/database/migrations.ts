import type Database from 'better-sqlite3'

type Migration = {
  version: number
  name: string
  up: (db: Database.Database) => void
}

const migrations: Migration[] = [
  {
    version: 1,
    name: 'create_sessions_and_solves',
    up: (db) => {
      db.exec(`
        CREATE TABLE sessions (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          puzzle TEXT NOT NULL,
          position INTEGER NOT NULL,
          created_at INTEGER NOT NULL
        );

        CREATE TABLE solves (
          id TEXT PRIMARY KEY,
          session_id TEXT NOT NULL,
          time INTEGER NOT NULL,
          penalty TEXT NOT NULL DEFAULT 'none',
          scramble TEXT NOT NULL,
          puzzle TEXT NOT NULL,
          comment TEXT,
          created_at INTEGER NOT NULL,

          FOREIGN KEY (session_id)
            REFERENCES sessions(id)
            ON DELETE CASCADE
        );

        CREATE INDEX idx_solves_session_id
          ON solves(session_id);

        CREATE INDEX idx_solves_created_at
          ON solves(created_at);
      `)
    },
  },
]

export function runMigrations(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      version INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      applied_at INTEGER NOT NULL
    );
  `)

  const applied = db
    .prepare(
      `
      SELECT version
      FROM migrations
      ORDER BY version
    `,
    )
    .all() as Array<{ version: number }>

  const appliedVersions = new Set(applied.map((migration) => migration.version))

  const applyMigration = db.transaction((migration: Migration) => {
    migration.up(db)

    db.prepare(
      `
      INSERT INTO migrations (
        version,
        name,
        applied_at
      )
      VALUES (?, ?, ?)
    `,
    ).run(migration.version, migration.name, Date.now())
  })

  for (const migration of migrations) {
    if (appliedVersions.has(migration.version)) {
      continue
    }

    applyMigration(migration)
  }
}
