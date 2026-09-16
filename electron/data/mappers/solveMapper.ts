import { Puzzle } from '../../../src/domain/puzzle'
import { Solve } from '../../../src/domain/solve'
import type { SolveDTO } from '../../../src/types/dtos/solve'
import { SolvePenalty } from '../../../src/types/solve'
import { SolveModel } from '../repos/models/solve'

export class SolveMapper {
  public toDomain(row: SolveModel): Solve {
    return Solve.from({
      id: row.id,
      sessionId: row.session_id,
      time: row.time,
      penalty: row.penalty as SolvePenalty,
      puzzle: row.puzzle as Puzzle,
      scramble: row.scramble,
      comment: row.comment ?? undefined,
      createdAt: new Date(row.created_at),
    })
  }

  public toPersistence(solve: Solve): SolveModel {
    return {
      id: solve.id,
      session_id: solve.sessionId,
      time: solve.time,
      penalty: solve.penalty,
      puzzle: solve.puzzle,
      scramble: solve.scramble,
      comment: solve.comment ?? null,
      created_at: solve.createdAt.getTime(),
    }
  }

  public toDTO(solve: Solve): SolveDTO {
    return {
      id: solve.id,
      sessionId: solve.sessionId,
      time: solve.time,
      penalty: solve.penalty,
      puzzle: solve.puzzle,
      scramble: solve.scramble,
      comment: solve.comment,
      createdAt: solve.createdAt.toISOString(),
    }
  }
}
