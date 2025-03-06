'use client'
import React, { useEffect } from 'react'
import { getRecoveryData } from '@/utils/firebase/firestore'

type Props = {}

const page = (props: Props) => {
    useEffect(() => {
        const handleTest = async () => {
            try {
                const documentSnapshot = await getRecoveryData()
                console.log(documentSnapshot)
            } catch (error) {
                console.error('Error:', error)
            }
        }
        handleTest()
    }, [])

    return (
        <div>
        </div>
    )
}

export default page