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
import { useToast } from '@/hooks/use-toast'
import { useSession } from 'next-auth/react'
import { FolderDictionary } from '@/lib/entities/document-center'
import { FileUploader, FileUploaderContent, FileUploaderItem, FileInput } from '@/components/ui/file-upload'

import POAForm from './forms/POAForm'
import POIForm from './forms/POIForm'
import SOWForm from './forms/SOWForm'
import { UploadFile } from '@/utils/entities/document-center'

interface DocumentUploaderProps {
    folderDictionary: FolderDictionary[]
    accountNumber?: string
    onUploadSuccess?: () => void
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ 
    folderDictionary, 
    accountNumber, 
    onUploadSuccess
}) => {
    const { data: session } = useSession()
    const { toast } = useToast()

    const [selectedType, setSelectedType] = useState<string>(folderDictionary[0].id)
    const [uploading, setUploading] = useState<boolean>(false)
    const [files, setFiles] = useState<File[] | null>(null)
    const [open, setOpen] = useState(false)

    const renderForm = () => {
        switch(selectedType) {
            case 'poa':
                return <POAForm onSubmit={(values) => handleSubmit(values)} accountNumber={accountNumber} uploading={uploading} />
            case 'identity':
                return <POIForm onSubmit={(values) => handleSubmit(values)} accountNumber={accountNumber} uploading={uploading} />
            case 'sow':
                return <SOWForm onSubmit={(values) => handleSubmit(values)} accountNumber={accountNumber} uploading={uploading} />
            default:
                return null
        }
    }

    const handleSubmit = async (values: any) => {
        setUploading(true)
        try {
            if (!session?.user?.email) throw new Error("User not authenticated")
            if (!files || files.length === 0) throw new Error("Please select a file to upload")
            
            const file = files[0]
            const parent_folder_id = folderDictionary.find((folder) => folder.id === selectedType)?.drive_id || ''
            
            await UploadFile(file, file.name, file.type, parent_folder_id, values, session.user.email)

            toast({
                title: "Success",
                description: "Document uploaded successfully",
                variant: "default",
            })
        
            setFiles(null)
            setSelectedType(folderDictionary[0].id)
            setOpen(false)
            setUploading(false)
            onUploadSuccess?.()

        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "An unknown error occurred",
                variant: "destructive",
            })
            setUploading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className='w-fit h-fit flex gap-x-5'>
                    <Upload className='h-4 w-4' />
                    Upload
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[50%]">
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
                        {folderDictionary.map(field => (
                            <SelectItem key={field.id} value={field.id}>{field.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <FileUploader
                    value={files}
                    onValueChange={setFiles}
                    dropzoneOptions={{
                        maxFiles: 1,
                        maxSize: 10 * 1024 * 1024,
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
    )
}

export default DocumentUploader
