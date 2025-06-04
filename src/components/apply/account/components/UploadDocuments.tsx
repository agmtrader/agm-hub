"use client"

import React, { useEffect, useState } from 'react'
import { Loader2 } from "lucide-react"
import { Button } from '@/components/ui/button'
import { IndividualTicket, Ticket } from '@/lib/entities/ticket'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import { ReadTicketDocuments } from '@/utils/entities/ticket'
import { useToast } from '@/hooks/use-toast'
import { useSession } from 'next-auth/react'
import { AnimatePresence } from 'framer-motion'
import { Bucket, POADocument } from '@/lib/entities/document'
import { ColumnDefinition } from '@/components/misc/DataTable'
import { DataTable } from '@/components/misc/DataTable'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import POAUploader from '@/components/dashboard/documents/clients/POAUploader'
import POIUploader from '@/components/dashboard/documents/clients/POIUploader'
import { formatDateFromTimestamp } from '@/utils/dates'
import { Account, IndividualAccountApplicationInfo } from '@/lib/entities/account'
import { ReadAccountDocuments } from '@/utils/entities/account'

type Props = {
  account: Account;
  accountInfo: IndividualAccountApplicationInfo;
  stepForward: () => void;
  stepBackward: () => void;
  syncAccountData: (accountID:string, accountInfo: IndividualAccountApplicationInfo) => Promise<boolean>
}

const UploadDocuments = ({account, accountInfo, stepForward, stepBackward}: Props) => {

    const {t} = useTranslationProvider()
    const { data: session } = useSession()

    const [buckets, setBuckets] = useState<Bucket[]>([])
    const [currentBucketId, setCurrentBucketId] = useState<string | null>(null)

    const [uploading, setUploading] = useState<boolean>(false)

    useEffect(() => {
      fetchAccountDocuments()
    }, [])

    async function fetchAccountDocuments() {
      const buckets = await ReadAccountDocuments(account.id)
      setBuckets(buckets)
      setCurrentBucketId(buckets[0].id)
    }

    const columns = [
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'type', header: 'Type' },
      { accessorKey: 'created', header: 'Created At', cell: ({row}: any) => formatDateFromTimestamp(row.original.created) },
      { accessorKey: 'updated', header: 'Updated At', cell: ({row}: any) => formatDateFromTimestamp(row.original.updated) }
    ] as ColumnDefinition<POADocument>[]

    const renderUploadButton = () => {
      if (currentBucketId == 'address') {
        return <POAUploader
          account={account}
          accountInfo={accountInfo}
        />
      } else if (currentBucketId == 'identity') {
        return <POIUploader
          account={account}
          accountInfo={accountInfo}
        />
      }
    }

    console.log(currentBucketId)
    
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
                    infiniteScroll={true}
                  />

                </motion.div>
              )}
            </AnimatePresence>

            {renderUploadButton()}

          </motion.div>

        </motion.div>

        <div className="flex gap-x-5 justify-center items-center mt-auto">
          <Button onClick={stepBackward} variant="ghost">
            {t('forms.previous_step')}
          </Button>
          <Button 
            onClick={stepForward} 
            disabled={uploading || buckets.length === 0}
          >
            {uploading ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                {t('forms.submitting')}
              </>
            ) : (
              t('forms.finish')
            )}
          </Button>
        </div>
      </div>
    )
}

export default UploadDocuments