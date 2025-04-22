import ContactsPage from '@/components/dashboard/contacts/ContactsPage'
import DashboardPage from '@/components/misc/DashboardPage'
import React from 'react'

type Props = {}

const page = (props: Props) => {
  return (
    <DashboardPage title='Contacts' description='Manage your contacts'>
        <ContactsPage />
    </DashboardPage>
  )
}

export default page