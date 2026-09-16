export interface SolveModel {
  id: string
  session_id: string
  time: number
  penalty: string
  puzzle: string
  scramble: string
  comment: string | null
  created_at: number
}
