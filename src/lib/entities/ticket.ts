import { Map } from "../types"

export interface Ticket {
    'TicketID': string
    'Status': string
    'ApplicationInfo':Map
    'Advisor':string | null
    'UserID':string
    'MasterAccount':string
    'LeadID':string
  }
  