import z from 'zod'
import { PuzzleID as Renderer } from 'cubing/twisty'
import twoByTwoLogo from '../assets/puzzles/2x2.svg'
import threeByThreeLogo from '../assets/puzzles/3x3.svg'
import fourByFourLogo from '../assets/puzzles/4x4.svg'
import fiveByFiveLogo from '../assets/puzzles/5x5.svg'
import sixBySixLogo from '../assets/puzzles/6x6.svg'
import sevenBySevenLogo from '../assets/puzzles/7x7.svg'
import threeByThreeOhLogo from '../assets/puzzles/3x3oh.svg'
import threeByThreeBlindLogo from '../assets/puzzles/3x3bld.svg'
import clockLogo from '../assets/puzzles/clock.svg'
import megaminxLogo from '../assets/puzzles/megaminx.svg'
import pyraminxLogo from '../assets/puzzles/pyraminx.svg'
import skewbLogo from '../assets/puzzles/skewb.svg'
import squareOneLogo from '../assets/puzzles/square1.svg'
import kilominxLogo from '../assets/puzzles/kilominx.svg'

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
  logo: string
  color: string
}

export const PUZZLES: Record<Puzzle, PuzzleDefinition> = {
  [PUZZLE.TWO_BY_TWO]: {
    id: PUZZLE.TWO_BY_TWO,
    label: '2x2x2',
    scramble: '222',
    renderer: '2x2x2',
    logo: twoByTwoLogo,
    color: '#F7CA3299',
  },
  [PUZZLE.THREE_BY_THREE]: {
    id: PUZZLE.THREE_BY_THREE,
    label: '3x3x3',
    scramble: '333',
    renderer: '3x3x3',
    logo: threeByThreeLogo,
    color: '#1C71A4',
  },
  [PUZZLE.FOUR_BY_FOUR]: {
    id: PUZZLE.FOUR_BY_FOUR,
    label: '4x4x4',
    scramble: '444',
    renderer: '4x4x4',
    logo: fourByFourLogo,
    color: '#1D9F4C',
  },
  [PUZZLE.FIVE_BY_FIVE]: {
    id: PUZZLE.FIVE_BY_FIVE,
    label: '5x5x5',
    scramble: '555',
    renderer: '5x5x5',
    logo: fiveByFiveLogo,
    color: '#C93F39',
  },
  [PUZZLE.SIX_BY_SIX]: {
    id: PUZZLE.SIX_BY_SIX,
    label: '6x6x6',
    scramble: '666',
    renderer: '6x6x6',
    logo: sixBySixLogo,
    color: '#956FD6',
  },
  [PUZZLE.SEVEN_BY_SEVEN]: {
    id: PUZZLE.SEVEN_BY_SEVEN,
    label: '7x7x7',
    scramble: '777',
    renderer: '7x7x7',
    logo: sevenBySevenLogo,
    color: '#80B577',
  },
  [PUZZLE.THREE_BY_THREE_ONE_HANDED]: {
    id: PUZZLE.THREE_BY_THREE_ONE_HANDED,
    label: '3x3x3 OH',
    scramble: '333oh',
    renderer: '3x3x3',
    logo: threeByThreeOhLogo,
    color: '#CFB284',
  },
  [PUZZLE.THREE_BY_THREE_BLIND]: {
    id: PUZZLE.THREE_BY_THREE_BLIND,
    label: '3x3x3 BF',
    scramble: '333bf',
    renderer: '3x3x3',
    logo: threeByThreeBlindLogo,
    color: '#956FD6',
  },
  [PUZZLE.CLOCK]: {
    id: PUZZLE.CLOCK,
    label: 'Clock',
    scramble: 'clock',
    renderer: 'clock',
    logo: clockLogo,
    color: '#5285BE',
  },
  [PUZZLE.MEGAMINX]: {
    id: PUZZLE.MEGAMINX,
    label: 'Megaminx',
    scramble: 'minx',
    renderer: 'megaminx',
    logo: megaminxLogo,
    color: '#C93F39',
  },
  [PUZZLE.PYRAMINX]: {
    id: PUZZLE.PYRAMINX,
    label: 'Pyraminx',
    scramble: 'pyram',
    renderer: 'pyraminx',
    logo: pyraminxLogo,
    color: '#F7CA3299',
  },
  [PUZZLE.SKEWB]: {
    id: PUZZLE.SKEWB,
    label: 'Skewb',
    scramble: 'skewb',
    renderer: 'skewb',
    logo: skewbLogo,
    color: '#D76734',
  },
  [PUZZLE.SQUARE_ONE]: {
    id: PUZZLE.SQUARE_ONE,
    label: 'Square-1',
    scramble: 'sq1',
    renderer: 'square1',
    logo: squareOneLogo,
    color: '#CFB284',
  },
  [PUZZLE.KILOMINX]: {
    id: PUZZLE.KILOMINX,
    label: 'Kilominx',
    scramble: 'kilominx',
    renderer: 'kilominx',
    logo: kilominxLogo,
    color: '#1D9F4C',
  },
}
