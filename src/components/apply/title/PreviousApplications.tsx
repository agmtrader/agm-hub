import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { InternalApplication } from '@/lib/entities/application'
import { ColumnDefinition, DataTable } from '@/components/misc/DataTable'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import { ReadApplicationByUserID } from '@/utils/entities/application'
import { formatDateFromTimestamp } from '@/utils/dates'

type Props = {
    setStarted: React.Dispatch<React.SetStateAction<boolean>>
}

const PreviousApplications = ({ setStarted }: Props) => {

    const [dialogOpen, setDialogOpen] = useState(false)

    const { t } = useTranslationProvider()
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const { data: session } = useSession();
    const [previousApplications, setPreviousApplications] = useState<InternalApplication[]>([]);

    useEffect(() => {
        async function getPreviousApplications() {
            if (!session?.user?.id) return;
            try {
                const allApplications = await ReadApplicationByUserID(session.user.id);
                setPreviousApplications(allApplications);
            } catch (error) {
                console.error('Failed to fetch applications', error);
            }
        }
        getPreviousApplications();
    }, [session]);


    if (!previousApplications) return null

    const columns = [
        {
            header: t('apply.account.title.previous_applications.status'),
            accessorKey: 'date_sent_to_ibkr',
            cell: ({ row }: any) => row.original.date_sent_to_ibkr ? 'Submitted' : 'Draft',
        },
        {
            header: t('apply.account.title.previous_applications.date'),
            accessorKey: 'created',
            cell: ({ row }: any) => formatDateFromTimestamp(row.original.created),
        }
    ] as ColumnDefinition<InternalApplication>[];

    const rowActions = [
        {
            label: t('apply.account.title.previous_applications.resume'),
            onClick: (application: InternalApplication) => {

                // Build new query string preserving existing params and adding app=<id>
                const params = new URLSearchParams(searchParams.toString());
                params.set('app', application.id);

                router.push(`${pathname}?${params.toString()}`);

                setDialogOpen(false);
                setStarted(false);
                // small delay to ensure component re-mounts with new param
                setTimeout(() => setStarted(true), 100);
            },
        },
    ];

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
            <DataTable data={previousApplications} columns={columns} rowActions={rowActions} enableRowActions/>
        </DialogContent>
    </Dialog>
  )
}

export default PreviousApplications