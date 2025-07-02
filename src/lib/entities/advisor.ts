import { Base } from "./base"

export type Advisor = Base & {
  code: string
  agency: string
  hierarchy1: string
  hierarchy2: string
  name: string
  contact_id: string
}