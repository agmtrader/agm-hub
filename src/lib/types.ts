// Array of objects or object of any
export interface Map {
    [key: string]: any
}

// Tickets
export interface Ticket {
  'TicketID': string
  'Status': string
  'ApplicationInfo':Map
  'Advisor':string | null
}

// Account Access
export interface Account {
  'AccountID':string
  'TicketID':string
  'TemporalEmail':string
  'TemporalPassword':string
  'AccountNumber':string
  'IBKRUsername':string, 
  'IBKRPassword':string, 
  'Advisor':string | null
}

// Table
export type Selection = Document | Ticket

// Document Center
export type Document = {
  'DocumentID': string
  'DocumentInfo':Map
  'FileInfo':Map
  'Uploader':string
  'Category':string
}
export type Drive = {
  [key: string]: Document[]
}

// Download types
export enum DeviceTypes{
  PC,
  MOBILE
}
export enum osTypes {
  WINDOWS,
  LINUX,
  MACOS,
  ANDROID,
  IOS
}