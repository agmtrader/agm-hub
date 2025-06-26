import { Bucket, File as DocumentFile } from "@/lib/document";
import { accessAPI } from "../api";
import { POADocumentInfo } from "@/lib/document";

export async function ReadBuckets(): Promise<Bucket[]> {
    let buckets = await accessAPI(`/documents/clients/read`, 'POST', {'query': {}})
    return buckets
}

export async function DeleteFile(document: Document, bucketId: string): Promise<void> {
    await accessAPI('/documents/clients/delete', 'POST', {
        'document': document,
        'bucket_id': bucketId
    })
}

export async function UploadPOAFile(file: DocumentFile, documentInfo: POADocumentInfo, userId: string) {

    const created_poa_id = await accessAPI('/documents/clients/upload_poa', 'POST', {
        ...file,
        'document_info': documentInfo,  
        'user_id': userId,
    })

    return created_poa_id

}

export async function ConvertFileToBase64(file: File): Promise<string> {
    const fileData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
    return fileData
}