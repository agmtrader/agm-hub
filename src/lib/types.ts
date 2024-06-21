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

export type Client = {
  'ClientID': string
  'Status': string
  'Documents':DocumentReference
}

export type Ticket = {
  'TicketID': string
  'Status': string
  'ApplicationInfo':Map
  'Advisor':string | null
}

export interface Map {
    [key: string]: string | string[] | Date | undefined
}
