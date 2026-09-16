import { Solve } from '../../../src/domain/solve'
import { SolveRepo } from '../repos/solveRepo'
import { CreateSolveDTO, SolveDTO, UpdateSolveDTO } from '../../../src/types/dtos/solve'
import { SolveMapper } from '../mappers/solveMapper'

export class SolveService {
  private readonly solveRepo: SolveRepo
  private readonly solveMapper: SolveMapper

  constructor(solveRepo: SolveRepo, solveMapper: SolveMapper) {
    this.solveRepo = solveRepo
    this.solveMapper = solveMapper
  }

  public getById(id: string): SolveDTO {
    const solve = this.solveRepo.getById(id)
    if (!solve) throw new Error('Solve not found!')
    return this.solveMapper.toDTO(solve)
  }

  public getBySessionId(sessionId: string): SolveDTO[] {
    const solves = this.solveRepo.getBySessionId(sessionId)
    return solves.map(this.solveMapper.toDTO)
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
}
