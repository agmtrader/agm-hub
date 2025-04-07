import { Document, DocumentCenter, FolderDictionary } from "@/lib/entities/document-center";
import { accessAPI } from "../api";
import { Map } from "@/lib/types";

export async function GetFolderDictionary():Promise<FolderDictionary[]> {

    let folderDictionary = await accessAPI('/document_center/get_folder_dictionary', 'GET')
    return folderDictionary
}

export async function ReadFolders(query?: Map):Promise<DocumentCenter> {

    let documentCenter = await accessAPI('/document_center/read', 'POST', {
        'query': query || {}
    })
    return documentCenter
}

export async function DeleteFile(document: Document, parentFolderId: string) {

    let deletedFile = await accessAPI('/document_center/delete', 'POST', {
        'document': document,
        'parent_folder_id': parentFolderId
    })
    return deletedFile
}

export async function UploadFile(file: File, file_name: string, mime_type: string, parent_folder_id: string, document_info: any, uploader: string, bucketId: string) {
    // Convert File object to base64
    const fileData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

    let uploadedFile = await accessAPI('/document_center/upload', 'POST', {
        'file_name': file_name,
        'mime_type': mime_type,
        'file_data': fileData,
        'parent_folder_id': parent_folder_id,
        'document_info': document_info,
        'uploader': uploader,
        'bucket_id': bucketId
    })
    console.log(uploadedFile)
    return uploadedFile
}