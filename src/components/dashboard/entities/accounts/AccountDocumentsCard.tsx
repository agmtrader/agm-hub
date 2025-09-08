'use client'

import { ReadAccountDocuments, SubmitIBKRDocument } from '@/utils/entities/account'
import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Eye, Upload } from 'lucide-react'
import DocumentViewer from './DocumentViewer'
import {
  Dialog,
  DialogContent,
  DialogHeader as DialogHead,
  DialogTitle as DialogTit,
  DialogTrigger
} from '@/components/ui/dialog'
import { FileUploader, FileInput, FileUploaderContent, FileUploaderItem } from '@/components/ui/file-upload'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import { DocumentSubmissionRequest, InternalDocument } from '@/lib/entities/account'
import { ColumnDefinition, DataTable } from '@/components/misc/DataTable'

function getBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const arrayBuffer = reader.result as ArrayBuffer
        const bytes = new Uint8Array(arrayBuffer)
        let binary = ''
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i])
        }
        const base64 = btoa(binary)
        resolve(base64)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = error => reject(error)
    reader.readAsArrayBuffer(file)
  })
}

async function calculateSHA1(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest('SHA-1', buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

// IBKR timestamp (yyyyMMddHHmm)
function getIBKRTimestamp() {
  const now = new Date()
  const pad = (n: number) => n.toString().padStart(2, '0')
  return parseInt(`${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}`)
}

const DOCUMENT_TYPE_MAP: { [key: number]: string } = {
  5001: 'W8 Form',
  8001: 'Proof of Identity',
  8002: 'Proof of Address'
}

function getDocumentName(formNumber: number) {
  return DOCUMENT_TYPE_MAP[formNumber] || 'Unknown Document'
}

interface Props {
  documents?: InternalDocument[]
  accountId: string | null
  accountTitle: string
  onRefresh?: () => void
}

const AccountDocumentsCard: React.FC<Props> = ({ documents = [], accountId, accountTitle, onRefresh }) => {

  const [docs, setDocs] = useState<InternalDocument[]>(documents)
  const [selectedDocument, setSelectedDocument] = useState<any>(null)
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [files, setFiles] = useState<File[] | null>(null)
  const [formNumber, setFormNumber] = useState<number>(5001)
  const [isUploading, setIsUploading] = useState(false)

    // Sync with documents prop changes
    useEffect(() => {
      setDocs(documents)
    }, [documents])
  
    // Fetch documents from API when accountId changes
    useEffect(() => {
      const fetchDocuments = async () => {
        if (!accountId) return
        try {
          const fetched = await ReadAccountDocuments(accountId)
          setDocs(fetched || [])
        } catch (error) {
          console.error('Failed to fetch account documents', error)
        }
      }
      fetchDocuments()
    }, [accountId])

  // Handle document upload
  async function handleUpload() {
    if (!accountId) {
      toast({ title: 'No account ID', description: 'Please choose an account to upload a document', variant: 'warning' })
      return
    }
    if (!files || files.length === 0) {
      toast({ title: 'No file selected', description: 'Please choose a file to upload', variant: 'warning' })
      return
    }
    const file = files[0]
    try {
      setIsUploading(true)
      const base64Data = await getBase64(file)
      const sha1Checksum = await calculateSHA1(file)
      const timestamp = getIBKRTimestamp()

      const docSubmission: DocumentSubmissionRequest = {
        documents: [
          {
            signedBy: [accountTitle],
            attachedFile: {
              fileName: file.name,
              fileLength: file.size,
              sha1Checksum
            },
            formNumber: formNumber,
            validAddress: false,
            execLoginTimestamp: timestamp,
            execTimestamp: timestamp,
            payload: {
              mimeType: file.type,
              data: base64Data
            }
          }
        ],
        accountId,
        inputLanguage: 'en',
        translation: false
      }

      await SubmitIBKRDocument(accountId, docSubmission)
      toast({ title: 'Success', description: 'Document uploaded successfully', variant: 'success' })
      setIsDialogOpen(false)
      setFiles(null)
      onRefresh?.()
      // Refresh documents list
      try {
        const updatedDocs = await ReadAccountDocuments(accountId)
        setDocs(updatedDocs || [])
      } catch (err) {
        console.error('Failed to refresh documents after upload', err)
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error?.message || 'Failed to upload document', variant: 'destructive' })
    } finally {
      setIsUploading(false)
    }
  }

  async function handleView(document: any) {
    setSelectedDocument(document)
    setIsViewerOpen(true)
  }

  const columns = [
    {
      header: 'File Name',
      accessorKey: 'file_name'
    },
    {
      header: 'File Size',
      accessorKey: 'file_length'
    }
  ]

  const rowActions = [
    {
      label: 'View',
      icon: Eye,
      onClick: handleView
    }
  ]

  if (!accountId) return null

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary"/> Documents</CardTitle>
          <CardDescription>Manage and view account-related documents.</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2"><Upload className="h-4 w-4"/> Upload</Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHead>
              <DialogTit>Upload Document</DialogTit>
            </DialogHead>
            <div className="space-y-4">
              <Input type="number" value={formNumber} onChange={(e)=>(setFormNumber(parseInt(e.target.value)))} placeholder="Form Number (e.g. 8001)" />
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
                    <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
                  </div>
                </FileInput>
                <FileUploaderContent>
                  {files?.map((f, i) => (
                    <FileUploaderItem key={i} index={i}>{f.name}</FileUploaderItem>
                  ))}
                </FileUploaderContent>
              </FileUploader>
              <Button onClick={handleUpload} disabled={isUploading || !files?.length} className="w-full bg-primary text-background hover:bg-primary/90">
                {isUploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <DataTable data={docs} columns={columns as ColumnDefinition<any>[]} rowActions={rowActions} enableRowActions/>
      </CardContent>

      <DocumentViewer
        document={selectedDocument}
        documentName={selectedDocument ? getDocumentName(selectedDocument.form_number) : ''}
        isOpen={isViewerOpen}
        onOpenChange={setIsViewerOpen}
      />
    </Card>
  )
}

export default AccountDocumentsCard
