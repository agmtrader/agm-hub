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
import { useToast } from '@/hooks/use-toast'
import { useSession } from 'next-auth/react'
import { FileUploader, FileUploaderContent, FileUploaderItem, FileInput } from '@/components/ui/file-upload'
import POAForm from './POAForm'
import { ConvertFileToBase64 } from '@/utils/entities/documents'
import { POADocumentInfo } from '@/lib/entities/document'
import { File as DocumentFile } from '@/lib/entities/document'
import { UploadTicketPOADocument } from '@/utils/entities/ticket'
import { Account, IndividualAccountApplicationInfo } from '@/lib/entities/account'
import { UploadAccountPOADocument } from '@/utils/entities/account'

interface Props {
    onUploadSuccess?: () => void
    account: Account
    accountInfo: IndividualAccountApplicationInfo
}

const POAUploader = ({ onUploadSuccess, account, accountInfo }: Props) => {
    
    const { data: session } = useSession()
    const { toast } = useToast()

    const [uploading, setUploading] = useState<boolean>(false)
    const [files, setFiles] = useState<File[] | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)

    const handleSubmit = async (values: any) => {
        setUploading(true)
        try {

            if (!session?.user?.email) throw new Error("User not authenticated")
            if (!files || files.length === 0) throw new Error("Please select a file to upload")
            
            const file = files[0]
            const fileData = await ConvertFileToBase64(file)

            const customFile: DocumentFile = {
                'file_name': file.name,
                'mime_type': file.type,
                'file_data': fileData,
            }

            const documentInfo: POADocumentInfo = {
                'type': values.type,
                'issued_date': values.issued_date,
            }

            const created_poa_id = await UploadAccountPOADocument(customFile, documentInfo, session.user.id, account.id)

            if (!created_poa_id) throw new Error("Failed to upload document")

            toast({
                title: "Success",
                description: "Document uploaded successfully",
                variant: "success",
            })
        
            setFiles(null)
            setDialogOpen(false)

        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "An unknown error occurred",
                variant: "destructive",
            })
        } finally {
            setUploading(false)
        }
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button className='w-fit h-fit flex gap-x-5'>
                    <Upload className='h-4 w-4' />
                    Upload a Proof of Address
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[50%]">
                <DialogHeader>
                    <DialogTitle>Upload a Proof of Address</DialogTitle>
                    <DialogDescription>
                        to the document center
                    </DialogDescription>
                </DialogHeader>
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
                <POAForm onSubmit={(values) => handleSubmit(values)} uploading={uploading} />
            </DialogContent>
        </Dialog>
    )
}

export default POAUploader
