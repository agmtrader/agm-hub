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

import { FolderDictionary, defaultFolderDictionary, Document as CustomDocument, DocumentCenter as DocumentCenterType } from '@/lib/entities/document-center'
import { DeleteFile, ReadFolders } from '@/utils/entities/document-center'

interface DocumentCenterProps {
  folderDictionary?: FolderDictionary[];
  query?: Map;
}

export default function DocumentCenter({ folderDictionary: propsFolderDictionary, query }: DocumentCenterProps) {

  const [documentCenter, setDocumentCenter] = useState<DocumentCenterType>({})
  const [currentFolderID, setCurrentFolderID] = useState<string | null>(null)

  const [loading, setLoading] = useState<boolean>(true)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null)

  const activeFolderDictionary = propsFolderDictionary || defaultFolderDictionary

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
      setCurrentFolderID(Object.keys(documentCenter)[0] || null)
      setLoading(false)
    } catch (error) {
      toast({
        title: "Error",
        description: `Error fetching data...`,
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
      if (!currentFolderID) throw new Error('No folder selected')

      toast({
        title: "Deleting",
        description: `Deleting ${row.FileInfo.name || ''}...`,
      })
      await DeleteFile(row, currentFolderID)
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

  if (loading) return <LoadingComponent className='w-full h-full'/>

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
              onClick={() => setCurrentFolderID(folder.id)}
              className={cn(currentFolderID === folder.id && 'font-bold text-foreground', 'text-foreground')}
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
          {documentCenter && currentFolderID && documentCenter[currentFolderID] && documentCenter[currentFolderID].length > 0 && (
            <motion.div
              className="w-full"
              key={currentFolderID}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DataTable 
                enableRowActions 
                columns={columns}
                data={documentCenter[currentFolderID].sort((a,b) => new Date(b.FileInfo.modifiedTime).getTime() - new Date(a.FileInfo.modifiedTime).getTime())} 
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
          <Link href={`https://drive.google.com/drive/folders/${activeFolderDictionary.find(folder => folder.id === currentFolderID)?.drive_id}`} target='_blank'>
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
