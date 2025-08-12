'use client'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { User } from 'next-auth'
import React from 'react'
import UserCard from './UserCard'

interface Props {
  user: User | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

const UserDialog = ({ user, isOpen, onOpenChange }: Props) => {
  if (!user) return null
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <UserCard user={user} />
      </DialogContent>
    </Dialog>
  )
}

export default UserDialog