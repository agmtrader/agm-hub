import { Base } from './base'

export type ApplicationProvider = Base & {
  color_scheme: Record<string, string>
}
