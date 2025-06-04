'use client'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Account } from '@/lib/entities/account'
import { Bucket, POADocument } from '@/lib/entities/document'
import { ColumnDefinition } from '@/components/misc/DataTable'
import { DataTable } from '@/components/misc/DataTable'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { formatDateFromTimestamp } from '@/utils/dates'
import { ReadAccountDocuments } from '@/utils/entities/account'
import LoadingComponent from '@/components/misc/LoadingComponent'

interface Props {
  account: Account;
}

const AccountDocuments = ({ account }: Props) => {
  const [buckets, setBuckets] = useState<Bucket[] | null>(null)
  const [currentBucketId, setCurrentBucketId] = useState<string | null>(null)

  useEffect(() => {
    fetchAccountDocuments()
  }, [])

  async function fetchAccountDocuments() {
    const buckets = await ReadAccountDocuments(account.id)
    setBuckets(buckets)
    if (buckets.length > 0) {
      setCurrentBucketId(buckets[0].id)
    }
  }

  const columns = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'type', header: 'Type' },
    { accessorKey: 'created', header: 'Created At', cell: ({row}: any) => formatDateFromTimestamp(row.original.created) },
    { accessorKey: 'updated', header: 'Updated At', cell: ({row}: any) => formatDateFromTimestamp(row.original.updated) }
  ] as ColumnDefinition<POADocument>[]

  if (!buckets) {
    return (
      <div className='w-full h-full flex flex-col justify-center items-center'>
        <LoadingComponent className='w-full h-full'/>
      </div>
    )
  }
  
  return (
    <div className="w-full h-full flex flex-col gap-5">
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
          className="flex gap-2 w-full"
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
          className="flex w-full h-full flex-col justify-center items-center gap-5"
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
                  infiniteScroll={true}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default AccountDocuments