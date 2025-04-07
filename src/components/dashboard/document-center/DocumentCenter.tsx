'use client'

import { useEffect, useState } from 'react'
import { toast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from 'framer-motion'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import Link from 'next/link'
import { Map } from '@/lib/types'
import { cn } from '@/lib/utils'

import { Button } from "@/components/ui/button"
import { ColumnDefinition, DataTable } from '../../misc/DataTable'
import LoadingComponent from '@/components/misc/LoadingComponent'

import DocumentViewer from './DocumentViewer'
import DocumentUploader from './DocumentUploader'

import { FolderDictionary, Document as CustomDocument, DocumentCenter as DocumentCenterType } from '@/lib/entities/document-center'
import { DeleteFile, ReadFolders, GetFolderDictionary } from '@/utils/entities/document-center'

interface DocumentCenterProps {
  folderDictionary?: FolderDictionary[];
  query?: Map;
}

export default function DocumentCenter({ folderDictionary: propsFolderDictionary, query }: DocumentCenterProps) {

  const [documentCenter, setDocumentCenter] = useState<DocumentCenterType>({})
  const [currentBucketId, setCurrentBucketId] = useState<string | null>(null)
  const [defaultFolders, setDefaultFolders] = useState<FolderDictionary[] | null>(null)

  const [loading, setLoading] = useState<boolean>(true)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null)

  const fetchDefaultFolderDictionary = async () => {
    try {
      const folderDict = await GetFolderDictionary()
      setDefaultFolders(folderDict)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'An error occurred fetching folder dictionary',
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchDefaultFolderDictionary()
  }, [query])

  const activeFolderDictionary = propsFolderDictionary || defaultFolders

  const columns = [
    { accessorKey: 'FileInfo.name', header: 'Name' },
    { accessorKey: 'DocumentID', header: 'Document ID' },
    { accessorKey: 'FileInfo', header: 'File Info' },
    { accessorKey: 'DocumentInfo', header: 'Document Info' },
    { accessorKey: 'Uploader', header: 'Uploaded By' },
  ] as ColumnDefinition<CustomDocument>[]

  const handleFetchData = async () => {
    setLoading(true)
    try {
      let documentCenter:DocumentCenterType = await ReadFolders(query)
      setDocumentCenter(documentCenter)
      setCurrentBucketId(Object.keys(documentCenter)[0] || null)
      setLoading(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    handleFetchData()
  }, [activeFolderDictionary])

  const handleDownload = (row: any) => {
    toast({
      title: "Downloading",
      description: `Downloading ${row.FileInfo.name}...`,
    })

    // Create a temporary anchor element to trigger the download
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${row.FileInfo.id}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = row.FileInfo.name; // Set the file name for download
    document.body.appendChild(link);
    link.click(); // Trigger the download
    document.body.removeChild(link); // Clean up the DOM

    toast({
      title: "Downloaded",
      description: `Downloaded ${row.FileInfo.name}...`,
    })

  }

  const handleView = (row: any) => {
    setSelectedFileId(row.FileInfo.id)
    setViewDialogOpen(true)
  }

  const handleDelete = async (row: any) => {

    try {
      if (!currentBucketId) throw new Error('No bucket selected')

      toast({
        title: "Deleting",
        description: `Deleting ${row.FileInfo.name || ''}...`,
      })
      await DeleteFile(row, currentBucketId)
      handleFetchData()
    } catch (error) {
      toast({
        title: "Error",
        description: `Error deleting ${row.FileInfo.name}...`,
        variant: "destructive",
      })
    } finally {
      toast({
        title: "Deleted",
        description: `Deleted ${row.FileInfo.name}...`,
      })
    }

  }

  const rowActions = [
    {
      label: "View",
      onClick: handleView,
    },
    {
      label: "Download",
      onClick: handleDownload,
    },
    {
      label: "Delete",
      onClick: handleDelete,
    },
  ]

  if (loading || !activeFolderDictionary) return <LoadingComponent className='w-full h-full'/>

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='w-full h-fit gap-5 flex flex-col justify-center items-center'
    >
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
        className="flex gap-2"
      >
        {activeFolderDictionary.map((folder, index) => (
          <motion.div key={folder.id} custom={index} variants={{
            hidden: { x: -20, opacity: 0 },
            visible: (i) => ({ x: 0, opacity: 1, transition: { delay: i * 0.1 } })
          }} initial="hidden" animate="visible">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentBucketId(folder.id)}
              className={cn(currentBucketId === folder.id && 'font-bold text-foreground', 'text-foreground')}
            >
              {folder.label}
            </Button>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex w-full flex-col justify-center items-center gap-5"
      >
        <AnimatePresence mode="wait">
          {documentCenter && currentBucketId && documentCenter[currentBucketId] && documentCenter[currentBucketId].length > 0 && (
            <motion.div
              className="w-full"
              key={currentBucketId}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DataTable 
                enableRowActions 
                columns={columns}
                data={documentCenter[currentBucketId].sort((a,b) => new Date(b.FileInfo.modifiedTime).getTime() - new Date(a.FileInfo.modifiedTime).getTime())} 
                rowActions={rowActions}
                infiniteScroll={true}
                enableFiltering
                filterColumns={['DocumentID']}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className='flex gap-2'
        >
          <Link href={`https://drive.google.com/drive/folders/${activeFolderDictionary.find(folder => folder.id === currentBucketId)?.drive_id}`} target='_blank'>
            <Button variant="outline" size="sm">View in Drive</Button>
          </Link>
          <DocumentUploader 
            accountNumber={query && query['DocumentInfo.account_number']} 
            folderDictionary={activeFolderDictionary} 
            onUploadSuccess={handleFetchData}
          />
        </motion.div>
      </motion.div>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-[80%] h-[80vh]">
          {selectedFileId && <DocumentViewer fileId={selectedFileId} />}
        </DialogContent>
      </Dialog>
    </motion.div>
  )

}
