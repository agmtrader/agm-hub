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
import { FileUploader, FileUploaderContent, FileUploaderItem, FileInput } from '@/components/ui/file-upload'
import POAForm from './POAForm'
import POIForm from './POIForm'

export type DocumentType = 'POA' | 'POI';

interface Props {
    documentType: DocumentType;
    handleSubmit: (documentType: DocumentType, values: any, files: File[] | null) => void;
}

const DocumentUploader = ({ documentType, handleSubmit }: Props) => {

    const [uploading, setUploading] = useState<boolean>(false)
    const [files, setFiles] = useState<File[] | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)

    const handleUpload = async (values: any) => {
        setUploading(true)
        handleSubmit(documentType, values, files)

        setUploading(false)
        setDialogOpen(false)
        setFiles(null)
    }

    const FormComponent = documentType === 'POA' ? POAForm : POIForm;

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button className='w-fit h-fit flex gap-x-5 bg-transparent hover:bg-transparent' variant='ghost'>
                    <Upload className='h-4 w-4' />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[80vw] sm:max-w-[50%]">
                <DialogHeader>
                    <DialogTitle>Upload document</DialogTitle>
                    <DialogDescription>
                        for your application
                    </DialogDescription>
                </DialogHeader>
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
                            <FileUploaderItem key={i} index={i} className='py-1'>
                                {f.name}
                            </FileUploaderItem>
                        ))}
                    </FileUploaderContent>
                </FileUploader>
                <FormComponent onSubmit={handleUpload} uploading={uploading} />
            </DialogContent>
        </Dialog>
    )
}

export default DocumentUploader;
