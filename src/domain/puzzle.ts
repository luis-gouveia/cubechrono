import z from 'zod'
import { PuzzleID as Renderer } from 'cubing/twisty'

export const PUZZLE = {
  TWO_BY_TWO: '2x2',
  THREE_BY_THREE: '3x3',
  FOUR_BY_FOUR: '4x4',
  FIVE_BY_FIVE: '5x5',
  SIX_BY_SIX: '6x6',
  SEVEN_BY_SEVEN: '7x7',
  THREE_BY_THREE_ONE_HANDED: '3x3-oh',
  THREE_BY_THREE_BLIND: '3x3-blind',
  CLOCK: 'clock',
  MEGAMINX: 'megaminx',
  PYRAMINX: 'pyraminx',
  SKEWB: 'skewb',
  SQUARE_ONE: 'square-1',
  KILOMINX: 'kilominx',
} as const
export type Puzzle = (typeof PUZZLE)[keyof typeof PUZZLE]

export const puzzleSchema = z.enum(PUZZLE)

export interface PuzzleDefinition {
  id: Puzzle
  label: string
  scramble: string
  renderer: Renderer
}

export const PUZZLES: Record<Puzzle, PuzzleDefinition> = {
  [PUZZLE.TWO_BY_TWO]: {
    id: PUZZLE.TWO_BY_TWO,
    label: '2x2x2',
    scramble: '222',
    renderer: '2x2x2',
  },
  [PUZZLE.THREE_BY_THREE]: {
    id: PUZZLE.THREE_BY_THREE,
    label: '3x3x3',
    scramble: '333',
    renderer: '3x3x3',
  },
  [PUZZLE.FOUR_BY_FOUR]: {
    id: PUZZLE.FOUR_BY_FOUR,
    label: '4x4x4',
    scramble: '444',
    renderer: '4x4x4',
  },
  [PUZZLE.FIVE_BY_FIVE]: {
    id: PUZZLE.FIVE_BY_FIVE,
    label: '5x5x5',
    scramble: '555',
    renderer: '5x5x5',
  },
  [PUZZLE.SIX_BY_SIX]: {
    id: PUZZLE.SIX_BY_SIX,
    label: '6x6x6',
    scramble: '666',
    renderer: '6x6x6',
  },
  [PUZZLE.SEVEN_BY_SEVEN]: {
    id: PUZZLE.SEVEN_BY_SEVEN,
    label: '7x7x7',
    scramble: '777',
    renderer: '7x7x7',
  },
  [PUZZLE.THREE_BY_THREE_ONE_HANDED]: {
    id: PUZZLE.THREE_BY_THREE_ONE_HANDED,
    label: '3x3x3 OH',
    scramble: '333oh',
    renderer: '3x3x3',
  },
  [PUZZLE.THREE_BY_THREE_BLIND]: {
    id: PUZZLE.THREE_BY_THREE_BLIND,
    label: '3x3x3 BF',
    scramble: '333bf',
    renderer: '3x3x3',
  },
  [PUZZLE.CLOCK]: {
    id: PUZZLE.CLOCK,
    label: 'Clock',
    scramble: 'clock',
    renderer: 'clock',
  },
  [PUZZLE.MEGAMINX]: {
    id: PUZZLE.MEGAMINX,
    label: 'Megaminx',
    scramble: 'minx',
    renderer: 'megaminx',
  },
  [PUZZLE.PYRAMINX]: {
    id: PUZZLE.PYRAMINX,
    label: 'Pyraminx',
    scramble: 'pyram',
    renderer: 'pyraminx',
  },
  [PUZZLE.SKEWB]: {
    id: PUZZLE.SKEWB,
    label: 'Skewb',
    scramble: 'skewb',
    renderer: 'skewb',
  },
  [PUZZLE.SQUARE_ONE]: {
    id: PUZZLE.SQUARE_ONE,
    label: 'Square-1',
    scramble: 'sq1',
    renderer: 'square1',
  },
  [PUZZLE.KILOMINX]: {
    id: PUZZLE.KILOMINX,
    label: 'Kilominx',
    scramble: 'kilominx',
    renderer: 'kilominx',
  },
}
