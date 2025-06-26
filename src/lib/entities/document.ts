import { poa_schema } from "../schemas/document"
import { poi_schema } from "../schemas/document"
import { sow_schema } from "../schemas/document"
import { z } from "zod"

export interface Bucket {
    'drive_id': string
    'database_table': string
    'id': string
    'name': string
    'files': POADocument[]
}

export type FileInfo = {
    'drive_id':string
    'mime_type':string
    'name':string
    'parents':string[]
}

export type POADocument = FileInfo & POADocumentInfo

export type POADocumentInfo = z.infer<typeof poa_schema>
export type POIDocumentInfo = z.infer<typeof poi_schema>
export type SOWDocumentInfo = z.infer<typeof sow_schema>

// We send this to the API for creating documents
export interface File {
    'file_name': string
    'file_data': string
    'mime_type': string
}