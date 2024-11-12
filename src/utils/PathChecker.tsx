'use client'

import { usePathname, useRouter } from 'next/navigation'
import { changeLang } from "@/utils/lang"
import { useEffect } from 'react'

export function PathChecker() {
    
    const path = usePathname()
    const router = useRouter()
    
    useEffect(() => {
        if (!path.includes('/en') && !path.includes('/es')) {
            const newPath = changeLang('en', path)
            router.push(newPath)
        }
    }, [path, router])

    return null
}