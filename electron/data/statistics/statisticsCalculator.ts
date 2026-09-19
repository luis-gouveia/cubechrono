import { Solve } from '../../../src/domain/solve'
import { AverageResultDTO, SessionStatsDTO, SolveStatsDTO } from '../../../src/types/dtos/statistics'

export class StatisticsCalculator {
  public calculateSessionStats(solves: Solve[]): SessionStatsDTO {
    const validSolves = solves.filter((solve) => solve.effectiveTime !== undefined)
    const solveStats = this.calculateSolveStats(solves)
    const lastSolveStats = solveStats[0]

    return {
      solves: {
        total: solves.length,
        completed: validSolves.length,
        plusTwo: solves.filter((solve) => solve.penalty === '+2').length,
        dnf: solves.filter((solve) => solve.penalty === 'DNF').length,
      },
      mean: this.calculateMean(validSolves),
      current: solves[0]?.effectiveTime,
      best: this.calculateBestSolve(validSolves),
      ao5: lastSolveStats?.stats.ao5 ?? { status: 'unavailable' },
      ao12: lastSolveStats?.stats.ao12 ?? { status: 'unavailable' },
      bestAo5: this.calculateBestAverage(solveStats, 'ao5'),
      bestAo12: this.calculateBestAverage(solveStats, 'ao12'),
    }
  }

  public calculateSolveStats(solves: Solve[]): { solve: Solve; stats: SolveStatsDTO }[] {
    const chronologicalSolves = [...solves].reverse()
    const chronologicalStats = chronologicalSolves.map((solve, index) => ({
      solve,
      stats: {
        ao5: this.calculateAverage(chronologicalSolves, index, 5),
        ao12: this.calculateAverage(chronologicalSolves, index, 12),
      },
    }))
    return chronologicalStats.reverse()
  }

  private calculateMean(solves: Solve[]): number | undefined {
    const times = solves.map((solve) => solve.effectiveTime).filter((time): time is number => time !== undefined)
    if (times.length === 0) return undefined

    const total = times.reduce((sum, time) => sum + time, 0)
    return total / times.length
  }

  private calculateBestSolve(solves: Solve[]): SessionStatsDTO['best'] {
    const validSolves = solves.filter((solve) => solve.effectiveTime !== undefined)
    if (validSolves.length === 0) return undefined

    const bestSolve = validSolves.reduce((best, solve) => {
      if (solve.effectiveTime! < best.effectiveTime!) return solve
      return best
    })

    return {
      value: bestSolve.effectiveTime!,
      completedAt: bestSolve.createdAt.toISOString(),
    }
  }

  private calculateAverage(solves: Solve[], endIndex: number, size: number): AverageResultDTO {
    const startIndex = endIndex - size + 1
    if (startIndex < 0) return { status: 'unavailable' }

    const window = solves.slice(startIndex, endIndex + 1)
    const dnfCount = window.filter((solve) => solve.effectiveTime === undefined).length
    if (dnfCount > 1) return { status: 'DNF' }

    const validSolves = window
      .filter((solve) => solve.effectiveTime !== undefined)
      .sort((a, b) => a.effectiveTime! - b.effectiveTime!)

    if (dnfCount === 1) {
      const trimmed = validSolves.slice(1)
      return {
        status: 'value',
        value: this.calculateAverageValue(trimmed),
        completedAt: solves[endIndex].createdAt.toISOString(),
      }
    }

    const trimmed = validSolves.slice(1, -1)
    return {
      status: 'value',
      value: this.calculateAverageValue(trimmed),
      completedAt: solves[endIndex].createdAt.toISOString(),
    }
  }

  private calculateAverageValue(solves: Solve[]): number {
    const total = solves.reduce((sum, solve) => sum + solve.effectiveTime!, 0)
    return total / solves.length
  }

  private calculateBestAverage(
    solveStats: { solve: Solve; stats: SolveStatsDTO }[],
    key: 'ao5' | 'ao12',
  ): AverageResultDTO {
    const successfulAverages = solveStats
      .map((stats) => stats.stats[key])
      .filter((average): average is Extract<AverageResultDTO, { status: 'value' }> => average.status === 'value')

    if (successfulAverages.length === 0) return { status: 'unavailable' }
    return successfulAverages.reduce((best, average) => (average.value < best.value ? average : best))
  }
}
