import type Database from 'better-sqlite3'
import { Solve } from '../../../src/domain/solve'
import { SolveModel } from './models/solve'
import { SolveMapper } from '../mappers/solveMapper'

export class SolveRepo {
  private readonly db: Database.Database
  private readonly solveMapper: SolveMapper

  constructor(db: Database.Database, solveMapper: SolveMapper) {
    this.db = db
    this.solveMapper = solveMapper
  }

  public getById(id: string): Solve | undefined {
    const row = this.db.prepare(` SELECT * FROM solves WHERE id = ?`).get(id)
    if (!row) return undefined
    return this.solveMapper.toDomain(row as SolveModel)
  }

  public getAll(): Solve[] {
    const rows = this.db.prepare(` SELECT * FROM solves ORDER BY created_at DESC`).all() as SolveModel[]
    return rows.map((row) => this.solveMapper.toDomain(row))
  }

  public getBySessionId(sessionId: string): Solve[] {
    const rows = this.db
      .prepare(`SELECT * FROM solves WHERE session_id = ? ORDER BY created_at DESC`)
      .all(sessionId) as SolveModel[]
    return rows.map((row) => this.solveMapper.toDomain(row))
  }

  public save(solve: Solve): void {
    const exists = !!this.getById(solve.id)
    if (!exists) {
      this.db
        .prepare(
          `INSERT INTO solves (id, session_id, time, penalty, scramble, puzzle, comment, created_at) VALUES (@id, @session_id, @time, @penalty, @scramble, @puzzle, @comment, @created_at)`,
        )
        .run(this.solveMapper.toPersistence(solve))
    } else {
      this.db
        .prepare(
          `UPDATE solves SET session_id = @session_id, time = @time, penalty = @penalty, scramble = @scramble, puzzle = @puzzle, comment = @comment WHERE id = @id`,
        )
        .run(this.solveMapper.toPersistence(solve))
    }
  }

  public delete(id: string): void {
    this.db.prepare(`DELETE FROM solves WHERE id = ?`).run(id)
  }
}
