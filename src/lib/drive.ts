import { Map } from "./types"

export type FolderDictionary = {
    drive_id: string
    id: string
    name: string
    label: string
}

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

// Static folder dictionary
export const folderDictionary: FolderDictionary[] = [
    { drive_id: '1tuS0EOHoFm9TiJlv3uyXpbMrSgIKC2QL', id: 'poa', name: 'POA', label: 'Proof of Address' },
    { drive_id: '1VY0hfcj3EKcDMD6O_d2_gmiKL6rSt_M3', id: 'identity', name: 'Identity', label: 'Proof of Identity' },
    { drive_id: '1WNJkWYWPX6LqWGOTsdq6r1ihAkPJPMHb', id: 'sow', name: 'SOW', label: 'Source of Wealth' },
]