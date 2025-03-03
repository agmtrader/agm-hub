import { Document } from "@/lib/entities/drive";
import { accessAPI } from "../api"

export async function GetFilesInFolder(folderID: string, query: any) {
    const response = await accessAPI('/database/read', 'POST', {
        'path': `db/document_center/${folderID}`,
        'query': query
    })
    return response
}

export async function UploadFile(file: string, fileName: string, mimeType: string, parentFolderID: string) {
    let filePayload = {
        file: file,
        file_name: fileName,
        mime_type: mimeType,
        parent_folder_id: parentFolderID
    }
    let uploadedFile = await accessAPI('/drive/upload_file', 'POST', filePayload);
    return uploadedFile
}

export async function CreateDatabaseEntry(selectedType: string, timestamp: string, fileInfo: any, values: any, session: any) {

    let documentPayload:Document = {
        Category: selectedType,
        DocumentID: timestamp,
        FileInfo: fileInfo['content'],
        DocumentInfo: values,
        Uploader: session?.user?.email || 'Error finding uploader.'
    }

    let response = await accessAPI('/database/create', 'POST', {
        data: documentPayload,
        path: `db/document_center/${selectedType}`,
        id: timestamp
    })
    return response
}

export async function DeleteFile(fileDriveId: string) {
    let deletedFile = await accessAPI('/drive/delete_file', 'POST', {
        'file_id': fileDriveId,
    })
    return deletedFile
}

export async function DeleteDatabaseEntry(documentID: string, currentFolderID: string) {
    let deletedDocument = await accessAPI('/database/delete', 'POST', {
        'path': `db/document_center/${currentFolderID}`,
        'query': {
          'DocumentID': documentID,
        }
    })
    return deletedDocument
}