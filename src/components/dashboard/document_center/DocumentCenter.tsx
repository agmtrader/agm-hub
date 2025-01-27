'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { ColumnDefinition, DataTable } from '../components/DataTable'
import { accessAPI } from '@/utils/api'
import DocumentUploader from './DocumentUploader'
import { toast } from "@/hooks/use-toast"
import { Map } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { FolderDictionary, defaultFolderDictionary } from '@/lib/drive'
import { Drive, Document as CustomDocument } from '@/lib/drive'
import LoadingComponent from '@/components/misc/LoadingComponent'
import DocumentViewer from './DocumentViewer'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import Link from 'next/link'

interface DocumentCenterProps {
  folderDictionary?: FolderDictionary[];
  query?: Map;
}

export default function DocumentCenter({ folderDictionary: propsFolderDictionary, query }: DocumentCenterProps) {

  const [files, setFiles] = useState<Drive>({})
  const [loading, setLoading] = useState<boolean>(true)
  const [currentFolderID, setCurrentFolderID] = useState<string | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null)

  // Use the prop folderDictionary if provided, otherwise use the default
  const activeFolderDictionary = propsFolderDictionary || defaultFolderDictionary

  const columns = [
    { accessorKey: 'FileInfo.name', header: 'Name' },
    { accessorKey: 'DocumentID', header: 'Document ID' },
    { accessorKey: 'FileInfo', header: 'File Info' },
    { accessorKey: 'DocumentInfo', header: 'Document Info' },
    { accessorKey: 'Uploader', header: 'Uploaded By' },
  ] as ColumnDefinition<CustomDocument>[]

  const fetchData = async () => {
    setLoading(true)
    let files:Drive = {}

    if (!query) {
      query = {}
    }

    for (let folder of activeFolderDictionary) {
      const response = await accessAPI('/database/read', 'POST', {
        'path': `db/document_center/${folder.id}`,
        'query': query
      })
      if (response['content']) {
        // Sort files by modified_time in descending order (newest first)
        const sortedFiles = response['content'].sort((a: CustomDocument, b: CustomDocument) => {
          const timeA = new Date(a.FileInfo.modifiedTime);
          const timeB = new Date(b.FileInfo.modifiedTime);
          return timeB.getTime() - timeA.getTime();
        });
        files[folder.id] = sortedFiles;
      }
    }

    if (Object.keys(files).length === 0) {
      toast({
        title: "No files found.",
        description: "Please upload some files.",
        variant: "destructive",
      })
      setLoading(false)
    }

    setFiles(files)
    setCurrentFolderID(Object.keys(files)[0] || null)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
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

    toast({
      title: "Deleting",
      description: `Deleting ${row.FileInfo.name || ''}...`,
    })

    const fileDriveId = row.FileInfo.id
    const documentId = row.DocumentID

    let response = await accessAPI('/drive/delete_file', 'POST', {
      'file_id': fileDriveId,
    })

    if (response['status'] !== 'success') {
      toast({
        title: "Error",
        description: `Error deleting ${row.FileInfo.name} from Drive.`,
        variant: "destructive",
      })
      throw new Error(response['content'])
    }

    response = await accessAPI('/database/delete', 'POST', {
      'path': `db/document_center/${currentFolderID}`,
      'query': {
        'DocumentID': documentId,
      }
    })

    if (response['status'] !== 'success') {
      toast({
        title: "Error",
        description: `Error deleting ${row.FileInfo.name} from Database.`,
        variant: "destructive",
      })
      throw new Error(response['content'])
    }

    toast({
      title: "Deleted",
      description: `Deleted ${row.FileInfo.name}...`,
    })

    fetchData()
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
          {files && currentFolderID && files[currentFolderID] && files[currentFolderID].length > 0 && (
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
                data={files[currentFolderID]} 
                rowActions={rowActions}
                infiniteScroll={true}
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
            onUploadSuccess={fetchData}
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
