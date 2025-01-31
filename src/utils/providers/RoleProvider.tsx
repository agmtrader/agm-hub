'use client'
import NoPermissionsPage from '@/components/misc/NoPermissionsPage';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { accessAPI } from '../api';

function RoleProvider ({
    children,
  }: {
    children: React.ReactNode;
  }) {

    const {data:session} = useSession()

    if (session?.user.role === 'admin') {
        return <>{children}</>
    }

    const pathname = usePathname().split('/').slice(2).join('/')
    const [endpoints, setEndpoints] = useState<any[]>([])

    useEffect(() => {
        async function fetchPermissions() {
            const response = await accessAPI('/database/read', 'POST', {
                'path':`db/permissions/endpoints`,
                'query':{
                    'UserID':session?.user.id
                }
            })
            if (response['status'] !== 'success') throw new Error('Failed to fetch permissions')
            setEndpoints(response['content'][0]['Endpoints'])
        }
        fetchPermissions()
    }, [session])

    const has_access = endpoints.find((endpoint: any) => endpoint === pathname);

    if (!has_access) {
        return <NoPermissionsPage/>
    }

    return (
        <>{children}</>
    )
}

export default RoleProvider