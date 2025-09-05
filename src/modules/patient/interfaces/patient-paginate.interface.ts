import type { Patient } from './patient.interface'

export interface PatientPaginate {
  current_page: number
  data: Patient[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: Link[]
  next_page_url: string
  path: string
  per_page: number
  prev_page_url: string
  to: number
  total: number
}

export interface Link {
  url: string
  label: string
  active: boolean
}
