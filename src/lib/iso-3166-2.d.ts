declare module 'iso-3166-2' {
  export interface Country {
    code: string
    alpha3?: string
    name: string
    sub: Record<string, string>
  }

  export interface ISO3166 {
    data: Record<string, Country>
    subdivision(code: string): any
    country(alpha2: string): Country | undefined
  }

  const iso: ISO3166
  export default iso
}
