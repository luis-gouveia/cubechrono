import { Solve } from '../../../src/domain/solve'
import { SolveRepo } from '../repos/solveRepo'
import { CreateSolveDTO, SolveDTO, UpdateSolveDTO } from '../../../src/types/dtos/solve'
import { SolveMapper } from '../mappers/solveMapper'
import { StatisticsCalculator } from '../statistics/statisticsCalculator'
import { Puzzle } from '../../../src/domain/puzzle'
import { PuzzleStatsDTO } from '../../../src/types/dtos/statistics'

export class SolveService {
  private readonly solveRepo: SolveRepo
  private readonly solveMapper: SolveMapper
  private readonly statisticsCalculator: StatisticsCalculator

  constructor(solveRepo: SolveRepo, solveMapper: SolveMapper, statisticsCalculator: StatisticsCalculator) {
    this.solveRepo = solveRepo
    this.solveMapper = solveMapper
    this.statisticsCalculator = statisticsCalculator
  }

  public getById(id: string): SolveDTO {
    const solve = this.solveRepo.getById(id)
    if (!solve) throw new Error('Solve not found!')
    return this.solveMapper.toDTO(solve)
  }

  public getBySessionId(sessionId: string): SolveDTO[] {
    const solves = this.solveRepo.getBySessionId(sessionId)
    const solvesWithStats = this.statisticsCalculator.calculateSolveStats(solves)
    return solvesWithStats.map(({ solve, stats }) => this.solveMapper.toDTO(solve, stats))
  }

  public create(input: CreateSolveDTO): SolveDTO {
    const solve = Solve.create(input)
    this.solveRepo.save(solve)
    return this.solveMapper.toDTO(solve)
  }

  public update(input: UpdateSolveDTO): SolveDTO {
    const { id, ...updatedFields } = input
    const solve = this.solveRepo.getById(id)
    if (!solve) throw new Error('Solve not found!')

    solve.update(updatedFields)
    this.solveRepo.save(solve)
    return this.solveMapper.toDTO(solve)
  }

  public delete(id: string): void {
    this.solveRepo.delete(id)
  }

  public getPuzzleStats(puzzle: Puzzle): PuzzleStatsDTO {
    const solves = this.solveRepo.getByPuzzle(puzzle)
    return this.statisticsCalculator.calculateSessionStats(solves)
  }
}
