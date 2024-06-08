'use client'
import { auth } from '@/utils/firestore';
import { signInWithCustomToken } from 'firebase/auth';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useEffect } from 'react'

function FirebaseAuthProvider ({
    children,
  }: {
    children: React.ReactNode;
  }) {
    
    const {data:session} = useSession()

    let authedUsers:Array<any>

    async function syncFirebaseAuth(session: Session) {
        if (session && session.firebaseToken) {
            try {
              if (session.user.email?.split('@')[1] == 'agmtechnology.com' || authedUsers.includes(session.user.email)) {
                await signInWithCustomToken(auth, session.firebaseToken)
              }
            } catch (error) {
                console.error('Failed to sign in.')
            }
        } else {
            auth.signOut()
        }
    }

    useEffect(() => {
        if (!session) return;

        syncFirebaseAuth(session)
    })

  return (
    <>{children}</>
  )
}

export default FirebaseAuthProvider