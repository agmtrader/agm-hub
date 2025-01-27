'use client'
import NoPermissionsPage from '@/components/misc/NoPermissionsPage';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import React from 'react'

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
    const role_endpoints = [
        {
            'role': 'user',
            'endpoints': []
        },
        {
            'role': 'trader',
            'endpoints': [
                'dashboard/trade-tickets/986431'
            ]
        }
    ]

    const role_endpoint = role_endpoints.find(role => role.endpoints.includes(pathname) && role.role === session?.user.role)

    if (!role_endpoint) {
        return <NoPermissionsPage/>
    }

    return (
        <>{children}</>
    )
}

export default RoleProvider