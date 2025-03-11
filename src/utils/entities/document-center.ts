import { Document, DocumentCenter } from "@/lib/entities/document-center";
import { accessAPI } from "../api";

export async function ReadFolders():Promise<DocumentCenter> {

    let documentCenter = await accessAPI('/document_center/read', 'POST', {
        'query': {}
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


// TODO: Change params
export async function UploadFile(file: File, file_name: string, mime_type: string, parent_folder_id: string, document_info: any, uploader: string) {
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
        'uploader': uploader
    })
    console.log(uploadedFile)
    return uploadedFile
}