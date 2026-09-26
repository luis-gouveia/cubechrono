import Database from 'better-sqlite3'
import { app } from 'electron'
import path from 'node:path'
import { runMigrations } from './migrations'
import { SessionRepo } from '../repos/sessionRepo'
import { SolveRepo } from '../repos/solveRepo'
import { SessionService } from '../services/sessionService'
import { SolveService } from '../services/solveService'
import { sessionMapper, solveMapper } from '../mappers'
import { Session } from '../../../src/domain/session'
import { StatisticsCalculator } from '../statistics/statisticsCalculator'

let db: Database.Database | undefined = undefined

export function getDatabase(): Database.Database {
  if (db) return db

  const databasePath = path.join(app.getPath('userData'), 'cubechrono.db')
  db = new Database(databasePath)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')
  return db
}

function ensureDefaultSession(sessionRepo: SessionRepo): void {
  const sessions = sessionRepo.getAll()
  if (sessions.length) return
  const defaultSession = Session.create({ name: 'Session 1', puzzle: '3x3', position: 0 })
  sessionRepo.save(defaultSession)
}

export function initializeDatabase() {
  const database = getDatabase()
  runMigrations(database)

  const sessionRepo = new SessionRepo(database, sessionMapper)
  const solveRepo = new SolveRepo(database, solveMapper)
  const statisticsCalculator = new StatisticsCalculator()
  const sessionService = new SessionService(sessionRepo, solveRepo, sessionMapper, statisticsCalculator)
  const solveService = new SolveService(solveRepo, solveMapper, statisticsCalculator)

  ensureDefaultSession(sessionRepo)

  return {
    db: database,
    services: {
      sessions: sessionService,
      solves: solveService,
    },
  }
}
