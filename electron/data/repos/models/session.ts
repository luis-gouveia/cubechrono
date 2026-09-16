export interface SessionModel {
  id: string
  name: string
  description: string | null
  puzzle: string
  position: number
  created_at: number
}
