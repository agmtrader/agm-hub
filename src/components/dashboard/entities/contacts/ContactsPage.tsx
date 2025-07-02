'use client'
import React, { useState, useEffect } from 'react'
import { Contact } from '@/lib/entities/contact'
import { ReadContacts } from '@/utils/entities/contact'
import CreateContact from '@/components/dashboard/entities/contacts/CreateContact'
import { useToast } from '@/hooks/use-toast'
import { ColumnDefinition, DataTable } from '@/components/misc/DataTable'
import EditContact from './EditContact'
import { countries } from '@/lib/public/form'
import ContactView from './ContactView'
import LoadingComponent from '@/components/misc/LoadingComponent'

const ContactsPage = () => {
    const [contacts, setContacts] = useState<Contact[] | null>(null)
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

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

    if (!contacts) return <LoadingComponent className='w-full h-full' />

    const columns: ColumnDefinition<Contact>[] = [
        {
            header: 'Name',
            accessorKey: 'name',
        },
        {
            header: 'Email',
            accessorKey: 'email',
        },
        {
            header: 'Phone',
            accessorKey: 'phone',
        },
        {
            header: 'Country',
            accessorKey: 'country',
            cell: ({ row }: any) => {
                return <span className='capitalize'>{countries.find(c => c.value === row.original.country)?.label}</span>
            }
        },
        {
            header: 'Company',
            accessorKey: 'company_name',
        },
        {
            header: 'User',
            accessorKey: 'user_id',
            cell: ({ row }: any) => {
                return <span className='capitalize'>{row.original.user_id}</span>
            }
        }
    ]

    return (
        <div className="flex flex-col gap-2 w-full h-full">
            <div className="flex justify-end">
                <CreateContact onSuccess={handleFetchContacts}/>
            </div>
            <DataTable 
                data={contacts} 
                columns={columns} 
                enableRowActions
                infiniteScroll
                rowActions={[
                        {
                            label: 'View',
                            onClick: (row: Contact) => {
                                setSelectedContact(row)
                                setIsViewDialogOpen(true)
                            }
                        },
                        {
                            label: 'Edit',
                            onClick: (row: Contact) => {
                                setSelectedContact(row)
                                setIsEditDialogOpen(true)
                            }
                        }
                    ]
                } 
            />
            {selectedContact && (
                <ContactView
                    contact={selectedContact}
                    isOpen={isViewDialogOpen}
                    onOpenChange={setIsViewDialogOpen}
                />
            )}
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