import type Database from 'better-sqlite3'
import { Session } from '../../../src/domain/session'
import { SessionModel } from './models/session'
import { SessionMapper } from '../mappers/sessionMapper'

export class SessionRepo {
  private readonly db: Database.Database
  private readonly sessionMapper: SessionMapper

  constructor(db: Database.Database, sessionMapper: SessionMapper) {
    this.db = db
    this.sessionMapper = sessionMapper
  }

  public getById(id: string): Session | undefined {
    const row = this.db.prepare(`SELECT * FROM sessions WHERE id = ?`).get(id)
    if (!row) return undefined
    return this.sessionMapper.toDomain(row as SessionModel)
  }

  public getAll(): Session[] {
    const rows = this.db.prepare(`SELECT * FROM sessions ORDER BY position ASC`).all() as SessionModel[]
    return rows.map(this.sessionMapper.toDomain)
  }

  public save(session: Session): void {
    const exists = !!this.getById(session.id)
    if (!exists) {
      this.db
        .prepare(
          `INSERT INTO sessions (id, name, description, puzzle, position, created_at) VALUES (@id, @name, @description, @puzzle, @position, @created_at)`,
        )
        .run(this.sessionMapper.toPersistence(session))
    } else {
      this.db
        .prepare(
          `UPDATE sessions SET name = @name, description = @description, puzzle = @puzzle, position = @position WHERE id = @id`,
        )
        .run(this.sessionMapper.toPersistence(session))
    }
  }

  public delete(id: string): void {
    this.db.prepare(`DELETE FROM sessions WHERE id = ?`).run(id)
  }
}
