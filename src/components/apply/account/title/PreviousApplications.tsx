import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import { Account } from '@/lib/entities/account'
import { ColumnDefinition, DataTable } from '@/components/misc/DataTable'
import { ReadTicketByUserID } from '@/utils/entities/ticket'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import { ReadAccountByUserID } from '@/utils/entities/account'
import { formatDateFromTimestamp } from '@/utils/dates'

type Props = {
    setAccount: React.Dispatch<React.SetStateAction<Account | null>>
    setStarted: React.Dispatch<React.SetStateAction<boolean>>
}

const PreviousApplications = ({setAccount, setStarted}:Props) => {

    const [dialogOpen, setDialogOpen] = useState(false)

    const { t } = useTranslationProvider()

    const {data:session} = useSession()
    const [previousAccounts, setPreviousAccounts] = useState<Account[]>([])

    useEffect(() => {
        async function getPreviousAccounts() {
            if (!session?.user?.id) throw new Error('User not found')
            let accounts = await ReadAccountByUserID(session?.user?.id)
            if (!accounts) return
            
            accounts = accounts.filter((account) => account.status === 'Started')
            setPreviousAccounts(accounts)
        }   
        getPreviousAccounts()
    }, [session])


    if (!previousAccounts) return null

    const columns = [
        {
            header: t('apply.account.title.previous_applications.status'),
            accessorKey: 'status',
        },
        {
            header: t('apply.account.title.previous_applications.date'),
            accessorKey: 'created',
            cell: ({row}: any) => formatDateFromTimestamp(row.original.created)
        },
        {
            header: t('apply.account.title.previous_applications.advisor'),
            accessorKey: 'id',
        }
    ] as ColumnDefinition<any>[]

    const rowActions = [
        {
            label: t('apply.account.title.previous_applications.resume'),
            onClick: (account: Account) => {
                setDialogOpen(false)
                setAccount(account)
                setStarted(false)
                setTimeout(() => {
                    setAccount(account)
                    setStarted(true)
                }, 100)
            }
        }
    ]

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
            <Button
                variant="ghost"
                className="text-sm rounded-full"
            >
                <p>{t('apply.account.title.previous_applications.button')}</p>
            </Button>
        </DialogTrigger>
        <DialogContent className='w-full max-w-5xl'>
            <DialogHeader>
                <DialogTitle>{t('apply.account.title.previous_applications.title')}</DialogTitle>
            </DialogHeader>
            <DataTable data={previousAccounts} columns={columns} rowActions={rowActions} enableRowActions/>
        </DialogContent>
    </Dialog>
  )
}

export default PreviousApplications