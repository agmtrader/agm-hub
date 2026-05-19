'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Trash, Upload } from 'lucide-react'
import { ColumnDefinition, DataTable } from '@/components/misc/DataTable'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { FileUploader, FileInput, FileUploaderContent, FileUploaderItem } from '@/components/ui/file-upload'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { DateTimePicker } from '@/components/ui/datetime-picker'
import { toast } from '@/hooks/use-toast'
import { ReadContactDocuments, UploadContactDocument, UpdateContactDocument, DeleteContactDocument } from '@/utils/clients/contact'
import { calculateSHA1, getBase64 } from '@/utils/clients/documents'
import { formatTimestamp, getDateObjectFromTimestamp } from '@/utils/dates'
import { documentCategories } from '@/lib/clients/documents'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

type Props = {
  contactId: string
  accountId: string
  holderName?: string
}

const ContactDocuments = ({ contactId, accountId, holderName }: Props) => {
  const { t } = useTranslationProvider()
  const [links, setLinks] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [files, setFiles] = useState<File[] | null>(null)
  const [editingRow, setEditingRow] = useState<any | null>(null)

  const [documentCategory, setDocumentCategory] = useState<string>('')
  const [documentType, setDocumentType] = useState<string>('')
  const [issuedDate, setIssuedDate] = useState<Date | undefined>(undefined)
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined)
  const [comment, setComment] = useState<string>('')

  const categories = documentCategories(t)
  const selectedCategory = categories.find((c) => c.name === documentCategory)
  const availableTypes: readonly string[] | null = Array.isArray(selectedCategory?.types)
    ? (selectedCategory.types as readonly string[])
    : null

  async function refreshLinks() {
    if (!contactId) return
    try {
      const resp = await ReadContactDocuments(contactId, { includeDocuments: false })
      setLinks(resp?.contact_documents || [])
    } catch {
      toast({ title: 'Error', description: 'Failed to read contact documents', variant: 'destructive' })
    }
  }

  useEffect(() => {
    refreshLinks()
  }, [contactId])

  async function handleUpload() {
    if (!files || files.length === 0) return
    if (!documentCategory) {
      toast({ title: 'Missing category', description: 'Select a document category', variant: 'warning' })
      return
    }
    if (availableTypes?.length && !documentType) {
      toast({ title: 'Missing type', description: 'Select a document type', variant: 'warning' })
      return
    }
    const file = files[0]
    try {
      setIsUploading(true)
      const base64Data = await getBase64(file)
      const sha1Checksum = await calculateSHA1(file)
      await UploadContactDocument(
        accountId,
        contactId,
        file.name,
        file.size,
        sha1Checksum,
        file.type,
        base64Data,
        documentCategory,
        documentType,
        issuedDate ? formatTimestamp(issuedDate) : '',
        expiryDate ? formatTimestamp(expiryDate) : '',
        comment || null
      )
      setIsDialogOpen(false)
      setFiles(null)
      setDocumentCategory('')
      setDocumentType('')
      setIssuedDate(undefined)
      setExpiryDate(undefined)
      setComment('')
      await refreshLinks()
    } catch {
      toast({ title: 'Error', description: 'Failed to upload document', variant: 'destructive' })
    } finally {
      setIsUploading(false)
    }
  }

  async function handleDelete(row: any) {
    if (!row?.document_id) return
    try {
      await DeleteContactDocument(row.document_id)
      await refreshLinks()
    } catch {
      toast({ title: 'Error', description: 'Failed to delete document', variant: 'destructive' })
    }
  }

  async function handleSaveEdit() {
    if (!editingRow?.document_id) return
    if (availableTypes?.length && !documentType) {
      toast({ title: 'Missing type', description: 'Select a document type', variant: 'warning' })
      return
    }
    try {
      await UpdateContactDocument(
        editingRow.document_id,
        documentCategory || undefined,
        documentType || undefined,
        comment || undefined,
        issuedDate ? formatTimestamp(issuedDate) : undefined,
        expiryDate ? formatTimestamp(expiryDate) : undefined
      )
      setIsEditDialogOpen(false)
      await refreshLinks()
    } catch {
      toast({ title: 'Error', description: 'Failed to update document metadata', variant: 'destructive' })
    }
  }

  const columns: ColumnDefinition<any>[] = [
    { header: 'Document ID', accessorKey: 'document_id' },
    { header: 'Category', accessorKey: 'category' },
    { header: 'Type', accessorKey: 'type' },
    { header: 'Issued', accessorKey: 'issued_date' },
    { header: 'Expiry', accessorKey: 'expiry_date' },
  ]

  const rowActions = [
    {
      label: 'Edit',
      icon: FileText,
      onClick: (row: any) => {
        setEditingRow(row)
        setDocumentCategory(row?.category || '')
        setDocumentType(row?.type || '')
        setComment(row?.comment || '')
        setIssuedDate(row?.issued_date ? getDateObjectFromTimestamp(row.issued_date) : undefined)
        setExpiryDate(row?.expiry_date ? getDateObjectFromTimestamp(row.expiry_date) : undefined)
        setIsEditDialogOpen(true)
      }
    },
    {
      label: 'Delete',
      icon: Trash,
      onClick: handleDelete
    }
  ]

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Documents {holderName ? `- ${holderName}` : ''}</CardTitle>
            <CardDescription>Contact-linked documents only (no raw document payload).</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2"><Upload className="h-4 w-4" />Upload</Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader><DialogTitle>Upload Document</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <Select value={documentCategory} onValueChange={setDocumentCategory}>
                  <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                {availableTypes?.length ? (
                  <Select
                    value={documentType}
                    onValueChange={setDocumentType}
                  >
                    <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                    <SelectContent>
                      {availableTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input value={documentType} onChange={(e) => setDocumentType(e.target.value)} placeholder="Type (optional)" />
                )}
                <DateTimePicker value={issuedDate} onChange={setIssuedDate} placeholder="Issue date" className="w-full" granularity="minute" />
                <DateTimePicker value={expiryDate} onChange={setExpiryDate} placeholder="Expiry date" className="w-full" granularity="minute" />
                <Input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Comment (optional)" />
                <FileUploader value={files} onValueChange={setFiles} dropzoneOptions={{ maxFiles: 1, maxSize: 10 * 1024 * 1024 }}>
                  <FileInput><div className="p-4 text-center text-sm text-muted-foreground">Drag & drop or click to upload</div></FileInput>
                  <FileUploaderContent>{files?.map((f, i) => <FileUploaderItem key={i} index={i}>{f.name}</FileUploaderItem>)}</FileUploaderContent>
                </FileUploader>
                <Button onClick={handleUpload} disabled={isUploading || !files?.length} className="w-full">
                  {isUploading ? 'Uploading...' : 'Upload'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <DataTable data={links} columns={columns} rowActions={rowActions} enableRowActions />
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>Edit Document Metadata</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Select value={documentCategory} onValueChange={setDocumentCategory}>
              <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            {availableTypes?.length ? (
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  {availableTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            ) : (
              <Input value={documentType} onChange={(e) => setDocumentType(e.target.value)} placeholder="Type (optional)" />
            )}
            <DateTimePicker value={issuedDate} onChange={setIssuedDate} placeholder="Issue date" className="w-full" granularity="minute" />
            <DateTimePicker value={expiryDate} onChange={setExpiryDate} placeholder="Expiry date" className="w-full" granularity="minute" />
            <Input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Comment (optional)" />
            <Button onClick={handleSaveEdit} className="w-full">Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ContactDocuments
