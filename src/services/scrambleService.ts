import { randomScrambleForEvent } from 'cubing/scramble'
import { Puzzle, PUZZLES } from '../domain/puzzle'

export class ScrambleService {
  async generate(puzzle: Puzzle): Promise<string> {
    const event = PUZZLES[puzzle].scramble
    const scramble = await randomScrambleForEvent(event)
    return scramble.toString()
  }
}
