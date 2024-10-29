"use client"
import React, { useState } from 'react'
import { Upload } from "lucide-react"
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { poa_schema, poi_schema, sow_schema } from "@/lib/form"
import { useToast } from '@/hooks/use-toast'
import POAForm from './forms/POAForm'
import POIForm from './forms/POIForm'
import SOWForm from './forms/SOWForm'
import { accessAPI } from '@/utils/api'
import { Document } from '@/lib/types'
import { useSession } from 'next-auth/react'
import { formatTimestamp } from '@/utils/dates'
import { FolderDictionary } from './DocumentCenter'
import { FileUploader, FileUploaderContent, FileUploaderItem, FileInput } from '@/components/ui/file-upload'

interface DocumentUploaderProps {
  folderDictionary: FolderDictionary[]
  accountNumber?: string
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ folderDictionary, accountNumber }) => {

    const { data: session } = useSession()
    const [selectedType, setSelectedType] = useState<string>(folderDictionary[0].id)
    const { toast } = useToast()

    const [uploading, setUploading] = useState<boolean>(false)

    const [files, setFiles] = useState<File[] | null>(null)

    const typeFields = folderDictionary.map(folder => ({
        ...folder,
        schema: folder.id === 'poa' ? poa_schema :
                folder.id === 'identity' ? poi_schema :
                folder.id === 'sow' ? sow_schema :
                null
    }))

    const renderForm = () => {
        switch(selectedType) {
            case 'poa':
                return <POAForm onSubmit={(values) => handleSubmit(values, files)} accountNumber={accountNumber} uploading={uploading} />
            case 'identity':
                return <POIForm onSubmit={(values) => handleSubmit(values, files)} accountNumber={accountNumber} uploading={uploading} />
            case 'sow':
                return <SOWForm onSubmit={(values) => handleSubmit(values, files)} accountNumber={accountNumber} uploading={uploading} />
            default:
                return null
        }
    }

    const handleSubmit = async (values: any, files: File[] | null) => {
        setUploading(true)
        try {
            if (!files || files.length === 0) {
                throw new Error("Please select a file to upload");
            }

            const file = files[0]; // We're only using the first file

            const timestamp = formatTimestamp(new Date())

            // Read the file as a data URL
            const base64File = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            let filePayload = {
                file: base64File, // This now includes the full data URL
                fileName: file.name,
                mimeType: file.type,
                parentFolderId: typeFields.find((field) => field.id === selectedType)?.drive_id || ''
            }

            console.log(filePayload)

            let fileInfo = await accessAPI('/drive/upload_file', 'POST', filePayload);

            if (fileInfo['status'] !== 'success') {
                throw new Error(fileInfo['content']);
            }

            console.log(fileInfo)
            
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
            console.log(response)

            toast({
                title: "Success",
                description: "Document uploaded successfully",
                variant: "default",
            });

            setUploading(false)

        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "An unknown error occurred",
                variant: "destructive",
            });
        }
    }

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className='w-fit h-fit flex gap-x-5'>
                        <Upload className='h-4 w-4' />
                        Upload
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Upload</DialogTitle>
                        <DialogDescription>
                            Upload to the document center
                        </DialogDescription>
                    </DialogHeader>
                    <Select 
                        onValueChange={(value) => setSelectedType(value)}
                        defaultValue={selectedType}
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                        <SelectContent>
                            {typeFields.map(field => (
                                <SelectItem key={field.id} value={field.id}>{field.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FileUploader
                        value={files}
                        onValueChange={setFiles}
                        dropzoneOptions={{
                            maxFiles: 1,
                            maxSize: 10 * 1024 * 1024, // 10MB
                            accept: {
                                'application/pdf': ['.pdf'],
                                'image/*': ['.png', '.jpg', '.jpeg']
                            }
                        }}
                    >
                        <FileInput>
                            <div className="flex flex-col items-center justify-center p-4 text-center">
                                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">
                                    Drag & drop or click to upload
                                </p>
                            </div>
                        </FileInput>
                        <FileUploaderContent>
                            {files?.map((f, i) => (
                                <FileUploaderItem key={i} index={i}>
                                    {f.name}
                                </FileUploaderItem>
                            ))}
                        </FileUploaderContent>
                    </FileUploader>
                    {renderForm()}
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default DocumentUploader
