'use client'
import React, { useState, useEffect } from 'react'
import { Contact } from '@/lib/entities/contact'
import { ReadContacts, DeleteContact } from '@/utils/entities/contact'
import CreateContact from '@/components/dashboard/contacts/CreateContact'
import { useToast } from '@/hooks/use-toast'
import { ColumnDefinition, DataTable } from '@/components/misc/DataTable'
import EditContact from './EditContact'
import { countries } from '@/lib/form'

const ContactsPage = () => {
    const [contacts, setContacts] = useState<Contact[]>([])
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

    const { toast } = useToast()

    const handleFetchContacts = async () => {
        try {
            const fetchedContacts = await ReadContacts()
            setContacts(fetchedContacts)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch contacts",
                variant: "destructive"
            })
        }
    }

    useEffect(() => {
        handleFetchContacts() 
    }, [])

    const handleDelete = async (contactId: string) => {
        try {
            await DeleteContact(contactId)
            toast({
                title: "Success",
                description: "Contact deleted successfully",
            })
            handleFetchContacts()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete contact",
                variant: "destructive"
            })
        }
    }

    const columns: ColumnDefinition<Contact>[] = [
        {
            header: 'Name',
            accessorKey: 'ContactName',
        },
        {
            header: 'Email',
            accessorKey: 'ContactEmail',
        },
        {
            header: 'Phone',
            accessorKey: 'ContactPhone',
        },
        {
            header: 'Country',
            accessorKey: 'ContactCountry',
            cell: ({ row }: any) => {
                return <span className='capitalize'>{countries.find(c => c.value === row.original.ContactCountry)?.label}</span>
            }
        }
    ]

    return (
        <div className="space-y-4">

            <CreateContact onContactCreated={handleFetchContacts}/>

            <DataTable 
                data={contacts} 
                columns={columns} 
                enableRowActions
                rowActions={[
                        {
                        label: 'Edit',
                        onClick: (row: Contact) => {
                            setSelectedContact(row)
                            setIsEditDialogOpen(true)
                        }
                        },
                        {
                        label: 'Delete',
                        onClick: (row: any) => {
                            handleDelete(row.ContactID)
                        },
                        }
                    ]
                } 
            />
            <EditContact
                isDialogOpen={isEditDialogOpen}
                setIsDialogOpen={setIsEditDialogOpen}
                contact={selectedContact}
                onSuccess={handleFetchContacts}
            />

        </div>
    )
}

export default ContactsPage