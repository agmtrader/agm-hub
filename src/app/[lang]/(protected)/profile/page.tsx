"use client"
import { Button } from '@/components/ui/button'
import { signIn, signOut, useSession } from 'next-auth/react'
import React from 'react'

import { Input } from "@/components/ui/input"
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from 'react'

const page = () => {
  const {data:session} = useSession()

  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  async function handleEmailChange() {
    if (session && newEmail) {
      //await updateFieldInDocument(`users/${session.user.id}`, 'email', newEmail)
      setIsEmailDialogOpen(false)
      setNewEmail('')
    }
  }

  async function handlePasswordChange() {
    if (session && currentPassword && newPassword && newPassword === confirmPassword) {
      //await updateFieldInDocument(`users/${session.user.id}`, 'password', newPassword)
      setIsPasswordDialogOpen(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }
  }

  console.log(session)

  return (
    <div className='w-full h-full gap-y-5 flex flex-col justify-center items-center'>
      <div className='flex items-center gap-5'>
        {session?.user.image ? 
          <Image className='rounded-full' src={session?.user.image} alt="User Avatar" width={100} height={100} /> 
          : 
          <div className='w-32 h-32 bg-gray-200 rounded-full' />
        }
        <p className='text-7xl font-bold'>{session?.user.name ? session?.user.name : 'No name'}</p>
      </div>
      
      <p className='text-xl font-semibold'>{session?.user.email ? session?.user.email : 'No email'}</p>
      <p className='text-xl'>{session?.user.role === 'admin' ? 'Admin' : 'User'}</p>

      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogTrigger asChild>
          <Button>{session?.user.email ? 'Change email' : 'Add email'}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Email</DialogTitle>
            <DialogDescription>
              Enter your new email address below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">New Email</label>
              <Input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>
            <Button onClick={handleEmailChange}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogTrigger asChild>
          <Button>Change password</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and new password below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Password</label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">New Password</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm New Password</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button onClick={handlePasswordChange}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Button onClick={() => signOut()}>Sign Out</Button>
    </div>
  )
}

export default page