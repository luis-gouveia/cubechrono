import { Puzzle } from '../../../src/domain/puzzle'
import { Session } from '../../../src/domain/session'
import type { SessionDTO } from '../../../src/types/dtos/session'
import { SessionModel } from '../repos/models/session'

export class SessionMapper {
  public toDomain(row: SessionModel): Session {
    return Session.from({
      id: row.id,
      name: row.name,
      description: row.description ?? undefined,
      puzzle: row.puzzle as Puzzle,
      position: row.position,
      createdAt: new Date(row.created_at),
    })
  }

  public toPersistence(session: Session): SessionModel {
    return {
      id: session.id,
      name: session.name,
      description: session.description ?? null,
      puzzle: session.puzzle,
      position: session.position,
      created_at: session.createdAt.getTime(),
    }
  }

  public toDTO(session: Session): SessionDTO {
    return {
      id: session.id,
      name: session.name,
      description: session.description,
      puzzle: session.puzzle,
      position: session.position,
      createdAt: session.createdAt.toISOString(),
    }
  }
}
