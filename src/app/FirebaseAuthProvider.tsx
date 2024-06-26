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

    async function syncFirebaseAuth(session: Session) {
        if (session && session.firebaseToken) {
            try {
                console.log(await auth.currentUser)
                await signInWithCustomToken(auth, session.firebaseToken)
            } catch (error) {
                console.error('Missing necessary credentials. Limiting user experience to client mode.')
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