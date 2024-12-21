import { Map } from "./types"

export type FolderDictionary = {
    drive_id: string
    id: string
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

export type GoogleDriveFile = {
    'createdTime': string
    'id': string
    'mimeType': string
    'modifiedTime': string
    'name': string
    'parents': string[]
}

// Static folder dictionary
export const defaultFolderDictionary: FolderDictionary[] = [
    { drive_id: '1tuS0EOHoFm9TiJlv3uyXpbMrSgIKC2QL', id: 'poa', label: 'Proof of Address' },
    { drive_id: '1VY0hfcj3EKcDMD6O_d2_gmiKL6rSt_M3', id: 'identity', label: 'Proof of Identity' },
    { drive_id: '1WNJkWYWPX6LqWGOTsdq6r1ihAkPJPMHb', id: 'sow', label: 'Source of Wealth' },
    { drive_id: '1ik8zbnEJ9fdruy8VPQ59EQqK6ze6cc4-', id: 'deposits', label: 'Deposits and Withdrawals' },
    { drive_id: '1-SB4FB1AukcpTMHlDXkfmqTHBOASX8iB', id: 'manifest', label: 'Manifests' },
]