'use client'

import { useEffect, useState } from 'react'
import { toast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import Link from 'next/link'
import { Map } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Button } from "@/components/ui/button"
import { ColumnDefinition, DataTable } from '../../../misc/DataTable'
import LoadingComponent from '@/components/misc/LoadingComponent'
import DocumentViewer from '../DocumentViewer'
import { Bucket, POADocument } from '@/lib/entities/document'
import { useSession } from 'next-auth/react'
import { DeleteFile, ReadBuckets } from '@/utils/entities/documents'

const ClientDocuments =() => {

  const { data: session } = useSession()
  const [buckets, setBuckets] = useState<Bucket[] | null>(null)
  const [currentBucketId, setCurrentBucketId] = useState<string | null>(null)

  const [loading, setLoading] = useState<boolean>(true)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null)

  const fetchBuckets = async () => {
    try {
      const fetchedBuckets = await ReadBuckets()
      setBuckets(fetchedBuckets)
      if (fetchedBuckets.length > 0) {
        setCurrentBucketId(fetchedBuckets[0].id)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'An error occurred fetching bucket dictionary',
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBuckets()
  }, [])

  const handleDownload = (propsDocument: any) => {
    toast({
      title: "Downloading",
      description: `Downloading ${propsDocument.FileInfo?.name || 'document'}...`,
    })

    const downloadUrl = `https://drive.google.com/uc?export=download&id=${propsDocument.FileInfo?.id}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = propsDocument.FileInfo?.name || 'document';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Downloaded",
      description: `Downloaded ${propsDocument.FileInfo?.name || 'document'}...`,
    })
  }

  const handleView = (document: any) => {
    setSelectedFileId(document.FileInfo?.id || null)
    setViewDialogOpen(true)
  }

  const handleDelete = async (document: any) => {
    try {
      if (!currentBucketId) throw new Error('No bucket selected')

      toast({
        title: "Deleting",
        description: `Deleting ${document.FileInfo?.name || 'document'}...`,
      })
      await DeleteFile(document, currentBucketId)
      fetchBuckets()
    } catch (error) {
      toast({
        title: "Error",
        description: `Error deleting ${document.FileInfo?.name || 'document'}...`,
        variant: "destructive",
      })
    } finally {
      toast({
        title: "Deleted",
        description: `Deleted ${document.FileInfo?.name || 'document'}...`,
        variant: "success",
      })
    }
  }

  const columns = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'id', header: 'Document ID' },
    { accessorKey: 'type', header: 'Type' },
    { accessorKey: 'issued_date', header: 'Issued Date' },
  ] as ColumnDefinition<POADocument>[]

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

  if (loading || !buckets) return <LoadingComponent className='w-full h-full'/>

  console.log(buckets)

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
        {buckets.map((bucket, index) => (
          <motion.div key={bucket.id} custom={index} variants={{
            hidden: { x: -20, opacity: 0 },
            visible: (i) => ({ x: 0, opacity: 1, transition: { delay: i * 0.1 } })
          }} initial="hidden" animate="visible">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentBucketId(bucket.id)}
              className={cn(currentBucketId === bucket.id && 'font-bold text-foreground', 'text-foreground')}
            >
              {bucket.name}
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
          {currentBucketId && (
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
                data={buckets.find(b => b.id === currentBucketId)?.files || []}
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

          {session?.user.scopes === 'all' && 
            <Link href={`https://drive.google.com/drive/folders/${buckets?.find(b => b.id === currentBucketId)?.drive_id}`} target='_blank'>
              <Button variant="outline" size="sm">View in Drive</Button>
            </Link>
          }

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

export default ClientDocuments
