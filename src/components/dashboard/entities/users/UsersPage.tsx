'use client'
import { ColumnDefinition, DataTable } from '@/components/misc/DataTable'
import { ReadUsers } from '@/utils/entities/user'
import { User } from 'next-auth'
import React, { useEffect, useState } from 'react'
import UserDialog from './UserDialog'
import LoadingComponent from '@/components/misc/LoadingComponent'

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await ReadUsers()
      setUsers(users)
    }
    fetchUsers()
  }, [])

  const columns: ColumnDefinition<User>[] = [
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
    },
    {
      header: 'Company',
      accessorKey: 'company_name',
    },
  ]

  const rowActions: any[] = [
    {
      label: 'View',
      onClick: (user: User) => {
        setSelectedUser(user)
      },
    },
  ]

  if (!users) return <LoadingComponent />

  return (
    <div>
      <DataTable
        data={users}
        columns={columns}
        enableFiltering
        enableRowActions
        rowActions={rowActions}
        infiniteScroll
      />
      <UserDialog user={selectedUser} isOpen={selectedUser !== null} onOpenChange={(open) => {
        if (!open) setSelectedUser(null)
      }} />
    </div>
  )
}

export default UsersPage