import { Session } from '../../../src/domain/session'
import { SessionRepo } from '../repos/sessionRepo'
import { CreateSessionDTO, SessionDTO, UpdateSessionDTO } from '../../../src/types/dtos/session'
import { SessionMapper } from '../mappers/sessionMapper'
import { StatisticsCalculator } from '../statistics/statisticsCalculator'
import { SolveRepo } from '../repos/solveRepo'

export class SessionService {
  private readonly sessionRepo: SessionRepo
  private readonly solveRepo: SolveRepo
  private readonly sessionMapper: SessionMapper
  private readonly statisticsCalculator: StatisticsCalculator

  constructor(
    sessionRepo: SessionRepo,
    solveRepo: SolveRepo,
    sessionMapper: SessionMapper,
    statisticsCalculator: StatisticsCalculator,
  ) {
    this.sessionRepo = sessionRepo
    this.solveRepo = solveRepo
    this.sessionMapper = sessionMapper
    this.statisticsCalculator = statisticsCalculator
  }

  public getById(id: string): SessionDTO {
    const session = this.sessionRepo.getById(id)
    if (!session) throw new Error('Session not found!')
    return this.sessionMapper.toDTO(session, this.getStats(session.id))
  }

  public getAll(): SessionDTO[] {
    const sessions = this.sessionRepo.getAll()
    return sessions.map((session) => {
      return this.sessionMapper.toDTO(session, this.getStats(session.id))
    })
  }

  public create(input: CreateSessionDTO): SessionDTO {
    const sessions = this.sessionRepo.getAll()
    const session = Session.create({ ...input, position: sessions.length })
    this.sessionRepo.save(session)
    return this.sessionMapper.toDTO(session)
  }

  public update(input: UpdateSessionDTO): SessionDTO {
    const { id, ...updatedFields } = input
    const session = this.sessionRepo.getById(id)
    if (!session) throw new Error('Session not found!')

    if (updatedFields.position && updatedFields.position !== session.position) {
      const sessions = this.sessionRepo.getAll()
      this.reorderSessions(session, sessions)
    }

    session.update(updatedFields)
    this.sessionRepo.save(session)
    return this.sessionMapper.toDTO(session)
  }

  public delete(id: string): void {
    const session = this.sessionRepo.getById(id)
    if (!session) throw new Error('Session not found!')

    const sessions = this.sessionRepo.getAll()
    if (sessions.length === 1) throw new Error('You have to have at least one session!')

    this.sessionRepo.delete(id)
    this.reorderSessions(session, sessions)
  }

  private reorderSessions(session: Session, sessions: Session[]): void {
    const sessionsToReorder = sessions.filter((s) => s.id !== session.id)
    sessionsToReorder.forEach((sessionToReorder, index) => {
      if (sessionToReorder.position !== index) {
        sessionToReorder.update({ position: index })
        this.sessionRepo.save(sessionToReorder)
      }
    })
  }

  private getStats(sessionId: string) {
    const solves = this.solveRepo.getBySessionId(sessionId)
    return this.statisticsCalculator.calculateSessionStats(solves)
  }
}
