'use client'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { User } from 'next-auth'
import React, { useEffect, useState } from 'react'
import UserCard from './UserCard'
import { ReadUserByID } from '@/utils/entities/user'
import LoadingComponent from '@/components/misc/LoadingComponent'
import { toast } from '@/hooks/use-toast'

interface Props {
  userID: string | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

const UserDialog = ({ userID, isOpen, onOpenChange }: Props) => {

  const [user, setUser] = useState<User | null>(null)
  useEffect(() => {
    const fetchUser = async () => {
      if (!userID) return
      try {
        const user = await ReadUserByID(userID)
        setUser(user)
      } catch (error) {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to fetch user',
          variant: 'destructive'
        })
      }
    }
    fetchUser()
  }, [userID])

  if (!userID) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {user ? 
          <UserCard user={user} />
          : 
          <LoadingComponent />
      }
      </DialogContent>
    </Dialog>
  )
}

export default UserDialog