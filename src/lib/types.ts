import { DocumentReference } from "firebase/firestore"

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
  'Name':string
  'LastName':string, 
  'IBKRUsername':string, 
  'IBKRPassword':string, 
  'Advisor':string | null
}


// Table
export type Selection = Document | Ticket


// Document Center
export interface Documents {
  [key:string]: Document[]
}

export type Document = ClientDocument | STAT
export type ClientDocument = POA | POI

export type POA = {
  'TicketID': string
  'Timestamp': string
  'AccountNumber': string
  'IssuedDate': string
  'ExpirationDate':string
  'Type':string
  'URL':string | null
}
export type POI = {
  'TicketID': string
  'Timestamp': string
  'AccountNumber': string
  'IssuedDate': string
  'ExpirationDate':string
  'Type':string
}
export type STAT = {
  'Timestamp': string
  'AccountNumber': string
  'Type':string
}