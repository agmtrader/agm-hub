'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react'
import { ColumnDefinition, DataTable } from '../components/DataTable'
import { accessAPI } from '@/utils/api'
import DocumentUploader from './DocumentUploader'
import { toast } from "@/hooks/use-toast"
import { Map } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { FolderDictionary, folderDictionary } from '@/lib/drive'
import { Drive, Document as CustomDocument } from '@/lib/drive'

interface DocumentCenterProps {
  folderDictionary?: FolderDictionary[];
  query?: Map;
}

export default function DocumentCenter({ folderDictionary: propsFolderDictionary, query }: DocumentCenterProps) {

  const [files, setFiles] = useState<Drive>({})
  const [loading, setLoading] = useState<boolean>(true)
  const [currentFolderID, setCurrentFolderID] = useState<string | null>(null)

  // Use the prop folderDictionary if provided, otherwise use the default
  const activeFolderDictionary = propsFolderDictionary || folderDictionary

  const columns = [
    { accessorKey: 'FileInfo.name', header: 'Name' },
    { accessorKey: 'DocumentID', header: 'Document ID' },
    { accessorKey: 'FileInfo', header: 'File Info' },
    { accessorKey: 'DocumentInfo', header: 'Document Info' },
    { accessorKey: 'Uploader', header: 'Uploaded By' },
  ] as ColumnDefinition<CustomDocument>[]

  if (query && Object.keys(query).includes('DocumentInfo.account_number')) {
    console.log(query['DocumentInfo.account_number'])
  }

  useEffect(() => {
    async function fetchData() {
      
      setLoading(true)
      let files:Drive = {}

      if (!query) {
        toast({
          title: "No query provided.",
          description: "Please provide a query.",
          variant: "destructive",
        })
        query = {}
      }

      for (let folder of activeFolderDictionary) {
        console.log(folder)
        const response = await accessAPI('/database/read', 'POST', {
          'path': `db/document_center/${folder.id}`,
          'query': query
        })
        if (response['content']) {
          files[folder.id] = response['content']
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

      console.log(files)

      setFiles(files)
      setCurrentFolderID(Object.keys(files)[0] || null)
      setLoading(false)
    }
    fetchData()
  }, [activeFolderDictionary])

  const handleDownload = (row: any) => {
    console.log(row)
    toast({
      title: "Downloading",
      description: `Downloading ${row.FileInfo.name}...`,
    })
  }

  const handleDelete = (row: any) => {
    toast({
      title: "Deleting",
      description: `Deleting ${row.name}...`,
    })
  }

  const rowActions = [
    {
      label: "Download",
      onClick: handleDownload,
    },
    {
      label: "Delete",
      onClick: handleDelete,
    },
  ]

  const getFolderLabel = (folderId: string) => {
    const folder = activeFolderDictionary.find(f => f.id === folderId)
    return folder ? folder.label : folderId
  }

  if (loading) return (
    <div className='w-full h-full flex justify-center items-center'>
      <Loader2 className='animate-spin text-foreground h-10 w-10 text-primary' />
    </div>
  )

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
        {Object.keys(files).map((folderId, index) => (
          <motion.div key={folderId} custom={index} variants={{
            hidden: { x: -20, opacity: 0 },
            visible: (i) => ({ x: 0, opacity: 1, transition: { delay: i * 0.1 } })
          }} initial="hidden" animate="visible">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentFolderID(folderId)}
              className={cn(currentFolderID === folderId && 'font-bold text-foreground', 'text-foreground')}
            >
              {getFolderLabel(folderId)}
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
              />
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <DocumentUploader accountNumber={query && query['DocumentInfo.account_number']} folderDictionary={activeFolderDictionary} />
        </motion.div>
      </motion.div>
    </motion.div>
  )

}
